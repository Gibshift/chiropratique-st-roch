import type { Metadata } from 'next'

import { getServerSideURL } from '@/utilities/getURL'

type PayloadImage = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  sizes?: {
    og?: {
      url?: string | null
      width?: number | null
      height?: number | null
    } | null
    large?: {
      url?: string | null
      width?: number | null
      height?: number | null
    } | null
  } | null
}

export function getAbsoluteUrl(path?: string | null) {
  if (!path) return undefined

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const siteUrl = getServerSideURL().replace(/\/$/, '')
  const cleanPath = path.startsWith('/') ? path : `/${path}`

  return `${siteUrl}${cleanPath}`
}

export function getOpenGraphImages(
  image?: PayloadImage | string | number | null,
  fallbackAlt = 'Chiropratique St-Roch',
): Metadata['openGraph'] extends { images?: infer Images } ? Images : never {
  if (!image || typeof image !== 'object') {
    return undefined as never
  }

  const imageUrl =
    image.sizes?.og?.url ||
    image.sizes?.large?.url ||
    image.url

  const absoluteUrl = getAbsoluteUrl(imageUrl)

  if (!absoluteUrl) {
    return undefined as never
  }

  return [
    {
      url: absoluteUrl,
      width: image.sizes?.og?.width || image.width || 1200,
      height: image.sizes?.og?.height || image.height || 630,
      alt: image.alt || fallbackAlt,
    },
  ] as never
}