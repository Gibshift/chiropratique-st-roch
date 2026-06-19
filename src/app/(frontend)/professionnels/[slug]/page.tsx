import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ProfessionalDetailPage } from '@/components/professionals/ProfessionalDetailPage'

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
    depth: 0,
    where: {
      slug: {
        equals: decodedSlug,
      },
    },
  })

  const professional: any = result.docs[0]

  if (!professional) {
    return {
      title: 'Professionnel | Chiropratique St-Roch',
    }
  }

  return {
    title: professional.seo?.title || `${professional.name} | Chiropratique St-Roch`,
    description: professional.seo?.description || professional.shortBio,
  }
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)

  return <ProfessionalDetailPage slug={decodedSlug} />
}