const fs = require("fs");
const os = require("os");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const SOURCE_ROOT = path.join(PROJECT_ROOT, "assets/images");
const OUTPUT_ROOT = path.join(SOURCE_ROOT, "optimized");

const QUALITY = Object.freeze({
  photo: {
    avif: { quality: 58, effort: 5, chromaSubsampling: "4:4:4" },
    webp: { quality: 82, effort: 5, smartSubsample: true },
  },
  map: {
    avif: { quality: 70, effort: 5, chromaSubsampling: "4:4:4" },
    webp: { quality: 92, effort: 5, smartSubsample: true },
  },
});

const IMAGES = Object.freeze([
  { file: "exterior/01_hero_exterior.png", widths: [480, 768, 1024, 1600] },
  { file: "exterior/02_front_facade.png", widths: [480, 768, 1024, 1536] },
  { file: "exterior/03_entrance.png", widths: [480, 768, 1122] },
  { file: "exterior/24_night_exterior.png", widths: [480, 768, 1024, 1366, 1536] },
  { file: "lounge/04_lounge_main.png", widths: [480, 768, 1024, 1536] },
  { file: "lounge/05_lounge_detail.png", widths: [480, 768, 1122] },
  { file: "rooms/06_room_garden.png", widths: [480, 768, 1024, 1448] },
  { file: "rooms/07_room_river.png", widths: [480, 768] },
  { file: "rooms/08_room_corner.png", widths: [480, 768] },
  { file: "rooms/09_room_detail.png", widths: [480, 768, 1122] },
  { file: "bath/10_bath_main.png", widths: [480, 768, 1024, 1536] },
  { file: "bath/11_bath_detail.png", widths: [480, 768, 1122] },
  { file: "dining/12_dinner.png", widths: [480, 768, 1024, 1536] },
  { file: "dining/13_breakfast.png", widths: [480, 768, 1024, 1536] },
  { file: "story/14_pillar_beam.png", widths: [480, 768, 1122] },
  { file: "story/15_wooden_frames_courtyard.png", widths: [480, 768, 1122] },
  { file: "story/16_corridor_stair.png", widths: [480, 768, 1122] },
  { file: "experience/17_river.png", widths: [480, 768, 1024] },
  { file: "experience/18_onsen_town.png", widths: [480, 768, 1024, 1536] },
  { file: "experience/19_public_bath.png", widths: [480, 768, 1024, 1366] },
  { file: "experience/20_coffee_shop.png", widths: [480, 768, 1024, 1366] },
  { file: "experience/21_bakery.png", widths: [480, 768, 1024, 1366] },
  { file: "experience/22_shrine_path.png", widths: [480, 768, 1122] },
  { file: "experience/23_morning_walk.png", widths: [480, 768, 1024, 1536] },
  { file: "map/25_neighborhood_map_simplified.png", widths: [480, 768, 1024, 1366, 1536], preset: "map" },
]);

function loadSharp() {
  const candidates = [
    "sharp",
    path.join(
      os.homedir(),
      ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp",
    ),
  ];

  for (const candidate of candidates) {
    try {
      return require(candidate);
    } catch (error) {
      if (error.code !== "MODULE_NOT_FOUND") throw error;
    }
  }

  throw new Error("sharp is required. Install it with `npm install --no-save sharp`.");
}

const sharp = loadSharp();
sharp.concurrency(2);

function outputPath(file, width, format) {
  const parsed = path.parse(file);
  return path.join(OUTPUT_ROOT, parsed.dir, `${parsed.name}-${width}w.${format}`);
}

async function optimizeVariant(image, width, format) {
  const source = path.join(SOURCE_ROOT, image.file);
  const destination = outputPath(image.file, width, format);
  const quality = QUALITY[image.preset || "photo"][format];

  fs.mkdirSync(path.dirname(destination), { recursive: true });

  const pipeline = sharp(source)
    .rotate()
    .resize({ width, fit: "inside", withoutEnlargement: true });

  if (format === "avif") pipeline.avif(quality);
  if (format === "webp") pipeline.webp(quality);

  await pipeline.toFile(destination);
  return destination;
}

async function runPool(tasks, concurrency = 2) {
  let cursor = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (cursor < tasks.length) {
      const task = tasks[cursor];
      cursor += 1;
      await task();
    }
  });
  await Promise.all(workers);
}

async function main() {
  const tasks = [];

  for (const image of IMAGES) {
    const source = path.join(SOURCE_ROOT, image.file);
    if (!fs.existsSync(source)) throw new Error(`Missing source: ${image.file}`);

    const metadata = await sharp(source).metadata();
    const widths = [...new Set(image.widths)].filter((width) => width <= metadata.width);

    for (const width of widths) {
      for (const format of ["avif", "webp"]) {
        tasks.push(() => optimizeVariant(image, width, format));
      }
    }
  }

  await runPool(tasks, 2);
  console.log(`Generated ${tasks.length} optimized files in ${OUTPUT_ROOT}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
