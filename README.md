<div align="center">

# PitchKiwi

**Speak into any app on your Mac. Your voice never leaves it.**

Local voice dictation for vibe coders and developers who prompt AI coding agents.
Hold a key, talk, and clean text lands at your cursor.

[![macOS 14+](https://img.shields.io/badge/macOS-14%2B-171510.svg?logo=apple)](#requirements)
[![Apple Silicon](https://img.shields.io/badge/Apple%20Silicon-M1%2B-171510.svg)](#requirements)

[Download beta](https://pitchkiwi.com/#beta) · [Docs](https://pitchkiwi.com/docs.html) · [Privacy & Terms](https://pitchkiwi.com/legal.html)

</div>

---

## Why PitchKiwi

Typing a detailed prompt is slow, so most people write short ones and get worse results. Talking is faster, but most dictation apps send your voice to a server before you see any text. PitchKiwi runs speech recognition **entirely on your Mac**. The beta download asks only for an email—no account, password, verification, or payment.

## Requirements

- A Mac with Apple Silicon (M1 or newer)
- macOS 14 Sonoma or newer

PitchKiwi is Mac only. There's no Windows or Linux version, and none planned.

## Features

- Hold Fn to talk, release to insert. Works in any app: Claude Code, Cursor, Terminal, Slack, your browser.
- **Prompt Mode**: ramble for a minute, get a structured prompt (Goal, Context, Requirements, Done when) ready to paste into an AI agent.
- Dev-aware dictation: "camel case user id" becomes `userId`, "dash dash force" becomes `--force`.
- Terminal-safe: never presses Return for you.
- Personal dictionary, snippets, spoken punctuation.
- Local transcription and cleanup; voice and dictated text are not uploaded by PitchKiwi.

## Beta access

PitchKiwi is free while in beta. No credit card required.

**[Download beta →](https://pitchkiwi.com/#beta)**

## Install

1. Enter your email on the website and continue directly to the download page.
2. Download the ZIP, unzip it, and drag PitchKiwi into Applications.
3. First launch: Control-click PitchKiwi and choose **Open**, since the beta isn't notarized yet.
4. Grant Microphone and Accessibility when asked.

Full walkthrough, troubleshooting, and hotkey setup: see the [docs](https://pitchkiwi.com/docs.html).

## Privacy

The website asks for one email for PitchKiwi updates and relevant product announcements. The app's speech recognition and cleanup run locally; PitchKiwi does not upload your microphone audio or dictated text. Full policy: [pitchkiwi.com/legal.html](https://pitchkiwi.com/legal.html#privacy).

## License

See the [Terms of Use](https://pitchkiwi.com/legal.html#terms) for beta usage terms.

## Website beta flow

The static site uses two small Vercel functions:

- `POST /api/beta-downloads` validates the one-field email form and redirects to `/download/`. Storage is intentionally a no-op placeholder until the Excel connection is added; addresses are not logged, persisted, or transmitted.
- `GET /api/download` redirects to the public ZIP configured in `PITCHKIWI_BETA_DOWNLOAD_URL`.

Copy `.env.example` to your local environment and set the download URL in Vercel before publishing. Run `npm test` and `npm run build` to validate the flow and public copy.

© 2026 Ahmed Yasser ([@AhmedYsrrr](https://x.com/AhmedYsrrr)). All rights reserved.
