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
├── admin/
│   ├── login.html          password gate (see "Admin tools" below)
│   └── new-post.html       fill-in-a-form post generator
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

Comments use [Disqus](https://disqus.com), which lets readers post **as a guest — no sign-in required**. (If you'd rather have GitHub-account-only, ad-free comments instead, [giscus](https://giscus.app) is a good swap — ask me and I'll wire it back in.)

1. Create a free account at disqus.com and register your site ("I want to install Disqus on my site") to get a **shortname**.
2. Open `assets/main.js` and set:
   ```js
   const DISQUS_SHORTNAME = "your-shortname";
   ```
3. That's it — every post's `<div id="disqus_thread"></div>` picks it up automatically. Disqus's free tier shows some ads; their paid tiers remove them.

## 4. Dark / light mode

There's a toggle button (sun/moon icon) in the header on every page. It respects the visitor's system preference on first visit, then remembers their choice. Nothing to configure — it just works once you've pushed the updated `assets/` files.

## 5. Admin tools (post generator)

`admin/new-post.html` is a form: fill in a title, date, excerpt, and body, hit **Generate**, and it produces the post's HTML plus the snippet to paste into `blog/index.html` — no more hand-editing the template. It's gated behind `admin/login.html` so it's not the first thing visitors stumble into.

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

**Important:** this is a convenience gate, not real security. The site is a public static repo — anyone who finds `admin/new-post.html` can view its source, and the password hash itself is sitting in a public file, crackable offline by anyone motivated enough. It's meant to keep casual visitors from wandering into the editing tool, not to protect anything sensitive. Don't use it to gate content you actually need to keep private — for that you'd need a real backend, which is a bigger step up from this zero-build setup.

## 6. Add your own content

- **Blog posts**: use `admin/new-post.html` (see above), or duplicate `blog/scaling-notes.html` by hand, edit the title/date/body, and add a `<li>` for it in `blog/index.html` and (optionally) the homepage log.
- **Docs**: edit `docs/index.html` directly — each `<h2 id="...">` becomes a sidebar link. Split into multiple files later if it grows.
- **Homepage log**: the `<ul class="log">` in `index.html` is a manually-curated feed — add a line each time you publish something.

## Notes

- Fonts (Source Serif 4 / Inter / IBM Plex Mono) load from Google Fonts via CDN — no local font files needed.
- No frameworks, no build step — edit HTML/CSS/JS directly and push.
- The GitHub API is unauthenticated and rate-limited (60 requests/hour per visitor IP), which is plenty for a personal site with light traffic.
