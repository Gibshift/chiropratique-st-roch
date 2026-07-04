import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Image from 'next/image'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { GeometricShapes } from '@/components/ui/GeometricShapes'

const imageRotations = {
  femme: 0,   // degrés — positif = sens horaire, négatif = antihoraire
  homme: 0,   // degrés
}

const cardHeights = [
  'lg:h-[140px]',
  'lg:h-[220px]',
  'lg:h-[300px]',
  'lg:h-[380px]',
  'lg:h-[460px]',
]


export async function ServicesPage() {
  const payload = await getPayload({ config: configPromise })

  const services = await payload.find({ collection: 'services' as any, limit: 100, depth: 1, sort: 'order' })

  return (
    <main className="bg-white text-zinc-950">
      <section className="relative bg-white min-h-[68vh] pt-32 pb-24 lg:pt-48">

        <GeometricShapes />

        {/* Ancrage des images sur le même container que le contenu */}
        <ScrollReveal className="pointer-events-none absolute inset-0 z-20">
          <div className="relative mx-auto h-full max-w-[1200px] px-6 lg:px-8">
            <Image
              src="/assets/femme-monte-marche-siteweb-droite.png"
              alt=""
              width={340}
              height={560}
              className="hidden xl:block absolute bottom-65 right-208 w-[140px] object-contain xl:w-[240px]"
              style={{ transform: `rotate(${imageRotations.femme}deg)` }}
              priority
            />
            <Image
              src="/assets/homme-escalade-siteweb-gauche.png"
              alt=""
              width={340}
              height={560}
              className="hidden xl:block absolute bottom-69.5 left-258 w-[150px] object-contain xl:w-[230px]"
              style={{ transform: `rotate(${imageRotations.homme}deg)` }}
              priority
            />
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">

            <div className="mb-20 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="whitespace-nowrap font-[var(--font-barlow-condensed)] text-[clamp(2rem,7vw,4.5rem)] font-medium uppercase leading-[1.05] text-zinc-950">
                  Nos soins.<br />Votre réalité.
                </h1>
              </div>

              <div className="hidden lg:block w-[1px] h-24 flex-shrink-0 self-center bg-red-600" />

              <div className="lg:max-w-[38%]">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-red-600">Services</p>
                <p className="mt-3 text-[1rem] leading-7 text-zinc-800">
                  Chiropratique, ostéopathie, massothérapie, kinésithérapie et orthothérapie. Chaque professionnel apporte une expertise distincte pour vous aider à bouger sans douleur et retrouver votre plein potentiel.
                </p>
              </div>
            </div>

            {services.docs.length > 0 ? (
              <div id="services-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 lg:items-end">
                {services.docs.map((service: any, index: number) => {
                  const title = (service.title as string).toUpperCase()
                  const firstLetter = title.charAt(0)
                  const rest = title.slice(1)
                  const height = cardHeights[index] ?? 'lg:h-[200px]'

                  return (
                    <a
                      key={service.id}
                      href={`/services/${service.slug}`}
                      className={`group flex flex-col justify-end min-h-[140px] border border-zinc-400 bg-white px-6 pb-12 pt-6 transition hover:bg-zinc-50 lg:-ml-[1px] lg:min-h-0 lg:pt-0 first:lg:ml-0 ${height}`}
                    >
                      <h2 className="font-[var(--font-barlow-condensed)] text-[clamp(1.1rem,1.5vw,1.35rem)] font-medium uppercase leading-none tracking-[0.02em]">
                        <span className="text-red-600">{firstLetter}</span>
                        <span className="text-zinc-950">{rest}</span>
                      </h2>
                      <span className="mt-8 inline-flex items-center gap-1 text-[1rem] font-semibold text-red-600 transition group-hover:gap-2">
                        En savoir plus <span>→</span>
                      </span>
                    </a>
                  )
                })}
              </div>
            ) : (
              <div className="border border-zinc-400 p-10 text-center">
                <p className="text-zinc-500">Aucun service publié pour le moment.</p>
              </div>
            )}

          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
