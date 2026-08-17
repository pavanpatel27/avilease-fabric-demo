-- Replace {STORAGE_ACCOUNT} and {CONTAINER} before running in Synapse Studio.

CREATE OR ALTER VIEW vw_fleet_kpis AS
SELECT
  COUNT(*) AS totalAircraft,
  ROUND(
    CAST(SUM(CASE WHEN status = 'On Lease' THEN 1 ELSE 0 END) AS FLOAT)
    / COUNT(*) * 100, 1
  ) AS fleetUtilisation,
  ROUND(SUM(CASE WHEN status = 'On Lease' THEN monthlyRent ELSE 0 END) * 12 / 1000000.0, 1)
    AS ytdRevenue,
  ROUND(AVG(
    CASE WHEN leaseEndDate IS NOT NULL
    THEN DATEDIFF(day, GETDATE(), leaseEndDate) / 365.25
    ELSE NULL END
  ), 1) AS avgLeaseRemaining
FROM OPENROWSET(
  BULK 'https://{STORAGE_ACCOUNT}.dfs.core.windows.net/{CONTAINER}/gold/leases/*.parquet',
  FORMAT = 'PARQUET'
) AS leases;

CREATE OR ALTER VIEW vw_fleet_by_type AS
SELECT
  aircraftType,
  COUNT(*) AS count,
  ROUND(SUM(CASE WHEN status = 'On Lease' THEN monthlyRent ELSE 0 END) * 12 / 1000000.0, 1)
    AS totalRevenue
FROM OPENROWSET(
  BULK 'https://{STORAGE_ACCOUNT}.dfs.core.windows.net/{CONTAINER}/gold/leases/*.parquet',
  FORMAT = 'PARQUET'
) AS leases
GROUP BY aircraftType;

CREATE OR ALTER VIEW vw_lease_status AS
SELECT
  status,
  COUNT(*) AS count,
  ROUND(CAST(COUNT(*) AS FLOAT) / SUM(COUNT(*)) OVER () * 100, 1) AS percentage
FROM OPENROWSET(
  BULK 'https://{STORAGE_ACCOUNT}.dfs.core.windows.net/{CONTAINER}/gold/leases/*.parquet',
  FORMAT = 'PARQUET'
) AS leases
GROUP BY status;

CREATE OR ALTER VIEW vw_active_leases AS
SELECT
  registration,
  aircraftType,
  lessee,
  region,
  leaseEndDate,
  monthlyRent,
  status,
  sourceSystem,
  CASE
    WHEN status = 'In Transition' THEN 'Transition'
    WHEN leaseEndDate IS NOT NULL
      AND DATEDIFF(day, GETDATE(), leaseEndDate) <= 180 THEN 'Expiring soon'
    WHEN status = 'Off Lease' THEN 'Off lease'
    ELSE 'Current'
  END AS displayStatus
FROM OPENROWSET(
  BULK 'https://{STORAGE_ACCOUNT}.dfs.core.windows.net/{CONTAINER}/gold/leases/*.parquet',
  FORMAT = 'PARQUET'
) AS leases;

CREATE OR ALTER VIEW vw_monthly_revenue AS
SELECT
  month,
  revenue,
  budget
FROM OPENROWSET(
  BULK 'https://{STORAGE_ACCOUNT}.dfs.core.windows.net/{CONTAINER}/gold/monthly_revenue/*.parquet',
  FORMAT = 'PARQUET'
) AS rev;
