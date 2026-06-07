/**
 * OMEDEV-AI — Proxy Chat vers Backend Express
 * Frontend → /api/chat → Backend :5000/api/agent/chat → Ollama/Claude
 */
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 300

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Proxy vers le backend Express (streaming SSE)
    const backendRes = await fetch(`${BACKEND_URL}/api/agent/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(body),
      // @ts-ignore — Node.js fetch supporte le duplex
      duplex: 'half',
    })

    if (!backendRes.ok) {
      const err = await backendRes.json().catch(() => ({ error: `Backend error ${backendRes.status}` }))
      return Response.json({ error: err.error || 'Erreur backend' }, { status: backendRes.status })
    }

    // Pass-through du stream SSE
    return new Response(backendRes.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (error) {
    console.error('Chat proxy error:', error)

    // Fallback: réponse locale si le backend est hors ligne
    const body = await req.json().catch(() => ({}))
    const lastMsg = (body.messages || []).reverse().find((m: { role: string }) => m.role === 'user')?.content || ''
    const mode = body.mode || 'general'

    const fallbackText = `⚠️ **Backend hors ligne** — Démarrez le serveur pour utiliser l'IA locale.

**Message reçu:** ${lastMsg.slice(0, 100)}...

**Pour démarrer le backend:**
\`\`\`bash
cd backend
npm start
\`\`\`

**Moteur IA actif une fois démarré:** Ollama (local, gratuit, privé) → Claude → Demo

*Mode: ${mode} · OMEDEV-AI v2.0*`

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'start', model: 'fallback' })}\n\n`))
        const words = fallbackText.split(/(\s+)/)
        for (const w of words) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'text', content: w })}\n\n`))
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done', engine: 'fallback' })}\n\n`))
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  }
}

export async function GET() {
  try {
    const status = await fetch(`${BACKEND_URL}/api/agent/engine/status`, { signal: AbortSignal.timeout(3000) })
    const data = await status.json()
    return Response.json({ status: 'OMEDEV-AI Chat Proxy', backend: BACKEND_URL, engine: data.data })
  } catch {
    return Response.json({ status: 'OMEDEV-AI Chat Proxy', backend: BACKEND_URL, backendStatus: 'offline' })
  }
}
