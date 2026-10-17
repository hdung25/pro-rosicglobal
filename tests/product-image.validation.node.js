import test from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { imageFilename, prepareImage } from "../lib/product-image.js";

test("SEO filenames normalize accents, punctuation and duplicate branding", () => {
  assert.equal(imageFilename("Cashew Nuts W320"), "cashew-nuts-w320-hong-tam-rosic.webp");
  assert.equal(imageFilename("  Hạt ĐIỀU / mới!! "), "hat-dieu-moi-hong-tam-rosic.webp");
  assert.equal(imageFilename("cashew-hong-tam-rosic"), "cashew-hong-tam-rosic.webp");
  assert.equal(imageFilename("Hạt ĐIỀU-hong-tam-rosic-hong-tam-rosic.PNG"), "hat-dieu-hong-tam-rosic.webp");
  assert.match(imageFilename("../../"), /^[a-z0-9-]+\.webp$/);
});

test("server produces a real compressed WebP with baked watermark pixels", async () => {
  const source = await sharp({ create: { width: 1600, height: 900, channels: 3, background: "#eeeedd" } }).png().toBuffer();
  const result = await prepareImage(source);
  const meta = await sharp(result.output).metadata();
  assert.equal(meta.format, "webp");
  assert.equal(meta.width, 1200);
  assert.equal(meta.height, 1200);
  assert.ok(result.bytes < 150000);
  const top = await sharp(await sharp(result.output).extract({ left: 20, top: 20, width: 160, height: 80 }).toBuffer()).stats();
  const bottom = await sharp(await sharp(result.output).extract({ left: 20, top: 1100, width: 160, height: 80 }).toBuffer()).stats();
  assert.ok(Math.abs(top.channels[0].mean - bottom.channels[0].mean) < 8);
  const logo = await sharp(await sharp(result.output).extract({ left: 390, top: 500, width: 420, height: 200 }).toBuffer()).stats();
  assert.ok(logo.channels[0].stdev > 1);
});

test("invalid image bytes fail without generating an asset", async () => {
  await assert.rejects(prepareImage(new TextEncoder().encode("not an image")));
});

test("unknown presets cannot bypass the product watermark", async () => {
  const source = await sharp({ create: { width: 20, height: 20, channels: 3, background: "white" } }).png().toBuffer();
  await assert.rejects(prepareImage(source, "unknown"), /Invalid image preset/);
  const category = await prepareImage(source, "category");
  assert.equal(category.watermarked, false);
  assert.equal(category.width, 800);
});

