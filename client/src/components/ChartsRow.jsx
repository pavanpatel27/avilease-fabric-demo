import { ApexBarHorizontal, ApexDonut, ApexAreaDual } from './charts/ApexKit';

export default function ChartsRow({
  fleetByType,
  leaseStatus,
  revenue,
  loading,
  selectedType,
  selectedStatus,
  onSelectType,
  onSelectStatus,
}) {
  const categories = (fleetByType || []).map((r) => r.aircraftType);
  const counts = (fleetByType || []).map((r) => r.count);
  const statusLabels = (leaseStatus || []).map((r) => r.status);
  const statusSeries = (leaseStatus || []).map((r) => r.count);
  const recent = (revenue || []).slice(-6);
  const months = recent.map((r) => r.month);
  const rev = recent.map((r) => r.revenue);
  const bud = recent.map((r) => r.budget);

  return (
    <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
      <Panel
        title="Fleet by type"
        subtitle="Click a bar to filter the list"
        loading={loading}
      >
        {!loading && categories.length > 0 && (
          <div className={selectedType ? 'opacity-100' : ''}>
            <ApexBarHorizontal
              categories={categories}
              series={counts}
              onSelect={onSelectType}
            />
          </div>
        )}
        {selectedType && (
          <p className="mt-1 text-[11px] font-semibold text-prodigy-crimson">
            Filtered by type: {selectedType} (click again in filters to clear)
          </p>
        )}
      </Panel>

      <div className="grid gap-3">
        <Panel title="Lease status" subtitle="Donut · click a slice to filter" loading={loading}>
          {!loading && statusSeries.length > 0 && (
            <ApexDonut
              labels={statusLabels}
              series={statusSeries}
              onSelect={onSelectStatus}
              centerLabel="Fleet"
            />
          )}
          {selectedStatus && (
            <p className="text-[11px] font-semibold text-prodigy-crimson">
              Filtered: {selectedStatus}
            </p>
          )}
        </Panel>

        <Panel title="Revenue vs budget" subtitle="Last 6 months · Core Financial $M" loading={loading}>
          {!loading && months.length > 0 && (
            <ApexAreaDual categories={months} revenue={rev} budget={bud} height={165} />
          )}
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, children, loading }) {
  return (
    <div className="rounded-2xl border border-prodigy-line bg-white p-4 shadow-card">
      <div className="mb-2 flex items-end justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-prodigy-ink">{title}</div>
          <div className="text-[11px] text-prodigy-muted">{subtitle}</div>
        </div>
        {loading && <span className="text-[11px] text-prodigy-muted">Loading…</span>}
      </div>
      {children}
    </div>
  );
}
