import Link from 'next/link'

type Crumb = { label: string; href?: string }

export function Breadcrumb({ crumbs, dark = false }: { crumbs: Crumb[]; dark?: boolean }) {
  const mutedColor  = dark ? 'text-white/40' : 'text-zinc-400'
  const activeColor = dark ? 'text-white/90' : 'text-zinc-950'
  const hoverColor  = dark ? 'hover:text-white' : 'hover:text-zinc-950'
  const sepColor    = dark ? 'text-white/20' : 'text-zinc-300'

  return (
    <nav className={`mb-6 flex flex-wrap items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.15em] ${mutedColor}`}>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className={sepColor}>›</span>}
          {crumb.href ? (
            <Link href={crumb.href} className={`transition ${hoverColor}`}>
              {crumb.label}
            </Link>
          ) : (
            <span className={`truncate max-w-[300px] ${activeColor}`}>{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
