import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const createClinicRichTextEditor = (extraFeatures: any[] = []) =>
  lexicalEditor({
    features: ({ defaultFeatures }) => {
      return [
        ...defaultFeatures,
        ...extraFeatures,
        FixedToolbarFeature(),
        InlineToolbarFeature(),
      ]
    },
  })

export const clinicRichTextEditor = createClinicRichTextEditor()