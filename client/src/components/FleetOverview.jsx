import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import KPIRow from './KPIRow';
import ChartsRow from './ChartsRow';
import FleetTable from './FleetTable';

const EMPTY = { status: '', region: '', aircraftType: '', source: '', q: '', displayStatus: '' };

export default function FleetOverview({ onMeta, onInspect }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(EMPTY);
  const [leases, setLeases] = useState([]);
  const [kpis, setKpis] = useState(null);
  const [fleetByType, setFleetByType] = useState([]);
  const [leaseStatus, setLeaseStatus] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [allMeta, setAllMeta] = useState({ regions: [], types: [] });

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      try {
        const [f, s, r, all] = await Promise.all([
          api.fleetByType(),
          api.leaseStatus(),
          api.revenueTrend(),
          api.activeLeases({ limit: 500 }),
        ]);
        if (cancelled) return;
        setFleetByType(f.data);
        setLeaseStatus(s.data);
        setRevenue(r.data);
        setAllMeta({
          regions: [...new Set(all.data.map((x) => x.region))].sort(),
          types: [...new Set(all.data.map((x) => x.aircraftType))].sort(),
        });
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const a = await api.activeLeases(filters);
        if (cancelled) return;
        setLeases(a.data);
        setKpis({
          ...a.kpis,
          deltas: {
            totalAircraft: `${a.total} matching`,
            fleetUtilisation: filters.status ? 'filtered' : '+1.2 pts',
            ytdRevenue: filters.aircraftType || filters.region ? 'filtered set' : '+6.4%',
            avgLeaseRemaining: 'from selection',
          },
        });
        onMeta?.(a.meta);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [filters, onMeta]);

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters]
  );

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters(EMPTY);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-prodigy-crimson">
            The live fleet
          </p>
          <h1 className="mt-1 text-3xl font-normal tracking-tight text-avi-deep">Fleet</h1>
          <p className="mt-1 text-sm text-prodigy-muted">
            Filter, click a chart, or open any aircraft to see how the record was built.
          </p>
        </div>
        <div className="text-right text-xs text-prodigy-muted">
          <div className="font-semibold text-avi-deep">{leases.length} aircraft shown</div>
          {activeFilterCount > 0 && (
            <button type="button" onClick={clearFilters} className="text-prodigy-crimson underline">
              Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-2 rounded-2xl border border-prodigy-line bg-white p-3 shadow-card md:grid-cols-6">
        <input
          className="rounded-xl border border-prodigy-line px-3 py-2 text-sm md:col-span-2"
          placeholder="Search reg or lessee…"
          value={filters.q}
          onChange={(e) => setFilter('q', e.target.value)}
        />
        <select
          className="rounded-xl border border-prodigy-line px-3 py-2 text-sm"
          value={filters.status}
          onChange={(e) => setFilter('status', e.target.value)}
        >
          <option value="">All statuses</option>
          <option>On Lease</option>
          <option>In Transition</option>
          <option>Off Lease</option>
        </select>
        <select
          className="rounded-xl border border-prodigy-line px-3 py-2 text-sm"
          value={filters.region}
          onChange={(e) => setFilter('region', e.target.value)}
        >
          <option value="">All regions</option>
          {allMeta.regions.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <select
          className="rounded-xl border border-prodigy-line px-3 py-2 text-sm"
          value={filters.aircraftType}
          onChange={(e) => setFilter('aircraftType', e.target.value)}
        >
          <option value="">All types</option>
          {allMeta.types.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select
          className="rounded-xl border border-prodigy-line px-3 py-2 text-sm"
          value={filters.source}
          onChange={(e) => setFilter('source', e.target.value)}
        >
          <option value="">All sources</option>
          <option value="LW">LW + Core</option>
          <option value="Aerlytix">Aerlytix</option>
        </select>
      </div>

      {error && (
        <div className="rounded-xl border border-prodigy-crimson/30 bg-prodigy-crimson/5 px-3 py-2 text-sm text-prodigy-crimson">
          {error}
        </div>
      )}

      <KPIRow kpis={kpis} loading={loading} />
      <ChartsRow
        fleetByType={fleetByType}
        leaseStatus={leaseStatus}
        revenue={revenue}
        loading={loading}
        selectedType={filters.aircraftType}
        selectedStatus={filters.status}
        onSelectType={(aircraftType) =>
          setFilter('aircraftType', filters.aircraftType === aircraftType ? '' : aircraftType)
        }
        onSelectStatus={(status) => setFilter('status', filters.status === status ? '' : status)}
      />
      <FleetTable
        rows={leases}
        loading={loading}
        onRowClick={(row) => onInspect?.(row.registration)}
      />
    </div>
  );
}

export function PageHeader({ title, blurb }) {
  return (
    <div className="mb-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-prodigy-crimson">
        Prodigy × AviLease
      </p>
      <h1 className="mt-1 text-3xl font-normal tracking-tight text-avi-deep md:text-4xl">
        {title}
      </h1>
      <p className="mt-2 max-w-3xl text-sm font-light text-prodigy-muted">{blurb}</p>
    </div>
  );
}
