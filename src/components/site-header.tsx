import { ARROW_DOWN } from '@/lib/glyphs'
export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="monogram" href="#overture" aria-label="The Living Score, home">
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="16" cy="16" r="12" />
          <path d="M8 16h16M16 8v16" />
          <circle cx="16" cy="16" r="2.4" />
        </svg>
      </a>
      <p className="site-credit"><span>The Living Score</span> <i>by</i> Shez</p>
      <a className="open-score" href="#first-movement">Open the score <span>{ARROW_DOWN}</span></a>
    </header>
  )
}
