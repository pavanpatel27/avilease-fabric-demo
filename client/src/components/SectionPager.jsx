import { useCallback, useEffect, useState } from 'react';

function ChevronUp({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 14l6-6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDown({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 10l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Full scrollable page + transparent prev/next buttons that jump between sections.
 */
export default function SectionPager({ sections, className = '' }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const total = sections.length;

  const scrollTo = useCallback(
    (idx) => {
      const clamped = Math.min(total - 1, Math.max(0, idx));
      document.getElementById(`section-${sections[clamped].id}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setActiveIdx(clamped);
    },
    [sections, total]
  );

  useEffect(() => {
    const ids = sections.map((s) => s.id);
    const elements = ids
      .map((id) => document.getElementById(`section-${id}`))
      .filter(Boolean);

    if (!elements.length) return undefined;

    const ratios = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.id, entry.intersectionRatio);
        });

        let bestIdx = 0;
        let bestRatio = -1;
        elements.forEach((el, i) => {
          const ratio = ratios.get(el.id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestIdx = i;
          }
        });

        if (bestRatio > 0) setActiveIdx(bestIdx);
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const current = sections[activeIdx];

  return (
    <div className={`relative ${className}`}>
      <div className="space-y-8">
        {sections.map((section) => (
          <div
            key={section.id}
            id={`section-${section.id}`}
            className="scroll-mt-24"
          >
            {section.node}
          </div>
        ))}
      </div>

      <div className="pointer-events-none fixed right-4 top-1/2 z-30 flex -translate-y-1/2 flex-col items-center gap-2 md:right-6">
        <button
          type="button"
          aria-label="Previous section"
          disabled={activeIdx === 0}
          onClick={() => scrollTo(activeIdx - 1)}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-avi-deep/15 bg-white/25 text-avi-deep/70 shadow-sm backdrop-blur-sm transition hover:bg-white/45 hover:text-avi-deep disabled:pointer-events-none disabled:opacity-25"
        >
          <ChevronUp className="h-5 w-5" />
        </button>

        <span className="pointer-events-none rounded-full border border-avi-deep/10 bg-white/20 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-avi-deep/60 backdrop-blur-sm">
          {activeIdx + 1}/{total}
        </span>

        <button
          type="button"
          aria-label="Next section"
          disabled={activeIdx === total - 1}
          onClick={() => scrollTo(activeIdx + 1)}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-avi-deep/15 bg-white/25 text-avi-deep/70 shadow-sm backdrop-blur-sm transition hover:bg-white/45 hover:text-avi-deep disabled:pointer-events-none disabled:opacity-25"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>

      <div className="pointer-events-none fixed bottom-20 right-4 z-30 hidden max-w-[140px] text-right text-[10px] font-medium text-avi-deep/50 md:block">
        {current.label}
      </div>
    </div>
  );
}
