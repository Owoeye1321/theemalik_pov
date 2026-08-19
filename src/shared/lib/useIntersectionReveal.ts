import { useEffect } from 'react'
import type { RefObject } from 'react'

/**
 * Reveals every `[data-reveal]` element inside `rootRef` once it scrolls into view.
 *
 * Called once, at page level: the stagger is derived from an element's index among its
 * parent's revealing children, so no call site needs to know its own position.
 */
export function useIntersectionReveal(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    let inner = 0
    let io: IntersectionObserver | undefined

    const setup = () => {
      const root = rootRef.current
      if (!root) return
      const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
      els.forEach((el) => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(30px)'
        el.style.transition = 'opacity .85s cubic-bezier(.2,.7,.2,1), transform .85s cubic-bezier(.2,.7,.2,1)'
        el.style.willChange = 'opacity, transform'
      })

      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return
            const el = e.target as HTMLElement
            const sibs = el.parentElement
              ? Array.from(el.parentElement.children).filter((c) => c.hasAttribute('data-reveal'))
              : [el]
            const i = Math.max(0, sibs.indexOf(el))
            el.style.transitionDelay = Math.min(i, 6) * 90 + 'ms'
            el.style.opacity = '1'
            el.style.transform = 'none'
            io?.unobserve(el)
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      )
      els.forEach((el) => io?.observe(el))
    }

    // Two frames, so layout has settled before anything is hidden — one frame lets
    // elements already in view flash visible first.
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(setup)
    })

    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
      io?.disconnect()
    }
  }, [rootRef])
}
