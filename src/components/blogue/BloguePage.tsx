import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'
import { PageHero } from '@/components/ui/PageHero'

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
      <PageHero
        eyebrow="Blogue santé"
        title="La santé, expliquée simplement."
        description="Des articles simples et utiles pour mieux comprendre les douleurs, les habitudes de travail, la posture et les raisons de consulter."
      />

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
                    Lire l'article →
                  </span>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-zinc-300 p-10 text-center">
            <h2 className="text-2xl font-bold">Aucun article publié pour le moment.</h2>

            <p className="mt-4 text-zinc-600">
              Les articles ajoutés dans l'admin apparaîtront ici automatiquement.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}