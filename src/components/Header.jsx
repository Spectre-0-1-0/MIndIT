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
      <div className="header-inner md:flex md:items-center md:justify-between md:px-4 md:py-3">
        <Link 
          to="/" 
          className="brand flex items-center gap-2 md:gap-3" 
          onClick={() => { setMenuOpen(false); window.scrollTo(0, 0); }}
        >
          <Logo
            variant="header"
            alt="MCheck - A UDAAN Initiative - Mental Health Assessment Platform"
            title="Go to homepage"
            className="h-8 w-auto md:h-10"
          />
          <span className="brand-text text-white text-lg md:text-xl font-medium whitespace-nowrap">MCheck</span>
        </Link>

        <button
          type="button"
          className="mobile-toggle md:hidden flex items-center justify-center p-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700 min-w-[40px] min-h-[40px]"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="mobile-toggle-bar" />
          <span className="mobile-toggle-bar" />
          <span className="mobile-toggle-bar" />
        </button>

        <nav className={`nav-menu ${menuOpen ? 'open' : ''} hidden md:flex md:items-center md:gap-6`}>
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
