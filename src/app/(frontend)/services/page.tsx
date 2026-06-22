import type { Metadata } from 'next'

import { ServicesPage } from '@/components/services/ServicesPage'
import { getDefaultOpenGraphImages } from '@/utilities/seo'

const title = 'Services | Chiropratique St-Roch'
const description =
  'Découvrez les services offerts chez Chiropratique St-Roch à Québec : chiropratique, ostéopathie, massothérapie, kinésithérapie et orthothérapie.'

export const metadata: Metadata = {
  title,
  description,

  alternates: {
    canonical: '/services',
  },

  openGraph: {
    title,
    description,
    url: '/services',
    type: 'website',
    siteName: 'Chiropratique St-Roch',
    locale: 'fr_CA',
    images: getDefaultOpenGraphImages('Services de Chiropratique St-Roch'),
  },

  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: getDefaultOpenGraphImages('Services de Chiropratique St-Roch'),
  },
}

export default function Page() {
  return <ServicesPage />
}