'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex items-center gap-4">
      {navItems.map(({ link }, i) => {
        const isBlogue = link?.label?.toLowerCase() === 'blogue'

        return (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className={`font-[var(--font-barlow-condensed)] text-[13px] font-medium uppercase leading-none tracking-[0.1em] transition ${
              isBlogue ? 'text-red-600 hover:text-red-700' : 'text-zinc-950 hover:text-red-600'
            }`}
          />
        )
      })}
    </nav>
  )
}