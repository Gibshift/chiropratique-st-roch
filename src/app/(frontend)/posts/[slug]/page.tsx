import { redirect } from 'next/navigation'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function OldPostRedirect({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)

  redirect(`/blogue/${encodeURIComponent(decodedSlug)}`)
}