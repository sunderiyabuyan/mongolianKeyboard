import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";

export function TopBar() {
  const { pathname } = useLocation();

  return (
    <div className="pillnav-wrap">
      <div className="pillnav">
        <Link to="/" className="mark">
          <Logo size={26} />
          <b>Бичээч</b>
        </Link>
        <nav>
          <Link to="/write" aria-current={pathname === "/write" ? "page" : undefined}>
            Бичих
          </Link>
        </nav>
        <span className="end" />
      </div>
    </div>
  );
}
