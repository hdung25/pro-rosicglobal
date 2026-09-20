export const IMAGE_PRESETS = {
  category: {
    label: "Ảnh danh mục",
    width: 800,
    height: 800,
    ratio: "1:1",
    shape: "tròn trên giao diện",
  },
  product: {
    label: "Ảnh sản phẩm",
    width: 1200,
    height: 1200,
    ratio: "1:1",
    shape: "vuông",
  },
  hero: {
    label: "Ảnh Hero",
    width: 1920,
    height: 1080,
    ratio: "16:9",
    shape: "ngang rộng",
  },
  content: {
    label: "Ảnh nội dung",
    width: 1600,
    height: 1200,
    ratio: "4:3",
    shape: "ngang",
  },
};

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image_decode_failed"));
    };
    image.src = url;
  });
}

export async function processCmsImage(file, presetName = "product") {
  const preset = IMAGE_PRESETS[presetName] ?? IMAGE_PRESETS.product;
  if (!file?.type?.startsWith("image/")) throw new Error("invalid_image_type");
  if (file.size > 12 * 1024 * 1024) throw new Error("image_too_large");

  const image = await loadImage(file);
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const targetRatio = preset.width / preset.height;
  const sourceRatio = sourceWidth / sourceHeight;
  let sx = 0;
  let sy = 0;
  let sw = sourceWidth;
  let sh = sourceHeight;

  if (sourceRatio > targetRatio) {
    sw = sourceHeight * targetRatio;
    sx = (sourceWidth - sw) / 2;
  } else {
    sh = sourceWidth / targetRatio;
    sy = (sourceHeight - sh) / 2;
  }

  const canvas = document.createElement("canvas");
  canvas.width = preset.width;
  canvas.height = preset.height;
  const context = canvas.getContext("2d", { alpha: false });
  context.fillStyle = "#f3f3ed";
  context.fillRect(0, 0, preset.width, preset.height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, sx, sy, sw, sh, 0, 0, preset.width, preset.height);

  return {
    src: canvas.toDataURL("image/webp", 0.84),
    width: preset.width,
    height: preset.height,
    preset: presetName,
    originalName: file.name,
    originalWidth: sourceWidth,
    originalHeight: sourceHeight,
  };
}
