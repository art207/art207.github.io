# Personal site (blog + docs + dashboard)

A Jekyll site built on GitHub Pages' native, zero-config Jekyll build — no GitHub Actions, no local Ruby/Jekyll install required. Posts are Markdown files with front matter; everything else (nav, header/footer, page shells) lives in shared layouts/includes instead of being copy-pasted per page.

```
site/
├── _config.yml             site settings, collections, plugin list
├── _layouts/
│   ├── default.html        base page shell (head, header, footer, scripts)
│   ├── post.html           wraps a _posts entry in <article class="post">
│   └── docs.html           wraps docs/index.html in the sidebar layout
├── _includes/
│   ├── header.html         site header/nav (shared across every page)
│   ├── footer.html         site footer
│   ├── embed.html          the reusable Power BI / iframe embed partial
│   └── docs-nav.html       docs sidebar, driven by _data/docs_nav.yml
├── _data/
│   ├── nav.yml             top nav links
│   ├── docs_nav.yml        docs sidebar groups/anchors
│   └── site_stats.yml      small hand-edited numbers (report count, "writing since")
├── _posts/                 blog posts — one Markdown file per post (see below)
├── _activity/              non-post homepage timeline entries (docs/project/build updates)
├── index.html              homepage: hero + section cards + activity timeline
├── about/index.html        About page (work experience, skills, contact)
├── blog/index.html         blog listing — auto-generated from _posts, nothing to hand-edit
├── docs/index.html         documentation content (sidebar comes from the docs layout)
├── dashboard/
│   ├── index.html          live repo stats + embedded Power BI report
│   └── dashboard.js
├── admin/
│   ├── login.html          password gate (see "Admin tools" below)
│   └── new-post.html       fill-in-a-form generator for posts and activity entries
└── assets/
    ├── style.css
    └── main.js
```

## 1. Publish it on GitHub Pages

1. Create a repo named `your-username.github.io` (must match exactly for a user site), or any name for a project site.
2. Push these files to the repo's default branch (`main`).
3. In the repo, go to **Settings → Pages**, set **Source** to "Deploy from a branch", branch `main`, folder `/ (root)`. Save.
4. GitHub Pages detects `_config.yml` and runs its own Jekyll build automatically — nothing to install or configure. Your site is live at `https://your-username.github.io` (user site) or `https://your-username.github.io/repo-name` (project site) within a minute or two.
5. If a build ever fails silently (no visible error on the live site), check **Settings → Pages** for a red build-status banner, or your GitHub notification email — this is the only build feedback GitHub Pages gives without setting up GitHub Actions. The most common cause is a YAML front matter typo (an unescaped `"` or `:` inside a quoted value).

Update `_config.yml`'s `url:` and `title:` for your own domain/name.

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

Comments use [Disqus](https://disqus.com), which lets readers post **as a guest — no sign-in required**. (If you'd rather have GitHub-account-only, ad-free comments instead, [giscus](https://giscus.app) is a good swap — ask me and I'll wire it back in.)

1. Create a free account at disqus.com and register your site ("I want to install Disqus on my site") to get a **shortname**.
2. Open `assets/main.js` and set:
   ```js
   const DISQUS_SHORTNAME = "your-shortname";
   ```
3. That's it — every post's `<div id="disqus_thread"></div>` (in `_layouts/post.html`) picks it up automatically. Disqus's free tier shows some ads; their paid tiers remove them.

## 4. Dark / light mode

There's a toggle button (sun/moon icon) in the header on every page. It respects the visitor's system preference on first visit, then remembers their choice. Nothing to configure — it just works.

## 5. Add a blog post or activity entry

Use `admin/new-post.html` (see "Admin tools" below), or create the file by hand:

**A blog post** — create `_posts/YYYY-MM-DD-your-slug.md`:
```markdown
---
layout: post
title: "Your title"
date: 2026-07-28
kind: post              # post | incident | build — controls chip/dot color
readtime: "5 min read"
excerpt: "One sentence shown on the blog listing page."
embed_url: ""            # optional — a Power BI (or other) embed URL
---
Write the post body here in plain Markdown. Blank line = new paragraph,
`## heading` for a subheading, `> quote` for a pull-quote.
```
That's the whole workflow — `blog/index.html` and the homepage timeline both discover it automatically on the next build. Nothing else to edit.

**An activity entry** (a short homepage-timeline line that isn't a full post — a docs update, a project milestone) — create `_activity/YYYY-MM-DD-your-slug.md`:
```markdown
---
title: "Rewrote the getting started guide"
date: 2026-07-28
kind: docs               # docs | project | build | incident
link: "/docs/#getting-started"
---
```
No body needed — this collection only ever feeds the homepage timeline, it doesn't render its own page.

Both file types can be created entirely from GitHub.com's web editor ("Add file → Create new file") — no local git or terminal required.

## 6. Admin tools (post generator)

`admin/new-post.html` is a form: pick "blog post" or "activity entry", fill in the fields, hit **Generate**, and it produces the exact Markdown + front matter file to save — copy or download it, create that file path on GitHub, and commit. It's gated behind `admin/login.html` so it's not the first thing visitors stumble into.

**Set your password:**
1. Open any page on your live site, press F12 to open dev tools, go to the Console tab, and paste:
   ```js
   crypto.subtle.digest("SHA-256", new TextEncoder().encode("your-password"))
     .then(b => console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2,"0")).join("")))
   ```
2. Copy the hash it prints, and paste it into `assets/main.js`:
   ```js
   const ADMIN_PASSWORD_HASH = "paste-your-hash-here";
   ```
3. The default password before you do this is `changeme` — change it before sharing your repo URL with anyone.

**Important:** this is a convenience gate, not real security. The site is a public static repo — anyone who finds `admin/new-post.html` can view its source, and the password hash itself is sitting in a public file, crackable offline by anyone motivated enough. It's meant to keep casual visitors from wandering into the editing tool, not to protect anything sensitive. Don't use it to gate content you actually need to keep private — for that you'd need a real backend, which is a bigger step up from this setup.

## 7. Embed a Power BI report (or any iframe)

A reusable, responsive embed partial lives at `_includes/embed.html` (backed by the `.embed-wrap` CSS component). It holds a 16:9 (or 4:3) iframe that scales with the page.

**To get a Power BI embed URL:**
1. In Power BI Desktop or the Power BI Service, open the report.
2. **File → Export → Publish to web (public)**.
3. Copy the URL it gives you (looks like `https://app.powerbi.com/view?r=...`).

**⚠️ "Publish to web" makes the report visible to anyone with the link** — no sign-in required. Don't publish this way for anything containing sensitive data. (Org-restricted embedding is possible with Power BI Embedded, but requires an Azure AD app registration and a token-issuing backend — not something GitHub Pages can do on its own.)

**To use it:**
- **Dashboard page**: `dashboard/index.html` already has a "Power BI report" section — edit the `url` in its `{% include embed.html %}` call.
- **A blog post**: `admin/new-post.html` has an optional "Embed URL" field — paste a Power BI (or any other) embed URL there and it's inserted automatically.
- **Anywhere else**, in any file with front matter:
  ```liquid
  {% include embed.html url="https://app.powerbi.com/view?r=..." title="My report" tall=true %}
  ```
  Omit `tall=true` for the default 16:9 box; add it for a 4:3 box. Add `caption="..."` for a small caption line underneath.

## 8. Design system

The site uses a "signal trace" visual language: every color is semantic, not decorative — each content **kind** (`post`/`docs`/`project`/`incident`/`build`) has a fixed hue used consistently as a chip, timeline-node, or panel-stripe color. Tokens live in `assets/style.css`'s `:root` / `html[data-theme="dark"]` blocks (`--hue-post`, `--hue-docs`, etc.) — change the hex values there to retheme, the components (`.panel`, `.trace-item`, `.chip`) all reference the same variables.

## 9. Docs and other content

- **Docs**: edit `docs/index.html` directly — each `<h2 id="...">` becomes a sidebar link, and the sidebar itself is generated from `_data/docs_nav.yml` (keep the two in sync when adding a section).
- **About**: edit `about/index.html` directly.
- **Homepage timeline**: generated automatically from `_posts` + `_activity` — nothing to hand-edit.

## Notes

- No Google Fonts / web fonts — the type system uses system font stacks (monospace for headings/labels, system sans for body text), so there's no external font request on page load.
- No local build tooling required — GitHub Pages runs Jekyll for you. If you want to preview changes locally before pushing, install Ruby + Bundler and run `bundle exec jekyll serve` (a `Gemfile` isn't included by default since it's optional for this workflow — see Jekyll's docs to add one).
- The GitHub API (used for the sync-status indicator and dashboard stats) is unauthenticated and rate-limited (60 requests/hour per visitor IP), which is plenty for a personal site with light traffic.
