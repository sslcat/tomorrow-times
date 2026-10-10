import fs from "node:fs";
import nextEnv from "@next/env";
import { assertHostingMode, showcaseEnabled } from "../src/lib/runtime-mode";
import { buildShowcaseSnapshot } from "./lib/showcase-snapshot";

nextEnv.loadEnvConfig(process.cwd(), false);
assertHostingMode();
if (showcaseEnabled()) {
  fs.mkdirSync(".showcase", { recursive: true });
  const snapshot = buildShowcaseSnapshot();
  fs.writeFileSync(".showcase/published.sqlite.next", snapshot, {
    mode: 0o444,
  });
  fs.renameSync(
    ".showcase/published.sqlite.next",
    ".showcase/published.sqlite",
  );
  console.log(
    `Prepared read-only fictional opening edition (${snapshot.length} bytes); local data was not opened.`,
  );
}
