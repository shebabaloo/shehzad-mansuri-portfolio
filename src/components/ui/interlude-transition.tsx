import { useEffect, useRef } from 'react'

/**
 * The seam between Movement IV and the Interlude: the staff curls, the way a clef does.
 *
 * A ghost clef sat behind this briefly, on the idea that the curl would thread it and so mean
 * something. It never read as one shape. The ribbon is a spiral defined by maths and the clef
 * is a font glyph, so the two can be placed near each other but never made to coincide — and
 * anything that nearly lines up reads worse than something that plainly does not. Removed.
 * If a reference shape is ever wanted here, it has to be a path the ribbon itself follows,
 * not a picture behind it.
 *
 * Two earlier attempts are worth recording, because they failed differently.
 *
 * The first was a ritardando — notes whose spacing widened toward a fermata. Good to describe,
 * bad to look at: widening spacing is a musician's idea of slowing down, but on the page it is
 * an uneven row of quarter notes, and a fermata is a nine-pixel arc nobody sees. It also reused
 * the Movement III seam's entire vocabulary, so changing the rhythm changed nothing.
 *
 * The second untied the staff — five taut lines going slack toward the right. Legible, but it
 * was the Coda's gesture again: that one also fans a bundle of staff lines open to the right.
 *
 * So the staff runs in flat, spirals once, and runs out flat. The spiral is a clef's — a curve
 * whose radius shrinks as it turns, wound around a point on the staff, which is what makes a
 * treble clef read as a clef rather than a circle. That shape is already on this site twice
 * over, in the opening lockup and in the cursor, so the seam is playful without leaving the
 * language everything else is written in.
 *
 * The five lines stay strictly parallel through the turn, offset along the path normal. That
 * rigidity is the whole trick: loosen them and a curl becomes a scribble.
 *
 * Ink hands off to cobalt across the width — the split the movement key has used for work
 * against personal since the overture. This is where the site stops talking about work.
 */

const STAFF_LINES = 5
const SEGMENTS = 300
/** Half-distance between outer lines, as a fraction of the band height. */
const RIBBON = 0.028
/** Where the flat entry ends and where the curl lets go again. */
const CURL_IN = 0.34
const CURL_OUT = 0.8
/** Exactly one turn. Anything else lands the exit off the staff line, which is what put a
    sharp kink in the first version — a clef spiral winds inward and stops, so it has no exit
    to give. */
const TURNS = 1
/** Loop radius, as a fraction of band height. */
const R_OUT = 0.34
/** How far the radius pinches at the top of the turn. This is what makes it calligraphic
    rather than a plain circle: a coaster loop holds its radius, a written curl does not. */
const PINCH = 0.32
/** Rightward drift across the curl, so the entry and exit do not sit on top of each other. */
const DRIFT = 0.05

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smoothstep = (v: number) => v * v * (3 - 2 * v)

/* The spine, in normalised band coordinates: flat, spiral, flat.
   The radius decays across the turn rather than holding constant — a constant radius gives a
   loop, and a shrinking one gives a clef. Angle runs clockwise from the bottom so the line
   rises on the right and winds inward toward the staff, the direction a clef is drawn. */
const spine = (s: number, aspect: number) => {
  /* The staff sits low so the loop has somewhere to go. The ceiling is exact: the outer
     ribbon line tops out at cy - R_OUT * (2 - PINCH) - 2 * RIBBON, and at cy = 0.6 that came
     to a negative number, which is why the loop was being shaved off by the band's edge. */
  const cy = 0.67
  const inX = 0.4
  if (s <= CURL_IN) return { x: (s / CURL_IN) * inX, y: cy }
  if (s >= CURL_OUT) {
    const t = (s - CURL_OUT) / (1 - CURL_OUT)
    const from = inX + DRIFT
    return { x: from + t * (1 - from), y: cy }
  }
  const t = (s - CURL_IN) / (CURL_OUT - CURL_IN)
  const theta = Math.PI / 2 - t * Math.PI * 2 * TURNS
  // Full radius at both ends, pinched through the middle: sin(theta) is +1 at t=0 and t=1,
  // so both meet the staff line exactly and the curl closes without a seam.
  const r = R_OUT * (1 - PINCH * Math.sin(Math.PI * t))
  const centreX = inX + t * DRIFT
  // The band is far wider than tall, so horizontal extent is divided by the aspect ratio;
  // without it the curl is a long flat ellipse rather than a round one.
  return {
    x: centreX + (r * Math.cos(theta)) / aspect,
    y: cy - R_OUT + r * Math.sin(theta),
  }
}

export function InterludeTransition() {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0
    let height = 0
    let progress = 0
    let ribbon: CanvasGradient | null = null

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      const w = Math.round(width * dpr)
      const h = Math.round(height * dpr)
      /* The guard covers the assignment only, which is the part that blanks the canvas. Zoom
         moves the ratio while the device-pixel size holds, so returning early here would
         strand the old scale and stop the clear covering the full backing store. */
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ribbon = ctx.createLinearGradient(0, 0, width, 0)
      ribbon.addColorStop(0, 'rgb(40, 34, 29)')
      ribbon.addColorStop(0.5, 'rgb(60, 60, 98)')
      ribbon.addColorStop(1, 'rgb(83, 118, 211)')
    }

    let dprQuery: MediaQueryList | null = null
    const onDprChange = () => { resize(); draw(); watchDpr() }
    const watchDpr = () => {
      dprQuery?.removeEventListener('change', onDprChange)
      dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
      dprQuery.addEventListener('change', onDprChange)
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      if (!ribbon || !width || !height) return

      /* Complete by about 0.78. A band this short is only wholly on screen across the middle
         of its own travel, so resolving at 1.0 puts the payoff above the fold — which is
         where the first attempt's fermata went to die. */
      const head = smoothstep(clamp01((progress - 0.04) / 0.74))
      if (head <= 0.001) return
      const aspect = width / height

      const point = (s: number, lane: number) => {
        const here = spine(s, aspect)
        // Offset along the path normal, so the lines stay parallel through the turn.
        const ahead = spine(Math.min(1, s + 0.003), aspect)
        const dx = (ahead.x - here.x) * aspect
        const dy = ahead.y - here.y
        const len = Math.hypot(dx, dy) || 1
        const off = lane * RIBBON
        return {
          x: (here.x + ((-dy / len) * off) / aspect) * width,
          y: (here.y + (dx / len) * off) * height,
        }
      }

      ctx.strokeStyle = ribbon
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = 1.05
      ctx.globalAlpha = 0.42

      const steps = Math.max(2, Math.round(SEGMENTS * head))
      for (let i = 0; i < STAFF_LINES; i++) {
        const lane = i - (STAFF_LINES - 1) / 2
        ctx.beginPath()
        for (let s = 0; s <= steps; s++) {
          const p = point(s / SEGMENTS, lane)
          if (s === 0) ctx.moveTo(p.x, p.y)
          else ctx.lineTo(p.x, p.y)
        }
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }

    let onScreen = false
    let queued = 0
    const measure = () => {
      queued = 0
      const rect = host.getBoundingClientRect()
      const span = rect.height + window.innerHeight
      progress = clamp01((window.innerHeight - rect.top) / span)
      draw()
    }
    const onScroll = () => {
      if (!onScreen || queued) return
      queued = requestAnimationFrame(measure)
    }
    const gate = new IntersectionObserver(
      ([entry]) => { onScreen = entry.isIntersecting; if (onScreen) measure() },
      { rootMargin: '100% 0px' },
    )
    gate.observe(host)

    resize()
    watchDpr()

    if (reduced.matches) {
      progress = 1
      draw()
      return () => { gate.disconnect(); dprQuery?.removeEventListener('change', onDprChange) }
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    const onResize = () => { resize(); measure() }
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      cancelAnimationFrame(queued)
      gate.disconnect()
      dprQuery?.removeEventListener('change', onDprChange)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="interlude-transition" ref={hostRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
