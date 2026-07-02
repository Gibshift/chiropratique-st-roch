import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateDescription, GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'

import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { extractLexicalText } from '@/utilities/extractLexicalText'

const SITE_NAME = 'Chiropratique St-Roch'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | ${SITE_NAME}` : SITE_NAME
}

const generateDescription: GenerateDescription<Post | Page> = async ({ doc }) => {
  if (!doc?.title) return ''

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return `${doc.title} — découvrez les causes, les symptômes et comment la chiropratique peut vous aider. Conseils de l'équipe de ${SITE_NAME}.`
  }

  const contentText = extractLexicalText((doc as any).content)

  const prompt = contentText
    ? `Voici le titre et le contenu d'un article de blogue pour une clinique de chiropratique:\n\nTitre: ${doc.title}\n\nContenu: ${contentText}\n\nGénère UNE SEULE phrase de meta description SEO en français. La phrase doit être complète, se terminer par un point, et faire entre 100 et 150 caractères au total. Réponds uniquement avec la phrase, sans guillemets, sans explication.`
    : `Génère UNE SEULE phrase de meta description SEO en français pour un article de blogue chiropratique intitulé "${doc.title}". La phrase doit être complète, se terminer par un point, et faire entre 100 et 150 caractères. Réponds uniquement avec la phrase, sans guillemets, sans explication.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const text = data?.content?.[0]?.text?.trim() ?? ''

    if (text.length <= 160) return text

    const lastPeriod = text.lastIndexOf('.', 160)
    if (lastPeriod > 80) return text.slice(0, lastPeriod + 1)
    return text.slice(0, 157) + '...'
  } catch {
    return `${doc.title} — découvrez les causes, les symptômes et comment la chiropratique peut vous aider. Conseils de l'équipe de ${SITE_NAME}.`
  }
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  if (!doc?.slug) {
    return url
  }

  if (doc.slug === 'home') {
    return url
  }

  return `${url}/${doc.slug}`
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
  // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description:
                  'Un rebuild du site peut être nécessaire après avoir modifié une redirection.',
              },
            }
          }

          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),

  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),

  seoPlugin({
    generateTitle,
    generateURL,
    generateDescription,
  }),
]
