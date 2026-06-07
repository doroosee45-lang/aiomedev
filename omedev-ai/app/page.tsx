'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { StatusBar } from '@/components/layout/StatusBar'
import { ChatInterface } from '@/components/chat/ChatInterface'
import { RightPanel } from '@/components/panels/RightPanel'
export default function HomePage() {
  const { sidebarOpen, toggleSidebar, rightPanelOpen, setRightPanelOpen } = useAppStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Fermer les panneaux automatiquement sur mobile
    if (window.innerWidth < 1024) {
      if (sidebarOpen) toggleSidebar()
      if (rightPanelOpen) setRightPanelOpen(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 omedev-gradient rounded-2xl flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-2xl">O</span>
          </div>
          <div className="space-y-1 text-center">
            <p className="text-sm font-semibold omedev-gradient-text">OMEDEV-AI</p>
            <p className="text-xs text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Backdrop mobile pour fermer la sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar — overlay sur mobile, inline sur desktop */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto h-full flex-shrink-0 overflow-hidden"
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <Header />

        {/* Chat + Right panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat area */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <ChatInterface />
          </div>

          {/* Right panel */}
          <RightPanel />
        </div>

        {/* Status bar */}
        <StatusBar />
      </div>
    </div>
  )
}
