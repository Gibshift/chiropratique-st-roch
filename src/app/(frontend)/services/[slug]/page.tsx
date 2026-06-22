import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ServiceDetailPage } from '@/components/services/ServiceDetailPage'
import { getOpenGraphImages } from '@/utilities/seo'

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
    depth: 1,
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
      description:
        'Découvrez les services offerts par Chiropratique St-Roch, clinique multidisciplinaire située à Québec.',
    }
  }

  const title = service.seo?.title || `${service.title} à Québec`
  const description =
    service.seo?.description ||
    service.shortDescription ||
    `Découvrez le service ${service.title} offert chez Chiropratique St-Roch, multiclinique à Québec.`

  const url = `/services/${service.slug}`
  const images = getOpenGraphImages(service.featuredImage, service.title)

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

  return <ServiceDetailPage slug={decodedSlug} />
}