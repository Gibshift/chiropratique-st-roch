import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { slugify } from '../utilities/slugify'

export const Conditions: CollectionConfig = {
  slug: 'conditions',

  labels: {
    singular: 'Condition traitée',
    plural: 'Conditions traitées',
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
              label: 'Nom de la condition',
              required: true,
              admin: {
                description: 'Exemple : Douleur lombaire, Sciatique, Douleur cervicale.',
              },
            },
            {
              name: 'slug',
              type: 'text',
              label: 'URL de la condition',
              required: true,
              unique: true,
              admin: {
                description:
                  'Texte utilisé dans l’URL. Exemple : douleur-lombaire, sciatique, douleur-cervicale.',
              },
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              label: 'Résumé court',
              required: true,
              admin: {
                description:
                  'Court texte affiché sur les cartes de conditions et les aperçus.',
              },
            },
            {
              name: 'intro',
              type: 'richText',
              label: 'Texte principal',
              admin: {
                description:
                  'Texte principal affiché sur la page individuelle de la condition.',
              },
            },
            {
              name: 'whenToConsult',
              type: 'richText',
              label: 'Quand consulter?',
              admin: {
                description:
                  'Section optionnelle pour expliquer quand il peut être pertinent de consulter.',
              },
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Image de la condition',
              admin: {
                description:
                  'Image optionnelle utilisée pour représenter cette condition.',
              },
            },
          ],
        },
        {
          label: 'Symptômes',
          fields: [
            {
              name: 'commonSymptoms',
              type: 'array',
              label: 'Symptômes fréquents',
              labels: {
                singular: 'Symptôme',
                plural: 'Symptômes',
              },
              admin: {
                description:
                  'Liste courte de symptômes fréquents associés à cette condition.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'symptom',
                  type: 'text',
                  label: 'Symptôme',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Services reliés',
          fields: [
            {
              name: 'relatedServices',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
              label: 'Services liés',
              admin: {
                description:
                  'Services de la clinique qui peuvent être liés à cette condition.',
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
                  'Active cette condition dans la section Conditions traitées de la page d’accueil.',
              },
            },
            {
              name: 'order',
              type: 'number',
              label: 'Ordre d’affichage',
              defaultValue: 0,
              admin: {
                description:
                  'Plus le chiffre est bas, plus la condition apparaît haut dans les listes.',
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
                      'Titre affiché dans Google. Si vide, le nom de la condition sera utilisé.',
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
        if (data?.title && !data?.slug) {
          data.slug = slugify(data.title)
        }

        return data
      },
    ],
  },
}