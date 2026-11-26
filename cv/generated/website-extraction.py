from pathlib import Path
import re,json
root=Path.cwd()
for slug,page in [("heron-fountain","heron_fountain_simulation.html"),("bubble-deflation","bubble_simulation.html"),("boyles-flask","boyles_flask.html")]:
 path=root/"src"/page
 text=path.read_text()
 title=re.search(r"<h1>(.*?)</h1>",text).group(1)
 start=text.index('      <div class="lab-layout">')
 end=text.index("    </main>")
 text=text[:start]+f"""
      <p id="simulation-status" class="embed-status" role="status">Loading the experiment…</p>
      <iframe
        class="simulation-frame"
        data-simulation="{slug}"
        src="https://acilione.github.io/{slug}/?embed=1"
        title="{title} — interactive experiment"
        aria-describedby="simulation-status"
        referrerpolicy="strict-origin"
        allow="fullscreen"
      ></iframe>
      <nav class="simulation-links" aria-label="Experiment links">
        <a href="https://acilione.github.io/{slug}/">Open standalone ↗</a>
        <a href="https://github.com/acilione/{slug}">Source code ↗</a>
      </nav>
"""+text[end:]
 text=re.sub(r'<script type="module">.*?</script>','<script type="module" src="scripts/simulation-embed.js"></script>',text,flags=re.S)
 text=text.replace('<script type="module" src="flask.js"></script>','<script type="module" src="scripts/simulation-embed.js"></script>')
 path.write_text(text)
# Update the project list's simulation links without changing other projects.
path=root/"src/projects.html"
text=path.read_text()
for slug,page in [("heron-fountain","heron_fountain_simulation.html"),("bubble-deflation","bubble_simulation.html"),("boyles-flask","boyles_flask.html")]:
 pattern=r'(<a\s+href="'+re.escape(page)+r'"[^>]*>.*?</a>)'
 text,count=re.subn(pattern,lambda m: m.group(1)+f'\n              <a href="https://github.com/acilione/{slug}" class="action-link source-code">Source code</a>',text,count=1,flags=re.S)
 assert count==1
path.write_text(text)
# Make the child handshake robust if the initial ready message precedes parent initialization.
for slug in ["heron-fountain","bubble-deflation","boyles-flask"]:
 path=root/".standalone"/slug/"src/embed.js"
 text=path.read_text().replace('  setTheme(data.theme);\n  reportSize();','  setTheme(data.theme);\n  if (ready) post("ready");\n  lastHeight = 0;\n  reportSize();')
 path.write_text(text)
print("Website wrappers and source links prepared.")
