'use client'

import { useState } from 'react'
import { FileText, Download, Copy, Check, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface DocumentGeneratorProps {
  onClose: () => void
}

const DOC_TYPES = [
  // ── Conception (backend documentGenerator.js) ──
  { id: 'cdc',            label: '📋 Cahier des Charges',    description: 'CDC complet 15 sections (OHADA/RDC)', group: 'Conception' },
  { id: 'spec_technique', label: '⚙️ Spec Technique',        description: 'Architecture, API, BDD, sécurité, CI/CD', group: 'Conception' },
  { id: 'architecture',   label: '🏗️ Document Architecture', description: 'C4, ADR, composants, scalabilité', group: 'Conception' },
  { id: 'user_stories',   label: '📝 User Stories',          description: 'Stories Gherkin avec critères d\'acceptation', group: 'Conception' },
  // ── Juridique & Business (via IA agent) ──
  { id: 'contrat',        label: '📜 Contrat',               description: 'Contrat OHADA/RDC', group: 'Juridique' },
  { id: 'rapport',        label: '📊 Rapport',               description: 'Rapport professionnel', group: 'Juridique' },
  { id: 'proposition',    label: '💼 Proposition',           description: 'Offre commerciale', group: 'Juridique' },
  { id: 'invoice',        label: '🧾 Facture',               description: 'Facture proforma OHADA', group: 'Juridique' },
]

export function DocumentGenerator({ onClose }: DocumentGeneratorProps) {
  const [docType, setDocType] = useState('rapport')
  const [title, setTitle] = useState('')
  const [context, setContext] = useState('')
  const [language, setLanguage] = useState('fr')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!context.trim()) return
    setIsGenerating(true)
    setError(null)
    setGeneratedDoc(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: docType, context, title, language }),
      })

      const data = await response.json()
      if (data.success) {
        setGeneratedDoc(data.content)
      } else {
        setError(data.error || 'Erreur de génération')
      }
    } catch {
      setError('Erreur de connexion au serveur')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (!generatedDoc) return
    await navigator.clipboard.writeText(generatedDoc)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!generatedDoc) return
    const blob = new Blob([generatedDoc], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title || docType}-OMEDEV-${Date.now()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500/10 border border-blue-400/30 rounded-xl flex items-center justify-center">
              <FileText size={18} className="text-blue-400" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Générateur de Documents</h2>
              <p className="text-xs text-muted-foreground">OMEDEV-AI — Ollama local · Claude fallback</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Fermer"
            aria-label="Fermer le générateur de documents"
            className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left: Form */}
          <div className="w-80 border-r border-border flex flex-col overflow-y-auto p-4 space-y-4 flex-shrink-0">
            {/* Doc type */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Type de document
              </label>
              <div className="space-y-2">
                {(['Conception', 'Juridique'] as const).map((group) => (
                  <div key={group}>
                    <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mb-1 px-1">{group}</p>
                    <div className="grid grid-cols-1 gap-1">
                      {DOC_TYPES.filter((t) => t.group === group).map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setDocType(type.id)}
                          title={type.description}
                          className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-all',
                            docType === type.id
                              ? 'bg-omedev-green/10 border border-omedev-green/30 text-foreground'
                              : 'hover:bg-accent text-muted-foreground border border-transparent'
                          )}
                        >
                          <span>{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Titre du document
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Contrat de prestation IT"
                className="omedev-input text-xs"
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Langue
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                title="Choisir la langue du document"
                aria-label="Langue du document"
                className="omedev-input text-xs"
              >
                <option value="fr">🇫🇷 Français</option>
                <option value="en">🇬🇧 English</option>
              </select>
            </div>

            {/* Context */}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Contexte et instructions *
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder={`Décrivez le contexte du document...

Ex: Contrat entre OMEDEV SERVICES et la société ABC pour la création d'une application mobile. Durée 3 mois, budget 5000 USD...`}
                rows={8}
                className="omedev-input text-xs resize-none"
              />
            </div>

            {/* Generate button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!context.trim() || isGenerating}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all',
                context.trim() && !isGenerating
                  ? 'bg-omedev-green hover:bg-omedev-green-dark text-white shadow-sm'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <FileText size={15} />
                  Générer le document
                </>
              )}
            </button>
          </div>

          {/* Right: Preview */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            {generatedDoc && (
              <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50 flex-shrink-0">
                <span className="text-xs font-medium text-muted-foreground">
                  Aperçu du document
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-muted hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                  >
                    {copied ? (
                      <><Check size={12} className="text-omedev-green" /><span className="text-omedev-green">Copié</span></>
                    ) : (
                      <><Copy size={12} /><span>Copier</span></>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-omedev-green hover:bg-omedev-green-dark text-white rounded-lg transition-colors"
                  >
                    <Download size={12} />
                    <span>Télécharger .md</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-sm text-destructive">
                  ❌ {error}
                </div>
              )}

              {isGenerating && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 omedev-gradient rounded-2xl flex items-center justify-center mb-4 animate-pulse">
                    <FileText size={28} className="text-white" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Génération du document...</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Claude Opus 4.8 analyse votre contexte
                  </p>
                </div>
              )}

              {generatedDoc && (
                <div className="prose prose-sm dark:prose-invert max-w-none markdown-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {generatedDoc}
                  </ReactMarkdown>
                </div>
              )}

              {!generatedDoc && !isGenerating && !error && (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <FileText size={48} className="mb-4 opacity-20" />
                  <p className="text-sm">Remplissez le formulaire et cliquez sur &ldquo;Générer&rdquo;</p>
                  <p className="text-xs mt-1">
                    Documents conformes au droit OHADA · OMEDEV SERVICES SARL
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
