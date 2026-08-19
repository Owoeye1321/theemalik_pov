import { cloudinaryUrl } from '@/shared/config/images'
import { cn } from '@/shared/lib/cn'

type ImageSlotProps = {
  alt: string
  src?: string
  shape?: 'rect' | 'circle'
  placeholder?: string
  width?: number
  className?: string
}

/** Fills its container; the parent owns the aspect ratio, radius and overflow. */
export function ImageSlot({
  alt,
  src,
  shape = 'rect',
  placeholder,
  width,
  className,
}: ImageSlotProps) {
  const rounding = shape === 'circle' ? 'rounded-full' : ''

  if (!src) {
    return (
      <div
        role="img"
        aria-label={placeholder ?? alt}
        className={cn('w-full h-full bg-[#DED7CA]', rounding, className)}
      />
    )
  }

  return (
    <img
      src={cloudinaryUrl(src, width ? { w: width } : undefined)}
      alt={alt}
      className={cn('w-full h-full object-cover block', rounding, className)}
    />
  )
}
