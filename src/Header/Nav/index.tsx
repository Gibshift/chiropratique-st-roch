'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex items-center gap-10">
      {navItems.map(({ link }, i) => {
        return (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className="font-[var(--font-barlow-condensed)] text-[15px] font-medium uppercase leading-none tracking-[0.2em] text-zinc-950 transition hover:text-red-700"
          />
        )
      })}
    </nav>
  )
}