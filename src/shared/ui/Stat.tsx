type StatProps = {
  value: string
  label: string
}

export function Stat({ value, label }: StatProps) {
  return (
    <div>
      <div className="font-display text-[44px] leading-none text-ink">{value}</div>
      <div className="font-mono text-[11px] tracking-[.12em] uppercase text-[#857C72] mt-[8px]">
        {label}
      </div>
    </div>
  )
}
