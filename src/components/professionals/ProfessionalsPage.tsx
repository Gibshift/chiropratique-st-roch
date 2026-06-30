import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { PageHero } from '@/components/ui/PageHero'

export async function ProfessionalsPage() {
  const payload = await getPayload({ config: configPromise })

  const professionals = await payload.find({
    collection: 'professionals' as any,
    limit: 100,
    depth: 1,
    sort: 'order',
    where: {
      isActive: {
        equals: true,
      },
    },
  })

  return (
    <main className="bg-white text-zinc-950">
      <PageHero
        eyebrow="Professionnels"
        title="Une équipe multidisciplinaire au service de votre mieux-être."
        description="Découvrez les professionnels de la clinique, leurs services, leur approche et leurs intérêts cliniques."
      />

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        {professionals.docs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {professionals.docs.map((professional: any) => {
              const photoUrl =
                professional.photo &&
                typeof professional.photo === 'object' &&
                'url' in professional.photo
                  ? professional.photo.url
                  : null

              return (
                <article
                  key={professional.id}
                  className="flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm"
                >
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={professional.name}
                      className="h-72 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-72 items-center justify-center bg-zinc-100">
                      <span className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                        Photo à venir
                      </span>
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold">{professional.name}</h2>

                      <p className="mt-1 font-semibold text-red-700">
                        {professional.title}
                      </p>

                      <p className="mt-4 leading-7 text-zinc-600">
                        {professional.shortBio}
                      </p>
                    </div>

                    <div className="mt-8">
                      <a
                        href={`/professionnels/${professional.slug}`}
                        className="block rounded-full border border-zinc-300 px-5 py-3 text-center font-semibold transition hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
                      >
                        Voir le profil
                      </a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="rounded-3xl bg-zinc-100 p-10 text-center">
            <h2 className="text-2xl font-bold">Aucun professionnel publié pour le moment.</h2>

            <p className="mt-3 text-zinc-600">
              Ajoute des professionnels dans l'admin Payload pour les afficher ici.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}