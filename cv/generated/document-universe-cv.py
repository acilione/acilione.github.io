
from pathlib import Path
p=Path('cv/README.md');s=p.read_text()
s += """
Project addition reviewed on 2026-09-22:

- [Universe Visualizer](https://github.com/acilione/universe_visualizer): JavaScript/Three.js astronomical atlas using NASA and Gaia DR3 catalogues, WebXR, automated tests, and GitHub Actions deployment.
- Kept the data engineering projects first and used a plain project title and technology keywords. Condensed project bullets to retain all seven entries in two pages at the existing 10.5 pt body size.
- Rechecked the Greenhouse parsing guidance linked above. The Markdown, single-column layout, standard headings, and text-based PDF export remain unchanged in structure; PDF extraction and link checks include the new entry.
"""
p.write_text(s)
