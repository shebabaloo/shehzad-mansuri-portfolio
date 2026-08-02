import { useEffect, useRef } from 'react'
import { drawNote, NOTE_KINDS, type NoteKind } from '@/lib/notation'

/**
 * The seam between Movement III and Movement IV.
 *
 * Both sections resolve to paper at this edge, so the join was a plain butt: one movement
 * stopped and the next began. This gives the page a breath between them, and it is the one
 * place on the site where the notation is scroll-driven rather than timed — the notes phase
 * in and out under the reader's own scrolling, so it reads as a passage being traversed
 * rather than an animation playing nearby.
 *
 * Ink rather than coral. Coral is the accent that marks what matters, and this marks
 * nothing: it is a rest between two arguments, and it should recede as the reader passes.
 *
 * Each note holds a phase, and its opacity is a bell curve over the distance between that
 * phase and scroll progress. Notes therefore arrive, hold and leave at staggered points
 * across the band rather than fading as one sheet.
 */

const COUNT = 26

type Note = {
  x: number       // 0–1 across the band
  y: number       // 0–1 down the band
  phase: number   // where in the scroll this note peaks
  size: number
  tilt: number
  kind: NoteKind
  flip: boolean
  drift: number   // vertical travel across its life, in canvas heights
}

// Deterministic, so the field is identical on every load and between reloads — a layout
// that reshuffles on refresh reads as noise rather than as design.
const mulberry = (seed: number) => () => {
  seed |= 0
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const build = (): Note[] => {
  const rand = mulberry(20260802)
  return Array.from({ length: COUNT }, () => ({
    x: 0.04 + rand() * 0.92,
    y: 0.08 + rand() * 0.84,
    phase: rand(),
    size: 4.5 + rand() * 7,
    tilt: -22 + (rand() - 0.5) * 26,
    kind: NOTE_KINDS[Math.floor(rand() * NOTE_KINDS.length)],
    flip: rand() < 0.42,
    drift: (rand() - 0.5) * 0.16,
  }))
}

export function MovementTransition() {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const notes = build()
    let width = 0
    let height = 0
    let progress = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      for (const note of notes) {
        // Bell curve around the note's phase: in, held, out. Widened slightly so the band
        // is never empty mid-scroll.
        const d = (progress - note.phase) / 0.34
        const alpha = Math.exp(-d * d) * 0.5
        if (alpha < 0.004) continue

        ctx.globalAlpha = alpha
        drawNote(ctx, {
          x: note.x * width,
          y: (note.y + note.drift * (progress - note.phase)) * height,
          r: note.size,
          kind: note.kind,
          tilt: note.tilt,
          flip: note.flip,
          color: 'oklch(24% .02 60)',
        })
      }
      ctx.globalAlpha = 1
    }

    // Progress is measured from the band's own position, not from a library — the whole
    // effect is one scalar, and a ScrollTrigger here would contend with the pinned
    // Movement II for refresh ordering on every resize.
    let queued = 0
    const measure = () => {
      queued = 0
      const rect = host.getBoundingClientRect()
      const span = rect.height + window.innerHeight
      progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / span))
      draw()
    }
    const onScroll = () => {
      if (!queued) queued = requestAnimationFrame(measure)
    }

    resize()
    if (reduced.matches) {
      // One still frame at the midpoint: the notes are present, nothing moves.
      progress = 0.5
      draw()
      return
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    const onResize = () => { resize(); measure() }
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      cancelAnimationFrame(queued)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="movement-transition" ref={hostRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
