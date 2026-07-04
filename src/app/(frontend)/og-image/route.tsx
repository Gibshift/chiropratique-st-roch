import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const pageTitle = searchParams.get('title')

  const showPageTitle = pageTitle && pageTitle !== 'Chiropratique St-Roch'

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
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#fca5a5',
            }}
          >
            {showPageTitle ? 'Chiropratique St-Roch' : 'Clinique multidisciplinaire à Québec'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {showPageTitle ? (
              <div
                style={{
                  display: 'flex',
                  fontSize: pageTitle.length > 40 ? 58 : 72,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  maxWidth: '900px',
                }}
              >
                {pageTitle}
              </div>
            ) : (
              <>
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
              </>
            )}

            <div
              style={{
                display: 'flex',
                marginTop: 32,
                fontSize: 30,
                color: '#e5e7eb',
              }}
            >
              {showPageTitle
                ? 'Chiropratique · Ostéopathie · Massothérapie · Kinésithérapie · Orthothérapie'
                : 'Chiropratique · Ostéopathie · Massothérapie · Kinésithérapie · Orthothérapie'}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 26,
              color: '#d4d4d8',
            }}
          >
            chiropratiquestroch.com · Québec
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