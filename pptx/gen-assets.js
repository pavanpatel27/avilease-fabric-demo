const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assets = path.join(__dirname, 'assets');
fs.mkdirSync(assets, { recursive: true });

async function main() {
  const cover = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#003B51"/>
        <stop offset="55%" stop-color="#002A3A"/>
        <stop offset="100%" stop-color="#001820"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect x="0" y="0" width="14" height="1080" fill="#EC0051"/>
    <circle cx="1680" cy="180" r="300" fill="#00B7C3" fill-opacity="0.14"/>
    <circle cx="1550" cy="900" r="220" fill="#00B7C3" fill-opacity="0.08"/>
  </svg>`;

  const accentBar = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
    <rect width="100%" height="100%" fill="#F5F8FA"/>
    <rect x="0" y="0" width="14" height="1080" fill="#003B51"/>
  </svg>`;

  await sharp(Buffer.from(cover)).png().toFile(path.join(assets, 'cover-bg.png'));
  await sharp(Buffer.from(accentBar)).png().toFile(path.join(assets, 'content-bg.png'));
  console.log('assets ready');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
