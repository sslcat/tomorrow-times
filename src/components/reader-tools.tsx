"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { displayDate, fictionalDate } from "@/lib/calendar";
import type { Article } from "@/lib/contracts";
const key = "tomorrow-preferences-v1";
const subscribe = (fn: () => void) => {
  window.addEventListener("storage", fn);
  window.addEventListener("tt-preferences", fn);
  return () => {
    window.removeEventListener("storage", fn);
    window.removeEventListener("tt-preferences", fn);
  };
};
const snapshot = () => {
  try {
    return localStorage.getItem(key) || "{}";
  } catch {
    return "{}";
  }
};
function read(value: string): { bookmarks: string[]; follows: string[] } {
  try {
    const p = JSON.parse(value);
    return {
      bookmarks: Array.isArray(p.bookmarks)
        ? p.bookmarks.filter((s: unknown) => typeof s === "string")
        : [],
      follows: Array.isArray(p.follows)
        ? p.follows.filter((s: unknown) => typeof s === "string")
        : [],
    };
  } catch {
    return { bookmarks: [], follows: [] };
  }
}
export function SaveButton({
  id,
  kind = "bookmarks",
}: {
  id: string;
  kind?: "bookmarks" | "follows";
}) {
  const data = read(useSyncExternalStore(subscribe, snapshot, () => "{}"));
  const active = data[kind].includes(id);
  const [error, setError] = useState("");
  return (
    <>
      <button
        className="save-button"
        aria-label={
          kind === "bookmarks"
            ? active
              ? "Saved"
              : "Save article"
            : active
              ? "Following"
              : "Follow"
        }
        aria-pressed={active}
        onClick={() => {
          try {
            const latest = read(snapshot());
            latest[kind] = active
              ? latest[kind].filter((v) => v !== id)
              : [...new Set([...latest[kind], id])];
            localStorage.setItem(key, JSON.stringify(latest));
            window.dispatchEvent(new Event("tt-preferences"));
          } catch {
            setError("Your browser could not save this preference.");
          }
        }}
      >
        {active ? "✓ " : kind === "bookmarks" ? "+ " : "+ "}
        {kind === "bookmarks"
          ? active
            ? "Saved"
            : "Save article"
          : active
            ? "Following"
            : "Follow"}
      </button>
      {error && <span role="status">{error}</span>}
    </>
  );
}
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const article = document.getElementById("article-body");
      if (!article) return;
      const top = article.getBoundingClientRect().top + window.scrollY;
      const total = article.offsetHeight - window.innerHeight * 0.4;
      setProgress(
        Math.max(
          0,
          Math.min(
            100,
            (100 * (window.scrollY - top + window.innerHeight * 0.2)) /
              Math.max(total, 1),
          ),
        ),
      );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <div
      className="reading-progress"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: `${progress}%` }} />
    </div>
  );
}
export function LiveDate({ initial, zone }: { initial: string; zone: string }) {
  const [date, setDate] = useState(initial);
  useEffect(() => {
    const update = () => setDate(fictionalDate(new Date(), zone));
    const timer = setInterval(update, 15000);
    document.addEventListener("visibilitychange", update);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, [zone]);
  return <time dateTime={date}>{displayDate(date, true)}</time>;
}
export function ThemeButton() {
  const [dark, setDark] = useState(false);
  return (
    <button
      className="quiet-button theme-button"
      aria-label={dark ? "Use light theme" : "Use dark theme"}
      onClick={() => {
        setDark(!dark);
        document.documentElement.dataset.theme = dark ? "light" : "dark";
      }}
    >
      {dark ? "☀" : "◐"}
    </button>
  );
}
export function ReadingList({
  articles,
  followOptions,
}: {
  articles: Article[];
  followOptions: { id: string; name: string; href: string }[];
}) {
  const data = read(useSyncExternalStore(subscribe, snapshot, () => "{}"));
  const saved = articles.filter((a) => data.bookmarks.includes(a.id));
  const follows = followOptions.filter((e) => data.follows.includes(e.id));
  return (
    <>
      <h2>
        Saved for later <span className="count">{saved.length}</span>
      </h2>
      {saved.length ? (
        <div className="story-list">
          {saved.map((a) => (
            <article key={a.id}>
              <div>
                <p className="eyebrow">{a.format}</p>
                <h3>
                  <Link href={`/articles/${a.id}`}>{a.title}</Link>
                </h3>
                <p>{a.dek}</p>
              </div>
              <SaveButton id={a.id} />
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>A little room for a longer read.</h3>
          <p>
            Save an article and it will be here when you return on this browser.
          </p>
          <Link href="/">Explore the front page →</Link>
        </div>
      )}
      <h2 className="section-title">
        Your follows <span className="count">{follows.length}</span>
      </h2>
      {follows.length ? (
        <div className="profile-grid">
          {follows.map((e) => (
            <div className="profile-card" key={e.id}>
              <h3>
                <Link href={e.href}>{e.name}</Link>
              </h3>
              <SaveButton id={e.id} kind="follows" />
            </div>
          ))}
        </div>
      ) : (
        <p className="muted">
          Follow a person, place or storyline from its profile to find it here.
        </p>
      )}
    </>
  );
}
export function ShareButton() {
  const [message, setMessage] = useState("");
  return (
    <button
      className="quiet-button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setMessage("Link copied");
        } catch {
          setMessage("Copy the address from your browser");
        }
      }}
    >
      {message || "Copy link ↗"}
    </button>
  );
}
