-- Gold mart: fleet summary for ops KPIs and Power BI
with leases as (
  select * from {{ ref('stg_leaseworks_assets') }}
),
rent as (
  select * from {{ ref('stg_core_finance_revenue') }}
)
select
  l.registration,
  l.aircraft_type,
  l.lessee,
  l.region,
  l.status,
  r.monthly_rent_usd,
  l.lease_end_date
from leases l
left join rent r on l.registration = r.registration
