import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'

const FALLBACK_JANE_URL = 'https://chiropratiquestroch.janeapp.com/embed/book_online'

type Props = {
  slug: string
}

export async function ConditionDetailPage({ slug }: Props) {
  const payload = await getPayload({ config: configPromise })

  const [siteSettings, conditionResult] = await Promise.all([
    payload.findGlobal({
      slug: 'site-settings' as any,
      depth: 0,
    }),

    payload.find({
      collection: 'conditions' as any,
      limit: 1,
      depth: 2,
      where: {
        slug: {
          equals: slug,
        },
      },
    }),
  ])

  const condition: any = conditionResult.docs[0]

  if (!condition) {
    notFound()
  }

  const janeUrl =
    condition.janeUrl ||
    (siteSettings &&
    typeof siteSettings === 'object' &&
    'mainJaneUrl' in siteSettings &&
    typeof siteSettings.mainJaneUrl === 'string' &&
    siteSettings.mainJaneUrl.length > 0
      ? siteSettings.mainJaneUrl
      : FALLBACK_JANE_URL)

  return (
    <main className="bg-white text-zinc-950">
      <section className="border-b border-zinc-200 bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
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

          <div className="mt-10">
            <a
              href={janeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-red-700 px-7 py-4 font-semibold text-white transition hover:bg-red-800"
            >
              Prendre rendez-vous
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1fr_360px] lg:px-8">
        <div>
          <p className="font-semibold text-red-700">Comprendre la condition</p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Informations générales
          </h2>

          <div className="mt-8 rounded-3xl bg-zinc-100 p-8">
            <p className="text-lg leading-8 text-zinc-700">
              {condition.shortDescription}
            </p>
          </div>

          {condition.commonSymptoms?.length > 0 && (
            <div className="mt-10">
              <h3 className="text-2xl font-bold">Symptômes fréquents</h3>

              <ul className="mt-5 grid gap-3">
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

          <div className="mt-10 space-y-6 text-lg leading-8 text-zinc-700">
            <p>
              Cette page servira à expliquer la condition, les signes fréquents, les moments où il
              peut être pertinent de consulter et les services qui peuvent être liés.
            </p>

            <p>
              Le contenu pourra être enrichi dans l’admin afin d’améliorer le référencement naturel
              et d’offrir une information claire aux patients avant la prise de rendez-vous.
            </p>
          </div>

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
        </div>

        <aside className="h-fit rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
            Rendez-vous
          </p>

          <h3 className="mt-3 text-2xl font-bold">
            Besoin d’une évaluation?
          </h3>

          <p className="mt-4 leading-7 text-zinc-600">
            La prise de rendez-vous se fait directement en ligne avec Jane.
          </p>

          <a
            href={janeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex rounded-full bg-red-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-red-800"
          >
            Prendre rendez-vous
          </a>

          <div className="mt-6 border-t border-zinc-200 pt-6">
            <a href="/services" className="font-semibold text-red-700 hover:text-red-800">
              Voir les services de la clinique
            </a>
          </div>
        </aside>
      </section>
    </main>
  )
}