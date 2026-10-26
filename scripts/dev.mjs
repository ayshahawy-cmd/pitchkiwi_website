import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import betaHandler from "../api/beta-downloads.js";
import downloadHandler from "../api/download.js";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const redirects = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8")).redirects || [];
const devPort = Number(process.env.PITCHKIWI_DEV_PORT || 4173);
const mimeTypes = { ".css": "text/css", ".html": "text/html", ".js": "text/javascript", ".png": "image/png", ".svg": "image/svg+xml", ".xml": "application/xml" };

function responseAdapter(response) {
  response.status = function (code) { response.statusCode = code; return response; };
  response.json = function (body) { response.end(JSON.stringify(body)); return response; };
  response.redirect = function (code, location) { response.writeHead(code, { Location: location }); response.end(); return response; };
  return response;
}

async function readBody(request) {
  let body = "";
  for await (const chunk of request) body += chunk;
  const type = request.headers["content-type"] || "";
  if (type.includes("application/json")) {
    try { return JSON.parse(body); } catch { return {}; }
  }
  return body;
}

async function serveStatic(pathname, response) {
  const requestPath = pathname.endsWith("/") ? `${pathname}index.html` : pathname;
  const filePath = resolve(root, `.${requestPath}`);
  if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  try {
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error("Not a file");
    response.writeHead(200, { "Content-Type": `${mimeTypes[extname(filePath)] || "application/octet-stream"}; charset=utf-8` });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404).end("Not found");
  }
}

createServer(async (request, response) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
  const adaptedResponse = responseAdapter(response);
  const redirect = redirects.find((entry) => entry.source === pathname);
  if (redirect) {
    adaptedResponse.redirect(redirect.permanent ? 308 : 307, redirect.destination);
    return;
  }
  if (pathname === "/api/beta-downloads") {
    request.body = await readBody(request);
    await betaHandler(request, adaptedResponse);
    return;
  }
  if (pathname === "/api/download") {
    downloadHandler(request, adaptedResponse);
    return;
  }
  await serveStatic(pathname, response);
}).listen(devPort, "127.0.0.1", () => {
  console.log(`PitchKiwi website running at http://127.0.0.1:${devPort}`);
});
