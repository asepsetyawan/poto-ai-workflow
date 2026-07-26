import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

/** Unsplash License — see https://unsplash.com/license */
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1485846234645-a62644f547ff?auto=format&fit=crop&w=2400&q=80';
const IMAGE_STILL =
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80';
const VIDEO_STILL =
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=80';
const AUDIO_STILL =
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1600&q=80';

const capabilities = [
  {
    id: 'image',
    title: 'Image',
    lede: 'Generate stills, concepts, and campaign visuals from a prompt.',
    image: IMAGE_STILL,
    imageAlt: 'Abstract colorful generative art texture',
  },
  {
    id: 'video',
    title: 'Video',
    lede: 'Turn scripts into motion — clips ready for social and storyboards.',
    image: VIDEO_STILL,
    imageAlt: 'Video editing timeline on a workstation',
  },
  {
    id: 'audio',
    title: 'Audio',
    lede: 'Compose voice, score, and sound design without a full studio.',
    image: AUDIO_STILL,
    imageAlt: 'Music production keyboard and headphones',
  },
] as const;

export function HomePage() {
  return (
    <div className="bg-graphite-50 text-graphite-900">
      <section
        className="relative flex min-h-svh items-end overflow-hidden md:items-center"
        aria-labelledby="landing-brand"
      >
        <img
          src={HERO_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full animate-fade-in object-cover motion-reduce:animate-none"
        />
        <div
          className="absolute inset-0 bg-linear-to-t from-graphite-950 via-graphite-950/75 to-graphite-900/40 md:bg-linear-to-r md:from-graphite-950 md:via-graphite-950/80 md:to-graphite-900/20"
          aria-hidden
        />

        <div className="relative z-10 w-full max-w-3xl px-6 pb-16 pt-28 md:px-10 md:pb-24 md:pt-20">
          <p
            id="landing-brand"
            className="animate-rise font-display text-4xl font-bold tracking-tight text-teal-400 motion-reduce:animate-none md:text-5xl"
          >
            POTO AI
          </p>
          <h1 className="animate-rise mt-4 font-display text-3xl font-semibold leading-tight text-graphite-50 motion-reduce:animate-none md:text-5xl [animation-delay:80ms]">
            Create image, video, and audio with AI
          </h1>
          <p className="animate-fade-in mt-4 max-w-xl text-lg text-graphite-100 motion-reduce:animate-none [animation-delay:160ms]">
            One studio for every medium your story needs.
          </p>
          <div className="animate-fade-in mt-8 flex flex-wrap gap-4 motion-reduce:animate-none [animation-delay:240ms]">
            <Button asChild>
              <Link to="/register">Get started</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </section>

      {capabilities.map((capability, index) => (
        <section
          key={capability.id}
          className={`grid min-h-[70svh] items-center gap-8 px-6 py-20 md:grid-cols-2 md:gap-12 md:px-10 lg:px-16 ${
            index % 2 === 1 ? 'bg-graphite-100' : 'bg-graphite-50'
          }`}
          aria-labelledby={`capability-${capability.id}`}
        >
          <div className={index % 2 === 1 ? 'md:order-2' : undefined}>
            <h2
              id={`capability-${capability.id}`}
              className="font-display text-3xl font-semibold tracking-tight text-graphite-900 md:text-4xl"
            >
              {capability.title}
            </h2>
            <p className="mt-4 max-w-md text-lg text-graphite-700">{capability.lede}</p>
          </div>
          <div className={index % 2 === 1 ? 'md:order-1' : undefined}>
            <img
              src={capability.image}
              alt={capability.imageAlt}
              className="h-64 w-full object-cover transition duration-500 hover:brightness-110 motion-reduce:transition-none md:h-80 lg:h-96"
              loading="lazy"
            />
          </div>
        </section>
      ))}

      <section
        className="bg-graphite-900 px-6 py-20 text-center md:px-10"
        aria-labelledby="closing-cta"
      >
        <h2
          id="closing-cta"
          className="font-display text-3xl font-semibold tracking-tight text-graphite-50 md:text-4xl"
        >
          Start creating with POTO AI
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-lg text-graphite-100">
          Image, video, and audio — one account to begin.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link to="/register">Get started</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
