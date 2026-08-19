import type { Category } from '@/entities/gallery-item/types'
import { Chip } from '@/shared/ui/Chip'

type FilterChipsProps = {
  cats: Category[]
  active: Category
  onSelect: (cat: Category) => void
}

export function FilterChips({ cats, active, onSelect }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-[10px] justify-center mb-[clamp(28px,4vw,48px)]">
      {cats.map((cat) => (
        <Chip key={cat} label={cat} active={cat === active} onClick={() => onSelect(cat)} />
      ))}
    </div>
  )
}
