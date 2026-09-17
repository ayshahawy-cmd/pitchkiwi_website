import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const files = ["index.html", "docs.html", "download/index.html", "legal.html", "get-started.html", "README.md", "hero.md", "pricing.md", "problem.md", "solution.md"];
const pages = Object.fromEntries(await Promise.all(files.map(async (file) => [file, await readFile(new URL(`../${file}`, import.meta.url), "utf8")])));
const combined = Object.values(pages).join("\n");

for (const forbidden of [/\$\d+/, /gumroad/i, /license key/i, /free forever/i, /always free/i, /join waitlist/i, /request access/i, /coming soon/i]) {
  assert.doesNotMatch(combined, forbidden, `Outdated copy remains: ${forbidden}`);
}

assert.match(pages["index.html"], />Download beta</);
assert.match(pages["index.html"], /Free while in beta\./);
assert.match(pages["index.html"], /you@example\.com/);
assert.match(pages["index.html"], /data-beta-form/);
assert.match(pages["download/index.html"], /Install Pitch Kiwi/);
assert.match(pages["download/index.html"], /href="\/api\/download"/);
assert.match(pages["download/index.html"], /macOS 14\+/);
assert.match(pages["download/index.html"], /Apple Silicon/);
assert.match(pages["download/index.html"], /Control-click PitchKiwi/);
assert.doesNotMatch(pages["download/index.html"], /Windows|Linux/);

JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));

console.log(`Validated ${files.length} site files and the beta download copy.`);
