import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

type Particle = {
  arm: number
  u: number
  orbitRadius: number
  orbitAngle: number
  orbitSpeed: number
  drift: number
  size: number
  kind: number
  signal: number
}

export type SpiralScoreHandle = { setProgress: (progress: number) => void }

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const smoothstep = (value: number) => value * value * (3 - 2 * value)
const range = (value: number, start: number, end: number) => smoothstep(clamp((value - start) / (end - start)))
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount

const seeded = (index: number, salt = 0) => {
  const value = Math.sin(index * 91.717 + salt * 37.113) * 43758.5453
  return value - Math.floor(value)
}

const colors = {
  night: [24, 20, 17], paper: [249, 241, 226], ivory: [237, 228, 207],
  dusk: [105, 78, 56], ink: [40, 34, 29], brass: [177, 146, 102], coral: [220, 91, 67], cobalt: [83, 118, 211],
} as const

const rgba = (values: readonly number[], alpha = 1) => `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha})`
const blended = (from: readonly number[], to: readonly number[], amount: number, alpha = 1) =>
  rgba(from.map((value, index) => Math.round(mix(value, to[index], amount))), alpha)
const paperTransition = (amount: number) => amount < 0.36
  ? blended(colors.night, colors.dusk, amount / 0.36)
  : blended(colors.dusk, colors.paper, (amount - 0.36) / 0.64)

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, index) => ({
    arm: index % 5,
    u: Math.floor(index / 5) / Math.ceil(count / 5),
    orbitRadius: Math.sqrt(seeded(index, 1)) * 0.73,
    orbitAngle: seeded(index, 2) * Math.PI * 2,
    orbitSpeed: 0.018 + seeded(index, 7) * 0.035,
    drift: seeded(index, 3) * Math.PI * 2,
    size: 0.65 + seeded(index, 4) * 2.05,
    kind: seeded(index, 5),
    signal: seeded(index, 6),
  }))
}

export const SpiralScore = forwardRef<SpiralScoreHandle>(function SpiralScore(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(0)
  const particlesRef = useRef(makeParticles(1200))

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: true })
    if (!canvas || !context) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reducedMotion = motionQuery.matches
    let visible = true
    let frame = 0
    let animationFrame = 0
    const pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, active: 0 }
    const finePointer = window.matchMedia('(pointer: fine)').matches

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(bounds.width * dpr))
      canvas.height = Math.max(1, Math.round(bounds.height * dpr))
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    observer.observe(canvas)

    const spiralPoint = (arm: number, u: number, time: number) => {
      const radius = 0.025 + u * 0.32
      const angle = 1.05 + u * Math.PI * 3.65 + arm * 0.12 + time * 0.035
      return { x: 0.46 + Math.cos(angle) * radius, y: 0.56 + Math.sin(angle) * radius * 0.63 }
    }

    const staffPoint = (arm: number, u: number) => ({
      x: 0.06 + u * 0.9,
      y: 0.5 + (arm - 2) * 0.024 + Math.sin(u * Math.PI * 2.2) * 0.012 * (1 - u),
    })

    const railPoint = (arm: number, u: number) => ({
      x: 0.988 + (arm - 2) * 0.0021,
      y: 0.035 + u * 0.93,
    })

    const resolvePoint = (arm: number, u: number, progress: number, time: number) => {
      const spiral = spiralPoint(arm, u, time)
      const staff = staffPoint(arm, u)
      const rail = railPoint(arm, u)
      const toStaff = range(progress, 0.38, 0.72)
      const toRail = range(progress, 0.74, 0.92)
      return {
        x: mix(mix(spiral.x, staff.x, toStaff), rail.x, toRail),
        y: mix(mix(spiral.y, staff.y, toStaff), rail.y, toRail),
      }
    }

    const draw = () => {
      animationFrame = requestAnimationFrame(draw)
      if (!visible) return

      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (!width || !height) return

      const progress = reducedMotion ? 0.86 : progressRef.current
      const time = reducedMotion ? 0 : frame / 60
      const paperMix = range(progress, 0.78, 0.98)
      const pointerStrength = finePointer && !reducedMotion ? 1 - range(progress, 0, 0.12) : 0

      pointer.x += (pointer.targetX - pointer.x) * 0.075
      pointer.y += (pointer.targetY - pointer.y) * 0.075

      const risingPaper = context.createLinearGradient(0, 0, 0, height)
      risingPaper.addColorStop(0, paperTransition(paperMix * 0.74))
      risingPaper.addColorStop(0.56, paperTransition(paperMix * 0.9))
      risingPaper.addColorStop(1, paperTransition(paperMix))
      context.fillStyle = risingPaper
      context.fillRect(0, 0, width, height)

      const glow = context.createRadialGradient(width * 0.46, height * 0.56, 0, width * 0.46, height * 0.56, width * 0.44)
      glow.addColorStop(0, paperMix < 0.5 ? 'rgba(118,88,64,.13)' : 'rgba(255,250,236,.3)')
      glow.addColorStop(1, 'rgba(0,0,0,0)')
      context.fillStyle = glow
      context.fillRect(0, 0, width, height)

      const pathVisibility = range(progress, 0.22, 0.5) * (1 - range(progress, 0.91, 0.95))
      for (let arm = 0; arm < 5; arm += 1) {
        context.beginPath()
        for (let index = 0; index < 96; index += 1) {
          const u = index / 95
          const point = resolvePoint(arm, u, progress, time)
          if (index === 0) context.moveTo(point.x * width, point.y * height)
          else context.lineTo(point.x * width, point.y * height)
        }
        context.strokeStyle = blended(colors.brass, colors.ink, paperMix, pathVisibility * 0.5)
        context.lineWidth = 0.7 + range(progress, 0.42, 0.8) * 0.25
        context.stroke()
      }

      const gather = range(progress, 0.13, 0.38)
      const absorption = range(progress, 0.74, 0.93)
      for (const particle of particlesRef.current) {
        const destination = resolvePoint(particle.arm, particle.u, progress, time)
        const fieldAngle = particle.orbitAngle + time * particle.orbitSpeed
        let fieldX = 0.5 + Math.cos(fieldAngle) * particle.orbitRadius * 1.18
        let fieldY = 0.52 + Math.sin(fieldAngle) * particle.orbitRadius * 0.92
        const depth = clamp((particle.size - 0.65) / 2.05)
        fieldX += (pointer.x - 0.5) * (0.012 + depth * 0.026) * pointerStrength
        fieldY += (pointer.y - 0.5) * (0.009 + depth * 0.019) * pointerStrength

        const pointerDx = fieldX - pointer.x
        const pointerDy = fieldY - pointer.y
        const pointerDistance = Math.hypot(pointerDx, pointerDy)
        if (pointer.active > 0 && pointerDistance > 0.001 && pointerDistance < 0.17) {
          const repel = (1 - pointerDistance / 0.17) * 0.047 * pointerStrength * pointer.active
          fieldX += (pointerDx / pointerDistance) * repel
          fieldY += (pointerDy / pointerDistance) * repel
        }
        const localOrbit = 0.0025 + particle.size * 0.0012
        const ambientX = Math.cos(time * 0.17 + particle.drift) * localOrbit
        const ambientY = Math.sin(time * 0.17 + particle.drift) * localOrbit * 0.7
        const x = mix(fieldX + ambientX, destination.x, gather) * width
        const y = mix(fieldY + ambientY, destination.y, gather) * height
        const starClarity = gather < 0.24 && particle.kind > 0.78 ? 1.42 : 1
        const alpha = Math.min(0.92, (0.34 + gather * 0.5) * starClarity) * (1 - absorption)
        const base = paperMix > 0.45 ? colors.ink : colors.ivory
        const tone = particle.signal > 0.975 ? colors.cobalt : particle.signal > 0.91 ? colors.coral : base
        const size = particle.size * (0.72 + gather * 0.44)
        context.fillStyle = rgba(tone, alpha)
        context.strokeStyle = rgba(tone, alpha * 0.8)

        if (gather < 0.24) {
          context.beginPath()
          context.arc(x, y, size * (0.58 + particle.kind * 0.42), 0, Math.PI * 2)
          context.fill()
          if (particle.kind > 0.86) {
            const twinkle = (1 - gather / 0.24) * (0.35 + Math.sin(time * 1.2 + particle.drift) * 0.18)
            context.strokeStyle = rgba(tone, alpha * twinkle)
            context.lineWidth = 0.65
            context.beginPath()
            context.moveTo(x - size * 2.8, y); context.lineTo(x + size * 2.8, y)
            context.moveTo(x, y - size * 2.8); context.lineTo(x, y + size * 2.8)
            context.stroke()
          } else if (particle.kind > 0.74) {
            const tangentX = -Math.sin(fieldAngle) * (3 + particle.size * 2.4)
            const tangentY = Math.cos(fieldAngle) * (2 + particle.size * 1.5)
            context.strokeStyle = rgba(tone, alpha * 0.22)
            context.lineWidth = 0.55
            context.beginPath()
            context.moveTo(x - tangentX, y - tangentY)
            context.lineTo(x + tangentX, y + tangentY)
            context.stroke()
          }
        } else if (particle.kind < 0.66) {
          context.beginPath(); context.arc(x, y, size, 0, Math.PI * 2); context.fill()
        } else if (particle.kind < 0.81) {
          context.fillRect(x - size * 0.7, y - size * 0.7, size * 1.4, size * 1.4)
        } else if (particle.kind < 0.94) {
          context.lineWidth = Math.max(0.6, size * 0.44)
          context.beginPath(); context.moveTo(x, y - size * 2.8); context.lineTo(x, y + size * 2.8); context.stroke()
        } else {
          context.lineWidth = 0.7
          context.beginPath(); context.arc(x, y, size * 1.45, 0, Math.PI * 2); context.stroke()
        }
      }

      frame += 1
    }

    const onMotionChange = () => { reducedMotion = motionQuery.matches }
    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer) return
      pointer.targetX = clamp(event.clientX / Math.max(1, window.innerWidth))
      pointer.targetY = clamp(event.clientY / Math.max(1, window.innerHeight))
      pointer.active = 1
    }
    const onPointerLeave = () => {
      pointer.targetX = 0.5
      pointer.targetY = 0.5
      pointer.active = 0
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onPointerLeave)
    motionQuery.addEventListener('change', onMotionChange)
    animationFrame = requestAnimationFrame(draw)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      motionQuery.removeEventListener('change', onMotionChange)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  useImperativeHandle(ref, () => ({ setProgress: (progress) => { progressRef.current = clamp(progress) } }), [])

  return <canvas ref={canvasRef} className="spiral-canvas" aria-hidden="true" />
})
