# Бичээч (Mongolian Keyboard)

A web-based rich text editor with a built-in phonetic Mongolian Cyrillic keyboard. Type using a standard QWERTY layout using familiar Latin-letter phonetics and it transliterates live into Mongolian Cyrillic, so you don't need to learn a native Mongolian keyboard layout or memorize a new key mapping.

## Features

- **Phonetic transliteration** — type Latin letters (e.g. `sh`, `ch`, `ya`) and they convert to Mongolian Cyrillic (`ш`, `ч`, `я`) as you type, including multi-letter digraph rules.
- **Two input paths, one engine** — works identically whether you type on your physical keyboard or click the on-screen virtual keyboard, including a one-shot Shift key for capitalization.
- **Rich text editor** — bold, italic, underline, headings, bulleted and numbered lists, built on [Tiptap](https://tiptap.dev/).
- **Formatting-aware copy/paste** — copies and pastes preserve rich formatting (not just plain text) where the browser's Clipboard API allows it, with a plain-text fallback otherwise.
- **Rules rail** — a live-updating sidebar showing every digraph rule, highlighting the one that matches what you're currently typing.
- **Home and feedback pages** — a landing page introducing the app, and a feedback page with a mailto link.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) — dev server and build tool
- [Tiptap](https://tiptap.dev/) (built on [ProseMirror](https://prosemirror.net/)) — the rich text editor framework
- [React Router](https://reactrouter.com/) — client-side routing
-  CSS with a small custom design-token system (no CSS framework)

## Getting started

### Prerequisites

Node.js 22 is expected (see [`.nvmrc`](.nvmrc)). If you use [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm use
```

### Install and run

```bash
npm install
npm run dev
```

This starts the Vite dev server, by default at `http://localhost:5173`.


## How the transliteration works

The full set of phonetic rules lives in [`src/transliteration/map.ts`](src/transliteration/map.ts) as a single array of `[latin, cyrillic]` pairs. This is the one place to edit if a mapping needs to change. A few rules use multi-letter Latin sequences (digraphs) to reach Cyrillic letters that don't have an obvious single-letter Latin equivalent:

| Type | Result |
| --- | --- |
| `sh` | ш |
| `ch` | ч |
| `shch` | щ |
| `ts` | ц |
| `yo` | ё |
| `yu` | ю |
| `ya` | я |
| `ye` | е |
| `kh` | х |
| `ii` | ий |
| `yi` | ь |

Every other Cyrillic letter maps from a single Latin key (see `map.ts` for the full table, including `[` → ы, which doesn't have a natural single-letter QWERTY equivalent).

[`engine.ts`](src/transliteration/engine.ts) does the actual conversion: given a string, it greedily matches the longest possible rule at each position (so `shch` resolves to щ as one unit, not ш + ч + ...), and preserves the case of the original input.

[`TransliterationExtension.ts`](src/transliteration/TransliterationExtension.ts) is a Tiptap/ProseMirror extension that tracks the in-progress "current word" buffer and keeps the document in sync with `transliterate(buffer)` as each character arrives — whether that character came from a real keydown event or a virtual keyboard click, so both input paths behave identically.

## Known limitations

- No backend — nothing is saved or synced; documents live only in the browser tab.
- Desktop-first layout; narrow/mobile viewports are not yet fully responsive.