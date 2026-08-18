const path = require('path');
const { chromium } = require('playwright');
const { pathToFileURL } = require('url');
const fs = require('fs');

const slides = [
  '01-cover.html',
  '02-today-after.html',
  '03-use-cases.html',
  '04-how-it-works.html',
  '05-trust.html',
  '06-ai-path.html',
  '07-fabric.html',
  '08-roadmap.html',
];

async function main() {
  const outDir = path.join(__dirname, 'thumbnails');
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 960, height: 540 });

  for (const file of slides) {
    const htmlPath = path.join(__dirname, 'slides', file);
    await page.goto(pathToFileURL(htmlPath).href);
    const name = file.replace('.html', '.png');
    await page.screenshot({ path: path.join(outDir, name), fullPage: false });
    console.log('shot', name);
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
