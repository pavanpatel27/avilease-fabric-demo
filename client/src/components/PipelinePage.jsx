import { useEffect, useState } from 'react';
import { api } from '../api';

const STEPS = [
  { id: 'lw', name: 'Pull from Leaseworks', targetKey: 'leaseworks' },
  { id: 'cf', name: 'Pull from Core Financial', targetKey: 'coreFinance' },
  { id: 'ax', name: 'Pull from Aerlytix', targetKey: 'aerlytix' },
  { id: 'silver', name: 'Clean and match aircraft', targetKey: 'silver' },
  { id: 'gold', name: 'Ready for reports', targetKey: 'gold' },
  { id: 'quality', name: 'Check the data is good', targetKey: 'quality' },
];

export default function PipelinePage() {
  const [pipeline, setPipeline] = useState(null);
  const [quality, setQuality] = useState(null);
  const [running, setRunning] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [done, setDone] = useState({});
  const [counts, setCounts] = useState({});
  const [log, setLog] = useState([]);

  useEffect(() => {
    Promise.all([api.pipeline(), api.quality(), api.layer('bronze')]).then(([p, q, b]) => {
      setPipeline(p);
      setQuality(q);
      setCounts({
        leaseworks: b.sources.leaseworks.count,
        coreFinance: b.sources.coreFinance.count,
        aerlytix: b.sources.aerlytix.count,
        silver: q.layerCounts.silver,
        gold: q.layerCounts.gold.leases,
        quality: q.checks.filter((c) => c.passed).length,
      });
    });
  }, []);

  async function runPipeline() {
    if (running) return;
    setRunning(true);
    setDone({});
    setLog([]);
    setActiveIdx(0);

    for (let i = 0; i < STEPS.length; i++) {
      setActiveIdx(i);
      const step = STEPS[i];
      setLog((prev) => [
        ...prev,
        `${new Date().toLocaleTimeString()}  START  ${step.name}`,
      ]);
      await sleep(700 + Math.random() * 500);
      setDone((prev) => ({ ...prev, [step.id]: true }));
      setLog((prev) => [
        ...prev,
        `${new Date().toLocaleTimeString()}  OK     ${step.name}  (${counts[step.targetKey] ?? '—'} rows)`,
      ]);
    }

    setActiveIdx(-1);
    setRunning(false);
    setLog((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}  DONE   Sync complete — fleet and analytics are up to date`,
    ]);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-prodigy-crimson">
            Watch it update
          </p>
          <h1 className="mt-1 text-3xl font-normal text-avi-deep">Sync the three systems</h1>
          <p className="mt-1 text-sm text-prodigy-muted">
            Press run. Data comes in from Leaseworks, Core Financial, and Aerlytix, then is checked
            before it hits the fleet screen.
          </p>
        </div>
        <button
          type="button"
          disabled={running}
          onClick={runPipeline}
          className="rounded-full bg-prodigy-crimson px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {running ? 'Running…' : 'Run sync'}
        </button>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-prodigy-line bg-white p-4 shadow-card">
          <div className="mb-3 text-sm font-semibold text-avi-deep">What happens</div>
          <div className="space-y-2">
            {STEPS.map((s, i) => {
              const isActive = activeIdx === i;
              const isDone = done[s.id];
              return (
                <div
                  key={s.id}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${
                    isActive
                      ? 'bg-prodigy-crimson text-white'
                      : isDone
                        ? 'bg-avi-mist text-avi-deep'
                        : 'bg-prodigy-soft text-prodigy-ink'
                  }`}
                >
                  <span className="font-medium">{s.name}</span>
                  <span className="text-xs font-semibold">
                    {isActive ? 'running' : isDone ? `${counts[s.targetKey] ?? '✓'} ok` : 'queued'}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-xs text-prodigy-muted">
            Last batch: {pipeline?.batchId || '—'} · ADF {pipeline?.adfStatus || '…'}
          </div>
        </div>

        <div className="rounded-2xl bg-prodigy-dark p-4 font-mono text-[11px] text-prodigy-saffron shadow-card">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white">
            Sync log
          </div>
          <div className="h-[280px] overflow-auto space-y-1">
            {log.length === 0 && (
              <div className="text-white/50">Waiting for run… click “Run warehouse sync”.</div>
            )}
            {log.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
      </div>

      {quality && (
        <div className="rounded-2xl border border-prodigy-line bg-white p-4 shadow-card">
          <div className="mb-2 text-sm font-semibold text-avi-deep">Quality checks</div>
          <div className="grid gap-2 md:grid-cols-3">
            {quality.checks.map((c) => (
              <div
                key={c.id}
                className={`rounded-xl px-3 py-2 text-sm ${
                  c.passed ? 'bg-avi-mist text-avi-deep' : 'bg-prodigy-crimson/10 text-prodigy-crimson'
                }`}
              >
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs opacity-80">
                  {c.actual} / expected {c.expected}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
