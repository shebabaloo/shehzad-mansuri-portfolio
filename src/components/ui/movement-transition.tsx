import { useEffect, useRef } from 'react'
import { drawNote, type NoteKind } from '@/lib/notation'

/**
 * The seam between Movement III and Movement IV: a run, played by scrolling.
 *
 * A first version scattered notes and cross-faded them on a wide curve. It read as still,
 * and for a structural reason rather than a tuning one — when every note is part-way
 * through a slow fade, nothing has a leading edge, and an effect with no leading edge has
 * no direction. Motion needs an event, not an average.
 *
 * So this is a run instead, played across a staff. The notes descend on a serpentine line
 * and are lit in sequence: each snaps on over under two percent of the band and decays fast
 * behind, which puts a bright head at the reader's scroll position with a short tail
 * chasing it. The staff wipes in first and stays a backdrop — the notes cross it rather
 * than sit on it, because pinning them to degrees made the run tidier and deader. Scroll
 * down and the run plays; scroll up and it unplays, because the whole thing is a pure
 * function of scroll position rather than a timeline.
 *
 * Ink, not coral. Coral marks what matters and this marks nothing — it is a rest between
 * two arguments, and it should be gone by the time the reader is reading again.
 */

const COUNT = 34
/** The head runs slightly past the end so the last notes still get their moment. */
const HEAD = 1.16
/** Decay length behind the head, in units of progress. Shorter reads as sharper. */
const TAIL = 0.11
/** Attack length. Small enough to snap, long enough not to alias into a flicker. */
const ATTACK = 0.018

type Note = {
  x: number
  y: number
  trigger: number
  size: number
  tilt: number
  kind: NoteKind
  flip: boolean
}

// Deterministic: a field that reshuffles on refresh reads as noise rather than design.
const mulberry = (seed: number) => () => {
  seed |= 0
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

/* Staff geometry, in fractions of the band. The five lines sit on tenths, so a half-gap
   step is exactly 0.05 — which is what lets the run land on real lines and spaces instead
   of floating near them. */
const STAFF_TOP = 0.3
const STAFF_GAP = 0.1
const STAFF_LINES = 5

/* The path is a serpentine descent rather than a quantised one. Pinning the notes to
   staff degrees made the run tidier and deader: every note the same distance from the
   last, every step the same size, which is a scale being recited rather than a run being
   played. The staff stays as a backdrop for the notes to cross, and the notes keep their
   own line — varied spacing, varied size, varied lean. Order still descends, so it reads
   downward; it just is not a ruler. */
const build = (): Note[] => {
  const rand = mulberry(20260802)
  const kinds: NoteKind[] = ['eighth', 'eighth', 'eighth', 'eighth', 'quarter', 'quarter', 'half']
  return Array.from({ length: COUNT }, (_, i) => {
    const t = i / (COUNT - 1)
    return {
      x: 0.5 + Math.sin(t * Math.PI * 2.1) * 0.3 + (rand() - 0.5) * 0.07,
      y: 0.05 + t * 0.9 + (rand() - 0.5) * 0.03,
      trigger: t,
      size: 5.5 + rand() * 4,
      tilt: -22 + (rand() - 0.5) * 20,
      kind: kinds[Math.floor(rand() * kinds.length)],
      flip: rand() < 0.4,
    }
  })
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

    /* The bar itself: five lines and two barlines, wiped in from the left ahead of the
       run so the staff is already there when the first note lands on it. */
    const drawStaff = (reveal: number) => {
      if (reveal <= 0) return
      const x2 = width * reveal
      ctx.strokeStyle = 'oklch(24% .02 60 / .16)'
      ctx.lineWidth = 1
      for (let i = 0; i < STAFF_LINES; i++) {
        const y = (STAFF_TOP + i * STAFF_GAP) * height
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(x2, y)
        ctx.stroke()
      }
      const top = STAFF_TOP * height
      const bottom = (STAFF_TOP + (STAFF_LINES - 1) * STAFF_GAP) * height
      for (const bx of [0.5, width - 0.5]) {
        if (bx > x2) continue
        ctx.beginPath()
        ctx.moveTo(bx, top)
        ctx.lineTo(bx, bottom)
        ctx.stroke()
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const lead = progress * HEAD
      // The staff arrives over the first eighth of the band, before the run reaches it.
      drawStaff(Math.min(1, progress / 0.12))

      for (const note of notes) {
        const d = lead - note.trigger
        if (d < 0) continue
        const attack = Math.min(1, d / ATTACK)
        const alpha = attack * Math.exp(-d / TAIL) * 0.62
        if (alpha < 0.006) continue

        ctx.globalAlpha = alpha
        drawNote(ctx, {
          x: note.x * width,
          y: note.y * height,
          // A touch of scale on the attack, so a note lands rather than merely appearing.
          r: note.size * (0.82 + 0.18 * attack),
          kind: note.kind,
          tilt: note.tilt,
          flip: note.flip,
          color: 'oklch(24% .02 60)',
        })
      }
      ctx.globalAlpha = 1
    }

    /* Progress comes from the band's own rect. ScrollTrigger would do this too, but it
       would also join the refresh ordering that the pinned Movement II already owns, and
       this needs no timeline — it is one scalar read per frame. */
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
      // The run, written out and held: every note at rest, nothing tied to scrolling.
      progress = 1 / HEAD
      ctx.clearRect(0, 0, width, height)
      drawStaff(1)
      for (const note of notes) {
        ctx.globalAlpha = 0.34
        drawNote(ctx, {
          x: note.x * width, y: note.y * height, r: note.size,
          kind: note.kind, tilt: note.tilt, flip: note.flip,
          color: 'oklch(24% .02 60)',
        })
      }
      ctx.globalAlpha = 1
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
