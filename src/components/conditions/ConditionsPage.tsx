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
                    className="group inline-flex min-h-[46px] items-center gap-3 bg-red-600 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-red-700"
                  >
                    <span>Prendre rendez-vous</span>
                    <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2.5 w-8 transition duration-200 group-hover:translate-x-1">
                      <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                    </svg>
                  </a>
                  <a
                    href="#conditions-grid"
                    className="inline-flex min-h-[46px] items-center border border-zinc-300 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950"
                  >
                    Je ne suis pas certain de l&apos;endroit ↓
                  </a>
                </div>
              </div>

              {/* Photo — femme questionnement */}
              <div className="hidden lg:block relative overflow-hidden bg-white">
                <div className="absolute inset-y-8 lg:inset-y-12 right-15 left-auto w-[260px]">
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
        <section id="conditions-grid" className="bg-zinc-50 py-20">
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
                  const conditions = (conditionsByCategory[category.id] ?? []).slice(0, 4)
                  return (
                    <a
                      key={category.id}
                      href={`/conditions-traitees/${category.slug}`}
                      className="group flex flex-col bg-white border border-zinc-200 px-5 py-6 transition hover:border-zinc-400 hover:shadow-sm"
                    >
                      {/* Illustration circulaire */}
                      <div className="flex h-[90px] w-[90px] items-center justify-center self-center rounded-full bg-zinc-100">
                        {iconSrc ? (
                          <Image
                            src={iconSrc}
                            alt=""
                            width={64}
                            height={64}
                            className={`h-[64px] w-[64px] object-contain mix-blend-multiply ${category.slug === 'dos-et-sacrum' ? 'p-1' : ''}`}
                          />
                        ) : null}
                      </div>

                      {/* Titre + divider */}
                      <p className="mt-5 font-[var(--font-barlow-condensed)] text-[1.05rem] font-semibold uppercase leading-tight tracking-[0.03em] text-zinc-950 text-center">
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
                      <span className="mt-auto pt-5 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.1em] text-red-600 transition group-hover:gap-3">
                        Voir toutes les conditions
                        <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2 w-7 flex-shrink-0 transition duration-200 group-hover:translate-x-0.5">
                          <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
                        </svg>
                      </span>
                    </a>
                  )
                })}
              </div>

            </div>
          </ScrollReveal>
        </section>
      )}

      {/* ─── Section 3 — Bien s'orienter ─────────────────────────────── */}
      <section className="bg-white py-20">
        <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">

            <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">
              Bien s&apos;orienter
            </p>
            <h2 className="mt-2 font-[var(--font-barlow-condensed)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-medium uppercase leading-tight text-zinc-950">
              Vous ne savez pas quel soin choisir?
            </h2>
            <p className="mt-3 max-w-[560px] text-[0.95rem] leading-7 text-zinc-600">
              Décrivez simplement ce que vous ressentez. Notre équipe peut vous aider à choisir le service le plus adapté à votre situation.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">

              {/* Étape 1 */}
              <div className="relative overflow-hidden border border-zinc-200 bg-white px-7 py-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-red-600 font-[var(--font-barlow-condensed)] text-[0.85rem] font-semibold text-red-600">1</span>
                  <p className="font-[var(--font-barlow-condensed)] text-[1rem] font-semibold uppercase leading-tight tracking-[0.03em] text-zinc-950">
                    Dites-nous ce que<br />vous ressentez
                  </p>
                </div>
                <p className="mt-4 text-[0.875rem] leading-6 text-zinc-500">
                  Douleur, tension, engourdissement, raideur ou limitation de mouvement.
                </p>
                <div className="mt-6 flex justify-end" aria-hidden>
                  <svg viewBox="0 0 120 130" className="h-[100px] w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="48" cy="110" rx="28" ry="14" fill="#f1e6dc" />
                    <rect x="28" y="72" width="40" height="42" rx="6" fill="#f1e6dc" />
                    <rect x="41" y="54" width="14" height="20" rx="4" fill="#e8d5c4" />
                    <ellipse cx="48" cy="44" rx="18" ry="20" fill="#f5dfc8" />
                    <path d="M30 38 Q32 20 48 18 Q64 20 66 38 Q60 28 48 30 Q36 28 30 38Z" fill="#5c3d2e" />
                    <circle cx="42" cy="44" r="2" fill="#8b5e3c" />
                    <circle cx="54" cy="44" r="2" fill="#8b5e3c" />
                    <path d="M42 53 Q48 51 54 53" stroke="#8b5e3c" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M28 80 Q18 68 26 56 Q30 50 36 54" stroke="#e8d5c4" strokeWidth="10" strokeLinecap="round" fill="none" />
                    <ellipse cx="37" cy="57" rx="7" ry="5" fill="#f5dfc8" />
                    <path d="M68 80 Q76 90 72 105" stroke="#e8d5c4" strokeWidth="10" strokeLinecap="round" fill="none" />
                    <circle cx="80" cy="48" r="14" fill="#fee2e2" />
                    <path d="M70 56 L76 52" stroke="#fee2e2" strokeWidth="3" strokeLinecap="round" />
                    <text x="74" y="52" fontSize="13" fontWeight="bold" fill="#dc2626" textAnchor="middle">!</text>
                    <circle cx="95" cy="34" r="9" fill="#fee2e2" opacity="0.7" />
                    <text x="95" y="38" fontSize="10" fontWeight="bold" fill="#dc2626" textAnchor="middle">!</text>
                  </svg>
                </div>
              </div>

              {/* Étape 2 */}
              <div className="relative overflow-hidden border border-zinc-200 bg-white px-7 py-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-red-600 font-[var(--font-barlow-condensed)] text-[0.85rem] font-semibold text-red-600">2</span>
                  <p className="font-[var(--font-barlow-condensed)] text-[1rem] font-semibold uppercase leading-tight tracking-[0.03em] text-zinc-950">
                    On vous oriente
                  </p>
                </div>
                <p className="mt-4 text-[0.875rem] leading-6 text-zinc-500">
                  Chiro, ostéo, masso, kiné ou ortho : nous vous guidons vers le soin le plus pertinent.
                </p>
                <div className="mt-6 flex justify-end" aria-hidden>
                  <svg viewBox="0 0 120 130" className="h-[100px] w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="26" y="72" width="44" height="46" rx="6" fill="#ffffff" stroke="#e4e4e7" strokeWidth="1.5" />
                    <path d="M46 72 L50 80 L54 72" fill="#dc2626" />
                    <rect x="42" y="54" width="14" height="20" rx="4" fill="#f0c99a" />
                    <ellipse cx="49" cy="43" rx="18" ry="20" fill="#f5d9a8" />
                    <path d="M31 38 Q33 20 49 18 Q65 20 67 38 Q62 26 49 28 Q36 26 31 38Z" fill="#2d2d2d" />
                    <circle cx="43" cy="43" r="2" fill="#7a4f1e" />
                    <circle cx="55" cy="43" r="2" fill="#7a4f1e" />
                    <path d="M43 52 Q49 55 55 52" stroke="#7a4f1e" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M26 80 Q14 88 16 104" stroke="#f0c99a" strokeWidth="10" strokeLinecap="round" fill="none" />
                    <rect x="4" y="90" width="22" height="28" rx="2" fill="#27272a" />
                    <rect x="7" y="93" width="16" height="20" rx="1" fill="#3f3f46" />
                    <rect x="9" y="95" width="12" height="2" rx="0.5" fill="#dc2626" />
                    <rect x="9" y="99" width="8" height="1.5" rx="0.5" fill="#71717a" />
                    <rect x="9" y="102" width="10" height="1.5" rx="0.5" fill="#71717a" />
                    <path d="M70 80 Q84 74 88 64" stroke="#f0c99a" strokeWidth="10" strokeLinecap="round" fill="none" />
                    <ellipse cx="89" cy="61" rx="7" ry="5" fill="#f5d9a8" transform="rotate(-20 89 61)" />
                    <path d="M93 57 L96 48" stroke="#f5d9a8" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Étape 3 */}
              <div className="relative overflow-hidden border border-zinc-200 bg-white px-7 py-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-red-600 font-[var(--font-barlow-condensed)] text-[0.85rem] font-semibold text-red-600">3</span>
                  <p className="font-[var(--font-barlow-condensed)] text-[1rem] font-semibold uppercase leading-tight tracking-[0.03em] text-zinc-950">
                    Réservez en toute<br />confiance
                  </p>
                </div>
                <p className="mt-4 text-[0.875rem] leading-6 text-zinc-500">
                  Et si ce n&apos;est pas le bon service, nous vous aiderons à réajuster le parcours.
                </p>
                <div className="mt-6 flex justify-end" aria-hidden>
                  <svg viewBox="0 0 120 110" className="h-[90px] w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="20" width="72" height="72" rx="6" fill="#ffffff" stroke="#e4e4e7" strokeWidth="2" />
                    <rect x="10" y="20" width="72" height="22" rx="6" fill="#27272a" />
                    <rect x="10" y="33" width="72" height="9" fill="#27272a" />
                    <rect x="28" y="12" width="6" height="16" rx="3" fill="#71717a" />
                    <rect x="58" y="12" width="6" height="16" rx="3" fill="#71717a" />
                    {[0,1,2,3,4,5,6].map((col) => (
                      <rect key={`h-${col}`} x={18 + col * 10} y="52" width="6" height="6" rx="1" fill="#e4e4e7" />
                    ))}
                    {[0,1,2,3,4,5,6].map((col) => (
                      <rect key={`m-${col}`} x={18 + col * 10} y="63" width="6" height="6" rx="1" fill={col === 2 ? "#fee2e2" : "#e4e4e7"} />
                    ))}
                    {[0,1,2,3,4].map((col) => (
                      <rect key={`b-${col}`} x={18 + col * 10} y="74" width="6" height="6" rx="1" fill="#e4e4e7" />
                    ))}
                    <path d="M76 50 Q76 36 90 32 Q104 36 104 50 Q104 62 90 70 Q76 62 76 50Z" fill="#dc2626" />
                    <path d="M84 51 L88 56 L96 45" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="/contact"
                className="group inline-flex min-h-[46px] items-center gap-3 bg-red-600 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-red-700"
              >
                <span>Parler à notre équipe</span>
                <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2.5 w-8 transition duration-200 group-hover:translate-x-1">
                  <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                </svg>
              </a>
              <a
                href={JANE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-[46px] items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-zinc-600 transition hover:text-zinc-950"
              >
                Prendre rendez-vous
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
