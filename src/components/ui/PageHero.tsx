import Image from 'next/image'
import React from 'react'

interface PageHeroProps {
  title: string
  description?: string
  imageUrl?: string | null
  children?: React.ReactNode
}

export function PageHero({ title, description, imageUrl, children }: PageHeroProps) {
  return (
    <section className="relative bg-zinc-950 text-white">
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

      <div className="relative mx-auto max-w-[1200px] px-6 pt-36 pb-20 text-center lg:px-8 lg:pt-28">
        <h1 className="mx-auto max-w-[1000px] font-[var(--font-barlow-condensed)] text-[clamp(2.4rem,6vw,4.8rem)] font-medium uppercase leading-[0.9] tracking-[0.01em] text-white">
          {title}
        </h1>

        <div className="mx-auto mt-6 h-[3px] w-20 bg-red-600" />

        {description && (
          <p className="mx-auto mt-7 max-w-[540px] text-[1.05rem] leading-8 text-zinc-300">
            {description}
          </p>
        )}

        {children}
      </div>
    </section>
  )
}
