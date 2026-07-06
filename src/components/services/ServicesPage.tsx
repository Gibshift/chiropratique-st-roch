import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Image from 'next/image'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { GeometricShapes } from '@/components/ui/GeometricShapes'

const JANE_URL = 'https://chiropratiquestroch.janeapp.com'


type ServiceMeta = { when: string; icon: React.ReactNode }

const SERVICE_META: Record<string, ServiceMeta> = {
  chiropratique: {
    when: 'Douleurs au dos, au cou ou aux articulations, maux de tête cervicaux, trouble de posture.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-red-600" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  osteopathie: {
    when: 'Tensions globales, migraines, troubles des viscères. Approche douce pour le corps dans son ensemble.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-red-600" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
    ),
  },
  massotherapie: {
    when: 'Stress accumulé, tensions musculaires persistantes, douleurs chroniques.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-red-600" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    ),
  },
  kinesitherapie: {
    when: 'Retour progressif au sport, amélioration des capacités fonctionnelles.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-red-600" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  orthotherapie: {
    when: 'Déséquilibres posturaux, douleurs liées aux habitudes de travail ou sportives.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-red-600" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v8M9 10h6M10 22l2-7 2 7" />
      </svg>
    ),
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
                  Nos soins.<br />Votre réalité.
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
                    className="group inline-flex min-h-[46px] items-center gap-3 bg-red-600 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-red-700"
                  >
                    <span>Prendre rendez-vous</span>
                    <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2.5 w-8 transition duration-200 group-hover:translate-x-1">
                      <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                    </svg>
                  </a>
                  <a
                    href="#services-grid"
                    className="inline-flex min-h-[46px] items-center border border-zinc-300 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950"
                  >
                    Je ne sais pas lequel choisir ↓
                  </a>
                </div>
              </div>

              {/* Droite — panneau de navigation (desktop uniquement) */}
              <div className="hidden lg:flex relative overflow-hidden bg-white">

                {/* Zone illustration — dépasse de 120px derrière les liens */}
                <div className="absolute inset-y-8 lg:inset-y-12 left-0 right-[220px]">
                  <Image
                    src="/assets/salle-chiro-watercolor.png"
                    alt=""
                    fill
                    sizes="400px"
                    className="object-cover object-center pointer-events-none"
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
                        href="#services-grid"
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
                        <span className="mt-6 inline-flex items-center gap-1.5 text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-red-600 transition group-hover:gap-2.5">
                          En savoir plus
                          <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2 w-7 transition duration-200 group-hover:translate-x-0.5">
                            <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
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
                return (
                  <a
                    key={service.id}
                    href={`/services/${service.slug}`}
                    className="group flex flex-col gap-4 bg-white px-6 py-8 transition hover:bg-zinc-50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">{meta.icon}</div>
                      <p className="font-[var(--font-barlow-condensed)] text-[1rem] font-medium uppercase leading-snug tracking-[0.02em] text-zinc-950">
                        {service.title}
                      </p>
                    </div>
                    <p className="flex-1 text-[0.85rem] leading-6 text-zinc-500">{meta.when}</p>
                    <span className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-red-600 transition group-hover:gap-2.5">
                      En savoir plus
                      <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2 w-7 transition duration-200 group-hover:translate-x-0.5">
                        <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                      </svg>
                    </span>
                  </a>
                )
              })}

              {/* Carte CTA — toujours pas certain */}
              <a
                href="/contact"
                className="group flex flex-col justify-between bg-zinc-900 px-8 py-8 transition hover:bg-zinc-800"
              >
                <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-zinc-500">
                  Pas encore certain?
                </p>
                <p className="mt-4 font-[var(--font-barlow-condensed)] text-[1rem] font-medium uppercase leading-snug text-zinc-200">
                  Notre équipe vous oriente vers le soin le plus adapté.
                </p>
                <span className="mt-6 inline-flex items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-red-400 transition group-hover:text-red-300">
                  Nous contacter
                  <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2 w-7 transition duration-200 group-hover:translate-x-1">
                    <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
                  </svg>
                </span>
              </a>

            </div>


          </div>
        </ScrollReveal>
      </section>

    </main>
  )
}
