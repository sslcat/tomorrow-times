import fs from "node:fs";
import { chromium } from "playwright";
const target = process.env.VISUAL_BASE_URL || "http://127.0.0.1:3000";
const output = "artifacts/v2-visual-review";
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch();
const pages = [
  ["home", "/"],
  ["entertainment", "/sections/entertainment"],
  ["article", "/articles/lyra-after-the-lights"],
  ["profile", "/entities/lyra"],
  ["universe", "/universe"],
  ["storyline", "/storylines/a-room-for-lyra"],
  ["community", "/community"],
  ["thread", "/community/discussion-lyra-after-the-lights"],
];
const results = [];
try {
  for (const width of [360, 390, 430, 768, 1024, 1440, 1920]) {
    const page = await browser.newPage({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const [name, route] of pages) {
      const response = await page.goto(target + route);
      await page.locator("h1").waitFor();
      await page.evaluate(async () => {
        await document.fonts.ready;
        document.querySelectorAll("img").forEach((i) => (i.loading = "eager"));
        await Promise.all(
          [...document.images].map((i) => i.decode().catch(() => {})),
        );
      });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      );
      const broken = await page
        .locator("img")
        .evaluateAll((images) =>
          images
            .filter((i) => !i.complete || !i.naturalWidth)
            .map((i) => i.src),
        );
      if ([390, 768, 1440].includes(width) || name === "home")
        await page.screenshot({
          path: `${output}/${name}-${width}.png`,
          fullPage: true,
        });
      results.push({
        name,
        width,
        status: response.status(),
        overflow,
        broken,
        errors: [...errors],
      });
    }
    if ([390, 1440].includes(width)) {
      await page.goto(target + "/");
      await page.getByRole("button", { name: "Use light theme" }).click();
      await page.waitForFunction(
        () => document.documentElement.dataset.theme === "light",
      );
      await page.screenshot({
        path: `${output}/home-light-${width}.png`,
        fullPage: true,
      });
      await page.goto(target + "/articles/lyra-after-the-lights");
      await page.getByRole("button", { name: "Use light theme" }).click();
      await page.waitForFunction(
        () => document.documentElement.dataset.theme === "light",
      );
      await page.screenshot({
        path: `${output}/article-light-${width}.png`,
        fullPage: true,
      });
    }
    await page.close();
  }
  fs.writeFileSync(
    `${output}/checks.json`,
    JSON.stringify(results, null, 2) + "\n",
  );
  const failures = results.filter(
    (r) => r.status !== 200 || r.overflow || r.broken.length || r.errors.length,
  );
  console.log(JSON.stringify({ checks: results.length, failures }, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  await browser.close();
}
