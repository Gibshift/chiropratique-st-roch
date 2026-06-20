import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import RichText from '@/components/RichText'

const FALLBACK_JANE_URL = 'https://chiropratiquestroch.janeapp.com/embed/book_online'

type Props = {
  slug: string
}

export async function ProfessionalDetailPage({ slug }: Props) {
  const payload = await getPayload({ config: configPromise })

  const [siteSettings, professionalResult] = await Promise.all([
    payload.findGlobal({
      slug: 'site-settings' as any,
      depth: 0,
    }),

    payload.find({
      collection: 'professionals' as any,
      limit: 1,
      depth: 2,
      where: {
        slug: {
          equals: slug,
        },
        isActive: {
          equals: true,
        },
      },
    }),
  ])

  const professional: any = professionalResult.docs[0]

  if (!professional) {
    notFound()
  }

  const photoUrl =
    professional.photo &&
    typeof professional.photo === 'object' &&
    'url' in professional.photo
      ? professional.photo.url
      : null

  const janeUrl =
    professional.janeUrl ||
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
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1fr_420px] lg:px-8">
          <div>
            <a href="/professionnels" className="font-semibold text-red-300 hover:text-red-200">
              ← Tous les professionnels
            </a>

            <p className="mt-10 font-semibold text-red-300">Professionnel</p>

            <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
              {professional.name}
            </h1>

            <p className="mt-4 text-2xl font-semibold text-red-300">
              {professional.title}
            </p>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-200">
              {professional.shortBio}
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

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={professional.name}
                className="h-full min-h-[420px] w-full object-cover"
              />
            ) : (
              <div className="flex min-h-[420px] items-center justify-center bg-white/10">
                <span className="text-sm font-semibold uppercase tracking-wide text-zinc-300">
                  Photo à venir
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1fr_360px] lg:px-8">
        <div>
          <p className="font-semibold text-red-700">À propos</p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Approche et services offerts
          </h2>

          <div className="mt-8 rounded-3xl bg-zinc-100 p-8">
            <p className="text-lg leading-8 text-zinc-700">
              {professional.shortBio}
            </p>
          </div>

          {professional.bio ? (
            <div className="mt-10 rounded-3xl border border-zinc-200 bg-white p-8">
                <RichText data={professional.bio} />
            </div>
            ) : (
            <div className="mt-10 space-y-6 text-lg leading-8 text-zinc-700">
                <p>
                La biographie complète de ce professionnel pourra être ajoutée dans l’admin.
                </p>
            </div>
            )}

            {professional.approach && (
                <div className="mt-12 rounded-3xl bg-zinc-100 p-8">
                    <h3 className="text-2xl font-bold">Approche clinique</h3>

                    <div className="mt-6">
                    <RichText data={professional.approach} />
                    </div>
                </div>
                )}

          {professional.relatedServices?.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold">Services offerts</h3>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {professional.relatedServices.map((service: any) => (
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

          {professional.relatedConditions?.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold">Conditions souvent traitées</h3>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {professional.relatedConditions.map((condition: any) => (
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
        </div>

        <aside className="h-fit rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
            Rendez-vous
          </p>

          <h3 className="mt-3 text-2xl font-bold">
            Prendre rendez-vous avec {professional.name}
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
              Voir tous les services
            </a>
          </div>
        </aside>
      </section>
    </main>
  )
}