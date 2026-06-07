'use client'

import { useState } from 'react'
import { X, Key, Cpu, Eye, Save, RotateCcw, Moon, Sun, Monitor, Volume2, Bell } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { MODELS } from '@/types'
import { cn } from '@/lib/utils'

interface SettingsModalProps {
  onClose: () => void
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { settings, updateSettings, clearAllConversations } = useAppStore()
  const [apiKey, setApiKey] = useState('')
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'model' | 'interface' | 'about'>('general')

  const handleSave = () => {
    if (apiKey.trim()) {
      // In production, this would be stored securely
      // For now, just show confirmation
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tabs = [
    { id: 'general', label: '⚙️ Général' },
    { id: 'model', label: '🤖 Modèle IA' },
    { id: 'interface', label: '🎨 Interface' },
    { id: 'about', label: 'ℹ️ À propos' },
  ]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="font-bold text-foreground">Paramètres OMEDEV-AI</h2>
            <p className="text-xs text-muted-foreground">Configuration de votre agent IA</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'px-4 py-3 text-sm font-medium transition-colors border-b-2',
                activeTab === tab.id
                  ? 'text-omedev-green border-omedev-green'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-96 overflow-y-auto">
          {activeTab === 'general' && (
            <>
              {/* API Key */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Key size={14} className="inline mr-1.5" />
                  Clé API Anthropic
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-ant-api03-..."
                  className="omedev-input text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Configurez dans <code className="text-omedev-green">.env.local</code> :
                  <code className="text-xs bg-muted px-1 rounded ml-1">ANTHROPIC_API_KEY=sk-ant-...</code>
                </p>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  🌍 Langue de l&apos;interface
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => updateSettings({ language: e.target.value as 'fr' | 'en' | 'ln' })}
                  className="omedev-input text-sm"
                >
                  <option value="fr">🇫🇷 Français</option>
                  <option value="en">🇬🇧 English</option>
                  <option value="ln">🇨🇩 Lingala</option>
                </select>
              </div>

              {/* Send on Enter */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Entrée pour envoyer</p>
                  <p className="text-xs text-muted-foreground">Maj+Entrée pour nouvelle ligne</p>
                </div>
                <button
                  onClick={() => updateSettings({ sendOnEnter: !settings.sendOnEnter })}
                  className={cn(
                    'relative w-12 h-6 rounded-full transition-colors',
                    settings.sendOnEnter ? 'bg-omedev-green' : 'bg-border'
                  )}
                >
                  <div
                    className={cn(
                      'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform',
                      settings.sendOnEnter ? 'left-7' : 'left-1'
                    )}
                  />
                </button>
              </div>

              {/* Auto save */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Sauvegarde automatique</p>
                  <p className="text-xs text-muted-foreground">Sauvegarder les conversations localement</p>
                </div>
                <button
                  onClick={() => updateSettings({ autoSave: !settings.autoSave })}
                  className={cn(
                    'relative w-12 h-6 rounded-full transition-colors',
                    settings.autoSave ? 'bg-omedev-green' : 'bg-border'
                  )}
                >
                  <div
                    className={cn(
                      'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform',
                      settings.autoSave ? 'left-7' : 'left-1'
                    )}
                  />
                </button>
              </div>
            </>
          )}

          {activeTab === 'model' && (
            <>
              {/* Default Model */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Cpu size={14} className="inline mr-1.5" />
                  Modèle IA par défaut
                </label>
                <div className="space-y-2">
                  {MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => updateSettings({ defaultModel: model.id })}
                      className={cn(
                        'w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all',
                        settings.defaultModel === model.id
                          ? 'border-omedev-green bg-omedev-green/10'
                          : 'border-border hover:border-border/80 hover:bg-accent'
                      )}
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{model.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {model.contextWindow / 1000}K tokens · ${model.costPer1MOutput}/1M output
                        </p>
                      </div>
                      {settings.defaultModel === model.id && (
                        <div className="w-3 h-3 rounded-full bg-omedev-green" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Adaptive thinking */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    <Eye size={14} className="inline mr-1.5" />
                    Afficher le raisonnement
                  </p>
                  <p className="text-xs text-muted-foreground">Voir la pensée adaptative de Claude</p>
                </div>
                <button
                  onClick={() => updateSettings({ showThinking: !settings.showThinking })}
                  className={cn(
                    'relative w-12 h-6 rounded-full transition-colors',
                    settings.showThinking ? 'bg-omedev-green' : 'bg-border'
                  )}
                >
                  <div
                    className={cn(
                      'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform',
                      settings.showThinking ? 'left-7' : 'left-1'
                    )}
                  />
                </button>
              </div>

              {/* Max tokens */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tokens maximum par réponse: <span className="text-omedev-green">{settings.maxTokens.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min="1000"
                  max="64000"
                  step="1000"
                  value={settings.maxTokens}
                  onChange={(e) => updateSettings({ maxTokens: parseInt(e.target.value) })}
                  className="w-full accent-omedev-green"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1K</span>
                  <span>64K</span>
                </div>
              </div>
            </>
          )}

          {activeTab === 'interface' && (
            <>
              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Thème</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'dark', label: 'Sombre', icon: Moon },
                    { value: 'light', label: 'Clair', icon: Sun },
                    { value: 'system', label: 'Système', icon: Monitor },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => updateSettings({ theme: value as 'dark' | 'light' | 'system' })}
                      className={cn(
                        'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-sm transition-all',
                        settings.theme === value
                          ? 'border-omedev-green bg-omedev-green/10 text-omedev-green'
                          : 'border-border hover:bg-accent text-muted-foreground'
                      )}
                    >
                      <Icon size={18} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font size */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Taille de police: <span className="text-omedev-green">{settings.fontSize}px</span>
                </label>
                <input
                  type="range"
                  min="11"
                  max="20"
                  value={settings.fontSize}
                  onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
                  className="w-full accent-omedev-green"
                />
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={14} />
                  <p className="text-sm font-medium text-foreground">Notifications</p>
                </div>
                <button
                  onClick={() => updateSettings({ notifications: !settings.notifications })}
                  className={cn(
                    'relative w-12 h-6 rounded-full transition-colors',
                    settings.notifications ? 'bg-omedev-green' : 'bg-border'
                  )}
                >
                  <div
                    className={cn(
                      'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform',
                      settings.notifications ? 'left-7' : 'left-1'
                    )}
                  />
                </button>
              </div>
            </>
          )}

          {activeTab === 'about' && (
            <div className="space-y-4">
              {/* OMEDEV branding */}
              <div className="flex items-start gap-4 p-4 bg-omedev-green/5 border border-omedev-green/20 rounded-xl">
                <div className="w-12 h-12 omedev-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">O</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground">OMEDEV-AI v1.0.0</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Système Autonome de Génération de Code, Interaction Système et Intelligence Artificielle Avancée
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Développeur</span>
                  <span className="font-medium">OMEDEV SERVICES SARL</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Gérant</span>
                  <span className="font-medium">M. DORODORO Meya Osée</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Adresse</span>
                  <span className="font-medium">75, av. Kabambare, Kinshasa</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-omedev-green font-medium">oseedoro@gmail.com</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Moteur IA</span>
                  <span className="font-medium">Claude Opus 4.8 (Anthropic)</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium text-omedev-green">1.0.0 — Juin 2026</span>
                </div>
              </div>

              {/* Danger zone */}
              <div className="p-3 border border-destructive/30 rounded-xl bg-destructive/5">
                <p className="text-xs font-semibold text-destructive mb-2">Zone dangereuse</p>
                <button
                  onClick={() => {
                    if (confirm('Supprimer toutes les conversations ? Cette action est irréversible.')) {
                      clearAllConversations()
                      onClose()
                    }
                  }}
                  className="text-xs px-3 py-1.5 border border-destructive text-destructive rounded-lg hover:bg-destructive hover:text-white transition-colors"
                >
                  <RotateCcw size={11} className="inline mr-1.5" />
                  Effacer toutes les conversations
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-card/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-omedev-green hover:bg-omedev-green-dark text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Save size={14} />
            {saved ? 'Sauvegardé ✓' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  )
}
