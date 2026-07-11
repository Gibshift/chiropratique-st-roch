import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { DM_Sans } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { CookieConsentBanner } from '@/components/analytics/CookieConsentBanner'
import { LocalBusinessJsonLd } from '@/components/seo/LocalBusinessJsonLd'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { draftMode } from 'next/headers'
import { getDefaultOpenGraphImages } from '@/utilities/seo'
import { Barlow_Condensed } from 'next/font/google'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const siteUrl = getServerSideURL()

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
  <html
    className={cn(dmSans.variable, GeistMono.variable, barlowCondensed.variable, 'overflow-x-clip')}
    lang="fr-CA"
    suppressHydrationWarning
  >
    <head>
      <InitTheme />
      <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
    </head>

    <body className="overflow-x-clip">
      <Providers>
        <LocalBusinessJsonLd />

        <AdminBar
          adminBarProps={{
            preview: isEnabled,
          }}
        />

        <Header />
        {children}
        <Footer />
        <CookieConsentBanner />
      </Providers>
    </body>
  </html>
)
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: 'Chiropratique St-Roch | Clinique à Québec',
    template: '%s | Chiropratique St-Roch',
  },

  description:
    "Clinique multidisciplinaire à Québec : chiropratique, ostéopathie, massothérapie, kinésithérapie et orthothérapie. Une équipe dédiée à votre santé.",

  openGraph: {
    type: 'website',
    locale: 'fr_CA',
    url: siteUrl,
    siteName: 'Chiropratique St-Roch',
    title: 'Chiropratique St-Roch | Clinique multidisciplinaire à Québec',
    description:
      'Clinique multidisciplinaire à Québec offrant des soins de chiropratique, d’ostéopathie, de massothérapie, de kinésithérapie et d’orthothérapie.',
    images: getDefaultOpenGraphImages(),  
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Chiropratique St-Roch | Clinique multidisciplinaire à Québec',
    description:
      'Clinique multidisciplinaire à Québec offrant des soins de chiropratique, d’ostéopathie, de massothérapie, de kinésithérapie et d’orthothérapie.',
    images: getDefaultOpenGraphImages(),  
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}