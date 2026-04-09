import Logo from './Logo';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-branding">
          <Logo
            variant="footer"
            alt="MCheck - A UDAAN Initiative"
            title="MCheck - A UDAAN Initiative - Mental Health Assessment Platform"
          />
          <div className="footer-content">
            <p className="footer-text footer-strong">MCheck — Student mental health awareness and guidance, powered by UDAAN.</p>
            <p className="footer-text">Assessments are designed for self-awareness only and are not medical advice.</p>
          </div>
        </div>
        <p className="footer-text footer-copyright">© {new Date().getFullYear()} MCheck - A UDAAN Initiative. All rights reserved.</p>
      </div>
    </footer>
  );
}
