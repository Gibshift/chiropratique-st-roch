/**
 * Supprime des items sans lien de la conditionsList d'une catégorie.
 * Usage: node src/scripts/remove-unlinked-conditions.mjs
 */

const API_KEY  = '3213a439-b144-47e0-b6bb-046d6a631f4a'
const BASE_URL = 'http://localhost:3000'
const HEADERS  = { 'Authorization': `users API-Key ${API_KEY}`, 'Content-Type': 'application/json' }

const TO_REMOVE = {
  'Membres supérieurs': [
    'Douleurs interscapulaires',
    'Douleurs posturales liées au travail de bureau',
    'Sensation de nerf coincé au niveau du bras ou du poignet',
  ],
}

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

function getItemText(listitem) {
  const child = listitem.children?.[0]
  if (!child) return null
  if (child.type === 'link') return child.children?.[0]?.text ?? null
  return child.text ?? null
}

async function run() {
  const categories = await getCategories()

  for (const category of categories) {
    const textsToRemove = TO_REMOVE[category.title]
    if (!textsToRemove) continue

    const listRoot = category.conditionsList?.root
    const listNode = listRoot?.children?.find(n => n.type === 'list')
    if (!listNode) continue

    console.log(`\n── ${category.title} ──`)
    const before = listNode.children.length
    listNode.children = listNode.children.filter(listitem => {
      const text = getItemText(listitem)
      if (text && textsToRemove.includes(text)) {
        console.log(`  ✗ supprimé : "${text}"`)
        return false
      }
      return true
    })
    const removed = before - listNode.children.length

    if (removed > 0) {
      const ok = await patchCategory(category.id, category.conditionsList)
      console.log(ok ? `  ✅ mis à jour (${removed} supprimé(s))` : `  ❌ erreur PATCH`)
    } else {
      console.log('  (aucun item correspondant trouvé)')
    }
  }

  console.log('\n✅ Terminé!\n')
}

run().catch(console.error)
