import re
from pathlib import Path

p = Path(__file__).with_name("naskah.md")
lines = p.read_text(encoding="utf-8").splitlines()

scene = None
vo = []
rows = []
speaker = None
for line in lines:
    m = re.match(r"## Scene (\d+)\..*?\((.*?)\)", line)
    if m:
        if scene is not None:
            rows.append((scene, " ".join(vo)))
        scene = m.group(1)
        vo = []
        continue
    if scene is not None and line.startswith("**Audio"):
        rows.append((scene, " ".join(vo)))
        scene = None
        vo = []
        continue
    if scene is not None and line.startswith("**") and line.strip("**").split("**")[0]:
        pass
    if scene is not None and line.startswith(">"):
        t = line.lstrip(">").strip()
        if t:
            vo.append(t)

total = 0
for name, text in rows:
    n = len(re.findall(r"[\wÀ-ÿ'-]+", text))
    total += n
    print(f"Scene {name}: {n} kata, {n/2.6:.1f}s @2.6 w/s, frames {round(n/2.6*30)}")
print("Total:", total)
