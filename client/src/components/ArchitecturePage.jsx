import IngestLook from './IngestLook';
import FabricBlueprint from './FabricBlueprint';
import ArchitectureDecisions from './ArchitectureDecisions';
import CollabHero from './CollabHero';
import SectionPager from './SectionPager';
import { CopilotIcon, FabricMark, MsSquares } from './fabric/MsIcons';

const TODAY = [
  {
    title: 'Today',
    items: [
      'Data lives in more than one place',
      'Manual effort to consolidate reporting',
      'Questions that should take minutes to answer require more time',
    ],
  },
  {
    title: 'After this',
    items: [
      'Data unified in one location',
      'Automated metrics and reporting as needed',
      'Instant access to answers leveraging data and AI',
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
    body: 'Leaseworks (LW) owns the ops picture: tail, aircraft type, lessee, lease status and key dates. Core Financial owns the money: monthly rent, invoices and the general ledger. Aerlytix owns the lifecycle: transitions, off-lease events and utilisation. We never mix sources on the same field.',
  },
  {
    title: 'Bad data does not reach the pack',
    body: 'If a tail is missing rent, or status does not match, it is held and flagged — not slipped into Power BI.',
  },
  {
    title: 'We can show our working',
    body: 'Open any aircraft and trace each figure to its source — lease status and dates from LW, rent and book values from Core Financial, transition timeline and EOL from Aerlytix. That is how we prove the number in a meeting.',
  },
];

const WHO = [
  { who: 'Operations (Contracts, Technical, Finance)', how: 'The live fleet — on lease, coming off, parked — without exporting from Leaseworks.' },
  { who: 'Marketing', how: 'Instant, trusted fleet figures in Power BI for campaigns and briefings — aligned to ops changes automatically.' },
  { who: 'Leadership', how: 'The same figures in Power BI. If ops changes, the pack is already aligned.' },
];

const AI_STEPS = [
  {
    n: '1',
    title: 'Consolidate',
    body: 'One row per aircraft. Status, rent, and transitions already agree — or the row is held.',
  },
  {
    n: '2',
    title: 'Decide',
    body: 'Ops and the board use that same row in the fleet screen and Power BI. No second version of the truth.',
  },
  {
    n: '3',
    title: 'Ask',
    body: 'Then Copilot in Microsoft Fabric can answer in English — because it reads one checked fleet row, not three disconnected lists.',
  },
];

const AI_ASKS = [
  'Which tails come off lease in 90 days, and what rent is at risk?',
  'Where is utilisation weakest by region?',
  'Which lessees concentrate more than 20% of revenue?',
];

const PHASES = [
  { phase: '1) Prototype / proof of concept', body: 'One joined fleet row that ops and stakeholders can trust.' },
  { phase: '2) Integrate LW + Core + Aerlytix', body: 'Connect the three sources, then publish one fleet row for reports and screens.' },
  { phase: '3) Copilot + additional integrations', body: 'Add Copilot in Microsoft Fabric on the trusted fleet, then extend to other data sources when ready.' },
];

export default function ArchitecturePage({ onConfigure, onPipeline }) {
  const sections = [
    {
      id: 'intro',
      label: 'Overview',
      node: (
        <div className="mx-auto max-w-5xl space-y-8">
          <CollabHero />
          <header>
            <div className="flex flex-wrap items-center gap-2">
              <MsSquares className="h-5 w-5" />
              <span className="text-sm font-semibold text-[#242424]">Microsoft Fabric</span>
              <span className="text-prodigy-muted">·</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C5A572]">
                Prodigy × AviLease
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-normal tracking-tight text-avi-deep md:text-4xl">
              All core systems feeding one view, for everyone who needs it
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-prodigy-muted">
              We unify data from your core systems and spreadsheets so it can be queried
              consistently — the joined picture reporting and later AI can safely use.
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
        </div>
      ),
    },
    {
      id: 'ingest',
      label: 'How it looks',
      node: (
        <div className="mx-auto max-w-5xl">
          <IngestLook />
        </div>
      ),
    },
    {
      id: 'decisions',
      label: 'Why Fabric',
      node: (
        <div className="mx-auto max-w-5xl">
          <ArchitectureDecisions />
        </div>
      ),
    },
    {
      id: 'fabric',
      label: 'Fabric blueprint',
      node: (
        <div className="mx-auto max-w-5xl">
          <FabricBlueprint onOpenWorkspace={onConfigure} />
        </div>
      ),
    },
    {
      id: 'trust',
      label: 'Trust the data',
      node: (
        <div className="mx-auto max-w-5xl">
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
        </div>
      ),
    },
    {
      id: 'ai',
      label: 'AI step',
      node: (
        <div className="mx-auto max-w-5xl">
          <section>
            <div className="flex flex-wrap items-center gap-2">
              <CopilotIcon className="h-8 w-8" />
              <h2 className="text-lg font-semibold text-avi-deep">
                Why this consolidation is the AI step
              </h2>
            </div>
            <p className="mt-1 text-sm text-prodigy-muted">
              AI does not fix broken data. If rent lives in Core Financial, status lives in
              Leaseworks, and transitions come from Aerlytix, a chatbot will guess. Join first,
              then ask.
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {AI_STEPS.map((s) => (
                <article key={s.n} className="rounded-xl border border-prodigy-line bg-white p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wide text-[#5B2BE0]">
                    Step {s.n}
                  </div>
                  <h3 className="mt-1 text-sm font-semibold text-avi-deep">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-prodigy-muted">{s.body}</p>
                </article>
              ))}
            </div>
            <div className="mt-3 rounded-xl border border-[#B4A0FF]/40 bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#5B2BE0]">
                Questions this data can answer — once it is joined
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-avi-deep">
                {AI_ASKS.map((q) => (
                  <li key={q}>“{q}”</li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-prodigy-muted">
                That is Copilot in Fabric and Power BI — on AviLease’s gold fleet, not a parallel AI
                project.
              </p>
            </div>
          </section>
        </div>
      ),
    },
    {
      id: 'who',
      label: 'Who uses it',
      node: (
        <div className="mx-auto max-w-5xl space-y-8">
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
        </div>
      ),
    },
    {
      id: 'next',
      label: 'Next steps',
      node: (
        <div className="mx-auto max-w-5xl">
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
      ),
    },
  ];

  return <SectionPager sections={sections} />;
}
