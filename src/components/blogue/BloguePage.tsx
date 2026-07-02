import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { PageHero } from '@/components/ui/PageHero'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export async function BloguePage() {
  const payload = await getPayload({ config: configPromise })

  const [posts, siteSettings] = await Promise.all([
    payload.find({
      collection: 'posts',
      draft: false,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      sort: '-publishedAt',
      depth: 1,
    }),
    payload.findGlobal({ slug: 'site-settings' as any, depth: 1 }),
  ])

  const heroImageUrl =
    siteSettings?.blogueHeroImage &&
    typeof siteSettings.blogueHeroImage === 'object' &&
    'url' in siteSettings.blogueHeroImage
      ? (siteSettings.blogueHeroImage as any).url
      : null

  const janeUrl: string = (siteSettings as any)?.mainJaneUrl ?? 'https://chiropratiquestroch.janeapp.com/embed/book_online'

  return (
    <main className="bg-white text-zinc-950">
      <PageHero
        eyebrow="Blogue"
        title={"La santé,\non l'explique."}
        highlight={["l'explique"]}
        lineOffsets={['-0.08em', '-0.04em']}
        description="Des articles simples et utiles pour mieux comprendre les douleurs, les habitudes de travail, la posture et les raisons de consulter."
        imageUrl={heroImageUrl}
        ctaUrl={janeUrl}
      />

      <section className="relative z-10 -mt-4 bg-white shadow-[0_-12px_32px_rgba(0,0,0,0.14)]">
        <ScrollReveal>
        <div className="mx-auto max-w-[1200px] px-6 py-16 lg:px-8">
        {posts.docs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.docs.map((post: any) => {
              const publishedDate =
                typeof post.publishedAt === 'string'
                  ? new Date(post.publishedAt).toLocaleDateString('fr-CA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : null

              const excerpt =
                post.meta?.description ||
                'Lire cet article pour en apprendre davantage sur ce sujet.'

              return (
                <Link
                  key={post.id}
                  href={`/blogue/${post.slug}`}
                  className="group flex min-h-[280px] flex-col border border-zinc-200 bg-white p-7 transition hover:border-red-600"
                >
                  {publishedDate && (
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-400">
                      {publishedDate}
                    </p>
                  )}

                  <h2 className="mt-3 text-xl font-bold tracking-tight text-zinc-950 group-hover:text-red-600">
                    {post.title}
                  </h2>

                  <p className="mt-4 line-clamp-4 leading-7 text-zinc-600">
                    {excerpt}
                  </p>

                  <span className="mt-auto pt-6 font-semibold text-red-600 transition group-hover:text-red-700">
                    Lire l'article →
                  </span>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="border border-zinc-200 p-10 text-center">
            <h2 className="text-2xl font-bold text-zinc-950">Aucun article publié pour le moment.</h2>
            <p className="mt-4 text-zinc-600">Les articles ajoutés dans l'admin apparaîtront ici automatiquement.</p>
          </div>
        )}
        </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
