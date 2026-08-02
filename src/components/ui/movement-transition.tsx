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
 * So this is a run instead. The notes are ordered into a descending line and lit in
 * sequence: each snaps on over about three percent of the band and decays behind, which
 * puts a bright head at the reader's scroll position with a tail of six or so notes
 * trailing it. Scroll down and the run plays downward; scroll up and it unplays, because
 * the whole thing is a pure function of scroll position rather than a timeline.
 *
 * Ink, not coral. Coral marks what matters and this marks nothing — it is a rest between
 * two arguments, and it should be gone by the time the reader is reading again.
 */

const COUNT = 34
/** The head runs slightly past the end so the last notes still get their moment. */
const HEAD = 1.16
/** Decay length behind the head, in units of progress. Shorter reads as sharper. */
const TAIL = 0.2
/** Attack length. Small enough to snap, long enough not to alias into a flicker. */
const ATTACK = 0.03

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

/* A run is stepwise, so these are placed on a path rather than scattered: y descends
   steadily with the index while x snakes across the band. The jitter is small on purpose —
   enough that it is not a ruler, not so much that the line stops reading as one gesture. */
const build = (): Note[] => {
  const rand = mulberry(20260802)
  // Eighths dominate, as they would in an actual run; a few quarters and halves break it up.
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

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const lead = progress * HEAD

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
