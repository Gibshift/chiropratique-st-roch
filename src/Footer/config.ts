import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',

  label: 'Menu du pied de page',

  access: {
    read: () => true,
  },

  admin: {
    group: 'Navigation',
  },

  fields: [
    {
      name: 'navItems',
      type: 'array',
      label: 'Liens du pied de page',
      labels: {
        singular: 'Lien',
        plural: 'Liens',
      },
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        description:
          'Ces liens apparaissent dans le pied de page du site.',
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
  ],

  hooks: {
    afterChange: [revalidateFooter],
  },
}