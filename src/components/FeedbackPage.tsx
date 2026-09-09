import { TopBar } from "./TopBar";
import { Footer } from "./Footer";

const FEEDBACK_EMAIL = "sunderiyabuyannemekh@gmail.com";

export function FeedbackPage() {
  return (
    <div className="home-page">
      <TopBar />
      <div className="hero">
        <h1>Санал хүсэлт</h1>
        <p className="hero-sub">
          Бидэнд санал хүсэлтээ илгээгээрэй.
        </p>
        <div className="hero-actions">
          <a href={`mailto:${FEEDBACK_EMAIL}`} className="btn btn-primary hero-cta">
            Мэйл бичих
          </a>
        </div>
      </div>
      <Footer variant="rich" />
    </div>
  );
}
