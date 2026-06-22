import type { Metadata } from 'next'

import { BloguePage } from '@/components/blogue/BloguePage'
import { getDefaultOpenGraphImages } from '@/utilities/seo'

const title = 'Blogue santé | Chiropratique St-Roch'
const description =
  'Articles de Chiropratique St-Roch sur les douleurs, la posture, les tensions musculaires, la santé musculosquelettique et les habitudes de vie.'

export const metadata: Metadata = {
  title,
  description,

  alternates: {
    canonical: '/blogue',
  },

  openGraph: {
    title,
    description,
    url: '/blogue',
    type: 'website',
    siteName: 'Chiropratique St-Roch',
    locale: 'fr_CA',
    images: getDefaultOpenGraphImages('Blogue santé de Chiropratique St-Roch'),
  },

  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: getDefaultOpenGraphImages('Blogue santé de Chiropratique St-Roch'),
  },
}

export default function Page() {
  return <BloguePage />
}