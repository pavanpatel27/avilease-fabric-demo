async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `${url} → ${res.status}`);
  }
  return res.json();
}

function qs(params = {}) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== '') sp.set(k, v);
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
}

export const api = {
  kpis: () => getJson('/api/kpis'),
  fleetByType: () => getJson('/api/fleet-by-type'),
  leaseStatus: () => getJson('/api/lease-status'),
  activeLeases: (params = {}) => getJson(`/api/active-leases${qs({ limit: 200, ...params })}`),
  revenueTrend: () => getJson('/api/revenue-trend'),
  lesseeExposure: () => getJson('/api/lessee-exposure'),
  pipeline: () => getJson('/api/pipeline'),
  lineage: () => getJson('/api/lineage'),
  quality: () => getJson('/api/quality'),
  layer: (name) => getJson(`/api/layers/${name}`),
  asset: (reg) => getJson(`/api/asset/${encodeURIComponent(reg)}`),
  search: (q) => getJson(`/api/search${qs({ q })}`),
  health: () => getJson('/api/health'),
};

export function formatRent(value) {
  if (value == null) return '—';
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1000) return `$${Math.round(value / 1000)}K`;
  return `$${value}`;
}

export function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
