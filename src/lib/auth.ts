import { createHmac, timingSafeEqual } from "node:crypto";
export const cookieName = "tt_editor";
export function adminEnabled() {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.LOCAL_ADMIN_ENABLED === "true" &&
    (process.env.ADMIN_TOKEN?.length || 0) >= 32
  );
}
export const sameSecret = (a: string, b: string) => {
  const x = Buffer.from(a),
    y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};
export function createSession(now = Date.now()) {
  const expires = String(now + 8 * 60 * 60 * 1000);
  return `${expires}.${createHmac("sha256", process.env.ADMIN_TOKEN || "")
    .update(expires)
    .digest("hex")}`;
}
export function validSession(value: string | undefined, now = Date.now()) {
  if (!adminEnabled() || !value) return false;
  const [expires, sig, ...extra] = value.split(".");
  if (extra.length || !/^\d{13}$/.test(expires) || !sig) return false;
  if (Number(expires) <= now || Number(expires) > now + 8 * 60 * 60 * 1000)
    return false;
  return sameSecret(
    sig,
    createHmac("sha256", process.env.ADMIN_TOKEN!)
      .update(expires)
      .digest("hex"),
  );
}
export function allowedOrigin(request: Request) {
  const expected = process.env.ADMIN_ORIGIN || "http://localhost:3000";
  return request.headers.get("origin") === expected;
}
