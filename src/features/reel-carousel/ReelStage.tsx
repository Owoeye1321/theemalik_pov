import type { ReelItem } from '@/entities/reel-item/types'
import { SLOT_WIDTH } from '@/shared/config/images'
import { ImageSlot } from '@/shared/ui/ImageSlot'
import { slideGeometry } from './geometry'

type ReelStageProps = {
  items: ReelItem[]
  active: number
  onSelect: (index: number) => void
}

export function ReelStage({ items, active, onSelect }: ReelStageProps) {
  return (
    <div className="relative w-full h-[clamp(440px,66vh,620px)] [perspective:1800px] overflow-hidden">
      <div className="absolute left-0 right-0 top-0 h-[3px] z-20 bg-[rgba(245,242,236,.12)]">
        {/* Keyed so the bar remounts and refills from zero on every slide. */}
        <div key={`reel-${active}`} className="h-full max-w-[1500px] mx-auto bg-bronze animate-grow" />
      </div>

      {items.map((item, i) => {
        const g = slideGeometry(i, active, items.length)
        return (
          <div
            key={item.slot}
            onClick={() => onSelect(i)}
            style={{
              transform: g.transform,
              opacity: g.opacity,
              zIndex: g.zIndex,
              cursor: g.cursor,
              pointerEvents: g.pointerEvents,
              transition: 'transform .7s cubic-bezier(.2,.7,.2,1), opacity .6s ease',
            }}
            className="absolute top-1/2 left-1/2 w-[clamp(230px,30vw,368px)] aspect-[3/4]"
          >
            <div className="relative w-full h-full rounded-[10px] overflow-hidden bg-[#0A0908] shadow-[0_30px_70px_rgba(0,0,0,.5)]">
              <ImageSlot
                src={item.src}
                alt={item.title}
                placeholder={item.ph}
                width={SLOT_WIDTH.reel}
              />
              <div
                style={{
                  background: `rgba(10,9,8,${g.scrimOpacity})`,
                  transition: 'background .6s ease',
                }}
                className="absolute inset-0 pointer-events-none"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
