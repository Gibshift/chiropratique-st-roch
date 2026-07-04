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

  return (
    <main className="relative bg-white text-zinc-950">
      <GeometricShapes />

      {/* Hero */}
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
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-red-600">Services</p>
                {service.shortDescription && (
                  <p className="mt-3 text-[1rem] leading-7 text-zinc-800">{service.shortDescription}</p>
                )}
              </div>
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* Contenu */}
      <section className="relative z-10 mx-auto max-w-[1200px] px-6 pb-24 lg:px-8">
        <div className="border-t border-zinc-400 pt-0 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
        <article className="min-w-0">
          {service.description ? (
            <RichText data={service.description} enableGutter={false} />
          ) : (
            <p className="text-[1rem] leading-7 text-zinc-500">
              Le contenu complet de ce service pourra être ajouté dans l&apos;admin.
            </p>
          )}


          {conditionsForService.length > 0 && (
            <div className="mt-12">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-zinc-400">Conditions souvent associées</p>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {conditionsForService.map((condition: any) => (
                  <a
                    key={condition.id}
                    href="/conditions-traitees"
                    className="border border-zinc-400 bg-white p-5 font-semibold transition hover:border-zinc-950 hover:text-red-600"
                  >
                    {condition.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </article>

        <aside className="mt-12 flex flex-col gap-6 lg:mt-14 lg:sticky lg:top-28 lg:self-start">
          <div className="border border-zinc-400 bg-white p-6">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-zinc-950">Professionnels</p>

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
                      className="group flex items-center gap-4 border border-zinc-400 bg-white p-4 transition hover:border-zinc-950"
                    >
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={professional.name}
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
              <p className="mt-4 text-[0.9rem] leading-6 text-zinc-500">
                À la recherche de la perle rare!
              </p>
            )}
          </div>

          <div className="border border-zinc-400 bg-white p-6">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-zinc-950">Conditions traitées</p>
            <p className="mt-2 text-[0.9rem] leading-6 text-zinc-700">
              Découvrez les conditions que nous traitons à la clinique.
            </p>
            <a href="/conditions-traitees" className="mt-4 inline-block text-[1rem] font-semibold text-red-600 hover:text-zinc-950 transition">
              Voir les conditions traitées →
            </a>
          </div>

          <div className="border border-zinc-400 bg-white p-6">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-zinc-950">Blogue</p>
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
    </main>
  )
}
