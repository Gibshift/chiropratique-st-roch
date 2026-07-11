'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type HourEntry = { id?: string; day: string; hours: string }

const DAY_ORDER = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

function dayIndex(name: string): number {
  return DAY_ORDER.findIndex((d) => d.toLowerCase().startsWith(name.toLowerCase().slice(0, 3)))
}

function matchesDay(entryDay: string, todayIdx: number): boolean {
  const d = entryDay.trim()
  // Plage "Lundi au Vendredi" ou "Lundi à Vendredi"
  const range = d.match(/^(.+?)\s+(?:au?|à)\s+(.+)$/i)
  if (range) {
    const from = dayIndex(range[1])
    const to   = dayIndex(range[2])
    if (from !== -1 && to !== -1) return todayIdx >= from && todayIdx <= to
  }
  // Jour exact
  return dayIndex(d) === todayIdx
}

function getOpenStatus(openingHours: HourEntry[]): { open: boolean; todayHours: string | null } {
  const qc = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' }))
  const todayIdx = qc.getDay()

  const entry = openingHours.find((h) => matchesDay(h.day ?? '', todayIdx))
  if (!entry?.hours) return { open: false, todayHours: null }

  const h = entry.hours.trim()
  if (/ferm[eé]/i.test(h)) return { open: false, todayHours: h }

  // Supporte: 08H-20H / 08h30-15h / 9:00-17:00 / 9h à 17h / avec texte après (masso/kin)
  const m = h.match(/(\d{1,2})[hH:](\d{0,2})\s*(?:[-–—]|à)\s*(\d{1,2})[hH:](\d{0,2})/)
  if (!m) return { open: false, todayHours: h }

  const openMin  = parseInt(m[1]) * 60 + parseInt(m[2] || '0')
  const closeMin = parseInt(m[3]) * 60 + parseInt(m[4] || '0')
  const nowMin   = qc.getHours() * 60 + qc.getMinutes()

  return { open: nowMin >= openMin && nowMin < closeMin, todayHours: h }
}

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  }
  if (digits.length === 11 && digits[0] === '1') {
    return `${digits.slice(1, 4)}.${digits.slice(4, 7)}.${digits.slice(7)}`
  }
  return phone
}

export function InfoBar({
  phone,
  openingHours,
  scrolled,
  address,
}: {
  phone: string | null
  openingHours: HourEntry[]
  scrolled: boolean
  address: string | null
}) {
  const [status, setStatus] = useState<{ open: boolean; todayHours: string | null } | null>(null)

  useEffect(() => {
    setStatus(getOpenStatus(openingHours))
    const id = setInterval(() => setStatus(getOpenStatus(openingHours)), 60_000)
    return () => clearInterval(id)
  }, [openingHours])

  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        scrolled ? 'max-h-0' : 'max-h-[40px]'
      } bg-red-700`}
    >
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center py-[5px] text-[11px] text-white">

          {/* Gauche — téléphone */}
          <div className="flex items-center gap-4">
            {phone && (
              <a
                href={`tel:${phone.replace(/\D/g, '')}`}
                className="flex items-center gap-1.5 tracking-wide transition hover:text-red-200"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 shrink-0">
                  <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
                </svg>
                {formatPhone(phone)}
              </a>
            )}
            {status?.todayHours && (
              <span className="text-white">
                <span className="hidden sm:inline">Aujourd&apos;hui : </span>
                {status.todayHours}
              </span>
            )}
          </div>

          {/* Centre — adresse */}
          {address && (
            <Link
              href="/contact"
              className="hidden items-center justify-center gap-1.5 tracking-wide transition hover:text-red-200 md:flex"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 shrink-0">
                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
              </svg>
              {address}
            </Link>
          )}

          {/* Droite — statut ouvert/fermé */}
          {status && (
            <div className="flex items-center justify-end gap-1.5">
              <span
                className={`inline-block h-[7px] w-[7px] rounded-full ${
                  status.open ? 'bg-green-400' : 'bg-white'
                }`}
              />
              <span className="font-semibold uppercase tracking-[0.12em]">
                {status.open ? 'Ouvert' : 'Fermé'}
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
