/**
 * Import batch d'articles depuis un fichier Markdown structuré.
 * Usage: node src/scripts/import-posts-batch.mjs
 *
 * Les articles déjà présents (vérification par slug) sont automatiquement ignorés.
 * Les headings H3 (###) sont convertis en H2 dans le contenu importé.
 */

import { readFileSync } from 'fs'

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const API_KEY       = '3213a439-b144-47e0-b6bb-046d6a631f4a'
const BASE_URL      = 'http://localhost:3000'
const CATEGORY_SLUG = 'tete-et-cou'
const MD_FILE_PATH  = 'C:/Users/Mine/Downloads/fiches-blogue-tete-et-cou-SEO.md'

// ─────────────────────────────────────────────────────────────────────────────

const HEADERS = {
  'Authorization': `users API-Key ${API_KEY}`,
  'Content-Type': 'application/json',
}

// ── Markdown → Lexical ───────────────────────────────────────────────────────

function makeText(text, format = 0) {
  return { type: 'text', text, format, style: '', mode: 'normal', version: 1, detail: 0 }
}

function parseInline(line) {
  const children = []
  // bold (**), italic (*), links ([text](url) → plain text)
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\([^)]+\))/g
  let last = 0, m
  while ((m = regex.exec(line)) !== null) {
    if (m.index > last) children.push(makeText(line.slice(last, m.index)))
    if (m[2])      children.push(makeText(m[2], 1))   // bold
    else if (m[3]) children.push(makeText(m[3], 2))   // italic
    else if (m[4]) children.push(makeText(m[4]))      // link → text only
    last = m.index + m[0].length
  }
  if (last < line.length) children.push(makeText(line.slice(last)))
  return children.length ? children : [makeText(line)]
}

function markdownToLexical(md) {
  // H3 → H2 : dans les articles de blogue, tous les titres de section sont H2
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

// ── Parsing du fichier Markdown ───────────────────────────────────────────────

function parseMarkdownFile(filePath) {
  const fileContent = readFileSync(filePath, 'utf-8')
  const articles = []

  // Trouver toutes les positions de début d'article (## N. Titre)
  const titleRegex = /^## \d+\.\s+(.+)$/gm
  const starts = []
  let m
  while ((m = titleRegex.exec(fileContent)) !== null) {
    starts.push({ index: m.index, title: m[1].trim() })
  }

  for (let i = 0; i < starts.length; i++) {
    const start  = starts[i].index
    const end    = i + 1 < starts.length ? starts[i + 1].index : fileContent.length
    const block  = fileContent.slice(start, end)

    // Extraire le slug du bloc SEO
    const slugMatch = block.match(/- Slug\s*:\s*`\/blogue\/([^`]+)`/)
    if (!slugMatch) {
      console.warn(`⚠️  Pas de slug trouvé pour: "${starts[i].title}"`)
      continue
    }
    const slug = slugMatch[1]

    // Contenu = tout entre la ligne de titre et le bloc SEO
    const titleLine  = block.split('\n')[0]
    const contentStart = titleLine.length + 1
    const seoStart   = block.search(/\n---\n\*\*SEO\*\*/)
    const rawContent = seoStart !== -1
      ? block.slice(contentStart, seoStart)
      : block.slice(contentStart)

    // Nettoyer les séparateurs de fin
    const content = rawContent.replace(/\n---\s*$/, '').trim()

    // Extraire le meta title et la meta description du bloc SEO
    const metaTitleMatch = block.match(/- Title tag\s*:\s*`([^`]+)`/)
    const metaDescMatch  = block.match(/- Meta description\s*:\s*`([^`]+)`/)
    const metaTitle      = metaTitleMatch?.[1] ?? null
    const metaDesc       = metaDescMatch?.[1] ?? null

    articles.push({ title: starts[i].title, slug, markdown: content, metaTitle, metaDesc })
  }

  return articles
}

// ── Appels API ────────────────────────────────────────────────────────────────

function slugify(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().trim().replace(/&/g, 'et')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

async function slugExists(slug) {
  const r    = await fetch(`${BASE_URL}/api/posts?where[slug][equals]=${slug}&limit=1&depth=0`, { headers: HEADERS })
  const data = await r.json()
  return (data.docs?.length ?? 0) > 0
}

async function getCategory(categorySlug) {
  const r    = await fetch(`${BASE_URL}/api/condition-categories?where[slug][equals]=${categorySlug}&limit=1`, { headers: HEADERS })
  const data = await r.json()
  return data.docs?.[0] ?? null
}

async function findCondition(title) {
  const slug = slugify(title)
  const r1   = await fetch(`${BASE_URL}/api/conditions?where[slug][equals]=${slug}&limit=1&depth=0`, { headers: HEADERS })
  const d1   = await r1.json()
  if (d1.docs?.[0]) return d1.docs[0]

  const r2 = await fetch(`${BASE_URL}/api/conditions?where[title][like]=${encodeURIComponent(title)}&limit=1&depth=0`, { headers: HEADERS })
  const d2 = await r2.json()
  return d2.docs?.[0] ?? null
}

async function linkConditionToPost(conditionId, postId) {
  const r = await fetch(`${BASE_URL}/api/conditions/${conditionId}`, {
    method: 'PATCH',
    headers: HEADERS,
    body: JSON.stringify({ relatedPost: postId }),
  })
  return r.ok
}

async function importArticle(article, categoryId) {
  if (await slugExists(article.slug)) return 'skipped'

  const postBody = {
    title: article.title,
    slug: article.slug,
    content: markdownToLexical(article.markdown),
    categories: [categoryId],
    _status: 'published',
  }
  if (article.metaTitle || article.metaDesc) {
    postBody.meta = {}
    if (article.metaTitle) postBody.meta.title = article.metaTitle
    if (article.metaDesc)  postBody.meta.description = article.metaDesc
  }

  const postRes = await fetch(`${BASE_URL}/api/posts`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(postBody),
  })

  const post = await postRes.json()

  if (!postRes.ok) {
    const errMsg = post?.errors?.[0]?.message ?? post?.message ?? JSON.stringify(post)
    console.log(`  ❌ ${errMsg}`)
    return 'error'
  }

  const postId = post.doc?.id ?? post.id

  // Tenter de lier la condition correspondante (titre avant le ":")
  const shortTitle = article.title.split(':')[0].trim()
  const condition  = await findCondition(shortTitle)
  if (condition) {
    const ok = await linkConditionToPost(condition.id, postId)
    if (ok) console.log(`  └─ Condition liée: "${condition.title}"`)
  }

  return 'created'
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log(`\n📂 Lecture: ${MD_FILE_PATH}`)
  let articles
  try {
    articles = parseMarkdownFile(MD_FILE_PATH)
  } catch (e) {
    console.error(`❌ Impossible de lire le fichier: ${e.message}`)
    process.exit(1)
  }
  console.log(`📝 ${articles.length} articles trouvés\n`)

  const category = await getCategory(CATEGORY_SLUG)
  if (!category) {
    console.error(`❌ Catégorie introuvable: ${CATEGORY_SLUG}`)
    process.exit(1)
  }
  console.log(`✓ Catégorie: ${category.title} (${category.id})\n`)
  console.log('─'.repeat(65))

  let created = 0, skipped = 0, errors = 0

  for (const article of articles) {
    const label = article.title.slice(0, 52).padEnd(52)
    process.stdout.write(`→ ${label} `)
    const result = await importArticle(article, category.id)

    if (result === 'created')  { console.log('✓ créé');   created++ }
    else if (result === 'skipped') { console.log('⏭  ignoré'); skipped++ }
    else                       { console.log('❌ erreur'); errors++ }
  }

  console.log('─'.repeat(65))
  console.log(`\n✅ Terminé!  Créés: ${created}  |  Ignorés: ${skipped}  |  Erreurs: ${errors}`)
  console.log(`\nOuvre Payload admin pour réviser et publier les articles.\n`)
}

run().catch(console.error)
