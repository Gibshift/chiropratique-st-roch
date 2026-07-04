import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { getAbsoluteUrl } from '@/utilities/seo'

const FALLBACK_JANE_URL = 'https://chiropratiquestroch.janeapp.com'

const dayMap: Record<string, string> = {
  dimanche: 'Sunday',
  lundi: 'Monday',
  mardi: 'Tuesday',
  mercredi: 'Wednesday',
  jeudi: 'Thursday',
  vendredi: 'Friday',
  samedi: 'Saturday',
}

const clinicServices = [
  'Chiropratique',
  'Ostéopathie',
  'Massothérapie',
  'Kinésithérapie',
  'Orthothérapie',
]

function normalizeTime(value: string) {
  const match = value.match(/(\d{1,2})h/i)

  if (!match?.[1]) return null

  return `${match[1].padStart(2, '0')}:00`
}

function parseOpeningHours(openingHours: any[]) {
  return openingHours
    .map((item) => {
      const day = typeof item.day === 'string' ? item.day.toLowerCase().trim() : ''
      const hours = typeof item.hours === 'string' ? item.hours : ''

      if (!day || !hours || hours.toLowerCase().includes('fermé')) {
        return null
      }

      const [openPart, closePart] = hours.split('-')

      if (!openPart || !closePart) {
        return null
      }

      const opens = normalizeTime(openPart)
      const closes = normalizeTime(closePart)

      if (!opens || !closes || !dayMap[day]) {
        return null
      }

      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${dayMap[day]}`,
        opens,
        closes,
      }
    })
    .filter(Boolean)
}

export async function LocalBusinessJsonLd() {
  const payload = await getPayload({ config: configPromise })

  const siteSettings: any = await payload.findGlobal({
    slug: 'site-settings' as any,
    depth: 0,
  })

  const clinicName = siteSettings?.clinicName || 'Chiropratique St-Roch'
  const janeUrl = siteSettings?.mainJaneUrl || FALLBACK_JANE_URL
  const phone = siteSettings?.phone || '581.742.3808'

  const address = siteSettings?.address || {}

  const streetAddress = address.street || '440 Rue Saint-Joseph E'
  const addressLocality = address.city || 'Québec'
  const addressRegion = address.province || 'QC'
  const postalCode = address.postalCode || 'G1K 7Y1'

  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  const sameAs = [
    siteSettings?.socialLinks?.facebook,
    siteSettings?.socialLinks?.instagram,
    siteSettings?.socialLinks?.googleBusiness,
  ].filter(Boolean)

  const openingHoursSpecification = Array.isArray(siteSettings?.openingHours)
    ? parseOpeningHours(siteSettings.openingHours)
    : []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': `${siteUrl}/#localbusiness`,
    name: clinicName,
    url: siteUrl,
    image: getAbsoluteUrl('/og-image'),
    logo: getAbsoluteUrl('/og-image'),
    telephone: phone,
    description:
      'Chiropratique St-Roch est une clinique multidisciplinaire située à Québec offrant des soins de chiropratique, d’ostéopathie, de massothérapie, de kinésithérapie et d’orthothérapie.',
    address: {
      '@type': 'PostalAddress',
      streetAddress,
      addressLocality,
      addressRegion,
      postalCode,
      addressCountry: 'CA',
    },
    areaServed: {
      '@type': 'City',
      name: 'Québec',
    },
    priceRange: '$$',
    sameAs,
    openingHoursSpecification,
    makesOffer: clinicServices.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service,
      },
    })),
    potentialAction: {
      '@type': 'ReserveAction',
      target: janeUrl,
      name: 'Prendre rendez-vous',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  )
}