import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

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
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },

  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Avis',
          fields: [
            {
              name: 'authorName',
              type: 'text',
              label: 'Nom de la personne',
              required: true,
              admin: {
                description: 'Nom affiché avec l’avis. Exemple : Marie D.',
              },
            },
            {
              name: 'rating',
              type: 'number',
              label: 'Note',
              min: 1,
              max: 5,
              defaultValue: 5,
              required: true,
              admin: {
                description: 'Note de 1 à 5 étoiles.',
              },
            },
            {
              name: 'source',
              type: 'select',
              label: 'Source de l’avis',
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
              admin: {
                description: 'Texte affiché sur le site.',
              },
            },
            {
              name: 'reviewDate',
              type: 'date',
              label: 'Date de l’avis',
              admin: {
                date: {
                  pickerAppearance: 'dayOnly',
                },
                description: 'Optionnel. Date où l’avis a été publié.',
              },
            },
          ],
        },
        {
          label: 'Affichage',
          fields: [
            {
              name: 'isFeatured',
              type: 'checkbox',
              label: 'Afficher sur la page d’accueil',
              defaultValue: false,
              admin: {
                description:
                  'Active cet avis dans la section Avis de la page d’accueil.',
              },
            },
            {
              name: 'order',
              type: 'number',
              label: 'Ordre d’affichage',
              defaultValue: 0,
              admin: {
                description:
                  'Plus le chiffre est bas, plus l’avis apparaît haut dans les listes.',
              },
            },
          ],
        },
      ],
    },
  ],
}