
import { readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { renderCv, makePrintDocument } from "../../scripts/cv-document.mjs";
const md = await readFile("cv/Antonino_Cilione_CV.md", "utf8");
const css = await readFile("cv/print.css", "utf8");
const browser = await chromium.launch();
try {
 const page = await browser.newPage();
 await page.setContent(makePrintDocument(renderCv(md), css));
 await page.emulateMedia({media:"print"});
 const bytes = await page.pdf({preferCSSPageSize:true, tagged:true});
 await writeFile("cv/generated/layout-diagnostic.pdf",bytes);
 const pdf = await getDocument({data:Uint8Array.from(bytes)}).promise;
 for(let i=1;i<=pdf.numPages;i++) {
  const data = await (await pdf.getPage(i)).getTextContent();
  const lines = data.items.filter(x => x.str?.trim()).map(x=>x.str);
  console.log(JSON.stringify({page:i,first:lines.slice(0,10),last:lines.slice(-14)}));
 }

} finally { await browser.close(); }
