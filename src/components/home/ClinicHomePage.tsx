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

  function FamilyIllustration() {
    return (
      <svg viewBox="0 0 360 320" className="h-auto w-full">
        <rect x="0" y="0" width="360" height="320" fill="transparent" />

        <circle cx="222" cy="150" r="105" fill="#fee2e2" />
        <rect x="32" y="230" width="300" height="2" fill="#18181b" opacity="0.15" />

        <g>
          <circle cx="142" cy="86" r="30" fill="#f3c7a7" />
          <path d="M108 90 C112 45 174 42 178 90 C158 72 132 74 108 90Z" fill="#2b1b14" />
          <rect x="105" y="118" width="75" height="96" fill="#18181b" />
          <path d="M105 138 C78 158 70 202 78 244" stroke="#18181b" strokeWidth="8" fill="none" />
          <path d="M180 138 C212 160 218 198 212 244" stroke="#18181b" strokeWidth="8" fill="none" />
        </g>

        <g>
          <circle cx="230" cy="92" r="28" fill="#f3c7a7" />
          <path d="M203 92 C204 56 250 48 262 86 C246 76 224 78 203 92Z" fill="#6b2f1a" />
          <rect x="197" y="122" width="72" height="98" fill="#dc2626" />
          <path d="M197 146 C170 168 166 208 172 246" stroke="#dc2626" strokeWidth="8" fill="none" />
        </g>

        <g>
          <circle cx="126" cy="176" r="22" fill="#f3c7a7" />
          <path d="M104 176 C106 148 146 150 150 176 C136 166 118 166 104 176Z" fill="#2b1b14" />
          <rect x="100" y="202" width="55" height="64" fill="#fff7ed" stroke="#18181b" strokeWidth="1" />
        </g>

        <g>
          <circle cx="220" cy="186" r="21" fill="#f3c7a7" />
          <path d="M199 186 C202 156 240 158 244 186 C232 176 214 176 199 186Z" fill="#6b2f1a" />
          <rect x="195" y="212" width="55" height="60" fill="#fee2e2" stroke="#dc2626" strokeWidth="1" />
        </g>

        <path d="M302 78 H336 M319 61 V95" stroke="#dc2626" strokeWidth="2" />
        <path d="M24 86 H76" stroke="#18181b" strokeWidth="2" />
        <path d="M42 62 V110" stroke="#18181b" strokeWidth="2" />
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

   return (
    <main className="bg-white text-zinc-950 selection:bg-red-50 selection:text-red-800">
      {/* HERO */}
        <section className="relative min-h-[820px] overflow-hidden">
        {homeHeroImageUrl ? (
          <img
            src={homeHeroImageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}

        {/* voile beige, opaque à gauche, fondu vers le centre */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#f6f1e8_0%,#f6f1e8_28%,rgba(246,241,232,0.92)_38%,rgba(246,241,232,0.65)_48%,rgba(246,241,232,0.18)_58%,rgba(246,241,232,0)_68%)]" />

        <div className="relative mx-auto flex min-h-[820px] max-w-7xl items-center px-6 lg:px-8">
          <div className="w-full pt-36 lg:pt-16">
            <div className="max-w-[560px]">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-red-600">
                  Soins manuels · corps en mouvement
              </p>

              <h1 className="mt-8 text-left font-serif text-[4.4rem] leading-[0.95] tracking-[-0.03em] text-zinc-950 lg:text-[5.4rem]">
                CHIROPRATIQUE
                <br />
                <span className="text-red-700">ST-ROCH</span>
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
                    strokeWidth="1.0"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute right-[3.5%] top-4/10 hidden -translate-y-1/2 lg:block">
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
        <section className="border-b border-zinc-200 bg-[#faf9f6]">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[0.62fr_1.38fr] lg:px-8">
            <div className="flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center gap-4">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-red-700">
                    Services
                  </p>
                  <span className="h-px w-16 bg-zinc-300" />
                </div>

                <h2 className="max-w-md text-4xl font-black leading-[1.02] tracking-[-0.045em] text-zinc-950 md:text-6xl">
                  Des approches complémentaires, centrées sur vous.
                </h2>

                <div className="mt-6 h-[3px] w-16 bg-red-700" />
              </div>

              <div className="mt-14 max-w-[340px]">
                <FamilyIllustration />
              </div>
            </div>

            <div className="grid border-l border-t border-zinc-300 bg-white md:grid-cols-3">
              {services.docs.slice(0, 5).map((service: any, index: number) => (
                <a
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className={`group relative min-h-[260px] overflow-hidden border-b border-r border-zinc-300 bg-white p-7 transition hover:bg-[#fff7f2] ${
                    index >= 3 ? 'lg:translate-y-10' : ''
                  }`}
                >
                  <p className="text-4xl font-[300] leading-none text-red-700">
                    {String(index + 1).padStart(2, '0')}
                  </p>

                  <h3 className="mt-7 text-sm font-black uppercase tracking-[0.1em] text-zinc-950">
                    {service.title}
                  </h3>

                  <p className="mt-5 max-w-[210px] text-sm leading-6 text-zinc-600">
                    {service.shortDescription}
                  </p>

                  <div className="absolute bottom-6 right-6 opacity-70 transition group-hover:opacity-100">
                    <ServiceLineIcon index={index} />
                  </div>

                  <span className="absolute bottom-7 left-7 text-xl text-red-700 transition group-hover:translate-x-1">
                    →
                  </span>
                </a>
              ))}

              <a
                href="/services"
                className="group relative min-h-[260px] border-b border-r border-zinc-300 bg-[#faf9f6] p-7 transition hover:bg-white lg:translate-y-10"
              >
                <div className="absolute right-0 top-0 h-24 w-36 bg-[radial-gradient(circle,rgba(220,38,38,0.32)_1.5px,transparent_1.5px)] bg-[length:8px_8px]" />

                <div className="absolute bottom-7 left-7">
                  <p className="max-w-[180px] text-sm font-black uppercase leading-5 tracking-[0.12em] text-red-700">
                    Découvrir nos services
                  </p>
                  <span className="mt-4 inline-flex text-2xl text-red-700 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </a>
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

              <h2 className="text-4xl font-black leading-[1.04] tracking-[-0.045em] text-zinc-950 md:text-6xl">
                Des solutions pour ce qui vous limite.
              </h2>

              <div className="mt-6 h-[3px] w-16 bg-red-700" />
            </div>

            <div className="mt-14 grid max-w-4xl border-l border-zinc-300 md:grid-cols-5">
              {conditions.docs.slice(0, 5).map((condition: any, index: number) => (
                <div
                  key={condition.id}
                  className="border-r border-zinc-300 px-5 py-4"
                >
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

              <h2 className="text-4xl font-black leading-[1.04] tracking-[-0.045em] text-zinc-950 md:text-6xl">
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
                      <p className="mt-1 text-sm text-zinc-500">
                        {professional.title}
                      </p>
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

              <h2 className="text-4xl font-black leading-[1.04] tracking-[-0.045em] text-zinc-950 md:text-6xl">
                Mieux comprendre votre santé musculosquelettique.
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
              className="group relative min-h-[360px] overflow-hidden border border-zinc-300 bg-zinc-950"
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

              <div className="relative flex min-h-[360px] max-w-md flex-col justify-between p-8 text-white">
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