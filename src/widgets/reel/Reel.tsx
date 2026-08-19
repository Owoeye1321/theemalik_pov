import { ReelDots } from '@/features/reel-carousel/ReelDots'
import { ReelStage } from '@/features/reel-carousel/ReelStage'
import { useReelCarousel } from '@/features/reel-carousel/useReelCarousel'
import { reelItems } from '@/shared/config/content'
import { SectionLabel } from '@/shared/ui/SectionLabel'

export function Reel() {
  const { reel, goReel } = useReelCarousel(reelItems.length)
  const active = reelItems[reel]

  return (
    <section id="motion" className="bg-ink text-paper py-[clamp(56px,8vw,120px)] px-gutter">
      <div className="max-w-[1500px] mx-auto">
        <div className="text-center mb-[clamp(28px,4vw,52px)]">
          <SectionLabel centered tone="dark" className="mb-[18px]">
            In Motion
          </SectionLabel>
          <h2 className="font-display font-medium text-[clamp(34px,5vw,72px)] leading-none tracking-[-.01em]">
            The Reel
          </h2>
        </div>

        <ReelStage items={reelItems} active={reel} onSelect={goReel} />

        <div className="flex flex-col items-center gap-[18px] mt-[clamp(24px,3vw,40px)]">
          {/* Keyed so the caption replays its fade-up on every slide. */}
          <div key={`reel-${reel}`} className="text-center animate-[fadeUp_.6s_both]">
            <div className="font-mono text-[10px] tracking-[.28em] uppercase text-[#8A8178] mb-[8px]">
              ● Now Showing
            </div>
            <div className="flex items-baseline gap-[14px] justify-center flex-wrap">
              <span className="font-display text-[clamp(26px,3.4vw,44px)] leading-none text-paper">
                {active.title}
              </span>
              <span className="font-mono text-[11px] tracking-[.16em] uppercase text-[#C8955F]">
                {active.cat}
              </span>
            </div>
          </div>

          <ReelDots count={reelItems.length} active={reel} onSelect={goReel} />
        </div>
      </div>
    </section>
  )
}
