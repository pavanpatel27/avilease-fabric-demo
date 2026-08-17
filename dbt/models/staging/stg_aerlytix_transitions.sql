-- Staging: AerLytix transition / off-lease events
select
  tail_number as registration,
  ac_family as aircraft_type,
  operator as lessee,
  geo_region as region,
  transition_stage,
  event_date,
  case lifecycle_flag
    when 'TX' then 'In Transition'
    when 'OFF' then 'Off Lease'
    else 'Off Lease'
  end as status,
  'AerLytix' as source_system,
  _batch_id as batch_id,
  _ingested_at as ingested_at
from {{ source('bronze', 'aerlytix_transitions') }}
