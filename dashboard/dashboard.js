// Pulls a few live numbers from the GitHub API for the repo configured
// in assets/main.js (GH_USERNAME / GH_REPO). Falls back to demo data so
// the page still looks right before you've set those values.

const DEMO_LANGUAGES = { HTML: 42, CSS: 31, JavaScript: 19, Markdown: 8 };

async function loadDashboard() {
  const repoUrl = `https://api.github.com/repos/${GH_USERNAME}/${GH_REPO}`;
  let repoData = null;
  let languages = null;

  try {
    const [repoRes, langRes] = await Promise.all([
      fetch(repoUrl),
      fetch(`${repoUrl}/languages`),
    ]);
    if (repoRes.ok) repoData = await repoRes.json();
    if (langRes.ok) languages = await langRes.json();
  } catch (e) {
    // network error — demo data will be used below
  }

  renderStats(repoData);
  renderLanguages(languages);
}

function renderStats(repoData) {
  const grid = document.getElementById("stat-grid");
  const stats = repoData
    ? [
        { num: repoData.stargazers_count, label: "Stars" },
        { num: repoData.forks_count, label: "Forks" },
        { num: repoData.open_issues_count, label: "Open issues" },
        { num: new Date(repoData.updated_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }), label: "Last updated" },
      ]
    : [
        { num: "—", label: "Stars" },
        { num: "—", label: "Forks" },
        { num: "—", label: "Open issues" },
        { num: "—", label: "Last updated" },
      ];

  grid.innerHTML = stats
    .map(
      (s) => `<div class="stat-card"><div class="num">${s.num}</div><div class="label">${s.label}</div></div>`
    )
    .join("");

  const note = document.getElementById("dash-note");
  if (!repoData) {
    note.style.display = "block";
  } else {
    note.style.display = "none";
  }
}

function renderLanguages(languages) {
  const data = languages && Object.keys(languages).length ? languages : DEMO_LANGUAGES;
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const rows = Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const chart = document.getElementById("bar-chart");
  chart.innerHTML = rows
    .map(([name, value]) => {
      const pct = Math.round((value / total) * 100);
      return `
        <div class="bar-row">
          <span class="name">${name}</span>
          <span class="bar-track"><span class="bar-fill" style="width:${pct}%"></span></span>
          <span class="pct">${pct}%</span>
        </div>`;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", loadDashboard);
