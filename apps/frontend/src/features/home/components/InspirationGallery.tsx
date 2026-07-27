import { useMemo, useState } from 'react';
import { inspirationItems } from '@/features/home/home-content';

type Filter = 'all' | 'image' | 'video';

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'image', label: 'Image' },
  { id: 'video', label: 'Video' },
];

export function InspirationGallery() {
  const [filter, setFilter] = useState<Filter>('all');

  const items = useMemo(() => {
    if (filter === 'all') return inspirationItems;
    return inspirationItems.filter((item) => item.kind === filter);
  }, [filter]);

  return (
    <section className="mx-4 mt-10 pb-28 md:mx-6" aria-label="Inspiration">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-studio-50">Inspiration</h2>
          <p className="mt-1 text-studio-100">Fresh inspiration tailored for you</p>
        </div>
        <div className="flex gap-2" role="group" aria-label="Inspiration filters">
          {filters.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
              className={
                filter === option.id
                  ? 'cursor-pointer rounded-full border-0 bg-cyan-400 px-3 py-1.5 text-sm font-semibold text-studio-950'
                  : 'cursor-pointer rounded-full border-0 bg-studio-800 px-3 py-1.5 text-sm text-studio-100 hover:bg-studio-700'
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {items.map((item) => (
          <figure key={item.id} className="overflow-hidden rounded-2xl bg-studio-800">
            <img
              src={item.image}
              alt={item.alt}
              className="aspect-3/4 h-full w-full object-cover transition duration-500 hover:brightness-110 motion-reduce:transition-none"
              loading="lazy"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
