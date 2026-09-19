const fs = require("fs");
const path = require("path");

const outputDir = path.resolve(__dirname, "../outputs");
fs.mkdirSync(outputDir, { recursive: true });

let sequence = 0;
const id = () => `T${String(++sequence).padStart(5, "0")}`;
const withPos = (node, x, y) => ({ ...node, x, y });

const frame = (name, x, y, width, height, options = {}, children = []) => ({
  type: "frame",
  id: id(),
  name,
  x,
  y,
  width,
  height,
  ...options,
  ...(children.length ? { children } : {}),
});

const rect = (name, x, y, width, height, fill = "$image", options = {}) => ({
  type: "rectangle",
  id: id(),
  name,
  x,
  y,
  width,
  height,
  fill,
  ...options,
});

const text = (name, content, x, y, width, fontSize = 16, weight = "500", options = {}) => ({
  type: "text",
  id: id(),
  name,
  x,
  y,
  fill: "$ink",
  textGrowth: "fixed-width",
  width,
  content,
  lineHeight: 1.45,
  fontFamily: "$font-sans",
  fontSize,
  fontWeight: weight,
  ...options,
});

const imagePlaceholder = (name, assetLabel, x, y, width, height, tone = "$image") =>
  frame(name, x, y, width, height, { fill: tone, stroke: "$line", strokeWidth: 1, layout: "none" }, [
    text(`${name} Label`, assetLabel, 12, Math.max(12, height / 2 - 10), width - 24, 11, "700", {
      fill: "$muted",
      textAlign: "center",
      lineHeight: 1.3,
    }),
  ]);

const assetFill = (url, mode = "fill") => ({
  type: "image",
  enabled: true,
  url,
  mode,
});

const imageAsset = (name, url, x, y, width, height, mode = "fill") =>
  frame(name, x, y, width, height, {
    clip: true,
    fill: assetFill(url, mode),
    layout: "none",
  });

const sectionMarker = (n, label, y = 96) =>
  text(`${label} Section Label`, `${n} — ${label}`, 20, y, 335, 12, "700", {
    fill: "$muted",
    letterSpacing: 1.2,
  });

const link = (name, label, x, y, width = 160) =>
  frame(name, x, y, width, 44, { stroke: "$ink", strokeWidth: 1, layout: "none" }, [
    text(`${name} Text`, label, 12, 12, width - 24, 12, "700", { lineHeight: 1.2 }),
  ]);

const foundation = frame("00 FOUNDATION", 0, 0, 375, 2110, {
  clip: true,
  fill: "$paper",
  layout: "none",
  stroke: "$line",
  strokeWidth: 1,
}, [
  text("Foundation Eyebrow", "TSUGI / PENCIL FOUNDATION", 20, 24, 335, 12, "700", { fill: "$muted", letterSpacing: 1.2 }),
  text("Foundation Title", "HOME SP\nLOW-FIDELITY", 20, 60, 335, 40, "800", { lineHeight: 1.08 }),
  text("Foundation Meta", "375px / Mobile First / Gray Box", 20, 164, 335, 14, "500", { fill: "$muted" }),

  text("Grid Title", "GRID", 20, 226, 335, 12, "700", { letterSpacing: 1.2 }),
  frame("4 Column Grid Specimen", 20, 258, 335, 180, { fill: "$bg", stroke: "$line", strokeWidth: 1, layout: "none" }, [
    rect("Grid Column 1", 0, 0, 74.75, 180, "$guide"),
    rect("Grid Column 2", 86.75, 0, 74.75, 180, "$guide"),
    rect("Grid Column 3", 173.5, 0, 74.75, 180, "$guide"),
    rect("Grid Column 4", 260.25, 0, 74.75, 180, "$guide"),
    text("Grid Measurement", "4 columns / 74.75px\nGutter 12px\nSide margin 20px", 14, 96, 307, 13, "600", { lineHeight: 1.45 }),
  ]),

  text("Spacing Title", "SPACING / RHYTHM", 20, 486, 335, 12, "700", { letterSpacing: 1.2 }),
  text("Spacing Values", "Section gap     96px baseline\nInner gap       20 / 32 / 48px\nImage widths    375 / 335 / 220–280px", 20, 520, 335, 14, "500", { lineHeight: 1.75 }),

  text("Hierarchy Title", "HIERARCHY", 20, 646, 335, 12, "700", { letterSpacing: 1.2 }),
  text("Display Sample", "泊まるために、\n部屋を減らした。", 20, 682, 335, 38, "800", { lineHeight: 1.18 }),
  text("H2 Sample", "残すものを選ぶ。", 20, 792, 335, 30, "700"),
  text("Body Sample", "事実 → 意味の順で、短く具体的に。\nUIは静かに、導線は明快に。", 20, 846, 335, 16, "500", { lineHeight: 1.7 }),

  text("Image Rules Title", "IMAGE PLACEHOLDERS", 20, 944, 335, 12, "700", { letterSpacing: 1.2 }),
  imagePlaceholder("Standard Image Spec", "STANDARD 335", 20, 978, 335, 110),
  imagePlaceholder("Narrow Image Spec", "NARROW / OFFSET 240", 115, 1104, 240, 92, "$imageDark"),

  text("Brand Assets Title", "BRAND ASSETS", 20, 1250, 335, 12, "700", { letterSpacing: 1.2 }),
  text("Primary Logo Label", "PRIMARY LOGO / TSUGI WORDMARK", 20, 1288, 335, 11, "700", { fill: "$muted", letterSpacing: 0.7 }),
  imageAsset("Primary Logo / TSUGI Wordmark", "../assets/logos/tsugi_wordmark.png", 20, 1320, 335, 150, "fit"),
  text("Secondary Logo Label", "SECONDARY LOGO / CIRCULAR TYPE", 20, 1498, 335, 11, "700", { fill: "$muted", letterSpacing: 0.7 }),
  imageAsset("Secondary Logo / Circular Type", "../assets/logos/tsugi_circle_logo.png", 107.5, 1532, 160, 160, "fit"),
  text("Brand Assets Roles", "Primary: Header / Main Brand Mark\nSecondary: Footer / Graphic Accent / Signage", 20, 1716, 335, 12, "500", { fill: "$muted", lineHeight: 1.6 }),

  text("Image Direction Title", "IMAGE DIRECTION", 20, 1788, 335, 12, "700", { letterSpacing: 1.2 }),
  imageAsset("Direction / 01 Hero Exterior", "../assets/images/exterior/01_hero_exterior.png", 20, 1822, 104, 74),
  imageAsset("Direction / 04 Lounge Main", "../assets/images/lounge/04_lounge_main.png", 135.5, 1822, 104, 74),
  imageAsset("Direction / 06 Garden Room", "../assets/images/rooms/06_room_garden.png", 251, 1822, 104, 74),
  text("Direction Label / Architecture", "01 ARCHITECTURE", 20, 1904, 104, 9, "700", { fill: "$muted" }),
  text("Direction Label / Interior", "04 INTERIOR", 135.5, 1904, 104, 9, "700", { fill: "$muted" }),
  text("Direction Label / Stay", "06 STAY", 251, 1904, 104, 9, "700", { fill: "$muted" }),
  imageAsset("Direction / 10 Bath Main", "../assets/images/bath/10_bath_main.png", 20, 1940, 104, 74),
  imageAsset("Direction / 14 Pillar Beam", "../assets/images/story/14_pillar_beam.png", 135.5, 1940, 104, 74),
  imageAsset("Direction / 23 Morning Walk", "../assets/images/experience/23_morning_walk.png", 251, 1940, 104, 74),
  text("Direction Label / Bath", "10 BATH", 20, 2022, 104, 9, "700", { fill: "$muted" }),
  text("Direction Label / Material", "14 MATERIAL", 135.5, 2022, 104, 9, "700", { fill: "$muted" }),
  text("Direction Label / Experience", "23 EXPERIENCE", 251, 2022, 104, 9, "700", { fill: "$muted" }),
]);

const header = frame("01 / Header", 0, 0, 375, 72, {
  fill: "$paper",
  stroke: "$line",
  strokeWidth: { bottom: 1 },
  layout: "none",
}, [
  imageAsset("Header / TSUGI Wordmark", "../assets/logos/tsugi_wordmark.png", 20, 17, 98, 38, "fit"),
  text("Header Reservation", "RESERVATION", 196, 27, 112, 11, "700", { textAlign: "right", letterSpacing: 0.6 }),
  frame("Header Menu", 327, 16, 28, 40, { layout: "none" }, [
    rect("Menu Line 1", 0, 12, 28, 1, "$ink"),
    rect("Menu Line 2", 8, 22, 20, 1, "$ink"),
  ]),
]);

const hero = frame("02 / Hero", 0, 72, 375, 680, { fill: "$paper", layout: "none" }, [
  imageAsset("Hero / 01 Hero Exterior", "../assets/images/exterior/01_hero_exterior.png", 0, 0, 375, 340),
  text("Hero Heading", "泊まるために、\n部屋を減らした。", 20, 382, 355, 44, "800", { lineHeight: 1.12 }),
  text("Hero Supporting Copy", "1968年に建てられた旅館を、\n残すものを選びながら8室の宿へ。", 20, 506, 280, 16, "500", { lineHeight: 1.65 }),
  text("Hero Date Graphic", "1968 — 2026", 20, 610, 335, 20, "700", { letterSpacing: 1.5 }),
]);

const intro = frame("03 / Introduction", 0, 752, 375, 470, { fill: "$bg", layout: "none" }, [
  sectionMarker("00", "INTRODUCTION"),
  text("Introduction Heading", "残すものを選ぶ。", 20, 142, 335, 38, "700", { lineHeight: 1.25 }),
  text("Introduction Copy", "古いものをすべて残すのでも、\nすべて新しくするのでもない。\n\n残すもの、変えるもの、\nなくすものを選び、\n現在の滞在へ継ぎ直す。", 20, 218, 294, 16, "500", { lineHeight: 1.75 }),
  rect("Introduction Rule", 20, 406, 335, 1, "$line"),
]);

const stay = frame("04 / STAY Preview", 0, 1222, 375, 1040, { fill: "$paper", layout: "none" }, [
  sectionMarker("01", "STAY"),
  text("Stay Heading", "8 rooms.\nLess, but more.", 20, 138, 335, 38, "800", { lineHeight: 1.12 }),
  imageAsset("Stay / 06 Garden Room", "../assets/images/rooms/06_room_garden.png", 20, 252, 335, 240),
  imageAsset("Stay / 10 Bath Main", "../assets/images/bath/10_bath_main.png", 115, 524, 240, 164),
  imageAsset("Stay / 12 Dinner", "../assets/images/dining/12_dinner.png", 20, 720, 220, 146),
  text("Stay Info", "全8室 / 2–3名 / 温泉 / 朝夕食", 20, 900, 250, 13, "600", { fill: "$muted", letterSpacing: 0.4 }),
  link("Stay Link", "VIEW STAY  →", 195, 970, 160),
]);

const graphic = frame("05 / 12 to 08 Graphic Break", 0, 2262, 375, 520, { fill: "$ink", layout: "none" }, [
  text("Graphic Break Label", "EDIT → SPACE → TIME", 20, 64, 335, 11, "700", { fill: "$paper", letterSpacing: 1.3 }),
  text("Graphic Break Number", "12 → 08", 14, 118, 347, 86, "800", { fill: "$paper", lineHeight: 1 }),
  text("Graphic Break Heading", "減らした分だけ、\n残ったものがある。", 20, 298, 335, 34, "700", { fill: "$paper", lineHeight: 1.3 }),
  text("Graphic Break Note", "12 rooms / before    08 rooms / now", 20, 438, 335, 11, "600", { fill: "$mutedLight", letterSpacing: 0.5 }),
]);

const lounge = frame("06 / Lounge and Space", 0, 2782, 375, 930, { fill: "$bg", layout: "none" }, [
  sectionMarker("—", "SPACE"),
  text("Lounge Heading", "客室ではない\n場所にも、\n居場所を。", 20, 142, 335, 36, "700", { lineHeight: 1.18 }),
  imageAsset("Lounge / 04 Lounge Main", "../assets/images/lounge/04_lounge_main.png", 0, 292, 375, 258),
  imageAsset("Lounge / 05 Lounge Detail", "../assets/images/lounge/05_lounge_detail.png", 105, 584, 250, 218),
  text("Lounge Copy", "部屋を減らして生まれた場所を、\n何もしないための共有空間へ。", 20, 832, 300, 15, "500", { lineHeight: 1.65 }),
]);

const story = frame("07 / STORY Preview", 0, 3712, 375, 1000, { fill: "$paper", layout: "none" }, [
  sectionMarker("02", "STORY"),
  text("Story Heading", "古いままでも、\n新しいだけでも\nない。", 20, 142, 335, 36, "700", { lineHeight: 1.22 }),
  text("Story Graphic Words", "KEEP\nCHANGE\nREMOVE", 20, 274, 220, 48, "800", { lineHeight: 1.05, letterSpacing: 1.2 }),
  imageAsset("Story / 14 Pillar and Beam", "../assets/images/story/14_pillar_beam.png", 96, 444, 259, 198),
  imageAsset("Story / 15 Wooden Frames and Courtyard", "../assets/images/story/15_wooden_frames_courtyard.png", 20, 680, 235, 178),
  link("Story Link", "VIEW STORY  →", 195, 920, 160),
]);

const experience = frame("08 / EXPERIENCE Preview", 0, 4712, 375, 800, { fill: "$bg", layout: "none" }, [
  sectionMarker("03", "EXPERIENCE"),
  text("Experience Heading", "一日を、\n急がない。", 20, 142, 335, 40, "700", { lineHeight: 1.18 }),
  imageAsset("Experience / 23 Morning Walk", "../assets/images/experience/23_morning_walk.png", 20, 268, 280, 210),
  imageAsset("Experience / 17 River", "../assets/images/experience/17_river.png", 170, 510, 185, 132),
  text("Experience Copy", "歩く、浸かる、読む。\n予定を増やさないための過ごし方。", 20, 682, 280, 15, "500", { lineHeight: 1.65 }),
  link("Experience Link", "VIEW EXPERIENCE  →", 175, 736, 180),
]);

const location = frame("09 / Location", 0, 5512, 375, 650, { fill: "$paper", layout: "none" }, [
  text("Location Label", "LOCATION", 20, 96, 335, 12, "700", { fill: "$muted", letterSpacing: 1.2 }),
  text("Location Heading", "山と川のあいだに\nある、小さな温泉地。", 20, 140, 335, 34, "700", { lineHeight: 1.28 }),
  imageAsset("Location / 18 Onsen Town", "../assets/images/experience/18_onsen_town.png", 20, 270, 335, 220),
  text("Location Meta", "駅からバスで約40分 / 温泉街から徒歩8分", 20, 526, 335, 13, "600", { fill: "$muted" }),
  link("Access Link", "ACCESS  →", 215, 582, 140),
]);

const finalCta = frame("10 / Final CTA", 0, 6162, 375, 720, { fill: "$bg", layout: "none" }, [
  imagePlaceholder("Final / 24 Night Exterior Pending", "24 NIGHT EXTERIOR\nASSET PENDING", 0, 0, 375, 280, "$imageDark"),
  text("Final CTA Label", "NEXT STAY", 20, 350, 335, 12, "700", { fill: "$muted", letterSpacing: 1.2 }),
  text("Final CTA Heading", "次の一泊を、\nここで。", 20, 398, 335, 40, "700", { lineHeight: 1.18 }),
  frame("Reservation CTA", 20, 548, 335, 72, { fill: "$ink", layout: "none" }, [
    text("Reservation CTA Text", "RESERVATION  ↗", 20, 24, 295, 14, "700", { fill: "$paper", letterSpacing: 0.8 }),
  ]),
  text("Final CTA Note", "Navigation remains functional and obvious.", 20, 654, 335, 11, "500", { fill: "$muted" }),
]);

const footer = frame("11 / Footer", 0, 6882, 375, 720, { fill: "$ink", layout: "none" }, [
  imageAsset("Footer / TSUGI Wordmark", "../assets/logos/tsugi_wordmark.png", 20, 45, 170, 70, "fit"),
  imageAsset("Footer / Circular Type Logo", "../assets/logos/tsugi_circle_logo.png", 265, 40, 90, 90, "fit"),
  text("Footer Main Nav", "STAY\nSTORY\nEXPERIENCE\nRESERVATION", 20, 168, 335, 24, "600", { fill: "$paper", lineHeight: 1.9 }),
  text("Footer Supporting Nav", "ACCESS     FAQ     INSTAGRAM", 20, 394, 335, 12, "600", { fill: "$mutedLight", letterSpacing: 0.5 }),
  rect("Footer Rule", 20, 452, 335, 1, "$muted"),
  text("Footer Address", "TSUGI\nA small onsen inn between mountain and river.\n8 rooms / Since 1968, edited for 2026.", 20, 492, 300, 13, "500", { fill: "$mutedLight", lineHeight: 1.7 }),
  text("Footer Copyright", "© 2026 TSUGI", 20, 654, 335, 11, "500", { fill: "$mutedLight" }),
]);

const gridOverlay = frame("GRID OVERLAY / 4 columns / 12px gutter", 0, 0, 375, 7602, {
  layoutPosition: "absolute",
  layout: "none",
}, [
  rect("Column Guide 1", 20, 0, 74.75, 7602, "$guideOverlay"),
  rect("Column Guide 2", 106.75, 0, 74.75, 7602, "$guideOverlay"),
  rect("Column Guide 3", 193.5, 0, 74.75, 7602, "$guideOverlay"),
  rect("Column Guide 4", 280.25, 0, 74.75, 7602, "$guideOverlay"),
]);

const home = frame("01 HOME SP WIREFRAME", 455, 0, 375, 7602, {
  clip: true,
  fill: "$paper",
  layout: "none",
  stroke: "$line",
  strokeWidth: 1,
}, [header, hero, intro, stay, graphic, lounge, story, experience, location, finalCta, footer, gridOverlay]);

const document = {
  version: "2.14",
  children: [foundation, home],
  variables: {
    bg: { type: "color", value: "#F1F0EC" },
    paper: { type: "color", value: "#FCFBF8" },
    ink: { type: "color", value: "#20201F" },
    muted: { type: "color", value: "#74716B" },
    mutedLight: { type: "color", value: "#B9B6AF" },
    line: { type: "color", value: "#C9C6BF" },
    image: { type: "color", value: "#D8D5CE" },
    imageDark: { type: "color", value: "#BAB7B0" },
    guide: { type: "color", value: "#88A9C633" },
    guideOverlay: { type: "color", value: "#2E72FF0A" },
    "font-sans": { type: "string", value: "Inter" },
  },
  fileToken: "c9a94cf7-9a83-4d68-88ae-69243ceef114",
};

const penPath = path.join(outputDir, "TSUGI_HOME_SP_WIREFRAME.pen");
fs.writeFileSync(penPath, `${JSON.stringify(document, null, 2)}\n`);

const variableValue = (value) => {
  if (typeof value === "string" && value.startsWith("$")) {
    return document.variables[value.slice(1)]?.value || value;
  }
  return value;
};

const escapeXml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const renderNode = (node, parentX = 0, parentY = 0) => {
  const x = parentX + (Number(node.x) || 0);
  const y = parentY + (Number(node.y) || 0);
  const width = Number(node.width) || 0;
  const height = Number(node.height) || 0;
  let svg = "";

  if (node.type === "frame" || node.type === "rectangle") {
    const stroke = variableValue(node.stroke) || "none";
    const strokeWidth = typeof node.strokeWidth === "number" ? node.strokeWidth : 0;
    if (node.fill && typeof node.fill === "object" && node.fill.type === "image") {
      const preserve = node.fill.mode === "fit" ? "xMidYMid meet" : "xMidYMid slice";
      svg += `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" overflow="hidden"><image href="${escapeXml(node.fill.url)}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="${preserve}"/></svg>`;
      if (stroke !== "none" && strokeWidth > 0) {
        svg += `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
      }
    } else {
      const fill = variableValue(node.fill) || "none";
      svg += `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
    }
  }

  if (node.type === "text") {
    const fill = variableValue(node.fill) || "#20201F";
    const fontFamily = variableValue(node.fontFamily) || "Inter, sans-serif";
    const lineHeight = (Number(node.fontSize) || 16) * (Number(node.lineHeight) || 1.45);
    const anchor = node.textAlign === "center" ? "middle" : node.textAlign === "right" ? "end" : "start";
    const tx = node.textAlign === "center" ? x + width / 2 : node.textAlign === "right" ? x + width : x;
    const lines = String(node.content).split("\n");
    svg += `<text x="${tx}" y="${y + (Number(node.fontSize) || 16)}" fill="${fill}" font-family="${escapeXml(fontFamily)}, sans-serif" font-size="${node.fontSize}" font-weight="${node.fontWeight}" text-anchor="${anchor}" letter-spacing="${node.letterSpacing || 0}">`;
    lines.forEach((line, index) => {
      svg += `<tspan x="${tx}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line || " ")}</tspan>`;
    });
    svg += "</text>";
  }

  if (node.children) {
    node.children.forEach((child) => {
      svg += renderNode(child, x, y);
    });
  }
  return svg;
};

const svgBody = home.children.map((child) => renderNode(child, 0, 0)).join("\n");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="375" height="7602" viewBox="0 0 375 7602">\n<rect width="375" height="7602" fill="#FCFBF8"/>\n${svgBody}\n</svg>\n`;
fs.writeFileSync(path.join(outputDir, "TSUGI_HOME_SP_WIREFRAME_preview.svg"), svg);

const foundationSvgBody = foundation.children.map((child) => renderNode(child, 0, 0)).join("\n");
const foundationSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="375" height="2110" viewBox="0 0 375 2110">\n<rect width="375" height="2110" fill="#FCFBF8"/>\n${foundationSvgBody}\n</svg>\n`;
fs.writeFileSync(path.join(outputDir, "TSUGI_FOUNDATION_preview.svg"), foundationSvg);

const qaDir = path.resolve(__dirname, "qa");
fs.mkdirSync(qaDir, { recursive: true });
[
  ["01_header_hero_intro", 0, 1222],
  ["02_stay_graphic", 1222, 1560],
  ["03_lounge_story", 2782, 1930],
  ["04_experience_location", 4712, 1450],
  ["05_cta_footer", 6162, 1440],
].forEach(([name, y, height]) => {
  const qaBody = svgBody.replaceAll("../assets/", "../../assets/");
  const qaSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="375" height="${height}" viewBox="0 ${y} 375 ${height}">\n<rect x="0" y="${y}" width="375" height="${height}" fill="#FCFBF8"/>\n${qaBody}\n</svg>\n`;
  fs.writeFileSync(path.join(qaDir, `${name}.svg`), qaSvg);
});

const sectionQaDir = path.join(qaDir, "sections");
fs.mkdirSync(sectionQaDir, { recursive: true });
const foundationQaBody = foundationSvgBody.replaceAll("../assets/", "../../../assets/");
const foundationAssetsQaSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="375" height="375" viewBox="0 1120 375 990" preserveAspectRatio="xMidYMid meet">\n<rect x="0" y="1120" width="375" height="990" fill="#FCFBF8"/>\n${foundationQaBody}\n</svg>\n`;
fs.writeFileSync(path.join(sectionQaDir, "00_foundation_assets.svg"), foundationAssetsQaSvg);
[
  ["01_header", 0, 72],
  ["02_hero", 72, 680],
  ["03_introduction", 752, 470],
  ["04_stay", 1222, 1040],
  ["05_12_to_08", 2262, 520],
  ["06_lounge", 2782, 930],
  ["07_story", 3712, 1000],
  ["08_experience", 4712, 800],
  ["09_location", 5512, 650],
  ["10_final_cta", 6162, 720],
  ["11_footer", 6882, 720],
].forEach(([name, y, height]) => {
  const sectionBody = svgBody.replaceAll("../assets/", "../../../assets/");
  const sectionSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="375" height="375" viewBox="0 ${y} 375 ${height}" preserveAspectRatio="xMidYMid meet">\n<rect x="0" y="${y}" width="375" height="${height}" fill="#FCFBF8"/>\n${sectionBody}\n</svg>\n`;
  fs.writeFileSync(path.join(sectionQaDir, `${name}.svg`), sectionSvg);
});

console.log(JSON.stringify({ penPath, frames: document.children.map((item) => ({ name: item.name, width: item.width, height: item.height })), nodeCount: sequence }, null, 2));
