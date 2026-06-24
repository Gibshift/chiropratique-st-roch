import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ConditionDetailPage } from '@/components/conditions/ConditionDetailPage'
import { getOpenGraphImages } from '@/utilities/seo'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const conditions = await payload.find({
    collection: 'conditions' as any,
    limit: 100,
    depth: 0,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return conditions.docs.map((condition: any) => ({
    slug: condition.slug,
  }))
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'conditions' as any,
    limit: 1,
    depth: 1,
    where: {
      slug: {
        equals: decodedSlug,
      },
    },
  })

  const condition: any = result.docs[0]

  if (!condition) {
    return {
      title: 'Condition traitée | Chiropratique St-Roch',
      description:
        'Découvrez les conditions traitées chez Chiropratique St-Roch, clinique multidisciplinaire située à Québec.',
    }
  }

  const title = condition.seo?.title || `${condition.title} à Québec`
  const description =
    condition.seo?.description ||
    condition.shortDescription ||
    `Découvrez des informations sur ${condition.title} et les soins offerts chez Chiropratique St-Roch à Québec.`

  const url = `/conditions-traitees/${condition.slug}`
  const images = getOpenGraphImages(condition.featuredImage, condition.title)

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
      type: 'article',
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

  return <ConditionDetailPage slug={decodedSlug} />
}