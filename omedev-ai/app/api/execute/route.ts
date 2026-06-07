import { NextRequest } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import { v4 as uuidv4 } from 'uuid'

const execAsync = promisify(exec)

export const runtime = 'nodejs'
export const maxDuration = 30

const SUPPORTED_LANGUAGES = {
  javascript: { ext: '.js', cmd: 'node' },
  typescript: { ext: '.ts', cmd: 'npx ts-node --esm' },
  python: { ext: '.py', cmd: 'python3' },
  bash: { ext: '.sh', cmd: 'bash' },
  sh: { ext: '.sh', cmd: 'bash' },
}

const MAX_OUTPUT_LENGTH = 10000
const EXECUTION_TIMEOUT = 15000 // 15 seconds

export async function POST(req: NextRequest) {
  const startTime = Date.now()

  try {
    const body = await req.json()
    const { code, language = 'javascript', stdin = '' } = body

    if (!code || typeof code !== 'string') {
      return Response.json({ error: 'Code requis' }, { status: 400 })
    }

    const langConfig = SUPPORTED_LANGUAGES[language as keyof typeof SUPPORTED_LANGUAGES]

    if (!langConfig) {
      return Response.json(
        {
          error: `Langage non supporté: ${language}. Langages supportés: ${Object.keys(SUPPORTED_LANGUAGES).join(', ')}`,
        },
        { status: 400 }
      )
    }

    // Security checks - prevent dangerous operations
    const dangerousPatterns = [
      /process\.exit/,
      /require\(['"]fs['"]\).*(?:unlink|rmdir|rm)/,
      /exec\s*\(/,
      /spawn\s*\(/,
      /child_process/,
      /eval\s*\(/,
      /Function\s*\(/,
      /\bsudo\b/,
      /\brm\s+-rf\b/,
      /\bformat\b.*\b\/dev\b/,
      /\bdel\s+\/[sf]\b/i,
    ]

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        return Response.json(
          {
            success: false,
            output: '',
            error: '⚠️ Code refusé: Opération potentiellement dangereuse détectée.',
            exitCode: -1,
            duration: 0,
            language,
          },
          { status: 403 }
        )
      }
    }

    // Create temp directory and file
    const sessionId = uuidv4()
    const tempDir = join(tmpdir(), 'omedev-ai', sessionId)
    await mkdir(tempDir, { recursive: true })

    const filename = `code${langConfig.ext}`
    const filepath = join(tempDir, filename)

    await writeFile(filepath, code, 'utf-8')

    let stdout = ''
    let stderr = ''
    let exitCode = 0

    try {
      const { stdout: out, stderr: err } = await execAsync(
        `${langConfig.cmd} "${filepath}"`,
        {
          timeout: EXECUTION_TIMEOUT,
          maxBuffer: 1024 * 1024, // 1MB
          cwd: tempDir,
          env: {
            ...process.env,
            NODE_ENV: 'test' as const,
            SANDBOX: '1',
          },
        }
      )

      stdout = out
      stderr = err
    } catch (execError: unknown) {
      const err = execError as { stdout?: string; stderr?: string; code?: number; killed?: boolean }
      stdout = err.stdout || ''
      stderr = err.stderr || ''
      exitCode = err.code || 1

      if (err.killed) {
        stderr = `⚠️ Timeout: L'exécution a dépassé ${EXECUTION_TIMEOUT / 1000}s\n` + stderr
        exitCode = 124
      }
    }

    // Cleanup
    try {
      await unlink(filepath)
    } catch {
      // Ignore cleanup errors
    }

    const duration = Date.now() - startTime

    // Truncate output if too long
    const truncate = (text: string) => {
      if (text.length > MAX_OUTPUT_LENGTH) {
        return text.slice(0, MAX_OUTPUT_LENGTH) + '\n\n[... Sortie tronquée ...]'
      }
      return text
    }

    return Response.json({
      success: exitCode === 0,
      output: truncate(stdout),
      error: truncate(stderr),
      exitCode,
      duration,
      language,
    })
  } catch (error) {
    console.error('Execute API error:', error)
    return Response.json(
      {
        success: false,
        output: '',
        error: `Erreur d'exécution: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        exitCode: -1,
        duration: Date.now() - startTime,
        language: 'unknown',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return Response.json({
    status: 'OMEDEV-AI Code Execution API',
    version: '1.0.0',
    supportedLanguages: Object.keys(SUPPORTED_LANGUAGES),
    timeout: `${EXECUTION_TIMEOUT / 1000}s`,
    maxOutputLength: MAX_OUTPUT_LENGTH,
  })
}
