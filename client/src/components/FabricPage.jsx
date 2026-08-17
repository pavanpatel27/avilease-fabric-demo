import { useState } from 'react';
import {
  CopilotIcon,
  DataEngIcon,
  DataFactoryIcon,
  DatabasesIcon,
  EntraIcon,
  ExcelIcon,
  FabricMark,
  LakehouseIcon,
  MsSquares,
  OneLakeIcon,
  PowerBiIcon,
  RealTimeIcon,
  TeamsIcon,
  WarehouseIcon,
  WORKLOADS,
} from './fabric/MsIcons';

const ITEMS = [
  { name: 'lh_avilease', type: 'Lakehouse', when: 'Just now', Icon: LakehouseIcon },
  { name: 'pl_fleet_sync', type: 'Data pipeline', when: '8 min ago', Icon: DataFactoryIcon },
  { name: 'sm_fleet_gold', type: 'Semantic model', when: '8 min ago', Icon: PowerBiIcon },
  { name: 'AviLease Executive', type: 'Power BI report', when: 'Today', Icon: PowerBiIcon },
  { name: 'OneLake / Files', type: 'Shortcut', when: 'Today', Icon: OneLakeIcon },
  { name: 'wh_finance', type: 'Warehouse', when: 'Today', Icon: WarehouseIcon },
];

const RAIL = [
  { id: 'home', label: 'Home' },
  { id: 'create', label: 'Create' },
  { id: 'browse', label: 'Browse' },
  { id: 'onelake', label: 'OneLake' },
  { id: 'workloads', label: 'Workloads' },
];

export default function FabricPage({ onGoPipeline, onAnalytics }) {
  const [rail, setRail] = useState('home');

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-prodigy-crimson">
            Production home
          </p>
          <h1 className="mt-1 text-3xl font-normal text-avi-deep">Microsoft Fabric</h1>
          <p className="mt-1 max-w-2xl text-sm text-prodigy-muted">
            This is the workspace AviLease would open — same product as{' '}
            <a
              className="font-semibold text-[#0078D4] underline"
              href="https://www.microsoft.com/en-ie/microsoft-fabric"
              target="_blank"
              rel="noreferrer"
            >
              microsoft.com/microsoft-fabric
            </a>
            . One place for pipelines, OneLake, and Power BI.
          </p>
        </div>
        <a
          href="https://www.microsoft.com/en-ie/microsoft-fabric"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-[#D1D1D1] bg-white px-4 py-2 text-sm font-semibold text-[#242424]"
        >
          <FabricMark className="h-5 w-5" />
          Try Fabric
        </a>
      </div>

      <div
        className="overflow-hidden rounded-xl border border-[#E1DFDD] bg-[#F5F5F5] shadow-card"
        style={{ fontFamily: '"Segoe UI", system-ui, sans-serif' }}
      >
        <div className="flex h-12 items-center gap-3 border-b border-[#E1DFDD] bg-white px-3">
          <FabricMark className="h-7 w-7" />
          <span className="text-sm font-semibold text-[#242424]">Microsoft Fabric</span>
          <span className="hidden text-[#8A8886] sm:inline">|</span>
          <span className="hidden text-sm text-[#605E5C] sm:inline">AviLease · Fleet workspace</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1 rounded-full bg-[#DFF6DD] px-2 py-0.5 text-[11px] font-semibold text-[#0B6A0B] sm:inline-flex">
              F16 · Running
            </span>
            <CopilotIcon className="h-6 w-6" />
            <EntraIcon className="h-6 w-6" />
          </div>
        </div>

        <div className="flex min-h-[540px]">
          <aside className="hidden w-[72px] shrink-0 flex-col items-center gap-1 bg-[#201F1E] py-3 text-white md:flex">
            {RAIL.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRail(r.id)}
                className={`flex w-[56px] flex-col items-center rounded-md px-1 py-2 text-[10px] ${
                  rail === r.id ? 'bg-white/15' : 'hover:bg-white/10'
                }`}
              >
                <RailGlyph id={r.id} />
                {r.label}
              </button>
            ))}
          </aside>

          <div className="min-w-0 flex-1 p-4 md:p-6">
            {rail === 'home' && (
              <Home onGoPipeline={onGoPipeline} onAnalytics={onAnalytics} />
            )}
            {rail === 'workloads' && <WorkloadsGrid />}
            {rail === 'onelake' && <OneLakePane />}
            {rail === 'create' && <CreatePane />}
            {rail === 'browse' && <Home onGoPipeline={onGoPipeline} onAnalytics={onAnalytics} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Home({ onGoPipeline, onAnalytics }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-[#242424]">Welcome to Fabric, AviLease</h2>
        <p className="mt-1 text-sm text-[#605E5C]">
          Unify teams and data — Data Factory, OneLake, and Power BI on one capacity.
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-[#242424]">Recommended for this workspace</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {WORKLOADS.filter((w) => w.used).map((w) => (
            <article
              key={w.id}
              className="flex gap-3 rounded-lg border border-[#E1DFDD] bg-white p-3 shadow-sm"
            >
              <w.Icon className="h-10 w-10 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-[#242424]">{w.name}</div>
                <p className="mt-0.5 text-xs leading-snug text-[#605E5C]">{w.blurb}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-[#242424]">Recent</h3>
        <div className="overflow-hidden rounded-lg border border-[#E1DFDD] bg-white">
          {ITEMS.map((it) => (
            <div
              key={it.name}
              className="flex items-center gap-3 border-b border-[#EDEBE9] px-3 py-2.5 last:border-0"
            >
              <it.Icon className="h-8 w-8" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-[#242424]">{it.name}</div>
                <div className="text-[11px] text-[#605E5C]">{it.type}</div>
              </div>
              <div className="text-[11px] text-[#8A8886]">{it.when}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onGoPipeline}
          className="rounded bg-[#0078D4] px-4 py-2 text-sm font-semibold text-white"
        >
          Run data pipeline
        </button>
        <button
          type="button"
          onClick={onAnalytics}
          className="inline-flex items-center gap-2 rounded border border-[#D1D1D1] bg-white px-4 py-2 text-sm font-semibold text-[#242424]"
        >
          <PowerBiIcon className="h-5 w-5" />
          Open Power BI report
        </button>
      </div>
    </div>
  );
}

function WorkloadsGrid() {
  const extra = [
    { name: 'Data Engineering', Icon: DataEngIcon, blurb: 'Spark jobs if AviLease needs them later.' },
    { name: 'Databases', Icon: DatabasesIcon, blurb: 'SQL databases on the same OneLake.' },
    { name: 'Copilot in Fabric', Icon: CopilotIcon, blurb: 'Ask questions in the workspace in plain English.' },
    { name: 'Microsoft 365', Icon: ExcelIcon, blurb: 'Drop the same model into Excel and Teams.' },
    { name: 'Microsoft Teams', Icon: TeamsIcon, blurb: 'Share a report in the ops channel.' },
    { name: 'Microsoft Entra ID', Icon: EntraIcon, blurb: 'Staff sign in with AviLease accounts.' },
  ];
  return (
    <div>
      <h2 className="text-xl font-semibold text-[#242424]">Workloads</h2>
      <p className="mt-1 text-sm text-[#605E5C]">
        Everything on{' '}
        <a
          className="text-[#0078D4] underline"
          href="https://www.microsoft.com/en-ie/microsoft-fabric"
          target="_blank"
          rel="noreferrer"
        >
          Microsoft Fabric
        </a>{' '}
        — one capacity, one lake.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[...WORKLOADS.map((w) => ({ name: w.name, Icon: w.Icon, blurb: w.blurb })), ...extra].map(
          (w) => (
            <article
              key={w.name}
              className="flex gap-3 rounded-lg border border-[#E1DFDD] bg-white p-3"
            >
              <w.Icon className="h-10 w-10 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-[#242424]">{w.name}</div>
                <p className="mt-0.5 text-xs text-[#605E5C]">{w.blurb}</p>
              </div>
            </article>
          )
        )}
      </div>
    </div>
  );
}

function OneLakePane() {
  const folders = [
    'Files / bronze / leaseworks',
    'Files / bronze / core_finance',
    'Files / bronze / aerlytix',
    'Tables / silver_leases',
    'Tables / gold_fleet',
    'Tables / gold_revenue',
  ];
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <OneLakeIcon className="h-8 w-8" />
        <div>
          <h2 className="text-xl font-semibold text-[#242424]">OneLake</h2>
          <p className="text-sm text-[#605E5C]">lh_avilease · one copy of AviLease data</p>
        </div>
      </div>
      <div className="rounded-lg border border-[#E1DFDD] bg-white">
        {folders.map((f) => (
          <div key={f} className="border-b border-[#EDEBE9] px-4 py-2.5 text-sm last:border-0">
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}

function CreatePane() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-[#242424]">Create</h2>
      <p className="mt-1 text-sm text-[#605E5C]">New item in the AviLease workspace.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { name: 'Lakehouse', Icon: LakehouseIcon },
          { name: 'Data pipeline', Icon: DataFactoryIcon },
          { name: 'Warehouse', Icon: WarehouseIcon },
          { name: 'Power BI report', Icon: PowerBiIcon },
          { name: 'Real-Time dashboard', Icon: RealTimeIcon },
          { name: 'Notebook', Icon: DataEngIcon },
        ].map((c) => (
          <div
            key={c.name}
            className="flex flex-col items-start gap-2 rounded-lg border border-[#E1DFDD] bg-white p-4"
          >
            <c.Icon className="h-10 w-10" />
            <span className="text-sm font-semibold text-[#242424]">{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RailGlyph({ id }) {
  const map = {
    home: FabricMark,
    create: DataFactoryIcon,
    browse: WarehouseIcon,
    onelake: OneLakeIcon,
    workloads: PowerBiIcon,
  };
  const I = map[id] || FabricMark;
  return <I className="mb-1 h-6 w-6" />;
}

export function FabricWordmark() {
  return (
    <div className="flex items-center gap-2">
      <MsSquares className="h-5 w-5" />
      <span className="text-sm font-semibold text-[#242424]">Microsoft</span>
      <FabricMark className="h-6 w-6" />
      <span className="text-sm font-semibold text-[#242424]">Fabric</span>
    </div>
  );
}
