const STATS = [
  { v: '165', k: 'Owned aircraft' },
  { v: '34', k: 'Managed aircraft' },
  { v: '51', k: 'Airline customers' },
  { v: '$8bn', k: 'Portfolio' },
];

export default function CollabHero() {
  return (
    <section className="overflow-hidden rounded-2xl bg-avi-deep text-white shadow-card">
      <div className="relative px-6 py-7 md:px-8 md:py-8">
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(197,165,114,0.22) 0%, transparent 70%)' }}
        />
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C5A572]">
          Collaboration briefing
        </p>
        <h2 className="mt-2 max-w-xl text-2xl font-normal leading-snug md:text-3xl">
          One number for a global fleet — built with AviLease, delivered by Prodigy
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
          This workspace joins Leaseworks, Core Financials, Aerlytix and any other data sources
          so the organization shares the same metrics — what reporting and AI can safely use.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.k}>
              <div className="text-2xl font-semibold tracking-tight text-[#C5A572] md:text-3xl">
                {s.v}
              </div>
              <div className="mt-0.5 text-[11px] uppercase tracking-wide text-white/55">{s.k}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] text-white/45">
          Public figures from{' '}
          <a
            href="https://avilease.com/"
            target="_blank"
            rel="noreferrer"
            className="text-[#C5A572] underline decoration-[#C5A572]/40 underline-offset-2"
          >
            avilease.com
          </a>
          {' '}
          · demo fleet below is a working sample, not the live register.
        </p>
      </div>
    </section>
  );
}
