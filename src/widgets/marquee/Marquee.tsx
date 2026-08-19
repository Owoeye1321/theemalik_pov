import { Fragment } from 'react'
import { marqueeTerms } from '@/shared/config/content'

/** Both groups must render identically, or the -50% loop shows a seam. */
function Group({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      aria-hidden={hidden || undefined}
      className="flex gap-[56px] pr-[56px] font-display text-[30px] italic text-[#8A8178] whitespace-nowrap"
    >
      {marqueeTerms.map((term) => (
        <Fragment key={term}>
          <span>{term}</span>
          <span className="text-bronze">✳</span>
        </Fragment>
      ))}
    </div>
  )
}

export function Marquee() {
  return (
    <section className="border-t border-b border-[rgba(20,17,15,.12)] py-[20px] overflow-hidden bg-clay">
      <div className="flex w-max animate-marquee">
        <Group />
        <Group hidden />
      </div>
    </section>
  )
}
