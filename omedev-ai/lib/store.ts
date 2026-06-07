import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  type Conversation,
  type Message,
  type AppSettings,
  type ConversationMode,
  type AgentType,
  type UserProfile,
  type FileItem,
  CONVERSATION_MODES,
} from '@/types'
import { generateId, generateConversationTitle } from '@/lib/utils'

// Re-export types from types module for convenience
export type { Conversation, Message, AppSettings, ConversationMode, AgentType }

interface AppState {
  // Conversations
  conversations: Conversation[]
  activeConversationId: string | null

  // UI State
  sidebarOpen: boolean
  rightPanelOpen: boolean
  rightPanelTab: 'files' | 'terminal' | 'agents' | 'docs'
  isStreaming: boolean

  // Settings
  settings: AppSettings

  // User
  user: UserProfile | null

  // Files
  files: FileItem[]
  activeFile: FileItem | null

  // Search
  searchQuery: string

  // Actions - Conversations
  createConversation: (mode?: ConversationMode, agent?: AgentType) => Conversation
  setActiveConversation: (id: string) => void
  deleteConversation: (id: string) => void
  pinConversation: (id: string) => void
  renameConversation: (id: string, title: string) => void
  clearAllConversations: () => void

  // Actions - Messages
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => Message
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void
  deleteMessage: (conversationId: string, messageId: string) => void
  updateStreamingMessage: (conversationId: string, messageId: string, content: string) => void
  finalizeStreamingMessage: (conversationId: string, messageId: string) => void

  // Actions - UI
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setRightPanelOpen: (open: boolean) => void
  setRightPanelTab: (tab: 'files' | 'terminal' | 'agents' | 'docs') => void
  setIsStreaming: (streaming: boolean) => void

  // Actions - Settings
  updateSettings: (settings: Partial<AppSettings>) => void
  setTheme: (theme: 'dark' | 'light' | 'system') => void

  // Actions - Files
  setFiles: (files: FileItem[]) => void
  setActiveFile: (file: FileItem | null) => void

  // Computed
  getActiveConversation: () => Conversation | null
  getConversationMessages: (id: string) => Message[]
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  language: 'fr',
  fontSize: 14,
  fontFamily: 'JetBrains Mono',
  sendOnEnter: true,
  showThinking: false,
  streamResponse: true,
  autoSave: true,
  defaultMode: 'general',
  defaultModel: 'claude-opus-4-8',
  maxTokens: 32000,
  notifications: true,
  sound: false,
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      sidebarOpen: true,
      rightPanelOpen: false,
      rightPanelTab: 'agents',
      isStreaming: false,
      settings: DEFAULT_SETTINGS,
      user: null,
      files: [],
      activeFile: null,
      searchQuery: '',

      createConversation: (mode = 'general', agent) => {
        const modeConfig = CONVERSATION_MODES.find((m) => m.id === mode)
        const conversation: Conversation = {
          id: generateId(),
          title: `Nouvelle conversation — ${modeConfig?.name || 'Général'}`,
          messages: [],
          mode,
          agent,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        set((state) => ({
          conversations: [conversation, ...state.conversations],
          activeConversationId: conversation.id,
        }))

        return conversation
      },

      setActiveConversation: (id) => {
        set({ activeConversationId: id })
      },

      deleteConversation: (id) => {
        set((state) => {
          const filtered = state.conversations.filter((c) => c.id !== id)
          const newActiveId =
            state.activeConversationId === id
              ? filtered[0]?.id || null
              : state.activeConversationId

          return {
            conversations: filtered,
            activeConversationId: newActiveId,
          }
        })
      },

      pinConversation: (id) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, pinned: !c.pinned } : c
          ),
        }))
      },

      renameConversation: (id, title) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, title } : c
          ),
        }))
      },

      clearAllConversations: () => {
        set({ conversations: [], activeConversationId: null })
      },

      addMessage: (conversationId, messageData) => {
        const message: Message = {
          ...messageData,
          id: generateId(),
          timestamp: new Date(),
        }

        set((state) => {
          const conversations = state.conversations.map((conv) => {
            if (conv.id !== conversationId) return conv

            const messages = [...conv.messages, message]
            let title = conv.title

            // Auto-generate title from first user message
            if (
              messages.length === 1 &&
              messageData.role === 'user' &&
              title.startsWith('Nouvelle conversation')
            ) {
              title = generateConversationTitle(messageData.content)
            }

            return {
              ...conv,
              messages,
              title,
              updatedAt: new Date(),
            }
          })

          return { conversations }
        })

        return message
      },

      updateMessage: (conversationId, messageId, updates) => {
        set((state) => ({
          conversations: state.conversations.map((conv) => {
            if (conv.id !== conversationId) return conv
            return {
              ...conv,
              messages: conv.messages.map((msg) =>
                msg.id === messageId ? { ...msg, ...updates } : msg
              ),
            }
          }),
        }))
      },

      deleteMessage: (conversationId, messageId) => {
        set((state) => ({
          conversations: state.conversations.map((conv) => {
            if (conv.id !== conversationId) return conv
            return {
              ...conv,
              messages: conv.messages.filter((msg) => msg.id !== messageId),
            }
          }),
        }))
      },

      updateStreamingMessage: (conversationId, messageId, content) => {
        set((state) => ({
          conversations: state.conversations.map((conv) => {
            if (conv.id !== conversationId) return conv
            return {
              ...conv,
              messages: conv.messages.map((msg) =>
                msg.id === messageId
                  ? { ...msg, content, isStreaming: true }
                  : msg
              ),
            }
          }),
        }))
      },

      finalizeStreamingMessage: (conversationId, messageId) => {
        set((state) => ({
          conversations: state.conversations.map((conv) => {
            if (conv.id !== conversationId) return conv
            return {
              ...conv,
              messages: conv.messages.map((msg) =>
                msg.id === messageId ? { ...msg, isStreaming: false } : msg
              ),
            }
          }),
        }))
      },

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
      setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
      setIsStreaming: (streaming) => set({ isStreaming: streaming }),

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }))
      },

      setTheme: (theme) => {
        set((state) => ({
          settings: { ...state.settings, theme },
        }))
      },

      setFiles: (files) => set({ files }),
      setActiveFile: (file) => set({ activeFile: file }),

      getActiveConversation: () => {
        const { conversations, activeConversationId } = get()
        return conversations.find((c) => c.id === activeConversationId) || null
      },

      getConversationMessages: (id) => {
        const { conversations } = get()
        return conversations.find((c) => c.id === id)?.messages || []
      },
    }),
    {
      name: 'omedev-ai-store',
      partialize: (state) => ({
        conversations: state.conversations,
        settings: state.settings,
        user: state.user,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)
