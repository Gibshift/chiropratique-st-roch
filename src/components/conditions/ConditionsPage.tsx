import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Image from 'next/image'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { GeometricShapes } from '@/components/ui/GeometricShapes'

const JANE_URL = 'https://chiropratiquestroch.janeapp.com'

const categoryIcons: Record<string, string> = {
  'tete-et-cou': '/assets/condition-cou-et-tete.png',
  'dos-et-sacrum': '/assets/condition-dos-et-sacrum-cropped.png',
  'machoire': '/assets/condition-atm.png',
  'membres-superieurs': '/assets/condition-membres-superieurs.png',
  'membres-inferieurs': '/assets/condition-membres-inferieurs-cropped-round.png',
}

const categoryFallbackConditions: Record<string, string[]> = {
  'tete-et-cou': ['Maux de tête cervicaux', 'Torticolis', 'Douleurs au cou', 'Névralgie d\'Arnold'],
  'dos-et-sacrum': ['Lombalgie', 'Hernie discale', 'Sciatique', 'Blocage sacro-iliaque'],
  'machoire': ['Bruxisme', 'Douleurs à la mâchoire', 'Claquements articulaires', 'Limitation d\'ouverture'],
  'membres-superieurs': ['Épicondylite', 'Tendinite à l\'épaule', 'Canal carpien', 'Épaule gelée'],
  'membres-inferieurs': ['Genou du coureur', 'Fasciite plantaire', 'Entorse de cheville', 'Bandelette ilio-tibiale'],
}

function getIconForSlug(slug: string): string | null {
  if (categoryIcons[slug]) return categoryIcons[slug]
  const s = slug.toLowerCase()
  if (s.includes('cou') || s.includes('tete') || s.includes('tête')) return categoryIcons['tete-et-cou']
  if (s.includes('sacrum') || s.includes('dos')) return categoryIcons['dos-et-sacrum']
  if (s.includes('machoire') || s.includes('mâchoire') || s.includes('atm')) return categoryIcons['machoire']
  if (s.includes('super')) return categoryIcons['membres-superieurs']
  if (s.includes('infer')) return categoryIcons['membres-inferieurs']
  return null
}

export async function ConditionsPage() {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'condition-categories' as any,
    limit: 20,
    depth: 0,
    sort: 'order',
  })

  const allConditions = await payload.find({
    collection: 'conditions' as any,
    limit: 200,
    depth: 1,
    sort: 'order',
  })

  const conditionsByCategory = allConditions.docs.reduce((acc: Record<string, any[]>, condition: any) => {
    const catId = typeof condition.categorie === 'object' ? condition.categorie?.id : condition.categorie
    if (catId) {
      if (!acc[catId]) acc[catId] = []
      acc[catId].push(condition)
    }
    return acc
  }, {})

  return (
    <main className="relative bg-white text-zinc-950 isolate">
      <GeometricShapes />

      {/* ─── Section 1 — Hero ─────────────────────────────────────────── */}
      <section className="bg-white pt-36 pb-0 lg:pt-40">
        <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">

            <div className="grid grid-cols-1 lg:grid-cols-[460px_1fr_280px] lg:min-h-[360px]">

              {/* Gauche — message + actions */}
              <div className="flex flex-col justify-center py-8 lg:py-12 lg:pr-16">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">Conditions traitées</p>
                <h1 className="mt-4 font-[var(--font-barlow-condensed)] text-[clamp(2.2rem,5.5vw,4.5rem)] font-medium uppercase leading-[1.0] text-zinc-950">
                  Vous avez<br />mal où?
                </h1>
                <div className="mt-6 h-[2px] w-14 bg-red-600" />
                <p className="mt-6 max-w-[380px] text-[1rem] leading-7 text-zinc-800">
                  Parcourez les conditions que nous traitons et voyez si quelque chose correspond à ce que vous ressentez. Notre équipe est là pour vous orienter.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href={JANE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-[46px] items-center gap-3 border border-red-600 bg-red-600 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-red-600"
                  >
                    <span className="whitespace-nowrap">Prendre rendez-vous</span>
                    <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2.5 w-8 flex-shrink-0 transition duration-200 group-hover:translate-x-1">
                      <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                    </svg>
                  </a>
                  <a
                    href="#conditions-grid"
                    className="inline-flex min-h-[46px] items-center border border-red-600 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-red-600 transition hover:bg-red-600 hover:text-white whitespace-nowrap"
                  >
                    Je ne suis pas certain de où ↓
                  </a>
                </div>
              </div>

              {/* Photo — femme questionnement */}
              <div className="hidden lg:block relative overflow-hidden bg-white">
                <div className="absolute inset-y-8 lg:inset-y-12 left-1/2 w-[260px] -translate-x-1/2">
                  <Image
                    src="/assets/femme-questionnement-siteweb-droite.png"
                    alt=""
                    fill
                    sizes="220px"
                    className="object-contain object-bottom pointer-events-none"
                    priority
                  />
                </div>
              </div>

              {/* Liens rapides — catégories */}
              <div className="hidden lg:flex flex-col justify-center gap-2 self-stretch bg-white px-4 py-6">
                {categories.docs.map((category: any) => {
                  const title = category.title as string
                  return (
                    <a
                      key={category.id}
                      href={`/conditions-traitees/${category.slug}`}
                      className="group flex items-center justify-between border border-zinc-200 bg-white px-4 py-3 transition hover:border-zinc-400 hover:bg-zinc-50"
                    >
                      <span className="font-[var(--font-barlow-condensed)] text-[1rem] font-medium uppercase tracking-[0.01em] text-zinc-700 transition group-hover:text-red-600">
                        <span className="text-red-600">{title.charAt(0)}</span>{title.slice(1)}
                      </span>
                      <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2.5 w-9 flex-shrink-0 text-red-600 transition duration-200 group-hover:translate-x-0.5">
                        <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" strokeLinejoin="miter" />
                      </svg>
                    </a>
                  )
                })}
              </div>

            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── Section 2 — Catégories ───────────────────────────────────── */}
      {categories.docs.length > 0 && (
        <section id="conditions-grid" className="relative z-10 -mt-4 bg-zinc-50 py-10 lg:py-20 shadow-[0_-12px_32px_rgba(0,0,0,0.14)]">
          <ScrollReveal>
            <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">

              <div className="mb-10">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">
                  Conditions fréquentes
                </p>
                <p className="mt-2 font-[var(--font-barlow-condensed)] text-[clamp(1.6rem,3vw,2.4rem)] font-medium uppercase leading-tight text-zinc-950">
                  Parcourez les conditions par région.
                </p>
                <p className="mt-3 max-w-[560px] text-[0.95rem] leading-7 text-zinc-600">
                  Chaque région regroupe les motifs de consultation les plus fréquents. Explorez les conditions qui ressemblent à ce que vous ressentez, puis accédez à la page complète.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {categories.docs.map((category: any) => {
                  const iconSrc = getIconForSlug(category.slug)
                  const dbConditions = (conditionsByCategory[category.id] ?? []).slice(0, 4)
                  const fallback = (categoryFallbackConditions[category.slug] ?? []).map((t) => ({ id: t, title: t }))
                  const conditions = dbConditions.length > 0 ? dbConditions : fallback
                  return (
                    <a
                      key={category.id}
                      href={`/conditions-traitees/${category.slug}`}
                      className="group flex flex-col bg-white border border-zinc-200 px-5 py-6 transition hover:border-zinc-400 hover:shadow-sm"
                    >
                      {/* Illustration circulaire */}
                      <div className="flex h-[120px] w-[120px] flex-shrink-0 items-center justify-center self-center overflow-hidden rounded-full bg-zinc-100">
                        {iconSrc ? (
                          <Image
                            src={iconSrc}
                            alt=""
                            width={120}
                            height={120}
                            className={`h-[120px] w-[120px] object-contain mix-blend-multiply ${category.slug === 'dos-et-sacrum' ? 'p-1' : ''}`}
                          />
                        ) : null}
                      </div>

                      {/* Titre + divider */}
                      <p className="mt-5 min-h-[2.6rem] font-[var(--font-barlow-condensed)] text-[1.05rem] font-semibold uppercase leading-tight tracking-[0.03em] text-zinc-950 text-center">
                        {category.title}
                      </p>
                      <div className="mt-2 mx-auto h-[2px] w-8 bg-red-600" />

                      {/* Bullet list conditions */}
                      {conditions.length > 0 && (
                        <ul className="mt-4 flex flex-col gap-1.5">
                          {conditions.map((cond: any) => (
                            <li key={cond.id} className="flex items-start gap-2 text-[0.82rem] leading-5 text-zinc-600">
                              <span className="mt-[5px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" />
                              {cond.title}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* CTA */}
                      <span className="mt-auto pt-5 inline-flex items-center gap-2 whitespace-nowrap text-[0.62rem] font-bold uppercase tracking-[0.08em] text-red-600 transition group-hover:gap-3">
                        Voir toutes les conditions
                      </span>
                    </a>
                  )
                })}
              </div>

              <div className="mt-10 flex justify-center">
                <a
                  href="#bien-sorienter"
                  className="group inline-flex min-h-[46px] items-center gap-3 border border-red-600 bg-red-600 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-red-600"
                >
                  <span>Besoin qu&apos;on vous guide?</span>
                  <svg aria-hidden="true" viewBox="0 0 20 12" className="h-3 w-5 transition duration-200 group-hover:translate-y-0.5">
                    <path d="M10 1V9M5 5L10 10L15 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                  </svg>
                </a>
              </div>

            </div>
          </ScrollReveal>
        </section>
      )}

      {/* ─── Section 3 — Bien s'orienter ─────────────────────────────── */}
      <section id="bien-sorienter" className="relative z-20 -mt-4 bg-white py-10 lg:py-20 shadow-[0_-12px_32px_rgba(0,0,0,0.14)]">
        <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">

            <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">
              Bien s&apos;orienter
            </p>
            <h2 className="mt-2 font-[var(--font-barlow-condensed)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-medium uppercase leading-tight text-zinc-950">
              Vous ne savez pas quel soin choisir?
            </h2>
            <p className="mt-3 max-w-[560px] text-[0.95rem] leading-7 text-zinc-600">
              Décrivez simplement ce que vous ressentez et notre équipe saura vous orienter!
            </p>

            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">

              {/* Étape 1 */}
              <div className="relative min-h-[190px] overflow-hidden border border-zinc-200 bg-white px-7 py-7 pb-[130px] sm:pb-7 sm:pr-[150px]">
                <div className="flex gap-2">
                  <span className="flex-shrink-0 font-[var(--font-barlow-condensed)] text-[1rem] font-bold text-red-600">1.</span>
                  <div>
                    <p className="font-[var(--font-barlow-condensed)] text-[1rem] font-semibold uppercase leading-tight tracking-[0.03em] text-zinc-950">
                      Dites-nous ce que vous ressentez
                    </p>
                    <p className="mt-4 text-[0.875rem] leading-6 text-zinc-500">
                      Douleur, tension, raideur, limitation de mouvement?
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 flex h-[170px] w-[160px] items-end justify-center" aria-hidden>
                  <Image src="/assets/vous-orienter-page-conditions.png" alt="" width={160} height={160} className="h-[160px] w-auto object-contain pointer-events-none" />
                </div>
              </div>

              {/* Étape 2 */}
              <div className="relative min-h-[190px] overflow-hidden border border-zinc-200 bg-white px-7 py-7 pb-[130px] sm:pb-7 sm:pr-[150px]">
                <div className="flex gap-2">
                  <span className="flex-shrink-0 font-[var(--font-barlow-condensed)] text-[1rem] font-bold text-red-600">2.</span>
                  <div>
                    <p className="font-[var(--font-barlow-condensed)] text-[1rem] font-semibold uppercase leading-tight tracking-[0.03em] text-zinc-950">
                      On vous oriente<br /> au bon service
                    </p>
                    <p className="mt-4 text-[0.875rem] leading-6 text-zinc-500">
                      Laissez-nous vous guider avec nos 5 services!
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 flex h-[170px] w-[160px] items-end justify-center" aria-hidden>
                  <Image src="/assets/receptionnist-siteweb.png" alt="" width={160} height={160} className="h-[160px] w-auto object-contain pointer-events-none" />
                </div>
              </div>

              {/* Étape 3 */}
              <div className="grid grid-cols-[1fr_auto] gap-4 border border-zinc-200 bg-white px-7 py-7">
                <div>
                  <div className="flex gap-2">
                    <span className="flex-shrink-0 font-[var(--font-barlow-condensed)] text-[1rem] font-bold text-red-600">3.</span>
                    <div>
                      <p className="font-[var(--font-barlow-condensed)] text-[1rem] font-semibold uppercase leading-tight tracking-[0.03em] text-zinc-950">
                        Réservez en toute confiance
                      </p>
                      <p className="mt-4 text-[0.875rem] leading-6 text-zinc-500">
                        La prise de rendez-vous est un vrai jeu d&apos;enfant.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex w-[110px] items-center justify-center self-stretch" aria-hidden>
                  <Image src="/assets/calendrier-page-conditions.png" alt="" width={110} height={110} className="h-[110px] w-auto object-contain pointer-events-none" />
                </div>
              </div>

            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="/contact"
                className="group inline-flex w-full items-center justify-center gap-3 border border-red-600 bg-red-600 px-6 min-h-[46px] text-[12px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-red-600 sm:w-auto"
              >
                <span className="whitespace-nowrap">Parler à notre équipe</span>
                <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2.5 w-8 transition duration-200 group-hover:translate-x-1">
                  <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                </svg>
              </a>
              <a
                href={JANE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-full items-center justify-center gap-3 border border-red-600 px-6 min-h-[46px] text-[12px] font-bold uppercase tracking-[0.16em] text-red-600 transition hover:bg-red-600 hover:text-white sm:w-auto"
              >
                <span className="whitespace-nowrap">Prendre rendez-vous</span>
                <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2 w-7 transition duration-200 group-hover:translate-x-0.5">
                  <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
                </svg>
              </a>
            </div>

          </div>
        </ScrollReveal>
      </section>

    </main>
  )
}
