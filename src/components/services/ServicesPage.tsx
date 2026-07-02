import configPromise from '@payload-config'
import { getPayload } from 'payload'
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

  const services = await payload.find({ collection: 'services' as any, limit: 100, depth: 1, sort: 'order' })

  return (
    <main className="bg-white text-zinc-950">
      <section className="bg-white pt-36 pb-24 lg:pt-44">
        <ScrollReveal>
          <div className="mx-auto max-w-[1200px] px-6 lg:px-8">

            <div className="mb-20 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="font-[var(--font-barlow-condensed)] text-[clamp(2.8rem,5vw,4.5rem)] font-medium uppercase leading-[1.05] text-zinc-950">
                  Nos soins.<br />Votre réalité.
                </h1>
                <div className="mt-5 h-[3px] w-16 bg-red-600" />
              </div>
              <div className="lg:max-w-[42%]">
                <p className="text-[1rem] leading-7 text-zinc-500">
                  La clinique regroupe plusieurs professionnels afin d'offrir une approche adaptée aux douleurs, tensions, blessures et inconforts du quotidien.
                </p>
              </div>
            </div>

            {services.docs.length > 0 ? (
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
                      <h2 className="font-[var(--font-barlow-condensed)] text-[clamp(1.1rem,1.5vw,1.35rem)] font-medium uppercase leading-none tracking-[0.02em]">
                        <span className="text-red-600">{firstLetter}</span>
                        <span className="text-zinc-950">{rest}</span>
                      </h2>
                      <span className="mt-4 inline-flex items-center gap-1 text-[0.85rem] font-semibold text-red-600 transition group-hover:gap-2">
                        En savoir plus <span>→</span>
                      </span>
                    </a>
                  )
                })}
              </div>
            ) : (
              <div className="border border-zinc-200 p-10 text-center">
                <p className="text-zinc-500">Aucun service publié pour le moment.</p>
              </div>
            )}

          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
