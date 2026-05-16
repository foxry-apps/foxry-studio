import { createCanvas, loadImage, registerFont } from "canvas";
import { writeFileSync, readFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const WIDTH = 1200;
const HEIGHT = 630;

const COLORS = {
  bg: "#f5f2ed",
  surface: "#ffffff",
  text: "#1f1a14",
  subtext: "#6d6259",
  accent: "#e8601c",
  border: "#e5e1db",
};

async function generate() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Subtle grid pattern for texture
  ctx.strokeStyle = "rgba(232, 96, 28, 0.03)";
  ctx.lineWidth = 1;
  for (let x = 0; x < WIDTH; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }
  for (let y = 0; y < HEIGHT; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }

  // Top accent bar
  ctx.fillStyle = COLORS.accent;
  ctx.fillRect(0, 0, WIDTH, 5);

  // Main content card
  const cardX = 60;
  const cardY = 60;
  const cardW = WIDTH - 120;
  const cardH = HEIGHT - 120;
  const radius = 16;

  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, radius);
  ctx.fillStyle = COLORS.surface;
  ctx.shadowColor = "rgba(31, 26, 20, 0.08)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 8;
  ctx.fill();
  ctx.shadowColor = "transparent";

  // Card border
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, radius);
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Decorative accent circle (top right of card)
  ctx.beginPath();
  ctx.arc(cardX + cardW - 80, cardY + 80, 120, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(232, 96, 28, 0.04)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cardX + cardW - 80, cardY + 80, 60, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(232, 96, 28, 0.06)";
  ctx.fill();

  // Load and draw logo (read as buffer to avoid non-ASCII path issues)
  const logoBuffer = readFileSync(
    resolve(ROOT, "src/assets/images/foxry-logo_1.png"),
  );
  const logo = await loadImage(logoBuffer);
  const logoH = 52;
  const logoW = (logo.width / logo.height) * logoH;
  const logoX = cardX + 64;
  const logoY = cardY + 64;
  ctx.drawImage(logo, logoX, logoY, logoW, logoH);

  // Accent dot after logo
  ctx.beginPath();
  ctx.arc(logoX + logoW + 16, logoY + logoH - 8, 5, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.accent;
  ctx.fill();

  // Main copy
  const textX = cardX + 64;
  const textY = logoY + logoH + 80;

  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 52px "Segoe UI", system-ui, sans-serif';
  ctx.textBaseline = "top";

  const mainText = "Affordable tools for";
  const mainText2 = "Shopify merchants";
  ctx.fillText(mainText, textX, textY);
  ctx.fillText(mainText2, textX, textY + 64);

  // Sub copy
  ctx.fillStyle = COLORS.subtext;
  ctx.font = '400 24px "Segoe UI", system-ui, sans-serif';
  const subText = "Simple, focused apps — without the enterprise price tag.";
  ctx.fillText(subText, textX, textY + 164);

  // Bottom accent line
  const lineY = cardY + cardH - 64;
  ctx.fillStyle = COLORS.accent;
  ctx.fillRect(textX, lineY, 80, 4);

  // Domain text
  ctx.fillStyle = COLORS.subtext;
  ctx.font = '500 18px "Segoe UI", system-ui, sans-serif';
  ctx.fillText("foxry-studio.pages.dev", textX + 100, lineY - 4);

  // Output
  const outDir = resolve(ROOT, "public/images");
  mkdirSync(outDir, { recursive: true });
  const outPath = resolve(outDir, "og-image.png");
  writeFileSync(outPath, canvas.toBuffer("image/png"));
  console.log(`OG image generated: ${outPath}`);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
