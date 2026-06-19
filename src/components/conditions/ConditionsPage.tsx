import configPromise from '@payload-config'
import { getPayload } from 'payload'

const FALLBACK_JANE_URL = 'https://chiropratiquestroch.janeapp.com/embed/book_online'

export async function ConditionsPage() {
  const payload = await getPayload({ config: configPromise })

  const [siteSettings, conditions] = await Promise.all([
    payload.findGlobal({
      slug: 'site-settings' as any,
      depth: 0,
    }),

    payload.find({
      collection: 'conditions' as any,
      limit: 100,
      depth: 1,
      sort: 'order',
    }),
  ])

  const janeUrl =
    siteSettings &&
    typeof siteSettings === 'object' &&
    'mainJaneUrl' in siteSettings &&
    typeof siteSettings.mainJaneUrl === 'string' &&
    siteSettings.mainJaneUrl.length > 0
      ? siteSettings.mainJaneUrl
      : FALLBACK_JANE_URL

  return (
    <main className="bg-white text-zinc-950">
      <section className="border-b border-zinc-200 bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <p className="font-semibold text-red-300">Conditions traitées</p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            Mieux comprendre vos douleurs et vos inconforts.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-200">
            Cette section regroupe les conditions fréquemment rencontrées à la clinique afin de vous
            aider à trouver de l’information claire avant de consulter.
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

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        {conditions.docs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {conditions.docs.map((condition: any) => (
              <article
                key={condition.id}
                className="flex flex-col rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{condition.title}</h2>

                  <p className="mt-4 leading-7 text-zinc-600">
                    {condition.shortDescription}
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-3">
                  <a
                    href={`/conditions-traitees/${condition.slug}`}
                    className="rounded-full border border-zinc-300 px-5 py-3 text-center font-semibold transition hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
                  >
                    En savoir plus
                  </a>

                  <a
                    href={condition.janeUrl || janeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-red-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-red-800"
                  >
                    Prendre rendez-vous
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-zinc-100 p-10 text-center">
            <h2 className="text-2xl font-bold">Aucune condition publiée pour le moment.</h2>
            <p className="mt-3 text-zinc-600">
              Ajoute des conditions traitées dans l’admin Payload pour les afficher ici.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}