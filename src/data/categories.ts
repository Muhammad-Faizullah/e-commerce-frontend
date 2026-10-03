export type GarmentCategory = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  image: string;
  imageAlt: string;
  imageCaption: string;
};

/**
 * Editorial category previews only. These photographs do not represent
 * confirmed products or a live catalogue.
 */
export const garmentCategories: GarmentCategory[] = [
  {
    slug: 'kurtas',
    name: 'Kurtas',
    shortDescription: 'An everyday essential, with a little more thought.',
    description: 'Relaxed silhouettes for familiar routines, unhurried afternoons and the days in between.',
    image: '/collections/kurtas.jpg',
    imageAlt: 'Editorial portrait of a man in a muted sage kurta beneath a sunlit archway.',
    imageCaption: 'Everyday dressing',
  },
  {
    slug: 'occasionwear',
    name: 'Occasionwear',
    shortDescription: 'For the gatherings that stay with you.',
    description: 'A considered direction for family celebrations, evenings together and the moments worth dressing for.',
    image: '/collections/occasionwear.jpg',
    imageAlt: 'Editorial portrait of a man wearing a deep green traditional outfit in a historic stone courtyard.',
    imageCaption: 'Gathering well',
  },
  {
    slug: 'waistcoats',
    name: 'Waistcoats',
    shortDescription: 'A finishing layer, in its own quiet way.',
    description: 'An extra layer to bring texture and intention to a familiar South Asian silhouette.',
    image: '/collections/waistcoats.jpg',
    imageAlt: 'Editorial portrait of a man in an ivory kurta and textured sand waistcoat against a carved stone wall.',
    imageCaption: 'The considered layer',
  },
];