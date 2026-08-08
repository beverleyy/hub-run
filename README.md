# hub-run

**Endurance travel log.** Trips taken to find out how much travel can be
absorbed before something gives — long days, big time shifts, unprotected
connections across separate tickets. Each trip overshoots on one dimension
rather than being a rehearsal of any particular route.

The current target is the **UA 7 Hub Run** (all seven UA hubs in one calendar
day, 24 October 2026), which sits at the end of the log as the thing the
training points at. It isn't the page's only subject.

The flight-deck theme is **not duplicated here**. It's the
[main site](https://github.com/beverleyy/beverleyy.github.io) checked out as a
submodule. This repo holds one stylesheet, four components and a data file.

## First-time setup

Starting from an empty folder and a new GitHub repo:

```bash
mkdir hub-run && cd hub-run
# copy these files in, then:

git init
git branch -M master          # the workflow triggers on master, not main

# create the theme submodule. .gitmodules is already here as a placeholder;
# this command overwrites its url with whatever you pass.
git submodule add https://github.com/beverleyy/beverleyy.github.io.git theme

git add -A
git commit -m "hub run training log"

# create an EMPTY repo on GitHub (no README, no .gitignore), then:
git remote add origin https://github.com/beverleyy/hub-run.git
git push -u origin master
```

Then in the new repo on GitHub: **Settings → Pages → Source → GitHub Actions**.
The workflow runs on push and deploys.

Locally:

```bash
npm install
npm run dev      # localhost:4321
npm run build    # → dist/
```

Three things that bite:

- **Branch name.** `deploy.yml` triggers on `master`. If your repo ends up on
  `main`, either rename the branch or change the workflow's `branches: [ master ]`.
- **Run `git submodule add` once.** After that it's committed. A second run
  errors with "already exists in the index" — you want
  `git submodule update --remote theme` to bump it instead.
- **The main repo must be public**, or CI can't clone the submodule with the
  default `GITHUB_TOKEN`. If it's private you'd need a deploy key or PAT.

### Cloning it later

```bash
git clone --recurse-submodules https://github.com/beverleyy/hub-run.git
```

Already cloned without `--recurse-submodules`? `git submodule update --init`.
Symptom of forgetting: an empty `theme/` and a build that fails with
`Could not resolve "../../theme/src/components/AltitudeTape.astro"`.

## What's local vs. inherited

```
LOCAL (this repo)
  src/pages/index.astro          the page
  src/layouts/Layout.astro       head, livery boot, HUD corners, style imports
  src/components/
    CapabilityBoard.astro        which endurance dimensions are covered
    RouteRibbon.astro            a trip's shape, mode encoded in the line
    SortieCard.astro             one log entry; renders all three states
    SiteHeader.astro             masthead — differs from the main site's
    SiteFooter.astro             footer — differs from the main site's
  src/data/hubRun.ts             types + ALL content
  src/styles/hubrun.css          the only stylesheet
  src/styles/fonts/              Ailerons

INHERITED (theme/ submodule)
  theme/src/styles/main.css         palettes, typography, HUD, tick-rule
  theme/src/styles/airlines.css     per-livery utility remapping
  theme/src/styles/header.css       masthead LEDs
  theme/src/styles/tape.css         altimeter tape
  theme/src/styles/bottom-tape.css  mobile tape
  theme/src/components/AltitudeTape.astro
  theme/src/components/BottomTape.astro
  theme/src/components/Icon.astro
  theme/src/scripts/site.ts         liveries, tape scroll-spy, anchor routing
```

`SiteHeader` and `SiteFooter` stay local because they genuinely differ: the
masthead mark links back to the main site rather than to `#`, and the footer
credits differ. Everything else is imported as-is.

The theme's `site.ts` is used unchanged. Its hero-instrument and
project-filter blocks are all null-guarded, so they no-op on this page. That
costs about 3 KB of gzipped JS over a hand-trimmed copy, which is the price of
not maintaining a second copy.

### Updating the theme

```bash
git submodule update --remote theme
git add theme && git commit -m "bump theme"
```

A submodule pins a specific commit, so the theme can't change under this repo
without a commit here. That's the point — but it also means palette changes on
the main site don't appear until you bump.

**If the main repo moves `src/styles/` or renames a stylesheet, this build
breaks.** Six import paths in `Layout.astro` and three in `index.astro` are the
whole coupling surface. If that ever gets annoying, vendoring the five CSS
files back into `src/styles/` is a ten-minute change and the imports are the
only thing that moves.

## Deploying

`.github/workflows/deploy.yml` builds on push to `master`. The checkout step
sets `submodules: recursive` — without it the build fails on the CSS imports.

| Where it lives | What to do |
| --- | --- |
| Custom domain, or a user page | Nothing. Default config is correct. |
| Project page — `beverleyy.github.io/hub-run` | Uncomment `base: '/hub-run'` in `astro.config.mjs`. |

Nothing else changes when you set `base`. Two details make that true, both
worth knowing if you add assets:

- **All fonts are re-declared in `hubrun.css`**, pointing at
  `src/styles/fonts/`. The theme self-hosts B612, B612 Mono and Ailerons from
  its own `public/fonts/` using absolute paths like `/fonts/b612-400.woff2`.
  Those resolve against the *main* site, so in this repo they 404 — in dev
  always, and in production whenever `base` is set. There's no Google Fonts
  fallback any more, so the page would silently drop to a system monospace. The
  local declarations come later in the cascade and go through Vite, so their
  URLs are rewritten at build time. **If the theme adds a weight, add it here
  too.**
- **`BASE_URL` has no trailing slash** once `base` is set, so it can't just be
  concatenated. `Layout.astro` normalises it before building the favicon href.

## Editing content

Everything is in `src/data/hubRun.ts`. Nothing else needs touching.

### Trip states

| `status` | Card | Meaning |
| --- | --- | --- |
| `flown` | solid border | happened |
| `planned` | dashed, muted | booked, hasn't happened |
| `scheduled` | dashed, accent | the current target |

Moving a trip from booked to flown is a one-word edit — change `status`, then
fill in `equipment` on the legs. The capability lamps, the objective panel and
the trip counts all follow.

### Add a leg

One object. Leave `equipment` out entirely for anything that isn't an aircraft,
and for anything not yet flown — the cell strikes itself. `carrier` is what
feeds the carrier count, so omit it on surface legs:

```ts
{ date: '12 Sep', mode: 'Road', from: 'LAX', to: 'BUR', service: 'Hired car' },
{ date: '12 Sep', mode: 'Air', from: 'BUR', to: 'SFO', service: 'WN 2431', carrier: 'Southwest' },
```

### Capabilities

The board is the page's argument: which endurance dimensions have actually been
trained, versus merely booked. Each trip declares a `trains` array; the lamps
derive from it.

- **lit** — a flown trip has put me through it
- **ringed** — only a booked trip covers it
- **dark** — nothing on the log reaches it

Add or reword a dimension in the `capabilities` array and tag trips with its
`id`. Nothing in the components needs touching. `seven-sectors` is currently
dark on purpose: it's what the hub run is made of and no trip trains it yet.

A trip doesn't have to fit an existing dimension. The Korea trip's shape —
short domestic hops threaded through a long-haul turnaround — wasn't quite
`long-haul` and wasn't quite `sector-density`, so it got its own tag
(`stopover-chain`) rather than being forced into one that didn't fit.

### Route ribbons

Each card opens with the trip's shape: stops, with the line between them
encoding how that gap was crossed — hairline for air, sleepers for rail, dashed
for sea, dotted for road. Keyed straight off the Mode column's own values, so
the two can't disagree, and derived from the legs, so there's nothing extra to
maintain.

The legend above the log lists **only the modes actually used**, so it never
explains a line style that doesn't appear on the page.

Legs are expected to chain — each departing where the last arrived. Where they
don't, the ribbon shows an explicit break (`SFO Air ORD Air JFK // EWR Air SFO`)
rather than implying a connection that didn't happen. That comes up whenever you
land at one airport and leave from another.

Ribbons are `aria-hidden`: the leg table underneath carries the same
information, properly labelled, so screen readers get it once rather than twice.

### Metrics

Only `tzShift` is hand-entered. **Days, legs and carriers are all derived from
the leg list**, so they can't drift out of step with the table underneath. There
is no separate peak-per-day figure on the cards — days against legs already
carries the density story (1 day / 3 legs reads dense, 3 days / 3 legs reads
spread); the objective panel derives the peak where it's needed.

## Design notes

No trip trains everything, and that's the point the page is built around. One
stacks days and carriers, another stacks departures into a single afternoon,
another drags the clock nine hours and back. So rather than one difficulty
ladder, each entry reports four figures — days, legs, time shift, carriers —
and declares which dimensions it works on.

The **target** is the last entry and reads as not-yet-done: dashed accent
border, and every aircraft cell struck because no tails are assigned. Services
booked, equipment unknown — the same struck-cell mechanic the road leg uses,
doing a second job.

Nothing on the page assumes an aeroplane. Mode is its own column, filled on
every row, and the only air-specific column is Aircraft — labelled in the
highlight colour and struck wherever it doesn't apply. The LAX–BUR leg is a car,
because nobody flies it.

### Theming

Four liveries (Delta, United, American, Southwest) via the LIGHTS × GAIN
toggles. The theme exposes **semantic role tokens**, and a livery is defined by
remapping roles rather than by patching rules per airline:

```
--c-highlight     loud accent: labels, statuses, LEDs, section bars
--c-chrome        instrument furniture: HUD corners, tick rules, tape
--c-emphasis      emphasised text and links
--c-display       the hero wordmark
--c-on-highlight  text drawn on top of --c-highlight
```

**Consume the roles, never `--c-primary` / `--c-accent` / `--c-sky` directly.**
Which palette colour can do a given job differs per livery — Southwest's accent
is a yellow that dies on its navy panel, so its highlight is the red instead.
`hubrun.css` uses `--c-highlight` throughout and therefore needs no per-livery
overrides and no `!important`.

`tailwind.config.mjs` here **must stay in step with the theme's copy.** The
`delta-red` alias resolves to `var(--c-highlight)`, not to `--c-accent` — the
name is historical. Get that wrong and every label on the page turns
near-invisible on Southwest.

The theme also remaps a specific set of Tailwind slate utilities through the
panel variables, so components must use those exact names to stay theme-aware:

```
bg-white dark:bg-slate-950              panel background
bg-slate-100 dark:bg-slate-900          alternate fill
border-slate-300 dark:border-slate-800  borders
text-slate-900 dark:text-slate-100      primary text
text-slate-500 dark:text-slate-500      muted text
text-delta-red                          highlight role
text-delta-navy dark:text-delta-sky     primary / sky pair
```

A shade outside that set won't follow the livery. Note `divide-*` is only
mapped in dark mode, which is why the objective panel uses `border-t` per row
rather than `divide-y`.

### Two things to watch

1. `.leg-eq:empty::after` draws the struck dash, and CSS `:empty` fails on a
   single space. Omit `equipment`; don't set it to `''`.
2. Mobile column labels come from `data-l` on each cell, not `nth-child`. Add
   or reorder columns and you update `data-l` — no positional coupling to get
   wrong.

## Credits

* [Astro](https://astro.build/), [Tailwind CSS](https://tailwindcss.com/),
  [Lenis](https://github.com/darkroomengineering/lenis)
* Ailerons — [Adilson Gonzales](https://www.behance.net/gallery/25541553/Ailerons-Typeface)
* B612 & B612 Mono — [Google Fonts](https://fonts.google.com/specimen/B612)
* Theme, tapes and `site.ts` from
  [beverleyy.github.io](https://github.com/beverleyy/beverleyy.github.io)

Licensed GPL-3.0, matching the main site. Not intended as a template — fork at
your own risk.
