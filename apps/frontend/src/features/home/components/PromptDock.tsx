import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { promptPlaceholder } from '@/features/home/home-content';

export function PromptDock() {
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-5 md:px-6">
      <form
        className="pointer-events-auto mx-auto flex max-w-3xl items-center gap-3 rounded-full border border-white/10 bg-studio-800/95 px-3 py-2 shadow-2xl backdrop-blur-md"
        onSubmit={(event) => {
          event.preventDefault();
          void navigate('/register');
        }}
        aria-label="Generation prompt"
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-studio-700 text-lg text-studio-50"
          aria-hidden
        >
          +
        </span>
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={promptPlaceholder}
          className="min-w-0 flex-1 border-0 bg-transparent py-2 text-studio-50 outline-none placeholder:text-studio-100/70"
        />
        <Link
          to="/register"
          className="shrink-0 rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-studio-950 no-underline transition hover:bg-cyan-300"
        >
          Generate
        </Link>
      </form>
    </div>
  );
}
