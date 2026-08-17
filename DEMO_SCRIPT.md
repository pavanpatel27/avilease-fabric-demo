# Demo script — convince AviLease (enterprise architect)

App: http://localhost:3000 · starts on **Architecture**

## Sources

- Leaseworks (Salesforce)
- [Core Financial Systems](https://corefinancial.ie/) — Infor SunSystems
- [Aerlytix](https://www.aerlytix.com/) — aviation finance analytics

---

## 1. Architecture (10 min) — Damian + Ciara

Tabs:

1. **Recommendation** — medallion lakehouse; **Microsoft Fabric** hosts it in production
2. **Drivers / options** — why lakehouse; what does not fit
3. **Microsoft Fabric** — how we leverage this demo (OneLake, Data Factory, DirectLake)
4. **Platform & cost** — F8–F16 target; Synapse only as pilot
5. **Reference flows / ingest / SLAs / risks / roadmap**

**Close line:** We do not rebuild on Fabric — we host the same gold contract there.

---

## 2. Configure DW (5 min)

Azure Portal canvas: linked services, ADF pipeline, ADLS folders, Synapse `vw_*`.

---

## 3. Source Systems demo (4 min)

Open **Source Systems** — mock UIs for Leaseworks / Core Financial / Aerlytix with **ApexCharts**.
Then **Open Power BI Analytics**.

## 4. Power BI Analytics (5 min)

Pages: Executive · Fleet · Finance. Region slicer. Radial / donut / heatmap / area — all ApexCharts on gold APIs.
Line: Power BI Desktop would bind the same Synapse `vw_*`.

---

## Objection handling

| Concern | Answer |
|---|---|
| Why not Salesforce Data Cloud only? | Core Financial (SunSystems) is outside SF |
| Is it real-time? | Hot path for transitions; warm path for register/finance |
| Two reports / two truths? | One gold contract → Ops UI + Power BI |
| Big bang? | Phase 1 lakehouse first; CDC/events only where SLA needs it |
