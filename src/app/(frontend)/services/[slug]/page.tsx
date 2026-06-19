import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ServiceDetailPage } from '@/components/services/ServiceDetailPage'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const services = await payload.find({
    collection: 'services' as any,
    limit: 100,
    depth: 0,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return services.docs.map((service: any) => ({
    slug: service.slug,
  }))
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'services' as any,
    limit: 1,
    depth: 0,
    where: {
      slug: {
        equals: decodedSlug,
      },
    },
  })

  const service: any = result.docs[0]

  if (!service) {
    return {
      title: 'Service | Chiropratique St-Roch',
    }
  }

  return {
    title: service.seo?.title || `${service.title} | Chiropratique St-Roch`,
    description: service.seo?.description || service.shortDescription,
  }
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)

  return <ServiceDetailPage slug={decodedSlug} />
}