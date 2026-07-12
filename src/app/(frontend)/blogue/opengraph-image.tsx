import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import path from 'path'

export const alt = 'Blogue santé — Chiropratique St-Roch'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const watercolorData = await readFile(
    path.join(process.cwd(), 'public/assets/salle-chiro-ville-fused-watercolor.png'),
  )
  const watercolorSrc = `data:image/png;base64,${watercolorData.toString('base64')}`

  return new ImageResponse(
    (
      <div style={{ width: '1200px', height: '630px', display: 'flex', backgroundColor: '#f6f1e8', position: 'relative' }}>

        <img src={watercolorSrc} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12 }} />

        <div style={{ width: '8px', height: '100%', backgroundColor: '#dc2626', display: 'flex', flexShrink: 0, position: 'relative', zIndex: 1 }} />

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: '64px 80px', position: 'relative', zIndex: 1 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#dc2626' }}>
              Blogue
            </span>
            <div style={{ width: '32px', height: '1px', backgroundColor: '#dc2626', display: 'flex' }} />
            <span style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#a3a3a3' }}>
              Chiropratique St-Roch
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 96, fontWeight: 700, textTransform: 'uppercase', lineHeight: 1, color: '#18181b' }}>Blogue</span>
            <span style={{ fontSize: 96, fontWeight: 700, textTransform: 'uppercase', lineHeight: 1, color: '#18181b' }}>santé.</span>
          </div>

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
