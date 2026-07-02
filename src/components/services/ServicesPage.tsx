import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { PageHero } from '@/components/ui/PageHero'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const cardHeights = [
  'lg:h-[180px]',
  'lg:h-[320px]',
  'lg:h-[240px]',
  'lg:h-[400px]',
  'lg:h-[120px]',
]

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

  const janeUrl: string = (siteSettings as any)?.mainJaneUrl ?? 'https://chiropratiquestroch.janeapp.com/embed/book_online'

  return (
    <main className="bg-white text-zinc-950">
      <PageHero
        eyebrow="Services"
        title={"Nos soins.\nVotre réalité."}
        highlight={['réalité']}
        description="La clinique regroupe plusieurs professionnels afin d'offrir une approche adaptée aux douleurs, tensions, blessures et inconforts du quotidien."
        imageUrl={heroImageUrl}
        ctaUrl={janeUrl}
      />

      <section className="relative z-10 -mt-4 overflow-x-hidden bg-white shadow-[0_-12px_32px_rgba(0,0,0,0.14)]">
        <ScrollReveal>
          <div className="relative mx-auto max-w-[1200px] px-6 lg:px-8">

            {/* Intro multidisciplinarité */}
            <div className="pb-10 pt-16 text-center lg:pb-14 lg:pt-24">
              <h2 className="mx-auto max-w-[800px] font-[var(--font-barlow-condensed)] text-[clamp(1.4rem,2.5vw,2rem)] font-medium uppercase leading-[1.0] tracking-[0.02em] text-zinc-950">
                <span className="text-red-600">P</span>lusieurs services sous un même toit, mais pourquoi?
              </h2>
              <p className="mx-auto mt-8 max-w-[860px] text-[1.05rem] leading-8 text-zinc-500">
                Parce que chaque patient est différent, nous croyons qu'une seule expertise ne suffit pas à répondre à tous les besoins en santé. C'est pourquoi, depuis plus de 15 ans, nous réunissons plusieurs professionnels sous un même toit pour vous offrir des soins complets et adaptés à vous.
              </p>
            </div>

            {/* Grille des services — hauteurs variées */}
            {services.docs.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 lg:items-end">
                  {services.docs.map((service: any, index: number) => {
                    const title = (service.title as string).toUpperCase()
                    const firstLetter = title.charAt(0)
                    const rest = title.slice(1)
                    const height = cardHeights[index] ?? 'lg:h-[200px]'

                    return (
                      <a
                        key={service.id}
                        href={`/services/${service.slug}`}
                        className={`group flex flex-col justify-end min-h-[140px] border border-zinc-200 bg-white px-6 pb-8 pt-6 transition hover:bg-zinc-50 lg:-ml-[1px] lg:min-h-0 lg:pt-0 first:lg:ml-0 ${height}`}
                      >
                        <h3 className="font-[var(--font-barlow-condensed)] text-[clamp(1.1rem,1.5vw,1.35rem)] font-medium uppercase leading-none tracking-[0.02em]">
                          <span className="text-red-600">{firstLetter}</span>
                          <span className="text-zinc-950">{rest}</span>
                        </h3>
                        <span className="mt-4 inline-flex items-center gap-1 text-[0.85rem] font-semibold text-red-600 transition group-hover:gap-2">
                          En savoir plus <span>→</span>
                        </span>
                      </a>
                    )
                  })}
                </div>

              </div>
            ) : (
              <div className="border border-zinc-200 p-10 text-center">
                <h2 className="text-2xl font-bold text-zinc-950">Aucun service publié pour le moment.</h2>
                <p className="mt-3 text-zinc-600">Ajoute des services dans l'admin Payload pour les afficher ici.</p>
              </div>
            )}

          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
