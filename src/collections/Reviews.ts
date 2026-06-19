import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',

  labels: {
    singular: 'Avis',
    plural: 'Avis',
  },

  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'rating', 'source', 'isFeatured', 'order'],
    group: 'Clinique',
  },

  access: {
    read: () => true,
  },

  fields: [
    {
      name: 'authorName',
      type: 'text',
      label: 'Nom de la personne',
      required: true,
    },
    {
      name: 'rating',
      type: 'number',
      label: 'Note',
      min: 1,
      max: 5,
      defaultValue: 5,
      required: true,
    },
    {
      name: 'source',
      type: 'select',
      label: 'Source',
      defaultValue: 'google',
      options: [
        {
          label: 'Google',
          value: 'google',
        },
        {
          label: 'Facebook',
          value: 'facebook',
        },
        {
          label: 'Autre',
          value: 'other',
        },
      ],
    },
    {
      name: 'reviewText',
      type: 'textarea',
      label: 'Texte de l’avis',
      required: true,
    },
    {
      name: 'reviewDate',
      type: 'date',
      label: 'Date de l’avis',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
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
      name: 'order',
      type: 'number',
      label: 'Ordre d’affichage',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}