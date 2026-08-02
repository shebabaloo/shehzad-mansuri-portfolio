import { useEffect, useRef } from 'react'
import { drawNote, NOTE_KINDS, type NoteKind } from '@/lib/notation'

/**
 * Musical notes dispersing rightward from the Coda — eighths, quarters, halves, and lone
 * heads, each with a properly oriented stem and (for eighths) a flag. Low alpha, coral and
 * brass only, so notation reads as texture rather than clip-art.
 *
 * Perpetual, so the cost matters. A fixed pool is recycled rather than allocated per frame,
 * the loop is suspended by IntersectionObserver whenever the Coda is off screen, and
 * prefers-reduced-motion renders one still frame and stops.
 */

const POOL = 96
const FOCUS_X = 0.38
const FOCUS_Y = 0.5
const STAFF_LINES = 5
const STAFF_INITIAL = 5     // half-spread at x=0, in CSS px — tight bundle
const STAFF_FAN = 0.34       // half-spread at x=width, as fraction of canvas height


type Note = {
  life: number
  speed: number
  spread: number
  size: number
  tilt: number
  kind: NoteKind
  flip: boolean     // stem down from left edge rather than up from right
  warm: boolean
  wobble: number
}

const seed = (note: Note, atBirth: boolean) => {
  note.life = atBirth ? Math.random() : 0
  note.speed = 0.055 + Math.random() * 0.075
  note.spread = (Math.random() - 0.5) * 0.9
  note.size = 2.4 + Math.random() * 4.4
  note.tilt = -22 + (Math.random() - 0.5) * 26
  note.kind = NOTE_KINDS[Math.floor(Math.random() * NOTE_KINDS.length)]
  note.flip = Math.random() < 0.42
  note.warm = Math.random() < 0.42
  note.wobble = Math.random() * Math.PI * 2
}

export function CodaDispersal() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0
    let height = 0
    let dpr = 1

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const notes: Note[] = Array.from({ length: POOL }, () => {
      const note = { } as Note
      seed(note, true)
      return note
    })

    const paint = (x: number, y: number, note: Note, alpha: number) => {
      ctx.globalAlpha = alpha
      drawNote(ctx, {
        x, y,
        r: note.size * (0.55 + note.life * 0.9),
        kind: note.kind,
        tilt: note.tilt,
        flip: note.flip,
        color: note.warm ? 'rgb(188, 151, 105)' : 'rgb(243, 94, 61)',
      })
      ctx.globalAlpha = 1
    }

    let time = 0

    // The staff fans from a tight bundle on the left into an open funnel on the right, and
    // wobbles more the further it travels — the notes leave through the widening gap.
    const drawStaff = () => {
      const cy = height * FOCUS_Y
      const maxSpread = height * STAFF_FAN
      const segments = 80

      for (let i = 0; i < STAFF_LINES; i++) {
        const norm = (i - (STAFF_LINES - 1) / 2) / ((STAFF_LINES - 1) / 2)

        ctx.beginPath()
        for (let s = 0; s <= segments; s++) {
          const t = s / segments
          const x = t * width
          const spread = STAFF_INITIAL + (maxSpread - STAFF_INITIAL) * t * t
          const wave = Math.sin(x * 0.007 + time * 0.55 + i * 1.3) * (2 + t * 10) * t
          const y = cy + norm * spread + wave
          if (s === 0) { ctx.moveTo(x, y) } else { ctx.lineTo(x, y) }
        }

        ctx.strokeStyle = 'rgba(188, 151, 105, 0.2)'
        ctx.lineWidth = 0.8
        ctx.stroke()
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      drawStaff()

      const fx = width * FOCUS_X
      const fy = height * FOCUS_Y

      for (const note of notes) {
        const eased = note.life * note.life
        const x = fx + eased * (width - fx) * 1.15
        const y = fy + eased * note.spread * height * 0.62
          + Math.sin(note.wobble + note.life * 3.2) * 6 * note.life

        const fadeIn = Math.min(1, note.life / 0.14)
        const fadeOut = 1 - Math.max(0, (note.life - 0.62) / 0.38)
        const alpha = fadeIn * fadeOut * 0.5

        if (alpha > 0.004 && x < width + 20) {
          paint(x, y, note, alpha)
        }
      }
    }

    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      // Delta-timed so the drift is the same on 60Hz and 120Hz, and so a backgrounded tab
      // returning does not jump the whole field forward at once.
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      time += dt
      for (const note of notes) {
        note.life += note.speed * dt
        if (note.life >= 1) seed(note, false)
      }
      draw()
      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (raf || reduced.matches) return
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    resize()
    draw() // one still frame, which is also the whole of the reduced-motion treatment

    // Only animate while the Coda is actually on screen.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: '120px' },
    )
    io.observe(canvas)

    const onResize = () => { resize(); draw() }
    const onMotionChange = () => { if (reduced.matches) { stop(); draw() } else start() }
    const onVisibility = () => (document.hidden ? stop() : start())
    window.addEventListener('resize', onResize)
    reduced.addEventListener('change', onMotionChange)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      io.disconnect()
      window.removeEventListener('resize', onResize)
      reduced.removeEventListener('change', onMotionChange)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} className="coda-dispersal" aria-hidden="true" />
}
