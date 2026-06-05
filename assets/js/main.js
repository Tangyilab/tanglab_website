/* ===== Tang Lab — shared rendering ===== */
const D = window.DATA || {};
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => (s == null ? "" : String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])));
// split "a@x; b@y" into separate mailto links
const emailLinks = (raw) => (raw || "").split(/[;,]/).map(e => e.trim()).filter(Boolean)
  .map(e => `<a href="mailto:${esc(e)}">${esc(e)}</a>`).join(", ");

const NAV = [
  ["index.html", "Home"],
  ["about.html", "About"],
  ["research.html", "Research"],
  ["people.html", "People"],
  ["publications.html", "Publications"],
  ["join.html", "Join Us"],
];

function renderChrome() {
  const page = document.body.dataset.page || "";
  const nav = document.createElement("div");
  nav.className = "nav";
  nav.innerHTML = `<div class="wrap">
    <a class="logo" href="index.html">Tang<span>Lab</span></a>
    <button class="burger" aria-label="menu">&#9776;</button>
    <nav class="menu">${NAV.map(([h, t]) => `<a href="${h}" class="${h.startsWith(page) && page ? "active" : ""}">${t}</a>`).join("")}</nav>
  </div>`;
  document.body.prepend(nav);
  nav.querySelector(".burger").onclick = () => nav.querySelector(".menu").classList.toggle("open");

  const f = document.createElement("footer");
  f.className = "footer";
  f.innerHTML = `<div class="wrap">
    <div style="max-width:340px">
      <h5>Tang Lab</h5>
      <p style="font-size:14px;line-height:1.7">Early diagnosis and intervention of Alzheimer's disease and vascular cognitive impairment.</p>
    </div>
    <div>
      <h5>Affiliation</h5>
      <p style="font-size:14px;line-height:1.7">Department of Neurology, Xuanwu Hospital,<br>Capital Medical University<br>Chinese Institute for Brain Research, Beijing</p>
    </div>
    <div>
      <h5>Contact</h5>
      <p style="font-size:14px;line-height:1.7">Prof. Yi Tang<br><a href="mailto:tangyi@xwhosp.org">tangyi@xwhosp.org</a></p>
    </div>
  </div>
  <div class="bottom">© ${new Date().getFullYear()} Tang Lab · Xuanwu Hospital, Capital Medical University. All rights reserved.</div>`;
  document.body.appendChild(f);
}

/* ---------- HOME ---------- */
function renderHome() {
  const a = D.about, r = D.research;
  $("#lab-intro").textContent = a.lab.intro;
  // research preview
  $("#home-research").innerHTML = r.areas.map(x =>
    `<div class="card"><div class="ic">${x.icon}</div><h4>${esc(x.title)}</h4><p>${esc(x.desc)}</p></div>`).join("");
}

/* ---------- ABOUT ---------- */
function renderAbout() {
  const a = D.about, pi = a.pi;
  const affs = a.lab.affiliations || (a.lab.affiliation ? [a.lab.affiliation] : []);
  const affLabel = affs.length > 1 ? "Affiliations" : "Affiliation";
  $("#lab-block").innerHTML =
    `<p class="lead">${esc(a.lab.intro)}</p>
     <p style="color:var(--muted)"><b>${affLabel}:</b></p>
     <ul style="color:var(--muted);margin:4px 0 0 20px">${affs.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
  const tl = (arr) => `<ul class="timeline">${arr.map(i => `<li><div class="per">${esc(i.period)}</div><div class="det">${esc(i.detail)}</div></li>`).join("")}</ul>`;
  $("#pi-block").innerHTML =
    `<div class="pi-card">
      <div><img src="${esc(pi.photo)}" alt="${esc(pi.name)}" onerror="this.style.display='none'"></div>
      <div>
        <div class="name">${esc(pi.name)}</div>
        <div class="ti">${esc(pi.title)}</div>
        <div class="meta">${esc(pi.affiliation)}</div>
        <div class="meta">✉ ${emailLinks(pi.email)}</div>
        <p class="bio">${esc(pi.bio)}</p>
      </div>
    </div>
    <h3>Education &amp; Training</h3>${tl(pi.education)}
    <h3>Positions &amp; Employment</h3>${tl(pi.positions)}
    <h3>Professional Memberships &amp; Editorial Roles</h3>${tl(pi.memberships)}`;
}

/* ---------- RESEARCH ---------- */
function renderResearch() {
  $("#res-intro").textContent = D.research.intro;
  $("#res-grid").innerHTML = D.research.areas.map(x =>
    `<div class="card"><div class="ic">${x.icon}</div><h4>${esc(x.title)}</h4><p>${esc(x.desc)}</p></div>`).join("");
}

/* ---------- PEOPLE ---------- */
const SECTION_ORDER = [
  ["PI", "Principal Investigator"],
  ["Faculty", "Faculty"],
  ["Postdoc", "Postdoctoral Fellows"],
  ["Student", "Students"],
  ["Research Assistant", "Research Assistants"],
];
function personCard(p, horizontal, extraClass) {
  const initials = (p.name || "?").split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const img = p.photo ? `<img class="ph ph-img" src="assets/people/${esc(p.photo)}" alt="${esc(p.name)}" onerror="this.remove()">` : "";
  const email = p.email ? `<div class="em">✉ ${emailLinks(p.email)}</div>` : "";
  // structured multi-section experience (e.g. Faculty with Education / Positions)
  let body;
  if (p.details && p.details.length) {
    body = p.details.map(sec =>
      `<div class="ex-sec"><div class="ex-h">${esc(sec.heading)}</div>` +
      `<ul class="ex-list">${sec.items.map(it => `<li>${esc(it)}</li>`).join("")}</ul></div>`
    ).join("");
  } else {
    body = `<div class="ex">${esc(p.experience || "")}</div>`;
  }
  const cls = "person" + (horizontal ? " horizontal" : "") + (extraClass ? " " + extraClass : "");
  return `<div class="${cls}"><div class="ph-wrap"><div class="ph ph-ph">${initials}</div>${img}</div>
    <div class="body">
    <div class="nm">${esc(p.name)}</div>
    ${body}${email}</div></div>`;
}
function renderPeople() {
  const root = $("#people-root");
  let html = "";
  const SORT_ALPHA = new Set(["Postdoc", "Student", "Research Assistant"]);
  const HORIZONTAL = new Set(["PI", "Faculty"]);
  const surname = (name) => {
    const parts = (name || "").trim().split(/\s+/);
    return (parts[parts.length - 1] || "").toLowerCase();
  };
  for (const [key, label] of SECTION_ORDER) {
    const members = D.people.filter(p => p.section === key);
    if (!members.length) continue;
    if (SORT_ALPHA.has(key)) members.sort((a, b) => surname(a.name).localeCompare(surname(b.name)) || a.name.localeCompare(b.name));
    const horizontal = HORIZONTAL.has(key);
    const isFaculty = key === "Faculty";
    const gridClass = (key === "PI" || isFaculty) ? "grid-horizontal grid-pi"
      : "grid g4";
    html += `<div class="people-group"><h3>${label}</h3>
      <div class="${gridClass}">${members.map(p => personCard(p, horizontal, isFaculty ? "faculty-card" : "")).join("")}</div></div>`;
  }
  root.innerHTML = html;
}

/* ---------- PUBLICATIONS ---------- */
function fmtCitation(p) {
  // Build "Authors. Title. Journal" with every author shown and Tang Y bolded.
  if (p.authors && p.authors.length) {
    const authors = p.authors
      .map(n => /^Tang Y/i.test(n) ? `<b>${esc(n)}</b>` : esc(n))
      .join(", ");
    const title = esc((p.title || "").replace(/\.$/, ""));
    const journal = esc(p.journal || "");
    return `${authors}. <span class="pub-title">${title}.</span> ${journal}`;
  }
  // fallback: raw citation with Tang Y bolded
  return esc(p.citation).replace(/(Tang Y)\b/g, "<b>$1</b>");
}
function renderPublications() {
  // Show only a curated set of selected high-impact publications.
  const featured = D.publications
    .filter(p => p.featured)
    .sort((a, b) => (a.featured_rank ?? 99) - (b.featured_rank ?? 99));
  const box = $("#pub-list");
  box.innerHTML = featured.map(p => {
    const links = [];
    if (p.pmid) links.push(`<a href="https://pubmed.ncbi.nlm.nih.gov/${esc(p.pmid)}/" target="_blank" rel="noopener">PubMed</a>`);
    if (p.doi) links.push(`<a href="https://doi.org/${encodeURIComponent(p.doi)}" target="_blank" rel="noopener">DOI</a>`);
    return `<div class="pub">${fmtCitation(p)}${links.length ? `<div class="links">${links.join("")}</div>` : ""}</div>`;
  }).join("");
}


/* ---------- JOIN (bilingual: English primary, Chinese secondary) ---------- */
function renderJoin() {
  const j = D.join;
  $("#join-intro").innerHTML =
    `<span class="lead" style="display:block;margin-bottom:6px">${esc(j.intro_en)}</span>
     <span class="zh">${esc(j.intro_zh)}</span>`;
  $("#join-positions").innerHTML = j.positions.map(p =>
    `<div class="join-pos">
       <h4>${esc(p.role_en)} <span class="zh-inline">${esc(p.role_zh)}</span></h4>
       <p style="color:var(--muted)">${esc(p.summary_en)}</p>
       <p class="zh">${esc(p.summary_zh)}</p>
       <ul>${p.requirements_en.map((r, i) =>
         `<li>${esc(r)}${p.requirements_zh[i] ? `<span class="zh">${esc(p.requirements_zh[i])}</span>` : ""}</li>`).join("")}</ul>
     </div>`).join("");
  $("#join-extra").innerHTML =
    `<h3>Benefits <span class="zh-inline">福利待遇</span></h3>
     <ul style="color:var(--muted);margin-left:20px">${j.benefits_en.map((b, i) =>
       `<li>${esc(b)}${j.benefits_zh[i] ? `<span class="zh">${esc(j.benefits_zh[i])}</span>` : ""}</li>`).join("")}</ul>
     <div class="callout">
       <p><b>📍 Location · 工作地点</b></p>
       <p style="margin-top:2px">${esc(j.location_en)}</p>
       <p class="zh" style="margin-top:2px">${esc(j.location_zh)}</p>
       <p style="margin-top:12px"><b>📩 How to apply · 申请方式</b></p>
       <p style="margin-top:2px">${esc(j.apply_en)}</p>
       <p class="zh" style="margin-top:2px">${esc(j.apply_zh)}</p>
       <p style="margin-top:8px">${j.emails.map(e => `<a href="mailto:${esc(e)}">${esc(e)}</a>`).join(" &nbsp;·&nbsp; ")}</p>
     </div>`;
}

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderChrome();
  const map = { index: renderHome, about: renderAbout, research: renderResearch, people: renderPeople, publications: renderPublications, join: renderJoin };
  const fn = map[document.body.dataset.page];
  if (fn) try { fn(); } catch (e) { console.error(e); }
});
