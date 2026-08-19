const OPTIONS = [
  {
    name: 'Excel packs',
    tag: 'Today',
    chosen: false,
    cells: ['No', 'No', 'No', 'No'],
  },
  {
    name: 'SQL warehouse only',
    tag: 'Common',
    chosen: false,
    cells: ['Weak', 'Yes', 'Hard', 'Later'],
  },
  {
    name: 'File dump (lake only)',
    tag: 'Cheap',
    chosen: false,
    cells: ['Yes', 'No', 'Yes', 'Unsafe'],
  },
  {
    name: 'Salesforce solution (native SF)',
    tag: 'SF',
    chosen: false,
    // Not the joined “replayable” analytics story we need for ops + board.
    cells: ['No', 'No', 'No', 'No'],
  },
  {
    name: 'Lakehouse — our pick',
    tag: 'Chosen',
    chosen: true,
    cells: ['Yes', 'Yes', 'Yes', 'On gold'],
  },
  {
    name: 'Live query, no store',
    tag: 'Light',
    chosen: false,
    cells: ['No', 'No', 'No', 'No'],
  },
  {
    name: 'Real-time events first',
    tag: 'Later',
    chosen: false,
    cells: ['Yes', 'Maybe', 'Yes', 'Costly'],
  },
  {
    name: 'Salesforce Data Cloud',
    tag: 'DC',
    chosen: false,
    // Works great for customer/event unification, but this demo is about a single joined fleet row
    // that ops + Power BI can query consistently (with Core Financial as the money source).
    cells: ['No', 'Weak', 'Hard', 'Later'],
    logoText: 'DC',
    logoTint: '#E0F2FF',
    comment:
      'Great for Salesforce events, but this demo needs one joined fleet row with Core Financial as the money source.',
  },
  {
    name: 'Snowflake',
    tag: 'SF',
    chosen: false,
    // Snowflake is a strong warehouse, but it would add a second reporting warehouse beside Fabric.
    cells: ['No', 'Weak', 'Hard', 'Later'],
    logoText: 'SN',
    logoTint: '#F3F7FF',
    comment:
      'Fabric already hosts the joined fleet lakehouse, so teams can use one trusted workspace for ops and reporting.',
  },
];

const NEEDS = [
  'Keep what the source sent',
  'Single Source of Truth',
  'Replay if the pack is wrong',
  'Safe to ask in English later',
];

const DECISIONS = [
  {
    decide: 'Keep the three systems',
    means: 'Leaseworks, Core Financial, and Aerlytix stay. Staff keep working where they work today.',
    why: 'We are not a rip-and-replace. We join what you already pay for.',
  },
  {
    decide: 'Land first, clean second (lakehouse)',
    means: 'Save the extract as it arrived, then tidy it, then publish one fleet row.',
    why: 'When rent and status disagree, we can show the original — not only the cleaned number.',
  },
  {
    decide: 'One published fleet row',
    means: 'Gold is the only version ops screens and Power BI are allowed to use.',
    why: 'Stops last week’s Excel pack sitting next to this morning’s Leaseworks screen.',
  },
  {
    decide: 'Microsoft Fabric to host it',
    means: 'Collect in Data Factory, store in OneLake/lakehouse, and serve Power BI from the same workspace AviLease already understands.',
    why: 'One bill, one login, and one workspace for ops + board reporting (no extra reporting tool beside Excel).',
  },
  {
    decide: 'Hourly refresh on day one',
    means: 'A scheduled collect. Not a live feed from every keystroke.',
    why: 'Leases and rent do not need seconds. Alerts for off-lease can come later.',
  },
  {
    decide: 'Do not put finance inside the CRM platform',
    means: 'Keep Core Financial as the source of the books, and let the lakehouse sit next to it for reporting.',
    why: 'The full books are not in Leaseworks. If finance is CRM-only, rent can be missing from the numbers you show.',
  },
];

function Cell({ value, chosen }) {
  const good = value === 'Yes' || value === 'On gold';
  const weak = value === 'Weak' || value === 'Maybe' || value === 'Later' || value === 'Hard';
  return (
    <td className="px-3 py-2.5 text-center text-xs">
      <span
        className={`inline-block min-w-[3.5rem] rounded-full px-2 py-0.5 font-semibold ${
          chosen && good
            ? 'bg-[#DFF6DD] text-[#0B6A0B]'
            : good
              ? 'bg-[#F3F9F4] text-[#0B6A0B]'
              : weak
                ? 'bg-[#FFF4CE] text-[#6B5300]'
                : 'bg-[#F3F2F1] text-[#605E5C]'
        }`}
      >
        {value}
      </span>
    </td>
  );
}

function ProviderLogo({ text, tint }) {
  return (
    <span
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-prodigy-line bg-white text-sm font-bold text-avi-deep"
      style={{ backgroundColor: tint }}
      aria-hidden="true"
    >
      {text}
    </span>
  );
}

export default function ArchitectureDecisions() {
  return (
    <section className="space-y-5">
      <header>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00B7C3]">
          Architecture decisions
        </p>
        <h2 className="mt-1 text-lg font-semibold text-avi-deep">What we chose — and why it matters</h2>
        <p className="mt-1 max-w-2xl text-sm text-prodigy-muted">
          These are the calls for the business, not a product catalogue. The question is: can ops
          and the board use the same aircraft number, and can we prove it?
        </p>
      </header>

      <div className="overflow-hidden rounded-xl border border-prodigy-line bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-prodigy-line bg-avi-fog">
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-prodigy-muted">
                  Approach
                </th>
                {NEEDS.map((n) => (
                  <th
                    key={n}
                    className="px-3 py-3 text-center text-[11px] font-semibold leading-snug text-avi-deep"
                  >
                    {n}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {OPTIONS.map((row) => (
                <tr
                  key={row.name}
                  className={`border-b border-prodigy-line last:border-0 ${
                    row.chosen ? 'bg-[#F3FBFC]' : 'bg-white'
                  }`}
                >
                  <th className="px-4 py-3 text-sm font-semibold text-avi-deep">
                    <span className="block">
                      <span className="flex items-start gap-3">
                        {row.logoText && (
                          <ProviderLogo text={row.logoText} tint={row.logoTint || '#F3F2F1'} />
                        )}
                        <span>
                          <span className="block">{row.name}</span>
                          <span
                            className={`mt-0.5 inline-block text-[10px] font-bold uppercase tracking-wide ${
                              row.chosen ? 'text-[#00B7C3]' : 'text-prodigy-muted'
                            }`}
                          >
                            {row.tag}
                          </span>
                          {row.comment && (
                            <span className="mt-1 block text-[10px] font-medium leading-snug text-prodigy-muted">
                              {row.comment}
                            </span>
                          )}
                        </span>
                      </span>
                    </span>
                  </th>
                  {row.cells.map((c, i) => (
                    <Cell key={NEEDS[i]} value={c} chosen={row.chosen} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-prodigy-line px-4 py-2.5 text-xs text-prodigy-muted">
          Lakehouse = keep the original extract, publish one cleaned fleet row, same tables for
          screens and Power BI. Excel packs are what you have today. Real-time is a later add-on,
          not the starting design.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-prodigy-line bg-white">
        <div className="border-b border-prodigy-line bg-avi-fog px-4 py-2.5">
          <h3 className="text-sm font-semibold text-avi-deep">The six decisions</h3>
          <p className="text-xs text-prodigy-muted">In plain language — what we do, and what you get.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-prodigy-line text-[11px] font-semibold uppercase tracking-wide text-prodigy-muted">
                <th className="px-4 py-2.5">We decided</th>
                <th className="px-4 py-2.5">What that looks like</th>
                <th className="px-4 py-2.5">Why the business cares</th>
              </tr>
            </thead>
            <tbody>
              {DECISIONS.map((d, i) => (
                <tr key={d.decide} className="border-b border-prodigy-line last:border-0">
                  <td className="px-4 py-3 align-top">
                    <div className="flex gap-2">
                      <span className="mt-0.5 font-mono text-[11px] font-bold text-[#00B7C3]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm font-semibold text-avi-deep">{d.decide}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-sm text-prodigy-muted">{d.means}</td>
                  <td className="px-4 py-3 align-top text-sm text-avi-deep">{d.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
