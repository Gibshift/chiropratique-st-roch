import type { CollectionConfig } from 'payload'

export const Conditions: CollectionConfig = {
  slug: 'conditions',

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
      label: 'Nom de la condition',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL de la condition',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Exemple : douleur-lombaire, sciatique, douleur-cervicale',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Résumé court',
      required: true,
    },
    {
      name: 'intro',
      type: 'richText',
      label: 'Texte principal',
    },
    {
      name: 'commonSymptoms',
      type: 'array',
      label: 'Symptômes fréquents',
      fields: [
        {
          name: 'symptom',
          type: 'text',
          label: 'Symptôme',
          required: true,
        },
      ],
    },
    {
      name: 'whenToConsult',
      type: 'richText',
      label: 'Quand consulter?',
    },
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Services liés',
    },
    {
      name: 'janeUrl',
      type: 'text',
      label: 'Lien Jane',
      admin: {
        description: 'Lien de prise de rendez-vous lié à cette condition, si différent du lien général',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Image de la condition',
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