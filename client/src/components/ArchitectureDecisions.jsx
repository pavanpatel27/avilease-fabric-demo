import {

  ExcelIcon,

  FabricMark,

  OneLakeIcon,

  PowerBiIcon,

  RealTimeIcon,

} from './fabric/MsIcons';



/** High-res favicon via Google (stable for demo logos). */

function googleLogo(domain) {

  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

}



const OPTIONS = [

  {

    name: 'Excel packs',

    tag: 'Today',

    chosen: false,

    cells: ['No', 'No', 'No', 'No'],

    Logo: ExcelIcon,

    note: 'Microsoft Excel — fleet supplements and board packs copied by hand. Works for today, but every pack can disagree with Leaseworks and Core Financial.',

  },

  {

    name: 'SQL warehouse only',

    tag: 'Common',

    chosen: false,

    cells: ['Weak', 'Yes', 'Hard', 'Later'],

    logoSrc: googleLogo('azure.com'),

    logoAlt: 'Azure SQL',

    note: 'Azure SQL / traditional warehouse — strong for SQL reports, weaker at keeping the original extract and joining Leaseworks, Core Financial, and Aerlytix on one tail.',

  },

  {

    name: 'File dump (lake only)',

    tag: 'Cheap',

    chosen: false,

    cells: ['Yes', 'No', 'Yes', 'Unsafe'],

    Logo: OneLakeIcon,

    note: 'Raw file storage (lake only) — files land cheaply, but nothing is checked or published. Ops and the board would still see different versions.',

  },

  {

    name: 'Lakehouse — our pick',

    tag: 'Chosen',

    chosen: true,

    cells: ['Yes', 'Yes', 'Yes', 'On gold'],

    Logo: FabricMark,

    note: 'Microsoft Fabric lakehouse — collect in Data Factory, store in OneLake, publish one checked fleet row for the ops screen and Power BI. One workspace, one number.',

  },

  {

    name: 'Live query, no store',

    tag: 'Light',

    chosen: false,

    cells: ['No', 'No', 'No', 'No'],

    Logo: PowerBiIcon,

    note: 'Power BI direct query — reports read sources live with no stored copy. Fast to start, but you cannot replay what the pack showed last week if rent or status was wrong.',

  },

  {

    name: 'Real-time events first',

    tag: 'Later',

    chosen: false,

    cells: ['Yes', 'Maybe', 'Yes', 'Costly'],

    Logo: RealTimeIcon,

    note: 'Event streaming (e.g. Azure Event Hubs) — useful later for off-lease alerts and live feeds. Overkill for day-one hourly lease and rent refresh.',

  },

  {

    name: 'Salesforce Data Cloud',

    tag: 'DC',

    chosen: false,

    cells: ['No', 'Weak', 'Hard', 'Later'],

    logoSrc: googleLogo('salesforce.com'),

    logoAlt: 'Salesforce Data Cloud',

    note: 'Salesforce Data Cloud — great for CRM events and customer profiles. This demo needs one joined fleet row with Core Financial as the money source, not CRM-only analytics.',

  },

  {

    name: 'Snowflake',

    tag: 'WH',

    chosen: false,

    cells: ['No', 'Weak', 'Hard', 'Later'],

    logoSrc: googleLogo('snowflake.com'),

    logoAlt: 'Snowflake',

    note: 'Snowflake — a strong cloud warehouse, but Fabric already hosts the joined fleet lakehouse. A second platform adds cost and two places to look for the same tail.',

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



function ApproachLogo({ Logo, logoSrc, logoAlt, logoText, logoTint }) {

  return (

    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-prodigy-line bg-white">

      {Logo ? (

        <Logo className="h-9 w-9 rounded-full" />

      ) : logoSrc ? (

        <img src={logoSrc} alt={logoAlt || ''} className="h-6 w-6 object-contain" loading="lazy" />

      ) : (

        <span

          className="flex h-full w-full items-center justify-center text-sm font-bold text-avi-deep"

          style={{ backgroundColor: logoTint || '#F3F2F1' }}

          aria-hidden="true"

        >

          {logoText}

        </span>

      )}

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

          <table className="w-full min-w-[960px] border-collapse text-left">

            <thead>

              <tr className="border-b border-prodigy-line bg-avi-fog">

                <th className="min-w-[180px] px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-prodigy-muted">

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

                <th className="min-w-[220px] px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-prodigy-muted">

                  Comments / notes

                </th>

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

                    <span className="flex items-start gap-3">

                      <ApproachLogo

                        Logo={row.Logo}

                        logoSrc={row.logoSrc}

                        logoAlt={row.logoAlt}

                        logoText={row.logoText}

                        logoTint={row.logoTint}

                      />

                      <span>

                        <span className="block">{row.name}</span>

                        <span

                          className={`mt-0.5 inline-block text-[10px] font-bold uppercase tracking-wide ${

                            row.chosen ? 'text-[#00B7C3]' : 'text-prodigy-muted'

                          }`}

                        >

                          {row.tag}

                        </span>

                      </span>

                    </span>

                  </th>

                  {row.cells.map((c, i) => (

                    <Cell key={NEEDS[i]} value={c} chosen={row.chosen} />

                  ))}

                  <td className="px-4 py-3 align-top text-xs leading-relaxed text-prodigy-muted">

                    {row.note}

                  </td>

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


