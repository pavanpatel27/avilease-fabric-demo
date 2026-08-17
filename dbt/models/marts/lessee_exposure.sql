-- Gold mart: lessee concentration / exposure
select
  lessee,
  region,
  count(*) as aircraft,
  round(sum(coalesce(monthly_rent_usd, 0)) * 12 / 1000000.0, 1) as annual_revenue_m
from {{ ref('lease_performance') }}
where status = 'On Lease'
group by lessee, region
order by annual_revenue_m desc
