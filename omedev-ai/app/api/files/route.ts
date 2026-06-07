import { NextRequest } from 'next/server'
import { readFile, writeFile, readdir, stat, mkdir } from 'fs/promises'
import { join, extname, basename } from 'path'
import { tmpdir, homedir } from 'os'

export const runtime = 'nodejs'

const SAFE_BASE_DIR = join(tmpdir(), 'omedev-ai-workspace')

function sanitizePath(requestedPath: string): string {
  // Prevent path traversal attacks
  const normalized = join(SAFE_BASE_DIR, requestedPath.replace(/\.\./g, ''))
  if (!normalized.startsWith(SAFE_BASE_DIR)) {
    throw new Error('Chemin non autorisé')
  }
  return normalized
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const path = searchParams.get('path') || '/'

    await mkdir(SAFE_BASE_DIR, { recursive: true })
    const fullPath = sanitizePath(path)

    const stats = await stat(fullPath).catch(() => null)

    if (!stats) {
      // Return demo file structure if path doesn't exist
      return Response.json({
        files: [
          { name: 'workspace', path: '/', type: 'directory', children: [] },
        ],
      })
    }

    if (stats.isDirectory()) {
      const entries = await readdir(fullPath, { withFileTypes: true })
      const files = await Promise.all(
        entries.map(async (entry) => {
          const entryPath = join(path, entry.name)
          const entryStats = await stat(join(fullPath, entry.name)).catch(() => null)
          return {
            name: entry.name,
            path: entryPath,
            type: entry.isDirectory() ? 'directory' : 'file',
            size: entryStats?.size,
            extension: entry.isFile() ? extname(entry.name).slice(1) : undefined,
            modified: entryStats?.mtime,
          }
        })
      )
      return Response.json({ files })
    } else {
      const content = await readFile(fullPath, 'utf-8')
      return Response.json({
        name: basename(fullPath),
        path,
        type: 'file',
        content,
        size: stats.size,
        extension: extname(fullPath).slice(1),
        modified: stats.mtime,
      })
    }
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Erreur lecture fichier' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { path, content, name } = body

    if (!path || content === undefined) {
      return Response.json({ error: 'Chemin et contenu requis' }, { status: 400 })
    }

    await mkdir(SAFE_BASE_DIR, { recursive: true })
    const fullPath = sanitizePath(path)

    // Ensure parent directory exists
    const parentDir = join(fullPath, '..')
    await mkdir(parentDir, { recursive: true })

    await writeFile(fullPath, content, 'utf-8')

    return Response.json({
      success: true,
      message: `Fichier ${basename(fullPath)} sauvegardé avec succès`,
      path,
    })
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Erreur écriture fichier' },
      { status: 500 }
    )
  }
}
