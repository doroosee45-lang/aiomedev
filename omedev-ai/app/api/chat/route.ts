import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { CONVERSATION_MODES, AGENTS } from '@/types'
import { getLocalResponse } from '@/lib/localAI'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const runtime = 'nodejs'
export const maxDuration = 300

function streamLocalResponse(userMessage: string, mode: string): Response {
  const localReply = getLocalResponse(userMessage, mode)
  const words = localReply.split(' ')
  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'start', model: 'omedev-local' })}\n\n`))
      for (const word of words) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'text', content: word + ' ' })}\n\n`))
      }
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done', usage: { input_tokens: 0, output_tokens: words.length }, stopReason: 'end_turn' })}\n\n`))
      controller.close()
    },
  })
  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      messages,
      mode = 'general',
      agent,
      model = 'claude-opus-4-8',
      maxTokens = 32000,
      enableThinking = false,
    } = body

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Messages requis' }, { status: 400 })
    }

    // Extraire le dernier message utilisateur pour le fallback local
    const lastUserMessage: string = [...messages]
      .reverse()
      .find((m: { role: string; content: string }) => m.role === 'user')?.content || ''

    // Si pas de clé API valide → répondre directement depuis la mémoire locale
    const apiKey = process.env.ANTHROPIC_API_KEY || ''
    if (!apiKey || apiKey === 'your_anthropic_api_key_here' || !apiKey.startsWith('sk-')) {
      return streamLocalResponse(lastUserMessage, mode)
    }

    // Build system prompt from mode and agent
    let modeSystemPrompt = ''
    if (agent) {
      const agentConfig = AGENTS.find((a) => a.id === agent)
      if (agentConfig) modeSystemPrompt = agentConfig.systemPrompt
    } else {
      const modeConfig = CONVERSATION_MODES.find((m) => m.id === mode)
      if (modeConfig) modeSystemPrompt = modeConfig.systemPrompt
    }

    const fullSystemPrompt = `Tu es OMEDEV-AI, développé par OMEDEV SERVICES SARL — 75, avenue Kabambare, Kinshasa, République Démocratique du Congo.
Gérant: M. DORODORO Meya Osée | Email: oseedoro@gmail.com
Date actuelle: ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Tu utilises le format Markdown pour structurer tes réponses. Tu es précis, professionnel et bienveillant.

${modeSystemPrompt}`

    // Format messages for Anthropic API
    const formattedMessages: Anthropic.MessageParam[] = messages.map(
      (msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })
    )

    const useThinking =
      (model === 'claude-opus-4-8' || model === 'claude-sonnet-4-6') &&
      (enableThinking || ['autonomous', 'analyst', 'code'].includes(mode))

    // Build params — use unknown cast to add thinking without fighting SDK types
    const baseParams = {
      model,
      max_tokens: maxTokens,
      system: fullSystemPrompt,
      messages: formattedMessages,
      stream: true as const,
    }

    const streamParams = useThinking
      ? { ...baseParams, thinking: { type: 'adaptive' as const } }
      : baseParams

    const stream = client.messages.stream(
      streamParams as Anthropic.MessageStreamParams
    )

    // Return SSE stream
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta') {
              const delta = event.delta
              if (delta.type === 'text_delta') {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ type: 'text', content: delta.text })}\n\n`
                  )
                )
              } else if (delta.type === 'thinking_delta') {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ type: 'thinking', content: delta.thinking })}\n\n`
                  )
                )
              }
            } else if (event.type === 'message_start') {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: 'start', model: event.message.model })}\n\n`
                )
              )
            } else if (event.type === 'message_stop') {
              const finalMessage = await stream.finalMessage()
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: 'done',
                    usage: finalMessage.usage,
                    stopReason: finalMessage.stop_reason,
                  })}\n\n`
                )
              )
            }
          }
        } catch (error) {
          // Fallback : répondre depuis la mémoire locale quand Claude est indisponible
          try {
            const localReply = getLocalResponse(lastUserMessage, mode)
            const words = localReply.split(' ')
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'start', model: 'omedev-local' })}\n\n`))
            for (const word of words) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'text', content: word + ' ' })}\n\n`))
            }
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done', usage: { input_tokens: 0, output_tokens: words.length }, stopReason: 'end_turn' })}\n\n`))
          } catch {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: error instanceof Error ? error.message : 'Erreur de streaming' })}\n\n`))
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    if (error instanceof Anthropic.APIError) {
      return Response.json(
        { error: `Erreur API: ${error.message}`, status: error.status },
        { status: error.status || 500 }
      )
    }
    return Response.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function GET() {
  return Response.json({
    status: 'OMEDEV-AI Chat API v1.0.0',
    models: ['claude-opus-4-8', 'claude-sonnet-4-6', 'claude-haiku-4-5'],
    company: 'OMEDEV SERVICES SARL — Kinshasa, RDC',
  })
}
