import React from 'react'

type Hold = { type: 'circle' | 'square' | 'triangle'; x: string; y: string; size: number; rotate: number }

const defaultHolds: Hold[] = [
  // Marge gauche (5%-20%)
  { type: 'circle',   x: '6%',  y: '10%', size: 8, rotate: 0   },
  { type: 'square',   x: '14%', y: '22%', size: 7, rotate: 25  },
  { type: 'triangle', x: '8%',  y: '35%', size: 9, rotate: 10  },
  { type: 'circle',   x: '18%', y: '48%', size: 6, rotate: 0   },
  { type: 'square',   x: '5%',  y: '60%', size: 7, rotate: 45  },
  { type: 'triangle', x: '6%',  y: '72%', size: 6, rotate: -15 },
  { type: 'circle',   x: '16%', y: '82%', size: 8, rotate: 0   },
  { type: 'square',   x: '17%', y: '15%', size: 6, rotate: 30  },
  { type: 'triangle', x: '11%', y: '55%', size: 7, rotate: 20  },
  { type: 'circle',   x: '19%', y: '30%', size: 6, rotate: 0   },
  { type: 'square',   x: '7%',  y: '90%', size: 7, rotate: -20 },
  { type: 'triangle', x: '15%', y: '67%', size: 8, rotate: 35  },
  { type: 'circle',   x: '13%', y: '42%', size: 6, rotate: 0   },
  { type: 'square',   x: '9%',  y: '78%', size: 7, rotate: 15  },
  // Marge droite (80%-95%)
  { type: 'triangle', x: '81%', y: '12%', size: 8, rotate: -10 },
  { type: 'circle',   x: '90%', y: '25%', size: 7, rotate: 0   },
  { type: 'square',   x: '92%', y: '38%', size: 9, rotate: -20 },
  { type: 'triangle', x: '93%', y: '50%', size: 6, rotate: 30  },
  { type: 'circle',   x: '87%', y: '62%', size: 8, rotate: 0   },
  { type: 'square',   x: '95%', y: '20%', size: 6, rotate: 15  },
  { type: 'triangle', x: '82%', y: '74%', size: 7, rotate: -5  },
  { type: 'circle',   x: '92%', y: '85%', size: 6, rotate: 0   },
  { type: 'square',   x: '88%', y: '45%', size: 7, rotate: 40  },
  { type: 'triangle', x: '80%', y: '32%', size: 8, rotate: 20  },
  { type: 'circle',   x: '94%', y: '68%', size: 7, rotate: 0   },
  { type: 'square',   x: '86%', y: '90%', size: 6, rotate: -30 },
  { type: 'triangle', x: '91%', y: '8%',  size: 7, rotate: 45  },
  { type: 'circle',   x: '83%', y: '55%', size: 9, rotate: 0   },
]

export function GeometricShapes({ holds = defaultHolds }: { holds?: Hold[] }) {
  return (
    <div className="hidden min-[1200px]:block pointer-events-none absolute inset-0 z-0" aria-hidden>
      {holds.map((h, i) => {
        const s = h.size
        const style: React.CSSProperties = {
          position: 'absolute',
          left: h.x,
          top: h.y,
          transform: `rotate(${h.rotate}deg)`,
          opacity: 0.22,
        }
        if (h.type === 'circle') return (
          <svg key={i} style={style} width={s} height={s} viewBox="0 0 10 10">
            <circle cx="5" cy="5" r="4" fill="none" stroke="#18181b" strokeWidth="1.5" />
          </svg>
        )
        if (h.type === 'square') return (
          <svg key={i} style={style} width={s} height={s} viewBox="0 0 10 10">
            <rect x="1" y="1" width="8" height="8" fill="none" stroke="#18181b" strokeWidth="1.5" />
          </svg>
        )
        return (
          <svg key={i} style={style} width={s} height={s} viewBox="0 0 10 10">
            <polygon points="5,1 9,9 1,9" fill="none" stroke="#18181b" strokeWidth="1.5" />
          </svg>
        )
      })}
    </div>
  )
}
