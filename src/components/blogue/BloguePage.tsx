import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export async function BloguePage() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    sort: '-publishedAt',
    depth: 1,
  })

  return (
    <main className="bg-white text-zinc-950">
      <section className="bg-white pt-36 pb-24 lg:pt-44">
        <ScrollReveal>
          <div className="mx-auto max-w-[1200px] px-6 lg:px-8">

            <div className="mb-20 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="font-[var(--font-barlow-condensed)] text-[clamp(2.8rem,5vw,4.5rem)] font-medium uppercase leading-[1.05] text-zinc-950">
                  La santé,<br />ça s'explique.
                </h1>
                <div className="mt-5 h-[3px] w-16 bg-red-600" />
              </div>
              <div className="lg:max-w-[42%]">
                <p className="text-[1rem] leading-7 text-zinc-500">
                  Des articles simples et utiles pour mieux comprendre les douleurs, les habitudes de travail, la posture et les raisons de consulter.
                </p>
              </div>
            </div>

            {posts.docs.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.docs.map((post: any) => {
                  const publishedDate =
                    typeof post.publishedAt === 'string'
                      ? new Date(post.publishedAt).toLocaleDateString('fr-CA', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })
                      : null
                  const excerpt = post.meta?.description || 'Lire cet article pour en apprendre davantage sur ce sujet.'

                  return (
                    <Link key={post.id} href={`/blogue/${post.slug}`}
                      className="group flex min-h-[280px] flex-col border border-zinc-200 bg-white p-7 transition hover:border-red-600"
                    >
                      {publishedDate && (
                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-400">{publishedDate}</p>
                      )}
                      <h2 className="mt-3 text-xl font-bold tracking-tight text-zinc-950 group-hover:text-red-600">
                        {post.title}
                      </h2>
                      <p className="mt-4 line-clamp-4 leading-7 text-zinc-600">{excerpt}</p>
                      <span className="mt-auto pt-6 font-semibold text-red-600 transition group-hover:text-red-700">
                        Lire l'article →
                      </span>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="border border-zinc-200 p-10 text-center">
                <p className="text-zinc-500">Les articles ajoutés dans l'admin apparaîtront ici automatiquement.</p>
              </div>
            )}

          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
