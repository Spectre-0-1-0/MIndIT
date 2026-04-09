import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from './Logo';
import './Header.css';

const navClass = ({ isActive }) =>
  isActive ? 'header-link header-link-active' : 'header-link';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="brand" onClick={() => { setMenuOpen(false); window.scrollTo(0, 0); }}>
          <Logo
            variant="header"
            alt="MCheck - A UDAAN Initiative - Mental Health Assessment Platform"
            title="Go to homepage"
          />
          <span className="brand-text">MCheck</span>
        </Link>

        <button
          type="button"
          className="mobile-toggle"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="mobile-toggle-bar" />
          <span className="mobile-toggle-bar" />
          <span className="mobile-toggle-bar" />
        </button>

        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" end className={navClass} onClick={() => { setMenuOpen(false); window.scrollTo(0, 0); }}>
            Home
          </NavLink>
          <NavLink to="/udaan" className={navClass} onClick={() => { setMenuOpen(false); window.scrollTo(0, 0); }}>
            UDAAN
          </NavLink>
          <NavLink to="/contact" className={navClass} onClick={() => { setMenuOpen(false); window.scrollTo(0, 0); }}>
            Contact
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
