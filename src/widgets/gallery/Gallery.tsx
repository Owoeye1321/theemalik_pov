import { FilterChips } from '@/features/gallery-filter/FilterChips'
import { useGalleryFilter } from '@/features/gallery-filter/useGalleryFilter'
import { cats, gallery } from '@/shared/config/content'
import { SLOT_WIDTH } from '@/shared/config/images'
import { ImageSlot } from '@/shared/ui/ImageSlot'
import { RevealOnScroll } from '@/shared/ui/RevealOnScroll'
import { SectionLabel } from '@/shared/ui/SectionLabel'

export function Gallery() {
  const { filter, setFilter, filtered } = useGalleryFilter(gallery)

  return (
    <section id="work" className="py-[clamp(56px,8vw,120px)] px-gutter max-w-[1500px] mx-auto">
      <RevealOnScroll className="text-center mb-[clamp(28px,4vw,54px)]">
        <SectionLabel centered className="mb-[22px]">
          Selected Work
        </SectionLabel>
        <h2 className="font-display font-medium text-[clamp(34px,5vw,72px)] leading-none tracking-[-.01em]">
          The Media Library
        </h2>
      </RevealOnScroll>

      <FilterChips cats={cats} active={filter} onSelect={setFilter} />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,290px),1fr))] gap-[clamp(12px,1.4vw,20px)]">
        {filtered.map((item) => (
          // The key carries the filter, so the figures remount and riseIn replays on every change.
          <figure
            key={`${filter}-${item.slot}`}
            className="relative aspect-[4/5] rounded-[6px] overflow-hidden bg-[#DED7CA] animate-rise-in cursor-pointer transition-[box-shadow,transform] duration-[400ms] hover:shadow-[0_26px_55px_rgba(20,17,15,.32)] hover:-translate-y-[6px]"
          >
            <ImageSlot
              src={item.src}
              alt={item.title}
              placeholder={item.ph}
              width={SLOT_WIDTH.gallery}
            />
            <figcaption className="absolute left-0 right-0 bottom-0 flex justify-between items-end p-[16px] bg-[linear-gradient(to_top,rgba(20,17,15,.72),transparent)] text-paper pointer-events-none">
              <span className="font-display text-[20px]">{item.title}</span>
              <span className="font-mono text-[10px] tracking-[.16em] uppercase text-[#E6C9A6]">
                {item.cat}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
