import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from './Logo';
import './Header.css';

const navClass = ({ isActive }) =>
  isActive ? 'header-link asmr-hover header-link-active' : 'header-link asmr-hover';

function MobileMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 top-16 bg-white shadow-lg z-40 md:hidden">
      <nav className="flex flex-col p-4 gap-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `block py-3 px-4 rounded-lg text-base font-medium transition-colors asmr-hover ${
              isActive
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-slate-700 hover:bg-slate-50'
            }`
          }
          onClick={onClose}
        >
          Home
        </NavLink>
        <NavLink
          to="/udaan"
          className={({ isActive }) =>
            `block py-3 px-4 rounded-lg text-base font-medium transition-colors asmr-hover ${
              isActive
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-slate-700 hover:bg-slate-50'
            }`
          }
          onClick={onClose}
        >
          UDAAN
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `block py-3 px-4 rounded-lg text-base font-medium transition-colors asmr-hover ${
              isActive
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-slate-700 hover:bg-slate-50'
            }`
          }
          onClick={onClose}
        >
          Contact
        </NavLink>
      </nav>
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);
  const handleMenuClose = () => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <header className="header fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 z-50">
        <Link
          to="/"
          className="flex items-center gap-2 asmr-hover"
          onClick={handleMenuClose}
        >
          <Logo
            variant="header"
            alt="MCheck - A UDAAN Initiative - Mental Health Assessment Platform"
            title="Go to homepage"
            className="h-8 w-auto md:h-10"
          />
          <span className="text-white font-medium text-lg whitespace-nowrap">MCheck</span>
        </Link>

        <button
          type="button"
          className="md:hidden flex items-center justify-center p-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700 min-w-[40px] min-h-[40px] asmr-hover"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={handleMenuToggle}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <nav className="hidden md:flex md:items-center md:gap-6">
          <NavLink to="/" end className={navClass} onClick={handleMenuClose}>
            Home
          </NavLink>
          <NavLink to="/udaan" className={navClass} onClick={handleMenuClose}>
            UDAAN
          </NavLink>
          <NavLink to="/contact" className={navClass} onClick={handleMenuClose}>
            Contact
          </NavLink>
        </nav>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={handleMenuClose} />

      <div className="h-16 md:hidden" />
    </>
  );
}
