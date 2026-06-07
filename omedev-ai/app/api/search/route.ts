import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query, maxResults = 5 } = body

    if (!query) {
      return Response.json({ error: 'Requête de recherche requise' }, { status: 400 })
    }

    // Use Claude to process and respond to search queries
    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: `Effectue une recherche sur: "${query}"

Fournis une réponse structurée avec:
1. Un résumé des informations principales
2. Les points clés trouvés
3. Des sources recommandées (si connues)
4. Des données récentes pertinentes (jusqu'à ta date de connaissance)

Format: Markdown structuré avec titres et listes.
Limite: ${maxResults} points principaux maximum.`,
        },
      ],
    })

    const content = response.content[0]
    const searchResult =
      content.type === 'text'
        ? content.text
        : 'Résultats non disponibles'

    return Response.json({
      query,
      result: searchResult,
      model: response.model,
      usage: response.usage,
    })
  } catch (error) {
    console.error('Search API error:', error)
    return Response.json(
      { error: 'Erreur lors de la recherche' },
      { status: 500 }
    )
  }
}
