import type { CollectionConfig } from 'payload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { authenticated } from '../access/authenticated'
import { clinicRichTextEditor } from '../utilities/clinicRichTextEditor'
import { slugify } from '../utilities/slugify'

export const ConditionCategories: CollectionConfig = {
  slug: 'condition-categories',

  labels: {
    singular: 'Catégorie de conditions',
    plural: 'Catégories de conditions',
  },

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order'],
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
              label: 'Titre de la catégorie',
              required: true,
              admin: {
                description: 'Exemple : Douleurs au cou, à la tête et à la mâchoire',
              },
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Sous-titre (au-dessus du grand titre)',
              admin: {
                description:
                  'Affiché en rouge au-dessus du titre. Exemple : LES CONDITIONS AFFECTANT LES',
              },
            },
            {
              name: 'slug',
              type: 'text',
              label: 'URL de la catégorie',
              required: true,
              unique: true,
              admin: {
                description: 'Exemple : tete-cou, dos-sacrum, membres-inferieurs',
              },
            },
            {
              name: 'regionTitle',
              type: 'text',
              label: 'Titre de région',
              admin: {
                description: 'Titre de la première section. Exemple : Région cervico-crânienne',
              },
            },
            {
              name: 'intro',
              type: 'richText',
              label: 'Introduction',
              editor: clinicRichTextEditor,
              admin: {
                description:
                  "Texte d'introduction avant la liste (disclaimer, contexte). Astuce : Ctrl + Shift + V pour coller proprement.",
                className: 'clinic-rich-text-editor',
              },
            },
            {
              name: 'conditionsList',
              type: 'richText',
              label: 'Liste des conditions',
              editor: clinicRichTextEditor,
              admin: {
                description:
                  'La liste complète des conditions traitées dans cette catégorie. Astuce : Ctrl + Shift + V pour coller proprement.',
                className: 'clinic-rich-text-editor',
              },
            },
            {
              name: 'disclaimer',
              type: 'richText',
              label: 'Avertissement (Important)',
              editor: clinicRichTextEditor,
              admin: {
                description: 'Section "Important" affichée après la liste des conditions.',
                className: 'clinic-rich-text-editor',
              },
            },
            {
              name: 'ctaText',
              type: 'text',
              label: "Texte d'appel à l'action",
              defaultValue: 'Vous vous reconnaissez dans une de ces conditions?',
              admin: {
                description: 'Texte affiché avant le bouton de prise de rendez-vous.',
              },
            },
          ],
        },
        {
          label: 'Relations',
          fields: [
            {
              name: 'relatedServices',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
              label: 'Services liés',
              admin: {
                description: 'Services affichés dans la section "Pour vous aider" en bas de page.',
              },
            },
          ],
        },
        {
          label: 'Affichage',
          fields: [
            {
              name: 'hint',
              type: 'text',
              label: 'Sous-titre de la carte',
              admin: {
                description:
                  'Court texte affiché sous le titre sur la carte. Exemple : Genoux · Hanches · Pieds · Chevilles',
              },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Image de fond (hero)',
              admin: {
                description: "Image optionnelle affichée en arrière-plan du hero.",
              },
            },
            {
              name: 'order',
              type: 'number',
              label: "Ordre d'affichage",
              defaultValue: 0,
              admin: {
                description: "Plus le chiffre est bas, plus la catégorie apparaît en premier.",
              },
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({ hasGenerateFn: true }),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
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
