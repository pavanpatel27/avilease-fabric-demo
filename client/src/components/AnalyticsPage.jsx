import { useEffect, useMemo, useState } from 'react';
import {
  ApexAreaDual,
  ApexBarHorizontal,
  ApexDonut,
  ApexGroupedBar,
  ApexHeatmap,
  ApexRadial,
} from './charts/ApexKit';
import { api } from '../api';

/**
 * Power BI / Analytics workspace — real ApexCharts (not HTML drawings).
 * Shows how AviLease would consume the gold warehouse layer.
 */
export default function AnalyticsPage() {
  const [region, setRegion] = useState('');
  const [leases, setLeases] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [exposure, setExposure] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('executive');

  useEffect(() => {
    Promise.all([api.activeLeases({ limit: 500 }), api.revenueTrend(), api.lesseeExposure()]).then(
      ([a, r, e]) => {
        setLeases(a.data);
        setRevenue(r.data);
        setExposure(e.data);
        setLoading(false);
      }
    );
  }, []);

  const regions = useMemo(() => [...new Set(leases.map((l) => l.region))].sort(), [leases]);

  const filtered = useMemo(
    () => (region ? leases.filter((l) => l.region === region) : leases),
    [leases, region]
  );

  const byType = useMemo(() => {
    const map = {};
    filtered.forEach((l) => {
      map[l.aircraftType] = (map[l.aircraftType] || 0) + 1;
    });
    return Object.entries(map)
      .map(([aircraftType, count]) => ({ aircraftType, count }))
      .sort((a, b) => b.count - a.count);
  }, [filtered]);

  const byStatus = useMemo(() => {
    const map = {};
    filtered.forEach((l) => {
      map[l.status] = (map[l.status] || 0) + 1;
    });
    return Object.entries(map).map(([status, count]) => ({ status, count }));
  }, [filtered]);

  const util = filtered.length
    ? Math.round(
        (filtered.filter((l) => l.status === 'On Lease').length / filtered.length) * 1000
      ) / 10
    : 0;
  const expiring = filtered.filter((l) => l.displayStatus === 'Expiring soon').length;
  const ytd =
    Math.round(
      (filtered
        .filter((l) => l.status === 'On Lease')
        .reduce((s, l) => s + (l.monthlyRent || 0) * 12, 0) /
        1_000_000) *
        10
    ) / 10;

  const heatmap = useMemo(() => {
    const types = [...new Set(filtered.map((l) => l.aircraftType))];
    const regs = [...new Set(filtered.map((l) => l.region))];
    return types.map((t) => ({
      name: t,
      data: regs.map((r) => ({
        x: r,
        y: filtered.filter((l) => l.aircraftType === t && l.region === r).length,
      })),
    }));
  }, [filtered]);

  const exposureChart = useMemo(() => {
    const rows = (region ? exposure.filter((e) => e.region === region) : exposure).slice(0, 8);
    return {
      cats: rows.map((r) => r.lessee),
      series: [
        { name: 'Aircraft', data: rows.map((r) => r.aircraft) },
        { name: 'Annual $M', data: rows.map((r) => r.annualRevenue) },
      ],
    };
  }, [exposure, region]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-prodigy-crimson">
            For management
          </p>
          <h1 className="mt-1 text-3xl font-normal text-avi-deep">Analytics</h1>
          <p className="mt-1 max-w-3xl text-sm text-prodigy-muted">
            Same fleet numbers as the ops screen — the way Power BI would show them.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <div className="flex rounded-full border border-prodigy-line bg-white p-0.5">
            {[
              { id: 'executive', label: 'Executive' },
              { id: 'fleet', label: 'Fleet' },
              { id: 'finance', label: 'Finance' },
            ].map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setView(v.id)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  view === v.id ? 'bg-[#F2C811] text-prodigy-dark' : 'text-prodigy-muted'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <select
            className="rounded-full border border-prodigy-line bg-white px-3 py-1.5"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">All regions</option>
            {regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Power BI chrome */}
      <div className="overflow-hidden rounded-2xl border border-[#D0D0D0] bg-[#F3F2F1] shadow-card">
        <div className="flex flex-wrap items-center gap-2 border-b border-[#D0D0D0] bg-white px-3 py-2 text-xs">
          <span className="rounded bg-[#F2C811] px-2 py-0.5 font-bold text-prodigy-dark">
            Power BI
          </span>
          <span className="font-semibold text-prodigy-ink">AviLease Fleet Gold.pbix</span>
          <span className="text-prodigy-muted">· Same data as the fleet screen</span>
          {loading && <span className="ml-auto text-prodigy-muted">Loading…</span>}
        </div>

        {!loading && (
          <div className="space-y-3 p-3">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Kpi title="Aircraft" value={filtered.length} />
              <Kpi title="Utilisation" value={`${util}%`} />
              <Kpi title="YTD Revenue $M" value={ytd} />
              <Kpi title="Expiring ≤180d" value={expiring} warn={expiring > 0} />
            </div>

            {view === 'executive' && (
              <div className="grid gap-3 lg:grid-cols-3">
                <Tile title="Fleet utilisation" className="lg:col-span-1">
                  <ApexRadial value={util} label="On lease" height={240} />
                </Tile>
                <Tile title="Lease status mix" className="lg:col-span-1">
                  <ApexDonut
                    labels={byStatus.map((s) => s.status)}
                    series={byStatus.map((s) => s.count)}
                    height={240}
                  />
                </Tile>
                <Tile title="Fleet by type" className="lg:col-span-1">
                  <ApexBarHorizontal
                    categories={byType.map((t) => t.aircraftType)}
                    series={byType.map((t) => t.count)}
                    height={240}
                  />
                </Tile>
                <Tile title="Revenue vs budget ($M)" className="lg:col-span-2">
                  <ApexAreaDual
                    categories={revenue.map((r) => r.month)}
                    revenue={revenue.map((r) => r.revenue)}
                    budget={revenue.map((r) => r.budget)}
                    height={280}
                  />
                </Tile>
                <Tile title="Same numbers in Power BI">
                  <p className="text-sm leading-relaxed text-prodigy-muted">
                    Management reports connect to this same fleet data. No extra spreadsheet. Change
                    it once here — ops and the board pack stay in step.
                  </p>
                </Tile>
              </div>
            )}

            {view === 'fleet' && (
              <div className="grid gap-3 lg:grid-cols-2">
                <Tile title="Type × region heatmap (aircraft count)">
                  <ApexHeatmap series={heatmap} height={300} />
                </Tile>
                <Tile title="Fleet by type">
                  <ApexBarHorizontal
                    categories={byType.map((t) => t.aircraftType)}
                    series={byType.map((t) => t.count)}
                    height={300}
                  />
                </Tile>
                <Tile title="Top lessee exposure" className="lg:col-span-2">
                  <ApexGroupedBar
                    categories={exposureChart.cats}
                    series={exposureChart.series}
                    height={300}
                  />
                </Tile>
              </div>
            )}

            {view === 'finance' && (
              <div className="grid gap-3 lg:grid-cols-2">
                <Tile title="Monthly revenue vs budget" className="lg:col-span-2">
                  <ApexAreaDual
                    categories={revenue.map((r) => r.month)}
                    revenue={revenue.map((r) => r.revenue)}
                    budget={revenue.map((r) => r.budget)}
                    height={320}
                  />
                </Tile>
                <Tile title="Lessee annual revenue ($M)">
                  <ApexBarHorizontal
                    categories={exposureChart.cats}
                    series={exposure.filter((e) => !region || e.region === region).slice(0, 8).map((e) => e.annualRevenue)}
                    height={300}
                  />
                </Tile>
                <Tile title="Finance talking points">
                  <ul className="space-y-2 text-sm text-prodigy-muted">
                    <li>· Rent and YTD from Core Financial</li>
                    <li>· Budget vs actual without Excel</li>
                    <li>· Same numbers ops sees on the fleet screen</li>
                    <li>· Filter by region — pack and ops stay aligned</li>
                  </ul>
                </Tile>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Kpi({ title, value, warn }) {
  return (
    <div
      className={`rounded-xl bg-white p-3 shadow-sm ${warn ? 'ring-2 ring-prodigy-saffron' : ''}`}
    >
      <div className="text-[10px] font-semibold uppercase tracking-wide text-prodigy-muted">
        {title}
      </div>
      <div className="text-2xl font-semibold text-avi-deep">{value}</div>
    </div>
  );
}

function Tile({ title, children, className = '' }) {
  return (
    <div className={`rounded-xl bg-white p-3 shadow-sm ${className}`}>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-prodigy-muted">
        {title}
      </div>
      {children}
    </div>
  );
}
