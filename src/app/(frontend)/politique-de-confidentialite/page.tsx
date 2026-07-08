import type { Metadata } from 'next'
import { PolitiqueConfidentialitePage } from '@/components/privacy/PolitiqueConfidentialitePage'
import { getDefaultOpenGraphImages } from '@/utilities/seo'

const title = 'Politique de confidentialité'
const description =
  'Politique de confidentialité de Chiropratique St-Roch — protection des renseignements personnels conformément à la Loi 25.'

export const metadata: Metadata = {
  title,
  description,

  alternates: {
    canonical: '/politique-de-confidentialite',
  },

  openGraph: {
    title,
    description,
    url: '/politique-de-confidentialite',
    type: 'website',
    siteName: 'Chiropratique St-Roch',
    locale: 'fr_CA',
    images: getDefaultOpenGraphImages('Politique de confidentialité', 'Politique de confidentialité'),
  },

  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: getDefaultOpenGraphImages('Politique de confidentialité', 'Politique de confidentialité'),
  },
}

export default function Page() {
  return <PolitiqueConfidentialitePage />
}
