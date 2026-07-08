import type { Metadata } from 'next'
import PageTemplate from './[slug]/page'
import { getDefaultOpenGraphImages } from '@/utilities/seo'

export const revalidate = 3600

export default PageTemplate

const title = 'Chiropratique St-Roch | Clinique à Québec'
const description =
  "Clinique multidisciplinaire à Québec : chiropratique, ostéopathie, massothérapie, kinésithérapie et orthothérapie. Une équipe dédiée à votre santé."

export const metadata: Metadata = {
  title: { absolute: title },
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
