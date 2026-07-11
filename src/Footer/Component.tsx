import { getCachedGlobal } from '@/utilities/getGlobals'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'

import { JANE_BASE_URL } from '@/utilities/jane'

export async function Footer() {
  const payload = await getPayload({ config: configPromise })

  const [footerData, siteSettings] = await Promise.all([
    getCachedGlobal('footer', 1)(),
    payload.findGlobal({
      slug: 'site-settings' as any,
      depth: 0,
    }),
  ])

  const navItems = footerData?.navItems || []

  const settings: any = siteSettings || {}

  const clinicName = settings.clinicName || 'Chiropratique St-Roch'
  const janeUrl = settings.mainJaneUrl || JANE_BASE_URL
  const phone = settings.phone || null
  const email = settings.email || null
  const openingHours = Array.isArray(settings.openingHours) ? settings.openingHours : []

  const address = settings.address || {}
  const fullAddress = [
    address.street,
    address.city,
    address.province,
    address.postalCode,
  ]
    .filter(Boolean)
    .join(', ')

  const fallbackLinks = [
    { label: 'Accueil', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Conditions traitées', href: '/conditions-traitees' },
    { label: 'Professionnels', href: '/professionnels' },
    { label: 'Blogue', href: '/blogue' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <footer className="relative z-50 mt-auto bg-zinc-950 text-white shadow-[0_-24px_64px_rgba(0,0,0,0.35)] transform-gpu">
      <div className="mx-auto max-w-[1200px] px-6 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.1fr_0.8fr_0.8fr_0.9fr]">
          <div>
            <Link href="/" className="inline-flex font-[var(--font-barlow-condensed)] text-[1.3rem] font-medium uppercase leading-none tracking-[0.02em]">
              {clinicName}
            </Link>

            <p className="mt-5 max-w-sm leading-7 text-zinc-300">
              Une clinique, plusieurs disciplines, une seule priorité : vous.
            </p>

            <a
              href={janeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-7 inline-flex min-h-[48px] items-center gap-3 border border-red-500 bg-red-500 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-red-500"
            >
              <span className="whitespace-nowrap">Prendre rendez-vous</span>
              <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2.5 w-8 transition duration-200 group-hover:translate-x-1">
                <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
              </svg>
            </a>
          </div>

          <div>
            <h2 className="font-[var(--font-barlow-condensed)] text-sm font-semibold uppercase tracking-wide text-red-500">
              Navigation
            </h2>

            <nav className="mt-5 flex flex-col gap-3">
              {navItems.length > 0
                ? navItems.map(({ link }, i) => {
                    return <CMSLink className="text-zinc-300 hover:text-white" key={i} {...link} />
                  })
                : fallbackLinks.map((item) => (
                    <Link key={item.href} href={item.href} className="text-zinc-300 hover:text-white">
                      {item.label}
                    </Link>
                  ))}
            </nav>
          </div>

          <div>
            <h2 className="font-[var(--font-barlow-condensed)] text-sm font-semibold uppercase tracking-wide text-red-500">
              Coordonnées
            </h2>

            <div className="mt-5 space-y-4 text-zinc-300">
              {fullAddress && <p className="leading-7">{fullAddress}</p>}

              {phone && (
                <p>
                  <a href={`tel:${phone.replace(/\D/g, '')}`} className="hover:text-white">
                    {phone}
                  </a>
                </p>
              )}

              {email && (
                <p>
                  <a href={`mailto:${email}`} className="hover:text-white">
                    {email}
                  </a>
                </p>
              )}

              {!fullAddress && !phone && !email && (
                <p className="leading-7">
                  Contactez-nous pour obtenir nos coordonnées.
                </p>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-[var(--font-barlow-condensed)] text-sm font-semibold uppercase tracking-wide text-red-500">
              Heures d’ouverture
            </h2>

            {openingHours.length > 0 ? (
              <div className="mt-5 space-y-3 text-zinc-300">
                {openingHours.map((item: any) => (
                  <div key={item.id} className="flex justify-between gap-6">
                    <span className="font-medium text-white">{item.day}</span>
                    <span className="text-right">{item.hours}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 leading-7 text-zinc-300">
                Contactez-nous pour connaître nos heures d’ouverture.
              </p>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-zinc-400 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p>© {new Date().getFullYear()} {clinicName}. Tous droits réservés.</p>
            <Link href="/politique-de-confidentialite" className="hover:text-white transition-colors">
              Politique de confidentialité
            </Link>
          </div>

          <div className="flex gap-5">
            {settings.socialLinks?.facebook && (
              <a
                href={settings.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Facebook
              </a>
            )}

            {settings.socialLinks?.instagram && (
              <a
                href={settings.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Instagram
              </a>
            )}

            {settings.socialLinks?.googleBusiness && (
              <a
                href={settings.socialLinks.googleBusiness}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Google
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
