import {
  ApiIcon,
  DataFactoryIcon,
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
          Three systems you already pay for. Microsoft collects them on a schedule. We join on
          tail number. Excel is not in the path.
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
                how="Rent and books — the money source of truth"
                preview={<FinanceMini />}
              />
              <SourceCard
                Icon={ApiIcon}
                product="Aviation platform"
                name="Aerlytix"
                how="Transitions and off-lease — the lifecycle view"
                preview={<AerlytixMini />}
              />
            </div>

            <JoinExample />

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
                <Step n="1" t="Collect" d="Pull from the three systems" />
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

function JoinExample() {
  return (
    <div className="rounded-xl border border-avi-deep/15 bg-white px-4 py-3">
      <div className="text-[11px] font-bold uppercase tracking-wide text-prodigy-crimson">
        Example — one tail, three facts, one row
      </div>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wide text-prodigy-muted">
              <th className="py-1 pr-3">Tail</th>
              <th className="py-1 pr-3">From Leaseworks</th>
              <th className="py-1 pr-3">From Core Financial</th>
              <th className="py-1">From Aerlytix</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-prodigy-line">
              <td className="py-2 pr-3 font-semibold text-avi-deep">EI-AVL</td>
              <td className="py-2 pr-3">A320neo · Ryanair · on lease</td>
              <td className="py-2 pr-3">$512k / month rent</td>
              <td className="py-2">No transition</td>
            </tr>
            <tr className="border-t border-prodigy-line bg-prodigy-crimson/[0.03]">
              <td className="py-2 pr-3 font-semibold text-avi-deep">9H-ALI</td>
              <td className="py-2 pr-3">B737 MAX · Malta Air</td>
              <td className="py-2 pr-3">$0 this month</td>
              <td className="py-2 text-prodigy-crimson">Redelivery · day 12</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] text-prodigy-muted">
        That joined row is what ops and Power BI both see. We do not ask Salesforce to hold the
        finance books.
      </p>
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

function SourceCard({ Icon, product, name, how, preview }) {
  return (
    <article className="overflow-hidden rounded-xl border border-prodigy-line bg-white shadow-sm">
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
        ['9H-ALI', '$0', 'off-wing'],
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
      <div className="mb-1 font-bold text-[#7FDDD0]">What asset already sees</div>
      {[
        ['9H-ALI', 'Redelivery', 'Day 12'],
        ['EI-KST', 'Off lease', 'Parked'],
      ].map((r) => (
        <div key={r[0]} className="grid grid-cols-3 gap-1 border-t border-white/20 py-0.5">
          <span className="font-semibold">{r[0]}</span>
          <span>{r[1]}</span>
          <span>{r[2]}</span>
        </div>
      ))}
    </div>
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
  return (
    <div className="space-y-2">
      <div className="flex h-16 items-end gap-1 rounded-lg bg-[#F3F2F1] px-3 py-2">
        {[40, 55, 48, 70, 62, 80, 75].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t"
            style={{ height: `${h}%`, background: i % 2 ? '#F2C811' : '#0078D4' }}
          />
        ))}
      </div>
      <p className="text-[11px] text-prodigy-muted">
        Revenue vs budget — the Core Financial figure, on the same tails ops is looking at.
      </p>
    </div>
  );
}
