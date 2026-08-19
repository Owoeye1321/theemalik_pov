import { useCallback, useEffect, useRef } from 'react'

/** A self-cleaning interval whose countdown can be restarted on demand. */
export function useInterval(callback: () => void, delayMs: number) {
  const saved = useRef(callback)
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  useEffect(() => {
    saved.current = callback
  }, [callback])

  const start = useCallback(() => {
    if (timer.current) clearInterval(timer.current)
    timer.current = setInterval(() => saved.current(), delayMs)
  }, [delayMs])

  useEffect(() => {
    start()
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [start])

  return { restart: start }
}
