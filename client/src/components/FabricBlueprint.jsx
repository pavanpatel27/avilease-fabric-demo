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
    bg: 'from-[#F8F8F8] to-white',
    ring: 'ring-[#8A8886]/20',
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
    bg: 'from-[#F0FBFC] to-white',
    ring: 'ring-[#00B7C3]/25',
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
    bg: 'from-[#EEF6F8] to-white',
    ring: 'ring-avi-deep/20',
    items: [
      { path: 'gold_fleet', holds: 'Joined fleet — ops + board' },
      { path: 'gold_revenue', holds: 'YTD rent by tail and month' },
    ],
  },
];

const FLOW = [
  {
    kicker: 'Collect',
    title: 'Data Factory',
    sub: 'pl_fleet_sync · hourly',
    body: 'Connectors into Leaseworks, Core Financial, Aerlytix. Moves rows. Does not keep a copy.',
    Icon: DataFactoryIcon,
    accent: false,
  },
  {
    kicker: 'Store',
    title: 'OneLake',
    sub: 'lh_avilease',
    body: 'One copy of AviLease data. Bronze as files. Silver and gold as Delta tables.',
    Icon: OneLakeIcon,
    accent: true,
  },
  {
    kicker: 'Serve',
    title: 'DirectLake + SQL',
    sub: 'ops UI · Power BI · warehouse',
    body: 'Everyone reads gold. No second extract, no Import dataset.',
    Icon: PowerBiIcon,
    accent: false,
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

function FlowArrow() {
  return (
    <div className="hidden items-center justify-center px-1 lg:flex" aria-hidden>
      <div className="flex items-center gap-0.5 text-[#00B7C3]">
        <span className="h-px w-6 bg-gradient-to-r from-transparent to-[#00B7C3]/60" />
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M4 9h10M11 5l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

export default function FabricBlueprint({ onOpenWorkspace }) {
  return (
    <section className="space-y-5">
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

      <div className="overflow-hidden rounded-2xl border border-[#D4E8EC] bg-gradient-to-b from-[#F7FCFD] to-white shadow-card">
        <div className="border-b border-[#D4E8EC]/80 bg-white/70 px-4 py-2.5 md:px-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#00B7C3]">
            End-to-end flow
          </p>
        </div>

        <div className="space-y-4 p-4 md:p-5">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
            <FlowBox {...FLOW[0]} />
            <FlowArrow />
            <FlowBox {...FLOW[1]} />
            <FlowArrow />
            <FlowBox {...FLOW[2]} />
          </div>

          <div className="relative py-2">
            <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#00B7C3]/35 to-transparent" />
            <div className="relative flex justify-center">
              <span className="rounded-full border border-[#00B7C3]/30 bg-white px-4 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#00B7C3] shadow-sm">
                Inside OneLake — medallion
              </span>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            {LAYERS.map((layer, i) => (
              <article
                key={layer.id}
                className={`relative overflow-hidden rounded-xl border border-prodigy-line/80 bg-gradient-to-b ${layer.bg} p-0 ring-1 ${layer.ring}`}
              >
                <div
                  className="flex items-center justify-between px-4 py-2.5 text-white"
                  style={{ background: `linear-gradient(135deg, ${layer.tone} 0%, ${layer.tone}dd 100%)` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-sm font-semibold">{layer.name}</h3>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wide text-white/80">
                    {layer.where}
                  </span>
                </div>

                <div className="p-4">
                  <p className="font-mono text-[11px] font-medium text-[#0078D4]">{layer.format}</p>
                  <p className="mt-1 text-xs leading-relaxed text-prodigy-muted">{layer.why}</p>
                  <ul className="mt-3 space-y-2">
                    {layer.items.map((it) => (
                      <li
                        key={it.path}
                        className="rounded-lg border border-prodigy-line/60 bg-white/80 px-3 py-2"
                      >
                        <p className="font-mono text-[11px] font-semibold text-avi-deep">{it.path}</p>
                        <p className="mt-0.5 text-[11px] text-prodigy-muted">{it.holds}</p>
                      </li>
                    ))}
                  </ul>
                </div>
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
              className="group flex gap-3 rounded-xl border border-prodigy-line bg-white p-3.5 transition hover:border-[#00B7C3]/40 hover:shadow-sm"
            >
              <div className="rounded-lg bg-[#F0FBFC] p-1.5 transition group-hover:bg-[#E5F7F9]">
                <u.Icon className="h-8 w-8 shrink-0" />
              </div>
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

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#00B7C3]/25 bg-gradient-to-r from-white to-[#F7FCFD] px-4 py-3 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-white p-1.5 shadow-sm">
            <RealTimeIcon className="h-7 w-7 shrink-0" />
          </div>
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
            className="shrink-0 rounded-lg bg-[#0078D4] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#106EBE]"
          >
            Open the workspace →
          </button>
        )}
      </div>
    </section>
  );
}

function FlowBox({ kicker, title, sub, body, Icon, accent }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-white p-4 transition ${
        accent
          ? 'border-[#00B7C3] shadow-[0_4px_20px_rgba(0,183,195,0.15)]'
          : 'border-prodigy-line shadow-sm hover:shadow-md'
      }`}
    >
      {accent && (
        <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#00B7C3]/10" />
      )}
      <div className="relative flex items-start gap-3">
        <div className={`shrink-0 rounded-lg p-1.5 ${accent ? 'bg-[#E5F7F9]' : 'bg-[#F3F2F1]'}`}>
          <Icon className="h-8 w-8" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#00B7C3]">{kicker}</p>
          <h3 className="mt-0.5 text-sm font-semibold text-avi-deep">{title}</h3>
          <p className="font-mono text-[11px] text-[#0078D4]">{sub}</p>
          <p className="mt-2 text-xs leading-relaxed text-prodigy-muted">{body}</p>
        </div>
      </div>
    </div>
  );
}
