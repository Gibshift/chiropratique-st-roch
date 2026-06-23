'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
  janeUrl: string
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, janeUrl }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  const navItems = data?.navItems || []

  useEffect(() => {
    setHeaderTheme(null)
    setIsOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

 return (
  <header
    className="absolute inset-x-0 top-0 z-50 text-zinc-950"
    {...(theme ? { 'data-theme': theme } : {})}
  >
    <div className="mx-auto max-w-7xl px-6 pt-10 lg:px-9">
      <div className="flex h-24 items-center justify-between gap-58">
        <Link href="/" className="flex shrink-0 items-center gap-4">
          <img
            src="/logo-st-roch.png"
            alt="Logo Chiropratique St-Roch"
            className="h-16 w-16 object-cover"
          />

          <span className="font-[var(--font-barlow-condensed)] text-[16px] font-medium uppercase leading-none tracking-[0.34em] text-zinc-950">
  Multiclinique
</span>
        </Link>

        {/* NAV DESKTOP */}
        <div className="hidden items-center gap-10 lg:flex">
          <HeaderNav data={data} />

          <a
  href={janeUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex min-h-[54px] min-w-[220px] items-center justify-center whitespace-nowrap border border-red-700 bg-white/90 px-7 text-red-700 backdrop-blur-sm transition hover:bg-red-700 hover:text-white"
>
  <span className="font-[var(--font-barlow-condensed)] text-[15px] font-medium uppercase leading-none tracking-[0.22em]">
    Prendre rendez-vous
  </span>
</a>
        </div>

        {/* MENU MOBILE */}
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="border border-zinc-300 bg-white/90 px-4 py-2 text-sm font-semibold backdrop-blur lg:hidden"
          aria-expanded={isOpen}
          aria-label="Ouvrir le menu"
        >
          {isOpen ? 'Fermer' : 'Menu'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 border border-zinc-200 bg-white/95 p-5 shadow-sm lg:hidden">
          <nav className="flex flex-col gap-4">
            {navItems.map(({ link }, i) => {
              return (
                <CMSLink
                  key={i}
                  {...link}
                  appearance="link"
                  className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-800 hover:text-red-700"
                />
              )
            })}

            <a
              href={janeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-[52px] items-center justify-center border border-red-700 bg-white px-5 text-center text-[12px] font-black uppercase tracking-[0.16em] text-red-700 transition hover:bg-red-700 hover:text-white"
            >
              Prendre rendez-vous
            </a>
          </nav>
        </div>
      )}
    </div>
  </header>
)
}