import { Button } from '@/shared/ui/Button'

const NAV = [
  { label: 'Work', href: '#work' },
  { label: 'Studio', href: '#studio' },
  { label: 'Services', href: '#services' },
  // { label: 'System', href: '#system' },  // Brand System section is commented out in HomePage
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-[16px] py-[18px] px-gutter bg-[rgba(245,242,236,.82)] backdrop-blur-[14px] border-b border-[rgba(20,17,15,.1)]">
      <a href="#top" className="flex items-baseline gap-[12px] text-ink shrink-0">
        <span className="font-display font-semibold text-[22px] sm:text-[26px] tracking-[.12em]">
          theemalik
        </span>
        <span className="font-mono text-[10px] tracking-[.34em] text-[#857C72] uppercase">pov</span>
      </a>

      <nav className="flex items-center gap-[clamp(18px,3vw,40px)] shrink-0">
        {/* The row can't fit links, wordmark and CTA on a phone — the CTA wins, the footer keeps the links. */}
        <div className="hidden md:flex items-center gap-[clamp(18px,3vw,40px)]">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[13px] tracking-[.04em] text-[#3A352E]"
            >
              {item.label}
            </a>
          ))}
        </div>

        <Button
          href="https://www.instagram.com/theemalik_pov/"
          target="_blank"
          rel="noopener"
          size="sm"
          className="whitespace-nowrap max-sm:text-[11px] max-sm:px-[14px] max-sm:py-[9px]"
        >
          Book a session
        </Button>
      </nav>
    </header>
  )
}
