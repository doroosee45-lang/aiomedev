'use client'

import { useCallback, useState, Suspense, lazy } from 'react'
import { useTheme } from 'next-themes'
import {
  Menu,
  Moon,
  Sun,
  Monitor,
  ChevronDown,
  Cpu,
  Zap,
  PanelRight,
  FileText,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { CONVERSATION_MODES, MODELS } from '@/types'
import type { ConversationMode } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'

const DocumentGenerator = lazy(() =>
  import('@/components/ui/DocumentGenerator').then((m) => ({ default: m.DocumentGenerator }))
)

const MODE_COLORS: Record<ConversationMode, string> = {
  general: 'bg-omedev-green/10 text-omedev-green border-omedev-green/30',
  code: 'bg-blue-500/10 text-blue-400 border-blue-400/30',
  legal: 'bg-purple-500/10 text-purple-400 border-purple-400/30',
  formation: 'bg-yellow-500/10 text-yellow-400 border-yellow-400/30',
  analyst: 'bg-emerald-500/10 text-emerald-400 border-emerald-400/30',
  autonomous: 'bg-red-500/10 text-red-400 border-red-400/30',
}

export function Header() {
  const {
    getActiveConversation,
    toggleSidebar,
    sidebarOpen,
    rightPanelOpen,
    setRightPanelOpen,
    setRightPanelTab,
    settings,
    updateSettings,
    createConversation,
  } = useAppStore()

  const { theme, setTheme } = useTheme()
  const [showModelMenu, setShowModelMenu] = useState(false)
  const [showModeMenu, setShowModeMenu] = useState(false)
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [showDocGenerator, setShowDocGenerator] = useState(false)

  const activeConversation = getActiveConversation()
  const currentMode = activeConversation?.mode || settings.defaultMode
  const modeConfig = CONVERSATION_MODES.find((m) => m.id === currentMode)
  const modelConfig = MODELS.find((m) => m.id === settings.defaultModel)

  const handleModeChange = useCallback(
    (mode: ConversationMode) => {
      updateSettings({ defaultMode: mode })
      createConversation(mode)
      setShowModeMenu(false)
    },
    [updateSettings, createConversation]
  )

  const handleModelChange = useCallback(
    (modelId: string) => {
      updateSettings({ defaultModel: modelId })
      setShowModelMenu(false)
    },
    [updateSettings]
  )

  return (
    <header className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 border-b border-border bg-card/80 backdrop-blur-sm z-40">
      {/* Sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className={cn(
          'p-2 rounded-lg transition-colors',
          sidebarOpen ? 'text-foreground bg-accent' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        )}
        title="Basculer le panneau (Ctrl+B)"
      >
        <Menu size={18} />
      </button>

      {/* Mode Selector */}
      <div className="relative">
        <button
          onClick={() => {
            setShowModeMenu(!showModeMenu)
            setShowModelMenu(false)
            setShowThemeMenu(false)
          }}
          className={cn(
            'mode-badge cursor-pointer hover:opacity-90 transition-opacity',
            MODE_COLORS[currentMode as ConversationMode] || MODE_COLORS.general
          )}
        >
          <span>{modeConfig?.icon}</span>
          <span>{modeConfig?.name || 'Général'}</span>
          <ChevronDown
            size={12}
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
              className="absolute top-full left-0 mt-2 w-72 max-w-[calc(100vw-1rem)] bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                  Mode de conversation
                </p>
                {CONVERSATION_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleModeChange(mode.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors',
                      currentMode === mode.id
                        ? 'bg-omedev-green/10 text-foreground'
                        : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <span className="text-xl w-8 text-center">{mode.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{mode.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{mode.description}</p>
                    </div>
                    {currentMode === mode.id && (
                      <div className="w-2 h-2 rounded-full bg-omedev-green flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Conversation title */}
      <div className="flex-1 min-w-0">
        {activeConversation && (
          <h2 className="text-sm font-medium text-foreground truncate">
            {activeConversation.title}
          </h2>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1">
        {/* Model selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowModelMenu(!showModelMenu)
              setShowModeMenu(false)
              setShowThemeMenu(false)
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground bg-background hover:bg-accent border border-border rounded-lg transition-colors"
            title="Changer de modèle IA"
          >
            <Cpu size={13} />
            <span className="hidden sm:inline">{modelConfig?.name?.split(' ')[2] || 'Opus'}</span>
            <ChevronDown size={12} className={cn('transition-transform', showModelMenu && 'rotate-180')} />
          </button>

          <AnimatePresence>
            {showModelMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 mt-2 w-72 max-w-[calc(100vw-1rem)] bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden"
              >
                <div className="p-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                    Modèle IA
                  </p>
                  {MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleModelChange(model.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors',
                        settings.defaultModel === model.id
                          ? 'bg-omedev-green/10 text-foreground'
                          : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Zap size={16} className={settings.defaultModel === model.id ? 'text-omedev-green' : ''} />
                      <div className="flex-1">
                        <p className="font-medium text-xs">{model.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {model.contextWindow / 1000}K ctx · ${model.costPer1MInput}/1M tokens
                        </p>
                      </div>
                      {settings.defaultModel === model.id && (
                        <div className="w-2 h-2 rounded-full bg-omedev-green" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme toggle */}
        <div className="relative">
          <button
            onClick={() => {
              setShowThemeMenu(!showThemeMenu)
              setShowModelMenu(false)
              setShowModeMenu(false)
            }}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            title="Changer de thème"
          >
            {theme === 'dark' ? <Moon size={16} /> : theme === 'light' ? <Sun size={16} /> : <Monitor size={16} />}
          </button>

          <AnimatePresence>
            {showThemeMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 mt-2 w-40 bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden p-1"
              >
                {[
                  { value: 'light', label: 'Clair', icon: Sun },
                  { value: 'dark', label: 'Sombre', icon: Moon },
                  { value: 'system', label: 'Système', icon: Monitor },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => {
                      setTheme(value)
                      setShowThemeMenu(false)
                    }}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                      theme === value
                        ? 'bg-omedev-green/10 text-foreground'
                        : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Document generator button */}
        <button
          type="button"
          onClick={() => setShowDocGenerator(true)}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          title="Générer un document (contrat, rapport…)"
        >
          <FileText size={16} />
        </button>

        {/* Right panel toggle */}
        <button
          type="button"
          onClick={() => {
            setRightPanelOpen(!rightPanelOpen)
            if (!rightPanelOpen) setRightPanelTab('agents')
          }}
          className={cn(
            'p-2 rounded-lg transition-colors',
            rightPanelOpen
              ? 'text-omedev-green bg-omedev-green/10'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          )}
          title="Panneau agents & outils"
        >
          <PanelRight size={16} />
        </button>
      </div>

      {/* Document Generator Modal */}
      {showDocGenerator && (
        <Suspense fallback={null}>
          <DocumentGenerator onClose={() => setShowDocGenerator(false)} />
        </Suspense>
      )}

      {/* Overlay to close menus */}
      {(showModelMenu || showModeMenu || showThemeMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowModelMenu(false)
            setShowModeMenu(false)
            setShowThemeMenu(false)
          }}
        />
      )}
    </header>
  )
}
