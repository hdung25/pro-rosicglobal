import sharp from "sharp";
import { Buffer } from "node:buffer";
import { logoSvg } from "./watermark.js";
import { captionSvg } from "./watermark-caption.js";

export function imageFilename(name) {
  const slug = String(name || "product").replace(/\.(webp|png|jpe?g)$/i, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/gi, "d").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/(?:-hong-tam-rosic)+$/, "").slice(0, 100).replace(/-+$/, "") || "product";
  return `${slug}-hong-tam-rosic.webp`;
}

export async function prepareImage(input, preset = "product") {
  const sizes = { product: [1200, 1200], category: [800, 800], hero: [1920, 1080], content: [1600, 1200] };
  if (!Object.hasOwn(sizes, preset)) throw new Error("Invalid image preset");
  const [width, height] = sizes[preset];
  const pipeline = sharp(input, { limitInputPixels: 40_000_000 }).rotate().resize(width, height, { fit: "cover" }).flatten({ background: "#f3f3ed" });
  const composites = [];
  if (preset === "product") {
    const markWidth = Math.round(width * 0.34);
    const logo = await sharp(Buffer.from(logoSvg)).resize({ width: markWidth }).ensureAlpha().toBuffer();
    const { data, info } = await sharp(logo).raw().toBuffer({ resolveWithObject: true });
    for (let i = 3; i < data.length; i += 4) data[i] = Math.round(data[i] * 0.6);
    const mark = await sharp(data, { raw: info }).png().toBuffer();
    composites.push({
      input: mark,
      left: Math.round((width - markWidth) / 2),
      top: Math.round((height - info.height) / 2),
    });
    const caption = captionSvg.replace(/<rect[^>]*\/>/, "").replace('fill="white" fill-opacity=".8"', 'fill="#193B30" fill-opacity=".85"');
    composites.push({ input: Buffer.from(caption), left: 0, top: Math.round((height + info.height) / 2) + 14 });
  }
  const stamped = await pipeline.composite(composites).png().toBuffer();
  for (const quality of [82, 74, 66, 58, 48, 38, 28, 18]) {
    const output = await sharp(stamped).webp({ quality }).toBuffer();
    if (output.length < 150000) return { output, width, height, bytes: output.length, watermarked: preset === "product" };
  }
  throw new Error("Không thể nén ảnh dưới 150KB. Vui lòng chọn ảnh ít chi tiết hơn.");
}
