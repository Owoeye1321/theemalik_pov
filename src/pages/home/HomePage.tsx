import { useRef } from 'react'
import { useIntersectionReveal } from '@/shared/lib/useIntersectionReveal'
// Development-only showcase — the palette and type it displays live as @theme tokens in app/index.css.
// import { BrandSystem } from '@/widgets/brand-system/BrandSystem'
import { Contact } from '@/widgets/contact/Contact'
import { Footer } from '@/widgets/footer/Footer'
import { Gallery } from '@/widgets/gallery/Gallery'
import { Header } from '@/widgets/header/Header'
import { Hero } from '@/widgets/hero/Hero'
import { Marquee } from '@/widgets/marquee/Marquee'
import { Process } from '@/widgets/process/Process'
import { Reel } from '@/widgets/reel/Reel'
import { Services } from '@/widgets/services/Services'
import { Studio } from '@/widgets/studio/Studio'
import { Testimonial } from '@/widgets/testimonial/Testimonial'

export function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null)
  useIntersectionReveal(rootRef)

  return (
    <div ref={rootRef} className="font-body bg-paper text-ink overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Studio />
        <Reel />
        <Services />
        <Gallery />
        <Process />
        <Testimonial />
        {/* <BrandSystem /> */}
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
