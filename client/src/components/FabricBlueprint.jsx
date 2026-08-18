import {
  DataFactoryIcon,
  LakehouseIcon,
  OneLakeIcon,
  PowerBiIcon,
  WarehouseIcon,
  CopilotIcon,
  RealTimeIcon,
} from './fabric/MsIcons';

const LAYERS = [
  {
    id: 'bronze',
    name: 'Bronze',
    where: 'OneLake Files',
    format: 'Parquet · as landed',
    why: 'Keep the extract. Do not rewrite history.',
    tone: '#8A8886',
    items: [
      { path: 'bronze/leaseworks/', holds: 'Leases, aircraft, lessee' },
      { path: 'bronze/core_finance/', holds: 'Rent, invoices, GL' },
      { path: 'bronze/aerlytix/', holds: 'Transitions, utilisation' },
    ],
  },
  {
    id: 'silver',
    name: 'Silver',
    where: 'Lakehouse tables',
    format: 'Delta · cleaned',
    why: 'Typed keys. Still one table per source.',
    tone: '#00B7C3',
    items: [
      { path: 'silver_leases', holds: 'Tail, type, lessee, status' },
      { path: 'silver_rent', holds: 'Tail, currency, monthly rent' },
      { path: 'silver_transitions', holds: 'Tail, event, days in state' },
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    where: 'Lakehouse + warehouse',
    format: 'Delta · business grain',
    why: 'One aircraft, one row. This is what people see.',
    tone: '#003B51',
    items: [
      { path: 'gold_fleet', holds: 'Joined fleet — ops + board' },
      { path: 'gold_revenue', holds: 'YTD rent by tail and month' },
    ],
  },
];

const USES = [
  {
    Icon: DataFactoryIcon,
    name: 'Data Factory',
    item: 'pl_fleet_sync',
    use: 'Hourly collect from the three systems. Does not store data.',
    when: 'Day 1',
  },
  {
    Icon: OneLakeIcon,
    name: 'OneLake',
    item: 'one copy',
    use: 'Files and Delta tables live here. Nothing is copied into Excel.',
    when: 'Day 1',
  },
  {
    Icon: LakehouseIcon,
    name: 'Lakehouse',
    item: 'lh_avilease',
    use: 'Bronze files, silver and gold tables. Spark or SQL over the same files.',
    when: 'Day 1',
  },
  {
    Icon: WarehouseIcon,
    name: 'Warehouse',
    item: 'wh_finance',
    use: 'SQL mart for finance. Reads gold — not a second extract from SunSystems.',
    when: 'Day 1',
  },
  {
    Icon: PowerBiIcon,
    name: 'Power BI',
    item: 'DirectLake',
    use: 'Board pack on gold_fleet. No Import copy, so ops and the pack cannot drift.',
    when: 'Day 1',
  },
  {
    Icon: CopilotIcon,
    name: 'Copilot',
    item: 'on gold',
    use: 'English questions after the join is trusted. Not on three spreadsheets.',
    when: 'Then',
  },
];

function Arrow() {
  return (
    <div className="hidden items-center justify-center text-[#00B7C3] lg:flex" aria-hidden>
      <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
        <path d="M0 8h24M20 2l6 6-6 6" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </div>
  );
}

function DownLabel({ children }) {
  return (
    <div className="flex items-center justify-center gap-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#00B7C3]">
      <span className="hidden h-px w-10 bg-[#00B7C3]/40 sm:block" />
      {children}
      <span className="hidden h-px w-10 bg-[#00B7C3]/40 sm:block" />
    </div>
  );
}

export default function FabricBlueprint({ onOpenWorkspace }) {
  return (
    <section className="space-y-4">
      <header>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00B7C3]">
          Microsoft Fabric
        </p>
        <h2 className="mt-1 text-lg font-semibold text-avi-deep">What we use, and where data lives</h2>
        <p className="mt-1 max-w-2xl text-sm text-prodigy-muted">
          One workspace. Collect with Data Factory. Store once in OneLake. Serve ops and Power BI
          from the same gold tables.
        </p>
      </header>

      <div
        className="overflow-hidden rounded-xl border border-prodigy-line bg-white"
        style={{
          backgroundImage:
            'radial-gradient(#E6EEF1 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        <div className="space-y-3 p-4 md:p-5">
          <div className="grid gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
            <FlowBox
              kicker="Collect"
              title="Data Factory"
              sub="pl_fleet_sync · hourly"
              body="Connectors into Leaseworks, Core Financial, Aerlytix. Moves rows. Does not keep a copy."
            />
            <Arrow />
            <FlowBox
              kicker="Store"
              title="OneLake"
              sub="lh_avilease"
              body="One copy of AviLease data. Bronze as files. Silver and gold as Delta tables."
              accent
            />
            <Arrow />
            <FlowBox
              kicker="Serve"
              title="DirectLake + SQL"
              sub="ops UI · Power BI · warehouse"
              body="Everyone reads gold. No second extract, no Import dataset."
            />
          </div>

          <DownLabel>Inside OneLake — medallion</DownLabel>

          <div className="grid gap-3 lg:grid-cols-3">
            {LAYERS.map((layer, i) => (
              <article
                key={layer.id}
                className="relative rounded-lg border border-prodigy-line bg-white/95 p-4"
              >
                <div className="mb-3 h-1 w-10 rounded-full" style={{ background: layer.tone }} />
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-sm font-semibold text-avi-deep">
                    {String(i + 1).padStart(2, '0')}  {layer.name}
                  </h3>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-prodigy-muted">
                    {layer.where}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[11px] text-[#0078D4]">{layer.format}</p>
                <p className="mt-1 text-xs text-prodigy-muted">{layer.why}</p>
                <ul className="mt-3 space-y-2">
                  {layer.items.map((it) => (
                    <li key={it.path} className="border-t border-prodigy-line pt-2">
                      <p className="font-mono text-[11px] font-semibold text-avi-deep">{it.path}</p>
                      <p className="text-xs text-prodigy-muted">{it.holds}</p>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-avi-deep">Each Fabric piece — for what</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {USES.map((u) => (
            <article
              key={u.name}
              className="flex gap-3 rounded-xl border border-prodigy-line bg-white p-3.5"
            >
              <u.Icon className="h-9 w-9 shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-avi-deep">{u.name}</h4>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                      u.when === 'Day 1'
                        ? 'bg-[#DFF6DD] text-[#0B6A0B]'
                        : 'bg-[#F3F0FF] text-[#5B2BE0]'
                    }`}
                  >
                    {u.when}
                  </span>
                </div>
                <p className="font-mono text-[10px] text-[#0078D4]">{u.item}</p>
                <p className="mt-1 text-xs leading-relaxed text-prodigy-muted">{u.use}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#00B7C3]/30 bg-white px-4 py-3">
        <div className="flex items-start gap-3">
          <RealTimeIcon className="mt-0.5 h-8 w-8 shrink-0" />
          <p className="text-sm text-prodigy-muted">
            <span className="font-semibold text-avi-deep">Not on day one:</span> Real-Time
            Intelligence and Spark notebooks. Add them when off-lease alerts need minutes, not the
            hourly pipeline.
          </p>
        </div>
        {onOpenWorkspace && (
          <button
            type="button"
            onClick={onOpenWorkspace}
            className="shrink-0 rounded bg-[#0078D4] px-3.5 py-2 text-sm font-semibold text-white"
          >
            Open the workspace →
          </button>
        )}
      </div>
    </section>
  );
}

function FlowBox({ kicker, title, sub, body, accent }) {
  return (
    <div
      className={`rounded-lg border bg-white p-4 ${
        accent ? 'border-[#00B7C3] shadow-[0_0_0_3px_rgba(0,183,195,0.12)]' : 'border-prodigy-line'
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#00B7C3]">{kicker}</p>
      <h3 className="mt-1 text-sm font-semibold text-avi-deep">{title}</h3>
      <p className="font-mono text-[11px] text-[#0078D4]">{sub}</p>
      <p className="mt-2 text-xs leading-relaxed text-prodigy-muted">{body}</p>
    </div>
  );
}
