import configPromise from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const FALLBACK_JANE_URL = 'https://chiropratiquestroch.janeapp.com'

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


function ServiceIconBadge({ slug }: { slug: string }) {
  const imageIcons: Record<string, string> = {
    chiropratique: '/assets/chiropratique-icon.png',
    osteopathie: '/assets/osteopathie-icon.png',
    massotherapie: '/assets/massotherapie-icon.png',
    kinesitherapie: '/assets/kinesitherapie-icon.png',
    orthotherapie: '/assets/orthotherapie-icon.png',
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
      <section className="relative min-h-[82vh] lg:min-h-[76vh] overflow-hidden bg-[#f6f1e8]">

          {/* Photo — commence à 33% du bord gauche */}
          {homeHeroImageUrl && (
            <div className="absolute bottom-0 right-0 top-0 left-[33%]">
              <Image src={homeHeroImageUrl} alt="" fill priority sizes="67vw" className="object-cover object-left" />
            </div>
          )}

          {/* Fondu — plein beige sur et après la ligne, fond vers transparent */}
          <div className="pointer-events-none absolute inset-y-0 left-[33%] w-[15%] bg-[linear-gradient(90deg,#f6f1e8_0%,#f6f1e8_20%,rgba(246,241,232,0)_100%)]" />

          {/* Voile mobile — rend le texte lisible sur la photo */}
          <div className="pointer-events-none absolute inset-0 lg:hidden bg-[linear-gradient(160deg,rgba(246,241,232,0.92)_0%,rgba(246,241,232,0.75)_50%,rgba(246,241,232,0.4)_100%)]" />

          {/* Contenu full-width — s'étale sur toute la hauteur du hero */}
          <div className="relative flex min-h-[70vh] w-full items-stretch justify-between px-6 lg:px-20 xl:px-28">

            {/* Gauche — bloc groupé, centré verticalement */}
            <div className="flex w-full flex-col pt-60 pb-20 lg:pb-10 lg:max-w-[33%]">

              <p className="font-[var(--font-barlow-condensed)] text-[15px] font-bold uppercase tracking-[0.2em] text-red-600">
                Soins manuels · corps en mouvement
              </p>

              <h1 className="mt-3 -ml-[0.05em] font-[var(--font-barlow-condensed)] text-[clamp(2rem,8vw,8rem)] font-medium uppercase leading-[1.0] tracking-[0.01em] text-zinc-950">
                Chiropratique
                <span className="block whitespace-nowrap text-red-600">St-Roch</span>
              </h1>

              <SectionAccent className="mt-7" />

              <p className="mt-7 text-[1.25rem] leading-8 text-zinc-800">
                Une clinique, plusieurs disciplines,<br />une seule priorité : vous.
              </p>

              <a
                href={janeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex min-h-[54px] w-fit items-center gap-4 border border-red-600 bg-white/90 px-7 text-[13px] font-bold uppercase tracking-[0.16em] text-red-600 transition hover:bg-red-700 hover:text-white"
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

            {/* Droite — BOUGEZ MIEUX aligné avec le top de CHIROPRATIQUE */}
            <div className="pointer-events-none hidden shrink-0 self-start mt-[17.3rem] lg:flex lg:items-stretch lg:gap-3">
              <div className="my-[0.5em] w-[2px] shrink-0 bg-red-600" />
              <p className="font-[var(--font-barlow-condensed)] text-left text-[clamp(1.6rem,2.8vw,2.4rem)] font-semibold uppercase leading-[1.15] tracking-[0.08em] text-zinc-950">
                Bougez<br />Mieux.<br />Vivez<br />Mieux.
              </p>
            </div>

          </div>
      </section>

      {/* SERVICES */}
      {hasServices && (
        <section className="relative z-10 -mt-4 overflow-hidden bg-white lg:sticky lg:top-0 shadow-[0_-12px_32px_rgba(0,0,0,0.14)]">
          <ScrollReveal>
          <div className="mx-auto max-w-[1200px] px-6 py-24 lg:px-8">
            <div className="grid items-stretch gap-12 xl:grid-cols-[320px_1fr] xl:gap-16">
              {/* COLONNE GAUCHE */}
              <div className="flex h-full flex-col">
                <div>
                  <p className="font-[var(--font-barlow-condensed)] text-[18px] font-medium uppercase tracking-[0.24em] text-red-600">
                    Services
                  </p>

                  <h2 className="mt-6 text-[clamp(1.8rem,6vw,3rem)] font-normal leading-[1.1] tracking-[-0.03em] text-zinc-950">
                    Des approches complémentaires, centrées sur vous.
                  </h2>

                  <SectionAccent className="mt-8" />
                </div>

                {/* IMAGE FAMILLE — visible uniquement sur xl dans sa colonne 320px */}
                <div className="mt-auto pt-12 hidden xl:block">
                  <Image
                    src="/assets/services-family.png"
                    alt="Famille illustrée"
                    width={560}
                    height={420}
                    sizes="320px"
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
                          className="group flex min-h-[150px] md:min-h-[300px] min-w-0 flex-col overflow-hidden border-b border-r border-zinc-400 bg-[#f8f6f1] px-5 py-6 transition duration-300 hover:bg-white"
                        >
                          <ServiceTitle title={service.title} />

                          <p className="mt-3 flex-1 text-[0.9rem] leading-[1.6] text-zinc-700">
                            {service.shortDescription}
                          </p>

                          <div className="-mt-10 hidden lg:flex justify-end">
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
                            className={`group relative flex min-h-[150px] md:min-h-[300px] min-w-0 flex-col overflow-hidden px-5 py-6 transition duration-300 ${
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

                              <div className="-mt-10 hidden lg:flex justify-end">
                                <ServiceIconBadge slug={service.slug} />
                              </div>
                            </div>
                          </Link>
                        )
                      })}

                      {/* CASE 06 */}
                      <Link
                        href="/services"
                        className="group relative flex min-h-[150px] md:min-h-[300px] min-w-0 flex-col justify-between border-r border-b border-zinc-400 px-5 py-6 transition duration-300"
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
                className="group mt-12 inline-flex items-center gap-3 border border-red-600 px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-red-600 transition-all duration-300 hover:bg-red-700 hover:text-white"
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
            <div className="flex flex-col">
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

              {/* Figures debout — remplissent l'espace vide sous le texte, cachées sous lg */}
              <div className="mt-auto hidden lg:flex items-end justify-center gap-2 pt-8">
                <Image
                  src="/assets/femme-professionnel-siteweb-gauche.png"
                  alt=""
                  width={180}
                  height={320}
                  className="w-[48%] object-contain object-bottom"
                />
                <Image
                  src="/assets/homme-professionnel-siteweb-droite.png"
                  alt=""
                  width={180}
                  height={320}
                  className="w-[48%] object-contain object-bottom"
                />
              </div>

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
                    className="group relative overflow-hidden border border-zinc-400 transition hover:border-zinc-950"
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
                      <div className="flex flex-1 flex-col p-4 lg:p-5">
                        <h3 className="text-[1.25rem] font-bold leading-tight text-zinc-950">{professional.name}</h3>
                        <p className="mt-1 text-[0.9rem] font-semibold text-zinc-600">{professional.title}</p>
                      </div>
                    )}
                  </a>
                )
              }

              const CTACard = ({ style }: { style?: React.CSSProperties }) => (
                <Link
                  href="/professionnels"
                  className="group relative flex min-w-0 flex-col justify-between border border-zinc-400 p-5 transition duration-300 hover:border-zinc-950"
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
                  <>
                    {/* Mobile : grille simple 2 colonnes */}
                    <div className="grid grid-cols-2 gap-1 bg-white sm:hidden">
                      {professionals.docs.slice(0, 4).map((p: any) => (
                        <ProfCard key={p.id} professional={p} />
                      ))}
                      <CTACard />
                    </div>
                    {/* Desktop : grille décalée 6 colonnes */}
                    <div className="hidden sm:grid grid-cols-6 gap-1 bg-white">
                      {professionals.docs.slice(0, 3).map((p: any, i: number) => (
                        <ProfCard key={p.id} professional={p} style={{ gridColumn: `${i * 2 + 1} / span 2` }} />
                      ))}
                      {professionals.docs.slice(3).map((p: any, i: number) => (
                        <ProfCard key={p.id} professional={p} style={{ gridColumn: `${i * 2 + 2} / span 2` }} />
                      ))}
                      <CTACard style={{ gridColumn: '4 / span 2' }} />
                    </div>
                  </>
                )
              }

              return (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-1 bg-white">
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
        const popularPost = _popularIdx >= 0 ? posts.docs[_popularIdx] : null
        const recentPost  = _recentIdx  >= 0 ? posts.docs[_recentIdx]  : null

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
                    Le neuro-musculo-squelettique, expliqué simplement.
                  </h2>
                  <SectionAccent className="mt-6" />
                </div>
                <a
                  href="/blogue"
                  className="group inline-flex self-start shrink-0 items-center gap-3 border border-red-600 px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-red-600 transition-all duration-300 hover:bg-red-700 hover:text-white"
                >
                  Voir tous les articles
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
                </a>
              </div>

              {/* Grille articles */}
              <div className="grid gap-1 lg:grid-cols-[1.6fr_1fr]">

                {/* Article du jour — même design que la page blogue */}
                <a
                  href={`/blogue/${dailyPost.slug}`}
                  className="group flex lg:min-h-[360px] flex-col overflow-hidden bg-zinc-950 border border-zinc-950 p-8 lg:p-10 lg:pb-6 transition hover:border-red-600"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex border-l-2 border-red-500 pl-3 font-[var(--font-barlow-condensed)] text-[13px] font-medium uppercase tracking-[0.22em] text-red-500">
                      Article du jour
                    </span>
                    {dailyPost.publishedAt && (
                      <span className="text-xs text-zinc-500">{formatDateFR(dailyPost.publishedAt)}</span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-center">
                    <h3 className="font-[var(--font-barlow-condensed)] text-[clamp(1.6rem,2.5vw,2.2rem)] font-medium uppercase leading-tight text-white group-hover:text-red-400 transition">
                      {dailyPost.title}
                    </h3>
                    {dailyPost.meta?.description && (
                      <p className="mt-3 line-clamp-3 text-[0.9rem] leading-6 text-zinc-400">
                        {dailyPost.meta.description}
                      </p>
                    )}
                  </div>

                  <span className="mt-auto text-[1rem] font-semibold text-red-500 transition group-hover:text-red-400">
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
                          <span className="inline-flex border-l-2 border-red-500 pl-3 font-[var(--font-barlow-condensed)] text-[13px] font-medium uppercase tracking-[0.22em] text-red-600">
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

            </div>
            </ScrollReveal>
          </section>
        )
      })()}
    </main>
  )
}







