/**
 * Corrige et complète les liens dans conditionsList des catégories de conditions.
 *
 * - Convertit les liens internes Payload (linkType: internal) en liens custom (URL explicite)
 * - Ajoute les liens manquants pour les items en texte plat
 * - Cherche le post correspondant par correspondance fuzzy du texte
 *
 * Usage: node src/scripts/fix-condition-links.mjs
 */

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const API_KEY  = '3213a439-b144-47e0-b6bb-046d6a631f4a'
const BASE_URL = 'http://localhost:3000'

const HEADERS = {
  'Authorization': `users API-Key ${API_KEY}`,
  'Content-Type': 'application/json',
}

// ── Utilitaires ───────────────────────────────────────────────────────────────

function slugify(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().trim()
    .replace(/\(.+?\)/g, '')   // retire les parenthèses et leur contenu
    .replace(/&/g, 'et')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Score de similarité entre deux slugs (0–1)
function similarity(a, b) {
  if (a === b) return 1
  if (b.startsWith(a) || a.startsWith(b)) return 0.9
  const wordsA = a.split('-')
  const wordsB = b.split('-')
  const common = wordsA.filter(w => wordsB.includes(w)).length
  return common / Math.max(wordsA.length, wordsB.length)
}

// Trouver le meilleur post pour un label de condition
function findBestPost(label, posts) {
  const labelSlug = slugify(label)

  // 1. Correspondance exacte
  let match = posts.find(p => p.slug === labelSlug)
  if (match) return match

  // 2. Le slug du post correspond à une partie du label
  match = posts.find(p => labelSlug.startsWith(p.slug) || p.slug.startsWith(labelSlug))
  if (match) return match

  // 3. Meilleure correspondance par score
  let best = null, bestScore = 0
  for (const post of posts) {
    const score = similarity(labelSlug, post.slug)
    if (score > bestScore) { bestScore = score; best = post }
  }
  if (bestScore >= 0.4) return best

  return null
}

// ── Nœuds Lexical ─────────────────────────────────────────────────────────────

function makeCustomLinkNode(text, url, existingNode = null) {
  return {
    ...(existingNode ?? {}),
    type: 'link',
    version: existingNode?.version ?? 3,
    format: existingNode?.format ?? '',
    indent: existingNode?.indent ?? 0,
    direction: existingNode?.direction ?? null,
    fields: {
      url,
      newTab: false,
      linkType: 'custom',
    },
    children: [
      {
        mode: 'normal',
        text,
        type: 'text',
        style: '',
        detail: 0,
        format: 0,
        version: 1,
      },
    ],
  }
}

// Extraire le texte d'un listitem (avec ou sans lien)
function getListItemText(listitem) {
  const child = listitem.children?.[0]
  if (!child) return null
  if (child.type === 'link') {
    return child.children?.[0]?.text ?? null
  }
  return child.text ?? null
}

// Extraire le slug existant d'un lien interne
function getInternalSlug(listitem) {
  const child = listitem.children?.[0]
  if (child?.type !== 'link') return null
  const doc = child.fields?.doc
  if (!doc) return null
  if (typeof doc.value === 'object') return doc.value?.slug ?? null
  return null
}

// ── API ───────────────────────────────────────────────────────────────────────

async function getAllPosts() {
  const r = await fetch(`${BASE_URL}/api/posts?limit=200&depth=0`, { headers: HEADERS })
  const d = await r.json()
  return d.docs ?? []
}

async function getAllCategories() {
  const r = await fetch(`${BASE_URL}/api/condition-categories?limit=20&depth=2`, { headers: HEADERS })
  const d = await r.json()
  return d.docs ?? []
}

async function patchCategory(id, conditionsList) {
  const r = await fetch(`${BASE_URL}/api/condition-categories/${id}`, {
    method: 'PATCH',
    headers: HEADERS,
    body: JSON.stringify({ conditionsList }),
  })
  return r.ok
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log('\n📋 Chargement des posts...')
  const posts = await getAllPosts()
  console.log(`   ${posts.length} posts disponibles`)

  console.log('📂 Chargement des catégories de conditions...')
  const categories = await getAllCategories()
  console.log(`   ${categories.length} catégories trouvées\n`)

  let totalFixed = 0, totalSkipped = 0, totalNotFound = 0

  for (const category of categories) {
    const listRoot = category.conditionsList?.root
    if (!listRoot) {
      console.log(`⏭  ${category.title} — pas de conditionsList, ignoré`)
      continue
    }

    console.log(`\n── ${category.title} ──────────────────────────────────`)

    // Trouver le nœud liste principal
    const listNode = listRoot.children?.find(n => n.type === 'list')
    if (!listNode) {
      console.log('   Pas de nœud liste trouvé')
      continue
    }

    let changed = false

    for (const listitem of listNode.children ?? []) {
      const text = getListItemText(listitem)
      if (!text) continue

      const existingChild = listitem.children?.[0]
      const isLink = existingChild?.type === 'link'
      const isInternal = isLink && existingChild?.fields?.linkType === 'internal'
      const isCustom = isLink && existingChild?.fields?.linkType === 'custom'

      // Déjà un lien custom correct → skip
      if (isCustom && existingChild?.fields?.url?.startsWith('/blogue/')) {
        console.log(`  ✓ déjà lié  : "${text}"`)
        totalSkipped++
        continue
      }

      // Lien interne → récupérer le slug et convertir en custom
      if (isInternal) {
        const slug = getInternalSlug(listitem) ?? findBestPost(text, posts)?.slug
        if (slug) {
          listitem.children[0] = makeCustomLinkNode(text, `/blogue/${slug}`, existingChild)
          console.log(`  ↻ converti  : "${text}" → /blogue/${slug}`)
          changed = true
          totalFixed++
        } else {
          console.log(`  ⚠  intro-   : "${text}" — slug introuvable`)
          totalNotFound++
        }
        continue
      }

      // Texte plat → trouver le post et ajouter un lien
      const post = findBestPost(text, posts)
      if (post) {
        listitem.children[0] = makeCustomLinkNode(text, `/blogue/${post.slug}`)
        console.log(`  + ajouté    : "${text}" → /blogue/${post.slug}`)
        changed = true
        totalFixed++
      } else {
        console.log(`  ✗ introuvable: "${text}"`)
        totalNotFound++
      }
    }

    if (changed) {
      const ok = await patchCategory(category.id, category.conditionsList)
      console.log(ok ? `\n  ✅ Catégorie mise à jour` : `\n  ❌ Erreur PATCH`)
    } else {
      console.log('\n  (aucun changement)')
    }
  }

  console.log('\n' + '─'.repeat(60))
  console.log(`✅ Terminé!  Corrigés/Ajoutés: ${totalFixed}  |  Déjà OK: ${totalSkipped}  |  Introuvables: ${totalNotFound}\n`)
}

run().catch(console.error)
