import Image from 'next/image'
import React from 'react'

interface PageHeroProps {
  title: string
  description?: string
  imageUrl?: string | null
  pattern?: string
  children?: React.ReactNode
}

export function PageHero({ title, description, imageUrl, pattern, children }: PageHeroProps) {
  return (
    <section className="relative bg-[#f6f1e8] text-zinc-950">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
      )}

      <div className="relative mx-auto flex min-h-[820px] max-w-[1200px] flex-col items-center justify-center px-6 pt-36 text-center lg:px-8 lg:pt-16">
        <h1 className="mx-auto max-w-[1000px] font-[var(--font-barlow-condensed)] text-[clamp(2.4rem,6vw,4.8rem)] font-medium uppercase leading-[0.9] tracking-[0.01em] text-zinc-950">
          {title}
        </h1>

        <div className="mx-auto mt-6 h-[3px] w-20 bg-red-600" />

        {description && (
          <p className="mx-auto mt-7 max-w-[540px] text-[1.05rem] leading-8 text-zinc-600">
            {description}
          </p>
        )}

        {children}
      </div>
    </section>
  )
}
