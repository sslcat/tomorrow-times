import Link from "next/link";
export default function NotFound() {
  return (
    <div className="empty-state">
      <p className="eyebrow">404 / OUTSIDE THE PUBLIC RECORD</p>
      <h1>This story isn’t on the page.</h1>
      <p>The address may have changed, or the record may not be published.</p>
      <Link href="/search">Search the Reach →</Link>
    </div>
  );
}
