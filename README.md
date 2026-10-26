# PitchKiwi website

The open-source website for **PitchKiwi**, a native Mac dictation tool for developers. The app runs speech recognition and cleanup locally; this repository contains its website, installation help, privacy/license pages, and two small Vercel handlers.

**[Download the app](https://github.com/ayshahawy-cmd/pitchkiwi/releases)** · **[App source](https://github.com/ayshahawy-cmd/pitchkiwi)** · **[User guide](https://github.com/ayshahawy-cmd/pitchkiwi/blob/main/docs/USER_GUIDE.md)** · **[Website](https://pitchkiwi.com)**

Both the website and app use MIT licenses. Downloads require no signup, email, account, API key, or payment. The app beta is ad-hoc signed and **not notarized**. It requires Apple Silicon and macOS 14+ and includes an English speech model. This website does not itself transcribe audio.

## Downloading and using the Mac app

1. Visit [GitHub Releases](https://github.com/ayshahawy-cmd/pitchkiwi/releases) and download `PitchKiwi-macOS.zip` and its `.sha256` file from the same release.
2. Optionally verify in Downloads with `shasum -a 256 -c PitchKiwi-macOS.zip.sha256`.
3. Unzip and move `PitchKiwi.app` to Applications.
4. Try opening it. If blocked, follow [Apple's per-app approval instructions](https://support.apple.com/en-ca/102445) under System Settings → Privacy & Security → Open Anyway. The current community beta is not notarized.
5. Grant Microphone and Accessibility in onboarding.
6. Click a text field, hold Fn/Globe, speak, then release. Double-press Fn for hands-free capture, press again to stop, or Escape to cancel. The app inserts text without pressing Return.
7. Choose Dictation or Agent Prompt in Command Deck before recording. Prompt length controls fixed local formatting guidance; it is not a cloud AI request.

For the full feature reference, privacy settings, models, updates, and uninstalling, use the [app user guide](https://github.com/ayshahawy-cmd/pitchkiwi/blob/main/docs/USER_GUIDE.md). For source builds, use its [development guide](https://github.com/ayshahawy-cmd/pitchkiwi/blob/main/docs/DEVELOPMENT.md). This repository cannot build the Swift app.

## Run the website locally

Requirements: Git and Node.js **22 or newer**; Node 24 is recorded in `.nvmrc`. There are no npm runtime dependencies. No Vercel account or secret is needed for local preview.

```bash
git clone https://github.com/ayshahawy-cmd/pitchkiwi_website.git
cd pitchkiwi_website
npm ci
npm run dev
```

Open `http://127.0.0.1:4173`. The dev server supports both static pages and API routes and binds only to loopback. Stop it with Control-C. To use a different port:

```bash
PITCHKIWI_DEV_PORT=4174 npm run dev
```

For an optional custom download URL, copy `.env.example` to `.env` and edit it. `npm run dev` loads `.env` when present; production Vercel variables must be set separately in the hosting dashboard. Keep `.env` out of Git.

| Variable | Required | Behavior |
| --- | --- | --- |
| `PITCHKIWI_BETA_DOWNLOAD_URL` | No | Overrides the default public release ZIP; must be an absolute HTTPS URL |
| `PITCHKIWI_DEV_PORT` | No | Local port; defaults to 4173 |

The default download is pinned to `v0.8.3-beta.1` because GitHub's `/releases/latest` excludes prereleases. On each app release, update the default in `api/download.js`, `.env.example`, and the website's release-note link. The override is deployment configuration, never a browser-supplied redirect target.

## Routes and source map

| Path | Purpose |
| --- | --- |
| `/` / `index.html` | Product overview, direct download and source links |
| `/docs.html` | Installation, Fn, Agent Prompt, and troubleshooting |
| `/download/` | App download, checksum/release links, installation steps |
| `/get-started.html` | Compatibility redirect to `/download/` |
| `/legal.html` | Privacy, cookies, accessibility statement, MIT licensing |
| `GET /api/download` | 302 redirect to the configured/default HTTPS ZIP; 503 on unsafe config; 405 for unsupported methods |
| `POST /api/beta-downloads` | Legacy compatibility endpoint; validates email syntax, then redirects to `/download/`; does not log, store, or forward addresses in application code |
| `assets/beta-download.js` | Legacy form helper retained for compatibility; current pages do not load an email form |
| `screenshots/` | Existing app demonstration images, which may show older UI |
| `scripts/dev.mjs` | Loopback preview server and API adapter |
| `scripts/check-site.mjs` | Open-source copy and local-link checks |
| `scripts/build-site.mjs` | Copies an explicit allowlist of static files into `public/` |
| `tests/api.test.js` | Node test-runner coverage for API behavior |
| `hero.md`, `pricing.md`, `problem.md`, `solution.md` | Repository copy references, not separately deployed pages |

The old email flow is not used by current navigation. Connecting an email list would be a separate feature requiring updated privacy copy and explicit consent. The app's local speech processing has no relationship to website form handling.

## Checks and build

```bash
npm run lint
npm test
npm run build
```

`lint` and `typecheck` run JavaScript syntax checks; this repository does not use TypeScript or a separate semantic type checker. `npm test` uses Node's built-in test runner. `build` validates public copy and local links and then generates `public/`. GitHub Actions runs installation, syntax checks, tests, and build on pushes and pull requests.

The static build includes public pages/assets, `LICENSE`, and `THIRD_PARTY_NOTICES.md`. It excludes `.git`, `.env`, source tests, and development configuration. `public/` is generated and ignored. Tests do not establish live deployment success; confirm the deployed routes after publishing.

## Deploy to Vercel

1. Import this repository into Vercel using the account/project you intend to publish.
2. Set framework preset to Other, build command `npm run build`, and output directory `public` (also declared in `vercel.json`).
3. Use Node.js 22+ and let Vercel deploy the `api/` handlers as serverless functions.
4. Leave the optional download override unset for the canonical release, or configure a public HTTPS ZIP.
5. Deploy, then check `/`, `/docs.html`, `/download/`, `/legal.html`, and the redirect from `/api/download`.

A plain static host can serve `public/`, but `/api/download` and the legacy handler require serverless support. For static-only hosting, change the download button to the public GitHub ZIP or release page. For a fork, update canonical URLs, Open Graph tags, `robots.txt`, and `sitemap.xml`, along with repository/release/contact links before publishing.

## Data handling and external services

Website pages do not receive microphone audio or transcripts from the native app. The current public download path has no email form. Hosting providers and GitHub receive normal web-request metadata under their policies. Google Fonts serves Instrument Sans and JetBrains Mono, which involves external requests. See [legal.html](legal.html) and [third-party notices](THIRD_PARTY_NOTICES.md). Native app privacy details live in the app repository.

## Contributing, support, and license

Read [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Open website issues in [this repository](https://github.com/ayshahawy-cmd/pitchkiwi_website/issues); app issues belong in [the app repository](https://github.com/ayshahawy-cmd/pitchkiwi/issues). Use synthetic examples and remove private content. Disclose vulnerabilities through [SECURITY.md](SECURITY.md).

Original source, documentation, and website assets are [MIT licensed](LICENSE). Preserve the license notices when redistributing. Third-party fonts and services retain their own licenses/terms. Maintained by Ahmed Yasser and contributors.
