import { useEffect, useState, type ReactNode } from 'react'

/**
 * A mail link whose address never appears literally in the built bundle.
 *
 * This is a client-rendered app, so the served HTML is an empty shell and there is no
 * address in it to scrape. The bundle is a different matter: a plain `mailto:` string
 * would sit in the JavaScript, which is just as fetchable and one grep away. Storing it
 * encoded means a scraper has to decode every candidate string to find it, which the
 * pattern-matching kind does not do.
 *
 * The honest limit: anything driving a headless browser renders this page, and after
 * mount the address is in the DOM exactly as a user sees it. This reduces the volume of
 * low-effort harvesting; it is not protection.
 *
 * The href is set on mount rather than assembled on click so the element stays a real
 * link — copyable, right-clickable, and announced properly by a screen reader.
 */

// base64 of the address. Decoded at runtime; never written out in full anywhere in source.
const ENCODED = 'c2hlaHphZG03ODYxQGdtYWlsLmNvbQ=='

export function useMailHref() {
  const [href, setHref] = useState<string | undefined>()
  useEffect(() => {
    try {
      setHref(`mailto:${atob(ENCODED)}`)
    } catch {
      // If atob is unavailable the link simply stays inert rather than rendering a broken
      // address; the Coda's other two actions still work.
    }
  }, [])
  return href
}

export function MailLink({ children, className }: { children: ReactNode; className?: string }) {
  const href = useMailHref()
  return (
    <a className={className} href={href} aria-disabled={href ? undefined : true}>
      {children}
    </a>
  )
}
