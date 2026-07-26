import { Link } from 'react-router-dom';
import { modelCards } from '@/features/home/home-content';

export function ModelGrid() {
  return (
    <section className="mx-4 mt-3 md:mx-6" aria-label="Model grid">
      <div className="grid gap-3 sm:grid-cols-2">
        {modelCards.map((card) => (
          <Link
            key={card.id}
            to="/register"
            className="relative flex items-center gap-4 overflow-hidden rounded-2xl bg-studio-800 p-4 no-underline transition hover:bg-studio-700"
          >
            {card.badge ? (
              <span className="absolute top-3 right-3 rounded-full bg-orange-500/90 px-2 py-0.5 text-xs font-semibold text-white">
                {card.badge}
              </span>
            ) : null}
            <img src={card.image} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-lg font-semibold text-studio-50">{card.title}</h3>
                <span className="rounded-full bg-studio-700 px-2 py-0.5 text-xs text-cyan-300 capitalize">
                  {card.kind}
                </span>
              </div>
              <p className="mt-1 text-sm text-studio-100">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
