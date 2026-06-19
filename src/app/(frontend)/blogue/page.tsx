import type { Metadata } from 'next'

import { BloguePage } from '@/components/blogue/BloguePage'

export const metadata: Metadata = {
  title: 'Blogue santé | Chiropratique St-Roch',
  description:
    'Articles de Chiropratique St-Roch sur les douleurs, la posture, les tensions musculaires, la santé musculosquelettique et les habitudes de vie.',
}

export default function Page() {
  return <BloguePage />
}