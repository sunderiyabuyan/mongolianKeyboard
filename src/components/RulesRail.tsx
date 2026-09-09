import { MULTI_CHAR_RULES } from "../transliteration/map";

type RulesRailProps = {
  /** The in-progress Latin buffer, e.g. "s" while waiting to see if "h" follows. */
  pending: string;
};

export function RulesRail({ pending }: RulesRailProps) {
  return (
    <div className="rules-panel">
      <h4>
        <b>Дүрэм</b>
      </h4>
      <div className="rules-track">
        {MULTI_CHAR_RULES.map(([seq, cyrillic]) => (
          <div key={seq} className={`rrow${pending && seq.startsWith(pending) ? " on" : ""}`}>
            <span className="rseq">{seq}</span>
            <span className="rarr">→</span>
            <span className="rcyr">{cyrillic}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
