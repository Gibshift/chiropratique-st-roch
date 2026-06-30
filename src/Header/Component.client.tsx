'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import Image from 'next/image'
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
      <div className="mx-auto max-w-[1200px] px-6 pt-8 lg:px-8">
        <div className="grid h-24 grid-cols-[auto_auto] items-center justify-between gap-6 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-4">
            <Image
              src="/logo-st-roch.png"
              alt="Logo Chiropratique St-Roch"
              width={80}
              height={80}
              className="h-20 w-20 object-cover"
              priority
            />

            <span className="font-[var(--font-barlow-condensed)] text-[16px] font-medium uppercase leading-none tracking-[0.28em] text-zinc-950 xl:hidden">
              Multiclinique
            </span>
          </Link>

          {/* NAV DESKTOP */}
          <div className="hidden justify-center xl:flex">
            <HeaderNav data={data} />
          </div>

          {/* BOUTON RDV DESKTOP */}
          <a
            href={janeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-[54px] min-w-[190px] items-center justify-center whitespace-nowrap border border-red-600 bg-white/90 px-5 text-red-600 backdrop-blur-sm transition hover:bg-red-600 hover:text-white xl:inline-flex"
          >
            <span className="font-[var(--font-barlow-condensed)] text-[15px] font-medium uppercase leading-none tracking-[0.22em]">
              Prendre rendez-vous
            </span>
          </a>

          {/* MENU MOBILE */}
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="justify-self-end border border-zinc-300 bg-white/90 px-8 py-3 text-sm font-semibold backdrop-blur xl:hidden"
            aria-expanded={isOpen}
            aria-label="Ouvrir le menu"
          >
            {isOpen ? 'Fermer' : 'Menu'}
          </button>
        </div>

        {isOpen && (
          <div className="mt-4 border border-zinc-200 bg-white/95 p-5 shadow-sm xl:hidden">
            <nav className="flex flex-col gap-4">
              {navItems.map(({ link }, i) => {
                return (
                  <CMSLink
                    key={i}
                    {...link}
                    appearance="link"
                    className="font-[var(--font-barlow-condensed)] text-[15px] font-medium uppercase leading-none tracking-[0.2em] text-zinc-950 hover:text-red-600"
                  />
                )
              })}

              <a
                href={janeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-[52px] items-center justify-center border border-red-600 bg-white px-5 text-center text-red-600 transition hover:bg-red-600 hover:text-white"
              >
                <span className="font-[var(--font-barlow-condensed)] text-[15px] font-medium uppercase leading-none tracking-[0.22em]">
                  Prendre rendez-vous
                </span>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )}