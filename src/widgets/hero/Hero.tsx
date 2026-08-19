import { IMAGES, SLOT_WIDTH } from '@/shared/config/images'
import { Button } from '@/shared/ui/Button'
import { ImageSlot } from '@/shared/ui/ImageSlot'
import { SectionLabel } from '@/shared/ui/SectionLabel'

export function Hero() {
  return (
    // One viewport tall on desktop (minus the sticky header), so the scroll cue always sits above the fold.
    <section
      id="top"
      className="relative flex flex-col lg:min-h-[calc(100svh-78px)] pt-[clamp(28px,3.5vw,52px)] px-gutter pb-[clamp(24px,3vw,40px)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-[clamp(24px,4vw,64px)] items-center w-full max-w-[1400px] mx-auto flex-1">
        <div>
          <SectionLabel className="mb-[26px] animate-[fadeUp_.7s_both]">
            Weddings · Portraits · Every Occasion
          </SectionLabel>

          <h1 className="font-display font-medium text-[clamp(40px,5.6vw,84px)] leading-[.94] tracking-[-.02em] animate-[fadeUp_.8s_.05s_both]">
            Your <span className="italic text-[#8F5A35]">moments</span>,<br />
            framed to
            <br />
            last a lifetime.
          </h1>

          <p className="max-w-[460px] mt-[26px] text-[16px] leading-[1.7] text-[#4A453D] animate-[fadeUp_.8s_.15s_both]">
            theemalik pov is a photography studio for people and the moments that matter — weddings,
            birthdays, portraits and every shoot in between, captured with warmth and delivered ready
            to share.
          </p>

          <div className="flex flex-wrap gap-[14px] mt-[30px] animate-[fadeUp_.8s_.25s_both]">
            <Button href="#work">View the work →</Button>
            <Button href="#services" variant="outline">
              What we shoot
            </Button>
          </div>
        </div>

        <div className="relative animate-[riseIn_1s_.1s_both]">
          {/* Capped against viewport height so a short screen shrinks the frame instead of pushing the page down. */}
          <div className="relative w-full aspect-[4/5] lg:max-h-[58svh] rounded-[6px] overflow-hidden">
            <ImageSlot
              src={IMAGES.u1}
              alt="Signature frame from a theemalik pov shoot"
              placeholder="Drop your hero image — a signature shot"
              width={SLOT_WIDTH.hero}
              className="[object-position:50%_22%]"
            />
          </div>

          <div className="absolute left-[-42px] bottom-[44px] w-[38%] aspect-[1/1] border-8 border-paper rounded-[6px] overflow-hidden shadow-[0_24px_60px_rgba(20,17,15,.22)]">
            <ImageSlot src={IMAGES.u8} alt="Detail shot" placeholder="Detail shot" width={SLOT_WIDTH.gallery} />
          </div>

          <div className="absolute top-[18px] right-[18px] font-mono text-[10px] tracking-[.2em] text-paper bg-[rgba(20,17,15,.5)] backdrop-blur-[4px] px-[12px] py-[7px] rounded-[100px]">
            EST. 2019 · WORLDWIDE
          </div>
        </div>
      </div>

      <div className="flex items-center gap-[10px] justify-center mt-[clamp(20px,2.5vw,36px)] text-[#857C72]">
        <span className="font-mono text-[10px] tracking-[.28em] uppercase">Scroll</span>
        <span className="inline-block animate-bob">↓</span>
      </div>
    </section>
  )
}
