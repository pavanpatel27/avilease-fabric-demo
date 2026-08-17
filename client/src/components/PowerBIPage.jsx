import { PageHeader } from './FleetOverview';

const STEPS = [
  'Publish gold Parquet to ADLS Gen2 (leases + monthly_revenue).',
  'Create Synapse serverless views from synapse/create_views.sql.',
  'Power BI Desktop → Get data → Azure Synapse Analytics (SQL).',
  'Select vw_fleet_kpis, vw_fleet_by_type, vw_lease_status, vw_active_leases, vw_monthly_revenue.',
  'Choose Import (offline meeting) or DirectQuery (live warehouse story).',
  'Auth with Azure AD — Synapse SQL access + Storage Blob Data Reader on the lake.',
];

const MEASURES = [
  { name: 'Utilisation %', formula: 'On Lease aircraft / Total aircraft' },
  { name: 'YTD Revenue', formula: 'SUM(monthlyRent) * 12 for On Lease' },
  { name: 'Expiring ≤180d', formula: "COUNT where displayStatus = 'Expiring soon'" },
  { name: 'Revenue vs Budget', formula: 'monthly_revenue.revenue − budget' },
];

export default function PowerBIPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Power BI — same gold, second consumer"
        blurb="The warehouse is the product. React and Power BI both read Synapse views over the gold layer — no second extract factory."
      />

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-prodigy-line bg-white p-4 shadow-card">
          <h2 className="text-sm font-semibold text-avi-deep">Connection path</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-prodigy-ink">
            {STEPS.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-prodigy-line bg-white p-4 shadow-card">
          <h2 className="text-sm font-semibold text-avi-deep">Suggested measures</h2>
          <div className="mt-3 space-y-2">
            {MEASURES.map((m) => (
              <div key={m.name} className="rounded-xl bg-prodigy-soft px-3 py-2">
                <div className="text-sm font-semibold text-prodigy-crimson">{m.name}</div>
                <div className="text-xs text-prodigy-muted">{m.formula}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-prodigy-muted">
            Full steps live in <code className="text-prodigy-crimson">powerbi/README.md</code> in
            this repo.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-prodigy-saffron bg-prodigy-saffron/10 p-4 text-sm text-prodigy-ink">
        <strong className="text-prodigy-dark">Demo line:</strong> “Ciara’s ops screen and Damian’s
        Power BI report are two consumers of one Prodigy-built warehouse — not two competing data
        models.”
      </div>
    </div>
  );
}
