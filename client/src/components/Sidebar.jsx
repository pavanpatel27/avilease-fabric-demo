export default function Sidebar({ setPage, pipeline }) {
  return (
    <aside className="hidden w-[260px] shrink-0 flex-col border-r border-prodigy-line bg-white p-4 lg:flex">
      <Section title="Architecture">
        <NavBtn
          onClick={() => setPage('architecture')}
          title="Decision brief"
          desc="Fabric · options · cost"
        />
        <NavBtn
          onClick={() => setPage('configure')}
          title="Azure configuration"
          desc="Fabric · OneLake · pipelines"
        />
      </Section>

      <Section title="Systems & proof">
        <NavBtn
          onClick={() => setPage('systems')}
          title="Source systems"
          desc="Leaseworks · Core · Aerlytix"
        />
        <NavBtn
          onClick={() => setPage('pipeline')}
          title="Ingestion run"
          desc={`ADF ${pipeline?.adfStatus || 'Ready'}`}
        />
        <NavBtn
          onClick={() => setPage('inspect')}
          title="Record lineage"
          desc="Bronze → silver → gold"
        />
      </Section>

      <Section title="Consumers">
        <NavBtn
          onClick={() => setPage('overview')}
          title="Ops dashboard"
          desc="Fleet register & KPIs"
        />
        <NavBtn
          onClick={() => setPage('analytics')}
          title="Power BI / Analytics"
          desc="Same gold semantic layer"
        />
      </Section>
    </aside>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-prodigy-muted">
        {title}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function NavBtn({ onClick, title, desc }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-lg border border-transparent px-2.5 py-2 text-left hover:border-prodigy-line hover:bg-prodigy-soft"
    >
      <div className="text-sm font-semibold text-avi-deep">{title}</div>
      <div className="text-[11px] leading-snug text-prodigy-muted">{desc}</div>
    </button>
  );
}
