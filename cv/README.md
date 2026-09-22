# Markdown CV and PDF export

Edit **Antonino_Cilione_CV.md**. It is the single content source for the website CV, downloadable Markdown, and PDF.

## Setup and use

Use Node.js 22.13 or newer (Node 24 recommended).

```sh
npm install
npm run cv:setup
npm run cv:build
npm run cv:check
```

On Linux machines missing browser libraries, install them with `npx playwright install --with-deps chromium`.

Both `npm start` and `npm run build` regenerate the CV first. After editing the Markdown while the development server is running, run `npm run cv:build`; Parcel will pick up the generated page and downloads.

- Source: `cv/Antonino_Cilione_CV.md`
- Document typography: `cv/print.css`
- Website shell: `cv/page-template.html`
- Generated website: `src/cv.html` (do not edit directly)
- Downloads: `src/downloads/Antonino_Cilione_CV.md` and `.pdf`
- Inspection artifacts: `cv/generated/Antonino_Cilione_CV.html`, `extracted.txt`, `validation.json` (ignored by Git)

Parcel copies the downloads into `docs/downloads/` and resolves the website links. The download filenames remain `Antonino_Cilione_CV.pdf` and `Antonino_Cilione_CV.md`.

## How the PDF is made

Markdown is parsed into semantic headings, paragraphs, lists, and links. A standalone document combines that content with `print.css`. Chromium typesets it directly into an A4 PDF with selectable text, accessibility tags, and link annotations.

The renderer never visits the website or captures screenshots. It has no website navigation, theme, external assets, headers, or footers. Network requests are blocked during document rendering. The PDF's two-page layout uses a document-only page break before Education; the Markdown remains ordinary, portable Markdown.

Keep body type readable. The generator rejects exports longer than two pages instead of silently scaling the document down. Shorten content or deliberately revise the print layout when adding material.

## Validation and its limits

The build checks the output with Mozilla PDF.js before replacing downloads:

- Every source block survives extraction in its original reading order.
- Contact details, dates, skills, visible URLs, and all other text remain recoverable.
- Link annotations are present, text stays within page bounds, pages are A4, and there are at most two.
- Pages contain text and accessibility structure, with no image-based CV content.
- The document stays below Greenhouse's documented 2.5 MB parser limit.

`npm run cv:check` also confirms that the website and Markdown download match the current source. `npm test` includes source-format and document-template checks.

These are local parsing checks, not certification by an ATS vendor. Different application systems behave differently, and employers may require a particular file format. Tailor truthful skills and experience to each vacancy; this CV defaults to data engineering while retaining backend and full-stack evidence.

## Sources and editorial decisions

Research reviewed on 2026-09-08:

- [Greenhouse: unsuccessful resume parse](https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse): parsing risks include columns, graphics, tables, headers/footers, and contact details in text boxes. Applied a single column and ordinary body contact details.
- [Jobscan: ATS resume formatting guide](https://www.jobscan.co/resume-templates/ats-templates): standard section names, common fonts, reverse chronological experience, text-based exports, and relevant keywords. Used those conventions with a simple sans-serif document.
- [Harvard: technology resume example](https://careerservices.fas.harvard.edu/resources/harvard-college-resume-example-tech/): consulted the career-service resource listing; its downloadable PDF was unavailable during this review.

Employment, degree, dates, languages, course completion, and competition results come from the existing CV. No new employment achievements, performance metrics, or job titles were invented. Basic introductory courses and early projects were omitted to prioritize relevant experience.

The public [GitHub profile](https://github.com/acilione) and repository inventory were reviewed. The selected project descriptions were checked against:

- [Marketplace Lakehouse](https://github.com/acilione/marketplace_lakehouse): local reference platform; no claim of production deployment, scale, or SLA.
- [Milano Mobility](https://github.com/acilione/milano_mobility): versioned timetable pipeline and a TypeScript commute explorer.
- [Kamisado](https://github.com/acilione/kamisado): full-stack multiplayer application and desktop host.
- [Soap Bubble Deflation Simulation](https://github.com/acilione/Soap-Bubble-Deflation-Simulation) and this website's current simulation implementation.

Forks were not represented as original projects. Data engineering leads the summary and skills, while APIs, TypeScript, Node.js, and application testing preserve relevance to broader software roles.

Project additions reviewed on 2026-09-09:

- [Payment Risk / Pulse](https://github.com/acilione/payment-risk): Java/Flink reference pipeline using synthetic payments, Kafka transactional output, ClickHouse analytics, and a React/TypeScript dashboard. Kept the reference and synthetic-data context; no production deployment or performance claims added.
- [STM32 Microphone Recorder](https://github.com/acilione/b-l475e-iot01a-audio-recording-example): C firmware capturing MEMS audio through DFSDM/DMA, ST-LINK USB transfer, a Python WAV receiver, and host tests.

Condensed existing project descriptions and linked each project title directly to its repository or portfolio page to retain all six projects at readable type size within two pages. Employment content is unchanged.

Project addition reviewed on 2026-09-22:

- [Universe Visualizer](https://github.com/acilione/universe_visualizer): JavaScript/Three.js astronomical atlas using NASA and Gaia DR3 catalogues, WebXR, automated tests, and GitHub Actions deployment.
- Kept the data engineering projects first and used a plain project title and technology keywords. Condensed project bullets to retain all seven entries in two pages at the existing 10.5 pt body size.
- Rechecked the Greenhouse parsing guidance linked above. The Markdown, single-column layout, standard headings, and text-based PDF export remain unchanged in structure; PDF extraction and link checks include the new entry.
