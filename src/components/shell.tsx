import Link from "next/link";
import { sections } from "@/lib/contracts";
import { fictionalDate, editorialZone } from "@/lib/calendar";
import { publication } from "@/lib/publication";
import { LiveDate, ThemeButton } from "./reader-tools";
const nav = [
  ["entertainment", "Entertainment"],
  ["crime", "Crime & Justice"],
  ["politics", "Politics"],
  ["science", "Science"],
  ["sports", "Sports"],
  ["business", "Business"],
  ["culture", "Culture"],
];
export function Brand() {
  return (
    <Link
      className="wordmark"
      href="/"
      aria-label={`${publication.name} — front page`}
    >
      <svg
        className="brand-symbol"
        width="42"
        height="42"
        viewBox="0 0 42 42"
        fill="none"
        aria-hidden="true"
      >
        <path d="M7 10h28l-4 6H24v19h-7V16H7z" fill="currentColor" />
        <ellipse
          cx="21"
          cy="22"
          rx="21"
          ry="9"
          transform="rotate(-35 21 22)"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
      <span>
        <small>THE</small>TOMORROW<span className="wordmark-times"> TIMES</span>
      </span>
    </Link>
  );
}
export function Header() {
  return (
    <>
      <div className="fiction-bar">
        <span>FICTIONAL NEWS. REAL HUMAN DRAMA.</span>
        <Link href="/about">
          Welcome to the year 3026 <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <header className="site-header">
        <div className="masthead">
          <Brand />
          <div className="masthead-date">
            <LiveDate initial={fictionalDate()} zone={editorialZone()} />
            <span>THE COMMON REACH EDITION</span>
          </div>
          <div className="header-tools">
            <Link href="/search">
              <svg
                width="17"
                height="17"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="5.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path d="m12 12 5 5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              Search
            </Link>
            <Link href="/reading-list" className="reading-list-link">
              Reading list <span aria-hidden="true">+</span>
            </Link>
            <ThemeButton />
          </div>
        </div>
        <nav className="desktop-nav" aria-label="Sections">
          <Link href="/">The edition</Link>
          {nav.map(([id, name]) => (
            <Link
              className={
                id === "entertainment" ? "entertainment-nav" : undefined
              }
              href={`/sections/${id}`}
              key={id}
            >
              {name}
            </Link>
          ))}
          <Link href="/community">Community</Link>
          <details className="more-nav">
            <summary>Explore +</summary>
            <div>
              {sections
                .filter(([id]) => !nav.some(([n]) => n === id))
                .map(([id, name]) => (
                  <Link key={id} href={`/sections/${id}`}>
                    {name}
                  </Link>
                ))}
              <Link href="/universe">People & places</Link>
              <Link href="/storylines">Storylines</Link>
              <Link href="/archives">Archives</Link>
            </div>
          </details>
        </nav>
        <details className="mobile-nav">
          <summary>
            Explore the Reach <span aria-hidden="true">☰</span>
          </summary>
          <nav aria-label="Mobile sections">
            <Link href="/">The edition</Link>
            <Link href="/sections/entertainment">Entertainment</Link>
            {sections
              .filter(([id]) => id !== "entertainment")
              .map(([id, name]) => (
                <Link href={`/sections/${id}`} key={id}>
                  {name}
                </Link>
              ))}
            <Link href="/reading-list">Reading list</Link>
            <Link href="/community">Community</Link>
            <Link href="/universe">People & places</Link>
            <Link href="/storylines">Storylines</Link>
            <Link href="/archives">Archives</Link>
          </nav>
        </details>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Brand />
        <p>{publication.tagline}</p>
        <p className="footer-disclosure">
          All reporting, people and events are fictional.
          <br />
          An evolving universe, made to be read.
        </p>
      </div>
      <nav aria-label="Footer">
        <Link href="/about">About & editorial standards</Link>
        <Link href="/universe">People & places</Link>
        <Link href="/storylines">Follow the story</Link>
        <Link href="/archives">The archive</Link>
        <Link href="/community">Reader community</Link>
        <Link href="/admin">Editorial desk</Link>
      </nav>
      <p className="footer-note">
        A thousand years ahead.
        <br />
        Still a human story.
      </p>
    </footer>
  );
}
