import { marked } from "marked";
import { getDocument, OPS } from "pdfjs-dist/legacy/build/pdf.mjs";

function inlineText(tokens) {
  return tokens
    .map((t) => {
      if (t.type === "br") return " ";
      if (t.tokens) return inlineText(t.tokens);
      return t.text || "";
    })
    .join("");
}
function blocks(tokens) {
  return tokens
    .flatMap((t) => {
      if (["heading", "paragraph", "text"].includes(t.type))
        return [inlineText(t.tokens || [t])];
      if (t.type === "list")
        return t.items.flatMap((item) => blocks(item.tokens));
      return [];
    })
    .filter(Boolean);
}
const normalize = (text) =>
  text
    .normalize("NFKC")
    .replace(/[\s\u00ad]+/g, "")
    .replace(/[•●]/g, "");

export async function verifyPdf(bytes, markdown) {
  if (bytes.length >= 2.5 * 1024 * 1024)
    throw new Error(
      "CV exceeds the 2.5 MB parsing limit documented by Greenhouse.",
    );
  const loadingTask = getDocument({
    data: Uint8Array.from(bytes),
    useSystemFonts: true,
    isEvalSupported: false,
  });
  const document = await loadingTask.promise;
  try {
    if (document.numPages > 2)
      throw new Error(
        "CV exceeds two pages; shorten the content rather than shrinking its type.",
      );
    const pages = [],
      allLinks = [],
      fontNames = new Set();
    const imageOps = [
      OPS.paintImageXObject,
      OPS.paintInlineImageXObject,
      OPS.paintImageMaskXObject,
    ];
    for (let i = 1; i <= document.numPages; i++) {
      const page = await document.getPage(i),
        viewport = page.getViewport({ scale: 1 });
      if (
        Math.abs(viewport.width - 595.28) > 2 ||
        Math.abs(viewport.height - 841.89) > 2
      )
        throw new Error("CV page is not A4.");
      const content = await page.getTextContent();
      const items = content.items.filter(
        (item) => "str" in item && item.str.trim(),
      );
      if (!items.length)
        throw new Error("CV contains a blank or image-only page.");
      for (const item of items) {
        const x = item.transform[4],
          y = item.transform[5];
        if (
          x < 0 ||
          x + item.width > viewport.width + 1 ||
          y < 0 ||
          y > viewport.height
        )
          throw new Error("CV text falls outside the page.");
        fontNames.add(item.fontName);
      }
      const operators = await page.getOperatorList();
      if (operators.fnArray.some((op) => imageOps.includes(op)))
        throw new Error("CV must contain text, not embedded images.");
      if (!(await page.getStructTree()))
        throw new Error("PDF is missing its accessibility structure.");
      allLinks.push(
        ...(await page.getAnnotations())
          .filter((a) => a.subtype === "Link")
          .map((a) => a.url || a.unsafeUrl),
      );
      pages.push(
        items.map((item) => item.str + (item.hasEOL ? "\n" : " ")).join(""),
      );
    }
    // Every Markdown block must survive in the same logical order, including names,
    // dates, skill terms, visible URLs, and the final line of the CV.
    const text = pages.join("\n\n"),
      normalized = normalize(text);
    let cursor = 0,
      blockCount = 0;
    for (const block of blocks(marked.lexer(markdown))) {
      const expected = normalize(block),
        offset = normalized.indexOf(expected, cursor);
      if (offset === -1)
        throw new Error(
          "Missing or out-of-order PDF text: " + block.slice(0, 100),
        );
      cursor = offset + expected.length;
      blockCount++;
    }
    const tokens = marked.lexer(markdown),
      expectedLinks = [];
    marked.walkTokens(tokens, (t) => {
      if (t.type === "link") expectedLinks.push(t.href);
    });
    for (const href of expectedLinks) {
      if (
        !allLinks.some(
          (link) => link?.replace(/\/$/, "") === href.replace(/\/$/, ""),
        )
      )
        throw new Error("PDF link missing: " + href);
    }
    return {
      pages: document.numPages,
      bytes: bytes.length,
      textBlocksVerified: blockCount,
      fonts: [...fontNames],
      linksVerified: expectedLinks.length,
      tagged: true,
      text,
    };
  } finally {
    await loadingTask.destroy();
  }
}
