import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'

const FALLBACK_JANE_URL = 'https://chiropratiquestroch.janeapp.com/embed/book_online'

const SERVICE_ORDER = [
  'chiropratique',
  'osteopathie',
  'massotherapie',
  'kinesitherapie',
  'orthotherapie',
]


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

function ServiceIconBadge({ slug }: { slug: string }) {
  const imageIcons: Record<string, string> = {
    chiropratique: '/media/chiropratique-icon.png',
    osteopathie: '/media/osteopathie-icon.png',
    massotherapie: '/media/massotherapie-icon.png',
    kinesitherapie: '/media/kinesitherapie-icon.png',
    orthotherapie: '/media/orthotherapie-icon.png',
  }

  const imageSrc = imageIcons[slug]

  return (
    <div className="relative h-32 w-40 shrink-0 overflow-hidden text-zinc-900">
      <div className="absolute inset-0 bg-[#ece5dc] [border-radius:52%_48%_55%_45%/46%_58%_42%_54%]" />

      <div className="absolute inset-0 flex items-center justify-center">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt=""
            className="relative z-10 h-[118px] w-[135px] object-contain"
          />
        ) : (
          renderServiceIcon(slug)
        )}
      </div>
    </div>
  )
}

function ServiceTitle({ title }: { title: string }) {
  const firstLetter = title.slice(0, 1)
  const rest = title.slice(1)

  return (
    <h3 className="font-[var(--font-barlow-condensed)] text-[2rem] font-semibold uppercase leading-none tracking-[0.06em] text-zinc-950">
      <span className="text-red-600">{firstLetter}</span>
      {rest}
    </h3>
  )
}

function renderServiceIcon(slug: string) {
  switch (slug) {

    default:
      return null
  }
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

  const orderedServices = SERVICE_ORDER.map((slug) =>
    services.docs.find((service: any) => service.slug === slug),
  ).filter(Boolean) as any[]

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
    <main className="bg-white text-zinc-950 selection:bg-red-50 selection:text-red-800">
      {/* HERO */}
      <section className="relative min-h-[820px] overflow-hidden">
        {homeHeroImageUrl ? (
          <img src={homeHeroImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : null}

        {/* voile beige, opaque à gauche, fondu vers le centre */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#f6f1e8_0%,#f6f1e8_28%,rgba(246,241,232,0.92)_38%,rgba(246,241,232,0.65)_48%,rgba(246,241,232,0.18)_58%,rgba(246,241,232,0)_68%)]" />

        <div className="relative flex min-h-[820px] items-center px-6 lg:px-8 xl:px-12 min-[1600px]:px-20 min-[1800px]:px-28">
          <div className="w-full pt-36 lg:pt-16">
            <div className="max-w-[560px]">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-red-600">
                Soins manuels · corps en mouvement
              </p>

              <h1 className="mt-8 max-w-[620px] text-left font-[var(--font-barlow-condensed)] text-[3.9rem] font-medium uppercase leading-[0.86] tracking-[0.01em] text-zinc-950 sm:text-[4.7rem] lg:text-[5.5rem] lg:tracking-[0.02em]">
                Chiropratique
                <span className="block text-red-700">St-Roch</span>
              </h1>

              <div className="mt-8 h-[2px] w-14 bg-red-600" />

              <p className="mt-7 max-w-[420px] text-left text-[1.1rem] leading-8 text-zinc-800">
                Une approche attentive, simple et adaptée à votre réalité.
              </p>

              <a
                href={janeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-5 inline-flex min-h-[50px] items-center gap-4 border border-red-600 px-6 text-[11px] font-bold uppercase tracking-[0.16em] text-red-700 transition hover:bg-red-700 hover:text-white"
              >
                <span>Prendre rendez-vous</span>

                <svg
                  aria-hidden="true"
                  viewBox="0 0 44 10"
                  className="h-3 w-9 transition-transform duration-200 group-hover:translate-x-1"
                >
                  <path
                    d="M1 5H40M35 1L40 5L35 9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.0"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute right-6 top-4/10 hidden -translate-y-1/2 lg:right-8 lg:block xl:right-12 min-[1600px]:right-20 min-[1800px]:right-28">
          <p className="text-right text-[40px] font-semibold uppercase leading-[1.15] tracking-[0.08em] text-zinc-950">
            Bougez
            <br />
            mieux.
            <br />
            Vivez
            <br />
            mieux.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      {hasServices && (
        <section className="border-b border-zinc-200 bg-[#f5f3ee]">
          <div className="px-6 py-24 lg:px-8 xl:px-12 min-[1600px]:px-20 min-[1800px]:px-28">
            <div className="grid items-stretch gap-12 xl:grid-cols-[0.9fr_1.6fr] xl:gap-16">
              {/* COLONNE GAUCHE */}
              <div className="flex h-full max-w-[560px] flex-col">
                <div>
                  <p className="font-[var(--font-barlow-condensed)] text-[18px] font-medium uppercase tracking-[0.24em] text-red-600">
                    Services
                  </p>

                  <h2 className="mt-6 max-w-[520px] text-[3rem] font-normal leading-[1] tracking-[-0.03em] text-zinc-950 md:text-[4.0rem]">
                    Des approches complémentaires, centrées sur vous.
                  </h2>

                  <div className="mt-8 h-[3px] w-20 bg-red-600" />
                </div>

                {/* IMAGE FAMILLE */}
                <div className="mt-auto pt-12">
                  <img
                    src="/media/services-family.png"
                    alt="Famille illustrée"
                    className="w-full max-w-[560px] object-contain"
                  />
                </div>
              </div>

              {/* COLONNE DROITE */}
                <div className="flex flex-col">
                  {/* RANGÉE 01-02-03 */}
                  <div className="grid border-l border-t border-zinc-400 md:grid-cols-2 xl:grid-cols-3">
                    {orderedServices.slice(0, 3).map((service: any, index: number) => {
                      return (
                        <Link
                          key={service.id}
                          href={`/services/${service.slug}`}
                          className="group relative flex min-h-[400px] flex-col border-b border-r border-zinc-400 bg-[#f8f6f1] px-8 py-8 transition duration-300 hover:bg-white"
                        >
                          

                           <div>
                            <ServiceTitle title={service.title} />

                            <p className="mt-7 max-w-[300px] text-[1.05rem] leading-[1.7] text-zinc-700">
                              {service.shortDescription}
                            </p>
                          </div>

                          <div className="absolute right-8 top-[240px] z-10">
                            <ServiceIconBadge slug={service.slug} />
                          </div>
                        </Link>
                      )
                    })}
                  </div>

                  {/* RANGÉE 04-05-06 */}
                    <div className="grid md:grid-cols-2 xl:grid-cols-[1.08fr_1.08fr_0.84fr]">
                      {orderedServices.slice(3, 5).map((service: any, index: number) => {
                        const serviceIndex = index + 3
                        const isFourth = index === 0

                        return (
                          <Link
                            key={service.id}
                            href={`/services/${service.slug}`}
                            className={`group relative flex min-h-[400px] flex-col px-8 py-8 transition duration-300 ${
                              isFourth
                                ? 'bg-transparent'
                                : 'border-b border-r border-zinc-400 bg-[#f8f6f1] hover:bg-white'
                            }`}
                          >
                            {isFourth && (
                              <>
                                {/* FOND DÉCOUPÉ DE LA CASE 04 */}
                                <div
                                  className="absolute inset-0 bg-[#f8f6f1] transition duration-300 group-hover:bg-white"
                                  style={{
                                    clipPath:
                                      'polygon(0 0, 100% 0, 100% 100%, 120px 100%, 120px calc(100% - 40px), 80px calc(100% - 40px), 80px calc(100% - 80px), 40px calc(100% - 80px), 40px calc(100% - 120px), 0 calc(100% - 120px))',
                                  }}
                                />

                                {/* CONTOUR NORMAL DE LA CASE 04 */}

                                <span className="pointer-events-none absolute right-0 top-0 h-full w-px bg-zinc-400" />
                                <span className="pointer-events-none absolute bottom-0 left-[120px] right-0 h-px bg-zinc-400" />
                                <span className="pointer-events-none absolute left-0 top-0 bottom-[120px] w-px bg-zinc-400" />

                                {/* CONTOUR DE L’ESCALIER — 3 MARCHES PLUS HAUTES */}
                                <span className="pointer-events-none absolute bottom-[120px] left-0 h-px w-[40px] bg-zinc-400" />
                                <span className="pointer-events-none absolute bottom-[80px] left-[40px] h-[40px] w-px bg-zinc-400" />

                                <span className="pointer-events-none absolute bottom-[80px] left-[40px] h-px w-[40px] bg-zinc-400" />
                                <span className="pointer-events-none absolute bottom-[40px] left-[80px] h-[40px] w-px bg-zinc-400" />

                                <span className="pointer-events-none absolute bottom-[40px] left-[80px] h-px w-[40px] bg-zinc-400" />
                                <span className="pointer-events-none absolute bottom-0 left-[120px] h-[40px] w-px bg-zinc-400" />
                              </>
                            )}

                            <div className="relative z-10">
                              <ServiceTitle title={service.title} />

                              <p className="mt-7 max-w-[300px] text-[1.05rem] leading-[1.7] text-zinc-700">
                                {service.shortDescription}
                              </p>
                            </div>

                            <div className="absolute right-8 top-[240px] z-10">
                              <ServiceIconBadge slug={service.slug} />
                            </div>
                          </Link>
                        )
                      })}

                      {/* CASE 06 */}
                      <Link
                        href="/services"
                        className="group relative flex min-h-[400px] flex-col justify-between border-r border-b border-zinc-400 bg-[#f8f6f1] px-8 py-8 transition duration-300 hover:bg-white"
                      >
                        <div>

                          <div className="mt-8 h-16 w-28 bg-[radial-gradient(circle,_rgba(220,38,38,0.45)_1px,_transparent_1px)] [background-size:10px_10px]" />

                          <h3 className="mt-12 max-w-[220px] font-[var(--font-barlow-condensed)] text-[2.2rem] font-medium uppercase leading-[1.05] tracking-[-0.02em] text-red-600">
                            Découvrir nos services
                          </h3>
                        </div>

                        <div className="mt-8 text-red-600">
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 120 18"
                            className="h-5 w-24 overflow-visible transition-[width] duration-300 ease-out group-hover:w-32"
                          >
                            <path
                              d="M1 9H112M100 2L112 9L100 16"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="square"
                              strokeLinejoin="miter"
                            />
                          </svg>
                        </div>
                      </Link>
                    </div>
            </div>
           </div> 
          </div>
        </section>
      )}

      {/* CONDITIONS */}
      {hasConditions && (
        <section className="relative overflow-hidden border-b border-zinc-200 bg-white">
          <div className="absolute bottom-0 right-0 hidden h-[62%] w-[58%] lg:block">
            <QuebecLowerTownIllustration />
          </div>

          <div className="absolute bottom-0 right-0 hidden h-[62%] w-[58%] bg-[linear-gradient(90deg,#ffffff_0%,rgba(255,255,255,0.92)_28%,rgba(255,255,255,0.2)_55%,rgba(255,255,255,0)_100%)] lg:block" />

          <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <div className="max-w-xl">
              <div className="mb-4 flex items-center gap-4">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-red-700">
                  Conditions traitées
                </p>
                <span className="h-px w-16 bg-zinc-300" />
              </div>

              <h2 className="font-[var(--font-barlow-condensed)] text-[3rem] font-medium uppercase leading-[1.0] tracking-[0.02em] text-zinc-950">
                Des solutions pour ce qui vous limite.
              </h2>

              <div className="mt-6 h-[3px] w-16 bg-red-700" />
            </div>

            <div className="mt-14 grid max-w-4xl border-l border-zinc-300 md:grid-cols-5">
              {conditions.docs.slice(0, 5).map((condition: any, index: number) => (
                <div key={condition.id} className="border-r border-zinc-300 px-5 py-4">
                  <div className="mb-5 h-12 w-12">
                    <ServiceLineIcon index={index} />
                  </div>

                  <p className="text-sm font-semibold leading-5 text-zinc-900">
                    {condition.title}
                  </p>
                </div>
              ))}
            </div>

            <a
              href="/conditions-traitees"
              className="mt-12 inline-flex border-b border-zinc-400 pb-1 text-xs font-black uppercase tracking-[0.16em] text-red-700 transition hover:border-red-700"
            >
              Voir toutes les conditions →
            </a>
          </div>
        </section>
      )}

      {/* PROFESSIONNELS */}
      {hasProfessionals && (
        <section className="border-b border-zinc-200 bg-[#faf9f6]">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[0.58fr_1.42fr] lg:px-8">
            <div>
              <div className="mb-4 flex items-center gap-4">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-red-700">
                  Professionnels
                </p>
                <span className="h-px w-16 bg-zinc-300" />
              </div>

              <h2 className="font-[var(--font-barlow-condensed)] text-[3rem] font-medium uppercase leading-[1.0] tracking-[0.02em] text-zinc-950">
                Une équipe à votre écoute.
              </h2>

              <div className="mt-6 h-[3px] w-16 bg-red-700" />

              <p className="mt-8 max-w-sm text-sm leading-6 text-zinc-600">
                Des professionnels accessibles pour vous accompagner avec clarté, respect et simplicité.
              </p>

              <a
                href="/professionnels"
                className="mt-8 inline-flex border-b border-zinc-400 pb-1 text-xs font-black uppercase tracking-[0.16em] text-red-700 transition hover:border-red-700"
              >
                Rencontrer l’équipe →
              </a>
            </div>

            <div className="grid gap-px bg-zinc-300 md:grid-cols-3">
              {professionals.docs.slice(0, 3).map((professional: any) => {
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
                    className="group bg-white"
                  >
                    <div className="relative aspect-[4/4.7] overflow-hidden bg-zinc-100">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={professional.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
                          Photo
                        </div>
                      )}

                      <div className="absolute right-0 top-0 h-12 w-12 bg-red-700 opacity-0 transition group-hover:opacity-100" />
                    </div>

                    <div className="border-t border-zinc-200 p-5">
                      <h3 className="font-bold tracking-[-0.02em] text-zinc-950">
                        {professional.name}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-500">{professional.title}</p>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* BLOGUE */}
      {dailyPost && (
        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <div className="mb-4 flex items-center gap-4">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-red-700">
                  Blogue santé
                </p>
                <span className="h-px w-16 bg-zinc-300" />
              </div>

              <h2 className="font-[var(--font-barlow-condensed)] text-[3rem] font-medium uppercase leading-[1.0] tracking-[0.02em] text-zinc-950">
                Conditions typiques simplifiées.
              </h2>

              <div className="mt-6 h-[3px] w-16 bg-red-700" />

              <a
                href="/blogue"
                className="mt-8 inline-flex border-b border-zinc-400 pb-1 text-xs font-black uppercase tracking-[0.16em] text-red-700 transition hover:border-red-700"
              >
                Voir les articles →
              </a>
            </div>

            <a
              href={`/blogue/${dailyPost.slug}`}
              className="group relative min-h-[280px] overflow-hidden border border-zinc-300 bg-zinc-950"
            >
              {dailyPostImageUrl ? (
                <img
                  src={dailyPostImageUrl}
                  alt={dailyPost.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-82 transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-[#f6e6dd]" />
              )}

              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.24)_58%,rgba(0,0,0,0.04)_100%)]" />

              <div className="relative flex min-h-[280px] max-w-md flex-col justify-between p-8 text-white">
                <span className="inline-flex border-l-2 border-red-500 pl-3 text-xs font-black uppercase tracking-[0.16em] text-red-300">
                  Article du jour
                </span>

                <div>
                  <h3 className="text-4xl font-black leading-[1.02] tracking-[-0.045em]">
                    {dailyPost.title}
                  </h3>

                  <span className="mt-8 inline-flex text-xs font-black uppercase tracking-[0.16em] text-white/70 transition group-hover:text-white">
                    Lire l’article →
                  </span>
                </div>
              </div>
            </a>
          </div>
        </section>
      )}
    </main>
  )
}

function ServiceLineIcon({ index }: { index: number }) {
  const common = 'stroke-zinc-900/70'
  const red = 'stroke-red-600'

  if (index === 0) {
    return (
      <svg viewBox="0 0 120 120" className="h-24 w-24 fill-none stroke-[1.5]">
        <path className={common} d="M66 12 C46 28 78 38 55 54 C36 68 75 78 52 104" />
        <path className={red} d="M72 20 L82 30 M61 42 L74 50 M57 66 L70 73 M55 89 L68 96" />
      </svg>
    )
  }

  if (index === 1) {
    return (
      <svg viewBox="0 0 120 120" className="h-24 w-24 fill-none stroke-[1.5]">
        <path className={common} d="M18 78 C42 48 78 48 102 78" />
        <path className={red} d="M35 72 C45 62 55 62 65 72" />
        <path className={common} d="M72 74 L96 50" />
      </svg>
    )
  }

  if (index === 2) {
    return (
      <svg viewBox="0 0 120 120" className="h-24 w-24 fill-none stroke-[1.5]">
        <path className={common} d="M14 48 C28 36 42 60 56 48 C70 36 84 60 106 46" />
        <path className={common} d="M14 64 C28 52 42 76 56 64 C70 52 84 76 106 62" />
        <path className={red} d="M20 82 H100" />
      </svg>
    )
  }

  if (index === 3) {
    return (
      <svg viewBox="0 0 120 120" className="h-24 w-24 fill-none stroke-[1.5]">
        <path className={common} d="M24 92 H42 V74 H60 V56 H78 V38 H96" />
        <path className={red} d="M28 30 L52 54" />
        <path className={red} d="M52 30 L28 54" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24 fill-none stroke-[1.5]">
      <circle className={common} cx="60" cy="24" r="12" />
      <path className={common} d="M60 38 V78" />
      <path className={common} d="M42 54 H78" />
      <path className={common} d="M48 106 L60 78 L72 106" />
      <path className={red} d="M34 76 C46 66 74 66 86 76" />
    </svg>
  )
}

function QuebecLowerTownIllustration() {
  return (
    <svg viewBox="0 0 760 300" className="h-full w-full">
      <rect width="760" height="300" fill="transparent" />

      <defs>
        <linearGradient id="lowerTownFade" x1="0" x2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="430" height="300" fill="url(#lowerTownFade)" />

      <g fill="none" stroke="#18181b" strokeWidth="1.4" opacity="0.55">
        <path d="M330 250 V105 L420 68 L505 104 V250" />
        <path d="M420 68 V250" />
        <path d="M360 132 H396 M360 162 H396 M360 192 H396" />
        <path d="M444 132 H480 M444 162 H480 M444 192 H480" />

        <path d="M512 250 V84 L640 42 L725 86 V250" />
        <path d="M548 118 H584 M548 152 H584 M548 186 H584" />
        <path d="M620 118 H670 M620 152 H670 M620 186 H670" />

        <path d="M210 250 V140 L300 112 V250" />
        <path d="M236 164 H274 M236 196 H274" />

        <path d="M92 250 C108 220 142 220 158 250" />
        <path d="M125 222 V175" />
        <path d="M112 190 C122 176 138 176 148 190" />
      </g>

      <rect x="520" y="92" width="92" height="158" fill="#dc2626" opacity="0.9" />
      <g fill="#ffffff" opacity="0.9">
        <rect x="542" y="120" width="18" height="28" />
        <rect x="575" y="120" width="18" height="28" />
        <rect x="542" y="168" width="18" height="28" />
        <rect x="575" y="168" width="18" height="28" />
      </g>

      <path
        d="M300 250 C360 206 420 210 476 250"
        stroke="#dc2626"
        strokeWidth="2"
        fill="none"
        opacity="0.9"
      />

      <g stroke="#18181b" strokeWidth="1" opacity="0.35">
        <path d="M48 250 C58 222 78 222 88 250" />
        <path d="M68 224 V196" />
        <path d="M650 250 C664 222 690 222 704 250" />
        <path d="M678 224 V192" />
      </g>
    </svg>
  )
}
