/**
 * Usage: node src/scripts/import-post.mjs
 *
 * Edit the CONFIG section below before running.
 */

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const API_KEY       = '3213a439-b144-47e0-b6bb-046d6a631f4a'
const BASE_URL      = 'http://localhost:3000'
const CATEGORY_SLUG = 'dos-et-sacrum'   // changer selon l'article

const TITLE    = 'Arthrose vertébrale'  // changer
const MARKDOWN = `
## Usure ne veut pas dire fin de partie

Le mot "arthrose" fait souvent l'effet d'une sentence. On s'imagine tout de suite condamné à moins bouger, à "faire attention" pour le reste de ses jours. Pourtant, l'arthrose vertébrale, c'est avant tout un phénomène d'usure normal, un peu comme des semelles de souliers qui s'amincissent avec le kilométrage.

## C'est quoi au juste, l'arthrose vertébrale?

Avec le temps, le cartilage qui recouvre les articulations de la colonne s'amincit et l'os réagit en se remodelant.

## Quand consulter?

- Raideur au dos qui s'installe et limite vos activités
- Douleur qui augmente après les périodes d'inactivité
- Sensation que votre dos "rouille" progressivement
`

// ─────────────────────────────────────────────────────────────────────────────

const HEADERS = {
  'Authorization': `users API-Key ${API_KEY}`,
  'Content-Type': 'application/json',
}

function slugify(str) {
  return str.toString()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().trim()
    .replace(/&/g, 'et')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function makeText(text, format = 0) {
  return { type: 'text', text, format, style: '', mode: 'normal', version: 1, detail: 0 }
}

function parseInline(line) {
  const children = []
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g
  let last = 0, m
  while ((m = regex.exec(line)) !== null) {
    if (m.index > last) children.push(makeText(line.slice(last, m.index)))
    if (m[2]) children.push(makeText(m[2], 1))       // bold
    else if (m[3]) children.push(makeText(m[3], 2))  // italic
    last = m.index + m[0].length
  }
  if (last < line.length) children.push(makeText(line.slice(last)))
  return children.length ? children : [makeText(line)]
}

function markdownToLexical(md) {
  // H3 → H2 : dans les articles de blogue tous les titres de section sont H2
  md = md.replace(/^### /gm, '## ')
  const lines = md.split('\n')
  const nodes = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()

    if (!line) { i++; continue }

    // Headings
    const h2 = line.match(/^## (.+)/)
    const h3 = line.match(/^### (.+)/)
    if (h2 || h3) {
      const tag = h2 ? 'h2' : 'h3'
      const text = (h2 || h3)[1]
      nodes.push({
        type: 'heading', tag, version: 1, format: '', indent: 0,
        direction: 'ltr', textFormat: 0, textStyle: '',
        children: parseInline(text),
      })
      i++; continue
    }

    // Bullet list
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

    // Paragraph
    nodes.push({
      type: 'paragraph', version: 1, format: '', indent: 0,
      direction: 'ltr', textFormat: 0, textStyle: '',
      children: parseInline(line),
    })
    i++
  }

  return { root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: nodes } }
}

async function getCategory(categorySlug) {
  const r = await fetch(`${BASE_URL}/api/condition-categories?where[slug][equals]=${categorySlug}&limit=1`, { headers: HEADERS })
  const data = await r.json()
  return data.docs?.[0] ?? null
}

async function findCondition(title) {
  const slug = slugify(title)
  const r = await fetch(`${BASE_URL}/api/conditions?where[slug][equals]=${slug}&limit=1&depth=0`, { headers: HEADERS })
  const data = await r.json()
  if (data.docs?.[0]) return data.docs[0]

  // Try by title
  const r2 = await fetch(`${BASE_URL}/api/conditions?where[title][like]=${encodeURIComponent(title)}&limit=1&depth=0`, { headers: HEADERS })
  const data2 = await r2.json()
  return data2.docs?.[0] ?? null
}

async function linkConditionToPost(conditionId, postId) {
  const r = await fetch(`${BASE_URL}/api/conditions/${conditionId}`, {
    method: 'PATCH',
    headers: HEADERS,
    body: JSON.stringify({ relatedPost: postId }),
  })
  return r.ok
}

async function run() {
  console.log(`\n📝 Création de l'article: "${TITLE}"`)

  // 1. Récupérer la catégorie
  const category = await getCategory(CATEGORY_SLUG)
  if (!category) {
    console.error(`❌ Catégorie introuvable: ${CATEGORY_SLUG}`)
    process.exit(1)
  }
  console.log(`✓ Catégorie: ${category.title} (${category.id})`)

  // 2. Convertir Markdown → Lexical
  const content = markdownToLexical(MARKDOWN)
  const slug = slugify(TITLE)

  // 3. Créer le post
  const postBody = {
    title: TITLE,
    slug,
    content,
    categories: [category.id],
    _status: 'draft',
  }

  const postRes = await fetch(`${BASE_URL}/api/posts`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(postBody),
  })

  const post = await postRes.json()

  if (!postRes.ok) {
    console.error('❌ Erreur création post:', JSON.stringify(post, null, 2))
    process.exit(1)
  }

  const postId = post.doc?.id ?? post.id
  console.log(`✓ Article créé: /blogue/${slug} (id: ${postId})`)

  // 4. Lier la condition si elle existe
  const condition = await findCondition(TITLE)
  if (condition) {
    const linked = await linkConditionToPost(condition.id, postId)
    if (linked) console.log(`✓ Condition liée: "${condition.title}"`)
    else console.log(`⚠️  Condition trouvée mais lien échoué`)
  } else {
    console.log(`ℹ️  Aucune condition correspondante trouvée pour "${TITLE}"`)
  }

  console.log(`\n✅ Terminé! Ouvre Payload admin pour réviser et publier.\n`)
}

run().catch(console.error)
