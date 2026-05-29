#!/usr/bin/env python3
"""Bundle data/*.json into assets/js/data.js (so pages work via file:// too).
Run from anywhere:  python3 build.py"""
import json, glob, os

BASE = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE, "data")
OUT = os.path.join(BASE, "assets", "js", "data.js")

data = {}
for f in sorted(glob.glob(os.path.join(DATA_DIR, "*.json"))):
    name = os.path.splitext(os.path.basename(f))[0]
    if name == "people_raw":
        continue
    with open(f, encoding="utf-8") as fh:
        data[name] = json.load(fh)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as out:
    out.write("// Auto-generated from data/*.json — edit the JSON then run: python3 build.py\n")
    out.write("window.DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n")

print("data.js written. keys:", list(data.keys()))
print("people:", len(data.get("people", [])),
      "| pubs:", len(data.get("publications", [])),
      "| news:", len(data.get("news", [])))
