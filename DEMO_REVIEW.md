# Fabric demo review — email draft

Review of the AviLease warehouse demo against current Microsoft Fabric guidance
(Microsoft Learn, retrieved via Azure MCP). Sources are linked inline.

**Subject:** AviLease Fabric demo — six changes before we walk Ciara and Damian through it

---

Hi both,

I went back over the AviLease warehouse demo against current Microsoft Fabric guidance. The story
holds up well; there are six places where a small change would make it harder to poke holes in, and
one of them is a genuine technical trap rather than a presentation nit.

**1. The gold contract needs to be Delta tables, not Synapse views.** This is the important one. Our
gold layer is currently six `vw_*` views defined over `OPENROWSET` in `synapse/create_views.sql`, and
the demo tells the story that Power BI binds to those same views via Direct Lake. That combination
does not behave the way we're claiming: where a semantic model table sits on a non-materialized SQL
view, Direct Lake on the SQL analytics endpoint falls back to DirectQuery, and Direct Lake on OneLake
can't be built on such a view at all
([Direct Lake considerations and limitations](https://learn.microsoft.com/fabric/fundamentals/direct-lake-overview#considerations-and-limitations)).
The fix is straightforward and actually simplifies the pitch: land `gold_fleet` and `gold_revenue` as
Delta tables in the lakehouse, and keep `wh_finance` as the SQL surface for the finance pack. Same
one-contract message, but it survives a technical question.

**2. Lead with OneLake shortcuts to kill the migration objection.** Microsoft's own Synapse-to-Fabric
guidance names shortcuts as the recommended, zero-copy option: point a Fabric lakehouse at the
existing ADLS Gen2 paths, and Delta tables in the Tables section auto-register in both the SQL
analytics endpoint and Power BI, with no data movement or duplicated storage
([data migration options](https://learn.microsoft.com/fabric/data-engineering/synapse-migration-hms-data#data-migration-options)).
That is a much stronger answer to "is this a big bang?" than our current phase-1 framing.

**3. Show the built-in pipeline upgrade experience during the Configure DW section.** There's a
first-party assessment flow in the ADF and Synapse UX that scores each pipeline as Ready or Needs
review, maps linked services to Fabric connections, exports results to CSV for phased planning, and —
the detail Damian will care about — migrates pipelines with **triggers disabled by default**
([upgrade Synapse pipelines to Fabric Data Factory](https://learn.microsoft.com/azure/data-factory/how-to-upgrade-your-azure-synapse-analytics-pipelines-to-fabric-data-factory#migrate-synapse-pipelines)).
A screenshot of that assessment table is worth more than a roadmap slide.

**4. Be precise about how each source lands, because Salesforce is the awkward one.** For Leaseworks
and Aerlytix the Salesforce objects connector needs API access explicitly enabled on the profile and
does not work on trial orgs
([connector prerequisites](https://learn.microsoft.com/fabric/data-factory/connector-salesforce-objects)).
More importantly, Copy Job supports full load and upsert for Salesforce but **not** watermark-based
incremental reads, so hourly deltas need a pipeline copy with a SOQL filter rather than the Copy Job
wizard
([Copy Job connector matrix](https://learn.microsoft.com/fabric/data-factory/copy-job-connectors#copy-job-sources-and-destinations)).
Core Financial (SunSystems) is the better place to demo CDC, since that's what lets us replicate
deletes and keep the register genuinely in sync
([CDC vs watermark](https://learn.microsoft.com/fabric/data-factory/incremental-copy-job#when-to-use-cdc-vs-watermark-based-incremental-copy)).
Getting this right matters because "is it real-time?" is on our own objection list.

**5. Swap the hand-built bronze/silver/gold pipeline for materialized lake views.** These let us
define the layer transitions declaratively in SQL, with automatic dependency ordering, built-in data
quality rules, and lineage we can put on screen
([medallion with materialized lake views](https://learn.microsoft.com/fabric/onelake/onelake-medallion-lakehouse-architecture#use-materialized-lake-views-for-medallion-architecture)).
The visible lineage graph is the single best answer to "two reports, two truths."

**6. Give the F16 badge something behind it.** The workspace header shows "F16 · Running" but we never
explain the cost model. Three facts cover Damian's likely questions: capacities burst and smooth so a
smaller SKU absorbs spikes without careful scheduling
([throttling policy](https://learn.microsoft.com/fabric/enterprise/throttling)); F SKUs can be resized
or paused on a schedule via the Fabric CLI or Azure Automation, and pausing stops throttling
immediately; and the recommended pattern is a reserved instance for the baseline topped up with
pay-as-you-go for known peaks such as quarter end
([capacity planning guidance](https://learn.microsoft.com/fabric/enterprise/capacity-planning-manage-capacity-growth-governance#enterprise-centralized-capacities)).

One thing to add if we have time: Git integration on the development workspace plus Fabric deployment
pipelines for dev/test/prod promotion, with the semantic model certified and owned by the BI side.
It's the governance answer Damian will ask for, and it's the documented reference pattern.

My suggestion is that items 1 and 4 are must-do before the meeting because they're correctness issues
in what we're currently asserting, and 2, 3, 5 and 6 are presentation upgrades we can take as far as
time allows.

Happy to make the gold-layer change and rework the Configure DW canvas myself — say the word.

Thanks,
Pavan

---

## Priority summary

| # | Change | Why | Priority |
|---|---|---|---|
| 1 | Gold layer as Delta tables, not `vw_*` views | Direct Lake falls back to DirectQuery on non-materialized views | Must fix |
| 4 | Correct per-source ingestion story (Salesforce vs SunSystems CDC) | Copy Job has no watermark incremental for Salesforce | Must fix |
| 2 | Lead with OneLake shortcuts | Zero-copy, answers "big bang" objection | High |
| 3 | Show ADF/Synapse upgrade assessment | Triggers disabled by default de-risks migration | High |
| 5 | Materialized lake views for medallion | Visible lineage answers "two truths" | Medium |
| 6 | Explain the F16 capacity and cost model | Covers bursting, pause/resume, RI vs pay-go | Medium |
| — | Git integration and deployment pipelines | Governance and promotion story | If time |

## Note on tooling

The Azure MCP server has no Microsoft Fabric resource tooling — its only `fabric` tool is Azure
**Service** Fabric, which is unrelated. The guidance above came from the server's Microsoft Learn
documentation search, cross-checked against `client/src/components/FabricPage.jsx`,
`synapse/create_views.sql` and `DEMO_SCRIPT.md`. No live Azure subscription was queried.
