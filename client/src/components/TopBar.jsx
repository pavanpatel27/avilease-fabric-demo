import { useEffect, useState } from 'react';
import { AviLeaseMark } from './AviLeaseMark';

const PAGES = [
  { id: 'architecture', label: 'How it works' },
  { id: 'configure', label: 'Microsoft Fabric' },
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
    <header className="sticky top-0 z-40 border-b border-[#E4D9C8] bg-white/95 backdrop-blur">
      <div className="h-0.5 w-full bg-[#C5A572]" />
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center gap-4 px-4 md:px-6">
        <div className="flex shrink-0 items-center gap-3">
          <AviLeaseMark />
          <span className="hidden text-sm font-light text-[#C5A572] sm:inline">×</span>
          <div className="hidden leading-tight sm:block">
            <div className="text-base font-bold lowercase tracking-tight text-prodigy-crimson">
              prodigy
            </div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-prodigy-muted">
              Collaboration demo
            </div>
          </div>
        </div>

        <nav className="mx-auto hidden items-center gap-0.5 lg:flex">
          {PAGES.map((p) => {
            const active = page === p.id || (page === 'inspect' && p.id === 'overview');
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPage(p.id)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  active
                    ? 'bg-avi-deep text-white'
                    : 'text-avi-deep/80 hover:bg-[#F4EFE6]'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3 text-xs">
          <a
            href="https://avilease.com/"
            target="_blank"
            rel="noreferrer"
            className="hidden font-semibold text-avi-deep hover:text-[#C5A572] sm:inline"
          >
            avilease.com
          </a>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold ${
              live ? 'bg-avi-mist text-avi-deep' : 'bg-[#F4EFE6] text-avi-deep'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${live ? 'bg-avi-mint' : 'bg-[#C5A572]'}`}
            />
            {live ? 'Live' : 'Demo data'}
          </span>
          <span className="hidden text-prodigy-muted md:inline">
            {mins === 0 ? 'Just now' : `${mins} min ago`}
          </span>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-t border-[#E4D9C8] px-2 py-1.5 lg:hidden">
        {PAGES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPage(p.id)}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
              page === p.id || (page === 'inspect' && p.id === 'overview')
                ? 'bg-avi-deep text-white'
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
