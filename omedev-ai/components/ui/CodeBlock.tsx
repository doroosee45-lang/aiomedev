'use client'

import { useState, useCallback } from 'react'
import { Copy, Check, Play, Download, Code2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  onExecute?: (code: string, language: string) => void
}

const LANGUAGE_LABELS: Record<string, string> = {
  javascript: 'JavaScript',
  js: 'JavaScript',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  tsx: 'TSX',
  jsx: 'JSX',
  python: 'Python',
  py: 'Python',
  java: 'Java',
  rust: 'Rust',
  rs: 'Rust',
  go: 'Go',
  cpp: 'C++',
  c: 'C',
  csharp: 'C#',
  cs: 'C#',
  php: 'PHP',
  ruby: 'Ruby',
  rb: 'Ruby',
  swift: 'Swift',
  kotlin: 'Kotlin',
  kt: 'Kotlin',
  dart: 'Dart',
  sql: 'SQL',
  bash: 'Bash',
  sh: 'Shell',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  markdown: 'Markdown',
  md: 'Markdown',
  dockerfile: 'Dockerfile',
  solidity: 'Solidity',
  sol: 'Solidity',
  vhdl: 'VHDL',
  verilog: 'Verilog',
  r: 'R',
  matlab: 'MATLAB',
  text: 'Texte',
}

const EXECUTABLE_LANGUAGES = ['javascript', 'typescript', 'python', 'bash', 'sh']

const LANGUAGE_COLORS: Record<string, string> = {
  javascript: 'text-yellow-400',
  typescript: 'text-blue-400',
  python: 'text-green-400',
  java: 'text-orange-400',
  rust: 'text-red-400',
  go: 'text-cyan-400',
  sql: 'text-purple-400',
  bash: 'text-gray-400',
  html: 'text-orange-300',
  css: 'text-blue-300',
  json: 'text-yellow-300',
}

export function CodeBlock({
  code,
  language = 'text',
  filename,
  showLineNumbers = true,
  onExecute,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [output, setOutput] = useState<string | null>(null)
  const [outputError, setOutputError] = useState(false)

  const displayLanguage = LANGUAGE_LABELS[language] || language.toUpperCase()
  const langColor = LANGUAGE_COLORS[language] || 'text-muted-foreground'
  const canExecute = EXECUTABLE_LANGUAGES.includes(language) && onExecute

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback pour navigateurs sans clipboard API
      const textarea = document.createElement('textarea')
      textarea.value = code
      textarea.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      try { document.execCommand('copy') } catch { /* last resort */ }
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [code])

  const handleExecute = useCallback(async () => {
    if (!canExecute || isExecuting) return

    setIsExecuting(true)
    setOutput(null)
    setOutputError(false)

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      })

      const result = await response.json()

      if (result.success) {
        setOutput(result.output || '(Aucune sortie)')
        setOutputError(false)
      } else {
        setOutput(result.error || result.output || 'Erreur lors de l\'exécution')
        setOutputError(true)
      }
    } catch (err) {
      setOutput('Erreur de connexion au serveur d\'exécution')
      setOutputError(true)
    } finally {
      setIsExecuting(false)
    }
  }, [code, language, canExecute, isExecuting])

  const handleDownload = useCallback(() => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      rust: 'rs',
      go: 'go',
      sql: 'sql',
      bash: 'sh',
      html: 'html',
      css: 'css',
      json: 'json',
    }

    const ext = extensions[language] || 'txt'
    const name = filename || `code.${ext}`
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [code, language, filename])

  const lines = code.split('\n')

  return (
    <div className="code-block my-3 text-sm font-mono">
      {/* Header */}
      <div className="code-header">
        <div className="flex items-center gap-2">
          <Code2 size={13} className="text-muted-foreground" />
          <span className={cn('font-medium', langColor)}>{displayLanguage}</span>
          {filename && (
            <>
              <span className="text-border">·</span>
              <span className="text-foreground/60">{filename}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          {canExecute && (
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-omedev-green/10 text-omedev-green hover:bg-omedev-green/20 transition-colors disabled:opacity-50"
              title="Exécuter le code"
            >
              {isExecuting ? (
                <>
                  <div className="w-3 h-3 border-2 border-omedev-green border-t-transparent rounded-full animate-spin" />
                  <span>Exécution...</span>
                </>
              ) : (
                <>
                  <Play size={11} />
                  <span>Exécuter</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={handleDownload}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            title="Télécharger"
          >
            <Download size={13} />
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            title={copied ? 'Copié !' : 'Copier le code'}
          >
            {copied ? (
              <>
                <Check size={13} className="text-omedev-green" />
                <span className="text-omedev-green">Copié</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copier</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <pre className="p-4 text-sm leading-relaxed min-w-max">
          <code>
            {showLineNumbers ? (
              <table className="border-collapse">
                <tbody>
                  {lines.map((line, i) => (
                    <tr key={i} className="group hover:bg-white/[0.02]">
                      <td className="select-none pr-4 text-right text-muted-foreground/40 text-xs w-10 leading-relaxed border-r border-border/30 sticky left-0 bg-transparent">
                        {i + 1}
                      </td>
                      <td className="pl-4 text-foreground/90 leading-relaxed whitespace-pre">
                        <SyntaxHighlight code={line} language={language} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <span className="text-foreground/90 whitespace-pre">{code}</span>
            )}
          </code>
        </pre>
      </div>

      {/* Output */}
      {output !== null && (
        <div className={cn(
          'border-t border-border px-4 py-3',
          outputError ? 'bg-red-500/5' : 'bg-omedev-green/5'
        )}>
          <div className="flex items-center gap-2 mb-2">
            <span className={cn(
              'text-xs font-semibold uppercase tracking-wider',
              outputError ? 'text-red-400' : 'text-omedev-green'
            )}>
              {outputError ? '❌ Erreur' : '✅ Sortie'}
            </span>
          </div>
          <pre className={cn(
            'text-xs whitespace-pre-wrap font-mono leading-relaxed',
            outputError ? 'text-red-300' : 'text-foreground/80'
          )}>
            {output}
          </pre>
        </div>
      )}
    </div>
  )
}

// Simple syntax highlighter component
function SyntaxHighlight({ code, language }: { code: string; language: string }) {
  // Basic syntax highlighting without external deps
  if (!code) return <span>&nbsp;</span>

  // Keywords by language
  const keywords: Record<string, string[]> = {
    javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'from', 'async', 'await', 'try', 'catch', 'throw', 'new', 'typeof', 'instanceof', 'true', 'false', 'null', 'undefined', 'this', 'super'],
    typescript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'from', 'async', 'await', 'type', 'interface', 'enum', 'implements', 'extends', 'readonly', 'public', 'private', 'protected', 'static', 'abstract', 'true', 'false', 'null', 'undefined'],
    python: ['def', 'class', 'import', 'from', 'return', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'finally', 'with', 'as', 'in', 'not', 'and', 'or', 'is', 'lambda', 'yield', 'pass', 'break', 'continue', 'True', 'False', 'None', 'async', 'await'],
    sql: ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'GROUP', 'BY', 'ORDER', 'HAVING', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'DROP', 'ALTER', 'ADD', 'COLUMN', 'INDEX', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'NOT', 'NULL', 'UNIQUE', 'DEFAULT', 'AS', 'AND', 'OR', 'IN', 'LIKE', 'BETWEEN', 'EXISTS', 'DISTINCT', 'LIMIT', 'OFFSET'],
  }

  const langKeywords = keywords[language] || keywords.javascript || []

  // Return plain text for unsupported languages
  if (!keywords[language]) {
    return <span className="text-foreground/90">{code}</span>
  }

  const words = code.split(/(\s+|[{}()\[\].,;:=+\-*/<>!&|@#])/)
  return (
    <span>
      {words.map((word, i) => {
        if (langKeywords.includes(word)) {
          return (
            <span key={i} className="text-purple-300 font-medium">
              {word}
            </span>
          )
        }

        // String detection
        if ((word.startsWith('"') && word.endsWith('"')) ||
            (word.startsWith("'") && word.endsWith("'"))) {
          return <span key={i} className="text-green-300">{word}</span>
        }

        // Number detection
        if (/^\d+\.?\d*$/.test(word)) {
          return <span key={i} className="text-yellow-300">{word}</span>
        }

        return <span key={i} className="text-foreground/90">{word}</span>
      })}
    </span>
  )
}
