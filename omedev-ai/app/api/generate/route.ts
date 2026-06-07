import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export const runtime = 'nodejs'
export const maxDuration = 120

const DOCUMENT_PROMPTS: Record<string, string> = {
  contrat: `Tu es un juriste expert en droit OHADA et droit congolais (RDC).
Rédige un contrat professionnel complet et conforme au droit applicable.
Inclus: parties, objet, conditions, obligations, durée, résiliation, juridiction compétente (OHADA).
Format: Markdown structuré avec numérotation d'articles.`,

  rapport: `Tu es un consultant professionnel expert en rédaction de rapports.
Rédige un rapport complet et structuré.
Inclus: résumé exécutif, contexte, analyse, conclusions, recommandations.
Format: Markdown professionnel avec sections claires.`,

  proposition: `Tu es un expert en business development.
Rédige une proposition commerciale professionnelle et convaincante.
Inclus: présentation OMEDEV SERVICES, problématique client, solution proposée, tarification, prochaines étapes.
Format: Markdown structuré, ton professionnel.`,

  'cahier-charges': `Tu es un architecte logiciel senior.
Rédige un cahier des charges technique complet.
Inclus: contexte, objectifs, spécifications fonctionnelles et techniques, architecture, planning, budget.
Format: Markdown structuré avec sections détaillées.`,
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type = 'rapport', context, title, language = 'fr' } = body

    if (!context) {
      return Response.json({ error: 'Contexte requis' }, { status: 400 })
    }

    const systemPrompt = DOCUMENT_PROMPTS[type] || DOCUMENT_PROMPTS.rapport

    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 8000,
      system: `${systemPrompt}

Langue: ${language === 'fr' ? 'Français' : language === 'en' ? 'English' : 'Lingala/Français'}
Entreprise: OMEDEV SERVICES SARL — 75, avenue Kabambare, Kinshasa, RDC
Date: ${new Date().toLocaleDateString('fr-FR')}`,
      messages: [
        {
          role: 'user',
          content: `Génère un document de type "${type}" avec les informations suivantes:\n\nTitre: ${title || 'Document OMEDEV'}\n\nContexte et contenu:\n${context}`,
        },
      ],
    })

    const content = response.content[0]
    const documentContent = content.type === 'text' ? content.text : ''

    return Response.json({
      success: true,
      content: documentContent,
      type,
      title: title || `Document ${type} - OMEDEV SERVICES`,
      generatedAt: new Date().toISOString(),
      tokens: response.usage,
    })
  } catch (error) {
    console.error('Generate API error:', error)
    return Response.json(
      { error: 'Erreur lors de la génération du document' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return Response.json({
    status: 'OMEDEV-AI Document Generation API',
    types: ['contrat', 'rapport', 'proposition', 'cahier-charges', 'invoice', 'letter'],
  })
}
