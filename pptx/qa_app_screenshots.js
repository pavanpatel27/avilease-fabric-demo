const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'tmp', 'visual-qa');

async function screenshotApp() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });

  const baseUrl = 'http://localhost:3000/';
  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  // Default route is Architecture ("How it works")
  await page.waitForSelector('h1:has-text("One number")', { timeout: 10000 }).catch(() => {});
  await page.screenshot({ path: path.join(OUT_DIR, '01-architecture.png') });

  async function shotAt(textSelector, outName) {
    const loc = page.locator(textSelector).first();
    await loc.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT_DIR, outName) });
  }

  // Architecture page: capture the exact redlined sections
  await shotAt('h2:has-text("How the data comes together")', '07-ingestlook-join.png');
  await shotAt('h2:has-text("What we chose")', '08-architecture-decisions-matrix.png');
  await shotAt('h2:has-text("Why leadership can trust the data")', '09-trust.png');
  await shotAt('h3:has-text("The six decisions")', '10-six-decisions.png');
  await shotAt('h2:has-text("Who uses it")', '11-who-uses.png');
  await shotAt('h2:has-text("How we would roll it out")', '12-rollout.png');

  async function navTo(label, readySelector, outName) {
    await page.getByRole('button', { name: label }).click();
    // Lightweight wait for React state update
    await page.waitForTimeout(600);
    if (readySelector) {
      await page.waitForSelector(readySelector, { timeout: 10000 });
    }
    await page.screenshot({ path: path.join(OUT_DIR, outName) });
  }

  await navTo('Microsoft Fabric', 'h1:has-text("Microsoft Fabric")', '02-fabric.png');
  await navTo('Sync data', 'h1:has-text("Sync the three systems")', '03-pipeline.png');
  await navTo('Fleet', 'h1:has-text("Fleet")', '04-fleet.png');
  await navTo('Analytics', 'h1:has-text("Analytics")', '05-analytics-executive.png');

  // Optional: screenshot the Analytics Fleet sub-tab (it’s a separate local state)
  await page.locator('main').getByRole('button', { name: 'Fleet' }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, '06-analytics-fleet.png') });

  await browser.close();
  // eslint-disable-next-line no-console
  console.log(`Saved screenshots to: ${OUT_DIR}`);
}

screenshotApp().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

