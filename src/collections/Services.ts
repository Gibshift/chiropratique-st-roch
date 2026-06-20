import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const Services: CollectionConfig = {
  slug: 'services',

  labels: {
    singular: 'Service',
    plural: 'Services',
  },

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'isFeatured', 'order'],
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
          label: 'Contenu',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Nom du service',
              required: true,
              admin: {
                description: 'Exemple : Chiropratique, Ostéopathie, Massothérapie.',
              },
            },
            {
              name: 'slug',
              type: 'text',
              label: 'URL du service',
              required: true,
              unique: true,
              admin: {
                description:
                  'Texte utilisé dans l’URL. Exemple : chiropratique, osteopathie, massotherapie.',
              },
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              label: 'Résumé court',
              required: true,
              admin: {
                description:
                  'Court texte affiché sur les cartes de services et les aperçus.',
              },
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Description complète',
              admin: {
                description:
                  'Texte complet affiché sur la page individuelle du service.',
              },
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Image du service',
              admin: {
                description:
                  'Image optionnelle utilisée pour représenter ce service.',
              },
            },
          ],
        },
        {
          label: 'Rendez-vous',
          fields: [
            {
              name: 'janeUrl',
              type: 'text',
              label: 'Lien Jane spécifique',
              admin: {
                description:
                  'Optionnel. Si vide, le site utilisera le lien Jane principal des Réglages du site.',
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
                  'Active ce service dans la section Services de la page d’accueil.',
              },
            },
            {
              name: 'order',
              type: 'number',
              label: 'Ordre d’affichage',
              defaultValue: 0,
              admin: {
                description:
                  'Plus le chiffre est bas, plus le service apparaît haut dans les listes.',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              label: 'Référencement SEO',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Titre SEO',
                  admin: {
                    description:
                      'Titre affiché dans Google. Si vide, le nom du service sera utilisé.',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description SEO',
                  admin: {
                    description:
                      'Courte description pour Google. Idéalement environ 150 à 160 caractères.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}