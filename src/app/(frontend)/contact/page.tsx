import type { Metadata } from 'next'

import { ContactPage } from '@/components/contact/ContactPage'
import { getDefaultOpenGraphImages } from '@/utilities/seo'

const title = 'Contact | Chiropratique St-Roch'
const description =
  'Contactez Chiropratique St-Roch à Québec, trouvez l’emplacement de la clinique et prenez rendez-vous en ligne avec Jane.'

export const metadata: Metadata = {
  title,
  description,

  alternates: {
    canonical: '/contact',
  },

  openGraph: {
    title,
    description,
    url: '/contact',
    type: 'website',
    siteName: 'Chiropratique St-Roch',
    locale: 'fr_CA',
    images: getDefaultOpenGraphImages('Contact Chiropratique St-Roch'),
  },

  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: getDefaultOpenGraphImages('Contact Chiropratique St-Roch'),
  },
}

export default function Page() {
  return <ContactPage />
}