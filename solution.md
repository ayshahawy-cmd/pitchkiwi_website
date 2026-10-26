# Solution

**Section headline:**
PitchKiwi does the transcription itself, on your Mac.

**Body:**
Hold a hotkey, speak, release. The speech model runs locally. A deterministic cleanup pass fixes punctuation, casing, and developer terms. Nothing is uploaded, because there's nowhere for it to go.

## Prompt Mode (wide feature, two columns: description + a mock transcript)

**Left column:**
Ramble for a minute about what you want built. PitchKiwi turns it into a structured prompt: Goal, Context, Requirements, Done when. Paste it straight into Claude Code or any agent.

**Right column (mock before/after, styled like a small terminal/transcript card):**

Before (spoken):
"okay so I want the settings page to have like a dark mode toggle at the top and it should remember what you picked even after you close the app also make sure it matches the rest of the sidebar styling"

After (Prompt Mode output):
```
Goal: add a dark mode toggle to the settings page
Requirements:
- Toggle placed at the top of the settings page
- Preference persists across app restarts
- Matches existing sidebar styling
Done when: toggling works and the choice survives a restart
```

## Quick features (horizontal row, four items, not identical cards)

- **Dev-aware casing** — "camel case user id" becomes `userId`. Snake, kebab, and constant case too.
- **Spoken symbols** — "dash dash force" becomes `--force` in your terminal and editor.
- **Terminal-safe** — never presses Return for you. Dictated commands land, they don't run.
- **Personal dictionary** — teach it your project's names once, stop watching it misspell them.

## Privacy

**Section headline:** Your voice stays on your Mac.

| Data | Handling |
|---|---|
| Download | Public GitHub release; no email signup |
| Microphone audio | Processed locally and not uploaded by PitchKiwi |
| Dictated text | Processed locally and inserted at your cursor |

The website links to MIT-licensed source and public release downloads.
