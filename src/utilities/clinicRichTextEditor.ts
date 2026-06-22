import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const createClinicRichTextEditor = (extraFeatures: any[] = []) =>
  lexicalEditor({
    features: ({ rootFeatures }) => {
      return [
        ...rootFeatures,
        ...extraFeatures,
        FixedToolbarFeature(),
        InlineToolbarFeature(),
      ]
    },
  })

export const clinicRichTextEditor = createClinicRichTextEditor()