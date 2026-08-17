import { useMemo, useState } from 'react';

/**
 * Azure Portal–style warehouse console for the AviLease demo.
 * Sources: Leaseworks (SF) · Core Financial Systems (Infor SunSystems) · Aerlytix
 */

const NAV = [
  { id: 'overview', label: 'Overview', icon: '▣' },
  { id: 'adf', label: 'Data factory', icon: '⬡' },
  { id: 'storage', label: 'Storage account', icon: '▤' },
  { id: 'synapse', label: 'Synapse studio', icon: '☰' },
  { id: 'linked', label: 'Linked services', icon: '◎' },
];

const LINKED = [
  {
    name: 'ls_leaseworks_salesforce',
    product: 'Leaseworks',
    detail: 'Salesforce REST / SOQL — lease & asset register',
    type: 'Salesforce',
    status: 'Connected',
  },
  {
    name: 'ls_core_financial_sunsystems',
    product: 'Core Financial Systems',
    detail: 'Infor SunSystems — rent, GL, IFRS16 (aviation leasing)',
    type: 'Azure SQL / On-prem SQL',
    status: 'Connected',
    href: 'https://corefinancial.ie/',
  },
  {
    name: 'ls_aerlytix',
    product: 'Aerlytix',
    detail: 'Aviation finance analytics — transitions & lifecycle',
    type: 'REST / API',
    status: 'Connected',
    href: 'https://www.aerlytix.com/',
  },
];

const PIPELINE_NODES = [
  { id: 'lw', x: 40, y: 80, label: 'Copy Leaseworks', sub: '→ bronze/leaseworks' },
  { id: 'cf', x: 40, y: 180, label: 'Copy Core Financial', sub: '→ bronze/core_finance' },
  { id: 'ax', x: 40, y: 280, label: 'Copy Aerlytix', sub: '→ bronze/aerlytix' },
  { id: 'dbt', x: 320, y: 180, label: 'dbt transform', sub: 'bronze → silver → gold' },
  { id: 'ok', x: 560, y: 180, label: 'Publish gold', sub: 'Synapse OPENROWSET ready' },
];

const LAKE_TREE = [
  { path: 'bronze/leaseworks/', files: 'assets.parquet', rows: 142 },
  { path: 'bronze/core_finance/', files: 'rent_receipts.parquet', rows: 128 },
  { path: 'bronze/aerlytix/', files: 'transitions.parquet', rows: 14 },
  { path: 'silver/leases/', files: 'leases.parquet', rows: 142 },
  { path: 'gold/leases/', files: 'leases.parquet', rows: 142 },
  { path: 'gold/monthly_revenue/', files: 'monthly_revenue.parquet', rows: 24 },
];

const SQL_SCRIPT = `-- Synapse serverless · AviLease gold
-- Storage: stavileasedemo / avilease-demo

CREATE OR ALTER VIEW vw_active_leases AS
SELECT
  registration,
  aircraftType,
  lessee,
  region,
  monthlyRent,
  status,
  sourceSystem,
  CASE
    WHEN status = 'In Transition' THEN 'Transition'
    WHEN DATEDIFF(day, GETDATE(), leaseEndDate) <= 180 THEN 'Expiring soon'
    WHEN status = 'Off Lease' THEN 'Off lease'
    ELSE 'Current'
  END AS displayStatus
FROM OPENROWSET(
  BULK 'https://stavileasedemo.dfs.core.windows.net/avilease-demo/gold/leases/*.parquet',
  FORMAT = 'PARQUET'
) AS leases;

-- Consumers: Ops UI (Express) + Power BI → same views`;

export default function ConfigurePage({ onGoPipeline }) {
  const [pane, setPane] = useState('overview');
  const [running, setRunning] = useState(false);
  const [runStep, setRunStep] = useState(-1);
  const [selectedFile, setSelectedFile] = useState(LAKE_TREE[0]);

  const breadcrumb = useMemo(() => {
    const map = {
      overview: 'Overview',
      adf: 'adf-avilease-demo | Author',
      storage: 'stavileasedemo | Containers',
      synapse: 'syn-avilease-demo | Develop',
      linked: 'adf-avilease-demo | Linked services',
    };
    return map[pane];
  }, [pane]);

  async function triggerPipeline() {
    setRunning(true);
    for (let i = 0; i < PIPELINE_NODES.length; i++) {
      setRunStep(i);
      await sleep(650);
    }
    setRunning(false);
    setRunStep(PIPELINE_NODES.length);
  }

  return (
    <div className="space-y-3">
      <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-prodigy-crimson">
            How it looks in Azure
          </p>
          <h1 className="mt-1 text-3xl font-normal text-avi-deep">The warehouse on Azure</h1>
          <p className="mt-1 max-w-3xl text-sm text-prodigy-muted">
            This is the pilot setup. Production uses Microsoft Fabric to do the same job — one
            place for Leaseworks, Core Financial, and Aerlytix.
          </p>
      </div>

      {/* Azure portal chrome */}
      <div className="overflow-hidden rounded-lg border border-[#d1d1d1] bg-[#faf9f8] shadow-card">
        {/* Top bar */}
        <div className="flex h-10 items-center gap-3 bg-[#0078d4] px-3 text-white">
          <span className="text-sm font-semibold tracking-wide">Microsoft Azure</span>
          <span className="hidden text-xs text-white/80 sm:inline">| Resource group · rg-avilease-dw-demo</span>
          <span className="ml-auto rounded bg-white/15 px-2 py-0.5 text-[10px] font-semibold">
            East US · Subscription: Prodigy Demo
          </span>
        </div>

        <div className="flex min-h-[520px]">
          {/* Left nav */}
          <aside className="hidden w-[200px] shrink-0 border-r border-[#e1dfdd] bg-[#f3f2f1] md:block">
            <div className="border-b border-[#e1dfdd] px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-[#605e5c]">
              Azure services
            </div>
            {NAV.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setPane(n.id)}
                className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm ${
                  pane === n.id
                    ? 'border-l-4 border-[#0078d4] bg-white font-semibold text-[#0078d4]'
                    : 'border-l-4 border-transparent text-[#323130] hover:bg-white/70'
                }`}
              >
                <span className="text-xs opacity-70">{n.icon}</span>
                {n.label}
              </button>
            ))}
            <div className="mt-4 border-t border-[#e1dfdd] px-3 py-3 text-[10px] text-[#605e5c]">
              Delivered by <span className="font-semibold text-prodigy-crimson">prodigy</span>
            </div>
          </aside>

          {/* Main */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex flex-wrap items-center gap-2 border-b border-[#e1dfdd] bg-white px-3 py-2 text-xs text-[#605e5c]">
              <span className="font-semibold text-[#323130]">Home</span>
              <span>/</span>
              <span>{breadcrumb}</span>
              <div className="ml-auto flex gap-1 md:hidden">
                {NAV.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setPane(n.id)}
                    className={`rounded px-2 py-1 ${pane === n.id ? 'bg-[#0078d4] text-white' : 'bg-[#f3f2f1]'}`}
                  >
                    {n.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {pane === 'overview' && (
                <Overview
                  onOpen={(id) => setPane(id)}
                  onGoPipeline={onGoPipeline}
                />
              )}
              {pane === 'adf' && (
                <AdfCanvas
                  running={running}
                  runStep={runStep}
                  onTrigger={triggerPipeline}
                  onGoPipeline={onGoPipeline}
                />
              )}
              {pane === 'storage' && (
                <StorageBrowser
                  selected={selectedFile}
                  onSelect={setSelectedFile}
                />
              )}
              {pane === 'synapse' && <SynapseStudio />}
              {pane === 'linked' && <LinkedServices />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Overview({ onOpen, onGoPipeline }) {
  const cards = [
    {
      title: 'Data factory',
      name: 'adf-avilease-demo',
      meta: '3 linked services · 1 pipeline',
      id: 'adf',
    },
    {
      title: 'Storage account',
      name: 'stavileasedemo',
      meta: 'ADLS Gen2 · bronze / silver / gold',
      id: 'storage',
    },
    {
      title: 'Synapse workspace',
      name: 'syn-avilease-demo',
      meta: 'Serverless SQL · 5 gold views',
      id: 'synapse',
    },
  ];
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-[#323130]">rg-avilease-dw-demo</h2>
      <p className="text-sm text-[#605e5c]">
        Resource group for the AviLease pilot. Production moves this into Microsoft Fabric.
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        {cards.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onOpen(c.id)}
            className="rounded border border-[#e1dfdd] bg-white p-4 text-left shadow-sm hover:border-[#0078d4]"
          >
            <div className="text-[10px] font-bold uppercase tracking-wide text-[#0078d4]">{c.title}</div>
            <div className="mt-1 font-semibold text-[#323130]">{c.name}</div>
            <div className="mt-1 text-xs text-[#605e5c]">{c.meta}</div>
          </button>
        ))}
      </div>
      <div className="rounded border border-[#ffe5b4] bg-[#fff8e7] p-3 text-sm text-[#323130]">
        <strong>Why Azure:</strong> Core Financial Systems (Infor SunSystems) is outside Salesforce.
        Aerlytix + Leaseworks land beside it in one lake — then Synapse serves Ops UI and Power BI.
      </div>
      <button
        type="button"
        onClick={onGoPipeline}
        className="rounded bg-[#0078d4] px-4 py-2 text-sm font-semibold text-white"
      >
        Open demo run monitor →
      </button>
    </div>
  );
}

function AdfCanvas({ running, runStep, onTrigger, onGoPipeline }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-[#323130]">pl_avilease_medallion_sync</h2>
          <p className="text-xs text-[#605e5c]">Factory: adf-avilease-demo · Authoring canvas</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={running}
            onClick={onTrigger}
            className="rounded bg-[#0078d4] px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {running ? 'Debug running…' : 'Debug / Trigger now'}
          </button>
          <button
            type="button"
            onClick={onGoPipeline}
            className="rounded border border-[#0078d4] px-3 py-1.5 text-sm font-semibold text-[#0078d4]"
          >
            Monitor
          </button>
        </div>
      </div>

      <div className="relative h-[380px] overflow-hidden rounded border border-[#e1dfdd] bg-[#faf9f8]">
        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          <line x1="160" y1="100" x2="320" y2="200" stroke="#8a8886" strokeWidth="2" />
          <line x1="160" y1="200" x2="320" y2="200" stroke="#8a8886" strokeWidth="2" />
          <line x1="160" y1="300" x2="320" y2="200" stroke="#8a8886" strokeWidth="2" />
          <line x1="440" y1="200" x2="560" y2="200" stroke="#8a8886" strokeWidth="2" />
        </svg>
        {PIPELINE_NODES.map((n, i) => {
          const active = runStep === i;
          const done = runStep > i;
          return (
            <div
              key={n.id}
              className={`absolute w-[200px] rounded border-2 bg-white p-2 shadow-sm ${
                active
                  ? 'border-[#0078d4] ring-2 ring-[#0078d4]/30'
                  : done
                    ? 'border-[#107c10]'
                    : 'border-[#e1dfdd]'
              }`}
              style={{ left: n.x, top: n.y }}
            >
              <div className="text-[10px] font-bold uppercase text-[#605e5c]">Activity</div>
              <div className="text-sm font-semibold text-[#323130]">{n.label}</div>
              <div className="text-[11px] text-[#605e5c]">{n.sub}</div>
              <div className="mt-1 text-[10px] font-semibold">
                {active ? 'In progress' : done ? 'Succeeded' : 'Ready'}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-[#605e5c]">
        Demo canvas mirrors ADF Author view. In production this is the live factory in Azure.
      </p>
    </div>
  );
}

function StorageBrowser({ selected, onSelect }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-[#323130]">
        Container: avilease-demo <span className="text-sm font-normal text-[#605e5c]">(HNS enabled)</span>
      </h2>
      <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
        <div className="overflow-hidden rounded border border-[#e1dfdd] bg-white">
          <div className="border-b border-[#e1dfdd] bg-[#f3f2f1] px-3 py-2 text-xs font-semibold">
            Directory
          </div>
          {LAKE_TREE.map((f) => (
            <button
              key={f.path}
              type="button"
              onClick={() => onSelect(f)}
              className={`flex w-full items-center justify-between border-b border-[#f3f2f1] px-3 py-2 text-left text-sm ${
                selected.path === f.path ? 'bg-[#deecf9]' : 'hover:bg-[#faf9f8]'
              }`}
            >
              <span className="font-mono text-xs text-[#0078d4]">{f.path}</span>
              <span className="text-xs text-[#605e5c]">{f.rows} rows</span>
            </button>
          ))}
        </div>
        <div className="rounded border border-[#e1dfdd] bg-white p-3">
          <div className="text-[10px] font-bold uppercase text-[#605e5c]">Properties</div>
          <div className="mt-2 font-mono text-sm text-[#323130]">{selected.path}{selected.files}</div>
          <dl className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-[#605e5c]">Format</dt>
              <dd>Parquet</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#605e5c]">Approx rows</dt>
              <dd>{selected.rows}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#605e5c]">Zone</dt>
              <dd className="font-semibold capitalize">{selected.path.split('/')[0]}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

function SynapseStudio() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#323130]">create_views.sql</h2>
          <p className="text-xs text-[#605e5c]">syn-avilease-demo · Serverless SQL pool · Develop</p>
        </div>
        <span className="rounded bg-[#107c10] px-2 py-1 text-[10px] font-bold text-white">RUN · Succeeded</span>
      </div>
      <pre className="overflow-x-auto rounded border border-[#3c3c3c] bg-[#1e1e1e] p-4 text-[11px] leading-relaxed text-[#d4d4d4]">
        {SQL_SCRIPT}
      </pre>
      <div className="flex flex-wrap gap-2">
        {['vw_fleet_kpis', 'vw_fleet_by_type', 'vw_lease_status', 'vw_active_leases', 'vw_monthly_revenue'].map(
          (v) => (
            <span
              key={v}
              className="rounded border border-[#e1dfdd] bg-white px-2 py-1 font-mono text-[11px] text-[#0078d4]"
            >
              {v}
            </span>
          )
        )}
      </div>
    </div>
  );
}

function LinkedServices() {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-[#323130]">Linked services</h2>
      <p className="text-sm text-[#605e5c]">
        Connection objects in ADF — how AviLease systems are registered before pipelines run.
      </p>
      <div className="overflow-hidden rounded border border-[#e1dfdd] bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[#f3f2f1] text-left text-[10px] uppercase text-[#605e5c]">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {LINKED.map((l) => (
              <tr key={l.name} className="border-t border-[#f3f2f1]">
                <td className="px-3 py-2 font-mono text-xs text-[#0078d4]">{l.name}</td>
                <td className="px-3 py-2">
                  <div className="font-semibold">{l.product}</div>
                  <div className="text-xs text-[#605e5c]">
                    {l.detail}
                    {l.href && (
                      <>
                        {' '}
                        ·{' '}
                        <a className="text-[#0078d4] underline" href={l.href} target="_blank" rel="noreferrer">
                          site
                        </a>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2">{l.type}</td>
                <td className="px-3 py-2">
                  <span className="rounded bg-[#dff6dd] px-2 py-0.5 text-xs font-semibold text-[#107c10]">
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
