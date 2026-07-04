import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { GeometricShapes } from '@/components/ui/GeometricShapes'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const revalidate = 3600

function formatDate(post: any): string | null {
  return typeof post.publishedAt === 'string'
    ? new Date(post.publishedAt).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })
    : null
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const categories = await payload.find({
    collection: 'condition-categories' as any,
    limit: 20,
    depth: 0,
  })
  return categories.docs.map((cat: any) => ({ slug: cat.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'condition-categories' as any,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })

  const category = result.docs[0] as any
  if (!category) return {}

  const title = `${category.title} — Blogue | Chiropratique St-Roch`
  const description = `Articles de blogue sur le sujet : ${category.title}.`

  return { title, description }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { slug } = await params
  const sp = await searchParams
  const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1)
  const ARTICLES_PER_PAGE = 12

  const payload = await getPayload({ config: configPromise })

  const [categoryResult, postsResult] = await Promise.all([
    payload.find({
      collection: 'condition-categories' as any,
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    }),
    payload.find({
      collection: 'posts',
      draft: false,
      overrideAccess: false,
      where: { 'categories.slug': { equals: slug } },
      sort: '-publishedAt',
      limit: ARTICLES_PER_PAGE,
      page,
      depth: 0,
    }),
  ])

  const category = categoryResult.docs[0] as any
  if (!category) notFound()

  const posts = postsResult.docs
  const totalPages = postsResult.totalPages ?? 1

  return (
    <main className="bg-white text-zinc-950">
      <section className="relative bg-white min-h-[68vh] pt-24 pb-24 lg:pt-48">
        <GeometricShapes />
        <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">

            {/* Header */}
            <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <Breadcrumb crumbs={[
                  { label: 'Blogue', href: '/blogue' },
                  { label: category.title },
                ]} />
                <h1 className="font-[var(--font-barlow-condensed)] text-[clamp(2.8rem,5vw,4.5rem)] font-medium uppercase leading-[1.05] text-zinc-950">
                  {category.title}
                </h1>
              </div>
              <div className="hidden lg:block w-[1px] h-24 flex-shrink-0 self-center bg-red-600" />
              <div className="lg:max-w-[38%]">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-red-600">Blogue</p>
                <p className="mt-3 text-[1rem] leading-7 text-zinc-800">
                  Articles liés au sujet <span className="font-semibold text-zinc-950">{category.title}</span>.
                </p>
              </div>
            </div>

            {/* Articles */}
            {posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post: any) => {
                    const date = formatDate(post)
                    const excerpt = post.meta?.description || ''
                    return (
                      <Link key={post.id} href={`/blogue/${post.slug}`}
                        className="group flex flex-col border border-zinc-400 bg-white transition hover:border-zinc-950 h-full"
                      >
                        <div className="flex flex-1 flex-col p-6">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-red-600">
                              {category.title}
                            </span>
                            {date && <span className="text-[0.7rem] text-zinc-400">{date}</span>}
                          </div>
                          <h2 className="mt-2 font-[var(--font-barlow-condensed)] text-[1.15rem] font-medium uppercase leading-tight text-zinc-950 group-hover:text-red-600 transition">
                            {post.title}
                          </h2>
                          {excerpt && (
                            <p className="mt-2 line-clamp-2 text-[0.85rem] leading-5 text-zinc-500">{excerpt}</p>
                          )}
                          <span className="mt-auto pt-4 text-[1rem] font-semibold text-red-600 group-hover:text-zinc-950 transition">
                            Lire →
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    {page > 1 && (
                      <Link href={`/blogue/categorie/${slug}?page=${page - 1}`}
                        className="flex h-9 w-9 items-center justify-center border border-zinc-300 text-sm text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950"
                      >←</Link>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link key={p} href={`/blogue/categorie/${slug}?page=${p}`}
                        className={`flex h-9 w-9 items-center justify-center border text-sm font-semibold transition ${
                          p === page
                            ? 'border-zinc-950 bg-zinc-950 text-white'
                            : 'border-zinc-300 text-zinc-600 hover:border-zinc-950 hover:text-zinc-950'
                        }`}
                      >{p}</Link>
                    ))}
                    {page < totalPages && (
                      <Link href={`/blogue/categorie/${slug}?page=${page + 1}`}
                        className="flex h-9 w-9 items-center justify-center border border-zinc-300 text-sm text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950"
                      >→</Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="border border-zinc-400 p-10 text-center">
                <p className="text-zinc-500">Aucun article publié dans cette catégorie pour le moment.</p>
              </div>
            )}

          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
