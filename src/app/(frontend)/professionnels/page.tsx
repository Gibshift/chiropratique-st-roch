import type { Metadata } from 'next'

import { ProfessionalsPage } from '@/components/professionals/ProfessionalsPage'
import { getDefaultOpenGraphImages } from '@/utilities/seo'

const title = 'Professionnels'
const description =
  "Rencontrez notre équipe de chiropraticiens, ostéopathes, massothérapeutes, kinésithérapeutes et orthothérapeutes à Québec. À votre disposition."

export const metadata: Metadata = {
  title,
  description,

  alternates: {
    canonical: '/professionnels',
  },

  openGraph: {
    title,
    description,
    url: '/professionnels',
    type: 'website',
    siteName: 'Chiropratique St-Roch',
    locale: 'fr_CA',
    images: getDefaultOpenGraphImages('Professionnels de Chiropratique St-Roch', 'Notre équipe'),
  },

  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: getDefaultOpenGraphImages('Professionnels de Chiropratique St-Roch', 'Notre équipe'),
  },
}

export default function Page() {
  return <ProfessionalsPage />
}