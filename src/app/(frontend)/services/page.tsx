import type { Metadata } from 'next'

import { ServicesPage } from '@/components/services/ServicesPage'

const title = 'Services'
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
  },

  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
}

export default function Page() {
  return <ServicesPage />
}