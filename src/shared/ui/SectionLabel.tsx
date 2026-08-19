import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type SectionLabelProps = {
  children: ReactNode
  centered?: boolean
  tone?: 'light' | 'dark'
  className?: string
}

export function SectionLabel({
  children,
  centered = false,
  tone = 'light',
  className,
}: SectionLabelProps) {
  const rule = <span className="w-[34px] h-px bg-bronze" />

  return (
    <div className={cn('flex items-center gap-[14px]', centered && 'justify-center', className)}>
      {rule}
      <span
        className={cn(
          'font-mono text-[11px] tracking-[.32em] uppercase',
          tone === 'dark' ? 'text-[#C8955F]' : 'text-[#8F5A35]',
        )}
      >
        {children}
      </span>
      {centered && rule}
    </div>
  )
}
