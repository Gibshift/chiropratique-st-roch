import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import RichText from '@/components/RichText'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { GeometricShapes } from '@/components/ui/GeometricShapes'

type Props = {
  slug: string
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

  return (
    <main className="relative bg-white text-zinc-950">
      <GeometricShapes />

      {/* Hero */}
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
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">
                  {professional.title || 'Professionnel'}
                </p>
                {professional.shortBio && (
                  <p className="mt-3 text-[1rem] leading-7 text-zinc-800">{professional.shortBio}</p>
                )}
              </div>
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* Contenu */}
      <section className="relative z-10 mx-auto max-w-[1200px] px-6 pb-24 lg:px-8">
        <div className="border-t border-zinc-400 pt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
        <article className="min-w-0">
          {professional.bio ? (
            <RichText data={professional.bio} enableGutter={false} />
          ) : (
            <p className="text-[1rem] leading-7 text-zinc-500">
              La biographie complète de ce professionnel pourra être ajoutée dans l&apos;admin.
            </p>
          )}

          {professional.relatedConditions?.length > 0 && (
            <div className="mt-12">
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-zinc-400">Conditions souvent traitées</p>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {professional.relatedConditions.map((condition: any) => (
                  <a
                    key={condition.id}
                    href="/conditions-traitees"
                    className="border border-zinc-400 bg-white p-5 font-semibold transition hover:border-zinc-950 hover:text-red-600"
                  >
                    {condition.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </article>

        <aside className="mt-12 flex flex-col gap-6 lg:mt-2 lg:sticky lg:top-28 lg:self-start">
          {photoUrl && (
            <div className="overflow-hidden border border-zinc-400">
              <img
                src={photoUrl}
                alt={professional.name}
                className="w-full object-cover object-top"
              />
            </div>
          )}

          <div className="border border-zinc-400 bg-white p-6">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.12em] text-zinc-950">Services</p>
            <p className="mt-2 text-[0.9rem] leading-6 text-zinc-700">
              Découvrez l&apos;ensemble des soins offerts à la clinique.
            </p>
            <a href="/services" className="mt-4 inline-block text-[1rem] font-semibold text-red-600 hover:text-zinc-950 transition">
              Voir nos services →
            </a>
          </div>

          <div className="border border-zinc-400 bg-white p-6">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.12em] text-zinc-950">Blogue</p>
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
    </main>
  )
}
