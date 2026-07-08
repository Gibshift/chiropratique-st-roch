import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { JANE_BASE_URL } from '@/utilities/jane'

export async function Header() {
  const payload = await getPayload({ config: configPromise })

  const [headerData, siteSettings] = await Promise.all([
    getCachedGlobal('header', 1)(),
    payload.findGlobal({
      slug: 'site-settings' as any,
      depth: 0,
    }),
  ])

  const settings: any = siteSettings || {}

  const janeUrl =
    typeof settings.mainJaneUrl === 'string' && settings.mainJaneUrl.length > 0
      ? settings.mainJaneUrl
      : JANE_BASE_URL

  const phone: string | null = settings.phone || null
  const openingHours = Array.isArray(settings.openingHours) ? settings.openingHours : []
  const addr = settings.address || {}
  const address: string | null = [addr.street, addr.city, addr.province].filter(Boolean).join(', ') || null

  return <HeaderClient data={headerData} janeUrl={janeUrl} phone={phone} openingHours={openingHours} address={address} />
}