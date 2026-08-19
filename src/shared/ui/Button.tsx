import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type Variant = 'solid' | 'outline'
type Tone = 'light' | 'dark'
type Size = 'sm' | 'md' | 'lg' | 'showcase'

type ButtonProps = {
  children: ReactNode
  variant?: Variant
  tone?: Tone
  size?: Size
  href?: string
  target?: string
  rel?: string
  /** Outline buttons fill on hover, except the contact phone link, which only brightens its border. */
  hoverFill?: boolean
  className?: string
}

const SIZES: Record<Size, string> = {
  sm: 'text-[12px] tracking-[.12em] px-[20px] py-[11px] gap-[8px]',
  md: 'text-[13px] tracking-[.1em] px-[26px] py-[15px] gap-[10px]',
  lg: 'text-[14px] tracking-[.08em] px-[34px] py-[17px] gap-[10px]',
  showcase: 'text-[13px] tracking-[.1em] px-[26px] py-[14px] gap-[10px]',
}

export function Button({
  children,
  variant = 'solid',
  tone = 'light',
  size = 'md',
  href,
  target,
  rel,
  hoverFill = true,
  className,
}: ButtonProps) {
  const base =
    'inline-flex items-center rounded-[100px] uppercase ' +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B0754C]'

  const skin =
    tone === 'dark'
      ? variant === 'solid'
        ? 'bg-bronze text-ink'
        : 'border border-[rgba(245,242,236,.4)] text-paper'
      : variant === 'solid'
        ? 'bg-ink text-paper hover:bg-bronze hover:text-ink'
        : cn(
            'border border-[rgba(20,17,15,.28)] text-ink hover:border-ink',
            hoverFill && 'hover:bg-ink hover:text-paper',
          )

  const classes = cn(base, SIZES[size], skin, className)

  return href ? (
    <a href={href} target={target} rel={rel} className={classes}>
      {children}
    </a>
  ) : (
    <span className={classes}>{children}</span>
  )
}
