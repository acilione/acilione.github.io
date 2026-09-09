import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  renderCv,
  makePrintDocument,
  validateMarkdown,
} from "../scripts/cv-document.mjs";

const markdown = await readFile(
  new URL("../cv/Antonino_Cilione_CV.md", import.meta.url),
  "utf8",
);

test("CV preserves standard sections and contact information in document order", () => {
  const html = renderCv(markdown);
  const sections = [
    "contact",
    "summary",
    "technical-skills",
    "work-experience",
    "education",
    "projects",
    "achievements",
    "certifications-and-training",
    "languages",
  ];
  let last = -1;
  for (const section of sections) {
    const index = html.indexOf('data-section="' + section + '"');
    assert.ok(index > last);
    last = index;
  }
  assert.match(html, /mailto:antoninocilione96@gmail.com/);
  assert.match(html, /Jul 2022 - Present/);
});
test("CV source rejects layouts that undermine parsing", () => {
  for (const extra of [
    '\n<img src="photo.png">',
    "\n![Photo](https://example.com/photo.png)",
    "\n| Skill | Level |\n|---|---|\n| SQL | 5 |",
    '\n<iframe src="https://example.com"></iframe>',
  ]) {
    assert.throws(() => validateMarkdown(markdown + extra), /Unsupported/);
  }
  assert.throws(
    () =>
      validateMarkdown(markdown.replace("## Work Experience", "## My Journey")),
    /Missing standard CV section/,
  );
});
test("CV source rejects unsafe download or document links", () => {
  assert.throws(
    () => validateMarkdown(markdown + "\n[unsafe](javascript:alert)"),
    /HTTPS or mailto/,
  );
});
test("PDF template is an independent semantic document with no website scripts", () => {
  const html = makePrintDocument(
    renderCv(markdown),
    "body { font-family: Arial; }",
  );
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<main>/);
  assert.doesNotMatch(
    html,
    /<script|<canvas|navbar|styles\/styles\.css|data-theme/,
  );
});
