import configPromise from '@payload-config'
import { getPayload } from 'payload'

const FALLBACK_JANE_URL = 'https://chiropratiquestroch.janeapp.com/embed/book_online'

function extractMapSrc(value?: string | null) {
  if (!value) return null

  const match = value.match(/src=["']([^"']+)["']/)

  if (match?.[1]) {
    return match[1]
  }

  return value
}

export async function ContactPage() {
  const payload = await getPayload({ config: configPromise })

  const siteSettings = await payload.findGlobal({
    slug: 'site-settings' as any,
    depth: 0,
  })

  const clinicName =
    siteSettings &&
    typeof siteSettings === 'object' &&
    'clinicName' in siteSettings &&
    typeof siteSettings.clinicName === 'string'
      ? siteSettings.clinicName
      : 'Chiropratique St-Roch'

  const janeUrl =
    siteSettings &&
    typeof siteSettings === 'object' &&
    'mainJaneUrl' in siteSettings &&
    typeof siteSettings.mainJaneUrl === 'string' &&
    siteSettings.mainJaneUrl.length > 0
      ? siteSettings.mainJaneUrl
      : FALLBACK_JANE_URL

  const phone =
    siteSettings &&
    typeof siteSettings === 'object' &&
    'phone' in siteSettings &&
    typeof siteSettings.phone === 'string'
      ? siteSettings.phone
      : null

  const email =
    siteSettings &&
    typeof siteSettings === 'object' &&
    'email' in siteSettings &&
    typeof siteSettings.email === 'string'
      ? siteSettings.email
      : null

  const address =
    siteSettings &&
    typeof siteSettings === 'object' &&
    'address' in siteSettings &&
    siteSettings.address &&
    typeof siteSettings.address === 'object'
      ? siteSettings.address
      : null

  const openingHours =
    siteSettings &&
    typeof siteSettings === 'object' &&
    'openingHours' in siteSettings &&
    Array.isArray(siteSettings.openingHours)
      ? siteSettings.openingHours
      : []

  const googleMapsValue =
    siteSettings &&
    typeof siteSettings === 'object' &&
    'googleMapsEmbedUrl' in siteSettings &&
    typeof siteSettings.googleMapsEmbedUrl === 'string'
      ? siteSettings.googleMapsEmbedUrl
      : null

  const mapSrc = extractMapSrc(googleMapsValue)

  const street =
    address && 'street' in address && typeof address.street === 'string'
      ? address.street
      : null

  const city =
    address && 'city' in address && typeof address.city === 'string'
      ? address.city
      : null

  const province =
    address && 'province' in address && typeof address.province === 'string'
      ? address.province
      : null

  const postalCode =
    address && 'postalCode' in address && typeof address.postalCode === 'string'
      ? address.postalCode
      : null

  const fullAddress = [street, city, province, postalCode].filter(Boolean).join(', ')

  return (
    <main className="bg-white text-zinc-950">
      <section className="border-b border-zinc-200 bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <p className="font-semibold text-red-300">Contact</p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            Nous joindre et trouver la clinique.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-200">
            Prenez rendez-vous en ligne avec Jane ou contactez directement la clinique pour toute
            question générale.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href={janeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-red-700 px-7 py-4 text-center font-semibold text-white transition hover:bg-red-800"
            >
              Prendre rendez-vous
            </a>

            {phone && (
              <a
                href={`tel:${phone.replace(/\D/g, '')}`}
                className="rounded-full border border-white/30 px-7 py-4 text-center font-semibold text-white transition hover:bg-white hover:text-zinc-950"
              >
                Appeler la clinique
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
              Clinique
            </p>

            <h2 className="mt-3 text-3xl font-bold">{clinicName}</h2>

            {fullAddress && (
              <p className="mt-5 leading-7 text-zinc-600">
                {fullAddress}
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
              Coordonnées
            </p>

            <div className="mt-5 space-y-4">
              {phone && (
                <p>
                  <span className="font-semibold">Téléphone : </span>
                  <a href={`tel:${phone.replace(/\D/g, '')}`} className="text-red-700 hover:text-red-800">
                    {phone}
                  </a>
                </p>
              )}

              {email && (
                <p>
                  <span className="font-semibold">Courriel : </span>
                  <a href={`mailto:${email}`} className="text-red-700 hover:text-red-800">
                    {email}
                  </a>
                </p>
              )}

              {!phone && !email && (
                <p className="text-zinc-600">
                  Ajoute le téléphone et le courriel dans les Réglages du site.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
              Heures d’ouverture
            </p>

            {openingHours.length > 0 ? (
              <div className="mt-5 divide-y divide-zinc-200">
                {openingHours.map((item: any) => (
                  <div key={item.id} className="flex justify-between gap-6 py-3">
                    <span className="font-semibold">{item.day}</span>
                    <span className="text-right text-zinc-600">{item.hours}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-zinc-600">
                Ajoute les heures d’ouverture dans les Réglages du site.
              </p>
            )}
          </div>

          <div className="rounded-3xl bg-red-700 p-6 text-white">
            <h2 className="text-2xl font-bold">Prendre rendez-vous</h2>

            <p className="mt-4 leading-7 text-red-50">
              La prise de rendez-vous se fait directement en ligne avec Jane.
            </p>

            <a
              href={janeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-red-700 transition hover:bg-zinc-100"
            >
              Prendre rendez-vous
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-100 shadow-sm">
          {mapSrc ? (
            <iframe
              src={mapSrc}
              className="h-[520px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Carte Google Maps - ${clinicName}`}
            />
          ) : (
            <div className="flex h-[520px] items-center justify-center p-8 text-center">
              <div>
                <h2 className="text-2xl font-bold">Carte Google Map à ajouter</h2>
                <p className="mt-3 max-w-md text-zinc-600">
                  Ajoute le lien intégré Google Maps dans les Réglages du site pour afficher la
                  carte ici.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}