import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Image from 'next/image'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { GeometricShapes } from '@/components/ui/GeometricShapes'

const JANE_URL = 'https://chiropratiquestroch.janeapp.com'

const JANE_SERVICE_URLS: Record<string, string> = {
  'chiropratique': 'https://chiropratiquestroch.janeapp.com/#/chiropratique',
  'osteopathie':   'https://chiropratiquestroch.janeapp.com/#/osteopathie',
  'massotherapie': 'https://chiropratiquestroch.janeapp.com/#/massotherapie-kinesitherapie',
  'kinesitherapie':'https://chiropratiquestroch.janeapp.com/#/massotherapie-kinesitherapie',
  'orthotherapie': 'https://chiropratiquestroch.janeapp.com/#/orthotherapie',
}

type ServiceMeta = { when: string; icon: React.ReactNode }

const SERVICE_META: Record<string, ServiceMeta> = {
  chiropratique: {
    when: 'Douleurs au dos, au cou ou aux articulations, maux de tête cervicaux, trouble de posture.',
    icon: <Image src="/assets/chiro-icon-siteweb.png" alt="" width={40} height={40} unoptimized className="h-10 w-10 object-contain" />,
  },
  osteopathie: {
    when: 'Tensions globales, migraines, troubles des viscères. Approche douce pour le corps dans son ensemble.',
    icon: <Image src="/assets/osteo-icon-siteweb.png" alt="" width={40} height={40} unoptimized className="h-10 w-10 object-contain" />,
  },
  massotherapie: {
    when: 'Stress accumulé, tensions musculaires persistantes, douleurs chroniques.',
    icon: <Image src="/assets/masso-icon-siteweb.png" alt="" width={40} height={40} unoptimized className="h-10 w-10 object-contain" />,
  },
  kinesitherapie: {
    when: 'Retour progressif au sport, amélioration des capacités fonctionnelles.',
    icon: <Image src="/assets/kine-icon-siteweb.png" alt="" width={40} height={40} unoptimized className="h-10 w-10 object-contain" />,
  },
  orthotherapie: {
    when: 'Déséquilibres posturaux, douleurs liées aux habitudes de travail ou sportives.',
    icon: <Image src="/assets/ortho-icon-siteweb.png" alt="" width={40} height={40} unoptimized className="h-10 w-10 object-contain" />,
  },
}

export async function ServicesPage() {
  const payload = await getPayload({ config: configPromise })
  const services = await payload.find({ collection: 'services' as any, limit: 100, depth: 1, sort: 'order' })

  return (
    <main className="relative bg-white text-zinc-950 isolate">
      <GeometricShapes />

      {/* ─── Section 1 — Hero ─────────────────────────────────────────── */}
      <section className="bg-white pt-36 pb-0 lg:pt-40">
        <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">

            <div className="grid grid-cols-1 lg:grid-cols-[460px_1fr] lg:min-h-[360px]">

              {/* Gauche — message + actions */}
              <div className="flex flex-col justify-center py-8 lg:py-12 lg:pr-16">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">Services</p>
                <h1 className="mt-4 font-[var(--font-barlow-condensed)] text-[clamp(2.2rem,5.5vw,4.5rem)] font-medium uppercase leading-[1.0] text-zinc-950">
                  Découvrez<br />Nos soins.
                </h1>
                <div className="mt-6 h-[2px] w-14 bg-red-600" />
                <p className="mt-6 max-w-[380px] text-[1rem] leading-7 text-zinc-800">
                  Chaque discipline répond à des besoins spécifiques. Notre équipe vous guide vers les soins les plus adaptés à votre situation.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href={JANE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-[46px] items-center gap-3 border border-red-600 bg-red-600 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-red-600"
                  >
                    <span>Prendre rendez-vous</span>
                    <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2.5 w-8 transition duration-200 group-hover:translate-x-1">
                      <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                    </svg>
                  </a>
                  <a
                    href="#services-grid"
                    className="inline-flex min-h-[46px] items-center border border-red-600 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-red-600 transition hover:bg-red-600 hover:text-white"
                  >
                    Je ne sais pas lequel choisir ↓
                  </a>
                </div>
              </div>

              {/* Droite — panneau de navigation (desktop uniquement) */}
              <div className="hidden lg:flex relative overflow-hidden bg-white">

                {/* Zone illustration — dépasse de 120px derrière les liens */}
                <div className="absolute inset-y-8 lg:inset-y-1 left-20 right-[260px]">
                  <Image
                    src="/assets/famille-contact-ordinateur-siteweb-droite.png"
                    alt=""
                    fill
                    sizes="400px"
                    className="object-contain object-bottom pointer-events-none"
                    priority
                  />
                  <div className="absolute inset-0 bg-white/20 pointer-events-none" />
                </div>

                {/* Liens rapides — z-10, par-dessus la photo, container transparent */}
                <div className="relative z-10 ml-auto flex w-[300px] flex-col justify-center gap-2 self-stretch px-4 py-6">
                  {services.docs.map((service: any) => {
                    const title = service.title as string
                    return (
                      <a
                        key={service.id}
                        href={`/services/${service.slug}`}
                        className="group flex items-center justify-between border border-zinc-200 bg-white px-4 py-3 transition hover:border-zinc-400 hover:bg-zinc-50"
                      >
                        <span className="font-[var(--font-barlow-condensed)] text-[1rem] font-medium uppercase tracking-[0.01em] text-zinc-700 transition group-hover:text-red-600">
                          <span className="text-red-600">{title.charAt(0)}</span>{title.slice(1)}
                        </span>
                        <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2.5 w-9 flex-shrink-0 text-red-600 transition duration-200 group-hover:translate-x-0.5">
                          <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" strokeLinejoin="miter" />
                        </svg>
                      </a>
                    )
                  })}
                </div>

              </div>

            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── Section 2 — Les disciplines ──────────────────────────────── */}
      {services.docs.length > 0 && (
        <section id="services-grid" className="bg-zinc-50 py-20">
          <ScrollReveal>
            <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">

              <div className="mb-10 border-b border-zinc-200 pb-6">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">
                  Nos 5 disciplines
                </p>
                <p className="mt-1 font-[var(--font-barlow-condensed)] text-[clamp(1.4rem,2.5vw,2rem)] font-medium uppercase leading-tight text-zinc-950">
                  Cinq expertises. Un objectif commun.
                </p>
              </div>

              <div className="border border-zinc-200">
                <div className="grid grid-cols-1 gap-px bg-zinc-200 sm:grid-cols-2 lg:gap-0 lg:bg-transparent lg:grid-cols-5">
                  {services.docs.map((service: any, idx: number) => {
                    const title = service.title as string
                    const short = service.shortDescription as string | undefined
                    const isLast = idx === services.docs.length - 1
                    return (
                      <a
                        key={service.id}
                        href={`/services/${service.slug}`}
                        className="group relative flex flex-col bg-white px-6 py-8 transition hover:bg-zinc-50"
                      >
                        <h2 className="font-[var(--font-barlow-condensed)] text-[1.15rem] font-medium uppercase leading-none tracking-[0.02em]">
                          <span className="text-red-600">{title.charAt(0)}</span>
                          <span className="text-zinc-950">{title.slice(1)}</span>
                        </h2>
                        {short && (
                          <p className="mt-4 flex-1 text-[0.85rem] leading-6 text-zinc-500">{short}</p>
                        )}
                        <span className="mt-6 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.1em] text-red-600">
                          En savoir plus
                          <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2 w-8 transition-[width] duration-300 group-hover:w-12">
                            <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" strokeLinejoin="miter" />
                          </svg>
                        </span>
                        {!isLast && (
                          <div className="hidden lg:block absolute right-0 top-3 bottom-3 w-px bg-zinc-200" aria-hidden />
                        )}
                      </a>
                    )
                  })}
                </div>
              </div>

            </div>
          </ScrollReveal>
        </section>
      )}

      {/* ─── Section 3 — Quel soin vous convient? ─────────────────────── */}
      <section className="bg-white py-20">
        <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">

            <div className="mb-10 border-b border-zinc-200 pb-6">
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">
                Besoin d&apos;aide pour choisir?
              </p>
              <p className="mt-1 font-[var(--font-barlow-condensed)] text-[clamp(1.4rem,2.5vw,2rem)] font-medium uppercase leading-tight text-zinc-950">
                Quel soin vous convient?
              </p>
            </div>

            <div className="grid grid-cols-1 gap-px bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
              {services.docs.map((service: any) => {
                const slug = (service.slug as string ?? '').toLowerCase()
                const meta = SERVICE_META[slug] ?? {
                  when: service.shortDescription ?? '',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-red-600" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                    </svg>
                  ),
                }
                const janeUrl = JANE_SERVICE_URLS[slug]
                return (
                  <div key={service.id} className="flex flex-col gap-4 bg-white px-6 py-8">
                    <div className="flex items-center justify-between gap-3">
                      <a href={`/services/${service.slug}`} className="font-[var(--font-barlow-condensed)] text-[1rem] font-medium uppercase leading-snug tracking-[0.02em] text-zinc-950 transition hover:text-red-600">
                        {service.title}
                      </a>
                      <div className="flex-shrink-0">{meta.icon}</div>
                    </div>
                    <p className="flex-1 text-[0.85rem] leading-6 text-zinc-500">{meta.when}</p>
                    {janeUrl && (
                      <a
                        href={janeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex min-h-[40px] w-full items-center justify-center border border-red-600 px-5 text-[9.5px] font-bold uppercase tracking-[0.16em] text-red-600 transition hover:bg-red-600 hover:text-white"
                      >
                        <span>Prendre rendez-vous en {service.title}</span>
                      </a>
                    )}
                  </div>
                )
              })}

              {/* Carte CTA — toujours pas certain */}
              <div className="flex flex-col justify-between bg-zinc-900 px-8 py-8">
                <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-red-400">
                  Pas encore certain?
                </p>
                <p className="mt-4 font-[var(--font-barlow-condensed)] text-[1rem] font-medium uppercase leading-snug text-zinc-200">
                  Notre équipe vous oriente vers le soin le plus adapté.
                </p>
                <a
                  href="/contact"
                  className="group mt-2 flex min-h-[40px] w-full items-center justify-center border border-red-400 text-[9.5px] font-bold uppercase tracking-[0.16em] text-red-400 transition hover:bg-white hover:border-white hover:text-red-600"
                >
                  Nous contacter
                </a>
              </div>

            </div>

          </div>
        </ScrollReveal>
      </section>

    </main>
  )
}
