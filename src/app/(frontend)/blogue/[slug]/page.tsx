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

  const publishedDate =
    typeof post.publishedAt === 'string'
      ? new Date(post.publishedAt).toLocaleDateString('fr-CA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : null

  const category =
    Array.isArray(postData.categories) && postData.categories.length > 0
      ? typeof postData.categories[0] === 'object'
        ? postData.categories[0]
        : null
      : null

  return (
    <article className="bg-white text-zinc-950">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      <section className="relative bg-white pt-24 pb-0 lg:pt-48">
        <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">

            <Breadcrumb crumbs={[
              { label: 'Blogue', href: '/blogue' },
              ...(category ? [{ label: category.title, href: `/blogue/categorie/${category.slug}` }] : []),
              { label: post.title },
            ]} />

            {/* Header */}
            <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="lg:max-w-[55%]">
                <h1 className="font-[var(--font-barlow-condensed)] text-[clamp(1.4rem,3vw,3.8rem)] font-medium uppercase leading-[1.1] text-zinc-950">
                  {post.title}
                </h1>
              </div>
              <div className="hidden lg:block w-[1px] h-14 flex-shrink-0 self-center bg-red-600" />
              <div className="lg:max-w-[35%]">
                {category && (
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-red-600">
                    {category.title}
                  </p>
                )}
                {publishedDate && (
                  <p className="mt-2 text-[0.85rem] text-zinc-400">{publishedDate}</p>
                )}
              </div>
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* Contenu */}
      <section className="pb-24">
        <ScrollReveal>
          <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
            <div className="border-t border-zinc-200 pt-12 lg:grid lg:grid-cols-[1fr_300px] lg:gap-16">

              {/* Article */}
              <div>
                <RichText
                  className="mx-auto max-w-none"
                  data={post.content}
                  enableGutter={false}
                />
                <div className="mt-16 flex items-center justify-between border-t border-zinc-200 pt-8">
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
                  <div className="border border-zinc-200 p-6">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-zinc-400">Catégorie</p>
                    <p className="mt-2 font-[var(--font-barlow-condensed)] text-[1.1rem] font-medium uppercase text-zinc-950">
                      {category.title}
                    </p>
                    <Link href={`/blogue/categorie/${category.slug}`}
                      className="mt-4 inline-block text-[0.8rem] font-semibold text-red-600 hover:text-zinc-950 transition"
                    >
                      Voir tous les articles →
                    </Link>
                  </div>
                )}

                {publishedDate && (
                  <div className="border border-zinc-200 p-6">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-zinc-400">Publié le</p>
                    <p className="mt-2 text-[0.9rem] text-zinc-700">{publishedDate}</p>
                  </div>
                )}

                <div className="border border-zinc-200 p-6">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-zinc-400">La clinique</p>
                  <p className="mt-2 text-[0.9rem] leading-6 text-zinc-700">
                    Vous avez des questions? Notre équipe est là pour vous.
                  </p>
                  <Link href="/contact"
                    className="mt-4 inline-block text-[0.8rem] font-semibold text-red-600 hover:text-zinc-950 transition"
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
