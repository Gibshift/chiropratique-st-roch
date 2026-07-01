import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Image from 'next/image'
import { PageHero } from '@/components/ui/PageHero'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

/*
ANCIENNE VERSION — grille adaptive (getGridClass / getCardClass)

function getGridClass(count: number) {
  if (count === 1) return 'grid-cols-1 max-w-sm'
  if (count === 2) return 'grid-cols-1 md:grid-cols-2'
  if (count === 4 || count === 5) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-6'
  return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
}

function getCardClass(index: number, total: number) {
  if (total === 4) {
    if (index < 3) return 'lg:col-span-2'
    return 'lg:col-start-3 lg:col-span-2'
  }
  if (total === 5) {
    if (index < 3) return 'lg:col-span-2'
    if (index === 3) return 'lg:col-start-2 lg:col-span-2'
    return 'lg:col-start-4 lg:col-span-2'
  }
  return ''
}

Ancienne grille dans le JSX :
<div className={`grid gap-6 ${getGridClass(count)}`}>
  {professionals.docs.map((professional: any, index: number) => {
    const photoUrl = ...
    return (
      <article className={`flex flex-col overflow-hidden border border-zinc-200 bg-white ${getCardClass(index, count)}`}>
        <div className="relative aspect-[3/4] w-full overflow-hidden md:aspect-auto md:h-72">
          <Image ... className="object-cover object-top" />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h2 className="text-2xl font-bold">{professional.name}</h2>
          <p className="mt-1 font-semibold text-red-600">{professional.title}</p>
          <p className="mt-4 leading-7 text-zinc-600">{professional.shortBio}</p>
          <a href={...} className="block border border-zinc-300 px-5 py-3 ...">Voir le profil</a>
        </div>
      </article>
    )
  })}
</div>
*/

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

  const [professionals, siteSettings] = await Promise.all([
    payload.find({
      collection: 'professionals' as any,
      limit: 100,
      depth: 1,
      sort: 'order',
      where: { isActive: { equals: true } },
    }),
    payload.findGlobal({ slug: 'site-settings' as any, depth: 1 }),
  ])

  const heroImageUrl =
    siteSettings?.professionalsHeroImage &&
    typeof siteSettings.professionalsHeroImage === 'object' &&
    'url' in siteSettings.professionalsHeroImage
      ? (siteSettings.professionalsHeroImage as any).url
      : null

  const count = professionals.docs.length

  return (
    <main className="bg-white text-zinc-950">
      <PageHero
        title="Une equipe, plusieurs expertises."
        description="Decouvrez les professionnels de la clinique, leurs services, leur approche et leurs interets cliniques."
        imageUrl={heroImageUrl}
      />

      <section className="relative z-10 -mt-4 bg-white shadow-[0_-12px_32px_rgba(0,0,0,0.14)]">
        <ScrollReveal>
          <div className="mx-auto max-w-[1200px] px-6 py-20 lg:px-8">
            {count > 0 ? (
              <div className={`grid grid-cols-2 gap-2 sm:grid-cols-3 lg:gap-3 ${getDesktopCols(count)}`}>
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
                          <span className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
                            Photo à venir
                          </span>
                        </div>
                      )}

                      <div className="flex flex-1 flex-col p-4 lg:p-5">
                        <h2 className="text-[0.95rem] font-bold leading-tight text-zinc-950">{professional.name}</h2>
                        <p className="mt-1 text-[0.8rem] font-semibold text-red-600">{professional.title}</p>
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
                <h2 className="text-2xl font-bold text-zinc-950">Aucun professionnel publie pour le moment.</h2>
                <p className="mt-3 text-zinc-600">Ajoute des professionnels dans l'admin Payload pour les afficher ici.</p>
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
