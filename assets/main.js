// ------------------------------------------------------------------
// EDIT THESE TWO LINES to point at your own GitHub repo.
// They power the "sync status" line in the header and the dashboard.
// ------------------------------------------------------------------
const GH_USERNAME = "art207";
const GH_REPO = "art207.github.io";
// Mobile nav toggle
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".nav-toggle");
  if (btn) {
    btn.addEventListener("click", () => {
      document.body.classList.toggle("nav-open");
    });
  }
  hydrateSyncStatus();
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
