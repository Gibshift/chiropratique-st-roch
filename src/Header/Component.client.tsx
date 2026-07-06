'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { HeaderNav } from './Nav'
import { InfoBar } from './InfoBar'

type HourEntry = { id?: string; day: string; hours: string }

interface HeaderClientProps {
  data: Header
  janeUrl: string
  phone: string | null
  openingHours: HourEntry[]
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, janeUrl, phone, openingHours }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const headerRef = React.useRef<HTMLElement>(null)

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

  useEffect(() => {
    const update = () => {
      if (headerRef.current) {
        document.documentElement.style.setProperty('--header-h', `${headerRef.current.offsetHeight}px`)
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [scrolled])

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-50 text-zinc-950 bg-white border-b border-zinc-950/10 transition-all duration-300 ${scrolled ? 'shadow-[0_2px_12px_rgba(0,0,0,0.08)]' : ''}`}
        {...(theme ? { 'data-theme': theme } : {})}
      >
        <InfoBar phone={phone} openingHours={openingHours} scrolled={scrolled} />
        <div className="w-full pr-6 lg:pr-10 xl:pr-16 transition-all duration-300">
          <div className="grid grid-cols-[auto_1fr_auto] items-stretch gap-3 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:gap-6">
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

            {/* NAV DESKTOP | CTA MOBILE centré */}
            <div className="flex items-center justify-center">
              {/* Desktop nav */}
              <div className="hidden xl:block">
                <HeaderNav data={data} />
              </div>
              {/* Mobile RDV — centré dans la colonne du milieu */}
              <a
                href={janeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center justify-center bg-red-600 px-5 text-white transition hover:bg-red-700 xl:hidden"
              >
                <span className="font-[var(--font-barlow-condensed)] text-[13px] font-medium uppercase leading-none tracking-[0.18em]">
                  Prendre rendez-vous
                </span>
              </a>
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

            {/* HAMBURGER MOBILE */}
            <button
              type="button"
              onClick={() => setIsOpen((value) => !value)}
              className="inline-flex min-h-[44px] w-[44px] self-center flex-col items-center justify-center gap-[5px] xl:hidden"
              aria-expanded={isOpen}
              aria-label="Ouvrir le menu"
            >
                <span className="block h-[1.5px] w-5 bg-zinc-800" />
                <span className="block h-[1.5px] w-5 bg-zinc-800" />
                <span className="block h-[1.5px] w-5 bg-zinc-800" />
              </button>
          </div>
        </div>
      </header>

      {/* OVERLAY */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 xl:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* DRAWER DROITE */}
      <div
        className={`fixed top-0 right-0 z-[70] flex h-full w-[300px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out xl:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* En-tête drawer */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5">
          <span className="font-[var(--font-barlow-condensed)] text-[13px] font-medium uppercase tracking-[0.22em] text-zinc-400">
            Navigation
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-9 w-9 items-center justify-center border border-zinc-300 text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950"
            aria-label="Fermer le menu"
          >
            <svg viewBox="0 0 14 14" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
              <path d="M1 1l12 12M13 1L1 13" />
            </svg>
          </button>
        </div>

        {/* Liens nav */}
        <nav className="flex flex-1 flex-col gap-0 overflow-y-auto px-6 pt-4">
          {navItems.map(({ link }, i) => (
            <CMSLink
              key={i}
              {...link}
              appearance="link"
              className="border-b border-zinc-100 py-4 font-[var(--font-barlow-condensed)] text-[18px] font-medium uppercase leading-none tracking-[0.16em] transition text-zinc-950 hover:text-red-600"
            />
          ))}
        </nav>

        {/* CTA en bas */}
        <div className="p-6">
          <a
            href={janeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[52px] w-full items-center justify-center border border-red-600 bg-white px-5 text-red-600 transition hover:bg-red-600 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <span className="font-[var(--font-barlow-condensed)] text-[15px] font-medium uppercase leading-none tracking-[0.22em]">
              Prendre rendez-vous
            </span>
          </a>
        </div>
      </div>
    </>
  )}