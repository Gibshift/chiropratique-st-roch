import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import RichText from '@/components/RichText'

type Props = {
  slug: string
}

export async function ConditionDetailPage({ slug }: Props) {
  const payload = await getPayload({ config: configPromise })

  const conditionResult = await payload.find({
    collection: 'conditions' as any,
    limit: 1,
    depth: 2,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const condition: any = conditionResult.docs[0]

  if (!condition) {
    notFound()
  }

  const relatedProfessionals = Array.isArray(condition.relatedProfessionals)
    ? condition.relatedProfessionals
    : []

  return (
    <main className="bg-white text-zinc-950">
      <section className="relative overflow-hidden border-b border-zinc-200 bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(185,28,28,0.35),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <a href="/conditions-traitees" className="font-semibold text-red-300 hover:text-red-200">
            ← Toutes les conditions traitées
          </a>

          <p className="mt-10 font-semibold text-red-300">Condition traitée</p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            {condition.title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-200">
            {condition.shortDescription}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:py-24">
        <article className="min-w-0">
          <div className="mb-10">
            <p className="font-semibold text-red-700">Comprendre la condition</p>

            <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
              Informations générales
            </h2>
          </div>

          {condition.commonSymptoms?.length > 0 && (
            <div className="mb-10 rounded-[2rem] border border-zinc-200 bg-zinc-50 p-6 md:p-8">
              <h3 className="text-2xl font-bold">Symptômes fréquents</h3>

              <ul className="mt-5 grid gap-3 md:grid-cols-2">
                {condition.commonSymptoms.map((item: any) => (
                  <li
                    key={item.id}
                    className="rounded-2xl border border-zinc-200 bg-white p-4 text-zinc-700"
                  >
                    {item.symptom}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {condition.intro ? (
            <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-10">
              <RichText data={condition.intro} enableGutter={false} />
            </div>
          ) : (
            <div className="rounded-[2rem] border border-zinc-200 bg-zinc-50 p-8">
              <p className="text-lg leading-8 text-zinc-700">
                Le contenu principal de cette condition pourra être ajouté dans l’admin.
              </p>
            </div>
          )}

          {condition.whenToConsult && (
            <div className="mt-12 rounded-[2rem] border border-zinc-200 bg-zinc-50 p-6 md:p-10">
              <h3 className="text-2xl font-bold">Quand consulter?</h3>

              <div className="mt-6">
                <RichText data={condition.whenToConsult} enableGutter={false} />
              </div>
            </div>
          )}

          {condition.relatedServices?.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold">Services liés</h3>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {condition.relatedServices.map((service: any) => (
                  <a
                    key={service.id}
                    href={`/services/${service.slug}`}
                    className="rounded-2xl bg-zinc-100 p-5 font-semibold transition hover:bg-zinc-200"
                  >
                    {service.title}
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

            <h3 className="mt-3 text-2xl font-bold">
              Professionnels liés
            </h3>

            {relatedProfessionals.length > 0 ? (
              <div className="mt-6 space-y-4">
                {relatedProfessionals.map((professional: any) => {
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
              <div className="mt-5 rounded-2xl bg-white p-5">
                <p className="leading-7 text-zinc-600">
                  Les professionnels liés à cette condition pourront être sélectionnés dans l’admin.
                </p>

                <a
                  href="/professionnels"
                  className="mt-5 inline-flex font-semibold text-red-700 hover:text-red-800"
                >
                  Voir les professionnels →
                </a>
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Services
            </p>

            <p className="mt-3 font-semibold">Approches de la clinique</p>

            <a href="/services" className="mt-5 inline-flex font-semibold text-red-700 hover:text-red-800">
              Voir les services →
            </a>
          </div>
        </aside>
      </section>
    </main>
  )
}