import type { CollectionConfig } from 'payload'

export const Professionals: CollectionConfig = {
  slug: 'professionals',

  labels: {
    singular: 'Professionnel',
    plural: 'Professionnels',
  },

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'isFeatured', 'order'],
    group: 'Clinique',
  },

  access: {
    read: () => true,
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nom complet',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL du professionnel',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Exemple : marie-dupont',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Titre professionnel',
      required: true,
      admin: {
        description: 'Exemple : Chiropraticienne, Ostéopathe, Massothérapeute',
      },
    },
    {
      name: 'shortBio',
      type: 'textarea',
      label: 'Courte bio',
      required: true,
    },
    {
      name: 'bio',
      type: 'richText',
      label: 'Biographie complète',
    },
    {
      name: 'approach',
      type: 'richText',
      label: 'Approche clinique',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Photo du professionnel',
    },
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Services offerts',
    },
    {
      name: 'relatedConditions',
      type: 'relationship',
      relationTo: 'conditions',
      hasMany: true,
      label: 'Conditions souvent traitées',
    },
    {
      name: 'janeUrl',
      type: 'text',
      label: 'Lien Jane',
      admin: {
        description: 'Lien de prise de rendez-vous spécifique à ce professionnel',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Afficher sur la page d’accueil',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Professionnel actif',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Ordre d’affichage',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titre SEO',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description SEO',
        },
      ],
    },
  ],
}