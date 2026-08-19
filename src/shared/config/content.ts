import type { Category, GalleryItem } from '@/entities/gallery-item/types'
import type { ReelItem } from '@/entities/reel-item/types'
import type { Service } from '@/entities/service/types'
import type { ProcessStep } from '@/entities/process-step/types'
import type { Swatch } from '@/entities/swatch/types'
import { IMAGES } from './images'

export const services: Service[] = [
  { no: '01', title: 'Weddings', desc: 'From the first look to the last dance — a calm, unobtrusive eye on the whole day, and a gallery you will actually revisit.', tag: 'Full day' },
  { no: '02', title: 'Birthdays & Parties', desc: 'Milestone birthdays, surprises and celebrations, shot candidly so the energy of the room is what you keep.', tag: 'Events' },
  { no: '03', title: 'Portraits', desc: 'Individual, couple and creative portraits — relaxed direction that still looks like you on your best day.', tag: 'Studio · Outdoor' },
  { no: '04', title: 'Family & Maternity', desc: 'Warm, unhurried sessions for growing families and new arrivals — the ordinary moments you will miss later.', tag: 'Sessions' },
  { no: '05', title: 'Events & Graduation', desc: 'Graduations, naming ceremonies, dinners and get-togethers — full coverage delivered while it still feels fresh.', tag: 'Coverage' },
]

export const steps: ProcessStep[] = [
  { no: 'STEP 01', title: 'Enquiry', desc: 'You send the date, the occasion and a few references. We reply with availability and a fixed quote.' },
  { no: 'STEP 02', title: 'Planning', desc: 'We map the shot list, locations and timing together, so the day runs without a hitch.' },
  { no: 'STEP 03', title: 'The Shoot', desc: 'A relaxed session — gentle direction, and the real moments caught exactly as they happen.' },
  { no: 'STEP 04', title: 'Delivery', desc: 'Colour-graded and retouched in a private online gallery — ready to download, print and share.' },
]

export const swatches: Swatch[] = [
  { name: 'Ink', hex: '#14110F' },
  { name: 'Paper', hex: '#F5F2EC' },
  { name: 'Bronze', hex: '#B0754C' },
  { name: 'Clay', hex: '#EFEAE0' },
]

export const reelItems: ReelItem[] = [
  { slot: 'reel1', title: 'The Vows', cat: 'Wedding · 2026', ph: 'Feature frame 01', src: IMAGES.u2 },
  { slot: 'reel2', title: 'Golden Hour', cat: 'Portrait · 2026', ph: 'Feature frame 02', src: IMAGES.u4 },
  { slot: 'reel3', title: 'First Steps', cat: 'Family · 2025', ph: 'Feature frame 03', src: IMAGES.u8 },
  { slot: 'reel4', title: 'Sweet Sixteen', cat: 'Birthday · 2025', ph: 'Feature frame 04', src: IMAGES.u1 },
  { slot: 'reel5', title: 'Homecoming', cat: 'Event · 2025', ph: 'Feature frame 05', src: IMAGES.u6 },
]

export const gallery: GalleryItem[] = [
  { slot: 'g1', title: 'The Vows', cat: 'Weddings', ph: 'Wedding frame', src: IMAGES.u2 },
  { slot: 'g2', title: 'Golden Hour', cat: 'Portraits', ph: 'Portrait', src: IMAGES.u1 },
  { slot: 'g3', title: 'First Steps', cat: 'Family', ph: 'Family frame', src: IMAGES.u7 },
  { slot: 'g4', title: 'Sweet Sixteen', cat: 'Birthdays', ph: 'Birthday frame', src: IMAGES.u6 },
  { slot: 'g5', title: 'The Toast', cat: 'Events', ph: 'Event frame', src: IMAGES.u8 },
  { slot: 'g6', title: 'Two of Us', cat: 'Portraits', ph: 'Couple portrait', src: IMAGES.u5 },
  { slot: 'g7', title: 'The Reception', cat: 'Weddings', ph: 'Wedding frame', src: IMAGES.u4 },
  { slot: 'g8', title: 'Cake & Confetti', cat: 'Birthdays', ph: 'Birthday frame', src: IMAGES.u3 },
  { slot: 'g9', title: 'Homecoming', cat: 'Family', ph: 'Family frame', src: IMAGES.u2 },
]

export const cats: Category[] = ['All', 'Weddings', 'Birthdays', 'Portraits', 'Family', 'Events']

export const marqueeTerms = ['Weddings', 'Birthdays', 'Portraits', 'Family', 'Graduation', 'Events']

export const stats = [
  { value: '120+', label: 'Shoots delivered' },
  { value: '7 yrs', label: 'In the field' },
  { value: '40k', label: 'Frames delivered' },
]

export const testimonial = {
  quote: "theemalik pov captured our wedding exactly how it felt — not posed, just us. We open the gallery and we're right back in the day.",
  name: 'Amara & Tobi',
  meta: 'Wedding · Lagos',
}
