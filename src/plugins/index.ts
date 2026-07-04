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

async function callClaude(prompt: string, maxTokens: number): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return ''

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json()
  return data?.content?.[0]?.text?.trim() ?? ''
}

const generateTitle: GenerateTitle<any> = async ({ doc, collectionConfig }) => {
  const collection = collectionConfig?.slug
  const suffix = ` | ${SITE_NAME}`
  const maxTitleChars = 60 - suffix.length

  // Professionals
  if (collection === 'professionals') {
    const name = doc?.name as string | undefined
    const jobTitle = doc?.title as string | undefined
    if (!name) return SITE_NAME
    const base = jobTitle ? `${name} – ${jobTitle}` : name
    return `${base.slice(0, maxTitleChars)}${suffix}`
  }

  // Services
  if (collection === 'services') {
    const title = doc?.title as string | undefined
    if (!title) return SITE_NAME
    const shortDesc = doc?.shortDescription as string | undefined
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return `${title}${suffix}`
    const context = shortDesc ? `\n\nRésumé : ${shortDesc}` : ''
    try {
      const text = await callClaude(
        `Réécris ce nom de service chiropratique pour le SEO en français. Maximum ${maxTitleChars} caractères, clair et précis. Réponds uniquement avec le titre, sans guillemets.\n\nService : ${title}${context}`,
        60,
      )
      return `${(text || title).slice(0, maxTitleChars)}${suffix}`
    } catch {
      return `${title}${suffix}`
    }
  }

  // Condition categories
  if (collection === 'condition-categories') {
    const title = doc?.title as string | undefined
    if (!title) return SITE_NAME
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return `${title}${suffix}`
    try {
      const text = await callClaude(
        `Réécris ce titre de catégorie de conditions traitées en chiropratique pour le SEO en français. Maximum ${maxTitleChars} caractères. Réponds uniquement avec le titre, sans guillemets.\n\nTitre : ${title}`,
        60,
      )
      return `${(text || title).slice(0, maxTitleChars)}${suffix}`
    } catch {
      return `${title}${suffix}`
    }
  }

  // Posts / Pages (default)
  const title = (doc as Post | Page)?.title
  if (!title) return SITE_NAME
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return `${title}${suffix}`
  try {
    const text = await callClaude(
      `Réécris ce titre d'article de blogue chiropratique pour le SEO en français. Maximum ${maxTitleChars} caractères, accrocheur et précis. Réponds uniquement avec le titre, sans guillemets.\n\nTitre original: ${title}`,
      60,
    )
    return `${(text || title).slice(0, maxTitleChars)}${suffix}`
  } catch {
    return `${title}${suffix}`
  }
}

const generateDescription: GenerateDescription<any> = async ({ doc, collectionConfig }) => {
  const collection = collectionConfig?.slug

  // Professionals
  if (collection === 'professionals') {
    const name = doc?.name as string | undefined
    const jobTitle = doc?.title as string | undefined
    const shortBio = doc?.shortBio as string | undefined
    if (!name) return ''
    if (!process.env.ANTHROPIC_API_KEY) {
      return shortBio
        ? shortBio.slice(0, 160)
        : `${name}${jobTitle ? `, ${jobTitle}` : ''} à la Chiropratique St-Roch. Découvrez son approche et prenez rendez-vous.`
    }
    try {
      const context = shortBio ? `\n\nCourte bio : ${shortBio}` : ''
      const text = await callClaude(
        `Génère UNE SEULE phrase de meta description SEO en français pour la page d'un professionnel de santé. Entre 100 et 150 caractères, se termine par un point. Réponds uniquement avec la phrase.\n\nNom : ${name}${jobTitle ? `\nTitre : ${jobTitle}` : ''}${context}`,
        200,
      )
      if (!text) return shortBio?.slice(0, 160) ?? ''
      return text.length <= 160 ? text : text.slice(0, text.lastIndexOf('.', 160) + 1) || text.slice(0, 157) + '...'
    } catch {
      return shortBio?.slice(0, 160) ?? ''
    }
  }

  // Services
  if (collection === 'services') {
    const title = doc?.title as string | undefined
    const shortDescription = doc?.shortDescription as string | undefined
    if (!title) return ''
    if (!process.env.ANTHROPIC_API_KEY) {
      return shortDescription
        ? shortDescription.slice(0, 160)
        : `Découvrez le service ${title} à la Chiropratique St-Roch. Prenez rendez-vous avec notre équipe.`
    }
    try {
      const context = shortDescription ? `\n\nRésumé : ${shortDescription}` : ''
      const text = await callClaude(
        `Génère UNE SEULE phrase de meta description SEO en français pour la page d'un service de clinique chiropratique. Entre 100 et 150 caractères, se termine par un point. Réponds uniquement avec la phrase.\n\nService : ${title}${context}`,
        200,
      )
      if (!text) return shortDescription?.slice(0, 160) ?? ''
      return text.length <= 160 ? text : text.slice(0, text.lastIndexOf('.', 160) + 1) || text.slice(0, 157) + '...'
    } catch {
      return shortDescription?.slice(0, 160) ?? ''
    }
  }

  // Condition categories
  if (collection === 'condition-categories') {
    const title = doc?.title as string | undefined
    const subtitle = doc?.subtitle as string | undefined
    if (!title) return ''
    if (!process.env.ANTHROPIC_API_KEY) {
      return subtitle
        ? subtitle.slice(0, 160)
        : `Découvrez les conditions traitées dans la catégorie ${title} à la Chiropratique St-Roch.`
    }
    try {
      const context = subtitle ? `\n\nSous-titre : ${subtitle}` : ''
      const text = await callClaude(
        `Génère UNE SEULE phrase de meta description SEO en français pour une page de catégorie de conditions traitées en chiropratique. Entre 100 et 150 caractères, se termine par un point. Réponds uniquement avec la phrase.\n\nCatégorie : ${title}${context}`,
        200,
      )
      if (!text) return subtitle?.slice(0, 160) ?? ''
      return text.length <= 160 ? text : text.slice(0, text.lastIndexOf('.', 160) + 1) || text.slice(0, 157) + '...'
    } catch {
      return subtitle?.slice(0, 160) ?? ''
    }
  }

  // Posts / Pages (default)
  const postDoc = doc as Post | Page
  if (!postDoc?.title) return ''
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return `${postDoc.title} — découvrez les causes, les symptômes et comment la chiropratique peut vous aider. Conseils de l'équipe de ${SITE_NAME}.`
  }
  const contentText = extractLexicalText((postDoc as any).content)
  const prompt = contentText
    ? `Voici le titre et le contenu d'un article de blogue pour une clinique de chiropratique:\n\nTitre: ${postDoc.title}\n\nContenu: ${contentText}\n\nGénère UNE SEULE phrase de meta description SEO en français. La phrase doit être complète, se terminer par un point, et faire entre 100 et 150 caractères au total. Réponds uniquement avec la phrase, sans guillemets, sans explication.`
    : `Génère UNE SEULE phrase de meta description SEO en français pour un article de blogue chiropratique intitulé "${postDoc.title}". La phrase doit être complète, se terminer par un point, et faire entre 100 et 150 caractères. Réponds uniquement avec la phrase, sans guillemets, sans explication.`
  try {
    const text = await callClaude(prompt, 200)
    if (!text) return `${postDoc.title} — découvrez les causes, les symptômes et comment la chiropratique peut vous aider. Conseils de l'équipe de ${SITE_NAME}.`
    if (text.length <= 160) return text
    const lastPeriod = text.lastIndexOf('.', 160)
    if (lastPeriod > 80) return text.slice(0, lastPeriod + 1)
    return text.slice(0, 157) + '...'
  } catch {
    return `${postDoc.title} — découvrez les causes, les symptômes et comment la chiropratique peut vous aider. Conseils de l'équipe de ${SITE_NAME}.`
  }
}

const generateURL: GenerateURL<any> = ({ doc, collectionConfig }) => {
  const url = getServerSideURL()

  if (!doc?.slug) return url

  const collection = collectionConfig?.slug

  if (collection === 'posts') return `${url}/blogue/${doc.slug}`
  if (collection === 'services') return `${url}/services/${doc.slug}`
  if (collection === 'professionals') return `${url}/professionnels/${doc.slug}`
  if (collection === 'condition-categories') return `${url}/conditions-traitees/${doc.slug}`

  if (doc.slug === 'home') return url
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
