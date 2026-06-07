'use client'

import { useAppStore } from '@/lib/store'
import { AgentPanel } from '@/components/agents/AgentPanel'
import { FileExplorer } from './FileExplorer'
import { TerminalPanel } from './TerminalPanel'
import { X, Bot, Files, Terminal, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const PANEL_TABS = [
  { id: 'agents', label: 'Agents', icon: Bot },
  { id: 'files', label: 'Fichiers', icon: Files },
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'docs', label: 'Docs', icon: FileText },
]

export function RightPanel() {
  const { rightPanelOpen, rightPanelTab, setRightPanelTab, setRightPanelOpen } = useAppStore()

  return (
    <AnimatePresence>
      {rightPanelOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="flex flex-col border-l border-border bg-card overflow-hidden flex-shrink-0"
        >
          {/* Tab bar */}
          <div className="flex items-center border-b border-border bg-card/80">
            <div className="flex flex-1">
              {PANEL_TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setRightPanelTab(id as typeof rightPanelTab)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-medium transition-colors border-b-2',
                    rightPanelTab === id
                      ? 'text-omedev-green border-omedev-green'
                      : 'text-muted-foreground border-transparent hover:text-foreground'
                  )}
                  title={label}
                >
                  <Icon size={13} />
                  <span className="hidden xl:inline">{label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setRightPanelOpen(false)}
              className="p-2 mr-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-hidden">
            {rightPanelTab === 'agents' && <AgentPanel />}
            {rightPanelTab === 'files' && <FileExplorer />}
            {rightPanelTab === 'terminal' && <TerminalPanel />}
            {rightPanelTab === 'docs' && <DocsPanel />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function DocsPanel() {
  const DOCS = [
    {
      category: 'Démarrage',
      items: [
        { title: 'Guide de démarrage rapide', icon: '🚀' },
        { title: 'Configuration de l\'API', icon: '🔑' },
        { title: 'Modes de conversation', icon: '💬' },
      ],
    },
    {
      category: 'Agents IA',
      items: [
        { title: 'Agent DevOps', icon: '🚀' },
        { title: 'Agent Sécurité', icon: '🛡️' },
        { title: 'Agent Data Science', icon: '📊' },
        { title: 'Agent Juridique OHADA', icon: '⚖️' },
      ],
    },
    {
      category: 'Fonctionnalités',
      items: [
        { title: 'Exécution de code', icon: '▶️' },
        { title: 'Génération de documents', icon: '📄' },
        { title: 'Intégration Git', icon: '🔀' },
        { title: 'Recherche web', icon: '🌐' },
      ],
    },
    {
      category: 'OMEDEV SERVICES',
      items: [
        { title: 'À propos d\'OMEDEV', icon: '🏢' },
        { title: 'Contact & Support', icon: '📞' },
        { title: 'Signaler un bug', icon: '🐛' },
      ],
    },
  ]

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Documentation OMEDEV-AI</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Guide complet et références</p>
      </div>

      <div className="p-3 space-y-4">
        {DOCS.map((section) => (
          <div key={section.category}>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {section.category}
            </h4>
            <div className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.title}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-left hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* OMEDEV branding */}
        <div className="mt-4 p-3 bg-omedev-green/5 border border-omedev-green/20 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 omedev-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">O</span>
            </div>
            <span className="text-xs font-bold text-foreground">OMEDEV SERVICES SARL</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            75, avenue Kabambare<br />
            Kinshasa, RDC<br />
            <span className="text-omedev-green">oseedoro@gmail.com</span>
          </p>
          <div className="flex gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 bg-omedev-green/10 text-omedev-green rounded-full">
              Digitalisation
            </span>
            <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full">
              Innovation
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
