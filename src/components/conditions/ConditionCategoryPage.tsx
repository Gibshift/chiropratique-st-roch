import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import RichText from '@/components/RichText'

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

  if (!category) {
    notFound()
  }

  const relatedServices: any[] = Array.isArray(category.relatedServices)
    ? category.relatedServices
    : []

  const heroImageUrl =
    category.heroImage &&
    typeof category.heroImage === 'object' &&
    'url' in category.heroImage
      ? category.heroImage.url
      : null

  return (
    <main className="bg-white text-zinc-950">
      {/* Hero */}
      <section className="relative bg-[#f6f1e8]">
        {heroImageUrl && (
          <Image
            src={heroImageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
        )}

        <div className="relative mx-auto flex min-h-[480px] max-w-[1200px] flex-col items-center justify-center px-6 pt-32 text-center lg:px-8 lg:pt-20">
          {category.subtitle && (
            <p className="mb-4 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-red-600">
              {category.subtitle}
            </p>
          )}

          <h1 className="mx-auto max-w-[900px] font-[var(--font-barlow-condensed)] text-[clamp(2.2rem,5.5vw,4.4rem)] font-medium uppercase leading-[1.1] tracking-[0.06em] text-zinc-950">
            {category.title}
          </h1>

          <div className="mx-auto mt-6 h-[3px] w-20 bg-red-600" />
        </div>
      </section>

      {/* Content */}
      <section className="relative z-10 -mt-4 bg-white shadow-[0_-12px_32px_rgba(0,0,0,0.14)]">
        <div className="mx-auto max-w-[860px] px-6 py-20 lg:px-8">

          <a
            href="/conditions-traitees"
            className="mb-12 inline-flex items-center gap-2 text-[0.85rem] font-semibold text-zinc-400 transition hover:text-zinc-950"
          >
            ← Toutes les catégories
          </a>

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
        </div>

        {/* Services liés */}
        {relatedServices.length > 0 && (
          <div className="border-t border-zinc-100 bg-zinc-50 py-16">
            <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
              <p className="text-center text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-red-600">
                Pour vous aider
              </p>
              <h2 className="mt-3 text-center font-[var(--font-barlow-condensed)] text-[clamp(1.4rem,3vw,2rem)] font-medium uppercase tracking-[0.03em] text-zinc-950">
                Nous vous conseillons
              </h2>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedServices.map((service: any) => {
                  const imageUrl =
                    service.featuredImage &&
                    typeof service.featuredImage === 'object' &&
                    'url' in service.featuredImage
                      ? service.featuredImage.url
                      : null

                  return (
                    <a
                      key={service.id}
                      href={`/services/${service.slug}`}
                      className="group flex items-center gap-5 border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:bg-white hover:shadow-sm"
                    >
                      {imageUrl && (
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={service.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-[var(--font-barlow-condensed)] text-[1rem] font-medium uppercase tracking-[0.04em] text-zinc-950">
                          <span className="text-red-600">{(service.title as string).charAt(0)}</span>
                          {(service.title as string).slice(1).toUpperCase()}
                        </p>
                        <span className="mt-1 text-[0.82rem] font-semibold text-red-600 transition group-hover:underline">
                          En savoir plus →
                        </span>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
