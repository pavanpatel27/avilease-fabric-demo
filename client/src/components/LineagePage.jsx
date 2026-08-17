import { useEffect, useState } from 'react';
import { api } from '../api';
import { PageHeader } from './FleetOverview';

export default function LineagePage() {
  const [lineage, setLineage] = useState(null);
  const [quality, setQuality] = useState(null);

  useEffect(() => {
    Promise.all([api.lineage(), api.quality()]).then(([l, q]) => {
      setLineage(l);
      setQuality(q);
    });
  }, []);

  const passed = quality?.checks?.filter((c) => c.passed).length || 0;
  const total = quality?.checks?.length || 0;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Lineage & data quality"
        blurb="Damian’s trust layer — where each gold metric comes from, and whether conformed data passes checks."
      />

      <div className="rounded-2xl border border-prodigy-line bg-white p-4 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-avi-deep">Quality gates</h2>
          <span className="text-sm font-semibold text-avi-teal">
            {passed}/{total} passed
          </span>
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {(quality?.checks || []).map((c) => (
            <div
              key={c.id}
              className={`rounded-xl border px-3 py-2 text-sm ${
                c.passed
                  ? 'border-avi-mint/40 bg-avi-mist/60'
                  : 'border-prodigy-crimson/30 bg-prodigy-crimson/5'
              }`}
            >
              <div className="font-semibold text-prodigy-ink">{c.name}</div>
              <div className="text-xs text-prodigy-muted">
                expected {c.expected} · actual {c.actual}
              </div>
            </div>
          ))}
        </div>
        {quality?.layerCounts && (
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <Count label="Bronze LW" value={quality.layerCounts.bronze.leaseworks} />
            <Count label="Silver" value={quality.layerCounts.silver} />
            <Count label="Gold leases" value={quality.layerCounts.gold.leases} />
          </div>
        )}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-prodigy-line bg-white p-4 shadow-card">
          <h2 className="text-sm font-semibold text-avi-deep">Pipeline lineage</h2>
          <ul className="mt-3 space-y-2">
            {(lineage?.edges || []).map((e, i) => (
              <li key={i} className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full bg-prodigy-soft px-2 py-0.5 font-medium">
                  {e.from}
                </span>
                <span className="text-prodigy-crimson">→</span>
                <span className="rounded-full bg-prodigy-soft px-2 py-0.5 font-medium">{e.to}</span>
                <span className="text-[11px] text-prodigy-muted">via {e.via}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-prodigy-line bg-white p-4 shadow-card">
          <h2 className="text-sm font-semibold text-avi-deep">Status / field normalisation map</h2>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wide text-prodigy-muted">
                <th className="py-1">Source</th>
                <th>Raw</th>
                <th>Conformed</th>
              </tr>
            </thead>
            <tbody>
              {(lineage?.statusMap || []).map((m, i) => (
                <tr key={i} className="border-t border-prodigy-line">
                  <td className="py-1.5">{m.source}</td>
                  <td className="font-mono text-xs text-prodigy-crimson">{m.raw}</td>
                  <td className="font-semibold text-avi-deep">{m.conformed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Count({ label, value }) {
  return (
    <div className="rounded-xl bg-avi-fog p-2">
      <div className="text-[10px] uppercase text-prodigy-muted">{label}</div>
      <div className="text-lg font-semibold text-avi-deep">{value}</div>
    </div>
  );
}
