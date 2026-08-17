-- Staging: Core Finance rent receipts (cents → USD monthly)
select
  asset_reg as registration,
  airline as lessee,
  rent_amount_cents / 100.0 as monthly_rent_usd,
  currency_code,
  period_start,
  period_end,
  'Core Finance' as source_system,
  _batch_id as batch_id,
  _ingested_at as ingested_at
from {{ source('bronze', 'core_finance_rent') }}
where currency_code = 'USD'
