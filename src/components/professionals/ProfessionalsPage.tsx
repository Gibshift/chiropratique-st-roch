import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Image from 'next/image'
import { PageHero } from '@/components/ui/PageHero'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

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
          <div className={`grid gap-6 ${getGridClass(count)}`}>
            {professionals.docs.map((professional: any, index: number) => {
              const photoUrl =
                professional.photo &&
                typeof professional.photo === 'object' &&
                'url' in professional.photo
                  ? professional.photo.url
                  : null

              return (
                <article
                  key={professional.id}
                  className={`flex flex-col overflow-hidden border border-zinc-200 bg-white ${getCardClass(index, count)}`}
                >
                  {photoUrl ? (
                    <div className="relative h-72 w-full overflow-hidden">
                      <Image
                        src={photoUrl}
                        alt={professional.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                        style={{ objectPosition: 'center 15%' }}
                      />
                    </div>
                  ) : (
                    <div className="flex h-72 items-center justify-center bg-zinc-100">
                      <span className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
                        Photo a venir
                      </span>
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-zinc-950">{professional.name}</h2>
                      <p className="mt-1 font-semibold text-red-600">{professional.title}</p>
                      <p className="mt-4 leading-7 text-zinc-600">{professional.shortBio}</p>
                    </div>
                    <div className="mt-8">
                      <a
                        href={`/professionnels/${professional.slug}`}
                        className="block border border-zinc-300 px-5 py-3 text-center font-semibold text-zinc-950 transition hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
                      >
                        Voir le profil
                      </a>
                    </div>
                  </div>
                </article>
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

