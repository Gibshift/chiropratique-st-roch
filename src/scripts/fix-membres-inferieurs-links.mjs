/**
 * Correction ciblée pour la catégorie Membres inférieurs :
 *   - Ajoute les liens manquants (fuzzy matching avait échoué)
 *   - Corrige le faux positif persistant dans Tête et cou
 *
 * Usage: node src/scripts/fix-membres-inferieurs-links.mjs
 */

const API_KEY  = '3213a439-b144-47e0-b6bb-046d6a631f4a'
const BASE_URL = 'http://localhost:3000'
const HEADERS  = { 'Authorization': `users API-Key ${API_KEY}`, 'Content-Type': 'application/json' }

// ── Liens manquants à ajouter dans Membres inférieurs ─────────────────────

// U+2019 = RIGHT SINGLE QUOTATION MARK used as apostrophe in some DB entries
const Q = '’'

const MEMBRES_INF_FIXES = {
  'Arthrite / Arthrose des hanches, genoux, chevilles':              '/blogue/arthrose-hanche-genou-cheville',
  [`Douleurs à la hanche, au bassin ou à l${Q}aine`]:     '/blogue/douleur-hanche-aine',
  'Douleurs à la cuisse (antérieure ou postérieure)': '/blogue/douleur-cuisse',
  'Douleurs au talon (épine de Lenoir, fasciite plantaire)':    '/blogue/fasciite-plantaire-epine-lenoir',
  [`Douleurs au pied ou à l${Q}arche plantaire`]:               '/blogue/douleur-pied-arche',
  'Fractures de stress (soutien en phase de réadaptation)':     '/blogue/fracture-stress-readaptation',
  'Sensations de décharge ou de brûlure dans les jambes':  '/blogue/douleur-neuropathique-jambes',
  [`Tendinite du moyen fessier ou du tendon d${Q}Achille`]:          '/blogue/tendinite-fessier-achille',
}

// ── Faux positifs à remettre en texte plat ────────────────────────────────

const WRONG_LINKS = {
  'Tête et cou': [
    'Douleurs occipitales (base du crâne, irradiation vers le front)',
  ],
}

// ── Helpers Lexical ────────────────────────────────────────────────────────

function makeTextNode(text) {
  return { mode: 'normal', text, type: 'text', style: '', detail: 0, format: 0, version: 1 }
}

function makeCustomLink(text, url) {
  return {
    type: 'link', version: 3, format: '', indent: 0, direction: null,
    fields: { url, newTab: false, linkType: 'custom' },
    children: [makeTextNode(text)],
  }
}

function getItemText(listitem) {
  const child = listitem.children?.[0]
  if (!child) return null
  if (child.type === 'link') return child.children?.[0]?.text ?? null
  return child.text ?? null
}

// ── API ────────────────────────────────────────────────────────────────────

async function getCategories() {
  const r = await fetch(`${BASE_URL}/api/condition-categories?limit=20&depth=2`, { headers: HEADERS })
  const d = await r.json()
  return d.docs ?? []
}

async function patchCategory(id, conditionsList) {
  const r = await fetch(`${BASE_URL}/api/condition-categories/${id}`, {
    method: 'PATCH', headers: HEADERS,
    body: JSON.stringify({ conditionsList }),
  })
  return r.ok
}

// ── Main ───────────────────────────────────────────────────────────────────

async function run() {
  const categories = await getCategories()

  for (const category of categories) {
    const listRoot = category.conditionsList?.root
    const listNode = listRoot?.children?.find(n => n.type === 'list')
    if (!listNode) continue

    let changed = false

    // ── Membres inférieurs : ajouter les liens manquants ──────────────
    if (category.title === 'Membres inférieurs') {
      console.log('\n── Membres inférieurs ── ajout des liens manquants')
      for (const listitem of listNode.children ?? []) {
        const text = getItemText(listitem)
        if (!text) continue
        const url = MEMBRES_INF_FIXES[text]
        if (!url) continue

        const existingChild = listitem.children?.[0]
        const alreadyLinked = existingChild?.type === 'link' && existingChild?.fields?.url === url
        if (alreadyLinked) { console.log(`  ✓ déjà ok : "${text}"`); continue }

        listitem.children[0] = makeCustomLink(text, url)
        console.log(`  + lié : "${text}" → ${url}`)
        changed = true
      }
    }

    // ── Autres catégories : corriger les faux positifs ─────────────────
    const wrongTexts = WRONG_LINKS[category.title]
    if (wrongTexts) {
      console.log(`\n── ${category.title} ── suppression des faux positifs`)
      for (const listitem of listNode.children ?? []) {
        const text = getItemText(listitem)
        if (!text || !wrongTexts.includes(text)) continue

        const child = listitem.children?.[0]
        if (child?.type !== 'link') { console.log(`  (déjà texte) : "${text}"`); continue }

        listitem.children[0] = makeTextNode(text)
        console.log(`  ✗ supprimé lien : "${text}"`)
        changed = true
      }
    }

    if (changed) {
      const ok = await patchCategory(category.id, category.conditionsList)
      console.log(ok ? `  ✅ mis à jour` : `  ❌ erreur PATCH`)
    }
  }

  console.log('\n✅ Terminé!\n')
}

run().catch(console.error)
