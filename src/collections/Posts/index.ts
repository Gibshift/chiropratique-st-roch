import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  HorizontalRuleFeature,
} from '@payloadcms/richtext-lexical'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { createClinicRichTextEditor } from '../../utilities/clinicRichTextEditor'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',

  labels: {
    singular: 'Article',
    plural: 'Articles',
  },

  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },

  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
    meta: {
      image: true,
      description: true,
    },
  },

  admin: {
    group: 'Blogue',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'posts',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'posts',
        req,
      }),
    useAsTitle: 'title',
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titre',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contenu',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              label: 'Image principale',
              relationTo: 'media',
            },
            {
              name: 'content',
              type: 'richText',
              editor: createClinicRichTextEditor([
                  BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                  HorizontalRuleFeature(),
                ]),
              label: 'Contenu de l’article',
              required: true,
              admin: {
                description:
                  'Contenu principal de l’article. Astuce : pour coller un texte propre depuis Word, Google Docs ou ChatGPT, utilisez Ctrl + Shift + V.',
                className: 'clinic-rich-text-editor',
              },
            },
          ],
        },
        {
          label: 'Relations',
          fields: [
            {
              name: 'relatedPosts',
              type: 'relationship',
              label: 'Articles reliés',
              admin: {
                position: 'sidebar',
              },
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
              hasMany: true,
              relationTo: 'posts',
            },
            {
              name: 'categories',
              type: 'relationship',
              label: 'Catégories',
              admin: {
                position: 'sidebar',
              },
              hasMany: true,
              relationTo: 'categories',
            },
            {
              name: 'relatedConditions',
              type: 'relationship',
              label: 'Conditions liées',
              admin: {
                position: 'sidebar',
                description:
                  'Conditions traitées liées à cet article. Utilisé pour suggérer les bons professionnels sur la page de l’article.',
              },
              hasMany: true,
              relationTo: 'conditions',
            },
            {
              name: 'relatedProfessionals',
              type: 'relationship',
              label: 'Professionnels liés',
              admin: {
                position: 'sidebar',
                description:
                  'Professionnels à afficher sur la page de cet article.',
              },
              hasMany: true,
              relationTo: 'professionals',
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
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Date de publication',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }

            return value
          },
        ],
      },
    },
    {
      name: 'authors',
      type: 'relationship',
      label: 'Auteurs',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'users',
    },
    {
      name: 'populatedAuthors',
      type: 'array',
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
    slugField(),
  ],

  hooks: {
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
  },

  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}