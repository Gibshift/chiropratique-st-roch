import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'isFeatured', 'order'],
    group: 'Clinique',
  },

  access: {
    read: () => true,
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Nom du service',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL du service',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Exemple : chiropratique, osteopathie, massotherapie',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Résumé court',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description complète',
    },
    {
      name: 'janeUrl',
      type: 'text',
      label: 'Lien Jane',
      admin: {
        description: 'Lien de prise de rendez-vous pour ce service',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Image du service',
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
          admin: {
            description: 'Titre affiché dans Google',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description SEO',
          admin: {
            description: 'Courte description pour Google',
          },
        },
      ],
    },
  ],
}