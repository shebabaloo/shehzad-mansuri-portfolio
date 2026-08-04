import { useEffect, useRef, useState } from 'react'
import { ARROW_UP } from '@/lib/glyphs'

/**
 * The way around, for readers who are not reading in order.
 *
 * This began as a pill that jumped back to the index inside Movement I, which made every
 * move a round trip: return to the index, wait for the scroll, find the link, wait again.
 * Fine for someone reading start to finish, useless for someone with three minutes who
 * wants Movement III. So the pill carries the index itself now — press it anywhere and the
 * movements are one tap away.
 *
 * It is the only persistent navigation the site has. The header's "Open the score" fades to
 * nothing a quarter of the way through the overture and never returns; the index in
 * Movement I is seen once; the rail's chapter links are transparent until focused and are
 * hidden below 860px entirely. This works on every viewport, from anywhere.
 *
 * The Prelude is deliberately not listed. Sending someone back to the top would replay the
 * whole opening animation, which is a punishment rather than a destination.
 *
 * It stays hidden until Movement I has been passed — the overture is the strongest thing on
 * the site and a floating control competes with it — and hides again inside the Coda, which
 * carries its own links.
 */

const movements = [
  { id: 'first-movement', numeral: 'I', label: 'A life in progress' },
  { id: 'work', numeral: 'II', label: 'Work in motion' },
  { id: 'systems', numeral: 'III', label: 'Systems that compound' },
  { id: 'experiments', numeral: 'IV', label: 'Ideas worth a first form' },
  { id: 'off-clock', numeral: 'V', label: 'Off the clock' },
  { id: 'coda', numeral: 'VI', label: 'Coda' },
]

export function JumpToIndex() {
  const [shown, setShown] = useState(false)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const openedByKeyboard = useRef(false)

  useEffect(() => {
    const overture = document.getElementById('overture')
    const intro = document.getElementById('first-movement')
    const coda = document.getElementById('coda')
    if (!overture || !intro) return

    /* Observers rather than scroll reads. This needs to know where the reader is, and it was
       answering by measuring rects on every scroll frame of the whole page. Those reads land
       between the overture's style writes, and a read after a write forces the browser to
       lay out synchronously; doing it every frame is what turns a scroll into a stutter.

       But "at the moments they change" is the difficulty, and the first version got it
       wrong. An observer reports threshold *crossings*, so a state derived from one element
       is only correct if every move that should change it also crosses that element.
       Movement I fails that badly: jump from the top of the page to Movement IV — which is
       exactly what the links below do — and Movement I is off screen before and after.
       Nothing crossed, the callback never ran, and the pill stayed hidden for the rest of
       the visit. The same jump backwards left it stranded at the top of the page.

       So observe a region rather than a landmark. The overture and Movement I are contiguous
       and together span every position where the pill must be hidden, so "hidden" is simply
       "either of them is on screen" — and leaving that region necessarily changes one of the
       two. However far the reader jumps, at least one observer fires. */
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
          // Fires while the Coda's own return links are still a scroll away.
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

  // A menu that outlives the control it hangs off would be orphaned on the screen.
  useEffect(() => { if (!shown) setOpen(false) }, [shown])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      // Escape must hand focus back, or a keyboard reader is left nowhere.
      toggleRef.current?.focus()
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)

    /* Move focus into the list only when the menu was opened from the keyboard. Doing it
       unconditionally put a focus ring on the first movement the instant a thumb opened the
       menu, which reads as "this one is selected" rather than "you are here" — the panel
       came up with Movement I apparently chosen. A pointer user is already looking at the
       list and does not need to be placed in it; a keyboard user does, or opening the menu
       leaves them nowhere. */
    if (openedByKeyboard.current) panelRef.current?.querySelector('a')?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <div className="jump-index" data-shown={shown} data-open={open} ref={rootRef}>
      <nav
        className="jump-index__panel"
        id="jump-index-panel"
        ref={panelRef}
        aria-label="Movements"
        // inert keeps the closed panel out of the tab order and off the accessibility tree
        // while still allowing it to transition, which `hidden` would not.
        inert={!open}
      >
        <p className="jump-index__caption">In this score</p>
        <ol>
          {movements.map((movement) => (
            <li key={movement.id}>
              <a href={`#${movement.id}`} onClick={() => setOpen(false)}>
                <b>{movement.numeral}</b>
                <span>{movement.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <button
        type="button"
        className="jump-index__toggle"
        ref={toggleRef}
        // detail is 0 for a click synthesised from Enter or Space, and the click count for a
        // real press — which is the cheapest honest way to tell the two apart.
        onClick={(event) => {
          openedByKeyboard.current = event.detail === 0
          setOpen((value) => !value)
        }}
        aria-expanded={open}
        aria-controls="jump-index-panel"
        // Hidden from the tab order while off screen, so a keyboard reader is not sent to a
        // control they cannot see.
        tabIndex={shown ? 0 : -1}
      >
        <span aria-hidden="true">{ARROW_UP}</span>
        <b>Score</b>
      </button>
    </div>
  )
}
