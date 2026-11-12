import re
import sys
from pathlib import Path

default = Path(__file__).with_name('naskah.md')
p = Path(sys.argv[1]) if len(sys.argv) > 1 else default
lines = p.read_text(encoding='utf-8').splitlines()
vo = []
in_scene = False
for line in lines:
    if line.startswith('## Scene'):
        in_scene = True
        continue
    if in_scene and line.startswith('**Audio'):
        in_scene = False
    if in_scene and line.startswith('>'):
        t = line.lstrip('>').strip()
        if t:
            vo.append(t)

text = ' '.join(vo)
words = re.findall(r"[\wÀ-ÿ'’-]+", text)
print('File:', p)
print('VO paragraphs:', len(vo))
print('VO words:', len(words))
print('Est. duration at 2.6 w/s:', round(len(words) / 2.6, 1), 's')
print('Est. duration at 2.8 w/s:', round(len(words) / 2.8, 1), 's')
for i, para in enumerate(vo, 1):
    print(i, len(re.findall(r"[\wÀ-ÿ'’-]+", para)), para[:70])
