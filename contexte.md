# AviLease Data Warehouse — Full Project Context for Cursor

> Paste this file into Cursor as project context before starting any work.
> This document contains everything needed to build the full application.

---

## 1. Project Overview

**Client:** AviLease — an aviation aircraft leasing company based in Dublin, Ireland.

**Delivered by:** Prodigy — an Ireland-based Salesforce and Azure consultancy specialising in aviation leasing technology (weareprodigy.com).

**Project:** Pre-sales demo application showing a unified data warehouse across AviLease's three core systems, with live data from Azure Synapse, management dashboards in the browser, and an AI-powered fleet analyst.

**Purpose of this build:** A compelling, live technical demo for a meeting with:
- **Ciara Flynn** — Head of Leasing Operations
- **Damian Duffy** — Systems implementation lead (IT background)

The demo must show real data from Azure Synapse, not dummy JSON. It must feel like a production-grade aviation operations tool.

---

## 2. Business Context

### The problem AviLease has today
AviLease runs three separate systems that do not share data:
- **Leaseworks** — lease management, CRM, asset management (Salesforce-native)
- **Core Finance** — financial data, rent receipts, P&L (external system, NOT Salesforce)
- **AerLytix** — analytics and aircraft transition management (Salesforce-native)

Management reporting today requires manual exports from each system, stitched together in Excel or PowerPoint. This is slow, error-prone, and produces stale data.

### What we are building for them
A modern data warehouse that:
1. Ingests data from all three systems automatically via Azure Data Factory
2. Stores it in Azure Data Lake Gen2 (bronze/silver/gold zones)
3. Exposes it via Azure Synapse Serverless SQL as unified views
4. Surfaces it in a real-time browser dashboard with Power BI-quality charts
5. Adds an AI analyst layer (Claude) that answers questions about the portfolio

### Why Azure (not Salesforce Data Cloud)
Core Finance sits outside Salesforce entirely. Salesforce Data Cloud only works natively with Salesforce data. Azure Data Factory can connect to any source system — SQL Server, Oracle, REST APIs, flat files. This makes the Azure stack the correct long-term architecture for AviLease.

---

## 3. Architecture

### High Level Design (HLD)

```
Source Systems
├── Leaseworks        (Salesforce REST API / SOQL)
├── AerLytix          (Salesforce REST API / SOQL)
└── Core Finance      (SQL / REST API — TBD with client)
        ↓
Azure Data Factory    (ingestion pipelines, scheduled triggers)
        ↓
Azure Data Lake Gen2  (raw storage — Parquet files)
├── Bronze zone       (raw, untransformed)
├── Silver zone       (cleaned, deduplicated, standardised)
└── Gold zone         (reporting-ready aggregates)
        ↓
dbt                   (SQL transformation models)
        ↓
Azure Synapse Serverless SQL  (query engine over gold zone)
        ↓
Express API layer     (thin backend — auth + SQL proxy)
        ↓
React Dashboard       (browser UI — charts, table, AI analyst)
```

### Low Level Design (LLD)

#### Synapse SQL Views (gold zone)
| View | Description | Source |
|---|---|---|
| `vw_fleet_kpis` | Total aircraft, utilisation, YTD revenue, avg lease remaining | Leaseworks + Core Finance |
| `vw_fleet_by_type` | Aircraft count and revenue by type | Leaseworks + Core Finance |
| `vw_lease_status` | On lease / transition / off lease counts | Leaseworks |
| `vw_active_leases` | Full lease register with lessee, dates, rent, status | Leaseworks + Core Finance + AerLytix |
| `vw_monthly_revenue` | Last 24 months revenue vs budget | Core Finance |
| `vw_lessee_exposure` | Revenue concentration by airline and region | Leaseworks + Core Finance |

#### Express API Routes
| Route | Description |
|---|---|
| `GET /api/kpis` | KPI headline figures |
| `GET /api/fleet-by-type` | Fleet breakdown by aircraft type |
| `GET /api/lease-status` | Lease status distribution |
| `GET /api/active-leases` | Paginated lease register |
| `GET /api/revenue-trend` | 12-month revenue trend |
| `POST /api/ai-insight` | AI analyst — proxies to Claude API |

---

## 4. Data Model

### leases.parquet (142 rows — seed data)
```
registration       STRING     e.g. EI-AVL, 9H-ALI, A6-AVC
aircraftType       STRING     A320neo | B737 MAX | A330 | B777 | A350 | Other
lessee             STRING     Real airline names
region             STRING     Europe | Asia Pac | Middle East | Americas | Africa
leaseStartDate     DATE
leaseEndDate       DATE       NULL if in transition or off lease
monthlyRent        DECIMAL    USD — see realistic ranges below
status             STRING     On Lease | In Transition | Off Lease
sourceSystem       STRING     Leaseworks | Core Finance | AerLytix
```

### monthly_revenue.parquet (24 rows)
```
month              STRING     YYYY-MM format
revenue            DECIMAL    USD millions
budget             DECIMAL    USD millions
```

### Realistic monthly rent ranges by aircraft type
| Type | Min | Max |
|---|---|---|
| A320neo | $480,000 | $540,000 |
| B737 MAX | $460,000 | $510,000 |
| A330 | $820,000 | $950,000 |
| B777 | $980,000 | $1,200,000 |
| A350 | $1,100,000 | $1,400,000 |
| Other | $300,000 | $450,000 |

### Fleet composition (seed to these targets)
| Type | Count |
|---|---|
| A320neo | 38 |
| B737 MAX | 29 |
| A330 | 19 |
| B777 | 15 |
| A350 | 10 |
| Other | 11 |
| **Total** | **142** |

### Lease status targets
- On Lease: 128 aircraft (90%)
- In Transition: 11 aircraft (8%)
- Off Lease: 3 aircraft (2%)

---

## 5. Technology Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express
- **Database driver:** `mssql` npm package (Azure Synapse Serverless SQL via TDS)
- **Auth to Synapse:** Azure AD service principal (client credentials flow)
- **AI:** Anthropic SDK (`@anthropic-ai/sdk`) — streaming responses
- **CORS:** enabled for localhost:3000 and production domain

### Frontend
- **Framework:** React 18
- **Styling:** Tailwind CSS
- **Charts:** Recharts (BarChart, PieChart, AreaChart, LineChart)
- **HTTP:** native fetch()
- **No additional component libraries**

### Data / Azure
- **Ingestion:** Azure Data Factory
- **Storage:** Azure Data Lake Storage Gen2
- **File format:** Parquet
- **Query engine:** Azure Synapse Serverless SQL
- **Transformation:** dbt (models in /dbt/models/)
- **Monitoring:** Azure Monitor

### Dev tooling
- **Monorepo runner:** concurrently
- **Seed script:** Python 3.9+ with pandas + pyarrow
- **Environment:** .env file (never committed)

---

## 6. Environment Variables

```env
# Azure AD — service principal credentials
AZURE_TENANT_ID=
AZURE_CLIENT_ID=
AZURE_CLIENT_SECRET=

# Azure Synapse Serverless SQL
SYNAPSE_ENDPOINT=         # e.g. yourworkspace-ondemand.sql.azuresynapse.net
SYNAPSE_DATABASE=         # your serverless database name (usually "built-in" or custom)

# Azure Data Lake
STORAGE_ACCOUNT=          # ADLS Gen2 account name
STORAGE_CONTAINER=        # container name (e.g. avilease-demo)

# Anthropic
ANTHROPIC_API_KEY=

# App
PORT=3001
```

---

## 7. Folder Structure

```
avilease-dw-demo/
├── server/
│   ├── index.js              # Express app — all API routes
│   ├── db.js                 # Synapse connection pool (mssql)
│   └── ai.js                 # Anthropic streaming handler
├── client/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.jsx            # Root — layout shell
│       ├── index.js
│       └── components/
│           ├── TopBar.jsx
│           ├── Sidebar.jsx
│           ├── KPIRow.jsx
│           ├── ChartsRow.jsx
│           ├── FleetTable.jsx
│           └── AIAnalyst.jsx
├── synapse/
│   └── create_views.sql      # All Synapse view definitions
├── dbt/
│   ├── dbt_project.yml
│   └── models/
│       ├── staging/
│       │   ├── stg_leaseworks_assets.sql
│       │   ├── stg_core_finance_revenue.sql
│       │   └── stg_aerlytix_transitions.sql
│       └── marts/
│           ├── fleet_summary.sql
│           ├── lease_performance.sql
│           └── lessee_exposure.sql
├── scripts/
│   └── seed_demo_data.py     # Generate + write Parquet files
├── .env.example
├── .gitignore                # must include .env
├── package.json              # root — runs both server and client
└── README.md
```

---

## 8. Server Code Specification

### server/db.js — Synapse connection

```javascript
// Use mssql with Azure AD service principal auth
// Config:
{
  server: process.env.SYNAPSE_ENDPOINT,
  authentication: {
    type: 'azure-active-directory-client-secret',
    options: {
      tenant: process.env.AZURE_TENANT_ID,
      clientId: process.env.AZURE_CLIENT_ID,
      clientSecret: process.env.AZURE_CLIENT_SECRET,
    }
  },
  options: {
    database: process.env.SYNAPSE_DATABASE,
    encrypt: true,
    trustServerCertificate: false,
    connectTimeout: 30000,
    requestTimeout: 30000,
  }
}
// Export a getPool() function that creates and caches the connection pool
// Reconnect automatically on disconnect
```

### server/index.js — API routes

```javascript
// GET /api/kpis
// Query: SELECT * FROM vw_fleet_kpis
// Return: { totalAircraft, fleetUtilisation, ytdRevenue, avgLeaseRemaining }

// GET /api/fleet-by-type
// Query: SELECT aircraftType, count, totalRevenue FROM vw_fleet_by_type ORDER BY count DESC
// Return: array of { aircraftType, count, totalRevenue }

// GET /api/lease-status
// Query: SELECT status, count, percentage FROM vw_lease_status
// Return: array of { status, count, percentage }

// GET /api/active-leases
// Query: SELECT TOP 20 * FROM vw_active_leases ORDER BY leaseEndDate ASC
// Return: array of lease objects

// GET /api/revenue-trend
// Query: SELECT TOP 12 month, revenue, budget FROM vw_monthly_revenue ORDER BY month DESC
// Return: array of { month, revenue, budget } — reverse before sending so oldest first

// POST /api/ai-insight
// Body: { question: string, portfolioContext: object }
// Calls Anthropic API with streaming
// System prompt: position Claude as "AviLease Analyst" 
//   with access to unified Leaseworks + Core Finance + AerLytix data
//   portfolioContext contains current KPI values from the dashboard
// Stream the response back to the client using SSE or chunked transfer

// Error handling on all routes:
// If Synapse unreachable: return { error: "Data warehouse unavailable", fallback: true }
// Log errors server-side with timestamp
```

### server/ai.js — Anthropic streaming

```javascript
// Use @anthropic-ai/sdk
// Model: claude-sonnet-4-6
// Max tokens: 1024
// System prompt template:
//
// "You are AviLease Analyst, an AI embedded in AviLease's data warehouse dashboard.
//  You have access to unified data from three systems:
//  - Leaseworks (lease and asset management, Salesforce-native)
//  - Core Finance (financial data, external system)
//  - AerLytix (analytics and transitions, Salesforce-native)
//
//  Current portfolio snapshot: {portfolioContext}
//
//  Respond in 3-5 sentences. Be specific — use numbers from the portfolio.
//  Format key figures in **bold**. Sound like a sharp aviation finance analyst.
//  Never say you are an AI. Never make up data not in the portfolio context."
//
// Stream tokens back to the Express response using res.write()
// End with res.end()
```

---

## 9. Synapse SQL Views

### /synapse/create_views.sql

Replace `{STORAGE_ACCOUNT}` and `{CONTAINER}` with actual values before running.

```sql
-- KPI summary view
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

-- Fleet by type
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

-- Lease status
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

-- Active leases register
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

-- Monthly revenue trend
CREATE OR ALTER VIEW vw_monthly_revenue AS
SELECT
  month,
  revenue,
  budget
FROM OPENROWSET(
  BULK 'https://{STORAGE_ACCOUNT}.dfs.core.windows.net/{CONTAINER}/gold/monthly_revenue/*.parquet',
  FORMAT = 'PARQUET'
) AS rev;
```

---

## 10. Seed Data Script

### /scripts/seed_demo_data.py

```python
# Requirements: pip install pandas pyarrow faker
# Run: python scripts/seed_demo_data.py
# Output: ./seed_output/gold/leases/leases.parquet
#         ./seed_output/gold/monthly_revenue/monthly_revenue.parquet
#
# After running, upload the seed_output/ folder contents to your ADLS Gen2 
# container under the gold/ prefix.
#
# The script should:
# 1. Generate 142 lease records matching the fleet composition targets:
#    A320neo=38, B737MAX=29, A330=19, B777=15, A350=10, Other=11
# 2. Use real airline names as lessees:
#    Ryanair, easyJet, Lufthansa, Air France, Emirates, Qatar Airways,
#    Etihad, Turkish Airlines, IndiGo, Air India, Thai Airways, ANA,
#    LATAM, Avianca, Air Canada, Delta (wet lease subsidiary), Sky Airline,
#    Wizz Air, Vueling, Air Malta, Aegean, LOT Polish, Aer Lingus
# 3. Distribute lessees across regions:
#    Europe: 55 aircraft, Asia Pac: 35, Middle East: 25, Americas: 20, Africa: 7
# 4. Lease status distribution: 128 On Lease, 11 In Transition, 3 Off Lease
# 5. Lease end dates: range from 6 months to 8 years from today
#    Ensure ~8 leases expire within 6 months (for demo urgency)
# 6. Source system assignment:
#    Leaseworks: all records (it's the master)
#    Core Finance: all On Lease records (financial data)
#    AerLytix: all In Transition + Off Lease records
#    Display as combined string e.g. "LW + CF" or "AerLytix"
# 7. Generate 24 months of revenue data with realistic growth:
#    Start at ~$280M annualised, grow to ~$320M
#    Budget should be 3-5% below actual for most months (slightly outperforming)
#    One or two months where actual dipped below budget (realism)
```

---

## 11. Frontend Component Specifications

### App.jsx — Shell
Dark navy background `#0b1120`. Three-column layout: sidebar (200px fixed) + main content (flex 1). TopBar fixed at top (52px height). Main area scrolls independently.

### TopBar.jsx
- Left: logo mark (square with "AL" initials, gradient blue) + "AviLease Analytics" wordmark
- Centre: nav tabs — Fleet Overview | Financial | Lessees | Transitions
- Right: green "● Live" badge + "Refreshed X min ago" timestamp + auto-refresh every 5 minutes

### Sidebar.jsx
Sections:
1. **Data sources** — Leaseworks (active dot), Core Finance, AerLytix, All sources
2. **Reports** — Fleet utilisation, Revenue by type, Lease expirations, Maintenance costs
3. **Pipeline** — ADF status, Last sync log

Sidebar items are clickable — clicking a Report item pre-fills the AI Analyst question.

### KPIRow.jsx
Four cards in a grid. Each card:
- Label (uppercase, small, muted)
- Value (large, white, bold, letter-spaced)
- Delta line (colour coded: green=up, red=down, grey=stable)
- Loading skeleton while fetching (grey animated pulse)

KPIs: Total Aircraft | Fleet Utilisation | YTD Revenue (USD millions) | Avg Lease Remaining (years)

### ChartsRow.jsx
Two panels side by side (ratio 1.6:1):

**Left panel — Fleet by type (horizontal bar chart)**
- Recharts BarChart, horizontal layout
- Each bar shows aircraft count, labels show revenue
- Blue colour ramp (darkest for largest type)
- Source tag: "Leaseworks + Core Finance"

**Right panel — two stacked mini charts**
- Top: Lease status donut (Recharts PieChart)
  - On Lease (blue), In Transition (amber), Off Lease (red)
  - Centre label showing total aircraft count
  - Legend to the right
- Bottom: Monthly revenue sparkline (Recharts AreaChart)
  - 12 months, small height (~60px)
  - Revenue line (blue), budget line (dashed grey)
  - Month labels below

### FleetTable.jsx
Full-width panel. Columns:
| Column | Notes |
|---|---|
| Reg. | White, bold — aircraft registration |
| Type | Aircraft type string |
| Lessee | Airline name |
| Region | Geographic region |
| Lease end | Formatted date or "—" if in transition |
| Monthly rent | USD formatted e.g. "$520K" or "$1.1M" |
| Status | Pill badge — green=Current, amber=Expiring soon, blue=Transition, red=Off lease |
| Source | Small muted tag — "LW + CF", "AerLytix" etc. |

Row hover: subtle blue tint. Table header: uppercase, tracked, muted grey.

### AIAnalyst.jsx
Dark panel at the bottom with:
- Header: avatar (gradient blue/purple square with "AI"), "AviLease Analyst" title, subtitle "Ask anything about your fleet"
- Response area: minimum 80px height, shows placeholder text before first query
- Loading state: three animated dots while waiting for response
- Response renders with typewriter effect (stream tokens as they arrive via SSE)
- Four preset question chips:
  1. "Leases expiring soon"
  2. "Utilisation trend"
  3. "Best performing types"
  4. "Portfolio risks"
- Text input for custom questions
- Chips and input disabled while response is streaming

---

## 12. Key Design Decisions to Communicate in Demo

When presenting to Ciara and Damian, these are the points each part of the dashboard proves:

| Demo moment | What it proves |
|---|---|
| Source tags in fleet table (LW + CF, AerLytix) | Data unification — three systems, one view |
| Revenue KPI from Core Finance | External system connected — not just Salesforce |
| Expiring leases highlighted amber | Operational value — actionable, not just reporting |
| Live data badge | Production-grade, not a prototype |
| AI Analyst responding with real numbers | The warehouse enables intelligent tooling |
| Aircraft type names, real airline lessees | Prodigy understands aviation leasing |

---

## 13. Azure Setup Steps (for README)

```
1. Create service principal
   az ad sp create-for-rbac --name "avilease-demo-sp" --role "Reader"

2. Grant Synapse access
   In Synapse Studio → Manage → Access control
   Add service principal as "Synapse SQL Administrator" or "Reader"

3. Grant Data Lake access
   az role assignment create \
     --assignee <client-id> \
     --role "Storage Blob Data Reader" \
     --scope /subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.Storage/storageAccounts/<account>

4. Run seed script
   pip install pandas pyarrow
   python scripts/seed_demo_data.py

5. Upload Parquet files to ADLS Gen2
   az storage fs directory upload \
     -f <container> \
     --account-name <storage-account> \
     -s ./seed_output/gold \
     -d gold \
     --recursive

6. Run Synapse views
   Open Synapse Studio → Develop → New SQL script
   Paste create_views.sql (with storage account substituted)
   Run against serverless pool

7. Copy and fill .env
   cp .env.example .env
   # Fill all values

8. Start the app
   npm install
   npm run dev
```

---

## 14. Package.json (root)

```json
{
  "name": "avilease-dw-demo",
  "version": "1.0.0",
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "node server/index.js",
    "client": "cd client && npm start",
    "seed": "python scripts/seed_demo_data.py"
  },
  "dependencies": {
    "concurrently": "^8.0.0",
    "express": "^4.18.0",
    "mssql": "^10.0.0",
    "@anthropic-ai/sdk": "^0.20.0",
    "dotenv": "^16.0.0",
    "cors": "^2.8.5"
  }
}
```

Client package.json (in /client):
```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "recharts": "^2.8.0",
    "tailwindcss": "^3.4.0"
  }
}
```

---

## 15. Prodigy Branding (for any client-facing pages)

If adding a landing/intro page before the dashboard:

- **Primary colour:** Electric Crimson `#EC0051`
- **Secondary:** Saffron `#FFC600`
- **Dark background:** `#272727`
- **Font:** Nunito (Google Fonts)
- **Tone:** Direct, confident, aviation-native. No corporate jargon.
- **Tagline:** "Simplify, integrate, automate and drive on."

---

## 16. Gitignore

```
.env
node_modules/
client/node_modules/
client/build/
seed_output/
*.parquet
.DS_Store
```

---

*End of context document. This file contains everything Cursor needs to scaffold the full project without additional prompting.*