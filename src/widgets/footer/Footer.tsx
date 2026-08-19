const EXPLORE = [
  { label: 'Work', href: '#work' },
  { label: 'Studio', href: '#studio' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
]

const HEADING = 'font-mono text-[11px] tracking-[.2em] text-[#8A8178] uppercase mb-[20px]'
const LINK = 'text-[#E6E1D7] text-[14px] hover:text-bronze'

export function Footer() {
  return (
    <footer className="bg-ink text-paper pt-[clamp(48px,6vw,88px)] px-gutter pb-[40px]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr] gap-[40px] pb-[52px] border-b border-[rgba(245,242,236,.14)]">
          <div>
            <div className="flex items-baseline gap-[12px]">
              <span className="font-display font-semibold text-[34px] tracking-[.12em]">
                theemalik
              </span>
              <span className="font-mono text-[10px] tracking-[.34em] text-[#8A8178] uppercase">
                pov
              </span>
            </div>
            <p className="mt-[20px] max-w-[340px] text-[15px] leading-[1.7] text-[#B8B1A6]">
              A photography studio for people, moments and every shoot worth remembering. Available
              worldwide.
            </p>
          </div>

          <div>
            <div className={HEADING}>Explore</div>
            <div className="flex flex-col gap-[12px]">
              {EXPLORE.map((item) => (
                <a key={item.href} href={item.href} className={LINK}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className={HEADING}>Follow</div>
            <div className="flex flex-col gap-[12px]">
              <a
                href="https://www.instagram.com/theemalik_pov/"
                target="_blank"
                rel="noopener"
                className={LINK}
              >
                Instagram · @theemalik_pov ↗
              </a>
              <a href="#" className={LINK}>
                Behance ↗
              </a>
              <a href="#" className={LINK}>
                Vimeo ↗
              </a>
              <a href="#" className={LINK}>
                Pinterest ↗
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-[14px] pt-[26px] font-mono text-[11px] tracking-[.08em] text-[#8A8178]">
          <span>© 2026 theemalik pov. All rights reserved.</span>
          <span>Crafted with light · Contract proposal POC</span>
        </div>
      </div>
    </footer>
  )
}
