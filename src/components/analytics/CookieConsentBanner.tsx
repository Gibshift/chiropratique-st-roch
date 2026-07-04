'use client'

import Script from 'next/script'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const GA_ID = 'G-17QN781FBD'

export function CookieConsentBanner() {
  const [consent, setConsent] = useState<'accepted' | 'refused' | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('cookie_consent') as 'accepted' | 'refused' | null
    if (stored) {
      setConsent(stored)
    } else {
      setVisible(true)
    }
  }, [])

  function accept() {
    localStorage.setItem('cookie_consent', 'accepted')
    setConsent('accepted')
    setVisible(false)
  }

  function refuse() {
    localStorage.setItem('cookie_consent', 'refused')
    setConsent('refused')
    setVisible(false)
  }

  return (
    <>
      {consent === 'accepted' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}</Script>
        </>
      )}

      {visible && (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] border-t border-white/10 bg-zinc-950 px-6 py-5 shadow-[0_-8px_32px_rgba(0,0,0,0.4)]">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-zinc-300">
              Ce site utilise Google Analytics pour analyser le trafic de façon anonyme.{' '}
              <Link
                href="/politique-de-confidentialite"
                className="text-zinc-100 underline underline-offset-2 hover:text-white"
              >
                Politique de confidentialité
              </Link>
            </p>

            <div className="flex flex-shrink-0 items-center gap-4">
              <button
                onClick={refuse}
                className="text-sm text-zinc-400 transition hover:text-white"
              >
                Refuser
              </button>
              <button
                onClick={accept}
                className="bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Accepter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
