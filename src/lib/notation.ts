/**
 * Note drawing, shared by the Coda's dispersal and the Movement III–IV transition.
 *
 * It lives here rather than in either component because two canvases drawing the same
 * notation by two sets of numbers will drift the moment one is touched — and a portfolio
 * whose whole conceit is a musical score cannot afford quavers that disagree with each
 * other about where a flag sits.
 *
 * The one rule worth stating: the head leans and the stem stays upright. That is real
 * engraving convention, and it is what keeps these reading as notation rather than as
 * ovals with sticks attached.
 */

export type NoteKind = 'eighth' | 'quarter' | 'half' | 'head'

/** Weighted so eighths and quarters dominate, as they would on a real page. */
export const NOTE_KINDS: NoteKind[] = [
  'eighth', 'eighth', 'eighth', 'eighth', 'eighth', 'eighth', 'eighth',
  'quarter', 'quarter', 'quarter', 'quarter', 'quarter', 'quarter',
  'half', 'half',
  'head', 'head', 'head',
]

type DrawOptions = {
  x: number
  y: number
  /** Head radius. Stem and flag scale from it, so this is the only size input. */
  r: number
  kind: NoteKind
  /** Head lean, in degrees. The stem ignores it. */
  tilt: number
  /** Stem down from the left edge rather than up from the right. */
  flip: boolean
  /** Any CSS colour. Alpha is applied by the caller via globalAlpha. */
  color: string
}

export function drawNote(
  ctx: CanvasRenderingContext2D,
  { x, y, r, kind, tilt, flip, color }: DrawOptions,
) {
  const stemH = r * 3.6
  const tiltRad = (tilt * Math.PI) / 180

  ctx.save()
  ctx.translate(x, y)

  // Head
  ctx.save()
  ctx.rotate(tiltRad)
  ctx.beginPath()
  ctx.ellipse(0, 0, r, r * 0.68, 0, 0, Math.PI * 2)
  if (kind === 'half') {
    ctx.strokeStyle = color
    ctx.lineWidth = r * 0.28
    ctx.stroke()
  } else {
    ctx.fillStyle = color
    ctx.fill()
  }
  ctx.restore()

  if (kind !== 'head') {
    // Stem, from the head's edge, vertical regardless of the head's lean.
    const edgeX = flip ? -Math.cos(tiltRad) * r : Math.cos(tiltRad) * r
    const edgeY = flip ? Math.sin(tiltRad) * r : -Math.sin(tiltRad) * r
    const tipY = flip ? edgeY + stemH : edgeY - stemH
    ctx.beginPath()
    ctx.moveTo(edgeX, edgeY)
    ctx.lineTo(edgeX, tipY)
    ctx.strokeStyle = color
    ctx.lineWidth = r * 0.22
    ctx.stroke()

    if (kind === 'eighth') {
      const dir = flip ? 1 : -1
      ctx.beginPath()
      ctx.moveTo(edgeX, tipY)
      ctx.quadraticCurveTo(
        edgeX + r * 1.6, tipY - dir * stemH * 0.35,
        edgeX + r * 0.6, tipY - dir * stemH * 0.62,
      )
      ctx.strokeStyle = color
      ctx.lineWidth = r * 0.2
      ctx.stroke()
    }
  }

  ctx.restore()
}
