import configPromise from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { GeometricShapes } from '@/components/ui/GeometricShapes'

const FALLBACK_JANE_URL = 'https://chiropratiquestroch.janeapp.com'

const SHAPES_SERVICES = [
  { type: 'circle'   as const, x: '5%',  y: '18%', size: 7, rotate: 0   },
  { type: 'triangle' as const, x: '12%', y: '55%', size: 8, rotate: 15  },
  { type: 'square'   as const, x: '8%',  y: '88%', size: 6, rotate: 30  },
  { type: 'square'   as const, x: '87%', y: '22%', size: 7, rotate: -15 },
  { type: 'circle'   as const, x: '93%', y: '60%', size: 6, rotate: 0   },
  { type: 'triangle' as const, x: '82%', y: '85%', size: 8, rotate: 20  },
]

const SHAPES_CONDITIONS = [
  { type: 'triangle' as const, x: '9%',  y: '10%', size: 6, rotate: -10 },
  { type: 'square'   as const, x: '15%', y: '48%', size: 7, rotate: 45  },
  { type: 'circle'   as const, x: '6%',  y: '80%', size: 8, rotate: 0   },
  { type: 'circle'   as const, x: '84%', y: '15%', size: 7, rotate: 0   },
  { type: 'triangle' as const, x: '91%', y: '50%', size: 6, rotate: -25 },
  { type: 'square'   as const, x: '88%', y: '82%', size: 7, rotate: 10  },
]

const SHAPES_PROFESSIONNELS = [
  { type: 'square'   as const, x: '7%',  y: '25%', size: 8, rotate: 20  },
  { type: 'circle'   as const, x: '14%', y: '70%', size: 6, rotate: 0   },
  { type: 'triangle' as const, x: '4%',  y: '92%', size: 7, rotate: -5  },
  { type: 'triangle' as const, x: '89%', y: '8%',  size: 6, rotate: 35  },
  { type: 'square'   as const, x: '94%', y: '42%', size: 7, rotate: -30 },
  { type: 'circle'   as const, x: '85%', y: '75%', size: 8, rotate: 0   },
]

const SHAPES_BLOGUE = [
  { type: 'circle'   as const, x: '11%', y: '8%',  size: 6, rotate: 0   },
  { type: 'square'   as const, x: '5%',  y: '42%', size: 8, rotate: -20 },
  { type: 'triangle' as const, x: '16%', y: '82%', size: 7, rotate: 25  },
  { type: 'square'   as const, x: '83%', y: '30%', size: 6, rotate: 15  },
  { type: 'circle'   as const, x: '92%', y: '65%', size: 7, rotate: 0   },
  { type: 'triangle' as const, x: '86%', y: '92%', size: 8, rotate: -10 },
]

const SERVICE_ORDER = [
  'chiropratique',
  'osteopathie',
  'massotherapie',
  'kinesitherapie',
  'orthotherapie',
]



function formatDateFR(dateStr: string) {
  return new Intl.DateTimeFormat('fr-CA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Toronto',
  }).format(new Date(dateStr))
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

  const [siteSettings, services, conditionCategories, professionals, posts] = await Promise.all([
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
      collection: 'condition-categories' as any,
      limit: 5,
      depth: 0,
      sort: 'order',
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
      limit: 200,
      depth: 1,
      sort: 'title',
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
  const hasConditions = conditionCategories.docs.length > 0
  const hasProfessionals = professionals.docs.length > 0
  const orderedServices = SERVICE_ORDER.map((slug) =>
    services.docs.find((service: any) => service.slug === slug),
  ).filter(Boolean) as any[]

  const _dayIndex     = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
  const _fourDayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 4))
  const _len          = posts.docs.length
  const dailyPost     = _len > 0 ? posts.docs[_dayIndex % _len] : null
  const _popularIdx   = _len > 1 ? (_fourDayIndex + Math.floor(_len / 2)) % _len : -1
  const _recentIdx    = _len > 2 ? (_dayIndex + Math.ceil(_len / 3)) % _len : -1

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
      <section className="relative min-h-[640px] overflow-hidden bg-[#f6f1e8] lg:min-h-[68svh]">

        {/* Photo en fond absolu — toutes tailles */}
        <div className="pointer-events-none absolute inset-0">
          <div className="relative h-full">
            <Image
              src="/assets/salle-chiro-ville-fused-watercolor.png"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/15" />
          </div>
        </div>

        {/* Carré blanc — décalé vers le bas sur mobile pour laisser l'image apparaître */}
        <div className="absolute inset-x-0 bottom-[90px] top-[160px] z-10 bg-white/70 backdrop-blur-md lg:inset-0 lg:bg-transparent lg:backdrop-blur-none">
          <div className="mx-auto h-full max-w-[var(--content-max-w)] px-6 lg:px-8">
            <div className="flex h-full flex-col items-center justify-center lg:bg-white lg:shadow-[-12px_0_24px_rgba(0,0,0,0.35),12px_0_24px_rgba(0,0,0,0.35)]">
              <ScrollReveal>
                <div className="flex flex-col items-center px-6 text-center lg:translate-y-8 lg:px-16">
                  <p className="text-[0.62rem] font-medium uppercase tracking-[0.12em] text-red-600">
                    Soins manuels · corps en mouvement
                  </p>

                  <h1 className="mt-3 font-[var(--font-barlow-condensed)] text-[clamp(2.4rem,9vw,8rem)] font-medium uppercase leading-[1.0] text-zinc-950">
                    Chiropratique
                    <span className="block text-red-600">St-Roch</span>
                  </h1>

                  <p className="mt-4 text-[1rem] leading-7 text-zinc-800">
                    Une clinique, plusieurs disciplines, une seule priorité : vous.
                  </p>

                  <a
                    href={janeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-8 inline-flex min-h-[54px] w-fit items-center gap-4 border border-red-600 bg-white px-7 text-[13px] font-bold uppercase tracking-[0.16em] text-red-600 transition hover:bg-red-600 hover:text-white"
                  >
                    <span className="whitespace-nowrap">Prendre rendez-vous</span>

                    <svg
                      aria-hidden="true"
                      viewBox="0 0 44 10"
                      className="h-3 w-9 transition duration-200 group-hover:translate-x-1"
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
              </ScrollReveal>
            </div>
          </div>
        </div>

      </section>

      {/* SERVICES */}
      {hasServices && (
        <section className="relative z-10 -mt-4 overflow-hidden bg-white lg:sticky lg:top-0 shadow-[0_-12px_32px_rgba(0,0,0,0.14)]">
          <GeometricShapes holds={SHAPES_SERVICES} />
          <ScrollReveal>
          <div className="mx-auto max-w-[var(--content-max-w)] px-6 py-12 lg:px-8 lg:py-24">

            {/* En-tête : titre gauche + image droite */}
            <div className="mb-8 flex items-end justify-between gap-8">
              <div>
                <p className="font-[var(--font-barlow-condensed)] text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600 lg:text-[18px] lg:tracking-[0.24em]">
                  Services
                </p>
                <h2 className="mt-4 text-[clamp(1.8rem,6vw,3rem)] font-normal leading-[1.1] tracking-[-0.03em] text-zinc-950">
                  Des approches complémentaires,<br />centrées sur vous.
                </h2>
                <SectionAccent className="mt-6" />
              </div>
              <div className="hidden xl:block shrink-0">
                <Image
                  src="/assets/services-family.png"
                  alt="Famille illustrée"
                  width={280}
                  height={210}
                  sizes="280px"
                  className="object-contain"
                  style={{ height: 'auto' }}
                />
              </div>
            </div>

            {/* Rangée unique de cartes */}
            <div className="grid border-l border-t border-zinc-400 grid-cols-1 sm:grid-cols-3 lg:grid-cols-5">
              {orderedServices.slice(0, 5).map((service: any) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group flex min-w-0 flex-col overflow-hidden border-b border-r border-zinc-400 bg-white px-5 py-6 transition duration-300 hover:bg-[#f8f6f1]"
                >
                  <ServiceTitle title={service.title} />
                  <div className="mt-2 h-px w-10 bg-zinc-400" />
                  <p className="mt-4 flex-1 text-[0.82rem] leading-[1.65] text-zinc-700">{service.shortDescription}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.1em] text-red-600">
                    En savoir plus
                    <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2 w-8 transition-[width] duration-300 group-hover:w-12">
                      <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" strokeLinejoin="miter" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>

            <Link
              href="/services"
              className="group mt-8 inline-flex items-center gap-3 border border-red-600 px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-red-600 transition-all duration-300 hover:bg-red-600 hover:text-white"
            >
              Découvrir nos services
              <span className="inline-block transition duration-300 group-hover:translate-x-2">→</span>
            </Link>

          </div>
          </ScrollReveal>
        </section>
      )}

      {/* CONDITIONS */}
      {hasConditions && (
        <section className="relative z-20 -mt-4 bg-[#f6f1e8] lg:sticky lg:top-0 shadow-[0_-12px_32px_rgba(0,0,0,0.14)]">
          <GeometricShapes holds={SHAPES_CONDITIONS} />
          <div className="relative mx-auto max-w-[var(--content-max-w)] overflow-hidden px-6 lg:px-8">
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

            <ScrollReveal><div className="relative py-12 lg:py-24">
              <div className="max-w-[520px]">
                <div className="mb-4">
                  <p className="font-[var(--font-barlow-condensed)] text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600 lg:text-[18px] lg:tracking-[0.24em]">
                    Conditions traitées
                  </p>
                </div>

                <h2 className="text-[clamp(1.8rem,6vw,3rem)] font-normal leading-[1] tracking-[-0.03em] text-zinc-950">
                  Des solutions pour ce qui vous limite.
                </h2>

                <SectionAccent className="mt-8" />
              </div>

              <div className="mt-14 grid max-w-[600px] border-l border-zinc-400 grid-cols-3 md:grid-cols-5">
                {conditionCategories.docs.slice(0, 5).map((category: any, index: number) => (
                  <a
                    key={category.id}
                    href={`/conditions-traitees/${category.slug}`}
                    className="group flex flex-col items-center border-r border-zinc-400 px-5 py-4 text-center transition hover:bg-[#ece5dc]/40"
                  >
                    <p className="flex-1 font-[var(--font-barlow-condensed)] text-[0.95rem] font-semibold uppercase leading-[1.2] tracking-[0.05em] text-zinc-900 group-hover:text-zinc-950">
                      <span className="text-red-600">{category.title.slice(0, 1)}</span>
                      {category.title.slice(1)}
                    </p>
                    <div className="mt-5">
                      <ConditionAccent index={index} />
                    </div>
                  </a>
                ))}
              </div>

              <a
                href="/conditions-traitees"
                className="group mt-12 inline-flex items-center gap-3 border border-red-600 px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-red-600 transition-all duration-300 hover:bg-red-600 hover:text-white"
              >
                Voir toutes les conditions
                <span className="inline-block transition duration-300 group-hover:translate-x-2">→</span>
              </a>
            </div></ScrollReveal>
          </div>
        </section>
      )}

      {/* PROFESSIONNELS */}
      {hasProfessionals && (
        <section className="relative z-30 -mt-4 bg-white lg:sticky lg:top-0 shadow-[0_-12px_32px_rgba(0,0,0,0.14)]">
          <GeometricShapes holds={SHAPES_PROFESSIONNELS} />
          <ScrollReveal>
          <div className="mx-auto max-w-[var(--content-max-w)] px-6 py-12 lg:px-8 lg:py-24">

            {/* En-tête */}
            <div className="mb-8">
              <p className="font-[var(--font-barlow-condensed)] text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600 lg:text-[18px] lg:tracking-[0.24em]">
                Professionnels
              </p>
              <h2 className="mt-2 text-[clamp(1.8rem,4vw,3rem)] font-normal leading-[1] tracking-[-0.03em] text-zinc-950">
                Une équipe à votre écoute.
              </h2>
              <SectionAccent className="mt-4" />
            </div>

            {/* Rangée unique de cartes */}
            <div className="grid grid-cols-3 gap-1 sm:grid-cols-4 lg:grid-cols-6 mb-8">
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
                    className="group relative overflow-hidden border border-zinc-400 transition hover:border-zinc-950"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-white">
                      {photoUrl && (
                        <Image src={photoUrl} alt={professional.name} fill sizes="(max-width:640px) 33vw, (max-width:1024px) 25vw, 14vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                          style={{ objectPosition: 'center 15%' }}
                        />
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-[0.8rem] font-bold leading-tight text-zinc-950">
                        {professional.name.split(' ')[0]}<br />{professional.name.split(' ').slice(1).join(' ')}
                      </h3>
                      <p className="mt-0.5 text-[0.68rem] font-medium uppercase tracking-[0.04em] text-zinc-500">{professional.title}</p>
                    </div>
                  </a>
                )
              })}

            </div>

            <Link
              href="/professionnels"
              className="group inline-flex items-center gap-3 border border-red-600 px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-red-600 transition-all duration-300 hover:bg-red-600 hover:text-white"
            >
              Voir l'équipe
              <span className="inline-block transition duration-300 group-hover:translate-x-2">→</span>
            </Link>

          </div>
          </ScrollReveal>
        </section>
      )}

      {/* BLOGUE */}
      {dailyPost && (() => {
        const popularPost = _popularIdx >= 0 ? posts.docs[_popularIdx] : null
        const recentPost  = _recentIdx  >= 0 ? posts.docs[_recentIdx]  : null

        return (
          <section className="relative z-40 -mt-4 bg-[#f6f1e8] lg:sticky lg:top-0 shadow-[0_-12px_32px_rgba(0,0,0,0.14)]">
            <GeometricShapes holds={SHAPES_BLOGUE} />
            <ScrollReveal>
            <div className="mx-auto max-w-[var(--content-max-w)] px-6 py-12 lg:px-8 lg:py-24">

              {/* En-tête section */}
              <div className="mb-12">
                <p className="font-[var(--font-barlow-condensed)] text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600 lg:text-[18px] lg:tracking-[0.24em]">
                  Blogue santé
                </p>
                <h2 className="mt-4 text-[clamp(1.8rem,6vw,3rem)] font-normal leading-[1] tracking-[-0.03em] text-zinc-950">
                  Le neuro-musculo-squelettique, expliqué simplement.
                </h2>
                <SectionAccent className="mt-6" />
              </div>

              {/* Grille articles */}
              <div className="grid gap-1 lg:grid-cols-[1.6fr_1fr]">

                {/* Article du jour — même design que la page blogue */}
                <a
                  href={`/blogue/${dailyPost.slug}`}
                  className="group flex lg:min-h-[360px] flex-col overflow-hidden bg-zinc-950 border border-zinc-950 p-8 lg:p-10 lg:pb-6 transition hover:border-red-600"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex border-l-2 border-red-500 pl-3 font-[var(--font-barlow-condensed)] text-[0.72rem] lg:text-[13px] font-medium uppercase tracking-[0.12em] lg:tracking-[0.22em] text-red-500">
                      Article du jour
                    </span>
                    {dailyPost.publishedAt && (
                      <span className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">{formatDateFR(dailyPost.publishedAt)}</span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-start pt-4 lg:justify-center">
                    <h3 className="text-xl font-normal leading-[1.05] tracking-[-0.03em] lg:text-[clamp(1.6rem,2.5vw,2.2rem)] lg:font-[var(--font-barlow-condensed)] lg:font-medium lg:uppercase lg:leading-tight text-white group-hover:text-red-400 transition">
                      {dailyPost.title}
                    </h3>
                    {dailyPost.meta?.description && (
                      <p className="mt-3 line-clamp-3 text-[0.9rem] leading-6 text-zinc-400">
                        {dailyPost.meta.description}
                      </p>
                    )}
                  </div>

                  <span className="mt-auto self-end text-[1rem] font-semibold text-red-500 transition group-hover:text-red-400">
                    Lire l&apos;article →
                  </span>
                </a>

                {/* Petites cartes */}
                <div className="flex flex-col gap-1">
                  {([
                    { post: popularPost, label: 'Article populaire', variant: 'white' as const },
                    { post: recentPost,  label: 'À lire aussi',      variant: 'beige' as const },
                  ]).filter((item): item is typeof item & { post: NonNullable<typeof item['post']> } => !!item.post).map(({ post: op, label, variant }) => {
                    const isWhite = variant === 'white'
                    return (
                      <a
                        key={op.id}
                        href={"/blogue/" + op.slug}
                        className={`group flex flex-1 flex-col overflow-hidden p-6 lg:min-h-[200px] transition border ${
                          isWhite
                            ? 'bg-white border-zinc-400 hover:border-zinc-950'
                            : 'bg-stone-100 border-stone-400 hover:border-zinc-950'
                        }`}
                      >
                        <div>
                          <span className="inline-flex border-l-2 border-red-500 pl-3 font-[var(--font-barlow-condensed)] text-[0.72rem] lg:text-[13px] font-medium uppercase tracking-[0.12em] lg:tracking-[0.22em] text-red-600">
                            {label}
                          </span>
                        </div>

                        <div className="flex flex-1 items-center py-4">
                          <h3 className="text-xl font-normal leading-[1.05] tracking-[-0.03em] text-zinc-950 group-hover:text-red-600 transition">
                            {op.title}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between">
                          {op.publishedAt && (
                            <span className={`text-xs font-medium uppercase tracking-[0.14em] ${isWhite ? 'text-zinc-400' : 'text-stone-400'}`}>
                              {formatDateFR(op.publishedAt)}
                            </span>
                          )}
                          <span className="text-[1rem] font-semibold text-red-600 transition group-hover:text-zinc-950">
                            Lire l&apos;article →
                          </span>
                        </div>
                      </a>
                    )
                  })}
                </div>
              </div>

              <a
                href="/blogue"
                className="group mt-8 inline-flex items-center gap-3 border border-red-600 px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-red-600 transition-all duration-300 hover:bg-red-600 hover:text-white"
              >
                Voir tous les articles
                <span className="inline-block transition duration-300 group-hover:translate-x-2">→</span>
              </a>

            </div>
            </ScrollReveal>
          </section>
        )
      })()}
    </main>
  )
}







