import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import RichText from '@/components/RichText'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { GeometricShapes } from '@/components/ui/GeometricShapes'

type Props = {
  slug: string
}

export async function ConditionCategoryPage({ slug }: Props) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'condition-categories' as any,
    limit: 1,
    depth: 2,
    where: { slug: { equals: slug } },
  })

  const category: any = result.docs[0]
  if (!category) notFound()

  const titleFirst = category.title.charAt(0)
  const titleRest = category.title.slice(1)

  return (
    <main className="relative bg-white text-zinc-950">
      <GeometricShapes />

      {/* Hero */}
      <section className="relative pt-24 pb-0 lg:pt-48">
        <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">
            <Breadcrumb crumbs={[
              { label: 'Conditions traitées', href: '/conditions-traitees' },
              { label: category.title },
            ]} />

            <div className="mt-12 mb-12 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="font-[var(--font-barlow-condensed)] text-[clamp(2.8rem,5vw,4.5rem)] font-medium uppercase leading-[1.05] text-zinc-950">
                  <span className="text-red-600">{titleFirst}</span>{titleRest}
                </h1>
              </div>

              <div className="hidden lg:block w-[1px] h-24 flex-shrink-0 self-center bg-red-600" />

              <div className="lg:max-w-[38%]">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-red-600">Conditions traitées</p>
                {category.subtitle && (
                  <p className="mt-3 text-[1rem] leading-7 text-zinc-800">{category.subtitle}</p>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Content */}
      <section className="relative z-10 mx-auto max-w-[1200px] px-6 pb-24 lg:px-8">
        <div className="border-t border-zinc-400 pt-0 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">

          {/* Article principal */}
          <article className="min-w-0">
            {category.regionTitle && (
              <h2 className="mt-6 font-[var(--font-barlow-condensed)] text-[clamp(1.3rem,2.5vw,1.8rem)] font-medium uppercase tracking-[0.04em] text-zinc-950">
                {category.regionTitle}
              </h2>
            )}

            {category.intro && (
              <div className="prose prose-zinc mt-6 max-w-none leading-8">
                <RichText data={category.intro} enableGutter={false} />
              </div>
            )}

            {category.conditionsList && (
              <div className="prose prose-zinc mt-10 max-w-none leading-8 [&_ul]:mt-4 [&_li]:text-zinc-700 [&_strong]:font-semibold [&_strong]:text-zinc-950">
                <RichText data={category.conditionsList} enableGutter={false} />
              </div>
            )}

            {category.disclaimer && (
              <div className="prose prose-zinc mt-10 max-w-none rounded-sm border-l-4 border-red-600 bg-zinc-50 px-6 py-5 text-[0.95rem] leading-7 [&_strong]:font-semibold [&_strong]:text-zinc-950">
                <RichText data={category.disclaimer} enableGutter={false} />
              </div>
            )}

            {/* CTA */}
            <div className="mt-14 border-t border-zinc-100 pt-12 text-center">
              <p className="text-[1.05rem] font-semibold text-zinc-950">
                {category.ctaText || 'Vous vous reconnaissez dans une de ces conditions?'}
              </p>
              <a
                href="/rendez-vous"
                className="mt-6 inline-block bg-red-600 px-8 py-4 font-semibold text-white transition hover:bg-red-700"
              >
                Prendre rendez-vous
              </a>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="mt-12 flex flex-col gap-6 lg:mt-14 lg:sticky lg:top-28 lg:self-start">

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

            {/* Blogue */}
            <div className="border border-zinc-400 bg-white p-6">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-zinc-950">Blogue</p>
              <p className="mt-2 text-[0.9rem] leading-6 text-zinc-700">
                Des articles simples pour mieux comprendre votre santé.
              </p>
              <a href="/blogue" className="mt-4 inline-block text-[1rem] font-semibold text-red-600 transition hover:text-zinc-950">
                Voir nos articles →
              </a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
