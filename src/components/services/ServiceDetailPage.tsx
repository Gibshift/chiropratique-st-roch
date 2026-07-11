import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import RichText from '@/components/RichText'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { GeometricShapes } from '@/components/ui/GeometricShapes'

type Props = {
  slug: string
}

import { JANE_SERVICE_URLS } from '@/utilities/jane'

export async function ServiceDetailPage({ slug }: Props) {
  const payload = await getPayload({ config: configPromise })

  const [serviceResult, professionalsResult, conditionsResult] = await Promise.all([
    payload.find({
      collection: 'services' as any,
      limit: 1,
      depth: 1,
      where: { slug: { equals: slug } },
    }),
    payload.find({
      collection: 'professionals' as any,
      limit: 100,
      depth: 1,
      sort: 'order',
      where: { isActive: { equals: true } },
    }),
    payload.find({
      collection: 'conditions' as any,
      limit: 100,
      depth: 1,
      sort: 'order',
    }),
  ])

  const service: any = serviceResult.docs[0]
  if (!service) notFound()

  const professionalsForService = professionalsResult.docs.filter((professional: any) => {
    const relatedServices = Array.isArray(professional.relatedServices) ? professional.relatedServices : []
    return relatedServices.some((s: any) =>
      typeof s === 'object' ? s.id === service.id : s === service.id
    )
  })

  const conditionsForService = conditionsResult.docs.filter((condition: any) => {
    const relatedServices = Array.isArray(condition.relatedServices) ? condition.relatedServices : []
    return relatedServices.some((s: any) =>
      typeof s === 'object' ? s.id === service.id : s === service.id
    )
  })

  const titleFirst = service.title.charAt(0)
  const titleRest = service.title.slice(1)
  const janeUrl = JANE_SERVICE_URLS[slug.toLowerCase()]

  return (
    <main className="relative bg-white text-zinc-950">
      <GeometricShapes />

      {/* ─── Section 1 — Hero ─────────────────────────────────────────── */}
      <section className="relative pt-32 pb-0 lg:pt-48">
        <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">

            <Breadcrumb crumbs={[
              { label: 'Services', href: '/services' },
              { label: service.title },
            ]} />

            <div className="mt-12 mb-12 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="font-[var(--font-barlow-condensed)] text-[clamp(2rem,7vw,4.5rem)] font-medium uppercase leading-[1.05] text-zinc-950">
                  <span className="text-red-600">{titleFirst}</span>{titleRest}
                </h1>
              </div>

              <div className="hidden lg:block w-[1px] h-24 flex-shrink-0 self-center bg-red-600" />

              <div className="lg:max-w-[38%]">
                <p className="font-[var(--font-barlow-condensed)] text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">Services</p>
                {service.shortDescription && (
                  <p className="mt-3 text-[1rem] leading-7 text-zinc-800">{service.shortDescription}</p>
                )}
                {janeUrl && (
                  <a
                    href={janeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-6 inline-flex min-h-[48px] items-center gap-3 border border-red-600 bg-red-600 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-red-600"
                  >
                    <span className="whitespace-nowrap">Prendre rendez-vous</span>
                    <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2.5 w-8 transition duration-200 group-hover:translate-x-1">
                      <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* ─── Section 2 — Contenu (article + sidebar) ────────────────── */}
      <section className="relative z-10 mx-auto max-w-[1200px] px-6 pb-12 lg:px-8 lg:pb-24">
        <div className="border-t border-zinc-300 pt-0 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
        <article className="min-w-0">
          {service.description ? (
            <RichText data={service.description} enableGutter={false} />
          ) : (
            <p className="text-[1rem] leading-7 text-zinc-600">
              Vous souhaitez en savoir plus sur ce service? N&apos;hésitez pas à communiquer avec la clinique&nbsp;: notre équipe se fera un plaisir de répondre à vos questions et de vous orienter.
            </p>
          )}


          {conditionsForService.length > 0 && (
            <div className="mt-12">
              <p className="font-[var(--font-barlow-condensed)] text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">Conditions souvent associées</p>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {conditionsForService.map((condition: any) => (
                  <a
                    key={condition.id}
                    href="/conditions-traitees"
                    className="border border-zinc-300 bg-white p-5 font-semibold transition hover:border-zinc-950 hover:text-red-600"
                  >
                    {condition.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </article>

        <aside className="mt-12 flex flex-col gap-6 max-w-[400px] lg:max-w-none lg:mt-2 lg:sticky lg:top-28 lg:self-start">
          <div className="border border-zinc-300 bg-white p-6">
            <p className="font-[var(--font-barlow-condensed)] text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">Professionnels</p>

            {professionalsForService.length > 0 ? (
              <div className="mt-4 flex flex-col gap-3">
                {professionalsForService.map((professional: any) => {
                  const photoUrl =
                    professional.photo &&
                    typeof professional.photo === 'object' &&
                    'url' in professional.photo
                      ? professional.photo.url
                      : null

                  return (
                    <a
                      key={professional.id}
                      href={`/professionnels/${professional.slug}`}
                      className="group flex items-center gap-4 border border-zinc-300 bg-white p-4 transition hover:border-zinc-950"
                    >
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={professional.name}
                          width={48}
                          height={48}
                          className="h-12 w-12 flex-shrink-0 object-cover object-top"
                        />
                      ) : (
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-zinc-950 text-sm font-bold text-white">
                          {professional.name?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-zinc-950 group-hover:text-red-600 transition">
                          {professional.name}
                        </p>
                        {professional.title && (
                          <p className="mt-0.5 text-[0.85rem] text-zinc-600">{professional.title}</p>
                        )}
                      </div>
                    </a>
                  )
                })}
              </div>
            ) : (
              <p className="mt-4 text-[0.9rem] leading-6 text-zinc-600">
                Communiquez avec la clinique et nous vous dirigerons vers le professionnel le mieux placé pour vous accompagner.
              </p>
            )}
          </div>

          <div className="border border-zinc-300 bg-white p-6">
            <p className="font-[var(--font-barlow-condensed)] text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">Conditions traitées</p>
            <p className="mt-2 text-[0.9rem] leading-6 text-zinc-700">
              Découvrez les conditions que nous traitons à la clinique.
            </p>
            <a href="/conditions-traitees" className="mt-4 inline-block text-[1rem] font-semibold text-red-600 hover:text-zinc-950 transition">
              Voir les conditions traitées →
            </a>
          </div>

          <div className="border border-zinc-300 bg-white p-6">
            <p className="font-[var(--font-barlow-condensed)] text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">Blogue</p>
            <p className="mt-2 text-[0.9rem] leading-6 text-zinc-700">
              Des articles simples pour mieux comprendre votre santé.
            </p>
            <a href="/blogue" className="mt-4 inline-block text-[1rem] font-semibold text-red-600 hover:text-zinc-950 transition">
              Voir nos articles →
            </a>
          </div>
        </aside>
        </div>
      </section>

      {/* ─── Section 3 — Bande d'appel à l'action ─────────────────────── */}
      <ScrollReveal>
        <section className="relative -mt-4 bg-[#f6f1e8] py-14 shadow-[0_-12px_32px_rgba(0,0,0,0.14)] lg:py-24">
          <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="lg:max-w-[60%]">
                <p className="font-[var(--font-barlow-condensed)] text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">Prêt à passer à l&apos;action</p>
                <h2 className="mt-4 font-[var(--font-barlow-condensed)] text-[clamp(1.75rem,4vw,3rem)] font-medium uppercase leading-[1.05] text-zinc-950">
                  <span className="text-red-600">P</span>renez rendez-vous dès aujourd&apos;hui
                </h2>
                <p className="mt-4 max-w-[46ch] text-[1rem] leading-7 text-zinc-700">
                  Notre équipe vous accueille en clinique pour évaluer votre situation et bâtir un plan de soins adapté à vos besoins.
                </p>
              </div>

              {janeUrl && (
                <a
                  href={janeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-[48px] flex-shrink-0 items-center gap-3 border border-red-600 bg-red-600 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-red-600"
                >
                  <span className="whitespace-nowrap">Prendre rendez-vous</span>
                  <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2.5 w-8 transition duration-200 group-hover:translate-x-1">
                    <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </section>
      </ScrollReveal>
    </main>
  )
}
