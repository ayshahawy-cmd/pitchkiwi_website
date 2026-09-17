import { cp, copyFile, mkdir, rm, stat } from "node:fs/promises";
import { basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const outputDirectory = fileURLToPath(new URL("../public/", import.meta.url));

if (basename(outputDirectory) !== "public" || dirname(outputDirectory) !== projectRoot.replace(/\/$/, "")) {
  throw new Error("Refusing to write outside the expected public build directory.");
}

const files = [
  "index.html",
  "docs.html",
  "get-started.html",
  "legal.html",
  "robots.txt",
  "sitemap.xml"
];
const directories = ["assets", "download", "screenshots"];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const file of files) {
  await copyFile(new URL(`../${file}`, import.meta.url), new URL(`../public/${file}`, import.meta.url));
}

for (const directory of directories) {
  await cp(new URL(`../${directory}/`, import.meta.url), new URL(`../public/${directory}/`, import.meta.url), { recursive: true });
}

for (const required of ["index.html", "download/index.html", "assets/beta-download.js"]) {
  const info = await stat(new URL(`../public/${required}`, import.meta.url));
  if (!info.isFile()) throw new Error(`Missing build output: ${required}`);
}

console.log(`Built static site in public/ (${files.length} files and ${directories.length} asset directories).`);
