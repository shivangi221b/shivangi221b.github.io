# shivangi221b.github.io

Personal site. Static HTML/CSS/JS, no build step, no dependencies.

```
index.html    structure and all the prose (hero, journey, off hours, contact)
data.js       ← projects, timeline, and papers live here. Edit this most.
styles.css    design tokens at the top; change --accent to reskin the whole site
script.js     rendering, filters, theme toggle, scroll reveal
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

- [ ] Replace the `20XX` placeholders in `data.js` → `TIMELINE` with real years
- [ ] Drop `resume.pdf` into `assets/docs/` (the hero button links to it)
- [ ] Add demo videos — see `assets/README.md`
- [ ] Add the NutriGraph repo link and the ACM report PDF in `data.js`
- [ ] Confirm your LinkedIn URL in `index.html` (currently `linkedin.com/in/shivangi9`)
- [ ] Swap `assets/docs/nutrigraph-report.pdf` in or remove that link
- [ ] Optional: add an `og-image.png` (1200×630) and point the `og:image` meta tag at it,
      so links to your site preview nicely in Slack/LinkedIn

## Editing cheatsheet

**Add a project** — append an object to `PROJECTS` in `data.js`. Set
`featured: true` for a big card near the top, `false` for the compact grid
below. Tags automatically become filter chips.

**Change the accent colour** — `styles.css`, line ~10: `--accent`. There's a
matching value in the dark-theme block below it, and one in the favicon data
URI in `index.html`.

**Reorder sections** — move the `<section>` blocks in `index.html`. The nav
links are just anchors to their `id`s.
