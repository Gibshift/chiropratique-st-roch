import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',

  label: 'Menu principal',

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
      label: 'Liens du menu',
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
          'Ces liens apparaissent dans le menu principal du site.',
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],

  hooks: {
    afterChange: [revalidateHeader],
  },
}