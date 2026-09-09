import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { renderCv, makePrintDocument } from "./cv-document.mjs";
import { verifyPdf } from "./verify-cv.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const at = (...parts) => resolve(root, ...parts);
const markdown = await readFile(at("cv/Antonino_Cilione_CV.md"), "utf8");
const css = await readFile(at("cv/print.css"), "utf8");
const template = await readFile(at("cv/page-template.html"), "utf8");
const content = renderCv(markdown);
const printDocument = makePrintDocument(content, css);
await mkdir(at("src/downloads"), { recursive: true });
await mkdir(at("cv/generated"), { recursive: true });

let browser;
try {
  browser = await chromium.launch();
} catch (cause) {
  throw new Error(
    "PDF generation needs Chromium. Run npm run cv:setup once, then retry.",
    { cause },
  );
}
let pdf;
try {
  const page = await browser.newPage();
  // An isolated document; no navigation to the portfolio and no screenshots.
  await page.route("**/*", (route) => route.abort());
  await page.setContent(printDocument, { waitUntil: "load" });
  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => document.fonts.ready);
  pdf = await page.pdf({
    preferCSSPageSize: true,
    printBackground: true,
    displayHeaderFooter: false,
    tagged: true,
    outline: true,
  });
} finally {
  await browser.close();
}
// Do not publish updated downloads unless their text has passed extraction checks.
const report = await verifyPdf(pdf, markdown);
await writeFile(at("src/downloads/Antonino_Cilione_CV.pdf"), pdf);
await copyFile(
  at("cv/Antonino_Cilione_CV.md"),
  at("src/downloads/Antonino_Cilione_CV.md"),
);
await writeFile(at("cv/generated/Antonino_Cilione_CV.html"), printDocument);
await writeFile(
  at("cv/generated/validation.json"),
  JSON.stringify(report, null, 2) + "\n",
);
await writeFile(at("cv/generated/extracted.txt"), report.text + "\n");
await writeFile(
  at("src/cv.html"),
  "<!-- Generated from cv/Antonino_Cilione_CV.md and cv/page-template.html. -->\n" +
    template.replace("{{CV_CONTENT}}", content),
);
console.log(
  `CV built: ${report.pages} A4 pages, ${Math.round(pdf.length / 1024)} KB; text, reading order, links, and document structure verified.`,
);
