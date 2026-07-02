import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Image from 'next/image'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const categoryIcons: Record<string, string> = {
  'tete-et-cou': '/media/condition-cou-et-tete.png',
  'dos-et-sacrum': '/media/condition-dos-et-sacrum.png',
  'machoire': '/media/condition-atm.png',
  'membres-superieurs': '/media/condition-membres-superieurs.png',
  'membres-inferieurs': '/media/condition-membres-inferieurs.png',
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
      <section className="bg-white min-h-[68vh] pt-36 pb-24 lg:pt-78">
        <ScrollReveal>
          <div className="mx-auto max-w-[1200px] px-6 lg:px-8">

            <div className="mb-20 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="font-[var(--font-barlow-condensed)] text-[clamp(2.8rem,5vw,4.5rem)] font-medium uppercase leading-[1.05] text-zinc-950">
                  Peut-on<br />vous aider?
                </h1>
                <div className="mt-5 h-[3px] w-16 bg-red-600" />
              </div>
              <div className="lg:max-w-[42%]">
                <p className="text-[1rem] leading-7 text-zinc-500">
                  Cette section regroupe les conditions fréquemment rencontrées à la clinique pour vous aider à évaluer si nos soins correspondent à ce que vous vivez.
                </p>
              </div>
            </div>

            {categories.docs.length > 0 ? (
              <div className="grid border-l border-zinc-400 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {categories.docs.map((category: any) => {
                  const iconSrc = categoryIcons[category.slug] ?? null

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
                      <div className="mt-8 h-[96px] flex items-end justify-center">
                        {iconSrc ? (
                          <Image
                            src={iconSrc}
                            alt=""
                            width={96}
                            height={96}
                            className="object-contain opacity-80 group-hover:opacity-100 transition-opacity"
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
              <div className="border border-zinc-300 p-10 text-center">
                <p className="text-zinc-500">Aucune catégorie publiée pour le moment.</p>
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
