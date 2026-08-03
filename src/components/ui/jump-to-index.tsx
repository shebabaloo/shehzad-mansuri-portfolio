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

    /* Observers rather than scroll reads. This needs two booleans — is Movement I behind
       us, is the Coda here — and it was answering them by measuring two rects on every
       scroll frame of the whole page. Those reads land between the overture's style writes,
       and a read after a write forces the browser to lay out synchronously; doing it every
       frame is what turns a scroll into a stutter. IntersectionObserver reports the same two
       facts off the main thread, at the moments they change. */
    let pastIntro = false
    let inCoda = false
    const apply = () => setShown(pastIntro && !inCoda)

    const introGate = new IntersectionObserver(
      ([entry]) => {
        // Past it when it has left upward, rather than merely being off screen.
        pastIntro = !entry.isIntersecting && entry.boundingClientRect.bottom < 0
        apply()
      },
      { threshold: 0 },
    )
    introGate.observe(intro)

    const codaGate = coda
      ? new IntersectionObserver(
          ([entry]) => { inCoda = entry.isIntersecting; apply() },
          // Fires while the Coda's own return link is still a scroll away.
          { rootMargin: '0px 0px -40% 0px' },
        )
      : null
    codaGate?.observe(coda!)

    return () => {
      introGate.disconnect()
      codaGate?.disconnect()
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
