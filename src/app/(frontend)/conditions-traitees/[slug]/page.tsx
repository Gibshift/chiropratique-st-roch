import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ConditionDetailPage } from '@/components/conditions/ConditionDetailPage'

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
    depth: 0,
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
    }
  }

  return {
    title: condition.seo?.title || `${condition.title} | Chiropratique St-Roch`,
    description: condition.seo?.description || condition.shortDescription,
  }
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)

  return <ConditionDetailPage slug={decodedSlug} />
}