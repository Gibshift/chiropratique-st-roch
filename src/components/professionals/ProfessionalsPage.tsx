import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Image from 'next/image'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { GeometricShapes } from '@/components/ui/GeometricShapes'

const JANE_URL = 'https://chiropratiquestroch.janeapp.com'

function getDesktopCols(count: number) {
  const map: Record<number, string> = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
  }
  return map[count] ?? 'lg:grid-cols-4'
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
    <main className="relative bg-white text-zinc-950 isolate">
      <GeometricShapes />

      {/* ─── Section 1 — Hero ─────────────────────────────────────────── */}
      <section className="bg-white pt-36 pb-0 lg:pt-40">
        <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">

            <div className="grid grid-cols-1 lg:grid-cols-[460px_1fr] lg:min-h-[360px]">

              {/* Gauche — message + actions */}
              <div className="flex flex-col justify-center py-8 lg:py-12 lg:pr-16">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">Professionnels</p>
                <h1 className="mt-4 font-[var(--font-barlow-condensed)] text-[clamp(2.2rem,5.5vw,4.5rem)] font-medium uppercase leading-[1.0] text-zinc-950">
                  Des soins.<br />Des visages.
                </h1>
                <div className="mt-6 h-[2px] w-14 bg-red-600" />
                <p className="mt-6 max-w-[380px] text-[1rem] leading-7 text-zinc-800">
                  Chaque professionnel apporte une expertise distincte. Découvrez leur approche et trouvez celui qui vous correspond.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href={JANE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-[46px] items-center gap-3 bg-red-600 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-red-700"
                  >
                    <span>Prendre rendez-vous</span>
                    <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2.5 w-8 transition duration-200 group-hover:translate-x-1">
                      <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                    </svg>
                  </a>
                  <a
                    href="#equipe-grid"
                    className="inline-flex min-h-[46px] items-center border border-zinc-300 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950"
                  >
                    Voir l&apos;équipe ↓
                  </a>
                </div>
              </div>

              {/* Droite — photo + liens rapides vers chaque professionnel */}
              <div className="hidden lg:flex relative overflow-hidden bg-white">

                <div className="absolute inset-y-8 lg:inset-y-12 left-0 right-[220px]">
                  <Image
                    src="/assets/salle-chiro-watercolor.png"
                    alt=""
                    fill
                    sizes="400px"
                    className="object-cover object-center pointer-events-none"
                    priority
                  />
                  <div className="absolute inset-0 bg-white/20 pointer-events-none" />
                </div>

                <div className="relative z-10 ml-auto flex w-[300px] flex-col justify-center gap-2 self-stretch px-4 py-6">
                  {professionals.docs.map((professional: any) => (
                    <a
                      key={professional.id}
                      href={`/professionnels/${professional.slug}`}
                      className="group flex items-center justify-between border border-zinc-200 bg-white px-4 py-3 transition hover:border-zinc-400 hover:bg-zinc-50"
                    >
                      <span className="flex flex-col">
                        <span className="font-[var(--font-barlow-condensed)] text-[1rem] font-medium uppercase tracking-[0.01em] text-zinc-700 transition group-hover:text-red-600">
                          {professional.name}
                        </span>
                        {professional.title && (
                          <span className="text-[0.72rem] font-medium uppercase tracking-[0.06em] text-zinc-400">
                            {professional.title}
                          </span>
                        )}
                      </span>
                      <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2.5 w-9 flex-shrink-0 text-red-600 transition duration-200 group-hover:translate-x-0.5">
                        <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" strokeLinejoin="miter" />
                      </svg>
                    </a>
                  ))}
                </div>

              </div>

            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── Section 2 — Grille de l'équipe ──────────────────────────── */}
      {count > 0 && (
        <section id="equipe-grid" className="bg-zinc-50 py-20">
          <ScrollReveal>
            <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">

              <div className="mb-10 border-b border-zinc-200 pb-6">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">
                  Notre équipe
                </p>
                <p className="mt-1 font-[var(--font-barlow-condensed)] text-[clamp(1.4rem,2.5vw,2rem)] font-medium uppercase leading-tight text-zinc-950">
                  Une expertise par discipline.
                </p>
              </div>

              <div className={`grid grid-cols-2 gap-px bg-zinc-200 sm:grid-cols-3 ${getDesktopCols(count)}`}>
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
                      className="group flex flex-col overflow-hidden bg-white transition hover:bg-zinc-50"
                    >
                      {photoUrl ? (
                        <div className="relative aspect-[3/4] w-full overflow-hidden">
                          <Image
                            src={photoUrl}
                            alt={professional.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover object-top transition duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-[3/4] items-center justify-center bg-zinc-100">
                          <span className="text-sm font-semibold uppercase tracking-wide text-zinc-400">Photo à venir</span>
                        </div>
                      )}
                      <div className="flex flex-1 flex-col border-t border-zinc-200 p-5">
                        <h2 className="font-[var(--font-barlow-condensed)] text-[1.2rem] font-medium uppercase leading-tight tracking-[0.02em] text-zinc-950">
                          {professional.name}
                        </h2>
                        <p className="mt-1 text-[0.8rem] font-medium uppercase tracking-[0.06em] text-zinc-500">
                          {professional.title}
                        </p>
                        <span className="mt-5 inline-flex items-center gap-1.5 text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-red-600 transition group-hover:gap-2.5">
                          Voir le profil
                          <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2 w-7 transition duration-200 group-hover:translate-x-0.5">
                            <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                          </svg>
                        </span>
                      </div>
                    </a>
                  )
                })}
              </div>

            </div>
          </ScrollReveal>
        </section>
      )}

      {/* ─── Section 3 — CTA bas ──────────────────────────────────────── */}
      <section className="bg-white py-20">
        <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">

            <div className="grid grid-cols-1 gap-px bg-zinc-200 lg:grid-cols-2">

              <div className="flex flex-col justify-between bg-white px-8 py-8">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">
                  Prêt à consulter?
                </p>
                <p className="mt-4 font-[var(--font-barlow-condensed)] text-[clamp(1.2rem,2vw,1.6rem)] font-medium uppercase leading-tight text-zinc-950">
                  Prenez rendez-vous directement en ligne avec le professionnel de votre choix.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={JANE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-[46px] items-center gap-3 bg-red-600 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-red-700"
                  >
                    <span>Prendre rendez-vous</span>
                    <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2.5 w-8 transition duration-200 group-hover:translate-x-1">
                      <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                    </svg>
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex min-h-[46px] items-center border border-zinc-300 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950"
                  >
                    Nous contacter
                  </a>
                </div>
              </div>

              <a
                href="/services"
                className="group flex flex-col justify-between bg-zinc-900 px-8 py-8 transition hover:bg-zinc-800"
              >
                <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-zinc-500">
                  Pas sûr quel soin choisir?
                </p>
                <p className="mt-4 font-[var(--font-barlow-condensed)] text-[1rem] font-medium uppercase leading-snug text-zinc-200">
                  Découvrez nos cinq disciplines et trouvez celle qui correspond à votre situation.
                </p>
                <span className="mt-6 inline-flex items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-red-400 transition group-hover:text-red-300">
                  Explorer les services
                  <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2 w-7 transition duration-200 group-hover:translate-x-1">
                    <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
                  </svg>
                </span>
              </a>

            </div>

          </div>
        </ScrollReveal>
      </section>

    </main>
  )
}
