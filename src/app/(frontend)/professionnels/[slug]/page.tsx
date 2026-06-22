import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ProfessionalDetailPage } from '@/components/professionals/ProfessionalDetailPage'
import { getOpenGraphImages } from '@/utilities/seo'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const professionals = await payload.find({
    collection: 'professionals' as any,
    limit: 100,
    depth: 0,
    pagination: false,
    where: {
      isActive: {
        equals: true,
      },
    },
    select: {
      slug: true,
    },
  })

  return professionals.docs.map((professional: any) => ({
    slug: professional.slug,
  }))
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'professionals' as any,
    limit: 1,
    depth: 1,
    where: {
      and: [
        {
          slug: {
            equals: decodedSlug,
          },
        },
        {
          isActive: {
            equals: true,
          },
        },
      ],
    },
  })

  const professional: any = result.docs[0]

  if (!professional) {
    return {
      title: 'Professionnel | Chiropratique St-Roch',
      description:
        'Découvrez les professionnels de Chiropratique St-Roch, clinique multidisciplinaire située à Québec.',
    }
  }

  const title =
    professional.seo?.title ||
    `${professional.name} | ${professional.title} à Québec`

  const description =
    professional.seo?.description ||
    professional.shortBio ||
    `Découvrez le profil de ${professional.name}, ${professional.title}, chez Chiropratique St-Roch à Québec.`

  const url = `/professionnels/${professional.slug}`
  const images = getOpenGraphImages(professional.photo, professional.name)

  return {
    title,
    description,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description,
      url,
      type: 'profile',
      siteName: 'Chiropratique St-Roch',
      locale: 'fr_CA',
      images,
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  }
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)

  return <ProfessionalDetailPage slug={decodedSlug} />
}