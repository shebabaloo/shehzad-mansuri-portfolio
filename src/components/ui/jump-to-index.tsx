import { useEffect, useState } from 'react'
import { ARROW_UP } from '@/lib/glyphs'

/**
 * A way back, for phones only.
 *
 * The score rail carries chapter jump links on a desktop, but they are display:none under
 * 860px — six tap targets will not fit in a 4px bar. That left a phone reader mid-page with
 * no route anywhere except scrolling: the header has faded out by then, and the only other
 * link back sits at the very bottom of the Coda.
 *
 * It points at #score-index rather than the top of the page, because the index is the thing
 * that is actually useful — every movement, one tap away. Returning someone to the opening
 * animation would make them scroll through it again.
 *
 * It stays hidden until Movement I has been passed, and hides again inside the Coda, which
 * carries its own return link and does not need two.
 */
export function JumpToIndex() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const intro = document.getElementById('first-movement')
    const coda = document.getElementById('coda')
    if (!intro) return

    // Scroll fires far more often than this needs to run, and it runs alongside
    // ScrollTrigger — so reads are coalesced into one frame rather than done per event.
    let queued = 0
    const update = () => {
      queued = 0
      const pastIntro = intro.getBoundingClientRect().bottom < 0
      const inCoda = coda ? coda.getBoundingClientRect().top < window.innerHeight * 0.6 : false
      setShown(pastIntro && !inCoda)
    }
    const onScroll = () => {
      if (!queued) queued = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(queued)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <a
      className="jump-index"
      href="#score-index"
      data-shown={shown}
      aria-label="Back to the score index"
      // Hidden from the tab order while off screen, so a keyboard reader is not sent to a
      // control they cannot see.
      tabIndex={shown ? 0 : -1}
    >
      <span aria-hidden="true">{ARROW_UP}</span>
      <b>Score</b>
    </a>
  )
}
