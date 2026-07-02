import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import Image from 'next/image'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { GeometricShapes } from '@/components/ui/GeometricShapes'

const ARTICLES_PER_PAGE = 9

const categoryIcons: Record<string, string> = {
  'tete-et-cou':        '/media/condition-cou-et-tete-variation.png',
  'dos-et-sacrum':      '/media/condition-dos-et-sacrum-variation.png',
  'machoire':           '/media/condition-atm-variation.png',
  'membres-superieurs': '/media/condition-membres-superieurs-variation.png',
  'membres-inferieurs': '/media/condition-membres-inferieurs-variation.png',
}

function formatDate(post: any): string | null {
  return typeof post.publishedAt === 'string'
    ? new Date(post.publishedAt).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })
    : null
}

function FeaturedCard({ post, label, dark = false }: { post: any; label: string; dark?: boolean }) {
  const date = formatDate(post)
  const excerpt = post.meta?.description || ''

  return (
    <Link href={`/blogue/${post.slug}`}
      className={`group flex flex-col overflow-hidden transition min-h-[260px] ${
        dark
          ? 'bg-zinc-950 border border-zinc-950 hover:border-red-600'
          : 'bg-white border border-zinc-300 hover:border-zinc-950'
      }`}
    >
      <div className="flex flex-1 flex-col p-8 lg:p-10">
        <div className="flex items-center justify-between">
          <span className={`text-[0.7rem] font-bold uppercase tracking-[0.2em] ${dark ? 'text-red-500' : 'text-red-600'}`}>
            {label}
          </span>
          {date && (
            <span className={`text-xs ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>{date}</span>
          )}
        </div>
        <h2 className={`mt-5 font-[var(--font-barlow-condensed)] text-[clamp(1.6rem,2.5vw,2.2rem)] font-medium uppercase leading-tight transition ${
          dark
            ? 'text-white group-hover:text-red-400'
            : 'text-zinc-950 group-hover:text-red-600'
        }`}>
          {post.title}
        </h2>
        {excerpt && (
          <p className={`mt-3 line-clamp-3 text-[0.9rem] leading-6 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            {excerpt}
          </p>
        )}
        <span className={`mt-auto pt-6 text-[0.85rem] font-semibold transition ${
          dark ? 'text-red-500 group-hover:text-red-400' : 'text-red-600 group-hover:text-zinc-950'
        }`}>
          Lire l'article →
        </span>
      </div>
    </Link>
  )
}

function ArticleCard({ post }: { post: any }) {
  const date = formatDate(post)
  const excerpt = post.meta?.description || ''
  const category = Array.isArray(post.categories) && post.categories.length > 0
    ? (typeof post.categories[0] === 'object' ? post.categories[0] : null)
    : null

  return (
    <Link href={`/blogue/${post.slug}`}
      className="group flex flex-col border border-zinc-200 bg-white transition hover:border-zinc-950 h-full"
    >
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-2">
          {category && (
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-red-600">
              {category.title}
            </span>
          )}
          {date && <span className="text-[0.7rem] text-zinc-400 ml-auto">{date}</span>}
        </div>
        <h3 className="mt-2 font-[var(--font-barlow-condensed)] text-[1.15rem] font-medium uppercase leading-tight text-zinc-950 group-hover:text-red-600 transition">
          {post.title}
        </h3>
        {excerpt && (
          <p className="mt-2 line-clamp-2 text-[0.85rem] leading-5 text-zinc-500">{excerpt}</p>
        )}
        <span className="mt-auto pt-4 text-[0.8rem] font-semibold text-red-600 group-hover:text-zinc-950 transition">
          Lire →
        </span>
      </div>
    </Link>
  )
}

function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      {currentPage > 1 && (
        <Link href={`/blogue?page=${currentPage - 1}`}
          className="flex h-9 w-9 items-center justify-center border border-zinc-300 text-sm text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950"
        >
          ←
        </Link>
      )}
      {pages.map((p) => (
        <Link key={p} href={`/blogue?page=${p}`}
          className={`flex h-9 w-9 items-center justify-center border text-sm font-semibold transition ${
            p === currentPage
              ? 'border-zinc-950 bg-zinc-950 text-white'
              : 'border-zinc-300 text-zinc-600 hover:border-zinc-950 hover:text-zinc-950'
          }`}
        >
          {p}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link href={`/blogue?page=${currentPage + 1}`}
          className="flex h-9 w-9 items-center justify-center border border-zinc-300 text-sm text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950"
        >
          →
        </Link>
      )}
    </div>
  )
}


export async function BloguePage({ page = 1 }: { page?: number }) {
  const payload = await getPayload({ config: configPromise })

  const [allPostsResult, categoriesResult, paginatedResult] = await Promise.all([
    payload.find({
      collection: 'posts',
      draft: false,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      sort: '-publishedAt',
      depth: 0,
    }),
    payload.find({
      collection: 'condition-categories' as any,
      limit: 20,
      depth: 0,
      sort: 'order',
    }),
    payload.find({
      collection: 'posts',
      draft: false,
      limit: ARTICLES_PER_PAGE,
      page,
      overrideAccess: false,
      sort: '-publishedAt',
      depth: 1,
    }),
  ])

  const posts = allPostsResult.docs
  const totalPages = paginatedResult.totalPages ?? 1

  const dayIndex     = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
  const fourDayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 4))

  const articleDuJour    = posts.length > 0 ? posts[dayIndex % posts.length] : null
  const popularRawIndex  = posts.length > 1 ? (fourDayIndex + Math.floor(posts.length / 2)) % posts.length : -1
  const articlePopulaire = popularRawIndex >= 0 ? posts[popularRawIndex] : null

  return (
    <main className="bg-white text-zinc-950">
      <section className="relative bg-white pt-24 pb-24 lg:pt-48">
        <GeometricShapes />
        <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">

            {/* Header */}
            <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="whitespace-nowrap font-[var(--font-barlow-condensed)] text-[clamp(2.8rem,5vw,4.5rem)] font-medium uppercase leading-[1.05] text-zinc-950">
                  La santé,<br />ça s'explique.
                </h1>
              </div>
              <div className="hidden lg:block w-[1px] h-24 flex-shrink-0 self-center bg-red-600" />
              <div className="lg:max-w-[38%]">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-red-600">Blogue</p>
                <p className="mt-3 text-[1rem] leading-7 text-zinc-800">
                  Des articles simples et utiles pour mieux comprendre les douleurs, les habitudes de travail, la posture et les bonnes raisons de consulter.
                </p>
              </div>
            </div>

            {/* Article du jour + Article populaire */}
            {(articleDuJour || articlePopulaire) && (
              <div className="mb-16 grid gap-4 lg:grid-cols-2">
                {articleDuJour    && <FeaturedCard post={articleDuJour}    label="Article du jour"   dark />}
                {articlePopulaire && <FeaturedCard post={articlePopulaire} label="Article populaire"       />}
              </div>
            )}

            {/* Catégories */}
            {categoriesResult.docs.length > 0 && (
              <div className="mb-16">
                <p className="mb-5 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-zinc-400">Parcourir par sujet</p>
                <div className="grid border-l border-zinc-300 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                  {categoriesResult.docs.map((category: any) => {
                    const iconSrc = categoryIcons[category.slug] ?? null
                    return (
                      <Link key={category.id} href={`/blogue/categorie/${category.slug}`}
                        className="group flex flex-col items-center text-center border-b border-r border-zinc-300 px-4 py-6 transition hover:bg-zinc-50 lg:border-b-0"
                      >
                        <div className="h-[95px] flex items-center justify-center">
                          {iconSrc && (
                            <Image src={iconSrc} alt="" width={95} height={95}
                              className="h-[95px] w-[95px] object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                            />
                          )}
                        </div>
                        <p className="mt-3 font-[var(--font-barlow-condensed)] text-[0.88rem] font-semibold uppercase leading-[1.2] tracking-[0.05em] text-zinc-700 group-hover:text-zinc-950">
                          <span className="text-red-600">{category.title.slice(0, 1)}</span>
                          {category.title.slice(1)}
                        </p>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Tous les articles */}
            {paginatedResult.docs.length > 0 && (
              <div>
                <p className="mb-5 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-zinc-400">Tous les articles</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedResult.docs.map((post: any) => (
                    <ArticleCard key={post.id} post={post} />
                  ))}
                </div>
                <Pagination currentPage={page} totalPages={totalPages} />
              </div>
            )}

          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
