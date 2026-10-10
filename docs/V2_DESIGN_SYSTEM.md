# Tomorrow Times / Common Reach network

## Identity and hierarchy

Compact orbital T symbol and a bold, tightly spaced sans-serif wordmark. The editorial idea is **Famous across worlds. Human everywhere.** Entertainment leads; independent reporting keeps the wider civilization visible. All reporting remains prominently fictional. Dates identify editions, not synthetic live activity.

## Color and typography

Default ink theme: background #0b0d14, surface #131722, raised surface #1b2030, text #f3f2f8, muted #acb1c3, separator #303646. Violet #c3b1ff identifies entertainment; amber #f0bc76 identifies reporting in development. Cool mint #a7ddce is a secondary location accent. Use atmospheric light in artwork, not decorative gradients on every card.

Light reading: background #f4f5fa, surface #ffffff, text #171c2c, muted #50586c, accent #6742ae. Cinematic art stays dark with explicitly light text. Existing theme control remains available.

System sans stack: Inter when installed, then Arial/Helvetica; no remote fonts. Display type uses confident 600–750 weight and tight tracking. Body uses 17–19px with 1.7 line height; article measure 65–70 characters. Metadata is 12px minimum; mobile controls are at least 44px tall. No newspaper drop caps. Monospace is reserved for short dates, indexes and illustration annotations.

## Layout

Content maximum 1440px, 40px desktop gutters, 20px mobile gutters. At 1920px the reading grid stays bounded. Hero is a 2:1 desktop composition with a tall violet-lit stage, headline at the foot and two supporting stories. Mobile stacks with the headline outside the crop when necessary. Secondary coverage alternates image-led cards, compact numbered briefing rows, a people rail and a location index. Avoid an all-cards dashboard.

Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 80px. Radius 4–8px, occasionally fully round for small identity tokens. Breakpoints: 580px small phone, 800px tablet navigation, 1100px compact desktop. Validate intermediate widths rather than relying on named devices.

## Components and imagery

`EditorialImage`: approved article-specific local assets, responsive hero/card crops with typed focal points; pending/unknown assets resolve to labeled typographic compositions. `Portrait`: deterministic monogram identity with a visible reference-pending disclosure on the profile, never an invented face. Approved original abstract art is labeled as illustration; approval means approval for illustration use, not documentary accuracy or character canon.

Cards: cinematic lead, image card, compact text briefing. Supporting modules: published-event timeline, public profile with homeworld and collaborators, Across the Reach location index, real-publication People to Watch ranking, reader discussion with actual comment count. Existing admin form selectors and semantics stay intact.

## Interaction and accessibility

Native links, buttons, forms and details. Strong 3px violet focus ring, skip link, semantic landmarks, explicit input labels, descriptive image alt text and readable date markup. Mobile menu exposes all twelve sections plus discovery. Hover only adds a subtle border or underline; no looping animation, autoplay, ticker movement or WebGL. Reduced motion disables smooth scrolling and transitions. Image motion never carries information. Test primary and muted text contrast in both themes, touch targets, 200% zoom-equivalent layouts and all requested viewport widths.
