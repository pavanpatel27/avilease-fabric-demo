import { useEffect, useMemo, useState } from 'react';
import { ApexAreaDual, ApexBarHorizontal, ApexDonut } from './charts/ApexKit';
import { api } from '../api';

const SYSTEMS = [
  {
    id: 'leaseworks',
    name: 'Leaseworks',
    vendor: 'Salesforce-native lease / asset register',
    accent: '#00A1E0',
    hint: 'Leases and aircraft as ops see them today',
  },
  {
    id: 'core',
    name: 'Core Financial',
    vendor: 'Infor SunSystems · corefinancial.ie',
    accent: '#1B4F72',
    hint: 'Rent and books — outside Salesforce',
    href: 'https://corefinancial.ie/',
  },
  {
    id: 'aerlytix',
    name: 'Aerlytix',
    vendor: 'Aviation finance analytics · aerlytix.com',
    accent: '#0B3C5D',
    hint: 'Transitions and aircraft lifecycle',
    href: 'https://www.aerlytix.com/',
  },
];

/**
 * Demo of source systems — how each looks before unification —
 * plus how Analytics / Power BI consumes the warehouse gold layer.
 */
export default function SystemsDemoPage({ onAnalytics, onInspect }) {
  const [system, setSystem] = useState('leaseworks');
  const [leases, setLeases] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.activeLeases({ limit: 200 }), api.revenueTrend(), api.layer('bronze')]).then(
      ([a, r]) => {
        setLeases(a.data);
        setRevenue(r.data);
        setLoading(false);
      }
    );
  }, []);

  const active = SYSTEMS.find((s) => s.id === system);

  const lwRows = useMemo(
    () => leases.filter((l) => l.sourceSystem?.includes('LW') || l.status === 'On Lease').slice(0, 8),
    [leases]
  );
  const cfRev = useMemo(() => revenue.slice(-6), [revenue]);
  const axRows = useMemo(
    () => leases.filter((l) => l.status !== 'On Lease').slice(0, 8),
    [leases]
  );

  const statusDonut = useMemo(() => {
    const map = {};
    leases.forEach((l) => {
      map[l.status] = (map[l.status] || 0) + 1;
    });
    return {
      labels: Object.keys(map),
      series: Object.values(map),
    };
  }, [leases]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-prodigy-crimson">
            Before the warehouse
          </p>
          <h1 className="mt-1 text-3xl font-normal text-avi-deep">Today’s three systems</h1>
          <p className="mt-1 max-w-3xl text-sm text-prodigy-muted">
            Each system still does its job. The warehouse does not replace them — it joins their
            data so you stop copying into Excel.
          </p>
        </div>
        <button
          type="button"
          onClick={onAnalytics}
          className="rounded-full bg-[#F2C811] px-4 py-2 text-sm font-bold text-prodigy-dark"
        >
          Open Analytics →
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {SYSTEMS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSystem(s.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              system === s.id ? 'text-white' : 'border border-prodigy-line bg-white text-prodigy-muted'
            }`}
            style={system === s.id ? { background: s.accent } : undefined}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Fake product chrome */}
      <div
        className="overflow-hidden rounded-2xl border shadow-card"
        style={{ borderColor: `${active.accent}55` }}
      >
        <div
          className="flex flex-wrap items-center gap-3 px-4 py-3 text-white"
          style={{ background: active.accent }}
        >
          <div className="text-lg font-bold tracking-wide">{active.name}</div>
          <div className="text-xs text-white/80">{active.vendor}</div>
          {active.href && (
            <a
              href={active.href}
              target="_blank"
              rel="noreferrer"
              className="ml-auto text-xs underline text-white/90"
            >
              Vendor site
            </a>
          )}
        </div>
        <div className="bg-white p-4">
          <p className="mb-3 text-xs text-prodigy-muted">{active.hint}</p>
          {loading && <div className="text-sm text-prodigy-muted">Loading sample…</div>}

          {!loading && system === 'leaseworks' && (
            <div className="grid gap-3 lg:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-avi-deep">Asset / lease register</h3>
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-sky-50 text-left text-[10px] uppercase text-sky-900">
                      <th className="px-2 py-1.5">Reg</th>
                      <th className="px-2 py-1.5">Type</th>
                      <th className="px-2 py-1.5">Lessee</th>
                      <th className="px-2 py-1.5">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lwRows.map((r) => (
                      <tr
                        key={r.registration}
                        className="cursor-pointer border-t border-prodigy-line hover:bg-sky-50"
                        onClick={() => onInspect?.(r.registration)}
                      >
                        <td className="px-2 py-1.5 font-semibold">{r.registration}</td>
                        <td className="px-2 py-1.5">{r.aircraftType}</td>
                        <td className="px-2 py-1.5">{r.lessee}</td>
                        <td className="px-2 py-1.5">{r.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-avi-deep">Lease status</h3>
                <ApexDonut labels={statusDonut.labels} series={statusDonut.series} height={260} />
              </div>
            </div>
          )}

          {!loading && system === 'core' && (
            <div className="grid gap-3 lg:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-avi-deep">
                  SunSystems · rent / revenue trend
                </h3>
                <ApexAreaDual
                  categories={cfRev.map((r) => r.month)}
                  revenue={cfRev.map((r) => r.revenue)}
                  budget={cfRev.map((r) => r.budget)}
                  height={280}
                />
              </div>
              <div className="rounded-xl bg-slate-50 p-4 text-sm text-prodigy-muted">
                <p className="font-semibold text-avi-deep">Why this matters</p>
                <p className="mt-2">
                  Rent lives here — not in Salesforce. Without joining it to Leaseworks, fleet and
                  finance never sit on the same page.
                </p>
              </div>
            </div>
          )}

          {!loading && system === 'aerlytix' && (
            <div className="grid gap-3 lg:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-avi-deep">
                  Transitions / off-lease (Aerlytix lens)
                </h3>
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-left text-[10px] uppercase text-slate-700">
                      <th className="px-2 py-1.5">Tail</th>
                      <th className="px-2 py-1.5">Type</th>
                      <th className="px-2 py-1.5">Status</th>
                      <th className="px-2 py-1.5">Display</th>
                    </tr>
                  </thead>
                  <tbody>
                    {axRows.map((r) => (
                      <tr
                        key={r.registration}
                        className="cursor-pointer border-t border-prodigy-line hover:bg-slate-50"
                        onClick={() => onInspect?.(r.registration)}
                      >
                        <td className="px-2 py-1.5 font-semibold">{r.registration}</td>
                        <td className="px-2 py-1.5">{r.aircraftType}</td>
                        <td className="px-2 py-1.5">{r.status}</td>
                        <td className="px-2 py-1.5">{r.displayStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-avi-deep">By type (transition set)</h3>
                <ApexBarHorizontal
                  categories={[...new Set(axRows.map((r) => r.aircraftType))]}
                  series={[...new Set(axRows.map((r) => r.aircraftType))].map(
                    (t) => axRows.filter((r) => r.aircraftType === t).length
                  )}
                  height={260}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-prodigy-line bg-white p-4 text-sm text-prodigy-muted">
        Next: open <strong className="text-avi-deep">Analytics</strong> to see one fleet and one
        revenue story — without Excel.
      </div>
    </div>
  );
}
