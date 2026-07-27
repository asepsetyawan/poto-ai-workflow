export type MediaKind = 'image' | 'video' | 'audio';

export type CarouselSlide = {
  id: string;
  title: string;
  lede: string;
  ctaLabel: string;
  image: string;
  kind: MediaKind;
};

export type ModelCard = {
  id: string;
  title: string;
  kind: MediaKind;
  description: string;
  badge?: 'Hot' | 'New';
  image: string;
};

export type InspirationItem = {
  id: string;
  kind: 'image' | 'video';
  image: string;
  alt: string;
};

export const featured = {
  title: 'POTO AI',
  lede: 'Create production-ready image, video, and audio with more control, richer detail, and smarter editing.',
  ctaLabel: 'Try now',
  image: '/poto/featured.jpg',
} as const;

export const carouselSlides: CarouselSlide[] = [
  {
    id: 'video',
    title: 'Video',
    lede: 'Cinematic clips from a single prompt.',
    ctaLabel: 'Try now',
    image: '/poto/carousel-1.jpg',
    kind: 'video',
  },
  {
    id: 'image',
    title: 'Image',
    lede: 'High-density visuals ready for campaigns.',
    ctaLabel: 'Try now',
    image: '/poto/carousel-2.jpg',
    kind: 'image',
  },
  {
    id: 'audio',
    title: 'Audio',
    lede: 'Voice, music, and sound from one studio.',
    ctaLabel: 'Coming soon',
    image: '/poto/model-video.jpg',
    kind: 'audio',
  },
];

export const modelCards: ModelCard[] = [
  {
    id: 'video-main',
    title: 'Video',
    kind: 'video',
    description: 'Cinematic video generation',
    badge: 'Hot',
    image: '/poto/model-video.jpg',
  },
  {
    id: 'image-main',
    title: 'Image',
    kind: 'image',
    description: 'Sharper image creation',
    image: '/poto/carousel-2.jpg',
  },
  {
    id: 'audio-main',
    title: 'Audio',
    kind: 'audio',
    description: 'Voice, score, and sound design',
    badge: 'New',
    image: '/poto/featured.jpg',
  },
  {
    id: 'image-fast',
    title: 'Image',
    kind: 'image',
    description: 'Fast visual experiments',
    image: '/poto/carousel-1.jpg',
  },
];

export const inspirationItems: InspirationItem[] = [
  { id: 'i1', kind: 'image', image: '/poto/carousel-2.jpg', alt: 'Generated portrait still' },
  { id: 'i2', kind: 'video', image: '/poto/carousel-1.jpg', alt: 'Cinematic video still' },
  { id: 'i3', kind: 'image', image: '/poto/featured.jpg', alt: 'Atmospheric workspace still' },
  { id: 'i4', kind: 'video', image: '/poto/model-video.jpg', alt: 'Character video still' },
  { id: 'i5', kind: 'image', image: '/poto/carousel-2.jpg', alt: 'Fashion image still' },
  { id: 'i6', kind: 'video', image: '/poto/featured.jpg', alt: 'Night scene video still' },
];

export const promptPlaceholder = 'Describe the scene you want to generate';
