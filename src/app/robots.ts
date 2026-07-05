import type { MetadataRoute } from 'next'

const siteUrl = 'https://www.chiropratiquestroch.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/media/', '/api/media/file/'],
        disallow: ['/admin/', '/api/', '/next/'],
      },
    ],
    sitemap: [
      `${siteUrl}/sitemap.xml`,
      `${siteUrl}/pages-sitemap.xml`,
      `${siteUrl}/posts-sitemap.xml`,
    ],
    host: siteUrl,
  }
}
