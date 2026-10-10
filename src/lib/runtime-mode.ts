export const showcaseEnabled = () => process.env.SHOWCASE_MODE === "true";

export function assertHostingMode() {
  if (process.env.VERCEL === "1" && !showcaseEnabled()) {
    throw new Error(
      "Vercel requires the read-only SHOWCASE_MODE configuration",
    );
  }
}
