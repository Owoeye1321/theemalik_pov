import { swatches } from '@/shared/config/content'
import { Button } from '@/shared/ui/Button'
import { Chip } from '@/shared/ui/Chip'
import { RevealOnScroll } from '@/shared/ui/RevealOnScroll'
import { SectionLabel } from '@/shared/ui/SectionLabel'

const HEADING = 'font-mono text-[11px] tracking-[.2em] text-[#8A8178] uppercase mb-[20px]'

export function BrandSystem() {
  return (
    <section id="system" className="bg-ink text-paper py-[clamp(56px,8vw,120px)] px-gutter">
      <div className="max-w-[1400px] mx-auto">
        <SectionLabel tone="dark" className="mb-[22px]">
          Brand System
        </SectionLabel>

        <RevealOnScroll
          as="h2"
          className="font-display font-medium text-[clamp(30px,4.4vw,60px)] leading-none tracking-[-.01em] max-w-[800px]"
        >
          The kit every page is built from — so the brand stays consistent everywhere.
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(28px,4vw,64px)] mt-[clamp(40px,5vw,72px)]">
          <RevealOnScroll>
            <div className={HEADING}>01 · Palette</div>
            <div className="grid grid-cols-2 gap-[14px]">
              {swatches.map((sw) => (
                <div
                  key={sw.name}
                  className="border border-[rgba(245,242,236,.14)] rounded-[8px] overflow-hidden"
                >
                  <div className="h-[96px]" style={{ background: sw.hex }} />
                  <div className="px-[14px] py-[12px] flex justify-between items-center">
                    <span className="text-[13px]">{sw.name}</span>
                    <span className="font-mono text-[11px] text-[#8A8178]">{sw.hex}</span>
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className={HEADING}>02 · Typography</div>
            <div className="flex flex-col gap-[22px]">
              <div className="border-b border-[rgba(245,242,236,.14)] pb-[20px]">
                <div className="font-display text-[52px] leading-none">Aa Bb Cc</div>
                <div className="font-mono text-[11px] text-[#8A8178] mt-[8px]">
                  Cormorant Garamond · Display / Headlines
                </div>
              </div>
              <div className="border-b border-[rgba(245,242,236,.14)] pb-[20px]">
                <div className="font-body text-[26px] font-medium">The quick studio moves light.</div>
                <div className="font-mono text-[11px] text-[#8A8178] mt-[10px]">
                  Manrope · Body / Interface
                </div>
              </div>
              <div>
                <div className="font-mono text-[16px] tracking-[.14em]">LABEL · META · 2026</div>
                <div className="font-mono text-[11px] text-[#8A8178] mt-[10px]">
                  Space Mono · Labels / Meta
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll className="mt-[clamp(36px,4vw,56px)]">
          <div className={HEADING}>03 · Components</div>
          <div className="flex flex-wrap gap-[16px] items-center">
            <Button tone="dark" size="showcase">
              Primary
            </Button>
            <Button tone="dark" variant="outline" size="showcase">
              Outline
            </Button>
            <Chip label="Chip · tag" tone="dark" />
            <span className="inline-flex items-center gap-[10px] text-[13px] text-[#C8955F]">
              <span className="w-[26px] h-px bg-bronze" />
              Section label
            </span>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
