# Tang Lab Website

Static academic website for the Yi Tang Laboratory (Xuanwu Hospital, Capital Medical University).
Pure HTML/CSS/JS — no build tools required.

## Preview locally
- Easiest: open `index.html` directly in a browser (data is bundled in `assets/js/data.js`, so it works offline).
- Or run a local server: `python3 -m http.server` then visit http://localhost:8000

## Editing content
All content lives in `data/*.json`:
- `about.json` — lab intro + PI bio/timeline
- `research.json` — research areas
- `people.json` — members (section: PI / Faculty / Postdoc / Student / Research Assistant)
- `publications.json` — publication list (year/doi/pmid auto-detected)
- `news.json` — news items
- `join.json` — recruitment

After editing any JSON, regenerate the bundled data file:
```
python3 build.py
```
This rewrites `assets/js/data.js` (which the pages actually read, so file:// preview works).

Member photos: `assets/people/<slug>.jpg`  ·  News/Hero images: `assets/news/`, `assets/img/`

## Deploy to GitHub Pages
1. Create a repo and push the contents of this `site/` folder to the root.
2. Settings → Pages → deploy from branch (root). `.nojekyll` is already included.

## Notes / TODO
- Primary color is set to Xuanwu blue `#0a4b8c` in `assets/css/style.css` (`--blue`) — adjust to the exact brand hex if needed.
- News article bodies are kept in the original Chinese (full text); the rest of the site is in English.
