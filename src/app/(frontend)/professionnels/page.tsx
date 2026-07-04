import type { Metadata } from 'next'

import { ProfessionalsPage } from '@/components/professionals/ProfessionalsPage'
import { getDefaultOpenGraphImages } from '@/utilities/seo'

const title = 'Professionnels | Chiropratique St-Roch'
const description =
  'Découvrez les professionnels de Chiropratique St-Roch à Québec : chiropraticiens, ostéopathes, massothérapeutes, kinésithérapeutes, orthothérapeutes et autres membres de l’équipe clinique.'

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