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
    const overture = document.getElementById('overture')
    const intro = document.getElementById('first-movement')
    const coda = document.getElementById('coda')
    if (!overture || !intro) return

    /* Observers rather than scroll reads. This needs two booleans — is Movement I behind
       us, is the Coda here — and it was answering them by measuring two rects on every
       scroll frame of the whole page. Those reads land between the overture's style writes,
       and a read after a write forces the browser to lay out synchronously; doing it every
       frame is what turns a scroll into a stutter. IntersectionObserver reports the same two
       facts off the main thread, at the moments they change.

       But "at the moments they change" is the whole difficulty, and the first version of
       this got it wrong. An observer reports threshold *crossings*, so a state derived from
       one element is only correct if every move that should change it also crosses that
       element. Movement I fails that badly: jump from the top of the page to Movement IV —
       which is exactly what the score index's own links do — and Movement I is off screen
       before and after. Nothing crossed, the callback never ran, and the pill stayed hidden
       for the rest of the visit. The same jump backwards left it stranded visible at the top
       of the page, offering a way back to an index the reader was already looking at.

       The fix is to observe a region rather than a landmark. The overture and Movement I are
       contiguous and together span every position where the pill must be hidden, so "hidden"
       is simply "either of them is on screen" — and leaving that region necessarily changes
       one of the two. Whatever the reader does, however far they jump, at least one observer
       fires and the answer is recomputed from both. */
    let overtureVisible = true
    let introVisible = false
    let inCoda = false
    const apply = () => setShown(!overtureVisible && !introVisible && !inCoda)

    const overtureGate = new IntersectionObserver(
      ([entry]) => { overtureVisible = entry.isIntersecting; apply() },
      { threshold: 0 },
    )
    overtureGate.observe(overture)

    const introGate = new IntersectionObserver(
      ([entry]) => { introVisible = entry.isIntersecting; apply() },
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
      overtureGate.disconnect()
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
