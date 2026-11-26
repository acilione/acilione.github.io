from pathlib import Path
root=Path.cwd()
text=(root/"scripts/check-site.mjs").read_text()
needle='    assert.equal(await page.locator("h1").count(), 1, name);'
addition="""
    if (name === "index") {
      assert.equal(await page.locator("h1").innerText(), "Antonino Cilione");
      assert.equal(await page.locator(".orbital").count(), 0);
      assert.equal(await page.getByRole("heading", {name:"Physics simulations", exact:true}).count(), 1);
      assert.doesNotMatch(await page.locator("body").innerText(), /curiosity|curious mind|Exploring ideas|little physics/i);
      await page.screenshot({path:"cv/generated/home-plain-desktop.png", fullPage:true});
      await page.setViewportSize({width:390, height:844});
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.screenshot({path:"cv/generated/home-plain-mobile.png", fullPage:true});
      await page.setViewportSize({width:1440, height:1000});
    }
    if (name === "projects") {
      assert.equal(await page.locator("h1").innerText(), "Projects");
      const titles = await page.locator(".project-title").allTextContents();
      const flask = titles.findIndex(t => t.includes("Boyle"));
      const lab = titles.findIndex(t => t.includes("Danny and Tony"));
      assert.ok(flask >= 0 && lab === flask + 1, "Lab follows the physics experiments");
      assert.equal(await page.locator('a[href="https://pubs.aip.org/aapt/ajp/article/94/7/530/3395784/The-physics-behind-Heron-s-fountain"]').innerText(), "Read paper");
      assert.equal(await page.locator('a[href="https://doi.org/10.1088/1361-6404/ae280c"]').innerText(), "Read paper");
      assert.match(await page.locator("body").innerText(), /Object manipulation through hand tracking using OpenCV and OpenGL/);
      assert.doesNotMatch(await page.locator("body").innerText(), /sumo|chess-style|Built out of curiosity/);
      await page.screenshot({path:"cv/generated/projects-plain-desktop.png", fullPage:true});
      await page.setViewportSize({width:390, height:844});
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.screenshot({path:"cv/generated/projects-plain-mobile.png", fullPage:true});
      await page.setViewportSize({width:1440, height:1000});
    }
"""
assert needle in text
(root/"cv/generated/check-copy.mjs").write_text(text.replace(needle,needle+addition))
