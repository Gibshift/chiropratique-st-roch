import configPromise from '@payload-config'
import { getPayload } from 'payload'

const FALLBACK_JANE_URL = 'https://chiropratiquestroch.janeapp.com/embed/book_online'

export async function FixedAppointmentButton() {
  let janeUrl = FALLBACK_JANE_URL

  try {
    const payload = await getPayload({ config: configPromise })

    const settings = await payload.findGlobal({
      slug: 'site-settings' as any,
      depth: 0,
    })

    if (
      settings &&
      typeof settings === 'object' &&
      'mainJaneUrl' in settings &&
      typeof settings.mainJaneUrl === 'string' &&
      settings.mainJaneUrl.trim().length > 0
    ) {
      janeUrl = settings.mainJaneUrl
    }
  } catch {
    janeUrl = FALLBACK_JANE_URL
  }

  return (
    <a
      href={janeUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Prendre rendez-vous en ligne"
      className="
        fixed bottom-4 left-4 right-4 z-50
        rounded-full bg-red-700 px-6 py-4
        text-center text-base font-semibold text-white
        shadow-lg transition
        hover:bg-red-800 hover:shadow-xl
        md:left-auto md:right-6 md:bottom-6 md:w-auto md:px-7
      "
    >
      Prendre rendez-vous
    </a>
  )
}