import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import Image from 'next/image'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { GeometricShapes } from '@/components/ui/GeometricShapes'
import { BlogueGrid, type PostForGrid, type CategoryForGrid } from './BlogueGrid'
import { noOrphanColon } from '@/utilities/typography'

const categoryIcons: Record<string, string> = {
  'tete-et-cou':        '/assets/condition-cou-et-tete-variation.png',
  'dos-et-sacrum':      '/assets/condition-dos-et-sacrum-variation.png',
  'machoire':           '/assets/condition-atm-variation.png',
  'membres-superieurs': '/assets/condition-membres-superieurs-variation.png',
  'membres-inferieurs': '/assets/condition-membres-inferieurs-variation.png',
}

function getIconForSlug(slug: string): string | null {
  if (categoryIcons[slug]) return categoryIcons[slug]
  const s = slug.toLowerCase()
  if (s.includes('cou') || s.includes('tete') || s.includes('tête')) return categoryIcons['tete-et-cou']
  if (s.includes('sacrum') || s.includes('dos')) return categoryIcons['dos-et-sacrum']
  if (s.includes('machoire') || s.includes('mâchoire') || s.includes('atm')) return categoryIcons['machoire']
  if (s.includes('super')) return categoryIcons['membres-superieurs']
  if (s.includes('infer')) return categoryIcons['membres-inferieurs']
  return null
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr]
  let s = seed
  for (let i = result.length - 1; i > 0; i--) {
    s = Math.imul(s, 1664525) + 1013904223 | 0
    const j = Math.abs(s) % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function formatDate(publishedAt: unknown): string | null {
  return typeof publishedAt === 'string'
    ? new Date(publishedAt).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })
    : null
}

type FeaturedVariant = 'dark' | 'white' | 'beige'

const featuredStyles: Record<FeaturedVariant, {
  wrap: string; label: string; date: string; title: string; excerpt: string; cta: string
}> = {
  dark: {
    wrap:    'bg-zinc-950 border border-zinc-950 hover:border-red-600',
    label:   'text-red-500',
    date:    'text-zinc-500',
    title:   'text-white group-hover:text-red-400',
    excerpt: 'text-zinc-400',
    cta:     'text-red-500 group-hover:text-red-400',
  },
  white: {
    wrap:    'bg-white border border-zinc-400 hover:border-zinc-950',
    label:   'text-red-600',
    date:    'text-zinc-400',
    title:   'text-zinc-950 group-hover:text-red-600',
    excerpt: 'text-zinc-500',
    cta:     'text-red-600 group-hover:text-zinc-950',
  },
  beige: {
    wrap:    'bg-stone-100 border border-stone-400 hover:border-zinc-950',
    label:   'text-red-600',
    date:    'text-stone-400',
    title:   'text-zinc-950 group-hover:text-red-600',
    excerpt: 'text-zinc-500',
    cta:     'text-red-600 group-hover:text-zinc-950',
  },
}

function FeaturedCard({ post, label, variant = 'white', large = false }: {
  post: any; label: string; variant?: FeaturedVariant; large?: boolean
}) {
  const date = formatDate(post.publishedAt)
  const excerpt = post.meta?.description || ''
  const s = featuredStyles[variant]

  if (large) {
    return (
      <Link
        href={`/blogue/${post.slug}`}
        className={`group flex lg:min-h-[360px] flex-col overflow-hidden transition p-6 lg:p-10 lg:pb-6 ${s.wrap}`}
      >
        <div className="flex items-center justify-between">
          <span className={`inline-flex border-l-2 border-red-500 pl-3 font-[var(--font-barlow-condensed)] text-[0.72rem] lg:text-[13px] font-medium uppercase tracking-[0.12em] lg:tracking-[0.22em] ${s.label}`}>
            {label}
          </span>
          {date && <span className={`text-xs font-medium uppercase tracking-[0.14em] ${s.date}`}>{date}</span>}
        </div>
        <div className="flex flex-1 flex-col justify-start pt-4 lg:justify-center">
          <h2 className={`text-xl font-normal leading-[1.05] tracking-[-0.03em] lg:text-[clamp(1.6rem,2.5vw,2.2rem)] lg:font-[var(--font-barlow-condensed)] lg:font-medium lg:uppercase lg:leading-tight transition ${s.title}`}>
            {noOrphanColon(post.title)}
          </h2>
          {excerpt && (
            <p className={`mt-3 line-clamp-3 text-[0.9rem] leading-6 ${s.excerpt}`}>{excerpt}</p>
          )}
        </div>
        <span className={`mt-auto self-end text-[1rem] font-semibold transition ${s.cta}`}>
          Lire l&apos;article →
        </span>
      </Link>
    )
  }

  return (
    <Link
      href={`/blogue/${post.slug}`}
      className={`group flex flex-1 flex-col overflow-hidden transition p-6 lg:min-h-[200px] ${s.wrap}`}
    >
      <div>
        <span className={`inline-flex border-l-2 border-red-500 pl-3 font-[var(--font-barlow-condensed)] text-[0.72rem] lg:text-[13px] font-medium uppercase tracking-[0.12em] lg:tracking-[0.22em] ${s.label}`}>
          {label}
        </span>
      </div>
      <div className="flex flex-1 items-center py-4">
        <h2 className={`text-xl font-normal leading-[1.05] tracking-[-0.03em] transition ${s.title}`}>
          {noOrphanColon(post.title)}
        </h2>
      </div>
      <div className="flex items-center justify-between">
        {date && <span className={`text-xs font-medium uppercase tracking-[0.14em] ${s.date}`}>{date}</span>}
        <span className={`text-[1rem] font-semibold transition ${s.cta}`}>
          Lire l&apos;article →
        </span>
      </div>
    </Link>
  )
}

export async function BloguePage({ page: _page = 1 }: { page?: number }) {
  const payload = await getPayload({ config: configPromise })

  const [allPostsResult, categoriesResult] = await Promise.all([
    payload.find({
      collection: 'posts',
      draft: false,
      limit: 200,
      overrideAccess: false,
      pagination: false,
      sort: 'title',
      depth: 1,
    }),
    payload.find({
      collection: 'condition-categories' as any,
      limit: 20,
      depth: 0,
      sort: 'order',
    }),
  ])

  const posts = allPostsResult.docs

  const dayIndex     = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
  const fourDayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 4))

  const articleDuJour    = posts.length > 0 ? posts[dayIndex % posts.length] : null
  const popularRawIndex  = posts.length > 1 ? (fourDayIndex + Math.floor(posts.length / 2)) % posts.length : -1
  const articlePopulaire = popularRawIndex >= 0 ? posts[popularRawIndex] : null
  const recentRawIndex   = posts.length > 2 ? (dayIndex + Math.ceil(posts.length / 3)) % posts.length : -1
  const articleRecent    = recentRawIndex >= 0 ? posts[recentRawIndex] : null

  const shuffled = seededShuffle(posts, dayIndex)

  // Données sérialisées pour le composant client
  const allPosts: PostForGrid[] = posts.map((post) => {
    const cat = Array.isArray(post.categories) && post.categories.length > 0
      ? (typeof post.categories[0] === 'object' ? post.categories[0] as any : null)
      : null
    return {
      id: post.id,
      title: post.title ?? '',
      slug: post.slug ?? '',
      excerpt: (post.meta as any)?.description ?? '',
      categoryTitle: cat?.title ?? '',
      categorySlug: cat?.slug ?? '',
      date: formatDate(post.publishedAt),
    }
  })

  const shuffledPosts: PostForGrid[] = shuffled.map((post) => {
    const cat = Array.isArray(post.categories) && post.categories.length > 0
      ? (typeof post.categories[0] === 'object' ? post.categories[0] as any : null)
      : null
    return {
      id: post.id,
      title: post.title ?? '',
      slug: post.slug ?? '',
      excerpt: (post.meta as any)?.description ?? '',
      categoryTitle: cat?.title ?? '',
      categorySlug: cat?.slug ?? '',
      date: formatDate(post.publishedAt),
    }
  })

  const categories: CategoryForGrid[] = categoriesResult.docs.map((cat: any) => ({
    id: cat.id,
    title: cat.title ?? '',
    slug: cat.slug ?? '',
    iconSrc: getIconForSlug(cat.slug),
  }))

  return (
    <main className="bg-white text-zinc-950">
      <section className="relative bg-white pt-44 pb-12 lg:pt-48 lg:pb-24">
        <GeometricShapes />
        <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">

            {/* Header */}
            <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="whitespace-nowrap font-[var(--font-barlow-condensed)] text-[clamp(2rem,7vw,4.5rem)] font-medium uppercase leading-[1.05] text-zinc-950">
                  La santé,<br />ça s&apos;explique.
                </h1>
                <div className="mt-6 h-[2px] w-14 bg-red-600" />
                <div className="mt-6">
                  <a
                    href="#blogue-grid"
                    className="group inline-flex min-h-[46px] items-center gap-3 border border-red-600 bg-red-600 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-red-600"
                  >
                    <span>Liste des articles ↓</span>
                  </a>
                </div>
              </div>
              <div className="hidden lg:block w-[1px] h-24 flex-shrink-0 self-center bg-red-600" />
              <div className="lg:max-w-[38%]">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">Blogue</p>
                <p className="mt-3 text-[1rem] leading-7 text-zinc-800">
                  Des articles simples et utiles pour mieux comprendre les douleurs, les habitudes de travail, la posture et les bonnes raisons de consulter.
                </p>
              </div>
            </div>

            {/* Article du jour (noir) + Populaire (blanc) + À lire aussi (beige) */}
            {(articleDuJour || articlePopulaire || articleRecent) && (
              <div className="mb-16 grid gap-1 lg:grid-cols-[1.6fr_1fr]">
                {articleDuJour && (
                  <FeaturedCard post={articleDuJour} label="Article du jour" variant="dark" large />
                )}
                <div className="flex flex-col gap-1">
                  {articlePopulaire && (
                    <FeaturedCard post={articlePopulaire} label="Article populaire" variant="white" />
                  )}
                  {articleRecent && (
                    <FeaturedCard post={articleRecent} label="À lire aussi" variant="beige" />
                  )}
                </div>
              </div>
            )}

            {/* Grille unifiée : catégories + recherche + articles + pagination */}
            <BlogueGrid
              allPosts={allPosts}
              shuffledPosts={shuffledPosts}
              categories={categories}
            />

          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
