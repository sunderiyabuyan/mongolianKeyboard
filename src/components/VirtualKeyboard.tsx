import { DIGRAPH_PREFIXES, TRANSLITERATION_RULES } from "../transliteration/map";

const KEYBOARD_ROWS: Array<{ keys: string[]; tail?: "⌫" | "⏎" | "⇧" }> = [
  { keys: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "["], tail: "⌫" },
  { keys: ["a", "s", "d", "f", "g", "h", "j", "k", "l"], tail: "⏎" },
  { keys: ["z", "x", "c", "v", "b", "n", "m"], tail: "⇧" },
];

const SINGLE_LETTER_MAP = new Map(
  TRANSLITERATION_RULES.filter(([latin]) => latin.length === 1),
);

type VirtualKeyboardProps = {
  /** Called with the raw Latin key, same as a physical keydown would produce. */
  onKeyPress: (latinKey: string) => void;
  onSpace: () => void;
  onBackspace: () => void;
  onEnter: () => void;
  onShift: () => void;
  /** The in-progress Latin buffer, e.g. "s" while waiting to see if "h" follows. */
  pending: string;
  /** Whether the next letter typed via the virtual keyboard will be capitalized. */
  shiftActive: boolean;
};

export function VirtualKeyboard({
  onKeyPress,
  onSpace,
  onBackspace,
  onEnter,
  onShift,
  pending,
  shiftActive,
}: VirtualKeyboardProps) {
  // preventDefault on mousedown keeps focus (and the caret) in the document,
  // so a click behaves like a real keystroke instead of stealing selection.
  const press = (fn: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    fn();
  };

  return (
    <div className="kb-panel">
      <div className="kb">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div className="krow" key={rowIndex}>
            {row.keys.map((latinKey) => {
              const cyrillic = SINGLE_LETTER_MAP.get(latinKey) ?? latinKey;
              const isPending = pending.length === 1 && pending === latinKey;
              return (
                <button
                  key={latinKey}
                  type="button"
                  className={`k${isPending ? " pend" : ""}`}
                  onMouseDown={press(() => onKeyPress(latinKey))}
                >
                  <span className="klat">{latinKey}</span>
                  <span className="kch">{shiftActive ? cyrillic.toUpperCase() : cyrillic}</span>
                  {DIGRAPH_PREFIXES.has(latinKey) && <span className="sprout" />}
                </button>
              );
            })}
            {row.tail && (
              <button
                type="button"
                className={`k kmod ktail${row.tail === "⇧" && shiftActive ? " pend" : ""}`}
                onMouseDown={press(
                  row.tail === "⌫" ? onBackspace : row.tail === "⏎" ? onEnter : onShift,
                )}
              >
                {row.tail}
              </button>
            )}
          </div>
        ))}
        <div className="krow">
          <button type="button" className="k kspace kmod" onMouseDown={press(onSpace)}>
            Зай
          </button>
        </div>
      </div>
    </div>
  );
}
