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
        <div class="meta">✉ <a href="mailto:${esc(pi.email)}">${esc(pi.email)}</a></div>
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
function personCard(p, horizontal) {
  const initials = (p.name || "?").split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const img = p.photo ? `<img class="ph ph-img" src="assets/people/${esc(p.photo)}" alt="${esc(p.name)}" onerror="this.remove()">` : "";
  const email = p.email ? `<div class="em">✉ <a href="mailto:${esc(p.email)}">${esc(p.email)}</a></div>` : "";
  return `<div class="person${horizontal ? " horizontal" : ""}"><div class="ph-wrap"><div class="ph ph-ph">${initials}</div>${img}</div>
    <div class="body">
    <div class="nm">${esc(p.name)}</div>
    <div class="ex">${esc(p.experience || "")}</div>${email}</div></div>`;
}
function renderPeople() {
  const root = $("#people-root");
  let html = "";
  const SORT_ALPHA = new Set(["Postdoc", "Student", "Research Assistant"]);
  const HORIZONTAL = new Set(["PI", "Faculty"]);
  for (const [key, label] of SECTION_ORDER) {
    const members = D.people.filter(p => p.section === key);
    if (!members.length) continue;
    if (SORT_ALPHA.has(key)) members.sort((a, b) => a.name.localeCompare(b.name));
    const horizontal = HORIZONTAL.has(key);
    const gridClass = key === "PI" ? "grid-horizontal grid-pi"
      : key === "Faculty" ? "grid-horizontal"
      : "grid g4";
    html += `<div class="people-group"><h3>${label} <span style="color:var(--muted);font-weight:500;font-size:15px">(${members.length})</span></h3>
      <div class="${gridClass}">${members.map(p => personCard(p, horizontal)).join("")}</div></div>`;
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
  const pubs = D.publications;
  const years = [...new Set(pubs.map(p => p.year).filter(Boolean))].sort((a, b) => b - a);
  const yearSel = $("#pub-year");
  yearSel.innerHTML = `<option value="">All years</option>` + years.map(y => `<option value="${y}">${y}</option>`).join("");
  const box = $("#pub-list"), count = $("#pub-count"), search = $("#pub-search"), index = $("#pub-index");

  function draw() {
    const q = search.value.trim().toLowerCase();
    const fy = yearSel.value;
    let list = pubs.filter(p =>
      (!fy || String(p.year) === fy) &&
      (!q || p.citation.toLowerCase().includes(q)));
    count.textContent = `${list.length} publication${list.length !== 1 ? "s" : ""}`;
    const shownYears = [];
    let html = "", cur = null;
    for (const p of list) {
      if (p.year !== cur) {
        cur = p.year;
        const y = cur || "Other";
        shownYears.push(y);
        html += `<div class="pub-year" id="year-${y}">${y}</div>`;
      }
      const links = [];
      if (p.pmid) links.push(`<a href="https://pubmed.ncbi.nlm.nih.gov/${esc(p.pmid)}/" target="_blank" rel="noopener">PubMed</a>`);
      if (p.doi) links.push(`<a href="https://doi.org/${encodeURIComponent(p.doi)}" target="_blank" rel="noopener">DOI</a>`);
      html += `<div class="pub">${fmtCitation(p)}${links.length ? `<div class="links">${links.join("")}</div>` : ""}</div>`;
    }
    box.innerHTML = html || `<p class="lead">No matching publications.</p>`;
    // year index (reflects currently visible years)
    index.innerHTML = shownYears.length > 1
      ? shownYears.map(y => `<a href="#year-${y}" data-year="${y}">${y}</a>`).join("")
      : "";
  }

  // smooth-scroll with offset for the sticky nav, without leaving a #hash
  index.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-year]");
    if (!a) return;
    e.preventDefault();
    const el = document.getElementById("year-" + a.dataset.year);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 76;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  });

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
       <p><b>📍 Location · 工作地点:</b> ${esc(j.location_en)}</p>
       <p class="zh" style="margin-top:2px">${esc(j.location_zh)}</p>
       <p style="margin-top:12px"><b>📩 How to apply · 申请方式:</b> ${esc(j.apply_en)}</p>
       <p class="zh" style="margin-top:2px">${esc(j.apply_zh)}</p>
       <p style="margin-top:8px">${j.emails.map(e => `<a href="mailto:${esc(e)}">${esc(e)}</a>`).join(" &nbsp;·&nbsp; ")}</p>
     </div>`;
}

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderChrome();
  const map = { index: renderHome, about: renderAbout, research: renderResearch, people: renderPeople, publications: renderPublications, news: renderNews, join: renderJoin };
  const fn = map[document.body.dataset.page];
  if (fn) try { fn(); } catch (e) { console.error(e); }
});
