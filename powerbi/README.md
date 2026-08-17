# Power BI — AviLease gold layer (Prodigy demo)

The React ops dashboard and Power BI are **two consumers of the same warehouse**.

## Prerequisites

1. Gold Parquet uploaded to ADLS Gen2 (`gold/leases`, `gold/monthly_revenue`).
2. Synapse serverless views created from [`../synapse/create_views.sql`](../synapse/create_views.sql).
3. Azure AD identity with:
   - Synapse SQL access (e.g. Synapse SQL Administrator / Reader)
   - `Storage Blob Data Reader` on the storage account

## Connect from Power BI Desktop

1. **Get data** → **Azure** → **Azure Synapse Analytics SQL**.
2. Server: `yourworkspace-ondemand.sql.azuresynapse.net`
3. Database: your serverless DB name.
4. Data Connectivity mode:
   - **Import** — best for offline laptop demos
   - **DirectQuery** — best when pitching “live warehouse”
5. Select views:
   - `vw_fleet_kpis`
   - `vw_fleet_by_type`
   - `vw_lease_status`
   - `vw_active_leases`
   - `vw_monthly_revenue`

## Sample measures

| Measure | Logic |
|---|---|
| Utilisation % | On Lease count / Total aircraft |
| YTD Revenue ($M) | From `vw_fleet_kpis.ytdRevenue` or sum of rents |
| Expiring ≤ 180d | Count where `displayStatus = "Expiring soon"` |
| Beat vs budget | `revenue - budget` on monthly trend |

## Talking point

> “We don’t rebuild finance logic in Power BI. The gold layer is the contract. Power BI and the ops UI both bind to Synapse views.”
