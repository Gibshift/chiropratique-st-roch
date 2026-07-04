import type { Metadata } from 'next'
import PageTemplate from './[slug]/page'
import { getDefaultOpenGraphImages } from '@/utilities/seo'

export const revalidate = 3600

export default PageTemplate

const title = 'Chiropratique St-Roch | Clinique multidisciplinaire à Québec'
const description =
  "Chiropratique St-Roch est une clinique multidisciplinaire à Québec offrant des soins de chiropratique, d'ostéopathie, de massothérapie, de kinésithérapie et d'orthothérapie."

export const metadata: Metadata = {
  title,
  description,

  alternates: {
    canonical: '/',
  },

  openGraph: {
    title,
    description,
    url: '/',
    type: 'website',
    siteName: 'Chiropratique St-Roch',
    locale: 'fr_CA',
    images: getDefaultOpenGraphImages(),
  },

  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: getDefaultOpenGraphImages(),
  },
}
