export type Category = 'All' | 'Weddings' | 'Birthdays' | 'Portraits' | 'Family' | 'Events'

export type GalleryItem = {
  slot: string
  title: string
  cat: Exclude<Category, 'All'>
  ph: string
  src: string
}
