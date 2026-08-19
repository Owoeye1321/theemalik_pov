import { useCallback, useState } from 'react'
import { useInterval } from '@/shared/lib/useInterval'

/** Coupled to the `grow 3.8s` progress-bar animation — change one and change the other. */
export const REEL_INTERVAL_MS = 3800

export function useReelCarousel(count: number) {
  const [reel, setReel] = useState(0)

  const { restart } = useInterval(() => {
    setReel((r) => (r + 1) % count)
  }, REEL_INTERVAL_MS)

  // Picking a slide by hand restarts the countdown, so it never cuts away early.
  const goReel = useCallback(
    (i: number) => {
      setReel(i)
      restart()
    },
    [restart],
  )

  return { reel, goReel }
}
