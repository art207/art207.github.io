# Personal site (blog + docs + dashboard)

A plain HTML/CSS/JS site, no build step, ready for GitHub Pages.

```
site/
├── index.html              home page
├── blog/
│   ├── index.html          blog listing
│   └── scaling-notes.html  example post (has comments)
├── docs/
│   └── index.html          documentation, sidebar nav
├── dashboard/
│   ├── index.html          live repo stats
│   └── dashboard.js
└── assets/
    ├── style.css
    └── main.js
```

## 1. Publish it on GitHub Pages

1. Create a repo named `your-username.github.io` (must match exactly for a user site), or any name for a project site.
2. Push these files to the repo's default branch (`main`).
3. In the repo, go to **Settings → Pages**, set **Source** to "Deploy from a branch", branch `main`, folder `/ (root)`. Save.
4. Your site is live at `https://your-username.github.io` (user site) or `https://your-username.github.io/repo-name` (project site) within a minute or two.

If you used a project-site name (not `your-username.github.io`), update the internal links — they're all relative, so they'll keep working either way.

## 2. Point the live stats at your repo

Open `assets/main.js` and edit:

```js
const GH_USERNAME = "your-username";
const GH_REPO = "your-username.github.io";
```

This powers:
- the small "synced ⟨date⟩" indicator in the header (latest commit date)
- the dashboard's star/fork/issue counts and language breakdown

Both fall back gracefully (a static label, demo data) if the API call fails, so nothing looks broken before you've filled this in.

## 3. Turn on comments

Comments use [giscus](https://giscus.app), which stores them as GitHub Discussions on your repo — no server or database needed.

1. In your repo, go to **Settings → General → Discussions** and enable it.
2. Go to giscus.app, fill in your repo, and it generates a `<script>` tag with your repo/category IDs already filled in.
3. In `blog/scaling-notes.html` (and any future post), replace the placeholder `<script src="https://giscus.app/client.js" ...>` block with the one giscus.app generated for you.

## 4. Add your own content

- **Blog posts**: duplicate `blog/scaling-notes.html`, edit the title/date/body, and add a `<li>` for it in `blog/index.html` and (optionally) the homepage log.
- **Docs**: edit `docs/index.html` directly — each `<h2 id="...">` becomes a sidebar link. Split into multiple files later if it grows.
- **Homepage log**: the `<ul class="log">` in `index.html` is a manually-curated feed — add a line each time you publish something.

## Notes

- Fonts (Source Serif 4 / Inter / IBM Plex Mono) load from Google Fonts via CDN — no local font files needed.
- No frameworks, no build step — edit HTML/CSS/JS directly and push.
- The GitHub API is unauthenticated and rate-limited (60 requests/hour per visitor IP), which is plenty for a personal site with light traffic.
