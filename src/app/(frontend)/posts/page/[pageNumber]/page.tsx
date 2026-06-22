import { permanentRedirect } from 'next/navigation'

export default function OldPostsPaginationRedirect() {
  permanentRedirect('/blogue')
}