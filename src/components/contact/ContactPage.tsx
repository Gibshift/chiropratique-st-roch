import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

function extractMapSrc(value?: string | null) {
  if (!value) return null
  const match = value.match(/src=["']([^"']+)["']/)
  return match?.[1] ?? value
}

export async function ContactPage() {
  const payload = await getPayload({ config: configPromise })

  const siteSettings = await payload.findGlobal({ slug: 'site-settings' as any, depth: 0 })

  const settings: any = siteSettings || {}
  const clinicName = settings.clinicName || 'Chiropratique St-Roch'
  const phone = settings.phone || null
  const email = settings.email || null
  const openingHours = Array.isArray(settings.openingHours) ? settings.openingHours : []
  const address = settings.address || {}
  const fullAddress = [address.street, address.city, address.province, address.postalCode].filter(Boolean).join(', ')
  const mapSrc = extractMapSrc(settings.googleMapsEmbedUrl)

  return (
    <main className="bg-white text-zinc-950">
      <section className="bg-white pt-36 pb-24 lg:pt-44">
        <ScrollReveal>
          <div className="mx-auto max-w-[1200px] px-6 lg:px-8">

            <div className="mb-20 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="font-[var(--font-barlow-condensed)] text-[clamp(2.8rem,5vw,4.5rem)] font-medium uppercase leading-[1.05] text-zinc-950">
                  Nous joindre.
                </h1>
                <div className="mt-5 h-[3px] w-16 bg-red-600" />
              </div>
              <div className="lg:max-w-[42%]">
                <p className="text-[1rem] leading-7 text-zinc-500">
                  Prenez rendez-vous en ligne ou contactez la clinique directement pour toute question.
                </p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12">

              <div className="flex flex-col gap-3">
                <div className="border border-zinc-400 p-8">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-red-600">Adresse</p>
                  <p className="mt-3 font-[var(--font-barlow-condensed)] text-[1.1rem] font-medium uppercase tracking-[0.02em] text-zinc-950">
                    {clinicName}
                  </p>
                  {fullAddress ? (
                    <p className="mt-2 leading-7 text-zinc-500">{fullAddress}</p>
                  ) : (
                    <p className="mt-2 text-zinc-400">Adresse à configurer dans les réglages.</p>
                  )}
                </div>

                <div className="border border-zinc-400 p-8">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-red-600">Coordonnées</p>
                  <div className="mt-3 space-y-3">
                    {phone && (
                      <p className="text-zinc-700">
                        <span className="font-semibold text-zinc-950">Tél. </span>
                        <a href={`tel:${phone.replace(/\D/g, '')}`} className="hover:text-red-600">{phone}</a>
                      </p>
                    )}
                    {email && (
                      <p className="text-zinc-700">
                        <span className="font-semibold text-zinc-950">Courriel </span>
                        <a href={`mailto:${email}`} className="hover:text-red-600">{email}</a>
                      </p>
                    )}
                    {!phone && !email && (
                      <p className="text-zinc-400">Coordonnées à configurer dans les réglages.</p>
                    )}
                  </div>
                </div>

                <div className="border border-zinc-400 p-8">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-red-600">Heures d'ouverture</p>
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

              <div className="overflow-hidden border border-zinc-400">
                {mapSrc ? (
                  <iframe src={mapSrc} className="h-full min-h-[500px] w-full lg:min-h-0"
                    style={{ minHeight: '500px' }} loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade" title={`Carte — ${clinicName}`}
                  />
                ) : (
                  <div className="flex min-h-[500px] items-center justify-center bg-zinc-50 p-8 text-center">
                    <p className="font-semibold text-zinc-950">Carte Google Maps à ajouter</p>
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
