import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

export const Categories: CollectionConfig<'categories'> = {
  slug: 'categories',

  labels: {
    singular: 'Catégorie',
    plural: 'Catégories',
  },

  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },

  admin: {
    group: 'Blogue',
    useAsTitle: 'title',
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titre',
      required: true,
    },
    slugField({
      position: undefined,
    }),
  ],
}