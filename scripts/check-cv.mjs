import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import assert from "node:assert/strict";
import { verifyPdf } from "./verify-cv.mjs";
import { renderCv } from "./cv-document.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const at = (...parts) => resolve(root, ...parts);
const source = await readFile(at("cv/Antonino_Cilione_CV.md"), "utf8");
const download = await readFile(
  at("src/downloads/Antonino_Cilione_CV.md"),
  "utf8",
);
assert.equal(
  download,
  source,
  "Markdown download is stale. Run npm run cv:build.",
);
const page = await readFile(at("src/cv.html"), "utf8");
assert.ok(
  page.includes(renderCv(source)),
  "Website CV is stale. Run npm run cv:build.",
);
const report = await verifyPdf(
  await readFile(at("src/downloads/Antonino_Cilione_CV.pdf")),
  source,
);
console.log(
  `PASS: ${report.pages} pages; ${report.textBlocksVerified} text blocks in reading order; ${report.linksVerified} working PDF link annotations; accessible structure; no images or clipped text. Website, Markdown, and PDF agree.`,
);
