# Actual V2 application screenshots

Captured on 2026-10-10 from a local production-mode read-only showcase using Chromium. The clock was not mocked. Only fictional public pages were visited; no browser chrome, private address, credential, admin record or real reader data is pictured.

| File | Viewport | Route | Bytes | SHA-256 |
| --- | --- | --- | --- | --- |
| [article-desktop.webp](article-desktop.webp) | 1440 × 1040 | `/articles/lyra-after-the-lights` | 61,936 | `df76e27a252756c3174eef18eb83b72c30667864fec9d0dd78fa2ca80bb08f93` |
| [home-desktop.webp](home-desktop.webp) | 1440 × 1040 | `/` | 105,220 | `088f0299f4927e7d6bd6948aba2fce5b5c1fbcf222a1ae94931fd8cfbe618ff2` |
| [home-mobile.webp](home-mobile.webp) | 390 × 844 | `/` | 42,814 | `3ad4e362f4b91f4f082d5640830c63e84bd3b371b40f0775164d94183a9c753f` |

Total: **209,970 bytes**. PNG viewport captures were encoded as WebP at quality 85 with Sharp; the app content was not composited, retouched or generated. All three images were visually inspected. Original artwork and software notices are covered in [asset provenance](../THIRD_PARTY_NOTICES.md).

To reproduce with an already running local showcase and installed Playwright browser:

```bash
node scripts/capture-readme.mjs
```

If the browser is cached in the documented temporary Codespaces directories, set the browser path/library variables used by `scripts/browser-test.mjs` before capture. The script accepts only loopback preview origins. Full responsive review artifacts stay ignored under `artifacts/v2-visual-review/`.
