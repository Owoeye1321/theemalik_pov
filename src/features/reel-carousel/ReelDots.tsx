type ReelDotsProps = {
  count: number
  active: number
  onSelect: (index: number) => void
}

export function ReelDots({ count, active, onSelect }: ReelDotsProps) {
  return (
    <div className="flex gap-[10px]">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label="Show frame"
          aria-current={i === active}
          onClick={() => onSelect(i)}
          style={{
            width: i === active ? 34 : 12,
            background: i === active ? '#B0754C' : 'rgba(245,242,236,.25)',
          }}
          className="h-[12px] rounded-[100px] border-none p-0 cursor-pointer transition-all duration-[400ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B0754C]"
        />
      ))}
    </div>
  )
}
