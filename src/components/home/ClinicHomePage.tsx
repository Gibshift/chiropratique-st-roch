import configPromise from '@payload-config'
import { getPayload } from 'payload'

const FALLBACK_JANE_URL = 'https://chiropratiquestroch.janeapp.com/embed/book_online'

function getDailyIndex(length: number) {
  if (length <= 0) return 0

  const todayInQuebec = new Intl.DateTimeFormat('fr-CA', {
    timeZone: 'America/Toronto',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())

  const dateScore = Array.from(todayInQuebec).reduce((total, character) => {
    return total + character.charCodeAt(0)
  }, 0)

  return dateScore % length
}

export async function ClinicHomePage() {
  const payload = await getPayload({ config: configPromise })

  const [siteSettings, services, conditions, professionals, posts] = await Promise.all([
    payload.findGlobal({
      slug: 'site-settings' as any,
      depth: 1,
    }),

    payload.find({
      collection: 'services' as any,
      limit: 6,
      depth: 1,
      sort: 'order',
      where: {
        isFeatured: {
          equals: true,
        },
      },
    }),

    payload.find({
      collection: 'conditions' as any,
      limit: 8,
      depth: 1,
      sort: 'order',
      where: {
        isFeatured: {
          equals: true,
        },
      },
    }),

    payload.find({
      collection: 'professionals' as any,
      limit: 6,
      depth: 1,
      sort: 'order',
      where: {
        isActive: {
          equals: true,
        },
      },
    }),

    payload.find({
      collection: 'posts',
      limit: 50,
      depth: 1,
      sort: '-publishedAt',
      where: {
        _status: {
          equals: 'published',
        },
      },
    }),
  ])

  const janeUrl =
    siteSettings &&
    typeof siteSettings === 'object' &&
    'mainJaneUrl' in siteSettings &&
    typeof siteSettings.mainJaneUrl === 'string' &&
    siteSettings.mainJaneUrl.length > 0
      ? siteSettings.mainJaneUrl
      : FALLBACK_JANE_URL

  const hasServices = services.docs.length > 0
  const hasConditions = conditions.docs.length > 0
  const hasProfessionals = professionals.docs.length > 0
  const hasPosts = posts.docs.length > 0

  const dailyPost = hasPosts ? posts.docs[getDailyIndex(posts.docs.length)] : null

  const dailyPostImageUrl =
    dailyPost?.heroImage &&
    typeof dailyPost.heroImage === 'object' &&
    'url' in dailyPost.heroImage
      ? dailyPost.heroImage.url
      : null

  const homeHeroImageUrl =
  siteSettings &&
  typeof siteSettings === 'object' &&
  'homeHeroImage' in siteSettings &&
  siteSettings.homeHeroImage &&
  typeof siteSettings.homeHeroImage === 'object' &&
  'url' in siteSettings.homeHeroImage
    ? siteSettings.homeHeroImage.url
    : null    

 return (
  <main className="bg-[#faf9f6] text-zinc-900 selection:bg-red-50 selection:text-red-800">
    {/* HERO */}
    <section className="relative isolate min-h-[85vh] overflow-hidden bg-zinc-950 text-white">
      {homeHeroImageUrl ? (
        <img
          src={homeHeroImageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-1000 ease-out"
        />
      ) : null}

      {/* Overlays plus subtils pour éviter l'effet "sombre et froid" */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,15,15,0.72)_0%,rgba(15,15,15,0.38)_50%,rgba(15,15,15,0.08)_100%)]" />
<div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(15,15,15,0.26)_0%,transparent_48%)]" />

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl items-center px-6 py-20 lg:px-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-red-500" />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-300">
              Clinique multidisciplinaire · Québec
            </p>
          </div>

          <h1 className="mt-6 text-5xl font-[300] leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
            Chiropratique <br />
            <span className="font-serif italic text-red-500 font-normal">St-Roch</span>
          </h1>

          <p className="mt-8 max-w-md text-base leading-relaxed text-zinc-300/90 md:text-lg">
            Une approche attentive, simple et adaptée à votre réalité.
          </p>

          <div className="mt-10 flex flex-wrap gap-5 items-center">
            <a
              href={janeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex border border-white/35 bg-white/12 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-all duration-300 hover:border-red-500 hover:bg-white hover:text-zinc-950"
            >
              Prendre rendez-vous
            </a>

  
          </div>
        </div>
      </div>
    </section>

    {/* PHRASE SIGNATURE */}
    <section className="bg-white py-24 border-b border-zinc-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="block text-3xl text-red-500 font-serif mb-4">“</span>
          <p className="text-2xl font-[350] leading-relaxed tracking-wide text-zinc-800 md:text-4xl italic">
            Des soins clairs, humains et adaptés à la personne devant nous.
          </p>
        </div>
      </div>
    </section>

    {/* SERVICES */}
    {hasServices && (
      <section className="bg-zinc-50/50 py-24 border-b border-zinc-200/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between border-b border-zinc-200 pb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">Nos expertises</p>
              <h2 className="text-3xl font-[300] tracking-tight text-zinc-900 md:text-5xl">
                Services
              </h2>
            </div>

            <a
              href="/services"
              className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 transition-colors duration-300 hover:text-red-600 sm:inline-flex items-center gap-1"
            >
              Tout voir <span>→</span>
            </a>
          </div>

          <div className="grid gap-px bg-zinc-200 overflow-hidden md:grid-cols-2 lg:grid-cols-3">
            {services.docs.map((service: any) => (
              <a
                key={service.id}
                href={`/services/${service.slug}`}
                className="group flex flex-col justify-between min-h-[240px] bg-white p-8 transition-all duration-300 hover:z-10 hover:shadow-zinc-200/50"
              >
                <div>
                  <h3 className="text-xl font-medium tracking-tight text-zinc-900 group-hover:text-red-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400 group-hover:text-zinc-900 transition-colors">
                    En savoir plus
                  </span>
                  <span className="text-zinc-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    )}

    {/* CONDITIONS */}
    {hasConditions && (
      <section className="bg-white py-24 border-b border-zinc-200/60">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-600 block mb-2">Votre santé</span>
            <h2 className="text-3xl font-[300] leading-tight tracking-tight text-zinc-900 md:text-5xl">
              Conditions traitées
            </h2>
          </div>

          <div className="divide-y divide-zinc-100 border-t border-zinc-200">
            {conditions.docs.map((condition: any) => (
              <a
                key={condition.id}
                href={`/conditions-traitees/${condition.slug}`}
                className="group flex items-center justify-between py-6 transition-colors hover:bg-zinc-50/50 px-2"
              >
                <span className="text-lg font-[350] tracking-tight text-zinc-800 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all">
                  {condition.title}
                </span>

                <span className="text-zinc-300 transition-all group-hover:text-red-600 font-light text-xl">
                  →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    )}

    {/* PROFESSIONNELS */}
{hasProfessionals && (
  <section className="bg-white text-zinc-900 py-24 border-b border-zinc-200/60">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mb-16 flex items-end justify-between border-b border-zinc-200 pb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">
            Humains & Experts
          </p>
          <h2 className="text-3xl font-[300] tracking-tight md:text-5xl">
            Notre équipe
          </h2>
        </div>

        <a
          href="/professionnels"
          className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 transition-colors duration-300 hover:text-red-600 sm:inline-flex"
        >
          Tout voir
        </a>
      </div>

      <div className="grid gap-px bg-zinc-200 border border-zinc-200 md:grid-cols-3">
        {professionals.docs.map((professional: any) => (
          <a
            key={professional.id}
            href={`/professionnels/${professional.slug}`}
            className="group relative bg-[#faf9f6] p-8 transition-all duration-300 hover:bg-white"
          >
            <div className="absolute left-0 top-0 h-[2px] w-0 bg-red-500 transition-all duration-300 group-hover:w-full" />

            <h3 className="text-xl font-[400] tracking-tight text-zinc-900 group-hover:text-red-600 transition-colors">
              {professional.name}
            </h3>

            <p className="mt-2 text-sm text-zinc-500 font-medium">
              {professional.title}
            </p>

            <div className="mt-12 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400 group-hover:text-zinc-900 transition-colors">
              <span>Voir le profil</span>
              <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                →
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
)}

    {/* ARTICLE DU JOUR */}
    {dailyPost && (
      <section className="bg-zinc-50/50 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div className="flex flex-col justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">Partage de connaissances</p>
              <h2 className="text-3xl font-[300] leading-tight tracking-tight text-zinc-900 md:text-5xl">
                Blogue santé
              </h2>
            </div>

            <a
              href="/blogue"
              className="mt-8 inline-flex border-b border-zinc-300 pb-1 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600 transition-all duration-300 hover:border-red-600 hover:text-red-600"
            >
              Voir les articles
            </a>
          </div>

          <a
            href={`/blogue/${dailyPost.slug}`}
            className="group grid overflow-hidden bg-white border border-zinc-200/80 transition-all duration-300 hover:border-red-200"
          >
            {dailyPostImageUrl ? (
              <div className="overflow-hidden h-64 md:h-full">
                <img
                  src={dailyPostImageUrl}
                  alt={dailyPost.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="h-64 bg-zinc-100 md:h-full" />
            )}

            <div className="flex flex-col justify-between p-8">
              <div>
                <span className="inline-flex items-center gap-2 border-l-2 border-red-600 pl-3 text-xs font-semibold uppercase tracking-[0.14em] text-red-700">
                  Article du jour
                </span>

                <h3 className="mt-6 text-2xl font-[350] leading-tight tracking-tight text-zinc-900 group-hover:text-red-600 transition-colors">
                  {dailyPost.title}
                </h3>
              </div>

              <span className="mt-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400 group-hover:text-zinc-900 transition-colors">
                Lire l'article <span>→</span>
              </span>
            </div>
          </a>
        </div>
      </section>
    )}
  </main>
)
}