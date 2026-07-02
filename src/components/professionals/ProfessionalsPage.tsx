import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Image from 'next/image'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { GeometricShapes } from '@/components/ui/GeometricShapes'

function getDesktopCols(count: number) {
  const map: Record<number, string> = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
  }
  return map[count] ?? 'lg:grid-cols-6'
}

export async function ProfessionalsPage() {
  const payload = await getPayload({ config: configPromise })

  const professionals = await payload.find({
    collection: 'professionals' as any,
    limit: 100,
    depth: 1,
    sort: 'order',
    where: { isActive: { equals: true } },
  })

  const count = professionals.docs.length

  return (
    <main className="bg-white text-zinc-950">
      <section className="relative bg-white min-h-[68vh] pt-24 pb-24 lg:pt-48">
        <GeometricShapes />
        <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">

            <div className="mb-20 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="whitespace-nowrap font-[var(--font-barlow-condensed)] text-[clamp(2.8rem,5vw,4.5rem)] font-medium uppercase leading-[1.05] text-zinc-950">
                  Notre équipe.
                </h1>
              </div>

              <div className="hidden lg:block w-[1px] h-24 flex-shrink-0 self-center bg-red-600" />

              <div className="lg:max-w-[38%]">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-red-600">Professionnels</p>
                <p className="mt-3 text-[1rem] leading-7 text-zinc-800">
                  Chaque professionnel de la clinique apporte une expertise distincte. Découvrez leur approche et trouvez celui qui vous correspond.
                </p>
              </div>
            </div>

            {count > 0 ? (
              <div id="equipe-grid" className={`grid grid-cols-2 gap-2 sm:grid-cols-3 lg:gap-3 ${getDesktopCols(count)}`}>
                {professionals.docs.map((professional: any) => {
                  const photoUrl =
                    professional.photo &&
                    typeof professional.photo === 'object' &&
                    'url' in professional.photo
                      ? professional.photo.url
                      : null

                  return (
                    <a
                      key={professional.id}
                      href={`/professionnels/${professional.slug}`}
                      className="group flex flex-col overflow-hidden border border-zinc-200 bg-white transition hover:bg-zinc-50"
                    >
                      {photoUrl ? (
                        <div className="relative aspect-[3/4] w-full overflow-hidden">
                          <Image
                            src={photoUrl}
                            alt={professional.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            className="object-cover object-top transition duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-[3/4] items-center justify-center bg-zinc-100">
                          <span className="text-sm font-semibold uppercase tracking-wide text-zinc-400">Photo à venir</span>
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-4 lg:p-5">
                        <h2 className="text-[1.25rem] font-bold leading-tight text-zinc-950">{professional.name}</h2>
                        <p className="mt-1 text-[0.9rem] font-semibold text-red-600">{professional.title}</p>
                        <span className="mt-auto pt-4 text-[0.8rem] font-semibold text-zinc-400 transition group-hover:text-zinc-950">
                          Voir le profil →
                        </span>
                      </div>
                    </a>
                  )
                })}
              </div>
            ) : (
              <div className="border border-zinc-200 p-10 text-center">
                <p className="text-zinc-500">Aucun professionnel publié pour le moment.</p>
              </div>
            )}

          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
