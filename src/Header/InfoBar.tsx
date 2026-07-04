'use client'

import { useEffect, useState } from 'react'

type HourEntry = { id?: string; day: string; hours: string }

function getOpenStatus(openingHours: HourEntry[]): { open: boolean; todayHours: string | null } {
  const qc = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' }))
  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  const today = dayNames[qc.getDay()]

  const entry = openingHours.find((h) =>
    h.day?.toLowerCase().startsWith(today.toLowerCase().slice(0, 3)),
  )
  if (!entry?.hours) return { open: false, todayHours: null }

  const h = entry.hours
  if (/ferm[eé]/i.test(h)) return { open: false, todayHours: h }

  const m = h.match(/(\d+)[h:](\d*)\s*[-–]\s*(\d+)[h:](\d*)/)
  if (!m) return { open: false, todayHours: h }

  const openMin = parseInt(m[1]) * 60 + parseInt(m[2] || '0')
  const closeMin = parseInt(m[3]) * 60 + parseInt(m[4] || '0')
  const nowMin = qc.getHours() * 60 + qc.getMinutes()

  return { open: nowMin >= openMin && nowMin < closeMin, todayHours: h }
}

export function InfoBar({
  phone,
  openingHours,
  scrolled,
}: {
  phone: string | null
  openingHours: HourEntry[]
  scrolled: boolean
}) {
  const [status, setStatus] = useState<{ open: boolean; todayHours: string | null } | null>(null)

  useEffect(() => {
    setStatus(getOpenStatus(openingHours))
    const id = setInterval(() => setStatus(getOpenStatus(openingHours)), 60_000)
    return () => clearInterval(id)
  }, [openingHours])

  return (
    <div
      className={`overflow-hidden bg-red-700 transition-all duration-300 ease-in-out ${
        scrolled ? 'max-h-0' : 'max-h-[40px]'
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="flex items-center justify-between py-[5px] text-[11px] text-white">

          <div className="flex items-center gap-5">
            {phone && (
              <a
                href={`tel:${phone.replace(/\D/g, '')}`}
                className="tracking-wide transition hover:text-red-200"
              >
                {phone}
              </a>
            )}
            {status?.todayHours && (
              <span className="hidden text-red-200 sm:inline">
                Aujourd&apos;hui : {status.todayHours}
              </span>
            )}
          </div>

          {status && (
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-block h-[7px] w-[7px] rounded-full ${
                  status.open ? 'bg-green-400' : 'bg-red-300'
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
