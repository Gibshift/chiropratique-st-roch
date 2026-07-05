import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import Link from 'next/link'
import RichText from '@/components/RichText'
import { getOpenGraphImages } from '@/utilities/seo'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

const categoryIcons: Record<string, string> = {
  'tete-et-cou':        '/assets/condition-cou-et-tete-variation.png',
  'dos-et-sacrum':      '/assets/condition-dos-et-sacrum-variation.png',
  'machoire':           '/assets/condition-atm-variation.png',
  'membres-superieurs': '/assets/condition-membres-superieurs-variation.png',
  'membres-inferieurs': '/assets/condition-membres-inferieurs-variation.png',
}

function formatDate(publishedAt: unknown): string | null {
  return typeof publishedAt === 'string'
    ? new Date(publishedAt).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })
    : null
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return posts.docs.map(({ slug }) => ({ slug }))
}

type Args = { params: Promise<{ slug?: string }> }

export default async function BloguePost({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/blogue/' + decodedSlug

  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  const postData: any = post

  const publishedDate = formatDate(post.publishedAt)

  const category =
    Array.isArray(postData.categories) && postData.categories.length > 0
      ? typeof postData.categories[0] === 'object'
        ? postData.categories[0] as any
        : null
      : null

  const iconSrc = category?.slug ? (categoryIcons[category.slug] ?? null) : null

  // Articles reliés : même catégorie, excluant l'article courant
  const relatedPosts = category ? await queryRelatedPosts({
    categoryId: category.id,
    excludeSlug: decodedSlug,
  }) : []

  return (
    <article className="bg-white text-zinc-950">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      <section className="relative bg-white pt-44 pb-0 lg:pt-48">
        <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">

            <Breadcrumb crumbs={[
              { label: 'Blogue', href: '/blogue' },
              ...(category ? [{ label: category.title, href: `/blogue/categorie/${category.slug}` }] : []),
              { label: post.title },
            ]} />

            {/* Header */}
            <div className="mt-12 mb-12">
              <h1 className="font-[var(--font-barlow-condensed)] text-[clamp(1.4rem,3vw,3.8rem)] font-medium uppercase leading-[1.1] text-zinc-950">
                <span className="text-red-600">{post.title.charAt(0)}</span>{post.title.slice(1)}
              </h1>
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* Contenu */}
      <section className="pb-24">
        <ScrollReveal>
          <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
            <div className="border-t border-zinc-400 pt-12 lg:grid lg:grid-cols-[1fr_300px] lg:gap-16">

              {/* Article */}
              <div>
                <RichText
                  className="mx-auto max-w-none"
                  data={post.content}
                  enableGutter={false}
                />

                {/* Articles reliés */}
                {(relatedPosts.length > 0 || publishedDate) && (
                  <div className="mt-16">
                    {publishedDate && (
                      <span className="mb-3 block text-right text-[0.8rem] text-zinc-400">{publishedDate}</span>
                    )}
                    <div className="border-t border-zinc-400 pt-8">
                    {relatedPosts.length > 0 && (
                      <p className="mb-6 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-zinc-400">
                        Articles reliés
                      </p>
                    )}
                    {relatedPosts.length > 0 && <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {relatedPosts.map((related: any) => {
                        const relatedDate = formatDate(related.publishedAt)
                        const excerpt = related.meta?.description || ''
                        const relatedCat = Array.isArray(related.categories) && related.categories.length > 0
                          ? (typeof related.categories[0] === 'object' ? related.categories[0] as any : null)
                          : null
                        return (
                          <Link
                            key={related.id}
                            href={`/blogue/${related.slug}`}
                            className="group flex flex-col border border-zinc-400 bg-white transition hover:border-zinc-950 h-full"
                          >
                            <div className="flex flex-1 flex-col p-6">
                              <div className="flex items-center justify-between gap-2">
                                {relatedCat && (
                                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-red-600">
                                    {relatedCat.title}
                                  </span>
                                )}
                                {relatedDate && (
                                  <span className="text-[0.7rem] text-zinc-400 ml-auto">{relatedDate}</span>
                                )}
                              </div>
                              <h3 className="mt-2 font-[var(--font-barlow-condensed)] text-[1.15rem] font-medium uppercase leading-tight text-zinc-950 group-hover:text-red-600 transition">
                                {related.title}
                              </h3>
                              {excerpt && (
                                <p className="mt-2 line-clamp-2 text-[0.85rem] leading-5 text-zinc-500">
                                  {excerpt}
                                </p>
                              )}
                              <span className="mt-auto pt-4 text-[1rem] font-semibold text-red-600 group-hover:text-zinc-950 transition">
                                Lire →
                              </span>
                            </div>
                          </Link>
                        )
                      })}
                    </div>}
                    </div>
                  </div>
                )}

                <div className="mt-12 border-t border-zinc-400 pt-8">
                  <Link href="/blogue"
                    className="text-[0.85rem] font-semibold text-zinc-500 hover:text-zinc-950 transition"
                  >
                    ← Retour au blogue
                  </Link>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="mt-12 flex flex-col gap-6 lg:mt-0 lg:sticky lg:top-28 lg:self-start">
                {category && (
                  <div className="border border-zinc-400 p-6">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-zinc-950">Catégorie</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className="font-[var(--font-barlow-condensed)] text-[1.1rem] font-medium uppercase text-zinc-950">
                        {category.title}
                      </p>
                      {iconSrc && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={iconSrc}
                          alt={`Illustration ${category.title.toLowerCase()}`}
                          width={80}
                          height={80}
                          className="h-[80px] w-[80px] flex-shrink-0 object-contain"
                        />
                      )}
                    </div>
                    <Link href={`/blogue/categorie/${category.slug}`}
                      className="mt-4 inline-block text-[1rem] font-semibold text-red-600 hover:text-zinc-950 transition"
                    >
                      Voir tous les articles →
                    </Link>
                  </div>
                )}

                <div className="border border-zinc-400 p-6">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-zinc-950">La clinique</p>
                  <p className="mt-2 text-[0.9rem] leading-6 text-zinc-700">
                    Vous avez des questions? Notre équipe est là pour vous.
                  </p>
                  <Link href="/contact"
                    className="mt-4 inline-block text-[1rem] font-semibold text-red-600 hover:text-zinc-950 transition"
                  >
                    Nous contacter →
                  </Link>
                </div>
              </aside>

            </div>
          </div>
        </ScrollReveal>
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
    alternates: { canonical: url },
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
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})

async function queryRelatedPosts({ categoryId, excludeSlug }: { categoryId: string | number; excludeSlug: string }) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 3,
    depth: 1,
    overrideAccess: false,
    pagination: false,
    where: {
      and: [
        { categories: { in: [categoryId] } },
        { slug: { not_equals: excludeSlug } },
        { _status: { equals: 'published' } },
      ],
    },
  })

  return result.docs
}
