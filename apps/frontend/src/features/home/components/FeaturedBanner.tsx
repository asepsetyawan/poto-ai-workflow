import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { featured } from '@/features/home/home-content';

export function FeaturedBanner() {
  return (
    <section
      className="mx-4 mt-3 grid overflow-hidden rounded-3xl bg-studio-800 md:mx-6 md:grid-cols-[1.1fr_1fr]"
      aria-labelledby="featured-heading"
    >
      <div className="flex flex-col justify-center p-6 md:p-10">
        <h2
          id="featured-heading"
          className="font-display text-3xl font-semibold tracking-tight text-studio-50 md:text-4xl"
        >
          {featured.title}
        </h2>
        <p className="mt-3 max-w-md text-studio-100">{featured.lede}</p>
        <div className="mt-6">
          <Button asChild>
            <Link to="/register">{featured.ctaLabel}</Link>
          </Button>
        </div>
      </div>
      <div className="relative min-h-56 md:min-h-72">
        <img src={featured.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </div>
    </section>
  );
}
