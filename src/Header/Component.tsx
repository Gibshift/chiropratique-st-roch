import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

const FALLBACK_JANE_URL = 'https://chiropratiquestroch.janeapp.com/embed/book_online'

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
      : FALLBACK_JANE_URL

  return <HeaderClient data={headerData} janeUrl={janeUrl} />
}