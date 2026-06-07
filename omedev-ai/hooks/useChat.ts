'use client'

import { useCallback, useRef, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { generateId, estimateTokens } from '@/lib/utils'
import type { Attachment, ConversationMode } from '@/types'

export function useChat() {
  const {
    activeConversationId,
    getActiveConversation,
    addMessage,
    updateStreamingMessage,
    finalizeStreamingMessage,
    createConversation,
    setIsStreaming,
    settings,
    isStreaming,
  } = useAppStore()

  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(
    async (content: string, attachments?: Attachment[]) => {
      if (!content.trim() && !attachments?.length) return
      if (isStreaming) return

      setError(null)

      let convId = activeConversationId
      if (!convId) {
        const conv = createConversation(settings.defaultMode as ConversationMode)
        convId = conv.id
      }

      const currentConv = getActiveConversation()

      // Add user message
      const userMsg = addMessage(convId, {
        role: 'user',
        content,
        mode: currentConv?.mode || (settings.defaultMode as ConversationMode),
        attachments,
        tokens: estimateTokens(content),
      })

      // Add streaming placeholder for assistant
      const assistantMsg = addMessage(convId, {
        role: 'assistant',
        content: '',
        mode: currentConv?.mode || (settings.defaultMode as ConversationMode),
        agent: currentConv?.agent,
        isStreaming: true,
      })

      setIsStreaming(true)

      const abort = new AbortController()
      abortRef.current = abort

      try {
        const allMessages = [...(currentConv?.messages || []), userMsg]
        const apiMessages = allMessages
          .filter((m) => m.role !== 'system')
          .map((m) => ({ role: m.role, content: m.content }))

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: apiMessages,
            mode: currentConv?.mode || settings.defaultMode,
            agent: currentConv?.agent,
            model: settings.defaultModel,
            maxTokens: settings.maxTokens,
            enableThinking: settings.showThinking,
          }),
          signal: abort.signal,
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || `HTTP ${res.status}`)
        }

        const reader = res.body?.getReader()
        if (!reader) throw new Error('Stream non disponible')

        const decoder = new TextDecoder()
        let accumulated = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const lines = decoder.decode(value, { stream: true }).split('\n')
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            try {
              const data = JSON.parse(line.slice(6))
              if (data.type === 'text') {
                accumulated += data.content
                updateStreamingMessage(convId!, assistantMsg.id, accumulated)
              } else if (data.type === 'done') {
                finalizeStreamingMessage(convId!, assistantMsg.id)
              } else if (data.type === 'error') {
                throw new Error(data.error)
              }
            } catch {
              // skip malformed lines
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          finalizeStreamingMessage(convId!, assistantMsg.id)
        } else {
          const msg = err instanceof Error ? err.message : 'Erreur inconnue'
          setError(msg)
          updateStreamingMessage(
            convId!,
            assistantMsg.id,
            `❌ **Erreur:** ${msg}\n\nVérifiez votre clé API dans \`.env.local\`.`
          )
          finalizeStreamingMessage(convId!, assistantMsg.id)
        }
      } finally {
        setIsStreaming(false)
        abortRef.current = null
      }
    },
    [
      activeConversationId,
      isStreaming,
      createConversation,
      getActiveConversation,
      addMessage,
      updateStreamingMessage,
      finalizeStreamingMessage,
      setIsStreaming,
      settings,
    ]
  )

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return { sendMessage, stopGeneration, error, isStreaming }
}
