import { steps } from '@/shared/config/content'
import { RevealOnScroll } from '@/shared/ui/RevealOnScroll'

export function Process() {
  return (
    <section className="bg-clay py-[clamp(56px,8vw,120px)] px-gutter">
      <div className="max-w-[1400px] mx-auto">
        <RevealOnScroll
          as="h2"
          className="font-display font-medium text-[clamp(30px,4.4vw,60px)] leading-none tracking-[-.01em] text-center mb-[clamp(36px,5vw,72px)]"
        >
          How a shoot comes together
        </RevealOnScroll>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[clamp(20px,3vw,48px)]">
          {steps.map((step) => (
            <RevealOnScroll key={step.no}>
              <div className="font-mono text-[12px] text-[#8F5A35] tracking-[.2em]">{step.no}</div>
              <div className="h-px bg-[rgba(20,17,15,.2)] mt-[16px] mb-[22px]" />
              <h3 className="font-display font-medium text-[26px] mb-[12px]">{step.title}</h3>
              <p className="text-[14px] leading-[1.7] text-[#4A453D]">{step.desc}</p>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
