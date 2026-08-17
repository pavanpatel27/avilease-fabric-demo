import { formatDate, formatRent } from '../api';

const BADGE = {
  Current: 'bg-avi-mist text-avi-deep',
  'Expiring soon': 'bg-prodigy-saffron/25 text-prodigy-dark',
  Transition: 'bg-avi-fog text-avi-teal',
  'Off lease': 'bg-prodigy-crimson/10 text-prodigy-crimson',
};

export default function FleetTable({ rows, loading, onRowClick }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-prodigy-line bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-prodigy-line px-4 py-3">
        <div>
          <div className="text-sm font-semibold text-prodigy-ink">Lease register</div>
          <div className="text-[11px] text-prodigy-muted">
            Click any row to open warehouse inspect (bronze → silver → gold)
          </div>
        </div>
        {loading && <span className="text-xs text-prodigy-muted">Loading…</span>}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-avi-fog text-left text-[10px] uppercase tracking-[0.12em] text-avi-deep">
              {['Reg.', 'Type', 'Lessee', 'Region', 'Lease end', 'Monthly rent', 'Status', 'Source'].map(
                (h) => (
                  <th key={h} className="px-4 py-2.5 font-semibold">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {(rows || []).map((r) => (
              <tr
                key={r.registration}
                onClick={() => onRowClick?.(r)}
                className="cursor-pointer border-t border-prodigy-line hover:bg-prodigy-crimson/[0.04]"
              >
                <td className="px-4 py-2.5 font-semibold text-avi-deep">{r.registration}</td>
                <td className="px-4 py-2.5 text-prodigy-ink">{r.aircraftType}</td>
                <td className="px-4 py-2.5 text-prodigy-ink">{r.lessee}</td>
                <td className="px-4 py-2.5 text-prodigy-muted">{r.region}</td>
                <td className="px-4 py-2.5">{formatDate(r.leaseEndDate)}</td>
                <td className="px-4 py-2.5 font-medium">{formatRent(r.monthlyRent)}</td>
                <td className="px-4 py-2.5">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      BADGE[r.displayStatus] || 'bg-prodigy-soft text-prodigy-ink'
                    }`}
                  >
                    {r.displayStatus}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="rounded bg-prodigy-soft px-1.5 py-0.5 text-[10px] font-semibold text-prodigy-muted">
                    {r.sourceSystem}
                  </span>
                </td>
              </tr>
            ))}
            {!loading && (!rows || rows.length === 0) && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-prodigy-muted">
                  No leases match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
