const path = require('path');
const pptxgen = require('pptxgenjs');
const html2pptx = require('./html2pptx');

const slidesDir = path.join(__dirname, 'slides');
const outFile = path.join(__dirname, 'AviLease-Fabric-EA-Briefing.pptx');

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
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Prodigy';
  pptx.title = 'AviLease — One number for the fleet';
  pptx.subject = 'Microsoft Fabric enterprise architecture briefing';

  for (const file of slides) {
    const htmlPath = path.join(slidesDir, file);
    console.log('Building', file);
    await html2pptx(htmlPath, pptx);
  }

  await pptx.writeFile({ fileName: outFile });
  console.log('Wrote', outFile);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
