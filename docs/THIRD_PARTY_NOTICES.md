# Dependencies and asset provenance

The project's rights-reserved notice applies only to original protectable material. Installed dependencies keep their own licenses. No dependency source, browser binary, downloaded font, stock photo or third-party media is committed here. Dependency installs and built bundles must retain upstream notices; this document does not replace required license texts.

## Direct dependencies

Versions and license identifiers were checked in `package-lock.json` and installed package metadata on 2026-10-10.

| Package | Version | Upstream license / source |
| --- | --- | --- |
| Next.js | 16.4.0 | MIT — [vercel/next.js](https://github.com/vercel/next.js) |
| React / React DOM | 19.3.0 | MIT — [facebook/react](https://github.com/facebook/react) |
| better-sqlite3 | 13.0.3 | MIT — [WiseLibs/better-sqlite3](https://github.com/WiseLibs/better-sqlite3); embedded SQLite has separate upstream terms |
| Drizzle ORM | 0.45.4 | Apache-2.0 — [drizzle-team/drizzle-orm](https://github.com/drizzle-team/drizzle-orm) |
| Zod | 4.6.5 | MIT — [colinhacks/zod](https://github.com/colinhacks/zod) |

The lockfile records license metadata for every dependency entry. Across all platforms and development tools: MIT 394; Apache-2.0 39; ISC 16; MPL-2.0 13; LGPL-3.0-or-later 10; BSD-2-Clause 7; BSD-3-Clause 2; three Apache-2.0/LGPL combinations; one Apache-2.0/LGPL/MIT combination; and one each of BlueOak-1.0.0, Python-2.0, CC-BY-4.0, CC0-1.0 and 0BSD. These are package-entry counts, not a claim that all packages ship to browsers.

Review these before distributing executable bundles or vendored dependencies:

- `@img/sharp-libvips-*` and some Sharp platform packages include LGPL components. Images in this app are local SVGs and optimization is disabled, but Next's dependency graph still includes Sharp. Preserve bundled licenses and review obligations for any binary redistribution. Do not apply the project notice to these libraries.
- `caniuse-lite` records CC-BY-4.0 data; [upstream data and notices](https://github.com/browserslist/caniuse-lite) remain applicable.
- Development dependencies `lightningcss` and `axe-core` record MPL-2.0; `argparse` records Python-2.0. No third-party source was modified by this audit.
- Browser testing uses an ignored local Chromium download, not a checked-in browser distribution.

This is a dependency/provenance inventory, not a legal clearance of every transitive component or a guarantee of ownership. Keep `node_modules` and build output out of Git; retain upstream license files in any future deployment package.

## Project assets

| Material | Evidence / treatment |
| --- | --- |
| Twelve SVG editorial compositions | Authored in this repository under `public/art/`; source is inspectable; no external image downloads or real-person likenesses. |
| Orbital T wordmark and favicon | Repository-authored SVG/code in `src/components/shell.tsx` and `public/favicon.svg`. |
| Open Graph image | Rendered from project text and layout by `src/app/opengraph-image.tsx`; Next supplies its bundled font. No custom external font was downloaded. |
| Documentation screenshots | Actual local V2 application captures in `docs/screenshots/`; fictional public pages only; no browser chrome, account UI, admin data or private URL. |
| Portraits and missing imagery | Clearly labeled monograms/typography. No face generator is connected. |
| News, cast and canon | Versioned project fiction in `src/data` and `src/editorial`, developed with AI coding assistance under owner direction. Source provenance is not a legal ownership determination. |

`src/editorial/image-fallbacks.json` records per-asset status, credit and references. Unexecuted generation briefs do not establish rights in a future image. The owner must review any future commissioned/generated media and any contributor or platform terms before publication. All characters, organizations, reporting and pictured scenes are fictional.
