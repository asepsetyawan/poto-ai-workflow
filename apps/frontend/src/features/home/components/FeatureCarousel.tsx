import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { carouselSlides } from '@/features/home/home-content';

export function FeatureCarousel() {
  const [index, setIndex] = useState(0);
  const count = carouselSlides.length;
  const visible = [carouselSlides[index % count], carouselSlides[(index + 1) % count]].filter(
    (slide): slide is (typeof carouselSlides)[number] => Boolean(slide),
  );

  const prev = () => {
    setIndex((current) => (current - 1 + count) % count);
  };

  const next = () => {
    setIndex((current) => (current + 1) % count);
  };

  return (
    <section className="relative px-4 pt-20 md:px-6" aria-label="Featured models">
      <div className="grid gap-3 md:grid-cols-2">
        {visible.map((slide) => (
          <article
            key={`${slide.id}-${index}`}
            className="relative min-h-56 overflow-hidden rounded-3xl md:min-h-72"
          >
            <img
              src={slide.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition duration-500 motion-reduce:transition-none"
            />
            <div
              className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent"
              aria-hidden
            />
            <div className="relative z-10 flex h-full min-h-56 flex-col justify-end p-5 md:min-h-72 md:p-6">
              <h3 className="font-display text-2xl font-semibold text-studio-50 md:text-3xl">
                {slide.title}
              </h3>
              <p className="mt-1 max-w-sm text-sm text-studio-100 md:text-base">{slide.lede}</p>
              <div className="mt-4">
                <Button asChild variant="secondary" className="text-sm">
                  <Link to="/register">{slide.ctaLabel}</Link>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous"
        onClick={prev}
        className="absolute top-1/2 left-2 z-10 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-black/50 text-studio-50 md:flex"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={next}
        className="absolute top-1/2 right-2 z-10 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-black/50 text-studio-50 md:flex"
      >
        ›
      </button>
    </section>
  );
}
