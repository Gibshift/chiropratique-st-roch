import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { PageHero } from '@/components/ui/PageHero'

export async function ConditionsPage() {
  const payload = await getPayload({ config: configPromise })

  const conditions = await payload.find({
    collection: 'conditions' as any,
    limit: 100,
    depth: 1,
    sort: 'order',
  })

  return (
    <main className="bg-white text-zinc-950">
      <PageHero
        eyebrow="Conditions traitées"
        title="Mieux comprendre vos douleurs et vos inconforts."
        description="Cette section regroupe les conditions fréquemment rencontrées à la clinique afin de vous aider à trouver de l'information claire avant de consulter."
      />

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

                <div className="mt-8">
                  <a
                    href={`/conditions-traitees/${condition.slug}`}
                    className="block rounded-full border border-zinc-300 px-5 py-3 text-center font-semibold transition hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
                  >
                    En savoir plus
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-zinc-100 p-10 text-center">
            <h2 className="text-2xl font-bold">Aucune condition publiée pour le moment.</h2>

            <p className="mt-3 text-zinc-600">
              Ajoute des conditions traitées dans l'admin Payload pour les afficher ici.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}