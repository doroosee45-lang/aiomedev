'use client'

import { useState, useCallback } from 'react'
import {
  File,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Edit2,
  Search,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FileItem } from '@/types'
import { useAppStore } from '@/lib/store'

const FILE_EXTENSIONS_ICONS: Record<string, { icon: string; color: string }> = {
  ts: { icon: '🔷', color: 'text-blue-400' },
  tsx: { icon: '⚛️', color: 'text-blue-300' },
  js: { icon: '🟨', color: 'text-yellow-400' },
  jsx: { icon: '⚛️', color: 'text-yellow-300' },
  py: { icon: '🐍', color: 'text-green-400' },
  json: { icon: '📋', color: 'text-yellow-300' },
  md: { icon: '📝', color: 'text-gray-300' },
  css: { icon: '🎨', color: 'text-blue-300' },
  html: { icon: '🌐', color: 'text-orange-400' },
  sql: { icon: '🗄️', color: 'text-purple-400' },
  sh: { icon: '🖥️', color: 'text-gray-400' },
  yaml: { icon: '⚙️', color: 'text-red-300' },
  yml: { icon: '⚙️', color: 'text-red-300' },
  dockerfile: { icon: '🐳', color: 'text-blue-400' },
  default: { icon: '📄', color: 'text-muted-foreground' },
}

const DEMO_FILES: FileItem[] = [
  {
    id: '1',
    name: 'omedev-project',
    path: '/omedev-project',
    type: 'directory',
    children: [
      {
        id: '2',
        name: 'src',
        path: '/omedev-project/src',
        type: 'directory',
        children: [
          {
            id: '3',
            name: 'index.ts',
            path: '/omedev-project/src/index.ts',
            type: 'file',
            extension: 'ts',
            size: 1024,
          },
          {
            id: '4',
            name: 'components',
            path: '/omedev-project/src/components',
            type: 'directory',
            children: [
              {
                id: '5',
                name: 'App.tsx',
                path: '/omedev-project/src/components/App.tsx',
                type: 'file',
                extension: 'tsx',
                size: 2048,
              },
            ],
          },
        ],
      },
      {
        id: '6',
        name: 'package.json',
        path: '/omedev-project/package.json',
        type: 'file',
        extension: 'json',
        size: 512,
      },
      {
        id: '7',
        name: 'README.md',
        path: '/omedev-project/README.md',
        type: 'file',
        extension: 'md',
        size: 1536,
      },
    ],
  },
]

export function FileExplorer() {
  const { files, setActiveFile } = useAppStore()
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(['1', '2']))
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const displayFiles = files.length > 0 ? files : DEMO_FILES

  const toggleDir = useCallback((id: string) => {
    setExpandedDirs((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handleFileClick = useCallback(
    (file: FileItem) => {
      setSelectedFile(file.id)
      setActiveFile(file)
    },
    [setActiveFile]
  )

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'directory') {
      return expandedDirs.has(file.id) ? (
        <FolderOpen size={14} className="text-yellow-400" />
      ) : (
        <Folder size={14} className="text-yellow-400" />
      )
    }

    const ext = file.extension || file.name.split('.').pop() || 'default'
    const iconInfo = FILE_EXTENSIONS_ICONS[ext] || FILE_EXTENSIONS_ICONS.default
    return <span className="text-xs">{iconInfo.icon}</span>
  }

  const renderFileTree = (items: FileItem[], depth = 0) => {
    return items.map((item) => (
      <div key={item.id}>
        <div
          className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer text-xs transition-colors group',
            'hover:bg-accent',
            selectedFile === item.id && 'bg-omedev-green/10 text-omedev-green'
          )}
          style={{ paddingLeft: `${(depth + 1) * 12}px` }}
          onClick={() => {
            if (item.type === 'directory') {
              toggleDir(item.id)
            } else {
              handleFileClick(item)
            }
          }}
        >
          {item.type === 'directory' && (
            <span className="text-muted-foreground/60">
              {expandedDirs.has(item.id) ? (
                <ChevronDown size={12} />
              ) : (
                <ChevronRight size={12} />
              )}
            </span>
          )}
          {item.type === 'file' && <span className="w-3" />}

          {getFileIcon(item)}

          <span className={cn(
            'flex-1 truncate',
            selectedFile === item.id ? 'text-omedev-green' : 'text-foreground/80'
          )}>
            {item.name}
          </span>

          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5">
            <button
              className="p-0.5 hover:text-foreground text-muted-foreground rounded"
              onClick={(e) => e.stopPropagation()}
            >
              <Edit2 size={10} />
            </button>
            <button
              className="p-0.5 hover:text-destructive text-muted-foreground rounded"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 size={10} />
            </button>
          </div>
        </div>

        {item.type === 'directory' &&
          expandedDirs.has(item.id) &&
          item.children &&
          renderFileTree(item.children, depth + 1)}
      </div>
    ))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="panel-header">
        <span>Explorateur de fichiers</span>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground">
            <RefreshCw size={13} />
          </button>
          <button className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground">
            <Plus size={13} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-border">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher des fichiers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-2 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-omedev-green/50"
          />
        </div>
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-y-auto py-2">
        {renderFileTree(displayFiles)}
      </div>

      {/* Status bar */}
      <div className="border-t border-border px-3 py-1.5">
        <p className="text-xs text-muted-foreground">
          {selectedFile ? 'Fichier sélectionné' : 'Aucune sélection'}
        </p>
      </div>
    </div>
  )
}
