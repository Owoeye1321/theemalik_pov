import { Button } from '@/shared/ui/Button'
import { RevealOnScroll } from '@/shared/ui/RevealOnScroll'

export function Contact() {
  return (
    <section
      id="contact"
      className="relative py-[clamp(70px,10vw,150px)] px-gutter text-center bg-paper"
    >
      <RevealOnScroll className="max-w-[900px] mx-auto">
        <div className="font-mono text-[11px] tracking-[.32em] uppercase text-[#8F5A35] mb-[24px]">
          Let's make something worth looking at
        </div>

        <h2 className="font-display font-medium text-[clamp(40px,7vw,104px)] leading-[.98] tracking-[-.02em]">
          Book the <span className="italic text-[#8F5A35]">studio</span>
        </h2>

        <p className="mt-[28px] mx-auto max-w-[520px] text-[16px] leading-[1.7] text-[#4A453D]">
          Tell us about your shoot — the date, the occasion and the people. We reply within two
          working days with availability and a tailored quote.
        </p>

        <div className="flex flex-wrap gap-[16px] justify-center mt-[40px]">
          <Button href="mailto:hello@theemalikpov.com" size="lg">
            hello@theemalikpov.com
          </Button>
          <Button href="tel:+10000000000" variant="outline" size="lg" hoverFill={false}>
            +1 (000) 000 0000
          </Button>
        </div>
      </RevealOnScroll>
    </section>
  )
}
