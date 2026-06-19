import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',

  label: 'Réglages du site',

  admin: {
    group: 'Clinique',
  },

  access: {
    read: () => true,
  },

  fields: [
    {
      name: 'clinicName',
      type: 'text',
      label: 'Nom de la clinique',
      defaultValue: 'Chiropratique St-Roch',
      required: true,
    },
    {
      name: 'mainJaneUrl',
      type: 'text',
      label: 'Lien Jane principal',
      defaultValue: 'https://chiropratiquestroch.janeapp.com/embed/book_online',
      required: true,
      admin: {
        description: 'Lien utilisé par les boutons Prendre rendez-vous.',
      },
    },
    {
      name: 'janeEmbedCode',
      type: 'textarea',
      label: 'Code iframe Jane',
      defaultValue:
        "<iframe frameborder='0' height='28' scrolling='no' src='https://chiropratiquestroch.janeapp.com/embed/book_online' width='177'></iframe>",
      admin: {
        description: 'Code iframe fourni par Jane, si on veut l’utiliser plus tard.',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Téléphone',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Courriel',
    },
    {
      name: 'address',
      type: 'group',
      label: 'Adresse',
      fields: [
        {
          name: 'street',
          type: 'text',
          label: 'Rue',
        },
        {
          name: 'city',
          type: 'text',
          label: 'Ville',
          defaultValue: 'Québec',
        },
        {
          name: 'province',
          type: 'text',
          label: 'Province',
          defaultValue: 'Québec',
        },
        {
          name: 'postalCode',
          type: 'text',
          label: 'Code postal',
        },
      ],
    },
    {
      name: 'googleMapsEmbedUrl',
      type: 'text',
      label: 'Lien Google Map intégré',
      admin: {
        description: 'URL ou iframe Google Maps pour afficher la carte sur le site.',
      },
    },
    {
      name: 'openingHours',
      type: 'array',
      label: 'Heures d’ouverture',
      fields: [
        {
          name: 'day',
          type: 'text',
          label: 'Jour',
          required: true,
        },
        {
          name: 'hours',
          type: 'text',
          label: 'Heures',
          required: true,
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'group',
      label: 'Réseaux sociaux',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook',
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram',
        },
        {
          name: 'googleBusiness',
          type: 'text',
          label: 'Google Business Profile',
        },
      ],
    },
    {
      name: 'announcement',
      type: 'group',
      label: 'Bandeau d’annonce',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Activer le bandeau',
          defaultValue: false,
        },
        {
          name: 'message',
          type: 'text',
          label: 'Message',
        },
        {
          name: 'linkLabel',
          type: 'text',
          label: 'Texte du lien',
        },
        {
          name: 'linkUrl',
          type: 'text',
          label: 'URL du lien',
        },
      ],
    },
  ],
}