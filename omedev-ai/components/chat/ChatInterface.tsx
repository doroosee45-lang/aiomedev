'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { MessageBubble } from './MessageBubble'
import { MessageInput } from './MessageInput'
import { estimateTokens, generateId } from '@/lib/utils'
import type { Attachment, ConversationMode } from '@/types'
import { CONVERSATION_MODES } from '@/types'
import { Bot, MessageSquare, Zap, Code2, Scale, GraduationCap, BarChart2, Cpu } from 'lucide-react'
import { motion } from 'framer-motion'

const MODE_ICONS: Record<ConversationMode, React.ComponentType<{ size?: number; className?: string }>> = {
  general: Bot,
  code: Code2,
  legal: Scale,
  formation: GraduationCap,
  analyst: BarChart2,
  autonomous: Cpu,
}

const WELCOME_SUGGESTIONS: Record<ConversationMode, string[]> = {
  general: [
    'Qu\'est-ce que l\'OHADA et comment affecte-t-il les entreprises en RDC ?',
    'Explique-moi les bases du Cloud Computing',
    'Comment créer une startup technologique à Kinshasa ?',
    'Quelles sont les opportunités digitales en Afrique centrale ?',
  ],
  code: [
    'Crée une API REST en Node.js avec Express et TypeScript',
    'Écris un script Python pour analyser un fichier CSV',
    'Génère un composant React avec TypeScript et Tailwind CSS',
    'Comment implémenter un système d\'authentification JWT ?',
  ],
  legal: [
    'Qu\'est-ce que l\'Acte Uniforme OHADA sur le droit des sociétés ?',
    'Rédige un contrat de prestation de services informatiques',
    'Quelles sont les obligations légales pour créer une SARL en RDC ?',
    'Explique le droit à la propriété intellectuelle pour les logiciels',
  ],
  formation: [
    'Crée un plan de cours sur le développement web pour débutants',
    'Explique les algorithmes de tri avec des exemples simples',
    'Génère un quiz sur les bases de données SQL',
    'Comment apprendre Python en 30 jours ?',
  ],
  analyst: [
    'Analyse les tendances du marché digital en Afrique 2024',
    'Génère une analyse SWOT pour une startup EdTech à Kinshasa',
    'Écris du code Python pour analyser ce dataset',
    'Compare les métriques KPI pour une application mobile',
  ],
  autonomous: [
    'Crée un projet complet Next.js avec authentification',
    'Automatise le déploiement d\'une application sur Docker',
    'Génère et exécute des tests unitaires pour ce code',
    'Analyse et refactorise ce codebase selon les bonnes pratiques',
  ],
}

export function ChatInterface() {
  const {
    getActiveConversation,
    activeConversationId,
    addMessage,
    updateStreamingMessage,
    finalizeStreamingMessage,
    createConversation,
    isStreaming,
    setIsStreaming,
    settings,
  } = useAppStore()

  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const [abortController, setAbortController] = useState<AbortController | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)

  const conversation = getActiveConversation()
  const messages = conversation?.messages || []

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, autoScroll])

  // Detect manual scroll
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100
    setAutoScroll(isAtBottom)
  }, [])

  const handleSend = useCallback(
    async (content: string, attachments?: Attachment[]) => {
      if (!content.trim() && !attachments?.length) return
      if (isStreaming) return

      // Create conversation if none active
      let convId = activeConversationId
      if (!convId) {
        const conv = createConversation(settings.defaultMode as ConversationMode)
        convId = conv.id
      }

      const currentConversation = getActiveConversation()

      // Add user message
      const userMsg = addMessage(convId, {
        role: 'user',
        content,
        mode: currentConversation?.mode || (settings.defaultMode as ConversationMode),
        attachments,
      })

      // Create assistant placeholder message
      const assistantMsg = addMessage(convId, {
        role: 'assistant',
        content: '',
        mode: currentConversation?.mode || (settings.defaultMode as ConversationMode),
        agent: currentConversation?.agent,
        isStreaming: true,
      })

      setStreamingMessageId(assistantMsg.id)
      setIsStreaming(true)

      const abort = new AbortController()
      setAbortController(abort)

      try {
        // Build message history for API
        const allMessages = [...(currentConversation?.messages || []), userMsg]
        const apiMessages = allMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })).filter(msg => msg.role !== 'system')

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: apiMessages,
            mode: currentConversation?.mode || settings.defaultMode,
            agent: currentConversation?.agent,
            model: settings.defaultModel,
            maxTokens: settings.maxTokens,
            enableThinking: settings.showThinking,
          }),
          signal: abort.signal,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Erreur API')
        }

        const reader = response.body?.getReader()
        if (!reader) throw new Error('Stream non disponible')

        const decoder = new TextDecoder()
        let accumulatedContent = ''
        let thinkingContent = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue

            try {
              const data = JSON.parse(line.slice(6))

              if (data.type === 'text') {
                accumulatedContent += data.content
                updateStreamingMessage(convId!, assistantMsg.id, accumulatedContent)
              } else if (data.type === 'thinking') {
                thinkingContent += data.content
              } else if (data.type === 'done') {
                // Finalize message with token count
                const tokenCount = estimateTokens(accumulatedContent)
                finalizeStreamingMessage(convId!, assistantMsg.id)

                // Update with thinking if present
                if (thinkingContent && settings.showThinking) {
                  updateStreamingMessage(convId!, assistantMsg.id, accumulatedContent)
                }
              } else if (data.type === 'error') {
                throw new Error(data.error)
              }
            } catch (parseError) {
              // Skip malformed SSE lines
            }
          }
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
          // User stopped generation
          finalizeStreamingMessage(convId!, assistantMsg.id)
        } else {
          const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
          updateStreamingMessage(
            convId!,
            assistantMsg.id,
            `❌ **Erreur:** ${errorMessage}\n\nVérifiez votre clé API ANTHROPIC dans le fichier \`.env.local\`.`
          )
          finalizeStreamingMessage(convId!, assistantMsg.id)
        }
      } finally {
        setIsStreaming(false)
        setStreamingMessageId(null)
        setAbortController(null)
      }
    },
    [
      activeConversationId,
      isStreaming,
      createConversation,
      addMessage,
      updateStreamingMessage,
      finalizeStreamingMessage,
      getActiveConversation,
      settings,
      setIsStreaming,
    ]
  )

  const handleStop = useCallback(() => {
    abortController?.abort()
  }, [abortController])

  const handleRegenerate = useCallback(() => {
    if (!conversation || messages.length < 2) return

    // Find last user message
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')
    if (!lastUserMsg) return

    // Remove last assistant message
    const lastAssistantIdx = messages.length - 1
    if (messages[lastAssistantIdx]?.role === 'assistant') {
      handleSend(lastUserMsg.content)
    }
  }, [conversation, messages, handleSend])

  const handleExecuteCode = useCallback(async (code: string, language: string) => {
    // Execute code via API
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      })
      const result = await response.json()
      return result
    } catch {
      return { success: false, error: 'Erreur d\'exécution', output: '' }
    }
  }, [])

  // Welcome screen when no messages
  if (!conversation || messages.length === 0) {
    const currentMode = (conversation?.mode || settings.defaultMode) as ConversationMode
    const modeConfig = CONVERSATION_MODES.find((m) => m.id === currentMode)
    const suggestions = WELCOME_SUGGESTIONS[currentMode] || WELCOME_SUGGESTIONS.general
    const ModeIcon = MODE_ICONS[currentMode] || Bot

    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl w-full"
          >
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 omedev-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-omedev-green/20">
                <ModeIcon size={24} className="text-white sm:hidden" />
                <ModeIcon size={30} className="text-white hidden sm:block" />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Bonjour ! Je suis{' '}
              <span className="omedev-gradient-text">OMEDEV-AI</span>
            </h2>
            <p className="text-muted-foreground mb-2">
              {modeConfig?.description || 'Assistant IA professionnel développé par OMEDEV SERVICES SARL'}
            </p>
            <p className="text-xs text-muted-foreground/60 mb-8">
              Mode actif: <span className="text-foreground/60">{modeConfig?.name}</span>
              {' · '}
              Modèle: <span className="text-foreground/60">{settings.defaultModel}</span>
            </p>

            {/* Suggestions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              {suggestions.map((suggestion, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  onClick={() => handleSend(suggestion)}
                  className="text-left p-3 bg-card hover:bg-accent border border-border hover:border-omedev-green/30 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-all group"
                >
                  <span className="group-hover:text-foreground">{suggestion}</span>
                </motion.button>
              ))}
            </div>

            {/* Mode indicators */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 sm:mt-8">
              {CONVERSATION_MODES.map((mode) => (
                <span
                  key={mode.id}
                  className={`text-xs px-2.5 py-1 rounded-full border ${
                    mode.id === currentMode
                      ? 'bg-omedev-green/10 text-omedev-green border-omedev-green/30'
                      : 'bg-transparent text-muted-foreground border-border'
                  }`}
                >
                  {mode.icon} {mode.name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <MessageInput
          onSend={handleSend}
          onStop={handleStop}
          isStreaming={isStreaming}
          disabled={false}
        />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6"
      >
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            onRegenerate={
              index === messages.length - 1 && message.role === 'assistant'
                ? handleRegenerate
                : undefined
            }
            onExecuteCode={handleExecuteCode}
          />
        ))}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {!autoScroll && (
        <div className="absolute bottom-28 right-6">
          <button
            onClick={() => {
              setAutoScroll(true)
              messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="p-2 bg-omedev-green text-white rounded-full shadow-lg hover:bg-omedev-green-dark transition-colors"
          >
            ↓
          </button>
        </div>
      )}

      {/* Input */}
      <MessageInput
        onSend={handleSend}
        onStop={handleStop}
        isStreaming={isStreaming}
        disabled={false}
      />
    </div>
  )
}
