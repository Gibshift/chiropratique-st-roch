import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import RichText from '@/components/RichText'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { GeometricShapes } from '@/components/ui/GeometricShapes'

type Props = {
  slug: string
}

const JANE_STAFF_URLS: Record<string, string> = {
  'andreanne':       'https://chiropratiquestroch.janeapp.com/#/staff_member/2',
  'lisanne':         'https://chiropratiquestroch.janeapp.com/#/staff_member/5',
  'alexandrepacaud': 'https://chiropratiquestroch.janeapp.com/#/staff_member/4',
  'franche':         'https://chiropratiquestroch.janeapp.com/#/staff_member/22',
  'lyssa':           'https://chiropratiquestroch.janeapp.com/#/staff_member/24',
}

function getJaneStaffUrl(name: string): string | null {
  const normalized = name
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
  for (const [key, url] of Object.entries(JANE_STAFF_URLS)) {
    if (normalized.includes(key)) return url
  }
  return null
}

export async function ProfessionalDetailPage({ slug }: Props) {
  const payload = await getPayload({ config: configPromise })

  const professionalResult = await payload.find({
    collection: 'professionals' as any,
    limit: 1,
    depth: 1,
    where: {
      slug: { equals: slug },
      isActive: { equals: true },
    },
  })

  const professional: any = professionalResult.docs[0]
  if (!professional) notFound()

  const photoUrl =
    professional.photo &&
    typeof professional.photo === 'object' &&
    'url' in professional.photo
      ? professional.photo.url
      : null

  const nameFirst = professional.name.charAt(0)
  const nameRest = professional.name.slice(1)
  const janeUrl = getJaneStaffUrl(professional.name)

  return (
    <main className="relative bg-white text-zinc-950">
      <GeometricShapes />

      {/* ─── Section 1 — Hero ─────────────────────────────────────────── */}
      <section className="relative pt-32 pb-0 lg:pt-48">
        <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">

            <Breadcrumb crumbs={[
              { label: 'Professionnels', href: '/professionnels' },
              { label: professional.name },
            ]} />

            <div className="mt-12 mb-12 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="font-[var(--font-barlow-condensed)] text-[clamp(2rem,7vw,4.5rem)] font-medium uppercase leading-[1.05] text-zinc-950 break-words">
                  <span className="text-red-600">{nameFirst}</span>{nameRest}
                </h1>
              </div>

              <div className="hidden lg:block w-[1px] h-24 flex-shrink-0 self-center bg-red-600" />

              <div className="lg:max-w-[38%]">
                <p className="font-[var(--font-barlow-condensed)] text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">
                  {professional.title || 'Professionnel'}
                </p>
                {professional.shortBio && (
                  <p className="mt-3 text-[1rem] leading-7 text-zinc-800">{professional.shortBio}</p>
                )}
                {janeUrl && (
                  <a
                    href={janeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-6 inline-flex min-h-[48px] items-center gap-3 border border-red-600 bg-red-600 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-red-600"
                  >
                    <span className="whitespace-nowrap">Prendre rendez-vous</span>
                    <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2.5 w-8 transition duration-200 group-hover:translate-x-1">
                      <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* ─── Section 2 — Contenu (bio + sidebar) ────────────────────── */}
      <section className="relative z-10 mx-auto max-w-[1200px] px-6 pb-12 lg:px-8 lg:pb-24">
        <div className="border-t border-zinc-300 pt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
        <article className="min-w-0">
          {professional.bio ? (
            <RichText data={professional.bio} enableGutter={false} />
          ) : (
            <p className="text-[1rem] leading-7 text-zinc-600">
              Prenez rendez-vous pour rencontrer ce professionnel et discuter de votre situation.
            </p>
          )}

          {professional.relatedConditions?.length > 0 && (
            <div className="mt-12">
              <p className="font-[var(--font-barlow-condensed)] text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">Conditions souvent traitées</p>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {professional.relatedConditions.map((condition: any) => (
                  <a
                    key={condition.id}
                    href="/conditions-traitees"
                    className="border border-zinc-300 bg-white p-5 font-semibold transition hover:border-zinc-950 hover:text-red-600"
                  >
                    {condition.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </article>

        <aside className="mt-12 flex flex-col gap-6 max-w-[400px] lg:max-w-none lg:mt-2 lg:sticky lg:top-28 lg:self-start">
          {photoUrl && (
            <div className="relative aspect-[340/420] overflow-hidden border border-zinc-300">
              <Image
                src={photoUrl}
                alt={professional.name}
                fill
                sizes="(min-width: 1024px) 340px, 100vw"
                className="object-cover object-top"
              />
            </div>
          )}

          <div className="border border-zinc-300 bg-white p-6">
            <p className="font-[var(--font-barlow-condensed)] text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">Services</p>
            <p className="mt-2 text-[0.9rem] leading-6 text-zinc-700">
              Découvrez l&apos;ensemble des soins offerts à la clinique.
            </p>
            <a href="/services" className="mt-4 inline-block text-[1rem] font-semibold text-red-600 hover:text-zinc-950 transition">
              Voir nos services →
            </a>
          </div>

          <div className="border border-zinc-300 bg-white p-6">
            <p className="font-[var(--font-barlow-condensed)] text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">Blogue</p>
            <p className="mt-2 text-[0.9rem] leading-6 text-zinc-700">
              Des articles simples pour mieux comprendre votre santé.
            </p>
            <a href="/blogue" className="mt-4 inline-block text-[1rem] font-semibold text-red-600 hover:text-zinc-950 transition">
              Voir nos articles →
            </a>
          </div>


        </aside>
        </div>
      </section>

      {/* ─── Section 3 — CTA de clôture ──────────────────────────────── */}
      <section className="relative z-10 -mt-4 bg-[#f6f1e8] shadow-[0_-12px_32px_rgba(0,0,0,0.14)]">
        <ScrollReveal>
          <div className="mx-auto max-w-[1200px] border-t border-zinc-300 px-6 py-14 lg:px-8 lg:py-24">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="lg:max-w-[60%]">
                <p className="font-[var(--font-barlow-condensed)] text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">
                  Prêt à commencer
                </p>
                <h2 className="mt-4 font-[var(--font-barlow-condensed)] text-[clamp(1.75rem,5vw,3rem)] font-medium uppercase leading-[1.05] text-zinc-950">
                  Prenez rendez-vous dès aujourd&apos;hui
                </h2>
                <p className="mt-4 text-[1rem] leading-7 text-zinc-700">
                  Notre équipe vous accompagne à chaque étape de votre parcours vers un mieux-être durable.
                </p>
              </div>

              <a
                href={janeUrl || 'https://chiropratiquestroch.janeapp.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-[48px] items-center gap-3 border border-red-600 bg-red-600 px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-red-600"
              >
                <span className="whitespace-nowrap">Prendre rendez-vous</span>
                <svg aria-hidden="true" viewBox="0 0 44 10" className="h-2.5 w-8 transition duration-200 group-hover:translate-x-1">
                  <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                </svg>
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
