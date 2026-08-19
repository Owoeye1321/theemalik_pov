import { useMemo, useState } from 'react'
import type { Category, GalleryItem } from '@/entities/gallery-item/types'

export function useGalleryFilter(items: GalleryItem[]) {
  const [filter, setFilter] = useState<Category>('All')

  const filtered = useMemo(
    () => items.filter((item) => filter === 'All' || item.cat === filter),
    [items, filter],
  )

  return { filter, setFilter, filtered }
}
