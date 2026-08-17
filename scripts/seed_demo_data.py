#!/usr/bin/env python3
"""
AviLease DW demo seed — bronze (raw per source) → silver (conformed) → gold (marts).
Outputs JSON for the local Express API and optional Parquet when pyarrow is installed.
"""
from __future__ import annotations

import json
import random
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

try:
    import pandas as pd
except ImportError:
    pd = None

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "seed_output"
SERVER_DATA = ROOT / "server" / "data"

FLEET = [
    ("A320neo", 44, 480_000, 540_000),
    ("B737 MAX", 34, 460_000, 510_000),
    ("A330", 22, 820_000, 950_000),
    ("B777", 18, 980_000, 1_200_000),
    ("A350", 12, 1_100_000, 1_400_000),
    ("Other", 12, 300_000, 450_000),
]

LESSEES = [
    ("Ryanair", "Europe"),
    ("easyJet", "Europe"),
    ("Lufthansa", "Europe"),
    ("Air France", "Europe"),
    ("Wizz Air", "Europe"),
    ("Vueling", "Europe"),
    ("Air Malta", "Europe"),
    ("Aegean", "Europe"),
    ("LOT Polish", "Europe"),
    ("Aer Lingus", "Europe"),
    ("Emirates", "Middle East"),
    ("Qatar Airways", "Middle East"),
    ("Etihad", "Middle East"),
    ("Turkish Airlines", "Middle East"),
    ("IndiGo", "Asia Pac"),
    ("Air India", "Asia Pac"),
    ("Thai Airways", "Asia Pac"),
    ("ANA", "Asia Pac"),
    ("LATAM", "Americas"),
    ("Avianca", "Americas"),
    ("Air Canada", "Americas"),
    ("Delta", "Americas"),
    ("Sky Airline", "Americas"),
    ("Ethiopian Airlines", "Africa"),
    ("Kenya Airways", "Africa"),
]

REGION_TARGETS = {"Europe": 55, "Asia Pac": 35, "Middle East": 25, "Americas": 20, "Africa": 7}
STATUS_TARGETS = {"On Lease": 128, "In Transition": 11, "Off Lease": 3}

REG_PREFIX = {
    "Europe": "EI",
    "Asia Pac": "9V",
    "Middle East": "A6",
    "Americas": "N",
    "Africa": "ZS",
}


def iso(d: date | None) -> str | None:
    return d.isoformat() if d else None


def build_portfolio(rng: random.Random) -> list[dict]:
    today = date.today()
    slots: list[tuple[str, int, int]] = []
    for ac_type, count, lo, hi in FLEET:
        for _ in range(count):
            slots.append((ac_type, lo, hi))

    statuses: list[str] = []
    for status, n in STATUS_TARGETS.items():
        statuses.extend([status] * n)
    rng.shuffle(statuses)

    region_pool: list[str] = []
    for region, n in REGION_TARGETS.items():
        region_pool.extend([region] * n)
    rng.shuffle(region_pool)

    expiring_idx = set(rng.sample(range(128), 8))  # among On Lease later
    on_lease_i = 0
    rows = []

    for i, ((ac_type, lo, hi), status, region) in enumerate(zip(slots, statuses, region_pool)):
        lessee_opts = [x for x in LESSEES if x[1] == region] or LESSEES
        lessee, _ = rng.choice(lessee_opts)
        prefix = REG_PREFIX[region]
        suffix = f"{1000 + i}"
        registration = f"{prefix}-{suffix[-3:]}" if prefix != "N" else f"N{suffix}"

        lease_start = today - timedelta(days=rng.randint(180, 2000))
        lease_end = None
        monthly_rent = None

        if status == "On Lease":
            if on_lease_i in expiring_idx:
                lease_end = today + timedelta(days=rng.randint(30, 170))
            else:
                lease_end = today + timedelta(days=rng.randint(200, 8 * 365))
            monthly_rent = round(rng.uniform(lo, hi), 2)
            on_lease_i += 1
        elif status == "In Transition":
            lease_start = today - timedelta(days=rng.randint(30, 120))
            monthly_rent = None
        else:
            lease_start = today - timedelta(days=rng.randint(400, 1500))
            lease_end = today - timedelta(days=rng.randint(10, 90))
            monthly_rent = None

        # Bronze-native messy fields differ by source
        lw_status = {
            "On Lease": "ACTIVE",
            "In Transition": "TRANSITION",
            "Off Lease": "RETURNED",
        }[status]
        ax_stage = {
            "On Lease": None,
            "In Transition": rng.choice(["Redelivery", "Maintenance", "Ferry"]),
            "Off Lease": "Storage",
        }[status]

        rows.append(
            {
                "registration": registration,
                "aircraftType": ac_type,
                "lessee": lessee,
                "region": region,
                "leaseStartDate": lease_start,
                "leaseEndDate": lease_end,
                "monthlyRent": monthly_rent,
                "status": status,
                "lw_status_raw": lw_status,
                "ax_stage": ax_stage,
                "cf_currency": "USD" if monthly_rent else None,
                "cf_rent_cents": int(monthly_rent * 100) if monthly_rent else None,
            }
        )
    return rows


def to_bronze(rows: list[dict], batch_id: str, ingested_at: str) -> dict:
    leaseworks = []
    core_finance = []
    aerlytix = []

    for r in rows:
        leaseworks.append(
            {
                "Asset_Reg__c": r["registration"],
                "Aircraft_Type__c": r["aircraftType"],
                "Lessee_Name__c": r["lessee"],
                "Region__c": r["region"],
                "Lease_Start__c": iso(r["leaseStartDate"]),
                "Lease_End__c": iso(r["leaseEndDate"]),
                "Status_Code__c": r["lw_status_raw"],
                "_batch_id": batch_id,
                "_ingested_at": ingested_at,
            }
        )
        if r["status"] == "On Lease":
            core_finance.append(
                {
                    "asset_reg": r["registration"],
                    "airline": r["lessee"],
                    "rent_amount_cents": r["cf_rent_cents"],
                    "currency_code": r["cf_currency"],
                    "period_start": iso(r["leaseStartDate"]),
                    "period_end": iso(r["leaseEndDate"]),
                    "gl_book": "IFRS16",
                    "_batch_id": batch_id,
                    "_ingested_at": ingested_at,
                }
            )
        if r["status"] in ("In Transition", "Off Lease"):
            aerlytix.append(
                {
                    "tail_number": r["registration"],
                    "ac_family": r["aircraftType"],
                    "operator": r["lessee"] if r["status"] == "Off Lease" else None,
                    "geo_region": r["region"],
                    "transition_stage": r["ax_stage"],
                    "event_date": iso(r["leaseEndDate"] or r["leaseStartDate"]),
                    "lifecycle_flag": "OFF" if r["status"] == "Off Lease" else "TX",
                    "_batch_id": batch_id,
                    "_ingested_at": ingested_at,
                }
            )

    return {
        "leaseworks": leaseworks,
        "core_finance": core_finance,
        "aerlytix": aerlytix,
    }


def to_silver(rows: list[dict], transformed_at: str) -> list[dict]:
    silver = []
    for r in rows:
        sources = ["Leaseworks"]
        if r["status"] == "On Lease":
            sources.append("Core Financial")
        if r["status"] in ("In Transition", "Off Lease"):
            sources.append("Aerlytix")

        if r["status"] == "In Transition":
            display = "Transition"
            source_tag = "Aerlytix"
        elif r["status"] == "Off Lease":
            display = "Off lease"
            source_tag = "Aerlytix"
        elif r["leaseEndDate"] and (r["leaseEndDate"] - date.today()).days <= 180:
            display = "Expiring soon"
            source_tag = "LW + Core"
        else:
            display = "Current"
            source_tag = "LW + Core"

        silver.append(
            {
                "registration": r["registration"],
                "aircraftType": r["aircraftType"],
                "lessee": r["lessee"],
                "region": r["region"],
                "leaseStartDate": iso(r["leaseStartDate"]),
                "leaseEndDate": iso(r["leaseEndDate"]),
                "monthlyRent": r["monthlyRent"],
                "status": r["status"],
                "displayStatus": display,
                "sourceSystems": sources,
                "sourceSystem": source_tag,
                "transformedAt": transformed_at,
            }
        )
    return silver


def to_gold(silver: list[dict]) -> dict:
    total = len(silver)
    on_lease = [r for r in silver if r["status"] == "On Lease"]
    utilisation = round(len(on_lease) / total * 100, 1)
    ytd = round(sum((r["monthlyRent"] or 0) for r in on_lease) * 12 / 1_000_000, 1)

    remaining = []
    today = date.today()
    for r in on_lease:
        if r["leaseEndDate"]:
            end = date.fromisoformat(r["leaseEndDate"])
            remaining.append((end - today).days / 365.25)
    avg_remaining = round(sum(remaining) / len(remaining), 1) if remaining else 0

    by_type: dict[str, dict] = {}
    for r in silver:
        t = r["aircraftType"]
        by_type.setdefault(t, {"aircraftType": t, "count": 0, "totalRevenue": 0.0})
        by_type[t]["count"] += 1
        if r["status"] == "On Lease" and r["monthlyRent"]:
            by_type[t]["totalRevenue"] += r["monthlyRent"] * 12 / 1_000_000
    fleet_by_type = sorted(
        [
            {
                "aircraftType": v["aircraftType"],
                "count": v["count"],
                "totalRevenue": round(v["totalRevenue"], 1),
            }
            for v in by_type.values()
        ],
        key=lambda x: -x["count"],
    )

    status_counts: dict[str, int] = {}
    for r in silver:
        status_counts[r["status"]] = status_counts.get(r["status"], 0) + 1
    lease_status = [
        {
            "status": s,
            "count": c,
            "percentage": round(c / total * 100, 1),
        }
        for s, c in status_counts.items()
    ]

    lessee_map: dict[str, dict] = {}
    for r in on_lease:
        key = r["lessee"]
        lessee_map.setdefault(key, {"lessee": key, "region": r["region"], "aircraft": 0, "annualRevenue": 0.0})
        lessee_map[key]["aircraft"] += 1
        lessee_map[key]["annualRevenue"] += (r["monthlyRent"] or 0) * 12 / 1_000_000
    lessee_exposure = sorted(
        [
            {
                "lessee": v["lessee"],
                "region": v["region"],
                "aircraft": v["aircraft"],
                "annualRevenue": round(v["annualRevenue"], 1),
            }
            for v in lessee_map.values()
        ],
        key=lambda x: -x["annualRevenue"],
    )[:15]

    # 24 months revenue ~280M → ~320M annualised, slight beat vs budget
    monthly = []
    base = 23.0  # ~276M annualised
    for i in range(24):
        month_date = (today.replace(day=1) - timedelta(days=30 * (23 - i)))
        month = month_date.strftime("%Y-%m")
        growth = i * 0.12
        noise = random.uniform(-0.4, 0.5)
        revenue = round(base + growth + noise, 2)
        if i in (7, 18):
            budget = round(revenue + 0.6, 2)  # miss budget
        else:
            budget = round(revenue * random.uniform(0.95, 0.97), 2)
        monthly.append({"month": month, "revenue": revenue, "budget": budget})

    return {
        "kpis": {
            "totalAircraft": total,
            "fleetUtilisation": utilisation,
            "ytdRevenue": ytd,
            "avgLeaseRemaining": avg_remaining,
            "deltas": {
                "totalAircraft": "+4 YoY",
                "fleetUtilisation": "+1.2 pts",
                "ytdRevenue": "+6.4%",
                "avgLeaseRemaining": "stable",
            },
        },
        "fleetByType": fleet_by_type,
        "leaseStatus": lease_status,
        "activeLeases": sorted(
            silver,
            key=lambda r: r["leaseEndDate"] or "9999-12-31",
        ),
        "monthlyRevenue": monthly,
        "lesseeExposure": lessee_exposure,
    }


def quality(bronze: dict, silver: list[dict], gold: dict) -> dict:
    return {
        "checks": [
            {
                "id": "bronze_lw_count",
                "name": "Leaseworks bronze rows",
                "expected": 142,
                "actual": len(bronze["leaseworks"]),
                "passed": len(bronze["leaseworks"]) == 142,
            },
            {
                "id": "cf_on_lease_only",
                "name": "Core Finance only On Lease",
                "expected": 128,
                "actual": len(bronze["core_finance"]),
                "passed": len(bronze["core_finance"]) == 128,
            },
            {
                "id": "ax_transition_off",
                "name": "AerLytix transition + off lease",
                "expected": 14,
                "actual": len(bronze["aerlytix"]),
                "passed": len(bronze["aerlytix"]) == 14,
            },
            {
                "id": "silver_conformed",
                "name": "Silver conformed leases",
                "expected": 142,
                "actual": len(silver),
                "passed": len(silver) == 142,
            },
            {
                "id": "gold_utilisation",
                "name": "Gold utilisation ~90%",
                "expected": 90.1,
                "actual": gold["kpis"]["fleetUtilisation"],
                "passed": abs(gold["kpis"]["fleetUtilisation"] - 90.1) < 0.5,
            },
            {
                "id": "unique_registration",
                "name": "Unique registrations in silver",
                "expected": 142,
                "actual": len({r["registration"] for r in silver}),
                "passed": len({r["registration"] for r in silver}) == 142,
            },
        ],
        "layerCounts": {
            "bronze": {
                "leaseworks": len(bronze["leaseworks"]),
                "coreFinance": len(bronze["core_finance"]),
                "aerlytix": len(bronze["aerlytix"]),
            },
            "silver": len(silver),
            "gold": {
                "leases": len(gold["activeLeases"]),
                "monthlyRevenue": len(gold["monthlyRevenue"]),
            },
        },
    }


def write_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2), encoding="utf-8")


def try_parquet(subdir: Path, name: str, rows: list[dict]) -> None:
    if not pd or not rows:
        return
    try:
        import pyarrow  # noqa: F401
    except ImportError:
        return
    subdir.mkdir(parents=True, exist_ok=True)
    pd.DataFrame(rows).to_parquet(subdir / f"{name}.parquet", index=False)


def main() -> None:
    rng = random.Random(42)
    random.seed(42)
    batch_id = "ADF-DEMO-20260724-001"
    ingested_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    transformed_at = ingested_at

    portfolio = build_portfolio(rng)
    bronze = to_bronze(portfolio, batch_id, ingested_at)
    silver = to_silver(portfolio, transformed_at)
    gold = to_gold(silver)
    dq = quality(bronze, silver, gold)

    # Medallion on disk
    write_json(OUT / "bronze" / "leaseworks" / "assets.json", bronze["leaseworks"])
    write_json(OUT / "bronze" / "core_finance" / "rent_receipts.json", bronze["core_finance"])
    write_json(OUT / "bronze" / "aerlytix" / "transitions.json", bronze["aerlytix"])
    write_json(OUT / "silver" / "leases.json", silver)
    write_json(OUT / "gold" / "marts.json", gold)
    write_json(OUT / "meta" / "quality.json", dq)

    try_parquet(OUT / "bronze" / "leaseworks", "assets", bronze["leaseworks"])
    try_parquet(OUT / "bronze" / "core_finance", "rent_receipts", bronze["core_finance"])
    try_parquet(OUT / "bronze" / "aerlytix", "transitions", bronze["aerlytix"])
    try_parquet(OUT / "silver", "leases", silver)
    try_parquet(OUT / "gold" / "leases", "leases", silver)
    try_parquet(OUT / "gold" / "monthly_revenue", "monthly_revenue", gold["monthlyRevenue"])

    # API-ready bundle
    api_payload = {
        "generatedAt": ingested_at,
        "batchId": batch_id,
        "mode": "local_medallion",
        "bronze": bronze,
        "silver": silver,
        "gold": gold,
        "quality": dq,
        "lineage": {
            "edges": [
                {"from": "Leaseworks", "to": "bronze.leaseworks", "via": "ADF"},
                {"from": "Core Financial (SunSystems)", "to": "bronze.core_finance", "via": "ADF"},
                {"from": "Aerlytix", "to": "bronze.aerlytix", "via": "ADF"},
                {"from": "bronze.*", "to": "silver.leases", "via": "dbt staging"},
                {"from": "silver.leases", "to": "gold.marts", "via": "dbt marts"},
                {"from": "gold.marts", "to": "Synapse vw_*", "via": "OPENROWSET"},
                {"from": "Synapse vw_*", "to": "React Ops UI", "via": "Express API"},
                {"from": "Synapse vw_*", "to": "Power BI", "via": "DirectQuery / Import"},
            ],
            "statusMap": [
                {"source": "Leaseworks", "raw": "ACTIVE", "conformed": "On Lease"},
                {"source": "Leaseworks", "raw": "TRANSITION", "conformed": "In Transition"},
                {"source": "Leaseworks", "raw": "RETURNED", "conformed": "Off Lease"},
                {"source": "Aerlytix", "raw": "TX", "conformed": "In Transition"},
                {"source": "Aerlytix", "raw": "OFF", "conformed": "Off Lease"},
                {"source": "Core Financial", "raw": "rent_amount_cents", "conformed": "monthlyRent USD"},
            ],
        },
        "pipeline": {
            "adfStatus": "Succeeded",
            "lastSync": ingested_at,
            "batchId": batch_id,
            "steps": [
                {"name": "Ingest Leaseworks", "status": "Succeeded", "rows": 142},
                {"name": "Ingest Core Financial", "status": "Succeeded", "rows": 128},
                {"name": "Ingest Aerlytix", "status": "Succeeded", "rows": 14},
                {"name": "dbt silver", "status": "Succeeded", "rows": 142},
                {"name": "dbt gold", "status": "Succeeded", "rows": 142},
            ],
        },
    }
    write_json(SERVER_DATA / "warehouse.json", api_payload)
    write_json(OUT / "warehouse.json", api_payload)

    print(f"Seed complete -> {OUT}")
    print(f"API data     -> {SERVER_DATA / 'warehouse.json'}")
    print(f"Gold KPIs    -> {gold['kpis']}")


if __name__ == "__main__":
    main()
