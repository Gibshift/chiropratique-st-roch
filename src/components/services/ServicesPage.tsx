import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Image from 'next/image'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

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

function ClimbingHolds() {
  const holds = [
    // Marge gauche (5%-20%)
    { type: 'circle',   x: '6%',   y: '10%', size: 8, rotate: 0   },
    { type: 'square',   x: '14%',  y: '22%', size: 7, rotate: 25  },
    { type: 'triangle', x: '8%',   y: '35%', size: 9, rotate: 10  },
    { type: 'circle',   x: '18%',  y: '48%', size: 6, rotate: 0   },
    { type: 'square',   x: '5%',   y: '60%', size: 7, rotate: 45  },
    { type: 'triangle', x: '6%',  y: '72%', size: 6, rotate: -15 },
    { type: 'circle',   x: '16%',   y: '82%', size: 8, rotate: 0   },
    { type: 'square',   x: '17%',  y: '15%', size: 6, rotate: 30  },
    { type: 'triangle', x: '11%',  y: '55%', size: 7, rotate: 20  },
    { type: 'circle',   x: '19%',  y: '30%', size: 6, rotate: 0   },
    { type: 'square',   x: '7%',   y: '90%', size: 7, rotate: -20 },
    { type: 'triangle', x: '15%',  y: '67%', size: 8, rotate: 35  },
    { type: 'circle',   x: '13%',  y: '42%', size: 6, rotate: 0   },
    { type: 'square',   x: '9%',  y: '78%', size: 7, rotate: 15  },
    // Marge droite (80%-95%)
    { type: 'triangle', x: '81%',  y: '12%', size: 8, rotate: -10 },
    { type: 'circle',   x: '90%',  y: '25%', size: 7, rotate: 0   },
    { type: 'square',   x: '92%',  y: '38%', size: 9, rotate: -20 },
    { type: 'triangle', x: '93%',  y: '50%', size: 6, rotate: 30  },
    { type: 'circle',   x: '87%',  y: '62%', size: 8, rotate: 0   },
    { type: 'square',   x: '95%',  y: '20%', size: 6, rotate: 15  },
    { type: 'triangle', x: '82%',  y: '74%', size: 7, rotate: -5  },
    { type: 'circle',   x: '92%',  y: '85%', size: 6, rotate: 0   },
    { type: 'square',   x: '88%',  y: '45%', size: 7, rotate: 40  },
    { type: 'triangle', x: '80%',  y: '32%', size: 8, rotate: 20  },
    { type: 'circle',   x: '94%',  y: '68%', size: 7, rotate: 0   },
    { type: 'square',   x: '86%',  y: '90%', size: 6, rotate: -30 },
    { type: 'triangle', x: '91%',  y: '8%',  size: 7, rotate: 45  },
    { type: 'circle',   x: '83%',  y: '55%', size: 9, rotate: 0   },
  ]

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      {holds.map((h, i) => {
        const s = h.size
        const style: React.CSSProperties = {
          position: 'absolute',
          left: h.x,
          top: h.y,
          transform: `rotate(${h.rotate}deg)`,
          opacity: 0.22,
        }
        if (h.type === 'circle') return (
          <svg key={i} style={style} width={s} height={s} viewBox="0 0 10 10">
            <circle cx="5" cy="5" r="4" fill="none" stroke="#18181b" strokeWidth="1.5" />
          </svg>
        )
        if (h.type === 'square') return (
          <svg key={i} style={style} width={s} height={s} viewBox="0 0 10 10">
            <rect x="1" y="1" width="8" height="8" fill="none" stroke="#18181b" strokeWidth="1.5" />
          </svg>
        )
        return (
          <svg key={i} style={style} width={s} height={s} viewBox="0 0 10 10">
            <polygon points="5,1 9,9 1,9" fill="none" stroke="#18181b" strokeWidth="1.5" />
          </svg>
        )
      })}
    </div>
  )
}

export async function ServicesPage() {
  const payload = await getPayload({ config: configPromise })

  const services = await payload.find({ collection: 'services' as any, limit: 100, depth: 1, sort: 'order' })

  return (
    <main className="bg-white text-zinc-950">
      <section className="relative bg-white min-h-[68vh] pt-36 pb-24 lg:pt-78">

        <ClimbingHolds />

        {/* Ancrage des images sur le même container que le contenu */}
        <div className="pointer-events-none absolute inset-0 z-20">
          <div className="relative mx-auto h-full max-w-[1200px] px-6 lg:px-8">
            <Image
              src="/media/femme-monte-marche-siteweb-droite.png"
              alt=""
              width={340}
              height={560}
              className="hidden xl:block absolute bottom-66 right-210 w-[140px] object-contain xl:w-[220px]"
              style={{ transform: `rotate(${imageRotations.femme}5deg)` }}
              priority
            />
            <Image
              src="/media/homme-escalade-siteweb-gauche.png"
              alt=""
              width={340}
              height={560}
              className="hidden xl:block absolute bottom-69.5 left-258 w-[150px] object-contain xl:w-[230px]"
              style={{ transform: `rotate(${imageRotations.homme}deg)` }}
              priority
            />
          </div>
        </div>

        <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">

            <div className="mb-20 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="whitespace-nowrap font-[var(--font-barlow-condensed)] text-[clamp(2.8rem,5vw,4.5rem)] font-medium uppercase leading-[1.05] text-zinc-950">
                  Nos soins.<br />Votre réalité.
                </h1>
              </div>

              <div className="hidden lg:block w-[1px] h-24 flex-shrink-0 self-center bg-red-600" />

              <div className="lg:max-w-[38%]">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-red-600">Services</p>
                <p className="mt-3 text-[1rem] leading-7 text-zinc-600">
                  Chiropratique, ostéopathie, massothérapie, kinésithérapie et orthothérapie. Chaque professionnel apporte une expertise distincte pour vous aider à bouger sans douleur et retrouver votre plein potentiel.
                </p>
                <a href="#services-grid" className="mt-6 inline-flex items-center gap-2 text-[0.85rem] font-semibold text-zinc-950 transition hover:text-red-600">
                  Sélectionner un service ↓
                </a>
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
