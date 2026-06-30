import configPromise from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const FALLBACK_JANE_URL = 'https://chiropratiquestroch.janeapp.com/embed/book_online'

const SERVICE_ORDER = [
  'chiropratique',
  'osteopathie',
  'massotherapie',
  'kinesitherapie',
  'orthotherapie',
]


const SERVICE_COLORS: Record<string, string> = {
  chiropratique: '#0c1f3f',
  osteopathie:   '#082a1a',
  massotherapie: '#3a0d0d',
  kinesitherapie:'#261600',
  orthotherapie: '#170b36',
}

function buildPostGradient(relatedServices: any[]): string {
  const colors: string[] = []
  for (const svc of relatedServices) {
    const slug = typeof svc === 'object' ? (svc.slug ?? '') : String(svc)
    const color = SERVICE_COLORS[slug]
    if (color && !colors.includes(color)) colors.push(color)
  }

  if (colors.length === 0) return 'linear-gradient(135deg, #18181b 0%, #27272a 100%)'
  if (colors.length === 1) return `linear-gradient(135deg, ${colors[0]} 0%, #18181b 100%)`
  const stops = colors.map((c, i) => `${c} ${Math.round((i * 100) / (colors.length - 1))}%`).join(', ')
  return `linear-gradient(135deg, ${stops})`
}

function formatDateFR(dateStr: string) {
  return new Intl.DateTimeFormat('fr-CA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Toronto',
  }).format(new Date(dateStr))
}

function getPeriodicIndex(length: number, periodDays: number) {
  if (length <= 0) return 0
  const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
  const period = Math.floor(daysSinceEpoch / periodDays)
  return period % length
}

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
    <div className="relative h-16 w-20 shrink-0 overflow-hidden text-zinc-900">
      <div className="absolute inset-0 bg-[#ece5dc] [border-radius:52%_48%_55%_45%/46%_58%_42%_54%]" />

      <div className="absolute inset-0 flex items-center justify-center">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt=""
            width={72}
            height={60}
            className="relative z-10 h-[60px] w-[72px] object-contain"
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
    <h3 className="font-[var(--font-barlow-condensed)] text-[1.2rem] font-semibold uppercase leading-[1.15] tracking-[0.05em] text-zinc-950">
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

function SectionAccent({ className }: { className?: string }) {
  return <div className={`h-[3px] w-20 bg-red-600 ${className ?? ''}`} />
}


function ConditionAccent({ index }: { index: number }) {
  const configs = [
    { count: 1, angle: 0 },
    { count: 2, angle: 22.5 },
    { count: 3, angle: 45 },
    { count: 4, angle: 67.5 },
    { count: 5, angle: 90 },
  ]
  const colorPatterns: boolean[][] = [
    [true],
    [false, true],
    [true, false, true],
    [false, true, false, true],
    [true, false, true, false, true],
  ]
  const { count, angle } = configs[index % configs.length]
  const colors = colorPatterns[index % colorPatterns.length]
  const cx = 22
  const cy = 17
  const halfLen = 13
  const gap = 7
  const startY = cy - ((count - 1) * gap) / 2

  return (
    <div className="h-[34px]">
      <svg width="44" height="34" viewBox="0 0 44 34" fill="none">
        <g transform={`rotate(${angle}, ${cx}, ${cy})`}>
          {Array.from({ length: count }).map((_, i) => (
            <line
              key={i}
              x1={cx - halfLen}
              y1={startY + i * gap}
              x2={cx + halfLen}
              y2={startY + i * gap}
              stroke={colors[i] ? '#dc2626' : '#18181b'}
              strokeWidth="2"
            />
          ))}
        </g>
      </svg>
    </div>
  )
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

  const homeHeroImageUrl =
    siteSettings &&
    typeof siteSettings === 'object' &&
    'homeHeroImage' in siteSettings &&
    siteSettings.homeHeroImage &&
    typeof siteSettings.homeHeroImage === 'object' &&
    'url' in siteSettings.homeHeroImage
      ? siteSettings.homeHeroImage.url
      : null

  const conditionsSectionImageUrl =
    siteSettings &&
    typeof siteSettings === 'object' &&
    'conditionsSectionImage' in siteSettings &&
    (siteSettings as any).conditionsSectionImage &&
    typeof (siteSettings as any).conditionsSectionImage === 'object' &&
    'url' in (siteSettings as any).conditionsSectionImage
      ? (siteSettings as any).conditionsSectionImage.url
      : null

  return (
    <main className="bg-white text-zinc-950 selection:bg-red-50 selection:text-red-800">
      {/* HERO */}
      <section className="bg-[#f6f1e8]">
        <div className="relative mx-auto flex min-h-[820px] max-w-[1200px] items-center overflow-hidden px-6 pt-36 lg:px-8 lg:pt-16">

          {/* Image côté droit dans le 1200px */}
          {homeHeroImageUrl && (
            <div className="absolute inset-y-0 left-0 right-6 lg:right-8">
              <Image src={homeHeroImageUrl} alt="" fill priority sizes="1200px" className="object-contain object-right-bottom" />
            </div>
          )}

          {/* Voile beige gauche */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#f6f1e8_0%,#f6f1e8_28%,rgba(246,241,232,0.92)_38%,rgba(246,241,232,0.65)_48%,rgba(246,241,232,0.18)_58%,rgba(246,241,232,0)_68%)]" />

          {/* Contenu */}
          <div className="relative w-full">
            <div className="max-w-[560px]">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-red-600">
                Soins manuels · corps en mouvement
              </p>

              <h1 className="mt-8 max-w-[620px] text-left font-[var(--font-barlow-condensed)] text-[clamp(2.2rem,8vw,5.5rem)] font-medium uppercase leading-[1.0] tracking-[0.01em] text-zinc-950 xl:tracking-[0.02em]">
                Chiropratique
                <span className="block text-red-600">St-Roch</span>
              </h1>

              <SectionAccent className="mt-8" />

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

            <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block lg:right-0 xl:right-4">
              <p className="text-right text-[40px] font-semibold uppercase leading-[1.15] tracking-[0.08em] text-zinc-950">
                Bougez
                <br />
                Mieux.
                <br />
                Vivez
                <br />
                Mieux.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      {hasServices && (
        <section className="relative z-10 -mt-4 bg-white lg:sticky lg:top-0 shadow-[0_-12px_32px_rgba(0,0,0,0.14)]">
          <ScrollReveal>
          <div className="mx-auto max-w-[1200px] px-6 py-24 lg:px-8">
            <div className="grid items-stretch gap-12 xl:grid-cols-[320px_1fr] xl:gap-16">
              {/* COLONNE GAUCHE */}
              <div className="flex h-full flex-col">
                <div>
                  <p className="font-[var(--font-barlow-condensed)] text-[18px] font-medium uppercase tracking-[0.24em] text-red-600">
                    Services
                  </p>

                  <h2 className="mt-6 text-[3rem] font-normal leading-[1] tracking-[-0.03em] text-zinc-950 md:text-[3rem]">
                    Des approches complémentaires, centrées sur vous.
                  </h2>

                  <SectionAccent className="mt-8" />
                </div>

                {/* IMAGE FAMILLE */}
                <div className="mt-auto pt-12">
                  <Image
                    src="/media/services-family.png"
                    alt="Famille illustrée"
                    width={560}
                    height={420}
                    className="w-full object-contain"
                    style={{ height: 'auto' }}
                  />
                </div>
              </div>

              {/* COLONNE DROITE */}
                <div className="flex flex-col">
                  {/* RANGÉE 01-02-03 */}
                  <div className="grid border-l border-t border-zinc-400 md:grid-cols-3 xl:grid-cols-3">
                    {orderedServices.slice(0, 3).map((service: any, index: number) => {
                      return (
                        <Link
                          key={service.id}
                          href={`/services/${service.slug}`}
                          className="group flex min-h-[300px] min-w-0 flex-col overflow-hidden border-b border-r border-zinc-400 bg-[#f8f6f1] px-5 py-6 transition duration-300 hover:bg-white"
                        >
                          <ServiceTitle title={service.title} />

                          <p className="mt-3 flex-1 text-[0.9rem] leading-[1.6] text-zinc-700">
                            {service.shortDescription}
                          </p>

                          <div className="-mt-10 flex justify-end">
                            <ServiceIconBadge slug={service.slug} />
                          </div>
                        </Link>
                      )
                    })}
                  </div>

                  {/* RANGÉE 04-05-06 */}
                    <div className="grid border-l border-zinc-400 xl:border-l-0 md:grid-cols-3 xl:grid-cols-[1.08fr_1.08fr_0.84fr]">
                      {orderedServices.slice(3, 5).map((service: any, index: number) => {
                        const serviceIndex = index + 3
                        const isFourth = index === 0

                        return (
                          <Link
                            key={service.id}
                            href={`/services/${service.slug}`}
                            className={`group relative flex min-h-[300px] min-w-0 flex-col overflow-hidden px-5 py-6 transition duration-300 ${
                              isFourth
                                ? 'border-b border-r border-zinc-400 bg-transparent xl:border-b-0 xl:border-r-0'
                                : 'border-b border-r border-zinc-400 bg-[#f8f6f1] hover:bg-white'
                            }`}
                          >
                            {isFourth && (
                              <>
                                {/* FOND MOBILE — fond plein, pas d'escalier */}
                                <div className="absolute inset-0 bg-[#f8f6f1] transition duration-300 group-hover:bg-white xl:hidden" />

                                {/* FOND DÉCOUPÉ DE LA CASE 04 — desktop xl seulement */}
                                <div
                                  className="hidden xl:block absolute inset-0 bg-[#f8f6f1] transition duration-300 group-hover:bg-white"
                                  style={{
                                    clipPath: [
                                      "polygon(",
                                      "0 0, 100% 0, 100% 100%,",
                                      "90px 100%, 90px calc(100% - 30px),",
                                      "60px calc(100% - 30px), 60px calc(100% - 60px),",
                                      "30px calc(100% - 60px), 30px calc(100% - 90px),",
                                      "0 calc(100% - 90px))",
                                    ].join(" "),
                                  }}
                                />

                                {/* CONTOUR NORMAL DE LA CASE 04 — desktop xl seulement */}
                                <span className="pointer-events-none absolute right-0 top-0 h-full w-px bg-zinc-400 hidden xl:block" />
                                <span className="pointer-events-none absolute bottom-0 left-[90px] right-0 h-px bg-zinc-400 hidden xl:block" />
                                <span className="pointer-events-none absolute left-0 top-0 bottom-[90px] w-px bg-zinc-400 hidden xl:block" />

                                {/* CONTOUR DE L'ESCALIER — 3 MARCHES — desktop xl seulement */}
                                <span className="pointer-events-none absolute bottom-[90px] left-0 h-px w-[30px] bg-zinc-400 hidden xl:block" />
                                <span className="pointer-events-none absolute bottom-[60px] left-[30px] h-[30px] w-px bg-zinc-400 hidden xl:block" />

                                <span className="pointer-events-none absolute bottom-[60px] left-[30px] h-px w-[30px] bg-zinc-400 hidden xl:block" />
                                <span className="pointer-events-none absolute bottom-[30px] left-[60px] h-[30px] w-px bg-zinc-400 hidden xl:block" />

                                <span className="pointer-events-none absolute bottom-[30px] left-[60px] h-px w-[30px] bg-zinc-400 hidden xl:block" />
                                <span className="pointer-events-none absolute bottom-0 left-[90px] h-[30px] w-px bg-zinc-400 hidden xl:block" />
                              </>
                            )}

                            <div className="relative z-10 flex flex-1 flex-col">
                              <ServiceTitle title={service.title} />

                              <p className="mt-3 flex-1 text-[0.9rem] leading-[1.6] text-zinc-700">
                                {service.shortDescription}
                              </p>

                              <div className="-mt-10 flex justify-end">
                                <ServiceIconBadge slug={service.slug} />
                              </div>
                            </div>
                          </Link>
                        )
                      })}

                      {/* CASE 06 */}
                      <Link
                        href="/services"
                        className="group relative flex min-h-[300px] min-w-0 flex-col justify-between border-r border-b border-zinc-400 px-5 py-6 transition duration-300"
                      >
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(220,38,38,0.06)_0px,rgba(220,38,38,0.06)_1.5px,transparent_1.5px,transparent_10px)] transition duration-300 group-hover:opacity-30" />

                        <div className="relative">
                          <h3 className="font-[var(--font-barlow-condensed)] text-[1.8rem] font-medium uppercase leading-[1.05] tracking-[-0.02em] text-red-600">
                            Découvrir nos services
                          </h3>
                        </div>

                        <div className="relative mt-4 text-red-600">
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
          </ScrollReveal>
        </section>
      )}

      {/* CONDITIONS */}
      {hasConditions && (
        <section className="relative z-20 -mt-4 bg-[#f6f1e8] lg:sticky lg:top-0 shadow-[0_-12px_32px_rgba(0,0,0,0.14)]">
          <div className="relative mx-auto max-w-[1200px] overflow-hidden px-6 lg:px-8">
            {/* ILLUSTRATION — pleine hauteur, droite, dans le 1200px */}
            {conditionsSectionImageUrl && (
              <div className="absolute top-24 bottom-24 -right-6 hidden w-[62%] lg:-right-8 lg:block">
                <Image
                  src={conditionsSectionImageUrl}
                  alt="Chiropratique St-Roch"
                  fill
                  sizes="800px"
                  className="object-contain object-right-center"
                />
                {/* Voile beige à gauche là où l'image chevauche le texte */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,#f6f1e8_0%,#f6f1e8_8%,rgba(246,241,232,0.7)_25%,rgba(246,241,232,0)_45%)]" />
              </div>
            )}

            <ScrollReveal><div className="relative py-24">
              <div className="max-w-[520px]">
                <div className="mb-4">
                  <p className="font-[var(--font-barlow-condensed)] text-[18px] font-medium uppercase tracking-[0.24em] text-red-600">
                    Conditions traitées
                  </p>
                </div>

                <h2 className="text-[3rem] font-normal leading-[1] tracking-[-0.03em] text-zinc-950 md:text-[3.4rem]">
                  Des solutions pour ce qui vous limite.
                </h2>

                <SectionAccent className="mt-8" />
              </div>

              <div className="mt-14 grid max-w-[600px] border-l border-zinc-300 grid-cols-3 md:grid-cols-5">
                {conditions.docs.slice(0, 5).map((condition: any, index: number) => (
                  <div key={condition.id} className="flex flex-col items-center border-r border-zinc-300 px-5 py-4 text-center">
                    <p className="flex-1 font-[var(--font-barlow-condensed)] text-[0.95rem] font-semibold uppercase leading-[1.2] tracking-[0.05em] text-zinc-900">
                      <span className="text-red-600">{condition.title.slice(0, 1)}</span>
                      {condition.title.slice(1)}
                    </p>
                    <div className="mt-5">
                      <ConditionAccent index={index} />
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="/conditions-traitees"
                className="group mt-12 inline-flex items-center gap-3 border border-red-700 px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-red-700 transition-all duration-300 hover:bg-red-700 hover:text-white"
              >
                Voir toutes les conditions
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
              </a>
            </div></ScrollReveal>
          </div>
        </section>
      )}

      {/* PROFESSIONNELS */}
      {hasProfessionals && (
        <section className="relative z-30 -mt-4 bg-white lg:sticky lg:top-0 shadow-[0_-12px_32px_rgba(0,0,0,0.14)]">
          <ScrollReveal>
          <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-24 lg:grid-cols-[0.58fr_1.42fr] lg:px-8">
            <div>
              <div className="mb-4">
                <p className="font-[var(--font-barlow-condensed)] text-[18px] font-medium uppercase tracking-[0.24em] text-red-600">
                  Professionnels
                </p>
              </div>

              <h2 className="text-[3rem] font-normal leading-[1] tracking-[-0.03em] text-zinc-950 md:text-[3.4rem]">
                Une équipe à votre écoute.
              </h2>

              <SectionAccent className="mt-6" />

              <p className="mt-8 max-w-sm text-sm leading-6 text-zinc-600">
                Des professionnels accessibles pour vous accompagner avec clarté, respect et simplicité.
              </p>

            </div>

            {(() => {
              const count = professionals.docs.length
              const isStaggered = count === 4

              const ProfCard = ({ professional, style }: { professional: any; style?: React.CSSProperties }) => {
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
                    className="group relative overflow-hidden"
                    style={style}
                  >
                    <div className="relative aspect-square overflow-hidden bg-transparent">
                      {photoUrl && (
                        <Image src={photoUrl} alt={professional.name} fill sizes="25vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                          style={{ objectPosition: 'center 15%' }}
                        />
                      )}
                    </div>
                    {photoUrl && (
                      <div className="pt-2">
                        <h3 className="text-sm font-bold tracking-[-0.01em] text-zinc-950">{professional.name}</h3>
                        <p className="mt-0.5 text-xs text-zinc-500">{professional.title}</p>
                      </div>
                    )}
                  </a>
                )
              }

              const CTACard = ({ style }: { style?: React.CSSProperties }) => (
                <Link
                  href="/professionnels"
                  className="group relative flex min-w-0 flex-col justify-between overflow-hidden p-5 transition duration-300"
                  style={style}
                >
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(220,38,38,0.06)_0px,rgba(220,38,38,0.06)_1.5px,transparent_1.5px,transparent_10px)] transition duration-300 group-hover:opacity-40" />
                  <div className="relative">
                    <h3 className="font-[var(--font-barlow-condensed)] text-[clamp(1.2rem,3vw,1.8rem)] font-medium uppercase leading-[1.05] tracking-[-0.02em] text-red-600">
                      Rencontrer l'équipe
                    </h3>
                  </div>
                  <div className="relative mt-4 text-red-600">
                    <svg aria-hidden="true" viewBox="0 0 120 18" className="h-5 w-20 overflow-visible transition-[width] duration-300 ease-out group-hover:w-28">
                      <path d="M1 9H112M100 2L112 9L100 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                    </svg>
                  </div>
                </Link>
              )

              if (isStaggered) {
                return (
                  <div className="grid grid-cols-6 gap-1 bg-white">
                    {professionals.docs.slice(0, 3).map((p: any, i: number) => (
                      <ProfCard key={p.id} professional={p} style={{ gridColumn: `${i * 2 + 1} / span 2` }} />
                    ))}
                    {professionals.docs.slice(3).map((p: any, i: number) => (
                      <ProfCard key={p.id} professional={p} style={{ gridColumn: `${i * 2 + 2} / span 2` }} />
                    ))}
                    <CTACard style={{ gridColumn: '4 / span 2' }} />
                  </div>
                )
              }

              return (
                <div className="grid grid-cols-3 gap-1 bg-white">
                  {professionals.docs.slice(0, 5).map((p: any) => (
                    <ProfCard key={p.id} professional={p} />
                  ))}
                  {count < 6 && <CTACard />}
                </div>
              )
            })()}
          </div>
          </ScrollReveal>
        </section>
      )}

      {/* BLOGUE */}
      {dailyPost && (() => {
        const dailyIndex = getDailyIndex(posts.docs.length)
        const remainingPosts = posts.docs.filter((_: any, i: number) => i !== dailyIndex)
        const popularIndex = getPeriodicIndex(remainingPosts.length, 4)
        const popularPost = remainingPosts.length > 0 ? remainingPosts[popularIndex] : null
        const recentPost = remainingPosts.find((_: any, i: number) => i !== popularIndex) ?? null

        return (
          <section className="relative z-40 -mt-4 bg-[#f6f1e8] lg:sticky lg:top-0 shadow-[0_-12px_32px_rgba(0,0,0,0.14)]">
            <ScrollReveal>
            <div className="mx-auto max-w-[1200px] px-6 py-24 lg:px-8">

              {/* En-tête section */}
              <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="font-[var(--font-barlow-condensed)] text-[18px] font-medium uppercase tracking-[0.24em] text-red-600">
                    Blogue santé
                  </p>
                  <h2 className="mt-4 text-[3rem] font-normal leading-[1] tracking-[-0.03em] text-zinc-950 md:text-[3.4rem]">
                    Le neuro-musculo-squelettique, expliquée simplement.
                  </h2>
                  <SectionAccent className="mt-6" />
                </div>
                <a
                  href="/blogue"
                  className="group inline-flex shrink-0 items-center gap-3 border border-red-700 px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-red-700 transition-all duration-300 hover:bg-red-700 hover:text-white"
                >
                  Voir tous les articles
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
                </a>
              </div>

              {/* Grille articles */}
              <div className="grid gap-1 lg:grid-cols-[1.6fr_1fr]">

                {/* Article du jour — grande carte */}
                <a
                  href={`/blogue/${dailyPost.slug}`}
                  className="group flex min-h-[420px] flex-col overflow-hidden p-8 transition-opacity duration-300 hover:opacity-90"
                  style={{ background: buildPostGradient(Array.isArray(dailyPost.relatedServices) ? dailyPost.relatedServices : []) }}
                >
                  <div>
                    <span className="inline-flex border-l-2 border-red-500 pl-3 font-[var(--font-barlow-condensed)] text-[13px] font-medium uppercase tracking-[0.22em] text-red-400">
                      Article du jour
                    </span>
                  </div>

                  <div className="flex flex-1 items-center py-8">
                    <h3 className="max-w-lg text-[2rem] font-normal leading-[1.05] tracking-[-0.03em] text-white md:text-[2.6rem]">
                      {dailyPost.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between">
                    {dailyPost.publishedAt && (
                      <span className="text-xs font-medium uppercase tracking-[0.14em] text-white/40">
                        {formatDateFR(dailyPost.publishedAt)}
                      </span>
                    )}
                    <span className="font-[var(--font-barlow-condensed)] text-[13px] font-medium uppercase tracking-[0.18em] text-red-400 transition group-hover:text-red-300">
                      Lire l'article →
                    </span>
                  </div>
                </a>

                {/* Petites cartes */}
                <div className="flex flex-col gap-1">
                  {([
                    { post: popularPost, label: 'Article populaire' },
                    { post: recentPost, label: 'À lire aussi' },
                  ] as { post: any; label: string }[]).filter(({ post }) => post).map(({ post: op, label }) => (
                    <a
                      key={op.id}
                      href={"/blogue/" + op.slug}
                      className="group flex flex-1 flex-col overflow-hidden p-6 min-h-[300px] lg:min-h-[200px] transition-opacity duration-300 hover:opacity-90"
                      style={{ background: buildPostGradient(Array.isArray(op.relatedServices) ? op.relatedServices : []) }}
                    >
                      <div>
                        <span className="inline-flex border-l-2 border-red-500 pl-3 font-[var(--font-barlow-condensed)] text-[13px] font-medium uppercase tracking-[0.22em] text-red-400">
                          {label}
                        </span>
                      </div>

                      <div className="flex flex-1 items-center py-4">
                        <h3 className="text-xl font-normal leading-[1.05] tracking-[-0.03em] text-white">
                          {op.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between">
                        {op.publishedAt && (
                          <span className="text-xs font-medium uppercase tracking-[0.14em] text-white/40">
                            {formatDateFR(op.publishedAt)}
                          </span>
                        )}
                        <span className="font-[var(--font-barlow-condensed)] text-[13px] font-medium uppercase tracking-[0.18em] text-red-400 transition group-hover:text-red-300">
                          Lire →
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

            </div>
            </ScrollReveal>
          </section>
        )
      })()}
    </main>
  )
}







