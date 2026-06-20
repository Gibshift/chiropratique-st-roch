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
      className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 text-zinc-950 backdrop-blur"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-6">
          <Link href="/" className="flex flex-col leading-none">
            <span className="text-xl font-bold tracking-tight">
              Chiropratique
            </span>
            <span className="text-xl font-bold tracking-tight text-red-700">
              St-Roch
            </span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            <HeaderNav data={data} />

            <a
              href={janeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800"
            >
              Prendre rendez-vous
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold lg:hidden"
            aria-expanded={isOpen}
            aria-label="Ouvrir le menu"
          >
            {isOpen ? 'Fermer' : 'Menu'}
          </button>
        </div>

        {isOpen && (
          <div className="border-t border-zinc-200 py-5 lg:hidden">
            <nav className="flex flex-col gap-4">
              {navItems.map(({ link }, i) => {
                return (
                  <CMSLink
                    key={i}
                    {...link}
                    appearance="link"
                    className="text-base font-semibold text-zinc-800 hover:text-red-700"
                  />
                )
              })}

              <a
                href={janeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 rounded-full bg-red-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-red-800"
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