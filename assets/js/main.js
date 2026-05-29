/* ===== Tang Lab — shared rendering ===== */
const D = window.DATA || {};
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => (s == null ? "" : String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])));

const NAV = [
  ["index.html", "Home"],
  ["about.html", "About"],
  ["research.html", "Research"],
  ["people.html", "People"],
  ["publications.html", "Publications"],
  ["news.html", "News"],
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
      <p style="font-size:14px;line-height:1.7">Early diagnosis and intervention of Alzheimer's Disease and Vascular Cognitive Impairment.</p>
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
  <div class="bottom">© ${"2026"} Tang Lab · Xuanwu Hospital, Capital Medical University. All rights reserved.</div>`;
  document.body.appendChild(f);
}

/* ---------- HOME ---------- */
function renderHome() {
  const a = D.about, r = D.research;
  $("#lab-intro").textContent = a.lab.intro;
  // research preview
  $("#home-research").innerHTML = r.areas.map(x =>
    `<div class="card"><div class="ic">${x.icon}</div><h4>${esc(x.title)}</h4><p>${esc(x.desc)}</p></div>`).join("");
  // latest news
  $("#home-news").innerHTML = D.news.slice(0, 2).map(n => {
    const snippet = (n.body && n.body[0] ? n.body[0] : "").slice(0, 140);
    return `<a class="card" href="news.html" style="text-decoration:none;display:block"><div class="ic">📰</div><h4>${esc(n.title)}</h4><p>${esc(n.date)} · ${esc(snippet)}…</p></a>`;
  }).join("");
}

/* ---------- ABOUT ---------- */
function renderAbout() {
  const a = D.about, pi = a.pi;
  $("#lab-block").innerHTML =
    `<p class="lead">${esc(a.lab.intro)}</p>
     <p style="color:var(--muted)"><b>Affiliation:</b> ${esc(a.lab.affiliation)}</p>`;
  const tl = (arr) => `<ul class="timeline">${arr.map(i => `<li><div class="per">${esc(i.period)}</div><div class="det">${esc(i.detail)}</div></li>`).join("")}</ul>`;
  $("#pi-block").innerHTML =
    `<div class="pi-card">
      <div><img src="${esc(pi.photo)}" alt="${esc(pi.name)}" onerror="this.style.display='none'"></div>
      <div>
        <div class="name">${esc(pi.name)}</div>
        <div class="ti">${esc(pi.title)}</div>
        <div class="meta">${esc(pi.affiliation)}</div>
        <div class="meta">✉ <a href="mailto:${esc(pi.email)}">${esc(pi.email)}</a> &nbsp; ☎ ${esc(pi.phone)}</div>
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
function personCard(p) {
  const initials = (p.name || "?").split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const img = p.photo ? `<img class="ph ph-img" src="assets/people/${esc(p.photo)}" alt="${esc(p.name)}" onerror="this.remove()">` : "";
  const email = p.email ? `<div class="em">✉ <a href="mailto:${esc(p.email)}">${esc(p.email)}</a></div>` : "";
  return `<div class="person"><div class="ph-wrap"><div class="ph ph-ph">${initials}</div>${img}</div>
    <div class="body">
    <div class="nm">${esc(p.name)}</div>
    <div class="ex">${esc(p.experience || "")}</div>${email}</div></div>`;
}
function renderPeople() {
  const root = $("#people-root");
  let html = "";
  for (const [key, label] of SECTION_ORDER) {
    const members = D.people.filter(p => p.section === key);
    if (!members.length) continue;
    const cols = key === "PI" ? "g3" : "g4";
    html += `<div class="people-group"><h3>${label} <span style="color:var(--muted);font-weight:500;font-size:15px">(${members.length})</span></h3>
      <div class="grid ${cols}">${members.map(personCard).join("")}</div></div>`;
  }
  root.innerHTML = html;
}

/* ---------- PUBLICATIONS ---------- */
function fmtCitation(c) {
  // bold "Tang Y" author and the corresponding/last-author occurrences
  return esc(c).replace(/(Tang Y)\b/g, "<b>$1</b>");
}
function renderPublications() {
  const pubs = D.publications;
  const years = [...new Set(pubs.map(p => p.year).filter(Boolean))].sort((a, b) => b - a);
  const yearSel = $("#pub-year");
  yearSel.innerHTML = `<option value="">All years</option>` + years.map(y => `<option value="${y}">${y}</option>`).join("");
  const box = $("#pub-list"), count = $("#pub-count"), search = $("#pub-search");

  function draw() {
    const q = search.value.trim().toLowerCase();
    const fy = yearSel.value;
    let list = pubs.filter(p =>
      (!fy || String(p.year) === fy) &&
      (!q || p.citation.toLowerCase().includes(q)));
    count.textContent = `${list.length} publication${list.length !== 1 ? "s" : ""}`;
    let html = "", cur = null;
    for (const p of list) {
      if (p.year !== cur) { cur = p.year; html += `<div class="pub-year">${cur || "Other"}</div>`; }
      const links = [];
      if (p.doi) links.push(`<a href="https://doi.org/${encodeURIComponent(p.doi)}" target="_blank" rel="noopener">DOI</a>`);
      if (p.pmid) links.push(`<a href="https://pubmed.ncbi.nlm.nih.gov/${esc(p.pmid)}/" target="_blank" rel="noopener">PubMed</a>`);
      html += `<div class="pub">${fmtCitation(p.citation)}${links.length ? `<div class="links">${links.join("")}</div>` : ""}</div>`;
    }
    box.innerHTML = html || `<p class="lead">No matching publications.</p>`;
  }
  search.oninput = draw; yearSel.onchange = draw;
  draw();
}

/* ---------- NEWS ---------- */
function renderNews() {
  $("#news-root").innerHTML = D.news.map(n => {
    const img = n.image ? `<img class="na-img" src="${esc(n.image)}" alt="" onerror="this.style.display='none'">` : "";
    const body = (n.body || []).map(p => `<p>${esc(p)}</p>`).join("");
    const src = n.source ? `<p class="na-src">转自：${esc(n.source)}</p>` : "";
    const link = n.link ? `<p class="na-link"><a href="${esc(n.link)}" target="_blank" rel="noopener">阅读原文 →</a></p>` : "";
    return `<article class="news-article">
      <div class="na-head"><span class="tag">${esc(n.tag)}</span><span class="date">${esc(n.date)}</span></div>
      <h2>${esc(n.title)}</h2>
      ${img}
      <div class="na-body">${body}</div>
      ${src}${link}
    </article>`;
  }).join("");
}

/* ---------- JOIN ---------- */
function renderJoin() {
  const j = D.join;
  $("#join-intro").textContent = j.intro;
  $("#join-positions").innerHTML = j.positions.map(p =>
    `<div class="join-pos"><h4>${esc(p.role)}</h4><p style="color:var(--muted)">${esc(p.summary)}</p>
     <ul>${p.requirements.map(r => `<li>${esc(r)}</li>`).join("")}</ul></div>`).join("");
  $("#join-extra").innerHTML =
    `<h3>Benefits</h3><ul style="color:var(--muted);margin-left:20px">${j.benefits.map(b => `<li>${esc(b)}</li>`).join("")}</ul>
     <div class="callout">
       <p><b>📍 Location:</b> ${esc(j.location)}</p>
       <p style="margin-top:10px"><b>📩 How to apply:</b> ${esc(j.apply)}</p>
       <p style="margin-top:6px">${j.emails.map(e => `<a href="mailto:${esc(e)}">${esc(e)}</a>`).join(" &nbsp;·&nbsp; ")}</p>
     </div>`;
}

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderChrome();
  const map = { index: renderHome, about: renderAbout, research: renderResearch, people: renderPeople, publications: renderPublications, news: renderNews, join: renderJoin };
  const fn = map[document.body.dataset.page];
  if (fn) try { fn(); } catch (e) { console.error(e); }
});
