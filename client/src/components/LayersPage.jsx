import { useEffect, useState } from 'react';
import { api } from '../api';
import { PageHeader } from './FleetOverview';

const TABS = [
  { id: 'bronze', label: 'Bronze' },
  { id: 'silver', label: 'Silver' },
  { id: 'gold', label: 'Gold' },
];

export default function LayersPage() {
  const [tab, setTab] = useState('bronze');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .layer(tab)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [tab]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Data layers — normalisation in action"
        blurb="Bronze preserves source shape. Silver conforms keys, status, and currency. Gold serves the business."
      />

      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              tab === t.id
                ? 'bg-prodigy-crimson text-white'
                : 'border border-prodigy-line bg-white text-prodigy-muted'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && <div className="text-sm text-prodigy-muted">Loading layer…</div>}

      {!loading && tab === 'bronze' && data && (
        <div className="grid gap-3 lg:grid-cols-3">
          {Object.entries(data.sources).map(([key, src]) => (
            <SourceCard key={key} name={key} src={src} />
          ))}
        </div>
      )}

      {!loading && tab === 'silver' && data && (
        <div className="space-y-3">
          <Info>
            {data.description} · {data.count} rows
          </Info>
          <SchemaPills fields={data.schema} />
          <SampleTable rows={data.sample} />
        </div>
      )}

      {!loading && tab === 'gold' && data && (
        <div className="space-y-3">
          <Info>{data.description}</Info>
          <div className="grid gap-3 sm:grid-cols-4">
            {Object.entries(data.kpis || {})
              .filter(([k]) => k !== 'deltas')
              .map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-2xl border border-prodigy-line bg-white p-3 shadow-card"
                >
                  <div className="text-[10px] uppercase tracking-wide text-prodigy-muted">{k}</div>
                  <div className="text-xl font-semibold text-avi-deep">{String(v)}</div>
                </div>
              ))}
          </div>
          <SchemaPills fields={data.marts} />
          <SampleTable rows={data.sampleLeases} />
        </div>
      )}
    </div>
  );
}

function SourceCard({ name, src }) {
  return (
    <div className="rounded-2xl border border-prodigy-line bg-white p-4 shadow-card">
      <div className="text-sm font-semibold capitalize text-avi-deep">{name}</div>
      <div className="text-[11px] text-prodigy-muted">{src.count} bronze rows</div>
      <SchemaPills fields={src.schema} />
      <SampleTable rows={src.sample} compact />
    </div>
  );
}

function SchemaPills({ fields }) {
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {(fields || []).map((f) => (
        <span
          key={f}
          className="rounded-full bg-prodigy-saffron/20 px-2 py-0.5 text-[10px] font-semibold text-prodigy-dark"
        >
          {f}
        </span>
      ))}
    </div>
  );
}

function SampleTable({ rows, compact }) {
  if (!rows?.length) return null;
  const cols = Object.keys(rows[0]).slice(0, compact ? 4 : 8);
  return (
    <div className="mt-3 overflow-x-auto rounded-xl border border-prodigy-line">
      <table className="min-w-full text-[11px]">
        <thead>
          <tr className="bg-avi-fog text-left text-avi-deep">
            {cols.map((c) => (
              <th key={c} className="px-2 py-1.5 font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-prodigy-line">
              {cols.map((c) => (
                <td key={c} className="whitespace-nowrap px-2 py-1.5 text-prodigy-ink">
                  {formatCell(r[c])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatCell(v) {
  if (v == null) return '—';
  if (Array.isArray(v)) return v.join(', ');
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

function Info({ children }) {
  return (
    <div className="rounded-xl border border-prodigy-crimson/20 bg-prodigy-crimson/5 px-3 py-2 text-sm text-prodigy-ink">
      {children}
    </div>
  );
}
