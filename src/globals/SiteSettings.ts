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
      type: 'tabs',
      tabs: [
        {
          label: 'Clinique',
          fields: [
            {
              name: 'clinicName',
              type: 'text',
              label: 'Nom de la clinique',
              defaultValue: 'Chiropratique St-Roch',
              required: true,
            },
            {
              name: 'homeHeroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Image de fond de l’accueil',
              admin: {
                description:
                  'Image utilisée en fond dans la première section de la page d’accueil.',
              },
            },
          ],
        },
        {
          label: 'Rendez-vous Jane',
          fields: [
            {
              name: 'mainJaneUrl',
              type: 'text',
              label: 'Lien Jane principal',
              defaultValue: 'https://chiropratiquestroch.janeapp.com/embed/book_online',
              required: true,
              admin: {
                description:
                  'Lien utilisé par tous les boutons « Prendre rendez-vous » du site.',
              },
            },
            {
              name: 'janeEmbedCode',
              type: 'textarea',
              label: 'Code iframe Jane',
              defaultValue:
                "<iframe frameborder='0' height='28' scrolling='no' src='https://chiropratiquestroch.janeapp.com/embed/book_online' width='177'></iframe>",
              admin: {
                description:
                  'Code iframe fourni par Jane. On le garde ici si on veut l’utiliser plus tard.',
              },
            },
          ],
        },
        {
          label: 'Coordonnées',
          fields: [
            {
              name: 'phone',
              type: 'text',
              label: 'Téléphone',
              admin: {
                description: 'Exemple : 581.742.3808',
              },
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
                  admin: {
                    description: 'Exemple : 440 Rue Saint-Joseph E',
                  },
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
                  defaultValue: 'QC',
                },
                {
                  name: 'postalCode',
                  type: 'text',
                  label: 'Code postal',
                  admin: {
                    description: 'Exemple : G1K 7Y1',
                  },
                },
              ],
            },
            {
              name: 'googleMapsEmbedUrl',
              type: 'text',
              label: 'Carte Google Maps',
              admin: {
                description:
                  'Colle ici le code iframe complet de Google Maps ou seulement l’URL qui commence par https://www.google.com/maps/embed.',
              },
            },
          ],
        },
        {
          label: 'Heures d’ouverture',
          fields: [
            {
              name: 'openingHours',
              type: 'array',
              label: 'Heures d’ouverture',
              labels: {
                singular: 'Journée',
                plural: 'Journées',
              },
              admin: {
                description:
                  'Ces heures apparaissent sur la page Contact, dans le pied de page et dans les données SEO locales.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'day',
                  type: 'text',
                  label: 'Jour',
                  required: true,
                  admin: {
                    description: 'Exemple : Lundi',
                  },
                },
                {
                  name: 'hours',
                  type: 'text',
                  label: 'Heures',
                  required: true,
                  admin: {
                    description: 'Exemple : 08h - 20h ou Fermé',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Réseaux sociaux',
          fields: [
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
                  admin: {
                    description:
                      'Lien vers la fiche Google de la clinique, si disponible.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Images des pages',
          fields: [
            {
              name: 'servicesHeroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Image hero — Services',
              admin: {
                description: 'Image de fond de la section hero sur la page Services.',
              },
            },
            {
              name: 'conditionsHeroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Image hero — Conditions traitees',
              admin: {
                description: 'Image de fond de la section hero sur la page Conditions traitees.',
              },
            },
            {
              name: 'professionalsHeroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Image hero — Professionnels',
              admin: {
                description: 'Image de fond de la section hero sur la page Professionnels.',
              },
            },
            {
              name: 'blogueHeroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Image hero — Blogue',
              admin: {
                description: 'Image de fond de la section hero sur la page Blogue.',
              },
            },
          ],
        },
        {
          label: 'Annonce',
          fields: [
            {
              name: 'announcement',
              type: 'group',
              label: 'Bandeau d’annonce',
              admin: {
                description:
                  'Optionnel. Sert à afficher un message temporaire sur le site plus tard.',
              },
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
        },
      ],
    },
  ],
}