import type { ReactNode } from 'react'

type RevealOnScrollProps = {
  as?: 'div' | 'section' | 'article' | 'h2' | 'blockquote'
  className?: string
  children: ReactNode
}

/** Marks a subtree for the page-level reveal observer. */
export function RevealOnScroll({ as: Tag = 'div', className, children }: RevealOnScrollProps) {
  return (
    <Tag data-reveal="" className={className}>
      {children}
    </Tag>
  )
}
