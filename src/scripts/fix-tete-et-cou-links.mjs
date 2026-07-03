const API_KEY  = '3213a439-b144-47e0-b6bb-046d6a631f4a'
const BASE_URL = 'http://localhost:3000'
const HEADERS  = { 'Authorization': 'users API-Key ' + API_KEY, 'Content-Type': 'application/json' }

const FIXES = {
  'Céphalées de tension (maux de tête liés au stress ou à la posture)': '/blogue/cephalees-tension',
  'Cervicalgie (douleur au cou aiguë ou chronique)':                    '/blogue/cervicalgie-douleur-cou',
  'Commotion cérébrale (suivi complémentaire en récupération)':         '/blogue/commotion-cerebrale-role-du-cou',
  'Douleurs cervicales liées à une mauvaise posture (télétravail, écran)': '/blogue/cou-teletravail-ecrans',
  'Douleurs cervico-crâniennes (cou qui cause mal de tête)':            '/blogue/cephalee-cervicogenique',
  'Douleurs du haut du trapèze et de la nuque':                        '/blogue/douleur-trapeze-nuque',
  'Douleurs occipitales (base du crâne, irradiation vers le front)':   '/blogue/douleur-occipitale',
  'Douleurs post-traumatiques au cou (ex. : accident de voiture, chute)': '/blogue/whiplash-coup-lapin',
  'Fatigue visuelle liée aux tensions du cou':                         '/blogue/fatigue-visuelle-tensions-cou',
  'Mal de tête fréquent, rebond, ou matinal':                          '/blogue/mal-de-tete-frequent-rebond',
  'Migraines avec ou sans aura (prise en charge complémentaire)':      '/blogue/migraines-approche-complementaire',
  "Névralgie d'Arnold (douleur en bande derrière la tête)":            '/blogue/nevralgie-arnold',
  'Raideurs cervicales (mobilité limitée, sensation de blocage)':      '/blogue/raideurs-cervicales',
  'Raideur posturale due au travail de bureau ou aux écrans':          '/blogue/cou-teletravail-ecrans',
  'Tensions musculaires profondes ou superficielles':                  '/blogue/tensions-profondes-superficielles',
  'Torticolis (coup bloqué soudainement, souvent au réveil)':          '/blogue/torticolis',
  'Torticolis congénital (chez le nourrisson – suivi en douceur)': '/blogue/torticolis-congenital-nourrisson',
  "Vertiges d'origine cervicale (sensation d'instabilité ou de tête légère)": '/blogue/vertiges-origine-cervicale',
}

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

async function getCategories() {
  const r = await fetch(BASE_URL + '/api/condition-categories?limit=20&depth=2', { headers: HEADERS })
  const d = await r.json()
  return d.docs ?? []
}
async function patchCategory(id, conditionsList) {
  const r = await fetch(BASE_URL + '/api/condition-categories/' + id, {
    method: 'PATCH', headers: HEADERS,
    body: JSON.stringify({ conditionsList }),
  })
  return r.ok
}

async function run() {
  const categories = await getCategories()
  const cat = categories.find(c => c.title === 'Tête et cou')
  if (!cat) { console.error('Catégorie introuvable'); return }

  const listNode = cat.conditionsList?.root?.children?.find(n => n.type === 'list')
  if (!listNode) { console.error('Pas de liste'); return }

  let changed = false
  console.log('\n── Tête et cou ── liaison des conditions')

  for (const listitem of listNode.children ?? []) {
    const text = getItemText(listitem)
    if (!text) continue
    const url = FIXES[text]
    if (!url) continue

    const existingChild = listitem.children?.[0]
    const alreadyLinked = existingChild?.type === 'link' && existingChild?.fields?.url === url
    if (alreadyLinked) { console.log('  already ok: ' + text); continue }

    listitem.children[0] = makeCustomLink(text, url)
    console.log('  + lié : ' + text + ' -> ' + url)
    changed = true
  }

  if (changed) {
    const ok = await patchCategory(cat.id, cat.conditionsList)
    console.log(ok ? '  mis à jour' : '  ERREUR PATCH')
  } else {
    console.log('  (aucun changement)')
  }
  console.log('\nTerminé!\n')
}

run().catch(console.error)