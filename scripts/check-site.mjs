import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const files = ["index.html", "docs.html", "download/index.html", "legal.html", "get-started.html", "README.md", "hero.md", "pricing.md", "problem.md", "solution.md"];
const root = new URL("../", import.meta.url);
const pages = Object.fromEntries(await Promise.all(files.map(async (file) => [file, await readFile(new URL(file, root), "utf8")])));
const combined = Object.values(pages).join("\n");

for (const forbidden of [/\$\d+/, /gumroad/i, /free while in beta/i, /join waitlist/i, /request access/i, /you may not redistribute/i]) {
  assert.doesNotMatch(combined, forbidden, `Outdated public copy remains: ${forbidden}`);
}
assert.match(pages["index.html"], />Download beta</);
assert.match(pages["index.html"], /Free and open source under MIT\./);
assert.match(pages["index.html"], /href="\/download\/"/);
assert.match(pages["index.html"], /https:\/\/github\.com\/ayshahawy-cmd\/pitchkiwi/);
assert.doesNotMatch(pages["index.html"], /data-beta-form|input[^>]+type="email"/);
assert.match(pages["download/index.html"], /href="\/api\/download"/);
assert.match(pages["download/index.html"], /macOS 14\+/);
assert.match(pages["download/index.html"], /Apple Silicon/);
assert.match(pages["download/index.html"], /not notarized/);
assert.match(pages["download/index.html"], /SHA-256/);
assert.match(pages["legal.html"], /MIT License/);
assert.ok(!/Fn\+Shift by default|increase the paste delay/.test(pages["docs.html"]), "Docs must not advertise unimplemented controls");

let checked = 0;
for (const [file, html] of Object.entries(pages).filter(([name]) => name.endsWith(".html"))) {
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1];
    if (/^(?:https?:|data:|mailto:|tel:)/i.test(value)) continue;
    const target = value.startsWith("/") ? new URL(value.slice(1), root) : new URL(value, new URL(file, root));
    if (target.pathname.includes("/api/")) continue;
    if (target.pathname.endsWith("/")) target.pathname += "index.html";
    const anchor = target.hash.slice(1);
    target.hash = "";
    await access(target);
    if (anchor && target.pathname.endsWith(".html")) {
      const targetHtml = await readFile(target, "utf8");
      assert.ok(targetHtml.includes(`id="${anchor}"`), `${file}: missing anchor ${value}`);
    }
    checked += 1;
  }
}
JSON.parse(await readFile(new URL("vercel.json", root), "utf8"));
assert.match(await readFile(new URL("LICENSE", root), "utf8"), /^MIT License/);
console.log(`Validated ${files.length} content files and ${checked} local links, plus MIT licensing and public downloads.`);
