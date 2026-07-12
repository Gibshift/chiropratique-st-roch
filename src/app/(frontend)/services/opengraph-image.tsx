import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import path from 'path'

export const alt = 'Services — Chiropratique St-Roch'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const [watercolorData, imgData] = await Promise.all([
    readFile(path.join(process.cwd(), 'public/assets/salle-chiro-ville-fused-watercolor.png')),
    readFile(path.join(process.cwd(), 'public/assets/famille-contact-ordinateur-siteweb.png')),
  ])
  const watercolorSrc = `data:image/png;base64,${watercolorData.toString('base64')}`
  const imgSrc = `data:image/png;base64,${imgData.toString('base64')}`

  return new ImageResponse(
    (
      <div style={{ width: '1200px', height: '630px', display: 'flex', backgroundColor: '#ffffff', position: 'relative' }}>

        {/* Fond aquarelle très pâle */}
        <img src={watercolorSrc} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12 }} />

        {/* Illustration droite */}
        <img src={imgSrc} style={{ position: 'absolute', right: 0, top: 0, width: '520px', height: '100%', objectFit: 'contain', objectPosition: 'right bottom', opacity: 0.92 }} />


        {/* Texte gauche */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px', width: '680px', position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.16em', color: '#dc2626' }}>
            Services
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 16 }}>
            <span style={{ fontSize: 88, fontWeight: 700, textTransform: 'uppercase', lineHeight: 1, color: '#18181b' }}>Découvrez</span>
            <span style={{ fontSize: 88, fontWeight: 700, textTransform: 'uppercase', lineHeight: 1, color: '#18181b' }}>Nos soins.</span>
          </div>
          <div style={{ width: 56, height: 3, backgroundColor: '#dc2626', marginTop: 28 }} />
          <span style={{ fontSize: 18, color: '#71717a', marginTop: 24 }}>Chiropratique St-Roch · Québec</span>
        </div>

      </div>
    ),
    { width: 1200, height: 630 },
  )
}
