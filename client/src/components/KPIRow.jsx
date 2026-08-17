function Skeleton() {
  return <div className="h-8 w-24 animate-pulse rounded bg-prodigy-line" />;
}

export default function KPIRow({ kpis, loading }) {
  const cards = [
    {
      label: 'Total Aircraft',
      value: kpis?.totalAircraft,
      delta: kpis?.deltas?.totalAircraft,
      tone: 'up',
    },
    {
      label: 'Fleet Utilisation',
      value: kpis ? `${kpis.fleetUtilisation}%` : null,
      delta: kpis?.deltas?.fleetUtilisation,
      tone: 'up',
    },
    {
      label: 'YTD Revenue',
      value: kpis ? `$${kpis.ytdRevenue}M` : null,
      delta: kpis?.deltas?.ytdRevenue,
      tone: 'up',
      note: 'Core Financial',
    },
    {
      label: 'Avg Lease Remaining',
      value: kpis ? `${kpis.avgLeaseRemaining} yrs` : null,
      delta: kpis?.deltas?.avgLeaseRemaining,
      tone: 'stable',
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-2xl border border-prodigy-line bg-white p-4 shadow-card"
        >
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-prodigy-muted">
              {c.label}
            </div>
            {c.note && (
              <span className="rounded-full bg-avi-mist px-2 py-0.5 text-[10px] font-semibold text-avi-deep">
                {c.note}
              </span>
            )}
          </div>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-avi-deep">
            {loading ? <Skeleton /> : c.value ?? '—'}
          </div>
          <div
            className={`mt-2 text-xs font-medium ${
              c.tone === 'up'
                ? 'text-avi-teal'
                : c.tone === 'down'
                  ? 'text-prodigy-crimson'
                  : 'text-prodigy-muted'
            }`}
          >
            {loading ? '…' : c.delta}
          </div>
        </div>
      ))}
    </div>
  );
}
