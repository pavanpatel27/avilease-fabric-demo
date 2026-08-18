# AviLease warehouse demo — Prodigy

Working demo for AviLease: one fleet view from **Leaseworks** (Salesforce), **Core Financial**, and **Aerlytix**, hosted on **Microsoft Fabric**.

For team review: clone, run locally, click through **How it works → Microsoft Fabric → Today’s systems → Sync → Fleet → Analytics**.

## Run it

You need **Node.js 18+** and **Python 3**.

```bash
git clone https://github.com/GlicTech/Avilease-DatawareHousedemo.git
cd Avilease-DatawareHousedemo
npm run install:all
python scripts/seed_demo_data.py
npm run dev
```

Open **http://localhost:3000**

- App: port 3000  
- API: port 3001  

If charts are empty, run the seed script again, then refresh.

## Host the demo (no laptop)

GitHub **cannot run the Node API**. It **can** host the screens as a static site on **GitHub Pages**. The fleet data is baked in from `server/data/warehouse.json`.

After you push to `main`:

1. Repo → **Settings** → **Pages**
2. Source: **GitHub Actions**
3. Wait for the **Deploy demo to GitHub Pages** workflow
4. Share:

`https://<your-github-user>.github.io/Avilease-DatawareHousedemo/`

Example if the repo stays under GlicTech:

`https://glictech.github.io/Avilease-DatawareHousedemo/`

Need a live API or custom domain later: Azure App Service or Render — GitHub Pages is the zero-ops demo link.

## What to look at

| Page | What to review |
|---|---|
| How it works | Management story: today vs after, how data joins, why numbers can be trusted |
| Microsoft Fabric | Workspace AviLease would open |
| Today’s systems | Leaseworks, Core Financial, Aerlytix as they are now |
| Sync data | Watch the three systems land in one place |
| Fleet | Live register — click an aircraft |
| Analytics | Same numbers as a Power BI pack |

## Notes

- No Salesforce Data Cloud — finance sits in Core Financial, so Fabric pulls all three.
- Optional live Synapse: copy `.env.example` → `.env`. Without it, the demo uses local seed data.
- Walkthrough: [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md)

Delivered by [Prodigy](https://weareprodigy.com) for [AviLease](https://avilease.com).
