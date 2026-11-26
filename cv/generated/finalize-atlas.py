
from pathlib import Path
p=Path('README.md');s=p.read_text().replace('All six public','All seven public').replace('all six built','all seven built');p.write_text(s)
p=Path('scripts/check-site.mjs');s=p.read_text()
s=s.replace('      await page.screenshot({ path: "cv/generated/universe-desktop.png" });\n      await page.keyboard.press("Escape");','      await page.keyboard.press("Escape");\n      await frame.locator("#modal").waitFor({ state: "hidden" });\n      await page.screenshot({ path: "cv/generated/universe-desktop.png", fullPage: true });')
s=s.replace('      await page.screenshot({ path: "cv/generated/universe-mobile.png" });','      await page.keyboard.press("Escape");\n      await frame.locator("#modal").waitFor({ state: "hidden" });\n      await page.screenshot({ path: "cv/generated/universe-mobile.png", fullPage: true });')
p.write_text(s)
for p in Path('docs').glob('*.html'):
 s=p.read_text();p.write_text(s.rstrip()+'\n')
