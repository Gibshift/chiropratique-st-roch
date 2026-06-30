import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig<'media'> = {
  slug: 'media',

  labels: {
    singular: 'Média',
    plural: 'Médias',
  },

  folders: true,

  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },

  admin: {
    group: 'Médias',
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texte alternatif',
      admin: {
        description:
          'Courte description de l’image pour l’accessibilité et le référencement.',
      },
    },
    {
      name: 'caption',
      type: 'richText',
      label: 'Légende',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],

  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    formatOptions: {
      format: 'webp',
      options: { quality: 85 },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
      {
        name: 'square',
        width: 500,
        height: 500,
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
      {
        name: 'small',
        width: 600,
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
      {
        name: 'medium',
        width: 900,
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
      {
        name: 'large',
        width: 1400,
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
      {
        name: 'xlarge',
        width: 1920,
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
        formatOptions: { format: 'webp', options: { quality: 90 } },
      },
    ],
  },
}