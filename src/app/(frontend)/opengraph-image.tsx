import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import path from 'path'

export const alt = 'Chiropratique St-Roch — Clinique multidisciplinaire à Québec'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const heroData = await readFile(
    path.join(process.cwd(), 'public/assets/salle-chiro-ville-fused-watercolor.png'),
  )
  const heroSrc = `data:image/png;base64,${heroData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          position: 'relative',
          backgroundColor: '#f6f1e8',
        }}
      >
        {/* Image de fond */}
        <img
          src={heroSrc}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Voile blanc semi-transparent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255,255,255,0.72)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0px',
            }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: '#dc2626',
                margin: 0,
                marginBottom: 20,
              }}
            >
              Soins manuels · corps en mouvement
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
              <span
                style={{
                  fontSize: 100,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#18181b',
                  lineHeight: 1,
                }}
              >
                Chiropratique
              </span>
              <span
                style={{
                  fontSize: 100,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#dc2626',
                  lineHeight: 1,
                }}
              >
                St-Roch
              </span>
            </div>

            <p
              style={{
                fontSize: 22,
                color: '#52525b',
                margin: 0,
                marginTop: 28,
              }}
            >
              Une clinique, plusieurs disciplines, une seule priorité : vous.
            </p>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
