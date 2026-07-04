'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Fuse from 'fuse.js'
import Link from 'next/link'

export type PostForSearch = {
  id: string | number
  title: string
  slug: string
  excerpt: string
  categoryTitle: string
}

export function BlogueSearch({ allPosts }: { allPosts: PostForSearch[] }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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

  const results = useMemo(
    () => (query.trim().length >= 2 ? fuse.search(query.trim()).map((r) => r.item) : []),
    [fuse, query],
  )

  // Fermer si clic en dehors
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const showDropdown = open && results.length > 0

  return (
    <div ref={containerRef} className="relative mb-8">
      {/* Input */}
      <div className="flex items-center border border-zinc-400 bg-white transition focus-within:border-zinc-950">
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
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') { setOpen(false); setQuery('') }
          }}
          placeholder="Rechercher un article, une douleur, un sujet…"
          className="flex-1 bg-transparent px-4 py-3 text-[0.9rem] text-zinc-950 placeholder-zinc-400 outline-none"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false) }}
            className="mr-4 text-xl leading-none text-zinc-400 transition hover:text-zinc-950"
            aria-label="Effacer la recherche"
          >
            ×
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 max-h-[26rem] overflow-y-auto border border-t-0 border-zinc-300 bg-white shadow-lg">
          {results.map((post) => (
            <Link
              key={post.id}
              href={`/blogue/${post.slug}`}
              onClick={() => { setOpen(false); setQuery('') }}
              className="flex items-start gap-3 px-5 py-3 transition hover:bg-zinc-50 group"
            >
              <div className="flex-1 min-w-0">
                {post.categoryTitle && (
                  <span className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-red-600">
                    {post.categoryTitle}
                  </span>
                )}
                <p className="truncate font-[var(--font-barlow-condensed)] text-[0.95rem] font-medium uppercase text-zinc-900 group-hover:text-red-600 transition">
                  {post.title}
                </p>
              </div>
              <span className="flex-shrink-0 mt-[2px] text-[0.8rem] text-zinc-400 group-hover:text-zinc-600 transition">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
