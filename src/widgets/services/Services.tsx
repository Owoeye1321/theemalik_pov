import { services } from '@/shared/config/content'
import { RevealOnScroll } from '@/shared/ui/RevealOnScroll'
import { SectionLabel } from '@/shared/ui/SectionLabel'

export function Services() {
  return (
    <section id="services" className="bg-paper text-ink py-[clamp(56px,8vw,130px)] px-gutter">
      <div className="max-w-[1400px] mx-auto">
        <RevealOnScroll className="flex flex-wrap justify-between items-end gap-[24px] mb-[clamp(36px,5vw,72px)]">
          <div>
            <SectionLabel className="mb-[22px]">What we shoot</SectionLabel>
            <h2 className="font-display font-medium text-[clamp(30px,4.4vw,64px)] leading-none tracking-[-.01em]">
              Every shoot, covered
            </h2>
          </div>
          <p className="max-w-[360px] text-[15px] leading-[1.7] text-[#4A453D]">
            From a quiet portrait to a full wedding day — planned, shot and delivered with care,
            whatever the occasion.
          </p>
        </RevealOnScroll>

        <div className="border-t border-[rgba(20,17,15,.16)]">
          {services.map((svc) => (
            <RevealOnScroll
              key={svc.no}
              className="grid grid-cols-1 md:grid-cols-[64px_1fr] lg:grid-cols-[64px_minmax(180px,1fr)_1.5fr_150px] gap-3 lg:gap-[clamp(14px,3vw,48px)] items-center py-[clamp(20px,2.6vw,34px)] border-b border-[rgba(20,17,15,.12)] hover:bg-[rgba(20,17,15,.03)]"
            >
              <span className="font-mono text-[13px] text-[#8F5A35]">{svc.no}</span>
              <h3 className="font-display font-medium text-[clamp(24px,2.6vw,38px)] leading-[1.05]">
                {svc.title}
              </h3>
              <p className="text-[14px] leading-[1.7] text-[#4A453D] max-w-[420px]">{svc.desc}</p>
              <span className="font-mono text-[11px] tracking-[.14em] text-[#8F5A35] whitespace-nowrap uppercase text-left lg:text-right">
                {svc.tag}
              </span>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
