import { useEffect, useState } from 'react';

const PAGES = [
  { id: 'architecture', label: 'How it works' },
  { id: 'configure', label: 'Microsoft Fabric' },
  { id: 'systems', label: "Today's systems" },
  { id: 'pipeline', label: 'Sync data' },
  { id: 'overview', label: 'Fleet' },
  { id: 'analytics', label: 'Analytics' },
];

export default function TopBar({ page, setPage, meta }) {
  const [mins, setMins] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setMins((m) => m + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  const live = meta && !meta.fallback;

  return (
    <header className="sticky top-0 z-40 border-b border-prodigy-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:px-6">
        <div className="flex shrink-0 items-center gap-3">
          <div className="text-xl font-bold lowercase tracking-tight text-prodigy-crimson">
            prodigy
          </div>
          <span className="hidden h-5 w-px bg-prodigy-line sm:block" />
          <div className="hidden leading-tight sm:block">
            <div className="text-xs font-semibold tracking-[0.16em] text-avi-deep">AVILEASE</div>
            <div className="text-[10px] text-prodigy-muted">Fleet data demo</div>
          </div>
        </div>

        <nav className="mx-auto hidden items-center gap-1 lg:flex">
          {PAGES.map((p) => {
            const active = page === p.id || (page === 'inspect' && p.id === 'overview');
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPage(p.id)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  active
                    ? 'bg-prodigy-crimson text-white'
                    : 'text-prodigy-ink hover:bg-prodigy-soft'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3 text-xs">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold ${
              live ? 'bg-avi-mist text-avi-deep' : 'bg-prodigy-saffron/20 text-prodigy-dark'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${live ? 'bg-avi-mint' : 'bg-prodigy-saffron'}`}
            />
            {live ? 'Live' : 'Demo data'}
          </span>
          <span className="hidden text-prodigy-muted sm:inline">
            {mins === 0 ? 'Just now' : `${mins} min ago`}
          </span>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-t border-prodigy-line px-2 py-1.5 lg:hidden">
        {PAGES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPage(p.id)}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
              page === p.id || (page === 'inspect' && p.id === 'overview')
                ? 'bg-prodigy-crimson text-white'
                : 'text-prodigy-muted'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </header>
  );
}
