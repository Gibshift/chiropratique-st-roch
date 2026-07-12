import type { Metadata } from 'next'

import { ConditionsPage } from '@/components/conditions/ConditionsPage'
import { getDefaultOpenGraphImages } from '@/utilities/seo'

const title = 'Conditions traitées'
const description =
  'Chiropratique St-Roch traite douleur lombaire, sciatique, cervicalgies, maux de tête et autres inconforts musculosquelettiques à Québec.'

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
  },

  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
}

export default function Page() {
  return <ConditionsPage />
}