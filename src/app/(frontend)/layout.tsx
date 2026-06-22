import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { LocalBusinessJsonLd } from '@/components/seo/LocalBusinessJsonLd'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { draftMode } from 'next/headers'
import { getDefaultOpenGraphImages } from '@/utilities/seo'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const siteUrl = getServerSideURL()

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="fr-CA" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>

      <body>
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
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: 'Chiropratique St-Roch | Clinique multidisciplinaire à Québec',
    template: '%s | Chiropratique St-Roch',
  },

  description:
    'Chiropratique St-Roch est une clinique multidisciplinaire située à Québec offrant des soins de chiropratique, d’ostéopathie, de massothérapie, de kinésithérapie et d’orthothérapie.',

  alternates: {
    canonical: '/',
  },

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