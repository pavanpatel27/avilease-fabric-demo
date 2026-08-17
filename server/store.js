const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, 'data', 'warehouse.json');

let cache = null;
let cacheMtime = null;

function loadWarehouse() {
  if (!fs.existsSync(DATA_PATH)) {
    throw new Error(
      'Missing server/data/warehouse.json. Run: python scripts/seed_demo_data.py'
    );
  }
  const stat = fs.statSync(DATA_PATH);
  if (!cache || cacheMtime !== stat.mtimeMs) {
    cache = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    cacheMtime = stat.mtimeMs;
  }
  return cache;
}

function isSynapseConfigured() {
  return Boolean(
    process.env.SYNAPSE_ENDPOINT &&
      process.env.AZURE_TENANT_ID &&
      process.env.AZURE_CLIENT_ID &&
      process.env.AZURE_CLIENT_SECRET
  );
}

module.exports = {
  loadWarehouse,
  isSynapseConfigured,
  DATA_PATH,
};
