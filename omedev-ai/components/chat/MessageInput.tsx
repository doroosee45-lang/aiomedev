'use client'

import {
  useState,
  useRef,
  useCallback,
  KeyboardEvent,
  ChangeEvent,
} from 'react'
import {
  Send,
  Square,
  Paperclip,
  Mic,
  Image,
  Globe,
  Code2,
  ChevronUp,
  X,
  Brain,
} from 'lucide-react'
import { cn, isSupportedFileType, generateId } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import type { Attachment } from '@/types'

interface MessageInputProps {
  onSend: (content: string, attachments?: Attachment[]) => void
  onStop?: () => void
  disabled?: boolean
  isStreaming?: boolean
  placeholder?: string
}

const QUICK_PROMPTS = [
  { label: '📝 Résume', prompt: 'Résume le sujet suivant en 3 points clés:' },
  { label: '🔍 Explique', prompt: 'Explique-moi de manière simple:' },
  { label: '💡 Analyse', prompt: 'Analyse et donne tes recommandations sur:' },
  { label: '🐛 Débugue', prompt: 'Trouve et corrige les erreurs dans ce code:' },
  { label: '📊 Compare', prompt: 'Compare les avantages et inconvénients de:' },
  { label: '⚖️ Droit OHADA', prompt: 'Explique la réglementation OHADA concernant:' },
]

export function MessageInput({
  onSend,
  onStop,
  disabled,
  isStreaming,
  placeholder = 'Posez votre question ou décrivez votre tâche... (Entrée pour envoyer, Maj+Entrée pour nouvelle ligne)',
}: MessageInputProps) {
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [showQuickPrompts, setShowQuickPrompts] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { settings } = useAppStore()

  const handleInput = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)

    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const scrollHeight = textareaRef.current.scrollHeight
      const maxHeight = isExpanded ? 400 : 200
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`
    }
  }, [isExpanded])

  const handleSend = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed && attachments.length === 0) return
    if (isStreaming) return

    onSend(trimmed, attachments.length > 0 ? attachments : undefined)
    setInput('')
    setAttachments([])

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [input, attachments, isStreaming, onSend])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && settings.sendOnEnter) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend, settings.sendOnEnter]
  )

  const handleFileUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])

      for (const file of files) {
        if (!isSupportedFileType(file.type) && !file.type.startsWith('image/')) {
          continue
        }

        const reader = new FileReader()
        reader.onload = (event) => {
          const attachment: Attachment = {
            id: generateId(),
            name: file.name,
            type: file.type,
            size: file.size,
            content: event.target?.result as string,
          }
          setAttachments((prev) => [...prev, attachment])
        }

        if (file.type.startsWith('image/')) {
          reader.readAsDataURL(file)
        } else {
          reader.readAsText(file)
        }
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    []
  )

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const applyQuickPrompt = useCallback((prompt: string) => {
    setInput(prompt + ' ')
    setShowQuickPrompts(false)
    textareaRef.current?.focus()
  }, [])

  const charCount = input.length
  const isOverLimit = charCount > 50000

  return (
    <div className="border-t border-border bg-card/50 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3">
      {/* Quick Prompts */}
      {showQuickPrompts && (
        <div className="flex flex-wrap gap-2 mb-3 p-2 bg-background rounded-xl border border-border">
          {QUICK_PROMPTS.map((qp) => (
            <button
              key={qp.label}
              onClick={() => applyQuickPrompt(qp.prompt)}
              className="px-3 py-1.5 text-xs bg-card hover:bg-accent border border-border rounded-full transition-colors text-foreground"
            >
              {qp.label}
            </button>
          ))}
        </div>
      )}

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-omedev-green/10 border border-omedev-green/30 rounded-lg text-xs"
            >
              {att.type.startsWith('image/') ? (
                <Image size={12} className="text-omedev-green" />
              ) : (
                <Paperclip size={12} className="text-omedev-green" />
              )}
              <span className="text-foreground max-w-[100px] sm:max-w-[150px] truncate">{att.name}</span>
              <button
                onClick={() => removeAttachment(att.id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main input area */}
      <div className={cn(
        'relative flex flex-col bg-background border border-border rounded-2xl transition-all',
        'focus-within:border-omedev-green/50 focus-within:ring-2 focus-within:ring-omedev-green/20',
        isOverLimit && 'border-destructive'
      )}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            'w-full bg-transparent px-4 pt-3 pb-2 text-sm resize-none outline-none',
            'placeholder:text-muted-foreground text-foreground leading-relaxed',
            'min-h-[52px] max-h-[200px]',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          style={{ fontSize: `${settings.fontSize}px` }}
        />

        {/* Bottom toolbar */}
        <div className="flex items-center gap-1 px-2 pb-2">
          {/* Left tools */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Joindre un fichier"
              disabled={disabled}
            >
              <Paperclip size={15} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              accept=".txt,.md,.json,.ts,.tsx,.js,.jsx,.py,.java,.rs,.go,.sql,.html,.css,.pdf,image/*"
              onChange={handleFileUpload}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Joindre une image"
              disabled={disabled}
            >
              <Image size={15} />
            </button>

            <button
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Recherche web"
              disabled={disabled}
            >
              <Globe size={15} />
            </button>

            <button
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Mode code"
              disabled={disabled}
            >
              <Code2 size={15} />
            </button>

            <div className="w-px h-4 bg-border mx-1" />

            <button
              onClick={() => setShowQuickPrompts(!showQuickPrompts)}
              className={cn(
                'p-1.5 rounded-lg transition-colors text-xs font-medium',
                showQuickPrompts
                  ? 'text-omedev-green bg-omedev-green/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
              title="Prompts rapides"
            >
              <ChevronUp size={15} className={cn('transition-transform', showQuickPrompts && 'rotate-180')} />
            </button>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Character count */}
          {charCount > 1000 && (
            <span className={cn(
              'text-xs px-1',
              isOverLimit ? 'text-destructive' : 'text-muted-foreground'
            )}>
              {charCount.toLocaleString()}
            </span>
          )}

          {/* Send / Stop button */}
          {isStreaming ? (
            <button
              onClick={onStop}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border border-destructive/30 rounded-xl text-xs font-medium transition-colors"
              title="Arrêter la génération"
            >
              <Square size={13} fill="currentColor" />
              <span>Arrêter</span>
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={(!input.trim() && attachments.length === 0) || disabled || isOverLimit}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
                input.trim() || attachments.length > 0
                  ? 'bg-omedev-green hover:bg-omedev-green-dark text-white shadow-sm shadow-omedev-green/20'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
              title="Envoyer (Entrée)"
            >
              <Send size={13} />
              <span>Envoyer</span>
            </button>
          )}
        </div>
      </div>

      {/* Keyboard hint */}
      <p className="hidden sm:block text-xs text-muted-foreground/50 text-center mt-2">
        {settings.sendOnEnter ? '↵ Entrée pour envoyer · ⇧+Entrée pour nouvelle ligne' : '⇧+Entrée pour envoyer'}
        &nbsp;·&nbsp;
        <span className="text-omedev-green/60">OMEDEV-AI v1.0</span>
        &nbsp;·&nbsp;
        <span>Propulsé par Claude {settings.defaultModel.includes('opus') ? 'Opus 4.8' : settings.defaultModel.includes('sonnet') ? 'Sonnet 4.6' : 'Haiku 4.5'}</span>
      </p>
    </div>
  )
}
