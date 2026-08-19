const CLOUD_NAME = 'dlyryea3n'
const BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`

/** Every image URL in the app is composed here — never hardcode a raw Cloudinary URL. */
export function cloudinaryUrl(publicId: string, opts?: { w?: number }): string {
  const transform = `f_auto,q_auto${opts?.w ? `,w_${opts.w}` : ''}`
  return `${BASE}/${transform}/${publicId}`
}

export function srcSet(publicId: string, widths: number[]): string {
  return widths.map((w) => `${cloudinaryUrl(publicId, { w })} ${w}w`).join(', ')
}

export const IMAGES = {
  u1: 'v1787091064/Screenshot_2026-08-18_at_22.31.35_kmmygs.png',
  u2: 'v1787091106/Screenshot_2026-08-18_at_22.34.09_j8xq9n.png',
  u3: 'v1787091149/Screenshot_2026-08-18_at_22.34.36_pqei0s.png',
  u4: 'v1787091164/Screenshot_2026-08-18_at_22.35.00_xiiznz.png',
  u5: 'v1787091199/Screenshot_2026-08-18_at_22.35.22_gsokmv.png',
  u6: 'v1787091241/Screenshot_2026-08-18_at_22.36.22_kzvtna.png',
  u7: 'v1787091250/Screenshot_2026-08-18_at_22.37.08_vivqvs.png',
  u8: 'v1787091268/Screenshot_2026-08-18_at_22.37.36_vq7zcg.png',
} as const

/** Delivery width per slot type. */
export const SLOT_WIDTH = {
  hero: 1200,
  reel: 800,
  studio: 800,
  gallery: 600,
  avatar: 96,
} as const
