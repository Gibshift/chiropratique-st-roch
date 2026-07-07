import Image from 'next/image'
import React from 'react'

interface PageHeroProps {
  title: string
  eyebrow?: string
  description?: string
  imageUrl?: string | null
  highlight?: string[]
  ctaUrl?: string | null
  /** Décalage optique par ligne. Index 0 = ligne 1, index 1 = ligne 2, etc. Défaut: ['-0.08em', '0'] */
  lineOffsets?: string[]
  children?: React.ReactNode
}

function HighlightedTitle({ text, highlight, lineOffsets }: { text: string; highlight?: string[]; lineOffsets?: string[] }) {
  const targets = (highlight ?? []).map(w => w.replace(/[^a-zA-ZÀ-ÿ]/g, '').toLowerCase().trim())
  const defaultOffsets = ['-0.08em', '0']
  return (
    <>
      {text.split('\n').map((line, lineIdx) => {
        const offset = lineOffsets?.[lineIdx] ?? defaultOffsets[lineIdx] ?? '0'
        return (
          <span key={lineIdx} className="block" style={{ marginLeft: offset }}>
            {line.split(/(\s+)/).map((token, i) => {
              const clean = token.replace(/[^a-zA-ZÀ-ÿ]/g, '').toLowerCase()
              return targets.includes(clean)
                ? <span key={i} className="text-red-600">{token}</span>
                : <React.Fragment key={i}>{token}</React.Fragment>
            })}
          </span>
        )
      })}
    </>
  )
}

export function PageHero({ title, eyebrow, description, imageUrl, highlight, ctaUrl, lineOffsets, children }: PageHeroProps) {
  return (
    <section className="relative min-h-[82vh] overflow-hidden bg-[#f6f1e8] text-zinc-950">

      {imageUrl && (
        <div className="pointer-events-none absolute bottom-0 right-[6%] hidden w-[380px] h-[80%] lg:block">
          <Image src={imageUrl} alt="" fill sizes="380px" className="object-contain object-bottom" priority />
        </div>
      )}

      <div className="relative flex min-h-[70vh] w-full items-stretch px-6 lg:px-20 xl:px-28">
        <div className="flex w-full flex-col pt-60 pb-20 lg:max-w-[48%]">

          {eyebrow && (
            <p className="font-[var(--font-barlow-condensed)] text-[15px] font-medium uppercase tracking-[0.12em] text-red-600">
              {eyebrow}
            </p>
          )}

          <h1 className={`font-[var(--font-barlow-condensed)] text-[clamp(3.5rem,8vw,8rem)] font-medium uppercase leading-[1.0] text-zinc-950${eyebrow ? ' mt-3' : ''}`}>
            <HighlightedTitle text={title} highlight={highlight} lineOffsets={lineOffsets} />
          </h1>

          <div className="mt-7 h-[3px] w-20 bg-red-600" />

          {description && (
            <p className="mt-7 max-w-[480px] text-[1.25rem] leading-8 text-zinc-800">
              {description}
            </p>
          )}

          {ctaUrl && (
            <a href={ctaUrl} target="_blank" rel="noopener noreferrer"
              className="group mt-8 inline-flex w-fit min-h-[54px] items-center gap-4 border border-red-600 px-7 text-[13px] font-bold uppercase tracking-[0.16em] text-red-600 transition hover:bg-red-600 hover:text-white"
            >
              <span>Prendre rendez-vous</span>
              <svg aria-hidden="true" viewBox="0 0 44 10" className="h-3 w-9 transition duration-200 group-hover:translate-x-1">
                <path d="M1 5H40M35 1L40 5L35 9" fill="none" stroke="currentColor" strokeWidth="2.0" strokeLinecap="square" strokeLinejoin="miter" />
              </svg>
            </a>
          )}

          {children}
        </div>
      </div>
    </section>
  )
}
