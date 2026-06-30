import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { PageHero } from '@/components/ui/PageHero'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

function getGridClass(count: number) {
  if (count === 1) return 'grid-cols-1 max-w-sm'
  if (count === 2) return 'grid-cols-2'
  if (count === 4 || count === 5) return 'grid-cols-6'
  return 'md:grid-cols-2 lg:grid-cols-3'
}

function getCardClass(index: number, total: number) {
  if (total === 4) {
    if (index < 3) return 'col-span-2'
    return 'col-start-3 col-span-2'
  }
  if (total === 5) {
    if (index < 3) return 'col-span-2'
    if (index === 3) return 'col-start-2 col-span-2'
    return 'col-start-4 col-span-2'
  }
  return ''
}

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

  const count = services.docs.length

  return (
    <main className="bg-white text-zinc-950">
      <PageHero
        title="Des soins adaptes a votre realite."
        description="La clinique regroupe plusieurs professionnels afin d'offrir une approche adaptee aux douleurs, tensions, blessures et inconforts du quotidien."
        imageUrl={heroImageUrl}
      />

      <section className="relative z-10 -mt-4 bg-white shadow-[0_-12px_32px_rgba(0,0,0,0.14)]">
        <ScrollReveal>
        <div className="mx-auto max-w-[1200px] px-6 py-20 lg:px-8">
        {count > 0 ? (
          <div className={`grid gap-6 ${getGridClass(count)}`}>
            {services.docs.map((service: any, index: number) => (
              <article
                key={service.id}
                className={`flex flex-col border border-zinc-200 bg-white p-6 ${getCardClass(index, count)}`}
              >
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-zinc-950">{service.title}</h2>
                  <p className="mt-4 leading-7 text-zinc-600">{service.shortDescription}</p>
                </div>
                <div className="mt-8">
                  <a
                    href={`/services/${service.slug}`}
                    className="block border border-zinc-300 px-5 py-3 text-center font-semibold text-zinc-950 transition hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
                  >
                    En savoir plus
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border border-zinc-200 p-10 text-center">
            <h2 className="text-2xl font-bold text-zinc-950">Aucun service publie pour le moment.</h2>
            <p className="mt-3 text-zinc-600">Ajoute des services dans l'admin Payload pour les afficher ici.</p>
          </div>
        )}
        </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
