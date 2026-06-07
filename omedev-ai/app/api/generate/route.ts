/**
 * OMEDEV-AI — Proxy Génération Documents vers Backend
 * Frontend → /api/generate → Backend :5000/api/documents/generate
 */
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 120

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, templateId, context, title, language = 'fr', data } = body

    // Mapper les anciens types vers les nouveaux
    const typeMap: Record<string, string> = {
      'cahier-charges': 'cdc',
      'contrat': 'contract_sarl',
      'rapport': 'report',
      'proposition': 'business_proposal',
      'invoice': 'invoice',
      'letter': 'report',
    }

    const resolvedType = typeMap[type] || type || templateId || 'report'

    // Données à envoyer au backend
    const payload = {
      type: resolvedType,
      templateId: resolvedType,
      title: title || `Document — ${resolvedType}`,
      data: data || {
        nomProjet: title,
        contexte: context,
        client: 'Client OMEDEV',
        language,
      },
    }

    const backendRes = await fetch(`${BACKEND_URL}/api/documents/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!backendRes.ok) {
      // Fallback: générer via le chat agent
      const chatRes = await fetch(`${BACKEND_URL}/api/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Génère un document professionnel de type "${resolvedType}" avec le titre "${title || 'Document'}".\n\nContexte:\n${context || 'À définir'}\n\nFormat: Markdown complet, professionnel, conforme aux standards OHADA/RDC.`
          }],
          mode: resolvedType === 'cdc' ? 'cahier' : resolvedType === 'report' ? 'analyst' : 'legal',
          language,
        }),
      })

      // Collecter le stream
      let content = ''
      const reader = chatRes.body?.getReader()
      if (reader) {
        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const lines = decoder.decode(value).split('\n')
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            try {
              const d = JSON.parse(line.slice(6))
              if (d.type === 'text') content += d.content
            } catch { /* skip */ }
          }
        }
      }

      return Response.json({
        success: true,
        content,
        type: resolvedType,
        title: title || `Document ${resolvedType}`,
        generatedAt: new Date().toISOString(),
      })
    }

    const result = await backendRes.json()
    return Response.json({
      success: true,
      content: result.data?.content || result.content || '',
      type: resolvedType,
      title: title || `Document ${resolvedType}`,
      generatedAt: new Date().toISOString(),
      tokens: result.data?.wordCount || 0,
    })
  } catch (error) {
    console.error('Generate proxy error:', error)
    return Response.json(
      { error: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}. Vérifiez que le backend est démarré.` },
      { status: 500 }
    )
  }
}

export async function GET() {
  return Response.json({
    status: 'OMEDEV-AI Document Generation Proxy',
    backend: BACKEND_URL,
    types: ['cdc', 'spec_technique', 'architecture', 'user_stories', 'contrat', 'rapport', 'proposition', 'invoice'],
  })
}
