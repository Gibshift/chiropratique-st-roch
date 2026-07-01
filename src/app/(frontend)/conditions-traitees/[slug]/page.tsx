import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ConditionCategoryPage } from '@/components/conditions/ConditionCategoryPage'
import { getDefaultOpenGraphImages } from '@/utilities/seo'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'condition-categories' as any,
    limit: 50,
    depth: 0,
    pagination: false,
    select: { slug: true },
  })

  return categories.docs.map((cat: any) => ({ slug: cat.slug }))
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'condition-categories' as any,
    limit: 1,
    depth: 0,
    where: { slug: { equals: decodedSlug } },
  })

  const category: any = result.docs[0]

  if (!category) {
    return {
      title: 'Conditions traitées | Chiropratique St-Roch',
      description:
        'Découvrez les conditions traitées chez Chiropratique St-Roch, clinique multidisciplinaire à Québec.',
    }
  }

  const title =
    category.seo?.title ||
    `${category.title} | Chiropratique St-Roch à Québec`

  const description =
    category.seo?.description ||
    `Découvrez les conditions traitées dans la catégorie ${category.title} chez Chiropratique St-Roch à Québec.`

  const url = `/conditions-traitees/${category.slug}`

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
      images: getDefaultOpenGraphImages(title),
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: getDefaultOpenGraphImages(title),
    },
  }
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)

  return <ConditionCategoryPage slug={decodedSlug} />
}
