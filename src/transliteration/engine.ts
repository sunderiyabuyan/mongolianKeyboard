import { SORTED_RULES } from "./map";

/**
 * Greedily transliterates a Latin string into Mongolian Cyrillic by matching
 * the longest possible rule at each position. Falls back to passing through
 * any character with no matching rule (e.g. punctuation, digits, spaces).
 */
export function transliterate(input: string): string {
  const lower = input.toLowerCase();
  let result = "";
  let i = 0;

  outer: while (i < lower.length) {
    for (const [latin, cyrillic] of SORTED_RULES) {
      if (lower.startsWith(latin, i)) {
        result += preserveCase(input, i, latin.length) ? cyrillic.toUpperCase() : cyrillic;
        i += latin.length;
        continue outer;
      }
    }
    result += input[i];
    i += 1;
  }

  return result;
}

// If the first character of the matched Latin sequence was uppercase in the
// original input, uppercase the resulting Cyrillic too.
function preserveCase(original: string, index: number, _length: number): boolean {
  const ch = original[index];
  return ch !== undefined && ch === ch.toUpperCase() && ch !== ch.toLowerCase();
}
