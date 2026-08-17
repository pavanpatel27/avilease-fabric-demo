-- Gold mart: lease performance join across LW + CF
select
  l.registration,
  l.aircraft_type,
  l.lessee,
  l.region,
  l.status,
  l.lease_start_date,
  l.lease_end_date,
  r.monthly_rent_usd,
  case
    when l.status = 'On Lease' and r.registration is not null then 'LW + CF'
    when l.status in ('In Transition', 'Off Lease') then 'AerLytix'
    else 'Leaseworks'
  end as source_tag
from {{ ref('stg_leaseworks_assets') }} l
left join {{ ref('stg_core_finance_revenue') }} r
  on l.registration = r.registration
