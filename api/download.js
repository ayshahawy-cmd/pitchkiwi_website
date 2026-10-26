function sendJson(response, status, body) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.status(status).json(body);
}

export function isSafeDownloadUrl(value) {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export const DEFAULT_DOWNLOAD_URL = "https://github.com/ayshahawy-cmd/pitchkiwi/releases/download/v0.8.4-beta.1/PitchKiwi-macOS.dmg";

export default function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return sendJson(response, 405, { ok: false, error: "Method not allowed." });
  }

  const downloadUrl = process.env.PITCHKIWI_BETA_DOWNLOAD_URL || DEFAULT_DOWNLOAD_URL;
  if (!isSafeDownloadUrl(downloadUrl)) {
    return sendJson(response, 503, {
      ok: false,
      error: "The beta download is temporarily unavailable. Please try again shortly."
    });
  }

  response.setHeader("Cache-Control", "no-store");
  response.redirect(302, downloadUrl);
}
