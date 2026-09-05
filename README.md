# shivangi221b.github.io

Personal site. Static HTML/CSS/JS, no build step, no dependencies.

```
index.html    structure and all the prose (hero, sections, footer)
data.js       ← projects, clusters, skills, timeline, papers. Edit this most.
graph.js      the project map: layout, edges, selection, the depth control
styles.css    design tokens at the top; change --accent to reskin the whole site
script.js     list rendering, filters, view toggle, theme, motion, backgrounds
assets/       videos, images, resume/PDFs (see assets/README.md)
```

---

## Deploy to GitHub Pages

**Free, no custom domain required.** Takes about five minutes.

### 1. Create the repo

Go to https://github.com/new and name it **exactly**:

```
shivangi221b.github.io
```

That exact name (`<your-username>.github.io`) is what makes it a user site,
served from the root of `https://shivangi221b.github.io`. Set it to **Public**.
Do **not** add a README, .gitignore, or license — this folder already has them.

### 2. Push this folder

From this directory:

```bash
git init -b main
git add .
git commit -m "Personal site"
git remote add origin https://github.com/shivangi221b/shivangi221b.github.io.git
git push -u origin main
```

If it asks for a password, use a personal access token, not your GitHub
password (https://github.com/settings/tokens → "Generate new token (classic)"
→ check `repo`). Or set up SSH once and use
`git@github.com:shivangi221b/shivangi221b.github.io.git` instead.

### 3. Turn Pages on

Repo → **Settings** → **Pages** (left sidebar) →
**Source: Deploy from a branch** → **Branch: `main`**, folder **`/ (root)`** →
**Save**.

For a `username.github.io` repo, Pages is usually already on and pointed at
`main` — check anyway.

### 4. Wait ~60 seconds

The **Actions** tab shows a "pages build and deployment" run. When it goes
green, your site is live at:

```
https://shivangi221b.github.io
```

Every `git push` to `main` redeploys automatically. Hard-refresh
(<kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>) if you don't see a change —
Pages caches aggressively.

---

## Preview locally before you push

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Use this rather than double-clicking
`index.html` — some browsers restrict `file://` pages.

---

## Optional: a custom domain

`shivangi221b.github.io` is free and perfectly professional. If you'd rather
have `shivangikumar.com` (~$12/year at Namecheap, Cloudflare, or Porkbun):

1. Buy the domain.
2. At your registrar, add these DNS records:

   | Type | Host | Value |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | shivangi221b.github.io |

3. Repo → Settings → Pages → **Custom domain** → enter it → Save.
4. Wait for the DNS check to pass, then tick **Enforce HTTPS**.

GitHub creates a `CNAME` file in the repo when you do this. Leave it there.

---

## TODO before you go live

- [ ] Add the NutriGraph repo link and its report PDF (`assets/docs/`), or drop that link from `data.js`
- [ ] Optional: an `og-image.png` at 1200x630, referenced from an `og:image` meta tag, so links preview well in Slack and LinkedIn
- [ ] Optional: project cards are text only right now. To show demos, give a project a `media` object in `data.js` and uncomment the one line in `card()` in `script.js`. `assets/img/RL Integration Architecture Diagram.png` is sitting there unused and would work as the image for the ASR project.

## Editing cheatsheet

**Add a project.** Append an object to `PROJECTS` in `data.js`. Set
`featured: true` for a card in the main grid, `false` for the compact list
below it. Tags become filter chips automatically. Every card carries a 16:9
media slot; with `media: null` it shows a patterned tile until you add a demo.

**Change the accent colour.** `styles.css`, near the top: `--accent`. There is
a matching value in the dark-theme block below it, a `--node` RGB triple that
drives the background graph, and one in the favicon data URI in `index.html`.

**Reorder sections.** Move the `<section>` blocks in `index.html`. The nav
links are anchors to their `id`s.

**Edit the project map.** Each project needs `domain` (its cluster), `pos`
(where the card sits: `x` is a percentage of the map width, `y` is pixels from
the top), `short` and `line` (the one-sentence version shown before you scroll).
Cards are 22% wide and 230px tall, so leave 250px of vertical clearance between
two cards in the same column, and remember two cards collide when their x values
are within about 22 of each other. `DOMAINS` holds the cluster labels and their
positions; `MAP_HEIGHT` sets how tall the map is. Two projects are joined by a
line when they share a cluster or a tag, and the `HAIRBALL` list in `graph.js`
excludes tags that sit on nearly everything, which is why "ML" draws no edges.

Each card scrolls: the title, the one-liner and the links sit above the fold,
and `blurb`, `detail` and the stack are underneath. Below 1040px the map drops
its positioning and the cards flow as an ordinary grid with the lines hidden.

**Edit the core skills.** `CORE_SKILLS` in `data.js` is the static, highlighted
row recruiters see first.

**Edit the skills marquee.** `SKILLS` in `data.js` is three arrays, one per
scrolling row. Middle row scrolls the other way. Each row repeats itself until
it is wider than the screen so the loop never shows a gap. Speeds are the
`animation-duration` values on `.mtrack` in `styles.css`. Rows pause on hover
and stop entirely for reduced-motion visitors.

**Tune the motion.** Three pieces, all in `script.js`. The section numbers and
the word-by-word titles are built in the "editorial furniture" block; change the
`55` in `transitionDelay` for a faster or slower title stagger. Card tilt angles
are the `3.4` and `5.0` in the `.pcard` mousemove handler; set both to 0 to turn
tilt off and keep the light sweep. The waveform divider is its own block: `amp`
rests around 7 and swells with scroll speed up to 30. Everything here is off for
visitors with reduced motion enabled.

**The page-wide graph background is off.** It clashed with the project map, so
the `<canvas id="bg">` element was removed from `index.html`. The code that drew
it is still at the bottom of `script.js` and simply exits when it cannot find
the element, so putting that one line back in the body switches it on again.

**Tune the background.** The graph constellation lives at the bottom of
`script.js`. `LINK_DIST` controls how far apart two nodes can be and still
draw an edge, `PULL_DIST` is the cursor's reach, `MAX_OFFSET` caps how far a node
may travel from home (this is what stops it collapsing into a knot), and
`density()` sets how many nodes there are. Raise `LINK_DIST` or `density()` for a
busier web; the alpha values in `step()` control how visible it is. It turns itself off on touch devices, narrow screens, and for
anyone with reduced motion enabled.
