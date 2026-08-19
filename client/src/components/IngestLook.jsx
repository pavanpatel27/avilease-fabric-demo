import {
  ApiIcon,
  DataFactoryIcon,
  ExcelIcon,
  FabricMark,
  OneLakeIcon,
  PowerBiIcon,
  SalesforceIcon,
  SqlIcon,
} from './fabric/MsIcons';

export default function IngestLook() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold text-avi-deep">How it looks</h2>
        <p className="mt-1 text-sm text-prodigy-muted">
          Same aircraft, same rent — ops on the left, the board pack on the right.
        </p>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <LookScreen eyebrow="Operations" title="Fleet" bar="#003B51" body={<FleetLook />} />
          <LookScreen
            eyebrow="Leadership"
            title="Power BI pack"
            bar="#F2C811"
            body={<PbiLook />}
          />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-avi-deep">How the data comes together</h2>
        <p className="mt-1 text-sm text-prodigy-muted">
          Core systems plus spreadsheets and other feeds you already use. Microsoft collects them on a
          schedule, then we join on tail number — including market data such as Cirium when needed.
        </p>

        <div
          className="mt-3 overflow-x-auto rounded-xl border border-prodigy-line p-4 md:p-5"
          style={{
            backgroundImage:
              'radial-gradient(#E8E8E8 1px, transparent 1px), linear-gradient(180deg, #F7FBFC 0%, #fff 55%)',
            backgroundSize: '18px 18px, 100% 100%',
          }}
        >
          <div className="min-w-[820px] space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <SourceCard
                Icon={SalesforceIcon}
                product="Salesforce"
                name="Leaseworks"
                how="Leases and aircraft — as ops already enter them"
                preview={<LeaseworksMini />}
              />
              <SourceCard
                Icon={SqlIcon}
                product="Finance system"
                name="Core Financial"
                how="General Ledger — the money source of truth"
                preview={<FinanceMini />}
              />
              <SourceCard
                Icon={ApiIcon}
                product="Forecasting tool"
                name="Aerlytix"
                how="Projected rent, MR, utilisation — flight hours, cycles, and future event dates"
                preview={<AerlytixMini />}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-prodigy-line" />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-prodigy-muted">
                Additional inputs
              </span>
              <div className="h-px flex-1 bg-prodigy-line" />
            </div>

            <div className="mx-auto grid max-w-[560px] grid-cols-2 gap-3">
              <SourceCard
                Icon={ExcelIcon}
                product="Spreadsheet"
                name="Excel packs"
                how="Early prototypes and one-off supplements — landed in bronze, checked like any other feed"
                preview={<ExcelMini />}
                muted
              />
              <SourceCard
                Icon={OtherSourcesIcon}
                product="Market / reference"
                name="Other systems"
                how="Cirium fleet data, ad hoc APIs, future sources — same join on tail number"
                preview={<OtherSystemsMini />}
                muted
              />
            </div>

            <div className="flex justify-center text-[13px] font-semibold text-[#0078D4]">
              ↓ collected every hour · not copied by hand
            </div>

            <div className="rounded-xl border border-[#4B9EFF]/40 bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <DataFactoryIcon className="h-8 w-8" />
                <OneLakeIcon className="h-8 w-8" />
                <div>
                  <div className="text-sm font-semibold text-avi-deep">Microsoft Fabric</div>
                  <div className="text-[11px] text-prodigy-muted">
                    Collect → check → one store the company uses
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Step n="1" t="Collect" d="Pull from systems, spreadsheets, and other feeds" />
                <Step n="2" t="Check" d="Match tails, hold broken rows" />
                <Step n="3" t="Publish" d="Fleet screen + Power BI" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Step({ n, t, d }) {
  return (
    <div className="rounded-lg bg-[#F3F9FF] px-3 py-2.5">
      <div className="text-[10px] font-bold uppercase tracking-wide text-[#0078D4]">
        {n}. {t}
      </div>
      <p className="mt-1 text-xs text-avi-deep">{d}</p>
    </div>
  );
}

function SourceCard({ Icon, product, name, how, preview, muted = false }) {
  return (
    <article
      className={`overflow-hidden rounded-xl border bg-white shadow-sm ${
        muted ? 'border-dashed border-prodigy-line/80' : 'border-prodigy-line'
      }`}
    >
      <div className="flex items-center gap-2 border-b border-prodigy-line px-3 py-2">
        <Icon className="h-7 w-7" />
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wide text-prodigy-muted">
            {product}
          </div>
          <div className="text-sm font-semibold text-avi-deep">{name}</div>
        </div>
      </div>
      <div className="p-2">{preview}</div>
      <p className="border-t border-prodigy-line px-3 py-2 text-[11px] text-prodigy-muted">{how}</p>
    </article>
  );
}

function LeaseworksMini() {
  return (
    <div className="rounded bg-[#F4F6F9] p-2 text-[10px]">
      <div className="mb-1 font-bold text-[#00A1E0]">What ops already sees</div>
      {[
        ['EI-AVL', 'A320neo', 'On lease'],
        ['9H-ALI', 'B737 MAX', 'Transition'],
        ['A6-AVC', 'A330', 'On lease'],
      ].map((r) => (
        <div key={r[0]} className="grid grid-cols-3 gap-1 border-t border-white py-0.5 text-[#16325C]">
          <span className="font-semibold">{r[0]}</span>
          <span>{r[1]}</span>
          <span>{r[2]}</span>
        </div>
      ))}
    </div>
  );
}

function FinanceMini() {
  return (
    <div className="rounded bg-[#EEF3F7] p-2 text-[10px] text-[#1B4F72]">
      <div className="mb-1 font-bold">What finance already sees</div>
      {[
        ['EI-AVL', '$512k', 'USD'],
        ['9H-ALI', '$0', 'USD'],
        ['A6-AVC', '$890k', 'USD'],
      ].map((r) => (
        <div key={r[0]} className="grid grid-cols-3 gap-1 border-t border-white py-0.5">
          <span className="font-semibold">{r[0]}</span>
          <span>{r[1]}</span>
          <span>{r[2]}</span>
        </div>
      ))}
    </div>
  );
}

function AerlytixMini() {
  return (
    <div className="rounded bg-[#0B3C5D] p-2 text-[10px] text-white">
      <div className="mb-1 font-bold text-[#7FDDD0]">Forward forecast</div>
      <div className="grid grid-cols-3 gap-1 border-b border-white/20 pb-0.5 text-[9px] uppercase tracking-wide text-white/55">
        <span>Tail</span>
        <span>FH / FC</span>
        <span>Next event</span>
      </div>
      {[
        ['EI-AVL', '4,820 · 2,410', 'MR check Sep \'26'],
        ['9H-ALI', '3,940 · 1,880', 'Redelivery 14 Mar \'27'],
        ['A6-AVC', '6,100 · 3,050', 'EOL accrual Jun \'28'],
      ].map((r) => (
        <div key={r[0]} className="grid grid-cols-3 gap-1 border-t border-white/20 py-0.5">
          <span className="font-semibold">{r[0]}</span>
          <span>{r[1]}</span>
          <span className="text-[#7FDDD0]">{r[2]}</span>
        </div>
      ))}
    </div>
  );
}

function ExcelMini() {
  return (
    <div className="rounded bg-[#E8F5EE] p-2 text-[10px] text-[#1D6F42]">
      <div className="mb-1 font-bold">Fleet supplement.xlsx</div>
      {[
        ['EI-AVL', 'Parked', 'Feb pack'],
        ['N734JC', 'On lease', 'Marketing'],
      ].map((r) => (
        <div key={r[0]} className="grid grid-cols-3 gap-1 border-t border-white/70 py-0.5">
          <span className="font-semibold">{r[0]}</span>
          <span>{r[1]}</span>
          <span className="text-[#217346]/80">{r[2]}</span>
        </div>
      ))}
    </div>
  );
}

function OtherSystemsMini() {
  return (
    <div className="rounded bg-[#F4F0E8] p-2 text-[10px] text-[#3D3428]">
      <div className="mb-1 font-bold text-[#8B6914]">Cirium · fleet reference</div>
      {[
        ['EI-AVL', 'A320-251N', '92% util'],
        ['9H-ALI', 'B737-8', '78% util'],
      ].map((r) => (
        <div key={r[0]} className="grid grid-cols-3 gap-1 border-t border-white/60 py-0.5">
          <span className="font-semibold">{r[0]}</span>
          <span>{r[1]}</span>
          <span>{r[2]}</span>
        </div>
      ))}
      <div className="mt-1 border-t border-white/60 pt-1 text-[9px] text-prodigy-muted">
        + other APIs when ready
      </div>
    </div>
  );
}

function OtherSourcesIcon({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="6" fill="#003B51" />
      <circle cx="11" cy="14" r="3" fill="#50B9A1" />
      <circle cx="21" cy="11" r="2.5" fill="#C5A572" />
      <circle cx="20" cy="21" r="2.5" fill="#fff" fillOpacity="0.85" />
      <path
        d="M8 24h16"
        stroke="#50B9A1"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="2 2"
      />
    </svg>
  );
}

function LookScreen({ eyebrow, title, bar, body }) {
  return (
    <article className="overflow-hidden rounded-xl border border-prodigy-line bg-white shadow-sm">
      <div className="flex items-center gap-2 px-3 py-2 text-white" style={{ background: bar }}>
        {bar === '#F2C811' ? <PowerBiIcon className="h-6 w-6" /> : <FabricMark className="h-6 w-6" />}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wide opacity-80">{eyebrow}</div>
          <div className="text-sm font-semibold">{title}</div>
        </div>
      </div>
      <div className="p-3">{body}</div>
    </article>
  );
}

function FleetLook() {
  return (
    <div className="text-xs">
      <div className="mb-2 grid grid-cols-3 gap-2">
        {[
          ['142', 'Aircraft'],
          ['90%', 'On lease'],
          ['$8.4m', 'YTD rent'],
        ].map(([v, k]) => (
          <div key={k} className="rounded-lg bg-avi-fog p-2 text-center">
            <div className="text-lg font-semibold text-avi-deep">{v}</div>
            <div className="text-[10px] text-prodigy-muted">{k}</div>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded border border-prodigy-line">
        <div className="grid grid-cols-4 bg-avi-fog px-2 py-1 text-[10px] font-bold uppercase text-avi-deep">
          <span>Tail</span>
          <span>Type</span>
          <span>Lessee</span>
          <span>Status</span>
        </div>
        {[
          ['EI-AVL', 'A320neo', 'Ryanair', 'Current'],
          ['9H-ALI', 'B737 MAX', 'Malta Air', 'Transition'],
          ['A6-AVC', 'A330', 'Etihad', 'Current'],
        ].map((r) => (
          <div key={r[0]} className="grid grid-cols-4 border-t border-prodigy-line px-2 py-1.5">
            <span className="font-semibold text-avi-deep">{r[0]}</span>
            <span>{r[1]}</span>
            <span>{r[2]}</span>
            <span>{r[3]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PbiLook() {
  const rows = [
    { tail: 'EI-AVL', value: 14.2 },
    { tail: '9H-ALI', value: 11.8 },
    { tail: 'N734JC', value: 9.4, tooltip: '9.4% · $512k rent' },
    { tail: 'EI-AVR', value: 6.1 },
  ];
  const max = 16;
  const portfolioAvg = 10.2;

  return (
    <div
      className="rounded-lg border border-[#EDEBE9] bg-white p-3"
      style={{ fontFamily: '"Segoe UI", system-ui, sans-serif' }}
    >
      <div className="text-[11px] font-semibold leading-snug text-[#242424]">
        Annualised rent ÷ net book value, by tail — dashed line is the portfolio average
      </div>

      <div className="relative mt-3 pl-14">
        <div
          className="pointer-events-none absolute inset-y-0 z-10 border-l-2 border-dashed border-[#605E5C]"
          style={{ left: `calc(3.5rem + (100% - 3.5rem) * ${portfolioAvg / max})` }}
        />

        <div className="pointer-events-none absolute inset-y-0 left-14 right-0 flex justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-full w-px bg-[#EDEBE9]" />
          ))}
        </div>

        <div className="relative space-y-2.5">
          {rows.map((r) => (
            <div key={r.tail} className="relative flex items-center gap-2">
              <span className="absolute -left-14 w-12 text-right text-[10px] font-medium text-[#242424]">
                {r.tail}
              </span>
              <div className="relative h-[18px] flex-1">
                <div
                  className="h-full rounded-[2px] bg-[#118DFF]"
                  style={{ width: `${(r.value / max) * 100}%` }}
                />
                {r.tooltip && (
                  <div className="absolute left-[58%] top-1/2 z-20 -translate-y-1/2 rounded bg-[#323130]/90 px-2 py-1 text-[9px] text-white shadow-md">
                    {r.tooltip}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-2.5 text-[10px] text-[#605E5C]">
        Leadership pack on the same joined gold fleet — rent and book value from Core
        Financial, on the tails ops is viewing.
      </p>
    </div>
  );
}
