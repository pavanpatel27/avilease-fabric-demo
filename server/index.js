require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { loadWarehouse, isSynapseConfigured } = require('./store');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] }));
app.use(express.json());

function logError(route, err) {
  console.error(`[${new Date().toISOString()}] ${route}:`, err.message || err);
}

function withMeta(payload, { fallback = true, source = 'local_medallion' } = {}) {
  return {
    ...payload,
    meta: {
      fallback,
      source,
      synapseConfigured: isSynapseConfigured(),
      refreshedAt: new Date().toISOString(),
    },
  };
}

async function trySynapse(sqlText) {
  if (!db.isConfigured()) return null;
  try {
    return await db.query(sqlText);
  } catch (err) {
    logError('synapse', err);
    return null;
  }
}

app.get('/api/health', (_req, res) => {
  try {
    const wh = loadWarehouse();
    res.json({
      ok: true,
      mode: db.isConfigured() ? 'synapse_ready' : 'local_medallion',
      batchId: wh.batchId,
      generatedAt: wh.generatedAt,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/api/kpis', async (_req, res) => {
  try {
    const rows = await trySynapse('SELECT * FROM vw_fleet_kpis');
    if (rows && rows[0]) {
      const r = rows[0];
      return res.json(
        withMeta(
          {
            totalAircraft: r.totalAircraft,
            fleetUtilisation: r.fleetUtilisation,
            ytdRevenue: r.ytdRevenue,
            avgLeaseRemaining: r.avgLeaseRemaining,
            deltas: loadWarehouse().gold.kpis.deltas,
          },
          { fallback: false, source: 'synapse' }
        )
      );
    }
    const wh = loadWarehouse();
    res.json(withMeta(wh.gold.kpis));
  } catch (err) {
    logError('/api/kpis', err);
    res.status(503).json({ error: 'Data warehouse unavailable', fallback: true });
  }
});

app.get('/api/fleet-by-type', async (_req, res) => {
  try {
    const rows = await trySynapse(
      'SELECT aircraftType, count, totalRevenue FROM vw_fleet_by_type ORDER BY count DESC'
    );
    if (rows) return res.json(withMeta({ data: rows }, { fallback: false, source: 'synapse' }));
    res.json(withMeta({ data: loadWarehouse().gold.fleetByType }));
  } catch (err) {
    logError('/api/fleet-by-type', err);
    res.status(503).json({ error: 'Data warehouse unavailable', fallback: true });
  }
});

app.get('/api/lease-status', async (_req, res) => {
  try {
    const rows = await trySynapse(
      'SELECT status, count, percentage FROM vw_lease_status'
    );
    if (rows) return res.json(withMeta({ data: rows }, { fallback: false, source: 'synapse' }));
    res.json(withMeta({ data: loadWarehouse().gold.leaseStatus }));
  } catch (err) {
    logError('/api/lease-status', err);
    res.status(503).json({ error: 'Data warehouse unavailable', fallback: true });
  }
});

function filterLeases(rows, query) {
  let data = [...rows];
  const { q, status, region, aircraftType, source, displayStatus } = query;
  if (q) {
    const needle = String(q).toLowerCase();
    data = data.filter(
      (r) =>
        String(r.registration || '').toLowerCase().includes(needle) ||
        String(r.lessee || '').toLowerCase().includes(needle)
    );
  }
  if (status) data = data.filter((r) => r.status === status);
  if (region) data = data.filter((r) => r.region === region);
  if (aircraftType) data = data.filter((r) => r.aircraftType === aircraftType);
  if (source) data = data.filter((r) => String(r.sourceSystem || '').includes(source));
  if (displayStatus) data = data.filter((r) => r.displayStatus === displayStatus);
  return data;
}

function kpisFromLeases(rows) {
  const total = rows.length;
  const onLease = rows.filter((r) => r.status === 'On Lease');
  const utilisation = total ? round1((onLease.length / total) * 100) : 0;
  const ytdRevenue = round1(
    onLease.reduce((s, r) => s + (r.monthlyRent || 0) * 12, 0) / 1_000_000
  );
  const today = new Date();
  const remaining = onLease
    .filter((r) => r.leaseEndDate)
    .map((r) => (new Date(r.leaseEndDate) - today) / (365.25 * 24 * 3600 * 1000));
  const avgLeaseRemaining = remaining.length
    ? round1(remaining.reduce((a, b) => a + b, 0) / remaining.length)
    : 0;
  return { totalAircraft: total, fleetUtilisation: utilisation, ytdRevenue, avgLeaseRemaining };
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

app.get('/api/active-leases', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '200', 10), 500);
    const rows = await trySynapse(
      `SELECT TOP (${limit}) * FROM vw_active_leases ORDER BY leaseEndDate ASC`
    );
    if (rows) {
      const filtered = filterLeases(rows, req.query).slice(0, limit);
      return res.json(
        withMeta(
          { data: filtered, total: filtered.length, kpis: kpisFromLeases(filtered) },
          { fallback: false, source: 'synapse' }
        )
      );
    }
    const all = loadWarehouse().gold.activeLeases;
    const filtered = filterLeases(all, req.query).slice(0, limit);
    res.json(withMeta({ data: filtered, total: filtered.length, kpis: kpisFromLeases(filtered) }));
  } catch (err) {
    logError('/api/active-leases', err);
    res.status(503).json({ error: 'Data warehouse unavailable', fallback: true });
  }
});

app.get('/api/asset/:registration', (req, res) => {
  try {
    const wh = loadWarehouse();
    const reg = decodeURIComponent(req.params.registration).toUpperCase();
    const silver =
      wh.silver.find((r) => String(r.registration).toUpperCase() === reg) || null;
    const gold =
      wh.gold.activeLeases.find((r) => String(r.registration).toUpperCase() === reg) || silver;
    const bronze = {
      leaseworks:
        wh.bronze.leaseworks.find((r) => String(r.Asset_Reg__c).toUpperCase() === reg) || null,
      coreFinance:
        wh.bronze.core_finance.find((r) => String(r.asset_reg).toUpperCase() === reg) || null,
      aerlytix:
        wh.bronze.aerlytix.find((r) => String(r.tail_number).toUpperCase() === reg) || null,
    };
    if (!silver && !bronze.leaseworks) {
      return res.status(404).json({ error: `No warehouse record for ${reg}` });
    }
    res.json(
      withMeta({
        registration: reg,
        bronze,
        silver,
        gold,
        normalisation: {
          statusMap: wh.lineage.statusMap,
          steps: [
            {
              layer: 'bronze',
              detail: 'Raw source-native fields landed by ADF (immutable batch)',
            },
            {
              layer: 'silver',
              detail: 'Conformed registration, status, USD rent, region, lineage tags',
            },
            {
              layer: 'gold',
              detail: 'Business displayStatus + mart fields for ops UI / Power BI',
            },
          ],
        },
      })
    );
  } catch (err) {
    logError('/api/asset', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/search', (req, res) => {
  try {
    const q = String(req.query.q || '').toLowerCase();
    const wh = loadWarehouse();
    const hits = wh.gold.activeLeases
      .filter(
        (r) =>
          !q ||
          String(r.registration).toLowerCase().includes(q) ||
          String(r.lessee).toLowerCase().includes(q)
      )
      .slice(0, 20)
      .map((r) => ({
        registration: r.registration,
        lessee: r.lessee,
        aircraftType: r.aircraftType,
        status: r.status,
        displayStatus: r.displayStatus,
      }));
    res.json(withMeta({ data: hits }));
  } catch (err) {
    logError('/api/search', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/revenue-trend', async (_req, res) => {
  try {
    const rows = await trySynapse(
      'SELECT TOP 12 month, revenue, budget FROM vw_monthly_revenue ORDER BY month DESC'
    );
    if (rows) {
      return res.json(
        withMeta({ data: [...rows].reverse() }, { fallback: false, source: 'synapse' })
      );
    }
    const all = loadWarehouse().gold.monthlyRevenue;
    res.json(withMeta({ data: all.slice(-12) }));
  } catch (err) {
    logError('/api/revenue-trend', err);
    res.status(503).json({ error: 'Data warehouse unavailable', fallback: true });
  }
});

app.get('/api/lessee-exposure', (_req, res) => {
  try {
    res.json(withMeta({ data: loadWarehouse().gold.lesseeExposure }));
  } catch (err) {
    logError('/api/lessee-exposure', err);
    res.status(503).json({ error: 'Data warehouse unavailable', fallback: true });
  }
});

app.get('/api/pipeline', (_req, res) => {
  try {
    const wh = loadWarehouse();
    res.json(withMeta({ ...wh.pipeline, architecture: 'ADF → ADLS medallion → dbt → Synapse → consumers' }));
  } catch (err) {
    logError('/api/pipeline', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/lineage', (_req, res) => {
  try {
    res.json(withMeta(loadWarehouse().lineage));
  } catch (err) {
    logError('/api/lineage', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/quality', (_req, res) => {
  try {
    res.json(withMeta(loadWarehouse().quality));
  } catch (err) {
    logError('/api/quality', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/layers/:layer', (req, res) => {
  try {
    const wh = loadWarehouse();
    const layer = req.params.layer;
    if (layer === 'bronze') {
      return res.json(
        withMeta({
          layer: 'bronze',
          description: 'Raw land — source-native schemas, immutable batches',
          sources: {
            leaseworks: {
              schema: Object.keys(wh.bronze.leaseworks[0] || {}),
              sample: wh.bronze.leaseworks.slice(0, 5),
              count: wh.bronze.leaseworks.length,
            },
            coreFinance: {
              schema: Object.keys(wh.bronze.core_finance[0] || {}),
              sample: wh.bronze.core_finance.slice(0, 5),
              count: wh.bronze.core_finance.length,
            },
            aerlytix: {
              schema: Object.keys(wh.bronze.aerlytix[0] || {}),
              sample: wh.bronze.aerlytix.slice(0, 5),
              count: wh.bronze.aerlytix.length,
            },
          },
        })
      );
    }
    if (layer === 'silver') {
      return res.json(
        withMeta({
          layer: 'silver',
          description: 'Conformed leases — shared keys, status, currency, lineage',
          schema: Object.keys(wh.silver[0] || {}),
          sample: wh.silver.slice(0, 8),
          count: wh.silver.length,
        })
      );
    }
    if (layer === 'gold') {
      return res.json(
        withMeta({
          layer: 'gold',
          description: 'Business marts consumed by React and Power BI',
          marts: Object.keys(wh.gold),
          kpis: wh.gold.kpis,
          sampleLeases: wh.gold.activeLeases.slice(0, 5),
        })
      );
    }
    res.status(404).json({ error: 'Unknown layer. Use bronze|silver|gold' });
  } catch (err) {
    logError('/api/layers', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Prodigy AviLease DW API on http://localhost:${PORT}`);
  console.log(
    db.isConfigured()
      ? 'Synapse credentials detected — live path enabled'
      : 'Local medallion mode (run python scripts/seed_demo_data.py if data missing)'
  );
});
