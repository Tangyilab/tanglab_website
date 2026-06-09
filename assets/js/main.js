/* ===== Tang Lab — shared rendering (bilingual EN / 中文) ===== */
const D = window.DATA || {};
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => (s == null ? "" : String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])));
const emailLinks = (raw) => (raw || "").split(/[;,]/).map(e => e.trim()).filter(Boolean)
  .map(e => `<a href="mailto:${esc(e)}">${esc(e)}</a>`).join(", ");

/* ---------- language state ---------- */
let LANG = (localStorage.getItem("tanglab_lang") || "en");
// pick the right field: obj.x_en / obj.x_zh, falling back to the other or to obj.x
function L(obj, key) {
  if (!obj) return "";
  const cur = obj[`${key}_${LANG}`];
  if (cur != null) return cur;
  const alt = obj[`${key}_${LANG === "en" ? "zh" : "en"}`];
  if (alt != null) return alt;
  return obj[key] != null ? obj[key] : "";
}
// interface (chrome) strings
const UI = {
  nav: {
    home: { en: "Home", zh: "首页" },
    about: { en: "About", zh: "简介" },
    research: { en: "Research", zh: "研究" },
    people: { en: "People", zh: "团队" },
    publications: { en: "Publications", zh: "论著" },
    join: { en: "Join Us", zh: "加入我们" },
  },
  footer: {
    tagline: { en: "Early diagnosis and intervention of Alzheimer's disease and vascular cognitive impairment.", zh: "阿尔茨海默病与血管性认知障碍的早期诊断与干预。" },
    affHead: { en: "Affiliation", zh: "所属机构" },
    affBody: { en: "Department of Neurology, Xuanwu Hospital,<br>Capital Medical University<br>Chinese Institute for Brain Research, Beijing", zh: "首都医科大学宣武医院神经内科<br>北京脑科学与类脑研究所" },
    contact: { en: "Contact", zh: "联系方式" },
    rights: { en: "All rights reserved.", zh: "版权所有。" },
  },
  sections: {
    PI: { en: "Principal Investigator", zh: "课题组负责人" },
    Faculty: { en: "Faculty", zh: "研究人员" },
    Postdoc: { en: "Postdoctoral Fellows", zh: "博士后" },
    Student: { en: "Students", zh: "研究生" },
    "Research Assistant": { en: "Research Assistants", zh: "科研助理" },
  },
  about: {
    affLabelOne: { en: "Affiliation", zh: "所属机构" },
    affLabelMany: { en: "Affiliations", zh: "所属机构" },
    education: { en: "Education &amp; Training", zh: "教育与训练经历" },
    positions: { en: "Positions &amp; Employment", zh: "工作经历" },
    memberships: { en: "Professional Memberships &amp; Editorial Roles", zh: "学术兼职与编委职务" },
  },
  pub: {
    note: {
      en: 'Showing selected high-impact publications. For the complete and up-to-date list, please visit Prof. Tang\'s <a href="https://scholar.google.com/citations?hl=en&user=0eZyhbcAAAAJ" target="_blank" rel="noopener">Google Scholar</a> profile.',
      zh: '完整及最新论著列表，请访问唐毅教授的 <a href="https://scholar.google.com/citations?hl=en&user=0eZyhbcAAAAJ" target="_blank" rel="noopener">Google Scholar</a> 主页。'
    }
  },
  join: { benefits: { en: "Benefits", zh: "福利待遇" }, location: { en: "Location", zh: "工作地点" }, apply: { en: "How to apply", zh: "申请方式" } },
  toggle: { en: "中文", zh: "EN" }
};
const t = (node) => (node && node[LANG]) || (node && node.en) || "";

/* page-level <h1>/<p>/eyebrow strings keyed by data-page */
const PAGE_TEXT = {
  index: {},
  about: { h1: { en: "About", zh: "简介" }, sub: { en: "The laboratory and its principal investigator.", zh: "课题组及其负责人简介。" },
    eyebrow1: { en: "The Lab", zh: "实验室" }, title1: { en: "About the Lab", zh: "实验室简介" },
    eyebrow2: { en: "Principal Investigator", zh: "课题组负责人" }, title2: { en: "About the PI", zh: "负责人简介" } },
  research: { h1: { en: "Research", zh: "研究" }, sub: { en: "Mechanisms, early diagnosis, and intervention of cognitive disorders.", zh: "认知障碍的机制、早期诊断与干预。" },
    eyebrow: { en: "Overview", zh: "概览" }, title: { en: "Research Directions", zh: "研究方向" } },
  people: { h1: { en: "People", zh: "团队" }, sub: { en: "The researchers behind the Tang Lab.", zh: "唐毅课题组的研究人员。" } },
  publications: { h1: { en: "Publications", zh: "论著" }, sub: { en: "Selected publications in high-impact journals.", zh: "精选高影响力期刊论著。" } },
  join: { h1: { en: "Join Us", zh: "加入我们" }, sub: { en: "Opportunities for postdocs, technicians, research assistants, and students.", zh: "博士后、技术员、科研助理及学生招募。" } },
};

/* ---------- chrome (nav + footer) ---------- */
function renderChrome() {
  const page = document.body.dataset.page || "";
  const navItems = [
    ["index.html", "home"], ["about.html", "about"], ["research.html", "research"],
    ["people.html", "people"], ["publications.html", "publications"], ["join.html", "join"],
  ];
  const nav = document.createElement("div");
  nav.className = "nav";
  nav.innerHTML = `<div class="wrap">
    <a class="logo" href="index.html">Tang<span>Lab</span></a>
    <button class="burger" aria-label="menu">&#9776;</button>
    <nav class="menu">${navItems.map(([h, k]) =>
      `<a href="${h}" class="${h.startsWith(page) && page ? "active" : ""}">${t(UI.nav[k])}</a>`).join("")}
      <button class="lang-toggle" type="button">${t(UI.toggle)}</button>
    </nav>
  </div>`;
  document.body.prepend(nav);
  nav.querySelector(".burger").onclick = () => nav.querySelector(".menu").classList.toggle("open");
  nav.querySelector(".lang-toggle").onclick = () => {
    LANG = LANG === "en" ? "zh" : "en";
    localStorage.setItem("tanglab_lang", LANG);
    rerender();
  };

  const f = document.createElement("footer");
  f.className = "footer";
  f.innerHTML = `<div class="wrap">
    <div style="max-width:340px">
      <h5>Tang Lab</h5>
      <p style="font-size:14px;line-height:1.7">${t(UI.footer.tagline)}</p>
    </div>
    <div>
      <h5>${t(UI.footer.affHead)}</h5>
      <p style="font-size:14px;line-height:1.7">${t(UI.footer.affBody)}</p>
    </div>
    <div>
      <h5>${t(UI.footer.contact)}</h5>
      <p style="font-size:14px;line-height:1.7">${LANG === "zh" ? "唐毅 教授" : "Prof. Yi Tang"}<br><a href="mailto:tangyi@xwhosp.org">tangyi@xwhosp.org</a></p>
    </div>
  </div>
  <div class="bottom">© ${new Date().getFullYear()} Tang Lab · Xuanwu Hospital, Capital Medical University. ${t(UI.footer.rights)}</div>`;
  document.body.appendChild(f);
}

/* ---------- page header (phead / hero) ---------- */
function renderPageHeader() {
  const page = document.body.dataset.page;
  const pt = PAGE_TEXT[page];
  if (!pt) return;
  const h1 = $(".phead h1"); if (h1 && pt.h1) h1.innerHTML = t(pt.h1);
  const sub = $(".phead p"); if (sub && pt.sub) sub.innerHTML = t(pt.sub);
}

/* ---------- HOME ---------- */
function renderHome() {
  const a = D.about, r = D.research;
  // hero
  const h1 = $(".hero h1");
  if (h1) h1.innerHTML = LANG === "zh"
    ? '理解并战胜<br><span style="white-space:nowrap">阿尔茨海默病与血管性认知障碍</span>'
    : 'Understanding and defeating<br><span style="white-space:nowrap">Alzheimer\'s disease &amp; vascular cognitive impairment</span>';
  const hp = $(".hero .wrap > p");
  if (hp) hp.textContent = LANG === "zh"
    ? "唐毅课题组整合分子生物学、电生理学、神经影像与流行病学，推动认知障碍的早期诊断与干预。"
    : "The Tang Lab integrates molecular biology, electrophysiology, neuroimaging, and epidemiology to advance the early diagnosis and intervention of cognitive disorders.";
  const cta = document.querySelectorAll(".hero .cta a");
  if (cta[0]) cta[0].textContent = LANG === "zh" ? "了解研究" : "Explore Research";
  if (cta[1]) cta[1].textContent = LANG === "zh" ? "加入我们" : "Join Us";
  // about eyebrow/title
  const setTxt = (sel, en, zh) => { const el = $(sel); if (el) el.textContent = LANG === "zh" ? zh : en; };
  setTxt("#home-about-eyebrow", "About the Lab", "实验室简介");
  setTxt("#home-about-title", "Who We Are", "我们是谁");
  setTxt("#home-research-eyebrow", "Research", "研究");
  setTxt("#home-research-title", "Our Focus Areas", "研究重点");
  const more = $("#home-research-more"); if (more) more.textContent = LANG === "zh" ? "查看完整研究方向 →" : "See full research overview →";
  $("#lab-intro").textContent = L(a.lab, "intro");
  $("#home-research").innerHTML = r.areas.map(x =>
    `<div class="card"><div class="ic">${x.icon}</div><h4>${esc(L(x, "title"))}</h4><p>${esc(L(x, "desc"))}</p></div>`).join("");
}

/* ---------- ABOUT ---------- */
function renderAbout() {
  const a = D.about, pi = a.pi, pt = PAGE_TEXT.about;
  const setEy = (sel, node) => { const el = $(sel); if (el) el.innerHTML = t(node); };
  setEy("#about-eyebrow1", pt.eyebrow1); setEy("#about-title1", pt.title1);
  setEy("#about-eyebrow2", pt.eyebrow2); setEy("#about-title2", pt.title2);

  const affs = L(a.lab, "affiliations") || [];
  const affLabel = t(affs.length > 1 ? UI.about.affLabelMany : UI.about.affLabelOne);
  $("#lab-block").innerHTML =
    `<p class="lead">${esc(L(a.lab, "intro"))}</p>
     <p style="color:var(--muted)"><b>${affLabel}:</b></p>
     <ul style="color:var(--muted);margin:4px 0 0 20px">${affs.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
  const per = (p) => LANG === "zh" ? String(p).replace(/present/i, "至今") : p;
  const tl = (arr) => `<ul class="timeline">${arr.map(i => `<li><div class="per">${esc(per(i.period))}</div><div class="det">${esc(L(i, "detail"))}</div></li>`).join("")}</ul>`;
  $("#pi-block").innerHTML =
    `<div class="pi-card">
      <div><img src="${esc(pi.photo)}" alt="${esc(L(pi, "name"))}" onerror="this.style.display='none'"></div>
      <div>
        <div class="name">${esc(L(pi, "name"))}</div>
        <div class="ti">${esc(L(pi, "title"))}</div>
        <div class="meta">${esc(L(pi, "affiliation"))}</div>
        <div class="meta">✉ ${emailLinks(pi.email)}</div>
        <p class="bio">${esc(L(pi, "bio"))}</p>
      </div>
    </div>
    <h3>${t(UI.about.education)}</h3>${tl(pi.education)}
    <h3>${t(UI.about.positions)}</h3>${tl(pi.positions)}
    <h3>${t(UI.about.memberships)}</h3>${tl(pi.memberships)}`;
}

/* ---------- RESEARCH ---------- */
function renderResearch() {
  const pt = PAGE_TEXT.research;
  const ey = $("#res-eyebrow"); if (ey) ey.innerHTML = t(pt.eyebrow);
  const ti = $("#res-title"); if (ti) ti.innerHTML = t(pt.title);
  $("#res-intro").textContent = L(D.research, "intro");
  $("#res-grid").innerHTML = D.research.areas.map(x =>
    `<div class="card"><div class="ic">${x.icon}</div><h4>${esc(L(x, "title"))}</h4><p>${esc(L(x, "desc"))}</p></div>`).join("");
}

/* ---------- PEOPLE ---------- */
const SECTION_ORDER = ["PI", "Faculty", "Postdoc", "Student", "Research Assistant"];
function personCard(p, horizontal, extraClass) {
  const name = L(p, "name");
  const initials = (p.name_en || p.name || "?").split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const img = p.photo ? `<img class="ph ph-img" src="assets/people/${esc(p.photo)}" alt="${esc(name)}" onerror="this.remove()">` : "";
  const email = p.email ? `<div class="em">✉ ${emailLinks(p.email)}</div>` : "";
  let body;
  if (p.details && p.details.length) {
    body = p.details.map(sec =>
      `<div class="ex-sec"><div class="ex-h">${esc(L(sec, "heading"))}</div>` +
      `<ul class="ex-list">${L(sec, "items").map(it => `<li>${esc(it)}</li>`).join("")}</ul></div>`
    ).join("");
  } else {
    body = `<div class="ex">${esc(L(p, "experience") || "")}</div>`;
  }
  const cls = "person" + (horizontal ? " horizontal" : "") + (extraClass ? " " + extraClass : "");
  return `<div class="${cls}"><div class="ph-wrap"><div class="ph ph-ph">${initials}</div>${img}</div>
    <div class="body">
    <div class="nm">${esc(name)}</div>
    ${body}${email}</div></div>`;
}
function renderPeople() {
  const root = $("#people-root");
  let html = "";
  const SORT_ALPHA = new Set(["Postdoc", "Student", "Research Assistant"]);
  const HORIZONTAL = new Set(["PI", "Faculty"]);
  const surname = (p) => { const parts = (p.name_en || p.name || "").trim().split(/\s+/); return (parts[parts.length - 1] || "").toLowerCase(); };
  for (const key of SECTION_ORDER) {
    const members = D.people.filter(p => p.section === key);
    if (!members.length) continue;
    if (SORT_ALPHA.has(key)) members.sort((a, b) => surname(a).localeCompare(surname(b)) || (a.name_en || "").localeCompare(b.name_en || ""));
    const horizontal = HORIZONTAL.has(key);
    const isFaculty = key === "Faculty";
    const gridClass = (key === "PI" || isFaculty) ? "grid-horizontal grid-pi" : "grid g4";
    html += `<div class="people-group"><h3>${t(UI.sections[key])}</h3>
      <div class="${gridClass}">${members.map(p => personCard(p, horizontal, isFaculty ? "faculty-card" : "")).join("")}</div></div>`;
  }
  root.innerHTML = html;
}

/* ---------- PUBLICATIONS ---------- */
function fmtCitation(p) {
  if (p.authors && p.authors.length) {
    const authors = p.authors.map(n => /^Tang Y/i.test(n) ? `<b>${esc(n)}</b>` : esc(n)).join(", ");
    const title = esc((p.title || "").replace(/\.$/, ""));
    const journal = esc(p.journal || "");
    return `${authors}. <span class="pub-title">${title}.</span> ${journal}`;
  }
  return esc(p.citation).replace(/(Tang Y)\b/g, "<b>$1</b>");
}
function renderPublications() {
  const banner = $("#pub-note"); if (banner) banner.innerHTML = t(UI.pub.note);
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

/* ---------- JOIN ---------- */
function renderJoin() {
  const j = D.join;
  $("#join-intro").innerHTML = `<span class="lead" style="display:block">${esc(L(j, "intro"))}</span>`;
  $("#join-positions").innerHTML = j.positions.map(p =>
    `<div class="join-pos">
       <h4>${esc(L(p, "role"))}</h4>
       <p style="color:var(--muted)">${esc(L(p, "summary"))}</p>
       <ul>${L(p, "requirements").map(r => `<li>${esc(r)}</li>`).join("")}</ul>
     </div>`).join("");
  $("#join-extra").innerHTML =
    `<h3>${t(UI.join.benefits)}</h3>
     <ul style="color:var(--muted);margin-left:20px">${L(j, "benefits").map(b => `<li>${esc(b)}</li>`).join("")}</ul>
     <div class="callout">
       <p><b>📍 ${t(UI.join.location)}</b></p>
       <p style="margin-top:2px">${esc(L(j, "location"))}</p>
       <p style="margin-top:12px"><b>📩 ${t(UI.join.apply)}</b></p>
       <p style="margin-top:2px">${esc(L(j, "apply"))}</p>
       <p style="margin-top:8px">${j.emails.map(e => `<a href="mailto:${esc(e)}">${esc(e)}</a>`).join(" &nbsp;·&nbsp; ")}</p>
     </div>`;
}

/* ---------- boot / rerender ---------- */
const PAGE_FN = { index: renderHome, about: renderAbout, research: renderResearch, people: renderPeople, publications: renderPublications, join: renderJoin };
function rerender() {
  document.documentElement.lang = LANG === "zh" ? "zh-CN" : "en";
  // remove existing nav/footer then rebuild
  document.querySelectorAll(".nav, .footer").forEach(el => el.remove());
  renderChrome();
  renderPageHeader();
  const fn = PAGE_FN[document.body.dataset.page];
  if (fn) try { fn(); } catch (e) { console.error(e); }
}
document.addEventListener("DOMContentLoaded", rerender);
