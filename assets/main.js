// ------------------------------------------------------------------
// EDIT THESE to configure your site.
// ------------------------------------------------------------------
const GH_USERNAME = "art207";
const GH_REPO = "art207.github.io";

// SHA-256 hash of your admin password (NOT the password itself).
// Default below is the hash of "changeme" — see README to set your own.
const ADMIN_PASSWORD_HASH = "057ba03d6c44104863dc7361fe4578965d1887360f90a0895882e58a6248fc86";

// Your Disqus shortname (from disqus.com), used to load comments on
// blog posts without requiring readers to sign in.
const DISQUS_SHORTNAME = "your-disqus-shortname";

// ------------------------------------------------------------------
// Theme (light/dark)
// ------------------------------------------------------------------
(function initTheme() {
  const stored = localStorage.getItem("theme");
  const preferred = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", preferred);
})();

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
}

// ------------------------------------------------------------------
// Page setup
// ------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const navBtn = document.querySelector(".nav-toggle");
  if (navBtn) {
    navBtn.addEventListener("click", () => document.body.classList.toggle("nav-open"));
  }

  const themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
  }

  hydrateSyncStatus();
  loadComments();
});

// Pulls the latest commit timestamp from the GitHub API and shows it
// in the header. Falls back to a static label if the request fails
// (rate-limited, offline, or repo not configured yet).
async function hydrateSyncStatus() {
  const el = document.getElementById("sync-status-text");
  if (!el) return;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GH_USERNAME}/${GH_REPO}/commits?per_page=1`
    );
    if (!res.ok) throw new Error("bad response");
    const data = await res.json();
    const date = new Date(data[0].commit.author.date);
    el.textContent = `synced ${date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })}`;
  } catch (e) {
    el.textContent = "configure repo in assets/main.js";
  }
}

// ------------------------------------------------------------------
// Comments (Disqus — allows guests to comment without signing in)
// ------------------------------------------------------------------
function loadComments() {
  const mount = document.getElementById("disqus_thread");
  if (!mount) return;

  if (DISQUS_SHORTNAME === "your-disqus-shortname") {
    mount.innerHTML =
      '<p class="dash-note">Comments aren\'t configured yet — set DISQUS_SHORTNAME in assets/main.js. See the README.</p>';
    return;
  }

  window.disqus_config = function () {
    this.page.url = window.location.href;
    this.page.identifier = window.location.pathname;
  };

  const script = document.createElement("script");
  script.src = `https://${DISQUS_SHORTNAME}.disqus.com/embed.js`;
  script.setAttribute("data-timestamp", +new Date());
  document.body.appendChild(script);
}

// ------------------------------------------------------------------
// Admin auth
// ------------------------------------------------------------------
// NOTE: this is a client-side deterrent, not real security. This is a
// public static site — anyone who knows (or guesses) the admin URL can
// view its source, and a determined visitor could brute-force the hash
// offline. Don't put anything here you wouldn't want a stranger to see.
// It's meant to keep casual visitors out of the post-generator tool,
// not to protect sensitive data.

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function isAdmin() {
  return sessionStorage.getItem("isAdmin") === "true";
}

async function attemptLogin(password) {
  const hash = await sha256(password);
  if (hash === ADMIN_PASSWORD_HASH) {
    sessionStorage.setItem("isAdmin", "true");
    return true;
  }
  return false;
}

function logout() {
  sessionStorage.removeItem("isAdmin");
  window.location.href = "../index.html";
}

// Call at the top of any admin page that requires login.
function requireAdmin() {
  if (!isAdmin()) {
    window.location.href = "login.html";
  }
}
