import type { Block } from 'payload'

export const FormBlock: Block = {
  slug: 'formBlock',

  labels: {
    singular: 'Bloc formulaire désactivé',
    plural: 'Blocs formulaire désactivés',
  },

  fields: [
    {
      name: 'message',
      type: 'text',
      label: 'Message interne',
      defaultValue: 'Les formulaires du site sont maintenant gérés par Jane.',
      admin: {
        description:
          'Ce bloc est conservé seulement pour éviter de briser les anciennes pages du template.',
      },
    },
  ],
}