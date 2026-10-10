import fs from "node:fs";
import { chromium } from "playwright";
import sharp from "sharp";

// Capture a running local public showcase. Never visit admin or browser chrome.
const target = new URL(process.env.VISUAL_BASE_URL || "http://127.0.0.1:3000");
if (!["localhost", "127.0.0.1"].includes(target.hostname)) {
  throw new Error("Documentation screenshots require a loopback preview");
}
const browser = await chromium.launch();
fs.mkdirSync("docs/screenshots", { recursive: true });
try {
  const shots = [
    ["home-desktop", "/", 1440, 1040],
    ["article-desktop", "/articles/lyra-after-the-lights", 1440, 1040],
    ["home-mobile", "/", 390, 844],
  ];
  for (const [name, route, width, height] of shots) {
    const page = await browser.newPage({
      viewport: { width, height },
      reducedMotion: "reduce",
    });
    const response = await page.goto(new URL(route, target).href);
    if (response.status() !== 200)
      throw new Error("Screenshot page unavailable");
    await page.locator("h1").waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [...document.images]
          .filter((i) => i.loading !== "lazy")
          .map((i) => i.decode()),
      );
    });
    const png = await page.screenshot({ fullPage: false });
    await sharp(png)
      .webp({ quality: 85 })
      .toFile(`docs/screenshots/${name}.webp`);
    await page.close();
  }
} finally {
  await browser.close();
}
console.log("Saved three optimized screenshots of fictional public pages.");
