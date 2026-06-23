import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { clinicRichTextEditor } from '../utilities/clinicRichTextEditor'
import { slugify } from '../utilities/slugify'

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
              name: 'whoIsItFor',
              type: 'richText',
              label: 'Pour qui?',
              editor: clinicRichTextEditor,
              admin: {
                description:
                  'Section optionnelle pour expliquer à qui ce service peut s’adresser. Exemple : douleurs, tensions, prévention, récupération, inconforts.',
                className: 'clinic-rich-text-editor',
              },
            },
            {
              name: 'whatToExpect',
              type: 'richText',
              label: 'Déroulement d’une rencontre',
              editor: clinicRichTextEditor,
              admin: {
                description:
                  'Section optionnelle pour expliquer simplement comment peut se dérouler une rencontre.',
                className: 'clinic-rich-text-editor',
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
                editor: clinicRichTextEditor,
                admin: {
                  description:
                    'Texte complet affiché sur la page individuelle du service. Astuce : pour coller un texte propre depuis Word, Google Docs ou ChatGPT, utilisez Ctrl + Shift + V.',
                  className: 'clinic-rich-text-editor',
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
                {
                  name: 'whoIsItFor',
                  type: 'richText',
                  label: 'Pour qui?',
                  editor: clinicRichTextEditor,
                  admin: {
                    description:
                      'Section optionnelle pour expliquer à qui ce service peut s’adresser. Exemple : douleurs, tensions, prévention, récupération, inconforts.',
                    className: 'clinic-rich-text-editor',
                  },
                },
                {
                  name: 'whatToExpect',
                  type: 'richText',
                  label: 'Déroulement d’une rencontre',
                  editor: clinicRichTextEditor,
                  admin: {
                    description:
                      'Section optionnelle pour expliquer simplement comment peut se dérouler une rencontre.',
                    className: 'clinic-rich-text-editor',
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