/**
 * Corrige le contenu des articles importés :
 *   - Réinsère les vrais hyperliens Lexical (au lieu de texte plat)
 *   - Lie les conditions correspondantes via relatedPost
 *
 * Usage: node src/scripts/update-posts-content.mjs
 */

import { readFileSync } from 'fs'

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const API_KEY      = '3213a439-b144-47e0-b6bb-046d6a631f4a'
const BASE_URL     = 'http://localhost:3000'
const MD_FILE_PATH = 'C:/Users/Mine/Downloads/fiches-blogue-tete-et-cou-SEO.md'

// ─────────────────────────────────────────────────────────────────────────────

const HEADERS = {
  'Authorization': `users API-Key ${API_KEY}`,
  'Content-Type': 'application/json',
}

// ── Markdown → Lexical (avec vrais liens) ────────────────────────────────────

function makeText(text, format = 0) {
  return { type: 'text', text, format, style: '', mode: 'normal', version: 1, detail: 0 }
}

function makeLinkNode(text, url) {
  return {
    type: 'link',
    version: 1,
    format: '',
    indent: 0,
    direction: 'ltr',
    fields: {
      url,
      newTab: false,
      linkType: 'custom',
    },
    children: [makeText(text)],
  }
}

function parseInline(line) {
  const children = []
  // bold (**), italic (*), links ([text](url))
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)]+)\))/g
  let last = 0, m
  while ((m = regex.exec(line)) !== null) {
    if (m.index > last) children.push(makeText(line.slice(last, m.index)))
    if (m[2])      children.push(makeText(m[2], 1))           // bold
    else if (m[3]) children.push(makeText(m[3], 2))           // italic
    else if (m[4]) children.push(makeLinkNode(m[4], m[5]))    // link
    last = m.index + m[0].length
  }
  if (last < line.length) children.push(makeText(line.slice(last)))
  return children.length ? children : [makeText(line)]
}

function markdownToLexical(md) {
  md = md.replace(/^### /gm, '## ')
  const lines = md.split('\n')
  const nodes = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()
    if (!line) { i++; continue }

    const h2 = line.match(/^## (.+)/)
    if (h2) {
      nodes.push({
        type: 'heading', tag: 'h2', version: 1, format: '', indent: 0,
        direction: 'ltr', textFormat: 0, textStyle: '',
        children: parseInline(h2[1]),
      })
      i++; continue
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items = []
      let val = 1
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        const text = lines[i].trim().slice(2)
        items.push({
          type: 'listitem', value: val++, version: 1, format: '', indent: 0,
          direction: 'ltr', checked: undefined,
          children: parseInline(text),
        })
        i++
      }
      nodes.push({
        type: 'list', listType: 'bullet', tag: 'ul', start: 1,
        version: 1, format: '', indent: 0, direction: 'ltr',
        children: items,
      })
      continue
    }

    nodes.push({
      type: 'paragraph', version: 1, format: '', indent: 0,
      direction: 'ltr', textFormat: 0, textStyle: '',
      children: parseInline(line),
    })
    i++
  }

  return { root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: nodes } }
}

// ── Parsing du fichier MD ─────────────────────────────────────────────────────

function parseMarkdownFile(filePath) {
  const fileContent = readFileSync(filePath, 'utf-8')
  const articles = []
  const titleRegex = /^## \d+\.\s+(.+)$/gm
  const starts = []
  let m
  while ((m = titleRegex.exec(fileContent)) !== null) {
    starts.push({ index: m.index, title: m[1].trim() })
  }

  for (let i = 0; i < starts.length; i++) {
    const start = starts[i].index
    const end   = i + 1 < starts.length ? starts[i + 1].index : fileContent.length
    const block = fileContent.slice(start, end)

    const slugMatch = block.match(/- Slug\s*:\s*`\/blogue\/([^`]+)`/)
    if (!slugMatch) continue
    const slug = slugMatch[1]

    const titleLine    = block.split('\n')[0]
    const contentStart = titleLine.length + 1
    const seoStart     = block.search(/\n---\n\*\*SEO\*\*/)
    const rawContent   = seoStart !== -1 ? block.slice(contentStart, seoStart) : block.slice(contentStart)
    const content      = rawContent.replace(/\n---\s*$/, '').trim()

    articles.push({ title: starts[i].title, slug, markdown: content })
  }
  return articles
}

// ── Slugify ───────────────────────────────────────────────────────────────────

function slugify(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().trim().replace(/&/g, 'et')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

// ── API helpers ───────────────────────────────────────────────────────────────

async function findPostBySlug(slug) {
  const r = await fetch(`${BASE_URL}/api/posts?where[slug][equals]=${slug}&limit=1&depth=0`, { headers: HEADERS })
  const d = await r.json()
  return d.docs?.[0] ?? null
}

async function findPostByTitle(title) {
  const enc = encodeURIComponent(title)
  const r   = await fetch(`${BASE_URL}/api/posts?where[title][equals]=${enc}&limit=1&depth=0`, { headers: HEADERS })
  const d   = await r.json()
  return d.docs?.[0] ?? null
}

async function patchPost(postId, body) {
  const r = await fetch(`${BASE_URL}/api/posts/${postId}`, {
    method: 'PATCH',
    headers: HEADERS,
    body: JSON.stringify(body),
  })
  return r.ok
}

async function getAllConditions() {
  const r = await fetch(`${BASE_URL}/api/conditions?limit=200&depth=0`, { headers: HEADERS })
  const d = await r.json()
  return d.docs ?? []
}

async function linkConditionToPost(conditionId, postId) {
  const r = await fetch(`${BASE_URL}/api/conditions/${conditionId}`, {
    method: 'PATCH',
    headers: HEADERS,
    body: JSON.stringify({ relatedPost: postId }),
  })
  return r.ok
}

// Matching condition → article par comparaison de slugs
function findBestCondition(article, conditions) {
  const articleSlug  = article.slug
  const shortTitle   = article.title.split(':')[0].trim()
  const shortSlug    = slugify(shortTitle)

  // 1. Correspondance exacte slug
  let match = conditions.find(c => c.slug === articleSlug)
  if (match) return { condition: match, method: 'slug exact' }

  // 2. Correspondance slug du titre court
  match = conditions.find(c => c.slug === shortSlug)
  if (match) return { condition: match, method: 'slug court' }

  // 3. Le slug de la condition est contenu dans celui de l'article
  match = conditions.find(c => articleSlug.startsWith(c.slug))
  if (match) return { condition: match, method: 'slug préfixe' }

  // 4. Le slug de l'article commence par le slug de la condition
  match = conditions.find(c => c.slug && shortSlug.startsWith(c.slug.slice(0, 8)))
  if (match) return { condition: match, method: 'slug partiel' }

  // 5. Titre de la condition inclus dans le titre court de l'article (insensible à la casse)
  const lower = shortTitle.toLowerCase()
  match = conditions.find(c => c.title && lower.includes(c.title.toLowerCase()))
  if (match) return { condition: match, method: 'titre inclus' }

  return null
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log(`\n📂 Lecture: ${MD_FILE_PATH}`)
  const articles = parseMarkdownFile(MD_FILE_PATH)
  console.log(`📝 ${articles.length} articles dans le fichier\n`)

  console.log('📋 Chargement des conditions Payload...')
  const conditions = await getAllConditions()
  console.log(`   ${conditions.length} conditions trouvées\n`)

  console.log('─'.repeat(65))

  let updated = 0, notFound = 0, linked = 0, errors = 0

  for (const article of articles) {
    const label = article.title.slice(0, 50).padEnd(50)
    process.stdout.write(`→ ${label} `)

    // Essayer le slug SEO d'abord, puis le slug généré depuis le titre, puis le titre exact
    let post = await findPostBySlug(article.slug)
    if (!post) post = await findPostBySlug(slugify(article.title))
    if (!post) post = await findPostBySlug(slugify(article.title.split(':')[0].trim()))
    if (!post) post = await findPostByTitle(article.title)
    if (!post) {
      console.log('⚠  post introuvable')
      notFound++
      continue
    }

    // Mettre à jour le contenu avec les vrais liens
    const content = markdownToLexical(article.markdown)
    const ok      = await patchPost(post.id, { content })
    if (!ok) {
      console.log('❌ erreur PATCH')
      errors++
      continue
    }
    console.log('✓ mis à jour')
    updated++

    // Lier la condition correspondante
    const result = findBestCondition(article, conditions)
    if (result) {
      const linkOk = await linkConditionToPost(result.condition.id, post.id)
      if (linkOk) {
        console.log(`  └─ Condition liée [${result.method}]: "${result.condition.title}"`)
        linked++
      }
    }
  }

  console.log('─'.repeat(65))
  console.log(`\n✅ Terminé!  Mis à jour: ${updated}  |  Conditions liées: ${linked}  |  Introuvables: ${notFound}  |  Erreurs: ${errors}\n`)
}

run().catch(console.error)
