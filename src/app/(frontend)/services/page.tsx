import type { Metadata } from 'next'

import { ServicesPage } from '@/components/services/ServicesPage'

export const metadata: Metadata = {
  title: 'Services | Chiropratique St-Roch',
  description:
    'Découvrez les services offerts chez Chiropratique St-Roch : chiropratique, ostéopathie, massothérapie, acupuncture et autres soins musculosquelettiques.',
}

export default function Page() {
  return <ServicesPage />
}