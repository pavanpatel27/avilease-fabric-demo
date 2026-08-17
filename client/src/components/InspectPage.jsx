import { useEffect, useState } from 'react';
import { api, formatDate, formatRent } from '../api';

export default function InspectPage({ initialReg, onClearInitial }) {
  const [q, setQ] = useState(initialReg || '');
  const [hits, setHits] = useState([]);
  const [asset, setAsset] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialReg) return;
    loadAsset(initialReg);
    onClearInitial?.();
  }, [initialReg, onClearInitial]);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!q || q.length < 1) {
        setHits([]);
        return;
      }
      try {
        const res = await api.search(q);
        setHits(res.data);
      } catch {
        setHits([]);
      }
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  async function loadAsset(reg) {
    setLoading(true);
    setError(null);
    try {
      const data = await api.asset(reg);
      setAsset(data);
      setQ(reg);
      setHits([]);
    } catch (e) {
      setAsset(null);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-prodigy-crimson">
          Look up an aircraft
        </p>
        <h1 className="mt-1 text-3xl font-normal text-avi-deep">One aircraft, end to end</h1>
        <p className="mt-1 text-sm text-prodigy-muted">
          Search a registration. See raw source data, the cleaned version, then the version used
          for reports.
        </p>
      </div>

      <div className="relative max-w-xl">
        <input
          className="w-full rounded-xl border border-prodigy-line bg-white px-4 py-3 text-sm shadow-card"
          placeholder="Type registration or airline (e.g. EI- or Ryanair)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && hits[0]) loadAsset(hits[0].registration);
          }}
        />
        {hits.length > 0 && (
          <div className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-prodigy-line bg-white shadow-card">
            {hits.map((h) => (
              <button
                key={h.registration}
                type="button"
                onClick={() => loadAsset(h.registration)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-prodigy-soft"
              >
                <span className="font-semibold text-avi-deep">{h.registration}</span>
                <span className="text-prodigy-muted">
                  {h.aircraftType} · {h.lessee}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && <div className="text-sm text-prodigy-muted">Loading…</div>}
      {error && (
        <div className="rounded-xl border border-prodigy-crimson/30 bg-prodigy-crimson/5 px-3 py-2 text-sm text-prodigy-crimson">
          {error}
        </div>
      )}

      {asset && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-avi-deep px-4 py-3 text-white">
            <div className="text-2xl font-semibold">{asset.registration}</div>
            <div className="text-sm text-white/80">
              {asset.gold?.aircraftType} · {asset.gold?.lessee} · {asset.gold?.status}
            </div>
            <div className="ml-auto rounded-full bg-prodigy-saffron px-3 py-1 text-xs font-semibold text-prodigy-dark">
              {asset.gold?.displayStatus || asset.silver?.displayStatus}
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            <LayerCard
              title="1 · As it arrived"
              tone="crimson"
              subtitle="From each system, before we join it"
            >
              <SourceBlock
                name="Leaseworks"
                present={!!asset.bronze.leaseworks}
                data={asset.bronze.leaseworks}
                highlight={['Asset_Reg__c', 'Status_Code__c', 'Aircraft_Type__c']}
              />
              <SourceBlock
                name="Core Financial (SunSystems)"
                present={!!asset.bronze.coreFinance}
                data={asset.bronze.coreFinance}
                highlight={['asset_reg', 'rent_amount_cents', 'currency_code']}
              />
              <SourceBlock
                name="Aerlytix"
                present={!!asset.bronze.aerlytix}
                data={asset.bronze.aerlytix}
                highlight={['tail_number', 'lifecycle_flag', 'transition_stage']}
              />
            </LayerCard>

            <LayerCard
              title="2 · Cleaned up"
              tone="saffron"
              subtitle="Same aircraft, same money, same status"
            >
              {asset.silver ? (
                <dl className="space-y-2 text-sm">
                  <Row k="registration" v={asset.silver.registration} />
                  <Row k="status (conformed)" v={asset.silver.status} accent />
                  <Row k="monthlyRent USD" v={formatRent(asset.silver.monthlyRent)} accent />
                  <Row k="leaseEndDate" v={formatDate(asset.silver.leaseEndDate)} />
                  <Row k="sourceSystems" v={(asset.silver.sourceSystems || []).join(' + ')} />
                  <Row k="source tag" v={asset.silver.sourceSystem} />
                </dl>
              ) : (
                <Empty />
              )}
            </LayerCard>

            <LayerCard
              title="3 · Ready to use"
              tone="teal"
              subtitle="What the fleet screen and analytics show"
            >
              {asset.gold ? (
                <dl className="space-y-2 text-sm">
                  <Row k="displayStatus" v={asset.gold.displayStatus} accent />
                  <Row k="lessee" v={asset.gold.lessee} />
                  <Row k="region" v={asset.gold.region} />
                  <Row k="aircraftType" v={asset.gold.aircraftType} />
                  <Row k="monthlyRent" v={formatRent(asset.gold.monthlyRent)} />
                  <Row k="lease end" v={formatDate(asset.gold.leaseEndDate)} />
                </dl>
              ) : (
                <Empty />
              )}
            </LayerCard>
          </div>

          <div className="rounded-2xl border border-prodigy-line bg-white p-4 shadow-card">
            <div className="text-sm font-semibold text-avi-deep">What just happened</div>
            <ul className="mt-2 space-y-1 text-sm text-prodigy-muted">
              {(asset.normalisation?.steps || []).map((s) => (
                <li key={s.layer}>
                  <span className="font-semibold capitalize text-prodigy-crimson">{s.layer}:</span>{' '}
                  {s.detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!asset && !loading && (
        <div className="rounded-2xl border border-dashed border-prodigy-line bg-white p-8 text-center text-sm text-prodigy-muted">
          Search a registration to run a live inspect — this is the normalisation demo, not a slide.
        </div>
      )}
    </div>
  );
}

function LayerCard({ title, subtitle, children, tone }) {
  const bar =
    tone === 'crimson'
      ? 'bg-prodigy-crimson'
      : tone === 'saffron'
        ? 'bg-prodigy-saffron'
        : 'bg-avi-mint';
  return (
    <div className="overflow-hidden rounded-2xl border border-prodigy-line bg-white shadow-card">
      <div className={`h-1.5 ${bar}`} />
      <div className="p-4">
        <div className="text-sm font-semibold text-prodigy-ink">{title}</div>
        <div className="mb-3 text-[11px] text-prodigy-muted">{subtitle}</div>
        {children}
      </div>
    </div>
  );
}

function SourceBlock({ name, present, data, highlight }) {
  return (
    <div className="mb-3 rounded-xl bg-prodigy-soft p-2">
      <div className="mb-1 flex items-center justify-between text-xs font-semibold">
        <span>{name}</span>
        <span className={present ? 'text-avi-teal' : 'text-prodigy-muted'}>
          {present ? 'present' : 'not in this batch'}
        </span>
      </div>
      {present ? (
        <div className="space-y-1 font-mono text-[10px] text-prodigy-ink">
          {highlight.map((k) => (
            <div key={k} className="flex justify-between gap-2">
              <span className="text-prodigy-muted">{k}</span>
              <span className="font-semibold">{formatCell(data[k])}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Row({ k, v, accent }) {
  return (
    <div className="flex justify-between gap-3 border-b border-prodigy-line/70 py-1">
      <dt className="text-prodigy-muted">{k}</dt>
      <dd className={`text-right font-semibold ${accent ? 'text-prodigy-crimson' : 'text-avi-deep'}`}>
        {v ?? '—'}
      </dd>
    </div>
  );
}

function Empty() {
  return <div className="text-sm text-prodigy-muted">No data at this layer.</div>;
}

function formatCell(v) {
  if (v == null) return '—';
  return String(v);
}
