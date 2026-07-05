import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { GeometricShapes } from '@/components/ui/GeometricShapes'

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

  return (
    <main className="bg-white text-zinc-950">
      <section className="relative bg-white md:min-h-[68vh] pt-44 pb-24 lg:pt-48">
        <GeometricShapes />
        <ScrollReveal>
          <div className="mx-auto max-w-[1200px] px-6 lg:px-8">

            <div className="mb-20 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="whitespace-nowrap font-[var(--font-barlow-condensed)] text-[clamp(2rem,7vw,4.5rem)] font-medium uppercase leading-[1.05] text-zinc-950">
                  Peut-on<br />vous aider?
                </h1>
              </div>

              <div className="hidden lg:block w-[1px] h-24 flex-shrink-0 self-center bg-red-600" />

              <div className="lg:max-w-[38%]">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-red-600">Conditions traitées</p>
                <p className="mt-3 text-[1rem] leading-7 text-zinc-800">
                  Vous avez mal quelque part et vous voulez savoir si nous sommes la bonne clinique pour vous? Parcourez les conditions que nous traitons et voyez si quelque chose correspond à ce que vous ressentez.
                </p>
              </div>
            </div>

            {categories.docs.length > 0 ? (
              <div id="conditions-grid" className="grid border-l border-zinc-400 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {categories.docs.map((category: any) => {
                  const iconSrc = getIconForSlug(category.slug)

                  return (
                    <a key={category.id} href={`/conditions-traitees/${category.slug}`}
                      className="group flex flex-col items-center text-center border-b border-r border-zinc-400 px-6 py-8 transition hover:bg-zinc-50 lg:border-b-0"
                    >
                      <p className="flex-1 font-[var(--font-barlow-condensed)] text-[1.05rem] font-semibold uppercase leading-[1.2] tracking-[0.05em] text-zinc-900 group-hover:text-zinc-950">
                        <span className="text-red-600">{category.title.slice(0, 1)}</span>
                        {category.title.slice(1)}
                      </p>
                      {category.hint && (
                        <p className="mt-3 text-[0.78rem] leading-5 text-zinc-500">{category.hint}</p>
                      )}
                      <div className="mt-8 h-[96px] w-[96px] flex items-end justify-center overflow-hidden">
                        {iconSrc ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={iconSrc}
                            alt={`Illustration ${category.title.toLowerCase()}`}
                            width={96}
                            height={96}
                            className={`h-[96px] w-[96px] object-contain opacity-80 group-hover:opacity-100 transition-opacity mix-blend-multiply ${ category.slug === 'dos-et-sacrum' ? 'p-3' : category.slug === 'membres-inferieurs' ? 'p-1' : '' }`}
                          />
                        ) : null}
                      </div>
                      <span className="mt-10 inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-red-600 transition-transform duration-300 group-hover:scale-110 origin-center">
                        Voir les conditions
                        <span className="inline-block translate-x-0 transition-transform duration-300 group-hover:translate-x-2">→</span>
                      </span>
                    </a>
                  )
                })}
              </div>
            ) : (
              <div className="border border-zinc-400 p-10 text-center">
                <p className="text-zinc-500">Aucune catégorie publiée pour le moment.</p>
              </div>
            )}

            <div className="mt-16 border-t border-zinc-400 pt-12 text-center">
              <p className="text-[1rem] leading-8 text-zinc-600">
                Vous ne trouvez pas votre condition?{' '}
                <a href="/contact" className="font-semibold text-zinc-950 underline underline-offset-4 hover:text-red-600">
                  Contactez-nous
                </a>
                {' '}et nous serons heureux de répondre à vos questions!
              </p>
            </div>

          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
