import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { v4 as uuidv4 } from 'uuid'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return uuidv4()
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return "À l'instant"
  if (minutes < 60) return `Il y a ${minutes} min`
  if (hours < 24) return `Il y a ${hours}h`
  if (days < 7) return `Il y a ${days}j`
  return formatDate(date)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function extractCodeBlocks(text: string): Array<{ language: string; code: string }> {
  const regex = /```(\w+)?\n([\s\S]*?)```/g
  const blocks: Array<{ language: string; code: string }> = []
  let match

  while ((match = regex.exec(text)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim(),
    })
  }

  return blocks
}

export function generateConversationTitle(firstMessage: string): string {
  const cleaned = firstMessage.replace(/[^a-zA-ZÀ-ÿ0-9\s]/g, '').trim()
  const words = cleaned.split(/\s+/).slice(0, 6)
  return words.join(' ') || 'Nouvelle conversation'
}

export function estimateTokens(text: string): number {
  // Rough estimation: ~4 chars per token for French/English
  return Math.ceil(text.length / 4)
}

export function formatTokenCount(tokens: number): string {
  if (tokens < 1000) return `${tokens} tokens`
  return `${(tokens / 1000).toFixed(1)}K tokens`
}

export function detectLanguage(code: string): string {
  const c = code.trim()
  if (/interface\s+\w+|type\s+\w+\s*=|:\s*(string|number|boolean|void|any)\b/.test(c)) return 'typescript'
  if (/^(const|let|var)\s+|function\s+\w+|require\(|module\.exports/.test(c)) return 'javascript'
  if (/^def\s+\w+|^import\s+\w+|^from\s+\w+\s+import|print\(|elif\s/.test(c)) return 'python'
  if (/public\s+class|System\.out\.|import\s+java\./.test(c)) return 'java'
  if (/^fn\s+\w+|let\s+mut|use\s+std::/.test(c)) return 'rust'
  if (/^func\s+\w+|^package\s+main|fmt\.Print/.test(c)) return 'go'
  if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\s/i.test(c)) return 'sql'
  if (/^(FROM|RUN|COPY|CMD|EXPOSE)\s/.test(c)) return 'dockerfile'
  if (/^(<html|<div|<span|<!DOCTYPE)/i.test(c)) return 'html'
  if (/^\s*[\[{]/.test(c)) return 'json'
  if (/^---\n|^\w+:\s/.test(c)) return 'yaml'
  if (/echo\s|chmod\s|sudo\s/.test(c)) return 'bash'
  return 'text'
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export const KEYBOARD_SHORTCUTS = {
  NEW_CHAT: 'Ctrl+N',
  SEARCH: 'Ctrl+K',
  TOGGLE_SIDEBAR: 'Ctrl+B',
  TOGGLE_THEME: 'Ctrl+Shift+T',
  SEND_MESSAGE: 'Enter',
  NEW_LINE: 'Shift+Enter',
  CLEAR_CHAT: 'Ctrl+L',
}

export function isValidApiKey(key: string): boolean {
  return /^sk-ant-[a-zA-Z0-9-]{40,}$/.test(key)
}

export const SUPPORTED_FILE_TYPES = [
  'text/plain',
  'text/markdown',
  'text/html',
  'text/css',
  'text/javascript',
  'application/json',
  'application/typescript',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
]

export function isSupportedFileType(type: string): boolean {
  return SUPPORTED_FILE_TYPES.includes(type) || type.startsWith('text/')
}
