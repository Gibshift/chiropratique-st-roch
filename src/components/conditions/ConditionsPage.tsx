import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { PageHero } from '@/components/ui/PageHero'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

function ConditionAccent({ index }: { index: number }) {
  const configs = [
    { count: 1, angle: 0 },
    { count: 2, angle: 22.5 },
    { count: 3, angle: 45 },
    { count: 4, angle: 67.5 },
    { count: 5, angle: 90 },
  ]
  const colorPatterns: boolean[][] = [
    [true],
    [false, true],
    [true, false, true],
    [false, true, false, true],
    [true, false, true, false, true],
  ]
  const { count, angle } = configs[index % configs.length]
  const colors = colorPatterns[index % colorPatterns.length]
  const cx = 22
  const cy = 17
  const halfLen = 13
  const gap = 7
  const startY = cy - ((count - 1) * gap) / 2

  return (
    <div className="h-[34px]">
      <svg width="44" height="34" viewBox="0 0 44 34" fill="none">
        <g transform={`rotate(${angle}, ${cx}, ${cy})`}>
          {Array.from({ length: count }).map((_, i) => (
            <line
              key={i}
              x1={cx - halfLen}
              y1={startY + i * gap}
              x2={cx + halfLen}
              y2={startY + i * gap}
              stroke={colors[i] ? '#dc2626' : '#18181b'}
              strokeWidth="2"
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

export async function ConditionsPage() {
  const payload = await getPayload({ config: configPromise })

  const [categories, siteSettings] = await Promise.all([
    payload.find({ collection: 'condition-categories' as any, limit: 20, depth: 0, sort: 'order' }),
    payload.findGlobal({ slug: 'site-settings' as any, depth: 1 }),
  ])

  const heroImageUrl =
    siteSettings?.conditionsHeroImage &&
    typeof siteSettings.conditionsHeroImage === 'object' &&
    'url' in siteSettings.conditionsHeroImage
      ? (siteSettings.conditionsHeroImage as any).url
      : null

  return (
    <main className="bg-white text-zinc-950">
      <PageHero
        title="La clinique, peut-elle vous aider?"
        description="Cette section regroupe les conditions fréquemment rencontrées à la clinique pour vous aider à évaluer si nos soins correspondent à ce que vous vivez."
        imageUrl={heroImageUrl}
      />

      <section className="relative z-10 -mt-4 bg-[#f6f1e8] shadow-[0_-12px_32px_rgba(0,0,0,0.14)]">
        <ScrollReveal>
          <div className="mx-auto max-w-[1200px] px-6 py-24 lg:px-8">

            {categories.docs.length > 0 ? (
              <>
                <h2 className="text-[3rem] font-normal leading-[1] tracking-[-0.03em] text-zinc-950 md:text-[3.4rem]">
                  Choisissez ce qui vous touche.
                </h2>

                <div className="mt-6 h-[3px] w-20 bg-red-600" />

                <div className="mt-16 grid border-l border-zinc-400 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                  {categories.docs.map((category: any, index: number) => (
                    <a
                      key={category.id}
                      href={`/conditions-traitees/${category.slug}`}
                      className="group flex flex-col border-b border-r border-zinc-400 px-6 py-8 transition hover:bg-[#ece5dc]/60 lg:border-b-0"
                    >
                      <p className="flex-1 font-[var(--font-barlow-condensed)] text-[1.05rem] font-semibold uppercase leading-[1.2] tracking-[0.05em] text-zinc-900 group-hover:text-zinc-950">
                        <span className="text-red-600">{category.title.slice(0, 1)}</span>
                        {category.title.slice(1)}
                      </p>

                      {category.hint && (
                        <p className="mt-3 text-[0.78rem] leading-5 text-zinc-500">{category.hint}</p>
                      )}

                      <div className="mt-8">
                        <ConditionAccent index={index} />
                      </div>

                      <span className="mt-4 text-[0.8rem] font-semibold text-red-600 transition group-hover:underline">
                        Voir les conditions →
                      </span>
                    </a>
                  ))}
                </div>
              </>
            ) : (
              <div className="border border-zinc-300 p-10 text-center">
                <h2 className="text-2xl font-bold text-zinc-950">Aucune catégorie publiée pour le moment.</h2>
                <p className="mt-3 text-zinc-600">Ajoutez des catégories dans l'admin Payload pour les afficher ici.</p>
              </div>
            )}

            <div className="mt-16 border-t border-zinc-300 pt-12 text-center">
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
