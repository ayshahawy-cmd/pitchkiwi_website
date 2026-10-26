import assert from "node:assert/strict";
import test from "node:test";
import betaHandler, { createBetaRecord, isValidEmail, normalizeEmail } from "../api/beta-downloads.js";
import downloadHandler, { DEFAULT_DOWNLOAD_URL, isSafeDownloadUrl } from "../api/download.js";

function responseMock() {
  return {
    headers: {},
    statusCode: 200,
    body: undefined,
    redirectTo: undefined,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
    redirect(code, location) { this.statusCode = code; this.redirectTo = location; return this; }
  };
}

test("normalizes and validates email syntax", () => {
  assert.equal(normalizeEmail("  Dev@Example.COM "), "dev@example.com");
  assert.equal(isValidEmail("dev@example.com"), true);
  assert.equal(isValidEmail("not-an-email"), false);
});

test("creates the future Excel record with fixed source and consent metadata", () => {
  assert.deepEqual(createBetaRecord("dev@example.com"), {
    email: "dev@example.com",
    source: "website_download",
    product: "pitch_kiwi",
    consent_scope: "pitchkiwi_updates_and_relevant_product_announcements_v1"
  });
});

test("rejects an invalid beta email", async () => {
  const response = responseMock();
  await betaHandler({ method: "POST", headers: { "content-type": "application/json" }, body: { email: "wrong" } }, response);
  assert.equal(response.statusCode, 400);
  assert.equal(response.body.ok, false);
});

test("valid and duplicate submissions are idempotent during placeholder storage", async () => {
  for (let submission = 0; submission < 2; submission += 1) {
    const response = responseMock();
    await betaHandler({ method: "POST", headers: { "content-type": "application/json" }, body: { email: "dev@example.com" } }, response);
    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.body, { ok: true, redirect: "/download/" });
  }
});

test("HTML form fallback redirects immediately", async () => {
  const response = responseMock();
  await betaHandler({ method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: "email=dev%40example.com" }, response);
  assert.equal(response.statusCode, 303);
  assert.equal(response.redirectTo, "/download/");
});

test("download URL accepts HTTPS only", () => {
  assert.equal(isSafeDownloadUrl("https://downloads.example.com/PitchKiwi.zip"), true);
  assert.equal(isSafeDownloadUrl("http://downloads.example.com/PitchKiwi.zip"), false);
  assert.equal(isSafeDownloadUrl("javascript:alert(1)"), false);
});

test("download endpoint uses the public release without configuration", () => {
  const previous = process.env.PITCHKIWI_BETA_DOWNLOAD_URL;
  delete process.env.PITCHKIWI_BETA_DOWNLOAD_URL;
  const response = responseMock();
  downloadHandler({ method: "GET" }, response);
  assert.equal(response.statusCode, 302);
  assert.equal(response.redirectTo, DEFAULT_DOWNLOAD_URL);
  if (previous) process.env.PITCHKIWI_BETA_DOWNLOAD_URL = previous;
});

test("download endpoint rejects an unsafe override", () => {
  const previous = process.env.PITCHKIWI_BETA_DOWNLOAD_URL;
  try {
    process.env.PITCHKIWI_BETA_DOWNLOAD_URL = "http://downloads.example.com/PitchKiwi.zip";
    const response = responseMock();
    downloadHandler({ method: "GET" }, response);
    assert.equal(response.statusCode, 503);
    assert.equal(response.body.ok, false);
  } finally {
    if (previous === undefined) delete process.env.PITCHKIWI_BETA_DOWNLOAD_URL;
    else process.env.PITCHKIWI_BETA_DOWNLOAD_URL = previous;
  }
});

test("download endpoint rejects methods other than GET", () => {
  const response = responseMock();
  downloadHandler({ method: "POST" }, response);
  assert.equal(response.statusCode, 405);
  assert.equal(response.headers.Allow, "GET");
});

test("download endpoint redirects to the configured artifact", () => {
  const previous = process.env.PITCHKIWI_BETA_DOWNLOAD_URL;
  process.env.PITCHKIWI_BETA_DOWNLOAD_URL = "https://downloads.example.com/PitchKiwi-macOS.zip";
  const response = responseMock();
  downloadHandler({ method: "GET" }, response);
  assert.equal(response.statusCode, 302);
  assert.equal(response.redirectTo, process.env.PITCHKIWI_BETA_DOWNLOAD_URL);
  if (previous) process.env.PITCHKIWI_BETA_DOWNLOAD_URL = previous;
  else delete process.env.PITCHKIWI_BETA_DOWNLOAD_URL;
});
