import { test, expect } from "@playwright/test";
import fs from "node:fs";
test("desktop front page, article, saved state and source record", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Lyra Saye postpones Ares benefit. The crew still gets paid.",
  );
  await expect(
    page.getByText("FICTIONAL NEWS. REAL HUMAN DRAMA."),
  ).toBeVisible();
  await expect(page.locator("img").first()).toBeVisible();
  fs.mkdirSync("artifacts", { recursive: true });
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.screenshot({ path: "artifacts/home-desktop.png", fullPage: true });
  await page.getByRole("heading", { level: 1 }).getByRole("link").click();
  await expect(page.locator("#article-body")).toContainText(
    "Lyra Saye has postponed",
  );
  await page.getByRole("button", { name: "Save article", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Saved", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.goto("/reading-list");
  await expect(
    page.getByRole("heading", {
      name: "Lyra Saye postpones Ares benefit. The crew still gets paid.",
    }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Saved", exact: true }),
  ).toBeVisible();
  await expect(page.locator("html")).not.toHaveJSProperty("scrollWidth", 0);
  expect(errors).toEqual([]);
});
test("section navigation, sports results, search and entity follows", async ({
  page,
}) => {
  await page.goto("/sections/sports");
  await expect(
    page.getByRole("heading", { name: "Sports", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("row").filter({ hasText: "Ceres Comets" }),
  ).toContainText("4");
  await page.goto("/search");
  await page
    .getByLabel("Search articles, people, places and storylines")
    .fill("Lyra");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Lyra Saye", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("heading", { name: "Lyra Saye", exact: true })
    .getByRole("link")
    .click();
  await expect(page.locator("h1")).toHaveText("Lyra Saye");
  await page.getByRole("button", { name: "Follow", exact: true }).click();
  await page.goto("/reading-list");
  await expect(
    page.getByRole("link", { name: "Lyra Saye", exact: true }),
  ).toBeVisible();
  await page.goto("/search?q=unsent%20letter");
  await expect(
    page.getByText("No matches in the public record."),
  ).toBeVisible();
});
test("storyline, archives, community, and production write restrictions", async ({
  page,
  request,
}) => {
  await page.goto("/storylines/the-missing-reserve");
  await expect(page.locator(".timeline")).toContainText("The Commons defers");
  await page.goto("/archives?date=3026-10-05");
  await expect(
    page.getByRole("heading", {
      name: "Comets beat Saints 4–3 as referee reviews a tether measurement",
    }),
  ).toBeVisible();
  await page.goto("/archives?date=3099-01-01");
  await expect(page.getByText("A quiet day in this edition.")).toBeVisible();
  await page.goto("/community/discussion-the-water-that-isnt-there");
  await expect(
    page.getByText("The conversation hasn’t started."),
  ).toBeVisible();
  await expect(page.getByText("Posting is currently disabled.")).toBeVisible();
  await page.goto("/admin");
  await expect(page.getByText("The editorial desk is locked.")).toBeVisible();
  expect(
    (
      await request.post("/api/admin", {
        data: { action: "generate" },
        headers: { origin: "http://127.0.0.1:3001" },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/community", { data: { body: "attempt" } })
    ).status(),
  ).toBe(403);
});
for (const [name, width] of [
  ["mobile", 390],
  ["narrow", 320],
  ["tablet", 768],
] as const)
  test(`${name} layout, navigation, imagery and keyboard access`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.locator(".mobile-nav summary").click();
    await page
      .getByRole("navigation", { name: "Mobile sections" })
      .getByRole("link", { name: "Science & Technology", exact: true })
      .click();
    await expect(page.locator("h1")).toHaveText("Science & Technology");
    await page.goto("/articles/one-more-supper-on-ceres");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator("#article-body")).toBeVisible();
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Skip to content" }),
    ).toBeFocused();
    await page.getByRole("heading", { level: 1 }).click();
    if (name !== "narrow")
      await page.screenshot({
        path: `artifacts/home-${name}.png`,
        fullPage: true,
      });
    await page.locator("img").evaluateAll((nodes) =>
      nodes.forEach((n) => {
        (n as HTMLImageElement).loading = "eager";
      }),
    );
    await page
      .locator("img")
      .evaluateAll((nodes) =>
        Promise.all(nodes.map((n) => (n as HTMLImageElement).decode())),
      );
    const images = await page
      .locator("img")
      .evaluateAll((nodes) =>
        nodes.every(
          (n) =>
            (n as HTMLImageElement).complete &&
            (n as HTMLImageElement).naturalWidth > 0,
        ),
      );
    expect(images).toBe(true);
  });
test("all indexed public routes, artwork, metadata and unknown content behave correctly", async ({
  request,
}) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const paths = [...(await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(
    (m) => new URL(m[1]).pathname,
  );
  expect(paths.length).toBeGreaterThan(100);
  for (let i = 0; i < paths.length; i += 6) {
    const results = await Promise.all(
      paths
        .slice(i, i + 6)
        .map(async (path) => ({ path, response: await request.get(path) })),
    );
    for (const { path, response } of results)
      expect(response.status(), path).toBe(200);
  }
  for (const art of ["mars", "signal", "stage", "sport", "habitat", "cargo"])
    expect((await request.get(`/art/${art}.svg`)).status()).toBe(200);
  for (const path of [
    "/articles/not-published",
    "/entities/missing",
    "/events/missing",
    "/community/missing",
    "/readers/nobody",
  ])
    expect((await request.get(path)).status(), path).toBe(404);
  const article = await request.get("/articles/the-water-that-isnt-there");
  const html = await article.text();
  expect(html).toContain("FICTION ·");
  expect(html).toContain('rel="canonical"');
  expect(html).not.toContain("Her sibling holds a small Helix pension.");
  expect((await request.get("/opengraph-image")).status()).toBe(200);
});

test("the open masthead crosses editorial midnight while article dates stay fixed", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-10-10T04:59:55Z") });
  await page.goto("/");
  // Wait for React hydration before advancing the interval created by LiveDate.
  await page.getByRole("button", { name: "Use light theme" }).click();
  await expect(
    page.getByRole("button", { name: "Use dark theme" }),
  ).toBeVisible();
  await page.clock.runFor(16000);
  await expect(page.locator(".masthead-date time")).toHaveText(
    "October 10, 3026",
  );
  await page.goto("/articles/the-water-that-isnt-there");
  await expect(page.locator(".article-meta time")).toHaveText(
    "October 9, 3026",
  );
});

test("celebrity coverage, original copy, discussion titles and honest identity art remain connected", async ({
  page,
}) => {
  await page.goto("/sections/entertainment");
  await expect(page.locator("h1")).toHaveText("Entertainment.");
  await expect(
    page.locator("main").getByRole("heading", {
      name: "Teo Voss goes solo — and leaves the room noise in",
    }),
  ).toBeVisible();
  await expect(page.locator(".people-grid .person-card")).toHaveCount(6);
  await expect(page.locator(".module-note")).toContainText(
    "No audience rankings",
  );
  await page.goto("/articles/lyra-after-the-lights");
  await page.locator(".presentation-note summary").click();
  await expect(page.locator(".presentation-note")).toContainText(
    "Lyra Saye is leaving the big room quiet",
  );
  await page
    .getByRole("link", { name: "Open this article’s discussion" })
    .click();
  await expect(page.locator("h1")).toHaveText(
    "Lyra Saye postpones Ares benefit. The crew still gets paid.",
  );
  await page.goto("/community?section=entertainment&sort=popular");
  await expect(page.locator(".thread-count strong")).toHaveText(["0", "0"]);
  await page.goto("/entities/lyra");
  await expect(page.locator(".portrait")).toContainText("PORTRAIT PENDING");
  await expect(page.locator(".timeline")).toContainText(
    "Teo Voss releases a solo recording",
  );
  await expect(page.locator(".timeline")).toContainText(
    "The Ares relay benefit is postponed",
  );
  await page.goto(
    "/search?q=Lyra%20Saye%20is%20leaving%20the%20big%20room%20quiet",
  );
  await expect(page.locator(".search-result h2")).toHaveText(
    "Lyra Saye postpones Ares benefit. The crew still gets paid.",
  );
});

test("theme contrast, reduced motion and first-viewport typography", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const pairs = async () =>
    page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      const rgb = (s: string) => {
        const hex = s.trim().replace("#", "");
        const v = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
        return [0, 2, 4]
          .map((i) => parseInt(v.slice(i, i + 2), 16) / 255)
          .map((c) =>
            c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
          );
      };
      const lum = (s: string) => {
        const [r, g, b] = rgb(s);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      return ["--paper", "--panel", "--raised"].flatMap((bg) =>
        ["--ink", "--muted", "--accent"].map((fg) => {
          const a = lum(style.getPropertyValue(bg)),
            b = lum(style.getPropertyValue(fg));
          return {
            bg,
            fg,
            ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
          };
        }),
      );
    });
  for (const p of await pairs())
    expect(p.ratio, JSON.stringify(p)).toBeGreaterThanOrEqual(4.5);
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  await page.getByRole("button", { name: "Use light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  for (const p of await pairs())
    expect(p.ratio, JSON.stringify(p)).toBeGreaterThanOrEqual(4.5);
  await page.getByRole("button", { name: "Use dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
