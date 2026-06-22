import type { Metadata } from 'next'

import { ConditionsPage } from '@/components/conditions/ConditionsPage'
import { getDefaultOpenGraphImages } from '@/utilities/seo'

const title = 'Conditions traitées | Chiropratique St-Roch'
const description =
  'Découvrez les conditions traitées chez Chiropratique St-Roch à Québec : douleur lombaire, sciatique, douleur cervicale, maux de tête et autres inconforts musculosquelettiques.'

export const metadata: Metadata = {
  title,
  description,

  alternates: {
    canonical: '/conditions-traitees',
  },

  openGraph: {
    title,
    description,
    url: '/conditions-traitees',
    type: 'website',
    siteName: 'Chiropratique St-Roch',
    locale: 'fr_CA',
    images: getDefaultOpenGraphImages('Conditions traitées chez Chiropratique St-Roch'),
  },

  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: getDefaultOpenGraphImages('Conditions traitées chez Chiropratique St-Roch'),
  },
}

export default function Page() {
  return <ConditionsPage />
}