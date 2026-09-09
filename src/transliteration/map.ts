// Phonetic transliteration rules: Latin (QWERTY) -> Mongolian Cyrillic.
// Longer sequences must be listed before their prefixes so the engine can
// prefer the longest match (e.g. "sh" before "s").
export const TRANSLITERATION_RULES: Array<[latin: string, cyrillic: string]> = [
  // Multi-letter sequences (checked first, longest first)
  ["sh", "ш"],
  ["ch", "ч"],
  ["shch", "щ"],
  ["ts", "ц"],
  ["yo", "ё"],
  ["yu", "ю"],
  ["ya", "я"],
  ["ye", "е"],
  ["kh", "х"],
  ["ii", "ий"],
  ["yi", "ь"],

  // Single letters
  ["a", "а"],
  ["b", "б"],
  ["v", "ү"],
  ["g", "г"],
  ["d", "д"],
  ["e", "э"],
  ["j", "ж"],
  ["z", "з"],
  ["i", "и"],
  ["k", "к"],
  ["l", "л"],
  ["m", "м"],
  ["n", "н"],
  ["o", "о"],
  ["u", "у"],
  ["p", "п"],
  ["r", "р"],
  ["s", "с"],
  ["t", "т"],
  ["f", "ф"],
  ["h", "х"],
  ["w", "в"],
  ["x", "ъ"],
  ["y", "й"],
  ["c", "к"],
  ["q", "ө"],
  ["[", "ы"],
];

// Sorted longest-latin-sequence-first so the greedy matcher in engine.ts
// always prefers multi-char matches over shorter prefixes.
export const SORTED_RULES = [...TRANSLITERATION_RULES].sort(
  (a, b) => b[0].length - a[0].length,
);

// Rules whose Latin input is more than one character (e.g. "sh" -> "ш"),
// shown in the rules rail so users can learn the digraphs.
export const MULTI_CHAR_RULES = TRANSLITERATION_RULES.filter(([latin]) => latin.length > 1);

// Every proper prefix of a multi-char rule (e.g. "s" and "sh" for "shch"),
// used to mark on-screen keys that can start a digraph sequence.
export const DIGRAPH_PREFIXES = new Set(
  MULTI_CHAR_RULES.flatMap(([latin]) =>
    Array.from({ length: latin.length - 1 }, (_, i) => latin.slice(0, i + 1)),
  ),
);
