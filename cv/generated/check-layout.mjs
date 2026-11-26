import {readFile, writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {renderCv, makePrintDocument} from '../../scripts/cv-document.mjs';
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs';
const browser=await chromium.launch();
try {
const page=await browser.newPage();
await page.setContent(makePrintDocument(renderCv(await readFile('cv/Antonino_Cilione_CV.md','utf8')),await readFile('cv/print.css','utf8')));
const bytes=await page.pdf({preferCSSPageSize:true,tagged:true});
await writeFile('cv/generated/layout.pdf',bytes);
const task=getDocument({data:Uint8Array.from(bytes)}), doc=await task.promise;
for(let i=1;i<=doc.numPages;i++){
const content=await (await doc.getPage(i)).getTextContent();
const items=content.items.filter(x=>x.str?.trim());
console.log(i,items.slice(0,5).map(x=>x.str).join(' '),'... END ...',items.slice(-6).map(x=>x.str).join(' '));
}
await task.destroy();
}finally{await browser.close();}
