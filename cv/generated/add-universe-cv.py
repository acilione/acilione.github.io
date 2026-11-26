
from pathlib import Path
import shutil
shutil.copy2('src/downloads/Antonino_Cilione_CV.pdf','cv/generated/cv-before-universe-addition.pdf')
p=Path('cv/Antonino_Cilione_CV.md');s=p.read_text()
marker='### [Kamisado](https://github.com/acilione/kamisado)'
entry="""### [Universe Visualizer](https://github.com/acilione/universe_visualizer)

- Built a JavaScript/Three.js astronomical atlas integrating NASA catalogues and Gaia DR3 data, with 3D navigation and WebXR support for virtual and mixed reality; added automated tests and GitHub Actions deployment.

"""
assert marker in s and '### [Universe Visualizer]' not in s
p.write_text(s.replace(marker,entry+marker))
