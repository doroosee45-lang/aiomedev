'use client'

import { useState, useRef, useCallback, KeyboardEvent } from 'react'
import { Terminal, Trash2, Copy, ChevronRight, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TerminalLine {
  id: string
  type: 'command' | 'output' | 'error' | 'info'
  content: string
  timestamp: Date
}

const INITIAL_LINES: TerminalLine[] = [
  {
    id: '1',
    type: 'info',
    content: '╔══════════════════════════════════════════════╗',
    timestamp: new Date(),
  },
  {
    id: '2',
    type: 'info',
    content: '║  OMEDEV-AI Terminal v1.0.0                    ║',
    timestamp: new Date(),
  },
  {
    id: '3',
    type: 'info',
    content: '║  OMEDEV SERVICES SARL — Kinshasa, RDC         ║',
    timestamp: new Date(),
  },
  {
    id: '4',
    type: 'info',
    content: '╚══════════════════════════════════════════════╝',
    timestamp: new Date(),
  },
  {
    id: '5',
    type: 'info',
    content: 'Tapez "help" pour voir les commandes disponibles.',
    timestamp: new Date(),
  },
  {
    id: '6',
    type: 'info',
    content: '',
    timestamp: new Date(),
  },
]

const BUILT_IN_COMMANDS: Record<string, (args: string[]) => string> = {
  help: () => `
Commandes disponibles:
  help          - Afficher cette aide
  clear         - Effacer le terminal
  echo [text]   - Afficher du texte
  date          - Afficher la date et l'heure
  info          - Informations sur OMEDEV-AI
  version       - Version de l'application
  pwd           - Répertoire courant (simulé)
  ls            - Lister les fichiers (simulé)
  node -e [code] - Exécuter du JavaScript
`,
  date: () => new Date().toLocaleString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }),
  info: () => `
OMEDEV-AI v1.0.0
Développé par OMEDEV SERVICES SARL
75, avenue Kabambare, Kinshasa, RDC
Gérant: M. DORODORO Meya Osée
Propulsé par Claude Opus 4.8 (Anthropic)
`,
  version: () => 'OMEDEV-AI v1.0.0 (Build: 2026-06)',
  pwd: () => '/home/omedev/workspace',
  ls: () => `total 8
drwxr-xr-x 4 omedev staff  128 Jun 7 2026 src/
-rw-r--r-- 1 omedev staff 1024 Jun 7 2026 package.json
-rw-r--r-- 1 omedev staff  512 Jun 7 2026 README.md
drwxr-xr-x 2 omedev staff   64 Jun 7 2026 docs/`,
}

export function TerminalPanel() {
  const [lines, setLines] = useState<TerminalLine[]>(INITIAL_LINES)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isExecuting, setIsExecuting] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const addLine = useCallback((type: TerminalLine['type'], content: string) => {
    setLines((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2),
        type,
        content,
        timestamp: new Date(),
      },
    ])

    // Auto scroll
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    }, 10)
  }, [])

  const executeCommand = useCallback(
    async (cmd: string) => {
      if (!cmd.trim()) return

      const parts = cmd.trim().split(/\s+/)
      const command = parts[0].toLowerCase()
      const args = parts.slice(1)

      addLine('command', `$ ${cmd}`)
      setHistory((prev) => [cmd, ...prev.slice(0, 49)])
      setHistoryIndex(-1)

      // Built-in commands
      if (command === 'clear') {
        setLines([{
          id: Math.random().toString(36).slice(2),
          type: 'info',
          content: 'Terminal effacé. Tapez "help" pour l\'aide.',
          timestamp: new Date(),
        }])
        return
      }

      if (command === 'echo') {
        addLine('output', args.join(' '))
        return
      }

      if (BUILT_IN_COMMANDS[command]) {
        const result = BUILT_IN_COMMANDS[command](args)
        result.split('\n').forEach((line) => {
          if (line !== undefined) addLine('output', line)
        })
        return
      }

      // Try to execute via API for js/python
      if (command === 'node' && args[0] === '-e' && args[1]) {
        setIsExecuting(true)
        try {
          const response = await fetch('/api/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code: args.slice(1).join(' ').replace(/^["']|["']$/g, ''),
              language: 'javascript',
            }),
          })

          const result = await response.json()
          if (result.output) {
            result.output.split('\n').forEach((line: string) => addLine('output', line))
          }
          if (result.error) {
            result.error.split('\n').forEach((line: string) => addLine('error', line))
          }
        } catch (err) {
          addLine('error', 'Erreur lors de l\'exécution')
        } finally {
          setIsExecuting(false)
        }
        return
      }

      if (command === 'python3' || command === 'python') {
        if (args[0] === '-c' && args[1]) {
          setIsExecuting(true)
          try {
            const response = await fetch('/api/execute', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                code: args.slice(1).join(' ').replace(/^["']|["']$/g, ''),
                language: 'python',
              }),
            })

            const result = await response.json()
            if (result.output) {
              result.output.split('\n').forEach((line: string) => addLine('output', line))
            }
            if (result.error) {
              result.error.split('\n').forEach((line: string) => addLine('error', line))
            }
          } catch {
            addLine('error', 'Erreur lors de l\'exécution Python')
          } finally {
            setIsExecuting(false)
          }
          return
        }
      }

      addLine('error', `Commande non trouvée: ${command}. Tapez "help" pour les commandes disponibles.`)
    },
    [addLine]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        executeCommand(input)
        setInput('')
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const newIndex = Math.min(historyIndex + 1, history.length - 1)
        setHistoryIndex(newIndex)
        if (history[newIndex]) {
          setInput(history[newIndex])
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        const newIndex = Math.max(historyIndex - 1, -1)
        setHistoryIndex(newIndex)
        setInput(newIndex === -1 ? '' : history[newIndex] || '')
      } else if (e.key === 'Tab') {
        e.preventDefault()
        // Simple autocomplete
        const commands = ['help', 'clear', 'echo', 'date', 'info', 'version', 'pwd', 'ls', 'node -e', 'python3 -c']
        const match = commands.find((c) => c.startsWith(input))
        if (match) setInput(match)
      } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault()
        setLines([])
      }
    },
    [input, history, historyIndex, executeCommand]
  )

  const getLineStyle = (type: TerminalLine['type']) => {
    switch (type) {
      case 'command': return 'text-omedev-green font-medium'
      case 'error': return 'text-red-400'
      case 'info': return 'text-cyan-300/70'
      default: return 'text-foreground/80'
    }
  }

  return (
    <div className="flex flex-col h-full bg-omedev-navy font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Terminal size={13} className="text-omedev-green" />
          <span className="text-xs font-semibold text-omedev-green">OMEDEV Terminal</span>
          {isExecuting && (
            <div className="flex items-center gap-1 text-yellow-400">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-xs">Exécution...</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const text = lines.map((l) => l.content).join('\n')
              navigator.clipboard.writeText(text)
            }}
            className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            title="Copier tout"
          >
            <Copy size={12} />
          </button>
          <button
            onClick={() => setLines([])}
            className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            title="Effacer"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Terminal output */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-3 space-y-0.5"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line) => (
          <div key={line.id} className={cn('leading-relaxed', getLineStyle(line.type))}>
            {line.content || ' '}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-3 py-2 border-t border-border/30 bg-black/20">
        <span className="text-omedev-green flex-shrink-0">
          <ChevronRight size={13} />
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isExecuting}
          placeholder="Tapez une commande..."
          className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground/40 text-xs"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
        <button
          onClick={() => {
            executeCommand(input)
            setInput('')
          }}
          disabled={!input.trim() || isExecuting}
          className="text-omedev-green/60 hover:text-omedev-green disabled:opacity-30 transition-colors"
        >
          <Play size={12} />
        </button>
      </div>
    </div>
  )
}
