import type { Metadata } from 'next'

import { BloguePage } from '@/components/blogue/BloguePage'
import { getDefaultOpenGraphImages } from '@/utilities/seo'

const title = 'Blogue santé'
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
    images: getDefaultOpenGraphImages('Blogue santé de Chiropratique St-Roch', 'Blogue santé'),
  },

  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: getDefaultOpenGraphImages('Blogue santé de Chiropratique St-Roch', 'Blogue santé'),
  },
}

export const revalidate = 3600

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1)
  return <BloguePage page={page} />
}
