
from pathlib import Path
p=Path('cv/Antonino_Cilione_CV.md');s=p.read_text()
edits={
"Built a Python/PostgreSQL/dbt/MinIO transport-data pipeline with versioned archives, validation, and tested historical models; added a TypeScript/MapLibre commute explorer and timetable-aware routing API.":"Built a Python/PostgreSQL/dbt/MinIO pipeline with versioned archives and tested historical models; added a TypeScript/MapLibre commute explorer and timetable-aware routing API.",
"Built a JavaScript/Three.js astronomical atlas integrating NASA catalogues and Gaia DR3 data, with 3D navigation and WebXR support for virtual and mixed reality; added automated tests and GitHub Actions deployment.":"Built a JavaScript/Three.js atlas integrating NASA and Gaia DR3 catalogues, with WebXR virtual and mixed reality, automated tests, and GitHub Actions deployment.",
"Built a TypeScript/Node.js/Socket.IO multiplayer game and Electron host with server-authoritative rules, synchronized timers, reconnection, and automated game-rule and socket integration tests.":"Built a TypeScript/Node.js/Socket.IO multiplayer game and Electron host with server-authoritative rules, reconnection, and automated rule and socket integration tests.",
"Developed C firmware for MEMS microphone capture using DFSDM/DMA and a Python receiver saving 16 kHz WAV audio over ST-LINK USB; implemented button controls, buffering, checksums, and host tests.":"Built C firmware for MEMS microphone capture using DFSDM/DMA and a Python receiver for 16 kHz WAV audio over ST-LINK USB, with buffering, checksums, and host tests."
}
for old,new in edits.items():
 assert old in s
 s=s.replace(old,new)
p.write_text(s)
