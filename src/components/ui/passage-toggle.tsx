import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * A note head that seats onto a staff line when pressed, opening a longer passage
 * beneath the measure it belongs to.
 *
 * This is the press-depth idea rebuilt in the site's own vocabulary. The reference
 * implementation used `motion/react`, which is a second animation system alongside GSAP
 * and would push the bundle past the brief's 150 KB ceiling. The whole effect here is
 * transform plus two custom properties, so it costs nothing.
 *
 * The obvious musical reading of press-depth is a piano key, which the brief bans. A note
 * head settling onto its line is the same physical gesture without the clip art, and it
 * rhymes with the cursor, where a note head already means "a note you can play".
 *
 * Inline disclosure, never a modal: the passage pushes the page down in place.
 */

type PassageToggleProps = {
  id: string
  open: boolean
  onToggle: () => void
  label?: string
  openLabel?: string
}

const TILT = 7

export function PassageToggle({
  id,
  open,
  onToggle,
  label = 'Read the passage',
  openLabel = 'Close the passage',
}: PassageToggleProps) {
  const [pressed, setPressed] = useState(false)
  const nodeRef = useRef<HTMLButtonElement | null>(null)
  const pointerRef = useRef<number | null>(null)

  const release = useCallback(() => {
    pointerRef.current = null
    setPressed(false)
    const node = nodeRef.current
    if (node) {
      node.style.removeProperty('--lean-x')
      node.style.removeProperty('--lean-y')
    }
  }, [])

  // The press survives the pointer leaving the button, so a drag-off cancels the lean
  // rather than sticking. Blur and tab-away release too.
  useEffect(() => {
    if (pointerRef.current === null) return
    const within = (event: PointerEvent) => {
      const node = nodeRef.current
      if (!node) return false
      const r = node.getBoundingClientRect()
      return event.clientX >= r.left && event.clientX <= r.right
        && event.clientY >= r.top && event.clientY <= r.bottom
    }
    const move = (event: PointerEvent) => {
      if (event.pointerId !== pointerRef.current) return
      setPressed(within(event))
    }
    const lift = (event: PointerEvent) => {
      if (event.pointerId !== pointerRef.current) return
      release()
    }
    const hidden = () => { if (document.hidden) release() }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', lift)
    window.addEventListener('pointercancel', lift)
    window.addEventListener('blur', release)
    document.addEventListener('visibilitychange', hidden)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', lift)
      window.removeEventListener('pointercancel', lift)
      window.removeEventListener('blur', release)
      document.removeEventListener('visibilitychange', hidden)
    }
  }, [pressed, release])

  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const r = event.currentTarget.getBoundingClientRect()
    const x = Math.max(-1, Math.min(1, ((event.clientX - r.left) / r.width) * 2 - 1))
    const y = Math.max(-1, Math.min(1, ((event.clientY - r.top) / r.height) * 2 - 1))
    event.currentTarget.style.setProperty('--lean-x', `${(x * TILT).toFixed(2)}deg`)
    event.currentTarget.style.setProperty('--lean-y', `${(-y * TILT).toFixed(2)}deg`)
    pointerRef.current = event.pointerId
    setPressed(true)
  }

  return (
    <button
      ref={nodeRef}
      type="button"
      className="passage-toggle"
      aria-expanded={open}
      aria-controls={id}
      data-pressed={pressed ? '' : undefined}
      onPointerDown={onPointerDown}
      onKeyDown={(e) => { if (!e.repeat && (e.key === ' ' || e.key === 'Enter')) setPressed(true) }}
      onKeyUp={() => setPressed(false)}
      onBlur={release}
      onClick={onToggle}
    >
      <span className="passage-toggle__staff" aria-hidden="true" />
      <span className="passage-toggle__note" aria-hidden="true" />
      <span className="passage-toggle__label">{open ? openLabel : label}</span>
    </button>
  )
}
