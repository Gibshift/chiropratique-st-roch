import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#0a0a0a',
          color: '#ffffff',
          padding: '72px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '2px solid rgba(255,255,255,0.16)',
            borderRadius: '36px',
            padding: '64px',
            background:
              'linear-gradient(135deg, rgba(185,28,28,0.36), rgba(10,10,10,1) 48%, rgba(255,255,255,0.06))',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#fca5a5',
            }}
          >
            Clinique multidisciplinaire à Québec
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 86,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: '-0.05em',
              }}
            >
              Chiropratique
            </div>

            <div
              style={{
                display: 'flex',
                fontSize: 86,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: '-0.05em',
                color: '#ef4444',
              }}
            >
              St-Roch
            </div>

            <div
              style={{
                display: 'flex',
                marginTop: 36,
                fontSize: 34,
                color: '#e5e7eb',
              }}
            >
              Chiropratique · Ostéopathie · Massothérapie · Kinésithérapie · Orthothérapie
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 30,
              color: '#d4d4d8',
            }}
          >
            440 Rue Saint-Joseph E · Québec · 581.742.3808
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}