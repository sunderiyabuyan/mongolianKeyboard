import { Link } from "react-router-dom";
import { MULTI_CHAR_RULES } from "../transliteration/map";
import { TopBar } from "./TopBar";
import { Footer } from "./Footer";

export function HomePage() {
  return (
    <div className="home-page">
      <TopBar />
      <div className="hero">
        <h1>Монгол keyboard цээжлээгүй хүмүүст зориулав</h1>
        <p className="hero-sub">
          Латинаар дарж монголоор бич, гэхдээ цаашдаа сурсан дээр байхдаа
        </p>
        <div className="hero-actions">
          <span className="tag tag-accent">Фонетик QWERTY</span>
          <span className="tag tag-accent-2">{MULTI_CHAR_RULES.length} дүрэм</span>
          <span className="tag tag-neutral">Кирилл</span>
          <Link to="/write" className="btn btn-primary hero-cta">
            Бичиж эхлэх
          </Link>
        </div>
      </div>
      <Footer variant="rich" />
    </div>
  );
}
