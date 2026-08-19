import { cn } from '@/shared/lib/cn'

type ChipProps = {
  label: string
  active?: boolean
  onClick?: () => void
  /** `dark` is the static Brand System showcase chip. */
  tone?: 'light' | 'dark'
}

export function Chip({ label, active = false, onClick, tone = 'light' }: ChipProps) {
  const base = 'font-mono text-[11px] tracking-[.16em] uppercase rounded-[100px]'

  if (tone === 'dark') {
    return (
      <span className={cn(base, 'bg-[rgba(245,242,236,.08)] text-paper px-[16px] py-[9px]')}>
        {label}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        base,
        'px-[18px] py-[10px] cursor-pointer border transition-all duration-[250ms]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B0754C]',
        active ? 'border-ink bg-ink text-paper' : 'border-[rgba(20,17,15,.22)] bg-transparent text-[#4A453D]',
      )}
    >
      {label}
    </button>
  )
}
