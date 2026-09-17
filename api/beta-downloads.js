const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function isValidEmail(email) {
  return email.length >= 3 && email.length <= 254 && EMAIL_PATTERN.test(email);
}

export function createBetaRecord(email) {
  return {
    email,
    source: "website_download",
    product: "pitch_kiwi",
    consent_scope: "pitchkiwi_updates_and_relevant_product_announcements_v1"
  };
}

function sendJson(response, status, body) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.status(status).json(body);
}

function requestBody(request) {
  if (request.body && typeof request.body === "object") return request.body;
  if (typeof request.body === "string") {
    const type = request.headers["content-type"] || "";
    if (type.includes("application/json")) {
      try {
        return JSON.parse(request.body);
      } catch {
        return {};
      }
    }
    return Object.fromEntries(new URLSearchParams(request.body));
  }
  return {};
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return sendJson(response, 405, { ok: false, error: "Method not allowed." });
  }

  const email = normalizeEmail(requestBody(request).email);
  if (!isValidEmail(email)) {
    return sendJson(response, 400, {
      ok: false,
      error: "Enter a valid email address."
    });
  }

  const betaRecord = createBetaRecord(email);
  // Storage placeholder: send betaRecord to the owner's Excel-backed endpoint
  // before launch. Do not log the record or expose the future credential here.
  void betaRecord;
  const contentType = request.headers["content-type"] || "";
  if (contentType.includes("application/x-www-form-urlencoded")) {
    response.setHeader("Cache-Control", "no-store");
    return response.redirect(303, "/download/");
  }
  return sendJson(response, 200, { ok: true, redirect: "/download/" });
}
