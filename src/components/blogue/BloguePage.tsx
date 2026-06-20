import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

const FALLBACK_JANE_URL = 'https://chiropratiquestroch.janeapp.com/embed/book_online'

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
    payload.findGlobal({
      slug: 'site-settings' as any,
      depth: 0,
    }),
  ])

  const settings: any = siteSettings || {}
  const janeUrl = settings.mainJaneUrl || FALLBACK_JANE_URL

  return (
    <main className="bg-white text-zinc-950">
      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-300">
            Blogue santé
          </p>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
                Conseils, prévention et santé musculosquelettique
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
                Des articles simples et utiles pour mieux comprendre les douleurs, les habitudes
                de travail, la posture et les raisons de consulter.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-bold">Une douleur persiste?</h2>

              <p className="mt-3 leading-7 text-zinc-300">
                Vous pouvez prendre rendez-vous directement en ligne avec la clinique.
              </p>

              <a
                href={janeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex rounded-full bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-800"
              >
                Prendre rendez-vous
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
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
                  className="group flex min-h-[280px] flex-col rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-md"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl font-bold text-red-700">
                    +
                  </div>

                  {publishedDate && (
                    <p className="text-sm font-medium text-zinc-500">
                      {publishedDate}
                    </p>
                  )}

                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-950 group-hover:text-red-700">
                    {post.title}
                  </h2>

                  <p className="mt-4 line-clamp-4 leading-7 text-zinc-600">
                    {excerpt}
                  </p>

                  <span className="mt-auto pt-6 font-semibold text-red-700">
                    Lire l’article →
                  </span>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-zinc-300 p-10 text-center">
            <h2 className="text-2xl font-bold">Aucun article publié pour le moment.</h2>

            <p className="mt-4 text-zinc-600">
              Les articles ajoutés dans l’admin apparaîtront ici automatiquement.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}