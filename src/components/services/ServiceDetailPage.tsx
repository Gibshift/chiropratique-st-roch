import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import RichText from '@/components/RichText'

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
    where: {
      slug: {
        equals: slug,
      },
    },
  }),

  payload.find({
    collection: 'professionals' as any,
    limit: 100,
    depth: 1,
    sort: 'order',
    where: {
      isActive: {
        equals: true,
      },
    },
  }),

  payload.find({
    collection: 'conditions' as any,
    limit: 100,
    depth: 1,
    sort: 'order',
  }),
])

  const service: any = serviceResult.docs[0]

  if (!service) {
    notFound()
  }

  const professionalsForService = professionalsResult.docs.filter((professional: any) => {
    const relatedServices = Array.isArray(professional.relatedServices)
      ? professional.relatedServices
      : []

    return relatedServices.some((relatedService: any) => {
      if (typeof relatedService === 'object') {
        return relatedService.id === service.id
      }

      return relatedService === service.id
    })
  })

    const conditionsForService = conditionsResult.docs.filter((condition: any) => {
    const relatedServices = Array.isArray(condition.relatedServices)
      ? condition.relatedServices
      : []

    return relatedServices.some((relatedService: any) => {
      if (typeof relatedService === 'object') {
        return relatedService.id === service.id
      }

      return relatedService === service.id
    })
  })

  const imageUrl =
    service.featuredImage &&
    typeof service.featuredImage === 'object' &&
    'url' in service.featuredImage
      ? service.featuredImage.url
      : null

  return (
    <main className="bg-white text-zinc-950">
      <section className="relative overflow-hidden border-b border-zinc-200 bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(185,28,28,0.35),transparent_35%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1fr_420px] lg:px-8 lg:py-28">
          <div>
            <a href="/services" className="font-semibold text-red-300 hover:text-red-200">
              ← Tous les services
            </a>

            <p className="mt-10 font-semibold text-red-300">Service</p>

            <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
              {service.title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-200">
              {service.shortDescription}
            </p>
          </div>

          <div className="hidden lg:block">
            {imageUrl ? (
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-2xl">
                <img
                  src={imageUrl}
                  alt={service.title}
                  className="h-[440px] w-full rounded-[1.5rem] object-cover"
                />
              </div>
            ) : (
              <div className="flex h-[440px] items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-2xl">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-300">
                    Chiropratique St-Roch
                  </p>
                  <p className="mt-5 text-3xl font-bold">{service.title}</p>
                  <p className="mt-4 text-zinc-300">
                    Soins personnalisés au cœur du quartier Saint-Roch.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:py-24">
        <article className="min-w-0">
          <div className="mb-10">
            <p className="font-semibold text-red-700">À propos du service</p>

            <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
              Une approche claire, humaine et adaptée à votre réalité.
            </h2>
          </div>

          {service.description ? (
            <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-10">
              <RichText data={service.description} enableGutter={false} />
            </div>
          ) : (
            <div className="rounded-[2rem] border border-zinc-200 bg-zinc-50 p-8">
              <p className="text-lg leading-8 text-zinc-700">
                Le contenu complet de ce service pourra être ajouté dans l’admin.
              </p>
            </div>
          )}
          {service.whoIsItFor && (
              <div className="mt-12 rounded-[2rem] border border-zinc-200 bg-zinc-50 p-6 md:p-10">
                <h3 className="text-2xl font-bold">Pour qui?</h3>

                <div className="mt-6">
                  <RichText data={service.whoIsItFor} enableGutter={false} />
                </div>
              </div>
            )}

            {service.whatToExpect && (
              <div className="mt-12 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-10">
                <h3 className="text-2xl font-bold">Déroulement d’une rencontre</h3>

                <div className="mt-6">
                  <RichText data={service.whatToExpect} enableGutter={false} />
                </div>
              </div>
            )}
                      {conditionsForService.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold">Conditions souvent associées</h3>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {conditionsForService.map((condition: any) => (
                    <a
                      key={condition.id}
                      href={`/conditions-traitees/${condition.slug}`}
                      className="rounded-2xl bg-zinc-100 p-5 font-semibold transition hover:bg-zinc-200"
                    >
                      {condition.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
        </article>

        <aside className="h-fit space-y-6 lg:sticky lg:top-28">
          <div className="rounded-[2rem] border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
              Professionnels
            </p>

            <h3 className="mt-3 text-2xl font-bold">Nos professionnels</h3>

            {professionalsForService.length > 0 ? (
              <div className="mt-6 space-y-4">
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
                      className="group flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4 transition hover:border-red-200 hover:shadow-sm"
                    >
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={professional.name}
                          className="h-14 w-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-sm font-bold text-white">
                          {professional.name?.charAt(0)}
                        </div>
                      )}

                      <div>
                        <p className="font-semibold text-zinc-950 group-hover:text-red-700">
                          {professional.name}
                        </p>

                        {professional.title ? (
                          <p className="mt-1 text-sm leading-5 text-zinc-600">
                            {professional.title}
                          </p>
                        ) : null}
                      </div>
                    </a>
                  )
                })}
              </div>
            ) : (
              <p className="mt-4 leading-7 text-zinc-600">
                Les professionnels associés à ce service pourront être liés dans l’admin.
              </p>
            )}
          </div>

          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Clinique
            </p>

            <p className="mt-3 font-semibold">Chiropratique St-Roch</p>

            <p className="mt-2 leading-7 text-zinc-600">
              440 Rue Saint-Joseph E<br />
              Québec, QC G1K 7Y1
            </p>

            <a href="/contact" className="mt-5 inline-flex font-semibold text-red-700 hover:text-red-800">
              Voir l’emplacement →
            </a>
          </div>
        </aside>
      </section>
    </main>
  )
}