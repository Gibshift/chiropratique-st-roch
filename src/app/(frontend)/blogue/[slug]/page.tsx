import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'
import { getOpenGraphImages } from '@/utilities/seo'

import PageClient from '../../posts/[slug]/page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return posts.docs.map(({ slug }) => {
    return { slug }
  })
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}


export default async function BloguePost({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/blogue/' + decodedSlug

  const payload = await getPayload({ config: configPromise })

  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

    const postData: any = post

  const relatedProfessionals = Array.isArray(postData.relatedProfessionals)
    ? postData.relatedProfessionals
    : []

  const publishedDate =
    typeof post.publishedAt === 'string'
      ? new Date(post.publishedAt).toLocaleDateString('fr-CA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : null

  return (
    <article className="bg-white text-zinc-950">
      <PageClient />

      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8 lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-300">
            Blogue santé
          </p>

          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            {post.title}
          </h1>

          {publishedDate && (
            <p className="mt-6 text-zinc-300">
              Publié le {publishedDate}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1fr_340px] lg:px-8">
        <div className="min-w-0">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm md:p-10">
            <RichText
              className="mx-auto max-w-none"
              data={post.content}
              enableGutter={false}
            />
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[2rem] border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
              Professionnels
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Professionnels liés au sujet
            </h2>

            {relatedProfessionals.length > 0 ? (
              <div className="mt-6 space-y-4">
                {relatedProfessionals.map((professional: any) => {
                  const photoUrl =
                    professional.photo &&
                    typeof professional.photo === 'object' &&
                    'url' in professional.photo
                      ? professional.photo.url
                      : null

                  return (
                    <a
                      key={professional.id}
                      href={`/professionnels/${professional.slug}`}
                      className="group flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4 transition hover:border-red-200 hover:shadow-sm"
                    >
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={professional.name}
                          className="h-14 w-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-sm font-bold text-white">
                          {professional.name?.charAt(0)}
                        </div>
                      )}

                      <div>
                        <p className="font-semibold text-zinc-950 group-hover:text-red-700">
                          {professional.name}
                        </p>

                        {professional.title ? (
                          <p className="mt-1 text-sm leading-5 text-zinc-600">
                            {professional.title}
                          </p>
                        ) : null}
                      </div>
                    </a>
                  )
                })}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl bg-white p-5">
                <p className="leading-7 text-zinc-600">
                  Les professionnels liés à ce sujet apparaîtront ici lorsqu’une condition sera
                  associée à l’article dans l’admin.
                </p>

                <a
                  href="/professionnels"
                  className="mt-5 inline-flex font-semibold text-red-700 hover:text-red-800"
                >
                  Voir les professionnels →
                </a>
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Blogue
            </p>

            <p className="mt-3 font-semibold">Continuer la lecture</p>

            <a href="/blogue" className="mt-5 inline-flex font-semibold text-red-700 hover:text-red-800">
              Voir tous les articles →
            </a>
          </div>
        </aside>
      </section>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const post: any = await queryPostBySlug({ slug: decodedSlug })

  if (!post) {
    return {
      title: 'Article | Chiropratique St-Roch',
      description:
        'Consultez les articles de Chiropratique St-Roch sur la santé musculosquelettique, la prévention et les soins multidisciplinaires.',
    }
  }

  const title = post.meta?.title || post.title || 'Article santé'
  const description =
    post.meta?.description ||
    'Article de Chiropratique St-Roch sur la santé musculosquelettique, la prévention et les soins multidisciplinaires.'

  const url = `/blogue/${post.slug}`
  const images = getOpenGraphImages(post.heroImage, post.title)

  return {
    title,
    description,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'Chiropratique St-Roch',
      locale: 'fr_CA',
      images,
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  }
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    depth: 2,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})