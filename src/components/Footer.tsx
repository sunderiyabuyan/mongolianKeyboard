import { Link } from "react-router-dom";
import { MULTI_CHAR_RULES } from "../transliteration/map";

type FooterProps = {
  /** The fuller footer shown on the home page: rule chips, extra links, location. */
  variant?: "simple" | "rich";
};

export function Footer({ variant = "simple" }: FooterProps) {
  if (variant === "rich") {
    const firstRule = MULTI_CHAR_RULES.find(([latin]) => latin === "sh")!;
    const secondRule = MULTI_CHAR_RULES.find(([latin]) => latin === "ii")!;
    const remainingCount = MULTI_CHAR_RULES.length - 2;

    return (
      <footer className="sitefoot-rich">
        <div className="sitefoot-rich-top">
          <div>
            <h2>Бичээд л бай</h2>
            <div className="rule-chips">
              <span className="rule-chip">
                {firstRule[0]} → {firstRule[1]}
              </span>
              <span className="rule-chip rule-chip-2">
                {secondRule[0]} → {secondRule[1]}
              </span>
              <span className="rule-chip rule-chip-more">+{remainingCount} дүрэм</span>
            </div>
          </div>
          <div className="sitefoot-rich-links">
            <Link to="/feedback">Санал хүсэлт</Link>
          </div>
        </div>
        <div className="sitefoot-rich-bottom">
          <span>© 2026 Бичээч</span>
          <span>Улаанбаатар</span>
        </div>
      </footer>
    );
  }

  return (
    <footer className="sitefoot">
      <span className="foot-links">
        <Link to="/feedback">Санал хүсэлт</Link>
      </span>
      <span className="copy">© 2026 Бичээч</span>
    </footer>
  );
}
