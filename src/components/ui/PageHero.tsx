import React from 'react'

interface PageHeroProps {
  eyebrow: string
  title: string
  description?: string
  children?: React.ReactNode
}

export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="bg-zinc-950 text-white">
      <div className="mx-auto max-w-[1200px] px-6 pt-36 pb-20 lg:px-8 lg:pt-28">
        <p className="font-[var(--font-barlow-condensed)] text-[13px] font-medium uppercase tracking-[0.28em] text-red-500">
          {eyebrow}
        </p>

        <h1 className="mt-4 max-w-[720px] font-[var(--font-barlow-condensed)] text-[clamp(2.4rem,6vw,4.8rem)] font-medium uppercase leading-[0.9] tracking-[0.01em] text-white">
          {title}
        </h1>

        <div className="mt-6 h-[3px] w-20 bg-red-600" />

        {description && (
          <p className="mt-7 max-w-[540px] text-[1.05rem] leading-8 text-zinc-300">
            {description}
          </p>
        )}

        {children}
      </div>
    </section>
  )
}
