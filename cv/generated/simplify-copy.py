from pathlib import Path
import re
root=Path.cwd()
def save(path,text): (root/path).write_text(text,encoding="utf-8")
path="src/index.html"
text=(root/path).read_text()
text=text.replace("Antonino Cilione — Big Data Engineer exploring physics, simulations, and interactive software.","Antonino Cilione — Big Data Engineer. Data pipelines, software development, and physics simulations.")
text=text.replace("Antonino Cilione — Engineering & exploration","Antonino Cilione — Data Engineer")
text=re.sub(r'          <div class="eyebrow">.*?</div>\n', '',text,count=1,flags=re.S)
text=text.replace('<h1>Engineering systems.<br /><span>Exploring ideas.</span></h1>','<h1>Antonino Cilione</h1>')
text=re.sub(r'I’m Antonino, a Big Data Engineer with a curiosity for physics,\s+code, and the things we can build at their intersection\.', 'Big Data Engineer at Enel. I work on data pipelines, backend services, and interactive applications.',text)
text=text.replace('Explore my work','Projects').replace('About me','CV')
text=re.sub(r'        <div class="orbital" aria-hidden="true">.*?</div>\n','',text,count=1,flags=re.S)
text=text.replace('            <span class="section-index">01 / Interactive experiments</span>\n','')
text=text.replace('A little physics. In motion.','Physics simulations')
text=re.sub(r'Gravity, trapped air, and a rising jet\. Explore the physics\s+behind an ancient invention\.', 'Simulation of water flow driven by gravity and compressed air.',text)
text=re.sub(r'Three straws, three timescales\. Watch surface tension and air\s+resistance shape a bubble’s final moments\.', 'Simulation of soap bubble deflation for different straw lengths.',text)
text=text.replace('02 / Beyond the experiments','Contact')
text=re.sub(r'From distributed data platforms to games and microcontrollers\. I\s+like understanding how things work, then making something with what\s+I learn\.', 'For questions about my work or projects, contact me by email.',text)
text=text.replace('Let’s get in touch','Email me').replace('      ><span class="footer-note">Built with curiosity</span>','      >')
save(path,text)

path="src/projects.html"
text=(root/path).read_text()
text=text.replace('      <!-- Subtitle directly under the navbar, same font as the index hero -->\n','')
text=re.sub(r'      <header class="page-header">.*?</header>', '      <header class="page-header">\n        <h1>Projects</h1>\n      </header>',text,count=1,flags=re.S)
text=re.sub(r'A full-featured real-time multiplayer Kamisado board game with sumo\s+push mechanics, chess-style timers, reconnection support, and\s+spectator mode\.', 'A real-time multiplayer Kamisado board game.',text)
text=text.replace('Project involving object manipulation using OpenCV and OpenGL.', 'Object manipulation through hand tracking using OpenCV and OpenGL.')
text=re.sub(r'An initial push, a recirculating stream, and the inevitable loss of\s+momentum\. Explore the unsteady viscous model\.', 'Simulation of recirculating water flow with gravity and viscous losses.',text)
text=re.sub(r'A full-featured lab with interactable experiments and other funny\s+stuff\.', 'An interactive physics lab with multiple experiments.',text)
start=text.index('        <div class="project-item">\n          <div class="project-title">\n            Danny')
end=text.index('        <div class="project-item">',start+1)
lab=text[start:end]
text=text[:start]+text[end:]
android=text.index('        <h2 class="category-heading">Android</h2>')
text=text[:android]+lab+text[android:]
for repo,paper in [
 ("heron-fountain","https://pubs.aip.org/aapt/ajp/article/94/7/530/3395784/The-physics-behind-Heron-s-fountain"),
 ("boyles-flask","https://doi.org/10.1088/1361-6404/ae280c")
]:
 pattern=r'(<a\s+href="https://github.com/acilione/'+repo+r'"[^>]*>.*?</a\s*>)'
 text,count=re.subn(pattern, lambda m:m.group(1)+f'\n            <a href="{paper}" class="action-link">Read paper</a>',text,count=1,flags=re.S)
 assert count==1,repo
save(path,text)

path="cv/page-template.html"
text=(root/path).read_text().replace('          <p>A background in data. A broader view of software.</p>\n','')
save(path,text)

path="src/styles/styles.css"
text=(root/path).read_text()
text=re.sub(r'\.status-dot \{[^}]*\}\n','',text)
text=re.sub(r'\.home-hero \{[^}]*\}', '.home-hero {\n  padding: 64px 0;\n}',text,count=1)
text=text.replace('.hero-copy h1 span {\n  color: var(--accent);\n}\n','')
text=text.replace('.hero-copy > p {\n  max-width: 420px;', '.hero-copy > p {\n  max-width: 620px;')
text=re.sub(r'\.orbital \{.*?(?=\.work-section \{)','',text,count=1,flags=re.S)
text=text.replace('  .home-hero {\n    grid-template-columns: 1fr;\n    padding: 55px 0 35px;\n    gap: 0;\n  }','  .home-hero {\n    padding: 40px 0;\n  }')
text=re.sub(r'  \.orbital \{[^}]*\}\n','',text)
save(path,text)

path="src/heron_fountain_simulation.html"
text=(root/path).read_text().replace('An ancient invention, explained by gravity and compressed air.', 'Simulation of water flow driven by gravity and compressed air.')
save(path,text)
path="src/boyles_flask.html"
text=(root/path).read_text()
text=re.sub(r'Give the water an initial push\. Watch gravity and viscosity bring its\s+motion to a halt\.', 'Simulation of recirculating water flow with gravity and viscous losses.',text)
save(path,text)
print("Updated website wording, layout, project order, and paper links.")
