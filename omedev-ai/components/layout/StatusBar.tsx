'use client'

import { useAppStore } from '@/lib/store'
import { cn, formatTokenCount } from '@/lib/utils'
import { MODELS } from '@/types'
import { Wifi, WifiOff, Zap, Clock, Hash } from 'lucide-react'

export function StatusBar() {
  const { getActiveConversation, isStreaming, settings } = useAppStore()
  const conversation = getActiveConversation()
  const model = MODELS.find((m) => m.id === settings.defaultModel)

  const totalTokens = conversation?.messages.reduce(
    (sum, msg) => sum + (msg.tokens || 0),
    0
  ) || 0

  const messageCount = conversation?.messages.length || 0

  return (
    <div className="flex items-center justify-between px-4 py-1.5 border-t border-border bg-card/50 text-xs text-muted-foreground">
      <div className="flex items-center gap-4">
        {/* Status indicator */}
        <div className="flex items-center gap-1.5">
          {isStreaming ? (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-omedev-green animate-pulse" />
              <span className="text-omedev-green">Génération en cours...</span>
            </>
          ) : (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Prêt</span>
            </>
          )}
        </div>

        {/* Model info */}
        <div className="flex items-center gap-1">
          <Zap size={11} />
          <span>{model?.name?.split(' ').slice(0, 3).join(' ') || 'Claude Opus'}</span>
        </div>

        {/* Message count */}
        {messageCount > 0 && (
          <div className="flex items-center gap-1">
            <Hash size={11} />
            <span>{messageCount} messages</span>
          </div>
        )}

        {/* Token count */}
        {totalTokens > 0 && (
          <div className="flex items-center gap-1">
            <Clock size={11} />
            <span>~{formatTokenCount(totalTokens)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Mode indicator */}
        {conversation?.mode && (
          <span className="hidden sm:inline">
            Mode: <span className="text-foreground/70">{conversation.mode}</span>
          </span>
        )}

        {/* OMEDEV branding */}
        <span className="hidden md:inline text-muted-foreground/60">
          OMEDEV SERVICES SARL · Kinshasa, RDC
        </span>

        {/* Connection status */}
        <div className="flex items-center gap-1">
          <Wifi size={11} className="text-emerald-500" />
          <span>En ligne</span>
        </div>
      </div>
    </div>
  )
}
