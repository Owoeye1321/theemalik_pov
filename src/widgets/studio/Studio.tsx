import { stats } from '@/shared/config/content'
import { IMAGES, SLOT_WIDTH } from '@/shared/config/images'
import { ImageSlot } from '@/shared/ui/ImageSlot'
import { RevealOnScroll } from '@/shared/ui/RevealOnScroll'
import { SectionLabel } from '@/shared/ui/SectionLabel'
import { Stat } from '@/shared/ui/Stat'

export function Studio() {
  return (
    <section id="studio" className="py-[clamp(56px,8vw,130px)] px-gutter max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[.9fr_1.1fr] gap-[clamp(28px,5vw,80px)] items-center">
        <RevealOnScroll className="grid grid-cols-2 gap-[16px]">
          <div className="aspect-[3/4] rounded-[6px] overflow-hidden mt-[40px]">
            <ImageSlot
              src={IMAGES.u5}
              alt="Studio, behind the scenes"
              placeholder="Studio / behind the scenes"
              width={SLOT_WIDTH.studio}
            />
          </div>
          <div className="aspect-[3/4] rounded-[6px] overflow-hidden">
            <ImageSlot
              src={IMAGES.u7}
              alt="Founder portrait"
              placeholder="Founder portrait"
              width={SLOT_WIDTH.studio}
            />
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          <SectionLabel className="mb-[26px]">The Studio</SectionLabel>

          <h2 className="font-display font-medium text-[clamp(30px,4vw,58px)] leading-[1.05] tracking-[-.01em]">
            We don't just take photographs. We keep the{' '}
            <span className="italic text-[#8F5A35]">moment</span> exactly as it felt.
          </h2>

          <p className="mt-[26px] text-[16px] leading-[1.8] text-[#4A453D] max-w-[560px]">
            Founded in 2019, theemalik pov is the studio people call for the days worth remembering —
            weddings, birthdays, portraits and family sessions. Every frame is gently directed,
            colour-graded and delivered in a private gallery, ready to print and share.
          </p>

          <div className="grid grid-cols-3 gap-[24px] mt-[44px] pt-[32px] border-t border-[rgba(20,17,15,.14)]">
            {stats.map((stat) => (
              <Stat key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
