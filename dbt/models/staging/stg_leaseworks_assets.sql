-- Staging: Leaseworks bronze → conformed asset spine
select
  Asset_Reg__c as registration,
  Aircraft_Type__c as aircraft_type,
  Lessee_Name__c as lessee,
  Region__c as region,
  Lease_Start__c as lease_start_date,
  Lease_End__c as lease_end_date,
  case Status_Code__c
    when 'ACTIVE' then 'On Lease'
    when 'TRANSITION' then 'In Transition'
    when 'RETURNED' then 'Off Lease'
    else 'Off Lease'
  end as status,
  'Leaseworks' as source_system,
  _batch_id as batch_id,
  _ingested_at as ingested_at
from {{ source('bronze', 'leaseworks_assets') }}
