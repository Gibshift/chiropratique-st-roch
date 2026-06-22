import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { slugify } from '../utilities/slugify'

export const Professionals: CollectionConfig = {
  slug: 'professionals',

  labels: {
    singular: 'Professionnel',
    plural: 'Professionnels',
  },

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'isActive', 'isFeatured', 'order'],
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
              name: 'name',
              type: 'text',
              label: 'Nom complet',
              required: true,
              admin: {
                description: 'Nom affiché sur le site.',
              },
            },
            {
              name: 'slug',
              type: 'text',
              label: 'URL du professionnel',
              required: true,
              unique: true,
              admin: {
                description:
                  'Texte utilisé dans l’URL. Exemple : marie-dupont, jean-tremblay.',
              },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Titre professionnel',
              required: true,
              admin: {
                description:
                  'Exemple : Chiropraticienne, Ostéopathe, Massothérapeute.',
              },
            },
            {
              name: 'shortBio',
              type: 'textarea',
              label: 'Courte bio',
              required: true,
              admin: {
                description:
                  'Court texte affiché sur les cartes de professionnels et les aperçus.',
              },
            },
            {
              name: 'bio',
              type: 'richText',
              label: 'Biographie complète',
              admin: {
                description:
                  'Texte complet affiché sur la page individuelle du professionnel.',
              },
            },
            {
              name: 'approach',
              type: 'richText',
              label: 'Approche clinique',
              admin: {
                description:
                  'Section optionnelle pour présenter son approche, sa façon de travailler ou ses intérêts cliniques.',
              },
            },
          ],
        },
        {
          label: 'Photo',
          fields: [
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
              label: 'Photo du professionnel',
              admin: {
                description:
                  'Photo utilisée sur la page équipe et sur la page individuelle.',
              },
            },
          ],
        },
        {
          label: 'Services et conditions',
          fields: [
            {
              name: 'relatedServices',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
              label: 'Services offerts',
              admin: {
                description:
                  'Services associés à ce professionnel.',
              },
            },
            {
              name: 'relatedConditions',
              type: 'relationship',
              relationTo: 'conditions',
              hasMany: true,
              label: 'Conditions souvent traitées',
              admin: {
                description:
                  'Conditions que ce professionnel traite souvent ou qui peuvent être liées à sa pratique.',
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
              name: 'isActive',
              type: 'checkbox',
              label: 'Professionnel actif',
              defaultValue: true,
              admin: {
                description:
                  'Si désactivé, ce professionnel ne sera pas affiché sur le site.',
              },
            },
            {
              name: 'isFeatured',
              type: 'checkbox',
              label: 'Afficher sur la page d’accueil',
              defaultValue: false,
              admin: {
                description:
                  'Active ce professionnel dans la section Équipe de la page d’accueil.',
              },
            },
            {
              name: 'order',
              type: 'number',
              label: 'Ordre d’affichage',
              defaultValue: 0,
              admin: {
                description:
                  'Plus le chiffre est bas, plus le professionnel apparaît haut dans les listes.',
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
                      'Titre affiché dans Google. Si vide, le nom du professionnel sera utilisé.',
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
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.name && !data?.slug) {
          data.slug = slugify(data.name)
        }

        return data
      },
    ],
  },
}