'use client'

import { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Copy, Check, RotateCcw, ThumbsUp, ThumbsDown, Brain, ChevronDown, ChevronRight } from 'lucide-react'
import { cn, formatRelativeTime } from '@/lib/utils'
import type { Message } from '@/types'
import { CONVERSATION_MODES, AGENTS } from '@/types'
import { CodeBlock } from '@/components/ui/CodeBlock'

interface MessageBubbleProps {
  message: Message
  onRegenerate?: () => void
  onExecuteCode?: (code: string, language: string) => void
}

export function MessageBubble({ message, onRegenerate, onExecuteCode }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const [showThinking, setShowThinking] = useState(false)
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)

  const isUser = message.role === 'user'
  const isStreaming = message.isStreaming

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [message.content])

  // Get mode/agent display info
  const modeConfig = message.mode
    ? CONVERSATION_MODES.find((m) => m.id === message.mode)
    : null
  const agentConfig = message.agent
    ? AGENTS.find((a) => a.id === message.agent)
    : null

  if (isUser) {
    return (
      <div className="flex justify-end group animate-fadeInUp">
        <div className="flex flex-col items-end gap-1 max-w-[80%]">
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-end mb-1">
              {message.attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-omedev-green/20 rounded-lg text-xs text-omedev-green"
                >
                  <span>📎</span>
                  <span>{att.name}</span>
                </div>
              ))}
            </div>
          )}

          <div className="message-user">
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
          </div>

          <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity pr-1">
            {formatRelativeTime(new Date(message.timestamp))}
          </p>
        </div>
      </div>
    )
  }

  // Assistant message
  return (
    <div className="flex gap-3 group animate-fadeInUp">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 omedev-gradient rounded-xl flex items-center justify-center text-white font-bold text-sm mt-0.5">
        {agentConfig ? agentConfig.icon : modeConfig?.icon || '🤖'}
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        {/* Header */}
        <div className="flex items-center gap-2 -mb-1">
          <span className="text-xs font-semibold text-omedev-green">
            {agentConfig?.name || modeConfig?.name || 'OMEDEV-AI'}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(new Date(message.timestamp))}
          </span>
          {isStreaming && (
            <span className="text-xs text-omedev-green animate-pulse">● Génération...</span>
          )}
        </div>

        {/* Thinking block */}
        {message.thinking && (
          <div className="thinking-block">
            <button
              onClick={() => setShowThinking(!showThinking)}
              className="flex items-center gap-1.5 text-xs font-medium text-omedev-green/80 hover:text-omedev-green"
            >
              <Brain size={13} />
              <span>Raisonnement (pensée adaptative)</span>
              {showThinking ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            </button>
            {showThinking && (
              <div className="mt-2 text-xs text-foreground/60 whitespace-pre-wrap leading-relaxed">
                {message.thinking}
              </div>
            )}
          </div>
        )}

        {/* Message content */}
        <div className={cn(
          'message-assistant',
          isStreaming && 'streaming-cursor'
        )}>
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  const language = match ? match[1] : 'text'
                  const code = String(children).replace(/\n$/, '')
                  const isBlock = code.includes('\n') || (node?.position?.start?.line !== node?.position?.end?.line)

                  if (isBlock || match) {
                    return (
                      <CodeBlock
                        code={code}
                        language={language}
                        onExecute={onExecuteCode}
                      />
                    )
                  }

                  return (
                    <code
                      className="bg-muted px-1.5 py-0.5 rounded text-omedev-green font-mono text-xs"
                      {...props}
                    >
                      {children}
                    </code>
                  )
                },
                pre({ children }) {
                  return <>{children}</>
                },
                a({ href, children }) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-omedev-green hover:text-omedev-green-light underline underline-offset-2"
                    >
                      {children}
                    </a>
                  )
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto my-3">
                      <table className="w-full border-collapse text-sm">{children}</table>
                    </div>
                  )
                },
                blockquote({ children }) {
                  return (
                    <blockquote className="border-l-4 border-omedev-green/50 pl-4 py-1 my-3 bg-omedev-green/5 rounded-r-lg italic text-foreground/70">
                      {children}
                    </blockquote>
                  )
                },
              }}
            >
              {message.content || (isStreaming ? '' : '...')}
            </ReactMarkdown>
          </div>
        </div>

        {/* Actions */}
        {!isStreaming && message.content && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Copier"
            >
              {copied ? (
                <><Check size={12} className="text-omedev-green" /><span className="text-omedev-green">Copié</span></>
              ) : (
                <><Copy size={12} /><span>Copier</span></>
              )}
            </button>

            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                title="Régénérer"
              >
                <RotateCcw size={12} />
                <span>Régénérer</span>
              </button>
            )}

            <div className="flex items-center gap-0.5 ml-2">
              <button
                onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                className={cn(
                  'p-1 rounded-lg transition-colors',
                  feedback === 'up'
                    ? 'text-omedev-green bg-omedev-green/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <ThumbsUp size={12} />
              </button>
              <button
                onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                className={cn(
                  'p-1 rounded-lg transition-colors',
                  feedback === 'down'
                    ? 'text-red-400 bg-red-400/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <ThumbsDown size={12} />
              </button>
            </div>

            {message.tokens && (
              <span className="ml-auto text-xs text-muted-foreground/50">
                ~{message.tokens} tokens
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
