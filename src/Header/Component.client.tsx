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
  const [scrolled, setScrolled] = useState(false)

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 text-zinc-950 backdrop-blur-sm transition-all duration-300 ${scrolled ? 'bg-white/95 shadow-sm' : 'bg-white/75'}`}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="w-full pr-6 lg:pr-10 xl:pr-16 transition-all duration-300">
        <div className="grid grid-cols-[auto_auto] items-stretch justify-between gap-6 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-4 self-stretch">
            <Image
              src="/logo-st-roch.png"
              alt="Logo Chiropratique St-Roch"
              width={80}
              height={80}
              className={`h-full w-auto object-cover transition-all duration-300 ${scrolled ? 'max-h-[70px]' : 'max-h-[96px]'}`}
              priority
            />

            <span className="hidden 2xl:inline font-[var(--font-barlow-condensed)] text-[16px] font-medium uppercase leading-none tracking-[0.28em] text-zinc-950">
              Multiclinique
            </span>
          </Link>

          {/* NAV DESKTOP */}
          <div className="hidden items-center justify-center xl:flex">
            <HeaderNav data={data} />
          </div>

          {/* BOUTON RDV DESKTOP */}
          <a
            href={janeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-[54px] min-w-[190px] self-center items-center justify-center whitespace-nowrap border border-red-600 bg-white/90 px-5 text-red-600 backdrop-blur-sm transition hover:bg-red-600 hover:text-white xl:inline-flex"
          >
            <span className="font-[var(--font-barlow-condensed)] text-[15px] font-medium uppercase leading-none tracking-[0.22em]">
              Prendre rendez-vous
            </span>
          </a>

          {/* MENU MOBILE */}
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex min-h-[54px] self-center items-center justify-self-end border border-zinc-300 bg-white/90 px-8 text-sm font-semibold backdrop-blur xl:hidden"
            aria-expanded={isOpen}
            aria-label="Ouvrir le menu"
          >
            {isOpen ? 'Fermer' : 'Menu'}
          </button>
        </div>

        {isOpen && (
          <div className="mt-4 border border-zinc-400 bg-white/95 p-5 shadow-sm xl:hidden">
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