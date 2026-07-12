import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import path from 'path'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const alt = 'Chiropratique St-Roch — Article'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Args = { params: Promise<{ slug: string }> }

export default async function Image({ params }: Args) {
  const { slug } = await params
  const [watercolorData, payload] = await Promise.all([
    readFile(path.join(process.cwd(), 'public/assets/salle-chiro-ville-fused-watercolor.png')),
    getPayload({ config: configPromise }),
  ])
  const watercolorSrc = `data:image/png;base64,${watercolorData.toString('base64')}`

  const result = await payload.find({
    collection: 'posts',
    limit: 1,
    where: { slug: { equals: decodeURIComponent(slug) } },
    select: { title: true },
  })

  const title = result.docs?.[0]?.title ?? 'Article'
  const fontSize = title.length > 70 ? 48 : title.length > 50 ? 58 : title.length > 35 ? 68 : 80

  return new ImageResponse(
    (
      <div style={{ width: '1200px', height: '630px', display: 'flex', backgroundColor: '#f6f1e8', position: 'relative' }}>

        {/* Fond aquarelle très pâle */}
        <img src={watercolorSrc} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12 }} />

        {/* Bande rouge gauche */}
        <div style={{ width: '8px', height: '100%', backgroundColor: '#dc2626', display: 'flex', flexShrink: 0, position: 'relative', zIndex: 1 }} />

        {/* Contenu */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: '64px 80px', position: 'relative', zIndex: 1 }}>

          {/* Haut */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#dc2626' }}>
              Blogue santé
            </span>
            <div style={{ width: '32px', height: '1px', backgroundColor: '#dc2626', display: 'flex' }} />
            <span style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#a3a3a3' }}>
              Chiropratique St-Roch
            </span>
          </div>

          {/* Titre */}
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', paddingTop: '32px', paddingBottom: '32px' }}>
            <h1 style={{ fontSize, fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.1, color: '#18181b', margin: 0, maxWidth: '1000px' }}>
              {title}
            </h1>
          </div>

          {/* Bas */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '3px', backgroundColor: '#dc2626', display: 'flex' }} />
            <span style={{ fontSize: 14, color: '#71717a', letterSpacing: '0.06em' }}>chiropratiquestroch.com</span>
          </div>

        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
