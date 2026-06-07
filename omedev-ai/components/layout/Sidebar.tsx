'use client'

import { useState, useCallback, Suspense, lazy } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  MessageSquare,
  Pin,
  Trash2,
  ChevronDown,
  Settings,
  BookOpen,
  Zap,
  Bot,
  Star,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { cn, formatRelativeTime, truncateText } from '@/lib/utils'
import type { ConversationMode } from '@/types'
import { CONVERSATION_MODES } from '@/types'

const SettingsModal = lazy(() =>
  import('@/components/ui/SettingsModal').then((m) => ({ default: m.SettingsModal }))
)

const MODE_ICONS: Record<ConversationMode, string> = {
  general: '💬',
  code: '💻',
  legal: '⚖️',
  formation: '🎓',
  analyst: '📊',
  autonomous: '🤖',
}

export function Sidebar() {
  const {
    conversations,
    activeConversationId,
    createConversation,
    setActiveConversation,
    deleteConversation,
    pinConversation,
    settings,
    setRightPanelOpen,
    setRightPanelTab,
    toggleSidebar,
  } = useAppStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [showModeMenu, setShowModeMenu] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showDocs, setShowDocs] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null)

  const filteredConversations = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.messages.some(
        (m) => m.role === 'user' && m.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
  )

  const pinnedConversations = filteredConversations.filter((c) => c.pinned)
  const unpinnedConversations = filteredConversations.filter((c) => !c.pinned)

  const handleNewChat = useCallback(
    (mode: ConversationMode = settings.defaultMode as ConversationMode) => {
      createConversation(mode)
      setShowModeMenu(false)
    },
    [createConversation, settings.defaultMode]
  )

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setContextMenu({ id, x: e.clientX, y: e.clientY })
  }

  return (
    <>
      <div className="flex flex-col h-full bg-card border-r border-border w-64 flex-shrink-0">
        {/* Logo Header */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 omedev-gradient rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-base">O</span>
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-sm omedev-gradient-text leading-none">OMEDEV-AI</h1>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">Agent IA Professionnel</p>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowModeMenu(!showModeMenu)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-omedev-green hover:bg-omedev-green-dark text-white rounded-lg text-sm font-medium transition-colors"
            >
              <div className="flex items-center gap-2">
                <Plus size={16} />
                <span>Nouvelle conversation</span>
              </div>
              <ChevronDown
                size={14}
                className={cn('transition-transform', showModeMenu && 'rotate-180')}
              />
            </button>

            <AnimatePresence>
              {showModeMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  {CONVERSATION_MODES.map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => handleNewChat(mode.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent text-left text-sm transition-colors"
                    >
                      <span className="text-lg">{mode.icon}</span>
                      <div>
                        <p className="font-medium text-foreground">{mode.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{mode.description}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-3 border-b border-border">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Rechercher des conversations"
              className="w-full pl-8 pr-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-omedev-green/50 focus:border-omedev-green/50 placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-1 px-2">
          {pinnedConversations.length > 0 && (
            <div>
              <div className="flex items-center gap-1 px-2 py-1 mb-1">
                <Star size={11} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Épinglées
                </span>
              </div>
              {pinnedConversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.id === activeConversationId}
                  onSelect={() => setActiveConversation(conv.id)}
                  onContextMenu={(e) => handleContextMenu(e, conv.id)}
                  onPin={() => pinConversation(conv.id)}
                  onDelete={() => deleteConversation(conv.id)}
                />
              ))}
            </div>
          )}

          {unpinnedConversations.length > 0 && (
            <div>
              {pinnedConversations.length > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 mb-1 mt-2">
                  <MessageSquare size={11} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Récentes
                  </span>
                </div>
              )}
              {unpinnedConversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.id === activeConversationId}
                  onSelect={() => setActiveConversation(conv.id)}
                  onContextMenu={(e) => handleContextMenu(e, conv.id)}
                  onPin={() => pinConversation(conv.id)}
                  onDelete={() => deleteConversation(conv.id)}
                />
              ))}
            </div>
          )}

          {filteredConversations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mb-3">
                <MessageSquare size={20} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Aucune conversation trouvée' : 'Aucune conversation'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Cliquez sur &ldquo;Nouvelle conversation&rdquo; pour commencer
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-3 space-y-1">
          <button type="button" onClick={() => setShowDocs(true)} className="sidebar-item w-full">
            <BookOpen size={15} />
            <span>Documentation</span>
          </button>
          <button type="button" onClick={() => setShowShortcuts(true)} className="sidebar-item w-full">
            <Zap size={15} />
            <span>Raccourcis clavier</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setRightPanelOpen(true)
              setRightPanelTab('agents')
              if (window.innerWidth < 1024) toggleSidebar()
            }}
            className="sidebar-item w-full"
          >
            <Bot size={15} />
            <span>Agents IA</span>
          </button>
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="sidebar-item w-full"
          >
            <Settings size={15} />
            <span>Paramètres</span>
          </button>

          <div className="pt-2 mt-1 border-t border-border">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              <span className="font-medium text-foreground/60">OMEDEV SERVICES SARL</span>
              <br />
              Kinshasa, RDC · v1.0.0
            </p>
          </div>
        </div>

        {/* Context menu overlay */}
        {contextMenu && (
          <div className="fixed inset-0 z-50" onClick={() => setContextMenu(null)}>
            <div
              className="absolute bg-popover border border-border rounded-xl shadow-xl overflow-hidden w-48"
              style={{ top: contextMenu.y, left: contextMenu.x }}
            >
              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors text-left"
                onClick={() => {
                  pinConversation(contextMenu.id)
                  setContextMenu(null)
                }}
              >
                <Pin size={14} />
                Épingler / Désépingler
              </button>
              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors text-left text-destructive"
                onClick={() => {
                  deleteConversation(contextMenu.id)
                  setContextMenu(null)
                }}
              >
                <Trash2 size={14} />
                Supprimer
              </button>
            </div>
          </div>
        )}

        {/* Mode menu overlay */}
        {showModeMenu && (
          <div className="fixed inset-0 z-40" onClick={() => setShowModeMenu(false)} />
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <Suspense fallback={null}>
          <SettingsModal onClose={() => setShowSettings(false)} />
        </Suspense>
      )}

      {/* Raccourcis clavier */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowShortcuts(false)}>
          <div className="bg-popover border border-border rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-omedev-green" />
                <h3 className="font-semibold text-sm">Raccourcis clavier</h3>
              </div>
              <button type="button" onClick={() => setShowShortcuts(false)} className="p-1 rounded-lg hover:bg-accent text-muted-foreground">✕</button>
            </div>
            <div className="p-4 space-y-2">
              {[
                { keys: 'Ctrl + B', label: 'Afficher / masquer la sidebar' },
                { keys: 'Entrée', label: 'Envoyer le message' },
                { keys: 'Maj + Entrée', label: 'Nouvelle ligne' },
                { keys: 'Ctrl + K', label: 'Nouvelle conversation' },
                { keys: 'Échap', label: 'Fermer les menus' },
                { keys: 'Ctrl + /', label: 'Prompts rapides' },
              ].map(({ keys, label }) => (
                <div key={keys} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <kbd className="px-2 py-0.5 bg-muted border border-border rounded text-xs font-mono flex-shrink-0">{keys}</kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Documentation */}
      {showDocs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowDocs(false)}>
          <div className="bg-popover border border-border rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-omedev-green" />
                <h3 className="font-semibold text-sm">Documentation</h3>
              </div>
              <button type="button" onClick={() => setShowDocs(false)} className="p-1 rounded-lg hover:bg-accent text-muted-foreground">✕</button>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div>
                <p className="font-medium text-foreground mb-1">🤖 OMEDEV-AI v1.0</p>
                <p className="text-muted-foreground text-xs">Assistant IA professionnel propulsé par Claude Opus 4.8 d&apos;Anthropic.</p>
              </div>
              <div className="space-y-1.5">
                {[
                  { icon: '💬', title: 'Général', desc: 'Conversations et questions générales' },
                  { icon: '💻', title: 'Code', desc: 'Développement, debug, architecture' },
                  { icon: '⚖️', title: 'Juridique', desc: 'Droit OHADA, contrats RDC' },
                  { icon: '🎓', title: 'Formation', desc: 'Apprentissage et cours interactifs' },
                  { icon: '📊', title: 'Analyste', desc: 'Analyse de données et rapports' },
                  { icon: '🤖', title: 'Autonome', desc: 'Tâches complexes multi-étapes' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-2">
                    <span>{icon}</span>
                    <div>
                      <span className="font-medium text-foreground">{title}</span>
                      <span className="text-muted-foreground"> — {desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-border text-xs text-muted-foreground text-center">
                OMEDEV SERVICES SARL · Kinshasa, RDC · oseedoro@gmail.com
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

interface ConversationItemProps {
  conversation: import('@/types').Conversation
  isActive: boolean
  onSelect: () => void
  onContextMenu: (e: React.MouseEvent) => void
  onPin: () => void
  onDelete: () => void
}

function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onContextMenu,
  onDelete,
}: ConversationItemProps) {
  const [showActions, setShowActions] = useState(false)
  const modeIcon = MODE_ICONS[conversation.mode] || '💬'

  return (
    <div
      className={cn(
        'group relative flex items-start gap-2 px-2 py-2 rounded-lg cursor-pointer transition-all duration-150 text-sm',
        isActive
          ? 'bg-omedev-green/10 text-foreground border border-omedev-green/20'
          : 'hover:bg-accent text-muted-foreground hover:text-foreground'
      )}
      onClick={onSelect}
      onContextMenu={onContextMenu}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      aria-label={`Ouvrir la conversation: ${conversation.title}`}
    >
      <span className="mt-0.5 flex-shrink-0">{modeIcon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate text-xs leading-tight">
          {truncateText(conversation.title, 32)}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {conversation.messages.length} msg ·{' '}
          {formatRelativeTime(new Date(conversation.updatedAt))}
        </p>
      </div>

      {showActions && (
        <button
          type="button"
          title="Supprimer la conversation"
          aria-label="Supprimer la conversation"
          className="flex-shrink-0 p-0.5 hover:bg-background rounded opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <Trash2 size={12} className="text-muted-foreground hover:text-destructive" />
        </button>
      )}

      {conversation.pinned && (
        <Star size={10} className="flex-shrink-0 text-yellow-500 fill-yellow-500" />
      )}
    </div>
  )
}
