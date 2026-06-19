import type { Metadata } from 'next'

import { ContactPage } from '@/components/contact/ContactPage'

export const metadata: Metadata = {
  title: 'Contact | Chiropratique St-Roch',
  description:
    'Contactez Chiropratique St-Roch, trouvez l’emplacement de la clinique et prenez rendez-vous en ligne avec Jane.',
}

export default function Page() {
  return <ContactPage />
}