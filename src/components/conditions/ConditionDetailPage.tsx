import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import RichText from '@/components/RichText'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { GeometricShapes } from '@/components/ui/GeometricShapes'

type Props = {
  slug: string
  categorySlug?: string
}

export async function ConditionDetailPage({ slug, categorySlug }: Props) {
  const payload = await getPayload({ config: configPromise })

  const conditionResult = await payload.find({
    collection: 'conditions' as any,
    limit: 1,
    depth: 2,
    where: { slug: { equals: slug } },
  })

  const condition: any = conditionResult.docs[0]
  if (!condition) notFound()

  const relatedPost: any = condition.relatedPost && typeof condition.relatedPost === 'object'
    ? condition.relatedPost
    : null


  // Breadcrumb: try to get parent category
  const crumbs: { label: string; href?: string }[] = [
    { label: 'Conditions traitées', href: '/conditions-traitees' },
  ]
  if (categorySlug && condition.category && typeof condition.category === 'object') {
    crumbs.push({ label: condition.category.title, href: `/conditions-traitees/${categorySlug}` })
  }
  crumbs.push({ label: condition.title })

  const titleFirst = condition.title.charAt(0)
  const titleRest = condition.title.slice(1)

  return (
    <main className="relative bg-white text-zinc-950">
      <GeometricShapes />

      {/* Hero */}
      <section className="relative pt-24 pb-0 lg:pt-48">
        <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">
            <Breadcrumb crumbs={crumbs} />

            <div className="mt-12 mb-12 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="font-[var(--font-barlow-condensed)] text-[clamp(2.8rem,5vw,4.5rem)] font-medium uppercase leading-[1.05] text-zinc-950">
                  <span className="text-red-600">{titleFirst}</span>{titleRest}
                </h1>
              </div>

              <div className="hidden lg:block w-[1px] h-24 flex-shrink-0 self-center bg-red-600" />

              <div className="lg:max-w-[38%]">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-red-600">Condition traitée</p>
                {condition.shortDescription && (
                  <p className="mt-3 text-[1rem] leading-7 text-zinc-800">{condition.shortDescription}</p>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Content */}
      <section className="relative z-10 mx-auto max-w-[1200px] px-6 pb-24 lg:px-8">
        <div className="border-t border-zinc-400 pt-0 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">

          {/* Article principal */}
          <article className="min-w-0">
            {condition.commonSymptoms?.length > 0 && (
              <div className="mb-10 border border-zinc-400 bg-zinc-50 p-6 md:p-8">
                <h2 className="text-[1.1rem] font-semibold uppercase tracking-[0.04em] text-zinc-950">
                  Symptômes fréquents
                </h2>
                <ul className="mt-5 grid gap-3 md:grid-cols-2">
                  {condition.commonSymptoms.map((item: any) => (
                    <li key={item.id} className="border border-zinc-400 bg-white p-4 text-[0.9rem] text-zinc-700">
                      {item.symptom}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {condition.intro ? (
              <div className="border border-zinc-400 bg-white p-6 shadow-sm md:p-10">
                <RichText data={condition.intro} enableGutter={false} />
              </div>
            ) : (
              <div className="border border-zinc-400 bg-zinc-50 p-8">
                <p className="text-[0.95rem] leading-7 text-zinc-600">
                  Le contenu de cette condition sera ajouté prochainement.
                </p>
              </div>
            )}

            {condition.whenToConsult && (
              <div className="mt-10 border border-zinc-400 bg-zinc-50 p-6 md:p-10">
                <h2 className="mb-6 text-[1.1rem] font-semibold uppercase tracking-[0.04em] text-zinc-950">
                  Quand consulter?
                </h2>
                <RichText data={condition.whenToConsult} enableGutter={false} />
              </div>
            )}

            {/* CTA */}
            <div className="mt-10 border-t border-zinc-100 pt-10 text-center">
              <p className="text-[1rem] font-semibold text-zinc-950">
                Vous pensez souffrir de {condition.title.toLowerCase()}?
              </p>
              <a
                href="/rendez-vous"
                className="mt-5 inline-block bg-red-600 px-8 py-4 font-semibold text-white transition hover:bg-red-700"
              >
                Prendre rendez-vous
              </a>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="mt-12 flex flex-col gap-6 lg:mt-14 lg:sticky lg:top-28 lg:self-start">

            {/* Lien vers l'article de blogue */}
            {relatedPost && (
              <a
                href={`/blogue/${relatedPost.slug}`}
                className="group block border border-red-200 bg-red-50 p-6 transition hover:border-red-300 hover:bg-red-100"
              >
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-red-600">
                  Article de blogue
                </p>
                <p className="mt-2 font-[var(--font-barlow-condensed)] text-[1.05rem] font-medium uppercase leading-[1.2] text-zinc-950">
                  {relatedPost.title}
                </p>
                <span className="mt-4 inline-block text-[1rem] font-semibold text-red-600 transition group-hover:underline">
                  Lire l&apos;article →
                </span>
              </a>
            )}

            {/* Services */}
            <div className="border border-zinc-400 bg-white p-6">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-zinc-950">Services</p>
              <p className="mt-2 text-[0.9rem] leading-6 text-zinc-700">
                Découvrez l&apos;ensemble des soins offerts à la clinique.
              </p>
              <a href="/services" className="mt-4 inline-block text-[1rem] font-semibold text-red-600 transition hover:text-zinc-950">
                Voir tous nos services →
              </a>
            </div>

            {/* Professionnels */}
            <div className="border border-zinc-400 bg-white p-6">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-zinc-950">Professionnels</p>
              <p className="mt-2 text-[0.9rem] leading-6 text-zinc-700">
                Rencontrez les professionnels de la clinique.
              </p>
              <a href="/professionnels" className="mt-4 inline-block text-[1rem] font-semibold text-red-600 transition hover:text-zinc-950">
                Voir tous nos professionnels →
              </a>
            </div>

            {/* Contact */}
            <div className="border border-zinc-400 bg-zinc-50 p-6">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-zinc-950">
                Clinique St-Roch
              </p>
              <p className="mt-3 text-[0.88rem] leading-6 text-zinc-600">
                Notre équipe est là pour évaluer votre condition et vous proposer une approche adaptée.
              </p>
              <a
                href="/rendez-vous"
                className="mt-4 inline-block bg-red-600 px-5 py-3 text-[0.82rem] font-semibold text-white transition hover:bg-red-700"
              >
                Prendre rendez-vous
              </a>
            </div>
          </aside>
        </div>

        {/* Services liés (section large) */}
        {condition.relatedServices?.length > 0 && (
          <div className="border-t border-zinc-100 bg-zinc-50 py-14">
            <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-red-600">
                Pour vous aider
              </p>
              <h2 className="mt-2 font-[var(--font-barlow-condensed)] text-[clamp(1.4rem,3vw,2rem)] font-medium uppercase tracking-[0.03em] text-zinc-950">
                Nos services associés
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {condition.relatedServices.map((service: any) => (
                  <a
                    key={service.id}
                    href={`/services/${service.slug}`}
                    className="group flex items-center gap-4 border border-zinc-400 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
                  >
                    <div>
                      <p className="font-[var(--font-barlow-condensed)] text-[0.95rem] font-medium uppercase tracking-[0.04em] text-zinc-950">
                        <span className="text-red-600">{(service.title as string).charAt(0)}</span>
                        {(service.title as string).slice(1).toUpperCase()}
                      </p>
                      <span className="mt-1 block text-[1rem] font-semibold text-red-600 transition group-hover:underline">
                        En savoir plus →
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
