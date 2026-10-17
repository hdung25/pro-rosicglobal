import fs from 'node:fs';
import sharp from 'sharp';
const svg = fs.readFileSync('public/icons/rosic-app.svg');
for (const size of [180, 192, 512]) {
  await sharp(svg).resize(size, size).png().toFile(`public/icons/rosic-${size === 180 ? 'apple-180' : size}.png`);
}
await sharp(svg).resize(512, 512).png().toFile('public/icons/rosic-maskable-512.png');
