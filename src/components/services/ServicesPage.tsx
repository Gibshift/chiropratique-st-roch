import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { PageHero } from '@/components/ui/PageHero'

export async function ServicesPage() {
  const payload = await getPayload({ config: configPromise })

  const [services, siteSettings] = await Promise.all([
    payload.find({ collection: 'services' as any, limit: 100, depth: 1, sort: 'order' }),
    payload.findGlobal({ slug: 'site-settings' as any, depth: 1 }),
  ])

  const heroImageUrl =
    siteSettings?.servicesHeroImage &&
    typeof siteSettings.servicesHeroImage === 'object' &&
    'url' in siteSettings.servicesHeroImage
      ? (siteSettings.servicesHeroImage as any).url
      : null

  return (
    <main className="bg-white text-zinc-950">
      <PageHero
        title="Des soins pour vous aider a retrouver du confort dans vos mouvements."
        description="La clinique regroupe plusieurs professionnels afin d'offrir une approche adaptee aux douleurs, tensions, blessures et inconforts du quotidien."
        imageUrl={heroImageUrl}
      />

      <section className="mx-auto max-w-[1200px] px-6 py-20 lg:px-8">
        {services.docs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.docs.map((service: any) => (
              <article
                key={service.id}
                className="flex flex-col rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{service.title}</h2>

                  <p className="mt-4 leading-7 text-zinc-600">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="mt-8">
                  <a
                    href={`/services/${service.slug}`}
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
            <h2 className="text-2xl font-bold">Aucun service publié pour le moment.</h2>

            <p className="mt-3 text-zinc-600">
              Ajoute des services dans l'admin Payload pour les afficher ici.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}