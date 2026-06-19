import type { Metadata } from 'next'

import { ConditionsPage } from '@/components/conditions/ConditionsPage'

export const metadata: Metadata = {
  title: 'Conditions traitées | Chiropratique St-Roch',
  description:
    'Découvrez les conditions traitées chez Chiropratique St-Roch : douleur lombaire, sciatique, douleur cervicale, maux de tête et autres inconforts musculosquelettiques.',
}

export default function Page() {
  return <ConditionsPage />
}