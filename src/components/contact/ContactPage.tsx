import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { GeometricShapes } from '@/components/ui/GeometricShapes'

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
  const janeUrl = (typeof settings.mainJaneUrl === 'string' && settings.mainJaneUrl) || 'https://chiropratiquestroch.janeapp.com'
  const email = settings.email || null
  const openingHours = Array.isArray(settings.openingHours) ? settings.openingHours : []
  const address = settings.address || {}
  const fullAddress = [address.street, address.city, address.province, address.postalCode].filter(Boolean).join(', ')
  const mapSrc = extractMapSrc(settings.googleMapsEmbedUrl)

  return (
    <main className="bg-white text-zinc-950">
      <section className="relative bg-white min-h-[68vh] pt-32 pb-24 lg:pt-48">
        <GeometricShapes />
        <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">

            {/* ─── Section 1 — En-tête & CTA ──────────────────────────────── */}
          <div className="mb-20 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="whitespace-nowrap font-[var(--font-barlow-condensed)] text-[clamp(2rem,7vw,4.5rem)] font-medium uppercase leading-[1.05] text-zinc-950">
                  Nous joindre.
                </h1>
                <div className="mt-6 h-[2px] w-14 bg-red-600" />
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={janeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-[48px] items-center gap-3 border border-red-600 bg-red-600 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-red-600"
                  >
                    <span>Prendre rendez-vous</span>
                    <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2.5 w-8 transition duration-200 group-hover:translate-x-1">
                      <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                    </svg>
                  </a>
                  {phone && (
                    <a
                      href={`tel:${phone.replace(/\D/g, '')}`}
                      className="group inline-flex min-h-[48px] items-center gap-3 border border-red-600 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-red-600 transition hover:bg-red-600 hover:text-white"
                    >
                      <span>Appeler la clinique</span>
                      <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2.5 w-8 transition duration-200 group-hover:translate-x-1">
                        <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              <div className="hidden lg:block w-[1px] h-24 flex-shrink-0 self-center bg-red-600" />

              <div className="lg:max-w-[38%]">
                <p className="font-[var(--font-barlow-condensed)] text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">Contact</p>
                <p className="mt-3 text-[1rem] leading-7 text-zinc-800">
                  Prenez rendez-vous en ligne ou communiquez directement avec la clinique. Nous sommes là pour répondre à vos questions.
                </p>
              </div>
            </div>

            {/* ─── Section 2 — Coordonnées & carte ────────────────────────── */}
            <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12">

              <div className="flex flex-col gap-6">
                <div className="border border-zinc-300 p-8">
                  <p className="font-[var(--font-barlow-condensed)] text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">Adresse</p>
                  <p className="mt-3 font-[var(--font-barlow-condensed)] text-[1.1rem] font-medium uppercase tracking-[0.02em] text-zinc-950">
                    {clinicName}
                  </p>
                  {fullAddress ? (
                    <p className="mt-2 leading-7 text-zinc-500">{fullAddress}</p>
                  ) : (
                    <p className="mt-2 text-zinc-500">Adresse à venir.</p>
                  )}
                </div>

                <div className="border border-zinc-300 p-8">
                  <p className="font-[var(--font-barlow-condensed)] text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">Coordonnées</p>
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
                      <p className="text-zinc-500">Coordonnées à venir.</p>
                    )}
                  </div>
                </div>

                <div className="border border-zinc-300 p-8">
                  <p className="font-[var(--font-barlow-condensed)] text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">Heures d'ouverture</p>
                  {openingHours.length > 0 ? (
                    <div className="mt-3 divide-y divide-zinc-300">
                      {openingHours.map((item: any) => (
                        <div key={item.id} className="flex justify-between gap-6 py-2.5">
                          <span className="font-semibold text-zinc-950">{item.day}</span>
                          <span className="text-zinc-500">{item.hours}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-zinc-500">Heures à venir.</p>
                  )}
                </div>
              </div>

              <div className="overflow-hidden border border-zinc-300">
                {mapSrc ? (
                  <iframe src={mapSrc} className="h-full min-h-[500px] w-full lg:min-h-0"
                    style={{ minHeight: '500px' }} loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade" title={`Carte — ${clinicName}`}
                  />
                ) : (
                  <div className="flex min-h-[500px] items-center justify-center bg-[#f6f1e8] p-8 text-center">
                    <p className="font-semibold text-zinc-950">Carte à venir</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* ─── Section 3 — Bande d'appel à l'action ───────────────────────── */}
      <section className="bg-zinc-950 py-14 text-white lg:py-24">
        <ScrollReveal>
          <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-8 px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="font-[var(--font-barlow-condensed)] text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-500">Rendez-vous</p>
              <h2 className="mt-3 font-[var(--font-barlow-condensed)] text-[clamp(1.8rem,4vw,3rem)] font-medium uppercase leading-[1.05] text-white">
                Prêt à passer à l'action.
              </h2>
              <p className="mt-4 max-w-[36ch] text-[1rem] leading-7 text-zinc-300">
                Réservez votre consultation en quelques clics. Nous avons hâte de vous accueillir à la clinique.
              </p>
            </div>
            <a
              href={janeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-[48px] flex-shrink-0 items-center gap-3 border border-red-500 bg-red-500 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-red-500"
            >
              <span>Prendre rendez-vous</span>
              <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2.5 w-8 transition duration-200 group-hover:translate-x-1">
                <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
              </svg>
            </a>
          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
