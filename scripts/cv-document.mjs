import { marked } from "marked";

const escapeAttribute = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;");

export function validateMarkdown(markdown) {
  const tokens = marked.lexer(markdown);
  const headings = tokens.filter((t) => t.type === "heading");
  if (headings.filter((t) => t.depth === 1).length !== 1)
    throw new Error("The CV must have exactly one name heading.");
  for (const heading of [
    "Summary",
    "Technical Skills",
    "Work Experience",
    "Education",
    "Projects",
    "Languages",
  ]) {
    if (!headings.some((t) => t.depth === 2 && t.text === heading))
      throw new Error("Missing standard CV section: " + heading);
  }
  // Keep the source portable and the document in a predictable reading order.
  marked.walkTokens(tokens, (token) => {
    if (["html", "table", "image", "code", "blockquote"].includes(token.type)) {
      throw new Error(
        "Unsupported CV Markdown element: " +
          token.type +
          ". Use headings, paragraphs, links, and bullets.",
      );
    }
    if (token.type === "link" && !/^(https:\/\/|mailto:)/.test(token.href))
      throw new Error("CV links must use HTTPS or mailto.");
  });
  return tokens;
}

export function renderCv(markdown) {
  const tokens = validateMarkdown(markdown);
  const groups = [];
  let current = { name: "contact", tokens: [] };
  for (const token of tokens) {
    if (token.type === "heading" && token.depth === 2) {
      groups.push(current);
      current = {
        name: token.text.toLowerCase().replaceAll(" ", "-"),
        tokens: [],
      };
    }
    current.tokens.push(token);
  }
  groups.push(current);
  return groups
    .map(
      (group) =>
        `<section class="${group.name === "contact" ? "resume-contact" : "resume-section"}" data-section="${escapeAttribute(group.name)}">\n${marked.parser(group.tokens)}\n</section>`,
    )
    .join("\n");
}

export function makePrintDocument(content, css) {
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>Antonino Cilione - CV</title><meta name="author" content="Antonino Cilione"><style>${css}</style></head><body><main>${content}</main></body></html>`;
}
