const sql = require('mssql');

let pool = null;

function isConfigured() {
  return Boolean(
    process.env.SYNAPSE_ENDPOINT &&
      process.env.AZURE_TENANT_ID &&
      process.env.AZURE_CLIENT_ID &&
      process.env.AZURE_CLIENT_SECRET &&
      process.env.SYNAPSE_DATABASE
  );
}

async function getPool() {
  if (!isConfigured()) return null;
  if (pool) {
    try {
      await pool.request().query('SELECT 1 AS ok');
      return pool;
    } catch {
      pool = null;
    }
  }

  pool = await sql.connect({
    server: process.env.SYNAPSE_ENDPOINT,
    authentication: {
      type: 'azure-active-directory-client-secret',
      options: {
        tenantId: process.env.AZURE_TENANT_ID,
        clientId: process.env.AZURE_CLIENT_ID,
        clientSecret: process.env.AZURE_CLIENT_SECRET,
      },
    },
    options: {
      database: process.env.SYNAPSE_DATABASE,
      encrypt: true,
      trustServerCertificate: false,
      connectTimeout: 30000,
      requestTimeout: 30000,
    },
  });
  return pool;
}

async function query(text) {
  const p = await getPool();
  if (!p) return null;
  const result = await p.request().query(text);
  return result.recordset;
}

module.exports = { getPool, query, isConfigured };
