import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { PageHero } from '@/components/ui/PageHero'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const FALLBACK_JANE_URL = 'https://chiropratiquestroch.janeapp.com/embed/book_online'

function extractMapSrc(value?: string | null) {
  if (!value) return null
  const match = value.match(/src=["']([^"']+)["']/)
  return match?.[1] ?? value
}

export async function ContactPage() {
  const payload = await getPayload({ config: configPromise })

  const siteSettings = await payload.findGlobal({
    slug: 'site-settings' as any,
    depth: 0,
  })

  const settings: any = siteSettings || {}

  const clinicName = settings.clinicName || 'Chiropratique St-Roch'
  const janeUrl = settings.mainJaneUrl || FALLBACK_JANE_URL
  const phone = settings.phone || null
  const email = settings.email || null
  const openingHours = Array.isArray(settings.openingHours) ? settings.openingHours : []

  const address = settings.address || {}
  const street = address.street || null
  const city = address.city || null
  const province = address.province || null
  const postalCode = address.postalCode || null
  const fullAddress = [street, city, province, postalCode].filter(Boolean).join(', ')

  const mapSrc = extractMapSrc(settings.googleMapsEmbedUrl)

  return (
    <main className="bg-white text-zinc-950">
      <PageHero
        title="Nous joindre."
        description="Prenez rendez-vous en ligne ou contactez la clinique directement pour toute question."
      />

      <section className="relative z-10 -mt-4 bg-white shadow-[0_-12px_32px_rgba(0,0,0,0.14)]">
        <ScrollReveal>
          <div className="mx-auto max-w-[1200px] px-6 py-20 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12">

              {/* Colonne gauche — infos */}
              <div className="flex flex-col gap-3">

                {/* Adresse */}
                <div className="border border-zinc-200 p-8">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-red-600">
                    Adresse
                  </p>
                  <p className="mt-3 font-[var(--font-barlow-condensed)] text-[1.1rem] font-medium uppercase tracking-[0.02em] text-zinc-950">
                    {clinicName}
                  </p>
                  {fullAddress ? (
                    <p className="mt-2 leading-7 text-zinc-500">{fullAddress}</p>
                  ) : (
                    <p className="mt-2 text-zinc-400">Adresse à configurer dans les réglages.</p>
                  )}
                </div>

                {/* Coordonnées */}
                <div className="border border-zinc-200 p-8">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-red-600">
                    Coordonnées
                  </p>
                  <div className="mt-3 space-y-3">
                    {phone && (
                      <p className="text-zinc-700">
                        <span className="font-semibold text-zinc-950">Tél. </span>
                        <a href={`tel:${phone.replace(/\D/g, '')}`} className="hover:text-red-600">
                          {phone}
                        </a>
                      </p>
                    )}
                    {email && (
                      <p className="text-zinc-700">
                        <span className="font-semibold text-zinc-950">Courriel </span>
                        <a href={`mailto:${email}`} className="hover:text-red-600">
                          {email}
                        </a>
                      </p>
                    )}
                    {!phone && !email && (
                      <p className="text-zinc-400">Coordonnées à configurer dans les réglages.</p>
                    )}
                  </div>
                </div>

                {/* Heures */}
                <div className="border border-zinc-200 p-8">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-red-600">
                    Heures d'ouverture
                  </p>
                  {openingHours.length > 0 ? (
                    <div className="mt-3 divide-y divide-zinc-100">
                      {openingHours.map((item: any) => (
                        <div key={item.id} className="flex justify-between gap-6 py-2.5">
                          <span className="font-semibold text-zinc-950">{item.day}</span>
                          <span className="text-zinc-500">{item.hours}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-zinc-400">Heures à configurer dans les réglages.</p>
                  )}
                </div>

              </div>

              {/* Colonne droite — carte */}
              <div className="border border-zinc-200 overflow-hidden">
                {mapSrc ? (
                  <iframe
                    src={mapSrc}
                    className="h-full min-h-[500px] w-full lg:min-h-0"
                    style={{ minHeight: '500px' }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Carte — ${clinicName}`}
                  />
                ) : (
                  <div className="flex min-h-[500px] items-center justify-center bg-zinc-50 p-8 text-center">
                    <div>
                      <p className="font-semibold text-zinc-950">Carte Google Maps à ajouter</p>
                      <p className="mt-2 text-sm text-zinc-500">
                        Ajoute le lien intégré dans les Réglages du site.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
