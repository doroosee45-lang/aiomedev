'use client'

import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { AGENTS, CONVERSATION_MODES } from '@/types'
import type { AgentType, ConversationMode } from '@/types'
import { cn } from '@/lib/utils'
import {
  Rocket,
  Shield,
  Database,
  GraduationCap,
  Briefcase,
  Scale,
  Globe,
  ChevronRight,
  Bot,
  Zap,
  Settings,
} from 'lucide-react'

const AGENT_ICON_COMPONENTS: Record<AgentType, React.ComponentType<{ size?: number; className?: string }>> = {
  devops: Rocket,
  security: Shield,
  data: Database,
  formation: GraduationCap,
  business: Briefcase,
  legal: Scale,
  web: Globe,
}

export function AgentPanel() {
  const {
    getActiveConversation,
    createConversation,
    setActiveConversation,
    rightPanelTab,
    setRightPanelTab,
  } = useAppStore()

  const activeConversation = getActiveConversation()

  const handleSelectAgent = useCallback(
    (agentId: AgentType) => {
      const conversation = createConversation('autonomous', agentId)
      setActiveConversation(conversation.id)
    },
    [createConversation, setActiveConversation]
  )

  const handleSelectMode = useCallback(
    (modeId: ConversationMode) => {
      const conversation = createConversation(modeId)
      setActiveConversation(conversation.id)
    },
    [createConversation, setActiveConversation]
  )

  return (
    <div className="flex flex-col h-full">
      {/* Tab navigation */}
      <div className="flex border-b border-border">
        {[
          { id: 'agents', label: 'Agents', icon: Bot },
          { id: 'modes', label: 'Modes', icon: Zap },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setRightPanelTab(id as 'agents' | 'files' | 'terminal' | 'docs')}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors',
              rightPanelTab === id
                ? 'text-omedev-green border-b-2 border-omedev-green'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {rightPanelTab === 'agents' ? (
          <AgentsList
            activeAgentId={activeConversation?.agent}
            onSelectAgent={handleSelectAgent}
          />
        ) : (
          <ModesList
            activeModeId={activeConversation?.mode}
            onSelectMode={handleSelectMode}
          />
        )}
      </div>
    </div>
  )
}

function AgentsList({
  activeAgentId,
  onSelectAgent,
}: {
  activeAgentId?: AgentType
  onSelectAgent: (id: AgentType) => void
}) {
  return (
    <div className="p-3 space-y-2">
      <div className="mb-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          Agents Spécialisés
        </h3>
        <p className="text-xs text-muted-foreground">
          Agents IA avec des expertises métier spécifiques
        </p>
      </div>

      {AGENTS.map((agent, i) => {
        const IconComponent = AGENT_ICON_COMPONENTS[agent.id] || Bot
        const isActive = agent.id === activeAgentId

        return (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <button
              onClick={() => onSelectAgent(agent.id)}
              className={cn('agent-card w-full text-left', isActive && 'active')}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
                  style={{ backgroundColor: agent.color + '20', border: `1px solid ${agent.color}40` }}
                >
                  <IconComponent size={18} className="opacity-90" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-foreground">{agent.name}</h4>
                    <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                    {agent.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {agent.capabilities.slice(0, 3).map((cap) => (
                      <span
                        key={cap}
                        className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                      >
                        {cap}
                      </span>
                    ))}
                    {agent.capabilities.length > 3 && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        +{agent.capabilities.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          </motion.div>
        )
      })}
    </div>
  )
}

function ModesList({
  activeModeId,
  onSelectMode,
}: {
  activeModeId?: ConversationMode
  onSelectMode: (id: ConversationMode) => void
}) {
  return (
    <div className="p-3 space-y-2">
      <div className="mb-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          Modes de Conversation
        </h3>
        <p className="text-xs text-muted-foreground">
          Adaptez OMEDEV-AI à votre contexte de travail
        </p>
      </div>

      {CONVERSATION_MODES.map((mode, i) => {
        const isActive = mode.id === activeModeId

        return (
          <motion.div
            key={mode.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <button
              onClick={() => onSelectMode(mode.id)}
              className={cn('agent-card w-full text-left', isActive && 'active')}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl w-10 flex-shrink-0 flex items-center justify-center">
                  {mode.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-foreground">{mode.name}</h4>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-omedev-green flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                    {mode.description}
                  </p>
                </div>
              </div>
            </button>
          </motion.div>
        )
      })}
    </div>
  )
}
