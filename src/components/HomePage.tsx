import { Link } from "react-router-dom";
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
          <span className="tag tag-accent">Rich Text Editor</span>
          <span className="tag tag-accent-2">Бүх Modifier товч ажилна</span>
          <span className="tag tag-neutral">Format-тай copy & paste</span>
          <Link to="/write" className="btn btn-primary hero-cta">
            Бичиж эхлэх
          </Link>
        </div>
      </div>
      <Footer variant="rich" />
    </div>
  );
}
