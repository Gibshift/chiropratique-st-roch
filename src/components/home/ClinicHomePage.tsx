import configPromise from '@payload-config'
import { getPayload } from 'payload'

const FALLBACK_JANE_URL = 'https://chiropratiquestroch.janeapp.com/embed/book_online'

function getDailyIndex(length: number) {
  if (length <= 0) return 0

  const todayInQuebec = new Intl.DateTimeFormat('fr-CA', {
    timeZone: 'America/Toronto',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())

  const dateScore = Array.from(todayInQuebec).reduce((total, character) => {
    return total + character.charCodeAt(0)
  }, 0)

  return dateScore % length
}

export async function ClinicHomePage() {
  const payload = await getPayload({ config: configPromise })

  const [siteSettings, services, conditions, professionals, posts] = await Promise.all([
    payload.findGlobal({
      slug: 'site-settings' as any,
      depth: 1,
    }),

    payload.find({
      collection: 'services' as any,
      limit: 6,
      depth: 1,
      sort: 'order',
      where: {
        isFeatured: {
          equals: true,
        },
      },
    }),

    payload.find({
      collection: 'conditions' as any,
      limit: 8,
      depth: 1,
      sort: 'order',
      where: {
        isFeatured: {
          equals: true,
        },
      },
    }),

    payload.find({
      collection: 'professionals' as any,
      limit: 6,
      depth: 1,
      sort: 'order',
      where: {
        isActive: {
          equals: true,
        },
      },
    }),

    payload.find({
      collection: 'posts',
      limit: 50,
      depth: 1,
      sort: '-publishedAt',
      where: {
        _status: {
          equals: 'published',
        },
      },
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

  const hasServices = services.docs.length > 0
  const hasConditions = conditions.docs.length > 0
  const hasProfessionals = professionals.docs.length > 0
  const hasPosts = posts.docs.length > 0

  const dailyPost = hasPosts ? posts.docs[getDailyIndex(posts.docs.length)] : null

  const dailyPostImageUrl =
    dailyPost?.heroImage &&
    typeof dailyPost.heroImage === 'object' &&
    'url' in dailyPost.heroImage
      ? dailyPost.heroImage.url
      : null

  return (
    <main className="bg-white text-zinc-950">
      <section className="relative overflow-hidden border-b border-zinc-200 bg-zinc-950 text-white">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-red-800/20" />

        <div className="relative mx-auto grid min-h-[78vh] max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-red-500/40 px-4 py-2 text-sm font-medium text-red-100">
              Clinique multidisciplinaire à Québec
            </p>

            <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
              Chiropratique, ostéopathie et soins musculosquelettiques au cœur de St-Roch.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-200">
              Une équipe humaine et professionnelle pour vous accompagner avec les douleurs au dos,
              au cou, les tensions musculaires, les blessures sportives et les inconforts du quotidien.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href={janeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-red-700 px-7 py-4 text-center font-semibold text-white transition hover:bg-red-800"
              >
                Prendre rendez-vous
              </a>

              <a
                href="/services"
                className="rounded-full border border-white/30 px-7 py-4 text-center font-semibold text-white transition hover:bg-white hover:text-zinc-950"
              >
                Voir les services
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
            <div className="rounded-2xl bg-white p-6 text-zinc-950">
              <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
                Accès rapide
              </p>

              <div className="mt-5 grid gap-3">
                <a href="/conditions-traitees" className="rounded-xl bg-zinc-100 p-4 font-medium hover:bg-zinc-200">
                  Conditions traitées
                </a>
                <a href="/professionnels" className="rounded-xl bg-zinc-100 p-4 font-medium hover:bg-zinc-200">
                  Professionnels
                </a>
                <a href="/contact" className="rounded-xl bg-zinc-100 p-4 font-medium hover:bg-zinc-200">
                  Contact et emplacement
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {hasServices && (
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-semibold text-red-700">Nos services</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
              Des soins adaptés à votre réalité.
            </h2>
            <p className="mt-5 text-lg leading-8 text-zinc-600">
              Consultez les services offerts à la clinique et trouvez l’approche qui correspond à
              votre situation.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.docs.map((service: any) => (
              <article key={service.id} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold">{service.title}</h3>
                <p className="mt-3 text-zinc-600">{service.shortDescription}</p>

                <div className="mt-6">
                  <a href={`/services/${service.slug}`} className="font-semibold text-red-700 hover:text-red-800">
                    En savoir plus
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {hasConditions && (
        <section className="bg-zinc-100">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="max-w-3xl">
              <p className="font-semibold text-red-700">Conditions traitées</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
                Trouver de l’information selon votre douleur.
              </h2>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {conditions.docs.map((condition: any) => (
                <a
                  key={condition.id}
                  href={`/conditions-traitees/${condition.slug}`}
                  className="rounded-2xl bg-white p-5 font-semibold shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {condition.title}
                  <p className="mt-3 text-sm font-normal leading-6 text-zinc-600">
                    {condition.shortDescription}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {hasProfessionals && (
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-semibold text-red-700">Notre équipe</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
              Des professionnels accessibles et à l’écoute.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {professionals.docs.map((professional: any) => (
              <article key={professional.id} className="rounded-3xl border border-zinc-200 p-6">
                <h3 className="text-xl font-bold">{professional.name}</h3>
                <p className="mt-1 font-medium text-red-700">{professional.title}</p>
                <p className="mt-4 text-zinc-600">{professional.shortBio}</p>

                <a
                  href={`/professionnels/${professional.slug}`}
                  className="mt-6 inline-flex font-semibold text-red-700 hover:text-red-800"
                >
                  Voir le profil
                </a>
              </article>
            ))}
          </div>
        </section>
      )}

      {dailyPost && (
        <section className="bg-zinc-950 text-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1fr_420px] lg:px-8">
            <div>
              <p className="font-semibold text-red-300">À lire aujourd’hui</p>

              <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
                Un article pour mieux comprendre votre santé musculosquelettique.
              </h2>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
                Chaque jour, nous mettons de l’avant un article du blogue pour vous aider à mieux
                comprendre les douleurs, les tensions, la posture et les habitudes qui influencent
                le corps.
              </p>

              <a
                href="/blogue"
                className="mt-8 inline-flex rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-zinc-950"
              >
                Voir tous les articles
              </a>
            </div>

            <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white text-zinc-950 shadow-2xl">
              {dailyPostImageUrl ? (
                <img
                  src={dailyPostImageUrl}
                  alt={dailyPost.title}
                  className="h-56 w-full object-cover"
                />
              ) : (
                <div className="flex h-56 items-center justify-center bg-zinc-100 p-8 text-center">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-700">
                    Blogue santé
                  </p>
                </div>
              )}

              <div className="p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
                  Article du jour
                </p>

                <h3 className="mt-3 text-2xl font-bold">{dailyPost.title}</h3>

                {dailyPost.meta?.description ? (
                  <p className="mt-4 leading-7 text-zinc-600">
                    {dailyPost.meta.description}
                  </p>
                ) : null}

                <a
                  href={`/blogue/${dailyPost.slug}`}
                  className="mt-6 inline-flex font-semibold text-red-700 hover:text-red-800"
                >
                  Lire l’article →
                </a>
              </div>
            </article>
          </div>
        </section>
      )}
    </main>
  )
}