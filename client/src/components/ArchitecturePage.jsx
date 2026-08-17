import IngestLook from './IngestLook';
import { FabricMark, MsSquares } from './fabric/MsIcons';

const TODAY = [
  {
    title: 'Today',
    items: [
      'Three systems, three extracts, one Excel pack',
      'Fleet status and rent rarely match on the same day',
      'The board sees last week’s numbers',
    ],
  },
  {
    title: 'After this',
    items: [
      'One fleet picture — ops and the board',
      'Lease, rent, and transitions already joined',
      'Hours old, not last month’s pack',
    ],
  },
];

const TRUST = [
  {
    title: 'One aircraft, one row',
    body: 'EI-AVL in Leaseworks, Core Financial, and Aerlytix becomes one line: type, lessee, rent, status. No VLOOKUP.',
  },
  {
    title: 'Each number has an owner',
    body: 'Status from Leaseworks. Rent from Core Financial. Transitions from Aerlytix. We do not mix sources on the same field.',
  },
  {
    title: 'Bad data does not reach the pack',
    body: 'If a tail is missing rent, or status does not match, it is held and flagged — not slipped into Power BI.',
  },
  {
    title: 'We can show our working',
    body: 'Click any aircraft and see where the figure came from. That is how we prove the number in a meeting.',
  },
];

const WHO = [
  { who: 'Leasing ops', how: 'The live fleet — on lease, coming off, parked — without exporting from Leaseworks.' },
  { who: 'Finance', how: 'Rent and YTD next to the aircraft, from Core Financial, not a second spreadsheet.' },
  { who: 'Leadership', how: 'The same figures in Power BI. If ops changes, the pack is already aligned.' },
];

const PHASES = [
  { phase: 'Now', body: 'This demo — one joined fleet from the three systems you already run.' },
  { phase: 'Next', body: 'Alerts when an aircraft is coming off lease, in minutes not overnight.' },
  { phase: 'Then', body: 'Roll out to the wider team, with AviLease logins.' },
];

export default function ArchitecturePage({ onConfigure, onPipeline }) {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <MsSquares className="h-5 w-5" />
          <span className="text-sm font-semibold text-[#242424]">Microsoft Fabric</span>
          <span className="text-prodigy-muted">·</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-prodigy-crimson">
            Prodigy for AviLease
          </span>
        </div>
        <h1 className="mt-3 text-3xl font-normal tracking-tight text-avi-deep md:text-4xl">
          One number for the fleet — ops and the board
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-prodigy-muted">
          Leaseworks, Core Financial, and Aerlytix stay. We join them so utilisation, rent, and
          transitions sit on the same aircraft — and nobody rebuilds the pack in Excel.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {TODAY.map((col) => (
          <article
            key={col.title}
            className={`rounded-xl border p-4 ${
              col.title === 'After this'
                ? 'border-[#00B7C3]/50 bg-white'
                : 'border-prodigy-line bg-white'
            }`}
          >
            <h2 className="text-sm font-semibold text-avi-deep">{col.title}</h2>
            <ul className="mt-2 space-y-1.5 text-sm text-prodigy-muted">
              {col.items.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <IngestLook />

      <section>
        <h2 className="text-lg font-semibold text-avi-deep">Why leadership can trust the data</h2>
        <p className="mt-1 text-sm text-prodigy-muted">
          This is the data work — not extra tools. Rules, owners, and checks before a number is
          shown.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {TRUST.map((t) => (
            <article key={t.title} className="rounded-xl border border-prodigy-line bg-white p-4">
              <h3 className="text-sm font-semibold text-avi-deep">{t.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-prodigy-muted">{t.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-avi-deep">Who uses it</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {WHO.map((u) => (
            <article key={u.who} className="rounded-xl border border-prodigy-line bg-white p-4">
              <h3 className="text-sm font-semibold text-avi-deep">{u.who}</h3>
              <p className="mt-1.5 text-sm text-prodigy-muted">{u.how}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-prodigy-line bg-white p-4">
        <h2 className="text-lg font-semibold text-avi-deep">What it costs to host</h2>
        <p className="mt-2 text-sm text-prodigy-muted">
          Microsoft Fabric for a team this size is typically{' '}
          <strong className="text-avi-deep">about $650–2,500 a month</strong> to run. Prodigy
          delivery is a separate piece of work, quoted once the scope is agreed.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-avi-deep">How we would roll it out</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {PHASES.map((p) => (
            <article key={p.phase} className="rounded-xl border border-prodigy-line bg-white p-4">
              <h3 className="text-sm font-semibold text-[#0078D4]">{p.phase}</h3>
              <p className="mt-1.5 text-sm text-prodigy-muted">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-2 border-t border-prodigy-line pt-4">
        <button
          type="button"
          onClick={onConfigure}
          className="inline-flex items-center gap-2 rounded bg-[#0078D4] px-4 py-2 text-sm font-semibold text-white"
        >
          <FabricMark className="h-5 w-5" />
          Show the Microsoft workspace →
        </button>
        <button
          type="button"
          onClick={onPipeline}
          className="rounded border border-prodigy-line bg-white px-4 py-2 text-sm font-semibold text-avi-deep"
        >
          Watch the data come in →
        </button>
      </div>
    </div>
  );
}
