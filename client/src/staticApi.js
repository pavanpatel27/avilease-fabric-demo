const DATA_URL = `${import.meta.env.BASE_URL}data/warehouse.json`;

let cache = null;

async function loadWarehouse() {
  if (cache) return cache;
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error('Demo data missing. Rebuild with warehouse.json in public/data.');
  cache = await res.json();
  return cache;
}

function withMeta(payload) {
  return {
    ...payload,
    meta: {
      fallback: true,
      source: 'github_pages',
      synapseConfigured: false,
      refreshedAt: new Date().toISOString(),
    },
  };
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

function filterLeases(rows, query = {}) {
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

export const staticApi = {
  async health() {
    const wh = await loadWarehouse();
    return { ok: true, mode: 'github_pages', batchId: wh.batchId, generatedAt: wh.generatedAt };
  },
  async kpis() {
    const wh = await loadWarehouse();
    return withMeta(wh.gold.kpis);
  },
  async fleetByType() {
    const wh = await loadWarehouse();
    return withMeta({ data: wh.gold.fleetByType });
  },
  async leaseStatus() {
    const wh = await loadWarehouse();
    return withMeta({ data: wh.gold.leaseStatus });
  },
  async activeLeases(params = {}) {
    const wh = await loadWarehouse();
    const limit = Math.min(parseInt(params.limit || '200', 10), 500);
    const filtered = filterLeases(wh.gold.activeLeases, params).slice(0, limit);
    return withMeta({ data: filtered, total: filtered.length, kpis: kpisFromLeases(filtered) });
  },
  async asset(reg) {
    const wh = await loadWarehouse();
    const key = String(reg).toUpperCase();
    const silver = wh.silver.find((r) => String(r.registration).toUpperCase() === key) || null;
    const gold =
      wh.gold.activeLeases.find((r) => String(r.registration).toUpperCase() === key) || silver;
    const bronze = {
      leaseworks: wh.bronze.leaseworks.find((r) => String(r.Asset_Reg__c).toUpperCase() === key) || null,
      coreFinance: wh.bronze.core_finance.find((r) => String(r.asset_reg).toUpperCase() === key) || null,
      aerlytix: wh.bronze.aerlytix.find((r) => String(r.tail_number).toUpperCase() === key) || null,
    };
    if (!silver && !bronze.leaseworks) throw new Error(`No warehouse record for ${key}`);
    return withMeta({
      registration: key,
      bronze,
      silver,
      gold,
      normalisation: {
        statusMap: wh.lineage.statusMap,
        steps: [
          { layer: 'bronze', detail: 'Raw source-native fields landed by ADF (immutable batch)' },
          { layer: 'silver', detail: 'Conformed registration, status, USD rent, region, lineage tags' },
          { layer: 'gold', detail: 'Business displayStatus + mart fields for ops UI / Power BI' },
        ],
      },
    });
  },
  async search(q) {
    const wh = await loadWarehouse();
    const needle = String(q || '').toLowerCase();
    const hits = wh.gold.activeLeases
      .filter(
        (r) =>
          !needle ||
          String(r.registration).toLowerCase().includes(needle) ||
          String(r.lessee).toLowerCase().includes(needle)
      )
      .slice(0, 20)
      .map((r) => ({
        registration: r.registration,
        lessee: r.lessee,
        aircraftType: r.aircraftType,
        status: r.status,
        displayStatus: r.displayStatus,
      }));
    return withMeta({ data: hits });
  },
  async revenueTrend() {
    const wh = await loadWarehouse();
    return withMeta({ data: wh.gold.monthlyRevenue.slice(-12) });
  },
  async lesseeExposure() {
    const wh = await loadWarehouse();
    return withMeta({ data: wh.gold.lesseeExposure });
  },
  async pipeline() {
    const wh = await loadWarehouse();
    return withMeta({
      ...wh.pipeline,
      architecture: 'ADF → ADLS medallion → dbt → Synapse → consumers',
    });
  },
  async lineage() {
    const wh = await loadWarehouse();
    return withMeta(wh.lineage);
  },
  async quality() {
    const wh = await loadWarehouse();
    return withMeta(wh.quality);
  },
  async layer(name) {
    const wh = await loadWarehouse();
    if (name === 'bronze') {
      return withMeta({
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
      });
    }
    if (name === 'silver') {
      return withMeta({
        layer: 'silver',
        description: 'Conformed leases — shared keys, status, currency, lineage',
        schema: Object.keys(wh.silver[0] || {}),
        sample: wh.silver.slice(0, 8),
        count: wh.silver.length,
      });
    }
    if (name === 'gold') {
      return withMeta({
        layer: 'gold',
        description: 'Business marts consumed by React and Power BI',
        marts: Object.keys(wh.gold),
        kpis: wh.gold.kpis,
        sampleLeases: wh.gold.activeLeases.slice(0, 5),
      });
    }
    throw new Error('Unknown layer. Use bronze|silver|gold');
  },
};
