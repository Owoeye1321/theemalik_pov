export type SlideGeometry = {
  transform: string
  opacity: number
  zIndex: number
  cursor: 'default' | 'pointer'
  pointerEvents: 'none' | 'auto'
  scrimOpacity: number
}

/** Circular distance from the active slide, wrapped so the carousel has no seam. */
export function slideGeometry(index: number, active: number, count: number): SlideGeometry {
  let d = index - active
  if (d > count / 2) d -= count
  if (d < -count / 2) d += count
  const abs = Math.abs(d)

  const tx = d * 64
  const scale = abs === 0 ? 1 : abs === 1 ? 0.78 : 0.6
  const rot = d === 0 ? 0 : d > 0 ? -34 : 34

  return {
    transform: `translate(-50%,-50%) translateX(${tx}%) scale(${scale}) rotateY(${rot}deg)`,
    opacity: abs > 2 ? 0 : abs === 0 ? 1 : abs === 1 ? 0.9 : 0.5,
    zIndex: 20 - abs,
    cursor: abs === 0 ? 'default' : 'pointer',
    pointerEvents: abs > 2 ? 'none' : 'auto',
    scrimOpacity: abs === 0 ? 0 : abs === 1 ? 0.3 : 0.55,
  }
}
