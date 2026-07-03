import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig<'users'> = {
  slug: 'users',

  labels: {
    singular: 'Utilisateur',
    plural: 'Utilisateurs',
  },

  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },

  admin: {
    group: 'Administration',
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },

  auth: {
    useAPIKey: true,
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nom',
    },
  ],

  timestamps: true,
}