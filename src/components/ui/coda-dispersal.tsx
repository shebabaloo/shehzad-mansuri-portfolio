import { useEffect, useRef } from 'react'

/**
 * The Coda's closing gesture: note heads leaving the staff and dispersing off the right
 * edge, generated continuously rather than played once.
 *
 * This is the opening run backwards. The overture gathers a scattered particle field into a
 * staff; the Coda lets that staff go again, under the line that says the next movement is
 * still unwritten. The words and the image are making the same claim.
 *
 * Deliberately not a spray of musical glyphs. DESIGN.md lists music-note clip art as an
 * anti-pattern, and the reason holds: the clef and note heads already on this site read as
 * notation because they are typographic marks used sparingly. A field of sharps, flats, and
 * beamed quavers would read as decoration, and it would outrank the copy — which in the
 * Coda is the whole point of the section. So: note heads only, the same rotated ellipse the
 * passage toggle and the score rail already use, at low alpha, in the palette's own coral
 * and brass.
 *
 * Perpetual, so the cost matters. A fixed pool is recycled rather than allocated per frame,
 * the loop is suspended by IntersectionObserver whenever the Coda is off screen, and
 * prefers-reduced-motion renders one still frame and stops. Nothing here is scroll-linked,
 * so it never contends with ScrollTrigger.
 */

const POOL = 96
const FOCUS_X = 0.12 // the vanishing point the notes leave from, in canvas widths
const FOCUS_Y = 0.5

type Note = {
  life: number      // 0 at the focus, 1 once it has cleared the right edge
  speed: number
  spread: number    // vertical divergence, signed
  size: number
  tilt: number
  ring: boolean     // hollow note head rather than filled
  warm: boolean     // brass rather than coral
  wobble: number
}

const seed = (note: Note, atBirth: boolean) => {
  note.life = atBirth ? Math.random() : 0
  note.speed = 0.055 + Math.random() * 0.075
  note.spread = (Math.random() - 0.5) * 0.9
  note.size = 2.4 + Math.random() * 4.4
  note.tilt = -22 + (Math.random() - 0.5) * 26
  note.ring = Math.random() < 0.28
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

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const fx = width * FOCUS_X
      const fy = height * FOCUS_Y

      for (const note of notes) {
        // Travel accelerates with distance, so notes leave the focus slowly and stretch out
        // as they go — the divergence reads as depth rather than as a uniform conveyor.
        const eased = note.life * note.life
        const x = fx + eased * (width - fx) * 1.15
        const y = fy + eased * note.spread * height * 0.62
          + Math.sin(note.wobble + note.life * 3.2) * 6 * note.life

        // Fade in off the focus, hold, then fade out before the edge so nothing pops.
        const fadeIn = Math.min(1, note.life / 0.14)
        const fadeOut = 1 - Math.max(0, (note.life - 0.62) / 0.38)
        const alpha = fadeIn * fadeOut * 0.5

        if (alpha > 0.004 && x < width + 20) {
          const r = note.size * (0.55 + note.life * 0.9)
          ctx.save()
          ctx.translate(x, y)
          ctx.rotate((note.tilt * Math.PI) / 180)
          ctx.beginPath()
          ctx.ellipse(0, 0, r, r * 0.72, 0, 0, Math.PI * 2)
          const hue = note.warm ? '188, 151, 105' : '243, 94, 61'
          if (note.ring) {
            ctx.strokeStyle = `rgba(${hue}, ${alpha})`
            ctx.lineWidth = 1
            ctx.stroke()
          } else {
            ctx.fillStyle = `rgba(${hue}, ${alpha})`
            ctx.fill()
          }
          ctx.restore()
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
