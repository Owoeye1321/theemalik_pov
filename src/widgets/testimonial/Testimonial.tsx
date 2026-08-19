import { testimonial } from '@/shared/config/content'
import { IMAGES, SLOT_WIDTH } from '@/shared/config/images'
import { ImageSlot } from '@/shared/ui/ImageSlot'
import { RevealOnScroll } from '@/shared/ui/RevealOnScroll'

export function Testimonial() {
  return (
    <section className="py-[clamp(60px,9vw,140px)] px-gutter max-w-[1000px] mx-auto text-center">
      <span className="font-display text-[80px] text-bronze leading-[0] block h-[40px]">“</span>

      <RevealOnScroll
        as="blockquote"
        className="font-display font-normal text-[clamp(26px,3.6vw,46px)] leading-[1.25] tracking-[-.01em] text-ink"
      >
        {testimonial.quote}
      </RevealOnScroll>

      <div className="mt-[34px] flex items-center gap-[14px] justify-center">
        <div className="w-[46px] h-[46px] rounded-[100px] overflow-hidden">
          <ImageSlot
            src={IMAGES.u7}
            alt={testimonial.name}
            shape="circle"
            placeholder="—"
            width={SLOT_WIDTH.avatar}
          />
        </div>
        <div className="text-left">
          <div className="text-[14px] font-semibold">{testimonial.name}</div>
          <div className="font-mono text-[11px] text-[#857C72] tracking-[.06em]">
            {testimonial.meta}
          </div>
        </div>
      </div>
    </section>
  )
}
