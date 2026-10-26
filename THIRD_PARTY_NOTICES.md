# Third-party notices

The website's original HTML, CSS, JavaScript, documentation, and PitchKiwi assets use the repository MIT license. The macOS app is maintained in [a separate repository](https://github.com/ayshahawy-cmd/pitchkiwi) and ships its own [dependency notices](https://github.com/ayshahawy-cmd/pitchkiwi/blob/main/THIRD_PARTY_NOTICES.md).

## Fonts

The HTML loads Instrument Sans and JetBrains Mono through the Google Fonts stylesheet service. Font files are requested from Google and are not bundled in this source repository or static output.

- [Instrument Sans](https://github.com/google/fonts/blob/main/ofl/instrumentsans/OFL.txt): SIL Open Font License 1.1; retain the upstream license if you later self-host the font files.
- [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono): SIL Open Font License 1.1; retain the upstream license if you later self-host the font files.

Google receives normal request metadata when these fonts load. See the website privacy policy. The native Mac app uses system fonts rather than these web requests.

## Tooling and third-party services

There are no npm runtime dependencies. Node.js, GitHub, Vercel, and the browser are separately supplied tools/services under their own terms. Third-party names in example workflows do not imply endorsement or license their logos. Preserve this notice and `LICENSE` when redistributing the website.
