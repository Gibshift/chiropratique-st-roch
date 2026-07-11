'use client'

import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import Link from 'next/link'
import Image from 'next/image'
import { noOrphanColon } from '@/utilities/typography'

export type PostForGrid = {
  id: string | number
  title: string
  slug: string
  excerpt: string
  categoryTitle: string
  categorySlug: string
  date: string | null
}

export type CategoryForGrid = {
  id: string | number
  title: string
  slug: string
  iconSrc: string | null
}

const ARTICLES_PER_PAGE = 9

function ArticleCard({ post }: { post: PostForGrid }) {
  return (
    <Link
      href={`/blogue/${post.slug}`}
      className="group flex flex-col border border-zinc-300 bg-white transition hover:border-zinc-950 h-full"
    >
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-2">
          {post.categoryTitle && (
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.1em] text-red-600">
              {post.categoryTitle}
            </span>
          )}
          {post.date && (
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-zinc-400 ml-auto">{post.date}</span>
          )}
        </div>
        <h3 className="mt-2 font-[var(--font-barlow-condensed)] text-[1.15rem] font-medium uppercase leading-tight text-zinc-950 group-hover:text-red-600 transition">
          {noOrphanColon(post.title)}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-[0.85rem] leading-5 text-zinc-500">
            {post.excerpt}
          </p>
        )}
        <div className="mt-auto pt-4 relative text-red-600 transition group-hover:text-red-800">
          <svg aria-hidden="true" viewBox="0 0 120 18" className="h-7 w-20 overflow-visible transition-[width] duration-300 ease-out group-hover:w-40">
            <path d="M1 9H112M100 2L112 9L100 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (p: number) => void
}) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-9 w-9 items-center justify-center border border-zinc-300 text-sm text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950"
        >
          ←
        </button>
      )}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`flex h-9 w-9 items-center justify-center border text-sm font-semibold transition ${
            p === currentPage
              ? 'border-zinc-950 bg-zinc-950 text-white'
              : 'border-zinc-300 text-zinc-600 hover:border-zinc-950 hover:text-zinc-950'
          }`}
        >
          {p}
        </button>
      ))}
      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-9 w-9 items-center justify-center border border-zinc-300 text-sm text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950"
        >
          →
        </button>
      )}
    </div>
  )
}

export function BlogueGrid({
  allPosts,
  shuffledPosts,
  categories,
}: {
  allPosts: PostForGrid[]
  shuffledPosts: PostForGrid[]
  categories: CategoryForGrid[]
}) {
  const [query, setQuery] = useState('')
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set())
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [page, setPage] = useState(1)

  const fuse = useMemo(
    () =>
      new Fuse(allPosts, {
        keys: [
          { name: 'title', weight: 0.65 },
          { name: 'excerpt', weight: 0.25 },
          { name: 'categoryTitle', weight: 0.1 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [allPosts],
  )

  const isFiltering = query.trim().length >= 2 || activeCategories.size > 0

  const filtered = useMemo(() => {
    let base: PostForGrid[]

    if (query.trim().length >= 2) {
      base = fuse.search(query.trim()).map((r) => r.item)
    } else {
      base = shuffledPosts
    }

    if (activeCategories.size > 0) {
      base = base.filter((p) => activeCategories.has(p.categorySlug))
    }

    return base
  }, [fuse, query, activeCategories, shuffledPosts])

  const dropdownResults = useMemo(
    () => (query.trim().length >= 2 ? fuse.search(query.trim()).map((r) => r.item) : []),
    [fuse, query],
  )

  const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE)
  const pageArticles = filtered.slice((page - 1) * ARTICLES_PER_PAGE, page * ARTICLES_PER_PAGE)

  function toggleCategory(slug: string) {
    setActiveCategories((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
    setPage(1)
    setTimeout(() => {
      const el = document.getElementById('blogue-grid')
    if (el) {
      const offset = 110
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
    }, 50)
  }

  function clearAll() {
    setQuery('')
    setActiveCategories(new Set())
    setPage(1)
  }

  function handlePageChange(p: number) {
    setPage(p)
    // Scroll doux vers le haut de la grille
    const el = document.getElementById('blogue-grid')
    if (el) {
      const offset = 110
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <div>
      {/* Filtres catégorie */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <p className="font-[var(--font-barlow-condensed)] text-[0.72rem] font-medium uppercase tracking-[0.12em] text-zinc-400">
            Parcourir par sujet
          </p>
          {activeCategories.size > 0 && (
            <button
              onClick={clearAll}
              className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-zinc-400 transition hover:text-red-600"
            >
              Tout effacer ×
            </button>
          )}
        </div>
        <div className="grid border-l border-zinc-300 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => {
            const isActive = activeCategories.has(category.slug)
            return (
              <Link
                key={category.id}
                href={`/blogue/categorie/${category.slug}`}
                onClick={(e) => { e.preventDefault(); toggleCategory(category.slug) }}
                className={`group flex flex-col items-center text-center border-b border-r border-zinc-300 px-4 py-6 transition lg:border-b-0 ${
                  isActive ? 'bg-zinc-950' : 'hover:bg-[#f6f1e8]'
                }`}
              >
                <div className="h-[190px] flex items-center justify-center">
                  {category.iconSrc && (
                    <Image
                      src={category.iconSrc}
                      alt={`Illustration ${category.title.toLowerCase()}`}
                      width={190}
                      height={190}
                      className={`h-[190px] w-[190px] object-contain transition ${
                        isActive ? 'brightness-0 invert' : 'group-hover:brightness-50'
                      }`}
                    />
                  )}
                </div>
                <p className={`mt-3 font-[var(--font-barlow-condensed)] text-[0.88rem] font-semibold uppercase leading-[1.2] tracking-[0.05em] transition ${
                  isActive ? 'text-white' : 'text-zinc-700 group-hover:text-zinc-950'
                }`}>
                  <span className={isActive ? 'text-red-500' : 'text-red-600'}>
                    {category.title.slice(0, 1)}
                  </span>
                  {category.title.slice(1)}
                </p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recherche + grille */}
      <div id="blogue-grid">
        <div className="flex items-center justify-between mb-5">
          <p className="font-[var(--font-barlow-condensed)] text-[0.72rem] font-medium uppercase tracking-[0.12em] text-zinc-400">
            {isFiltering
              ? `${filtered.length} article${filtered.length > 1 ? 's' : ''} trouvé${filtered.length > 1 ? 's' : ''}`
              : 'Tous les articles'}
          </p>
          {isFiltering && (
            <button
              onClick={clearAll}
              className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-zinc-400 transition hover:text-red-600"
            >
              Réinitialiser ×
            </button>
          )}
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-6">
          <div className="flex items-center border border-zinc-300 bg-white transition focus-within:border-zinc-950">
            <svg
              className="ml-4 h-4 w-4 flex-shrink-0 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setDropdownOpen(true)
                setPage(1)
              }}
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') { setDropdownOpen(false) }
                if (e.key === 'Enter') { setDropdownOpen(false) }
              }}
              placeholder="Rechercher un article, une douleur, un sujet…"
              className="flex-1 bg-transparent px-4 py-3 text-[0.9rem] text-zinc-950 placeholder-zinc-400 outline-none"
              autoComplete="off"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setPage(1) }}
                className="mr-4 text-xl leading-none text-zinc-400 transition hover:text-zinc-950"
                aria-label="Effacer la recherche"
              >
                ×
              </button>
            )}
          </div>

          {/* Dropdown accès rapide */}
          {dropdownOpen && dropdownResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-50 max-h-[26rem] overflow-y-auto border border-t-0 border-zinc-300 bg-white shadow-lg">
              {dropdownResults.map((post) => (
                <Link
                  key={post.id}
                  href={`/blogue/${post.slug}`}
                  className="flex items-start gap-3 px-5 py-3 transition hover:bg-[#f6f1e8] group"
                >
                  <div className="flex-1 min-w-0">
                    {post.categoryTitle && (
                      <span className="text-[0.6rem] font-medium uppercase tracking-[0.1em] text-red-600">
                        {post.categoryTitle}
                      </span>
                    )}
                    <p className="truncate font-[var(--font-barlow-condensed)] text-[0.95rem] font-medium uppercase text-zinc-900 group-hover:text-red-600 transition">
                      {noOrphanColon(post.title)}
                    </p>
                  </div>
                  <span className="flex-shrink-0 mt-[2px] text-[0.8rem] text-zinc-400 group-hover:text-zinc-600 transition">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Grille filtrée */}
        <div className="min-h-[420px]">
          {pageArticles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {pageArticles.map((post) => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <p className="text-[0.9rem] text-zinc-500">
              Aucun article ne correspond à cette recherche.
            </p>
          )}
        </div>
      </div>

      {/* Bandeau rendez-vous */}
      <div className="mt-16 border border-zinc-300 bg-[#f6f1e8] px-8 py-12 text-center lg:px-12 lg:py-14">
        <p className="font-[var(--font-barlow-condensed)] text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">
          Passer de la lecture à l&apos;action
        </p>
        <p className="mx-auto mt-4 max-w-[36ch] text-balance font-[var(--font-barlow-condensed)] text-[clamp(1.5rem,3.5vw,2.1rem)] font-medium uppercase leading-[1.05] text-zinc-950">
          Une douleur vous préoccupe? On peut vous aider.
        </p>
        <p className="mx-auto mt-4 max-w-[46ch] text-[0.95rem] leading-6 text-zinc-600">
          Prenez rendez-vous en ligne avec l&apos;un de nos chiropraticiens et repartez avec un plan clair, adapté à votre situation.
        </p>
        <a
          href="https://chiropratiquestroch.janeapp.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-8 inline-flex min-h-[48px] items-center gap-3 border border-red-600 bg-red-600 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-red-600"
        >
          <span className="whitespace-nowrap">Prendre rendez-vous</span>
          <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2.5 w-8 transition duration-200 group-hover:translate-x-1">
            <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
        </a>
      </div>
    </div>
  )
}
