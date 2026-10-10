import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { fictionalDate } from "../../src/lib/calendar";

test("showcase denies every write action/method and leaves its snapshot unchanged", async ({
  request,
}) => {
  const digest = () =>
    createHash("sha256")
      .update(fs.readFileSync(".showcase/published.sqlite"))
      .digest("hex");
  const before = digest();
  const actions = [
    "login",
    "logout",
    "generate",
    "approve-event",
    "draft",
    "edit",
    "approve-draft",
    "publish",
    "reject-event",
    "reject-article",
    "schedule",
    "settings",
    "correct",
    "retract",
    "moderate",
  ];
  for (const action of actions) {
    const response = await request.post("/api/admin", {
      data: { action, token: process.env.E2E_ADMIN_TOKEN },
      headers: { origin: "http://127.0.0.1:3001" },
    });
    expect(response.status(), action).toBe(403);
    expect(response.headers()["set-cookie"]).toBeUndefined();
  }
  for (const endpoint of ["/api/admin", "/api/community"]) {
    expect(
      (await request.post(endpoint, { data: "x".repeat(50000) })).status(),
    ).toBe(403);
    for (const method of ["GET", "PUT", "PATCH", "DELETE"]) {
      expect((await request.fetch(endpoint, { method })).status()).toBe(405);
    }
  }
  expect(digest()).toBe(before);
  expect(fs.readdirSync(".showcase")).toEqual(["published.sqlite"]);
});

test("showcase metadata, secrets, private routes and server clock remain safe", async ({
  request,
}) => {
  const home = await request.get("/");
  const html = await home.text();
  const csp = home.headers()["content-security-policy"];
  expect(csp).not.toContain("unsafe-eval");
  expect(csp).not.toContain("wss:");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(home.headers()["x-content-type-options"]).toBe("nosniff");
  expect(home.headers()["x-frame-options"]).toBe("DENY");
  expect(home.headers()["x-powered-by"]).toBeUndefined();
  expect(home.headers()["cache-control"]).toContain("no-store");
  expect(html).toContain(`dateTime="${fictionalDate()}"`);
  expect(html).not.toContain(process.env.E2E_ADMIN_TOKEN!);
  expect(html).not.toContain("unsent letter");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("https://showcase.example.invalid/");
  expect(sitemap).not.toMatch(
    /localhost|lyra-listening-room|\/admin|\/readers/,
  );
  for (const url of [
    "/.env",
    "/.env.local",
    "/.showcase/published.sqlite",
    "/data/tomorrow-times.sqlite",
    "/events/v2-lyra-listening-room-proposal",
    "/storylines/lyra-listening-room",
    "/articles/v2-lyra-listening-room-proposal-report",
  ]) {
    expect((await request.get(url)).status(), url).toBe(404);
  }
  expect(
    (
      await request.get(
        "/_next/image?url=https%3A%2F%2Fexample.invalid%2Fimage.jpg&w=640&q=75",
      )
    ).status(),
  ).toBeGreaterThanOrEqual(400);
});

test("untrusted search text and malformed pagination are harmless", async ({
  page,
  request,
}) => {
  const dialogs: string[] = [];
  page.on("dialog", (dialog) => {
    dialogs.push(dialog.message());
    void dialog.dismiss();
  });
  await page.goto(
    "/search?q=" +
      encodeURIComponent('<script>alert("probe")</script>\' OR 1=1 --'),
  );
  await expect(
    page.getByText("No matches in the public record."),
  ).toBeVisible();
  expect(dialogs).toEqual([]);
  for (const value of ["1.5", "NaN", "Infinity", "-100", "' OR 1=1 --"]) {
    expect(
      (
        await request.get(
          "/community/discussion-lyra-after-the-lights?page=" +
            encodeURIComponent(value),
        )
      ).status(),
    ).toBe(200);
  }
});
