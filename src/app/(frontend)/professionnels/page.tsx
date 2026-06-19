import type { Metadata } from 'next'

import { ProfessionalsPage } from '@/components/professionals/ProfessionalsPage'

export const metadata: Metadata = {
  title: 'Professionnels | Chiropratique St-Roch',
  description:
    'Découvrez les professionnels de Chiropratique St-Roch : chiropraticiens, ostéopathes, massothérapeutes et autres membres de l’équipe clinique.',
}

export default function Page() {
  return <ProfessionalsPage />
}