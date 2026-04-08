import Logo from './Logo';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-branding">
          <Logo
            variant="footer"
            alt="MindCheck Organization"
            title="MindCheck - Mental Health Assessment Platform"
          />
          <div className="footer-content">
            <p className="footer-text footer-strong">MindCheck — Student mental health awareness and guidance.</p>
            <p className="footer-text">Assessments are designed for self-awareness only and are not medical advice.</p>
          </div>
        </div>
        <p className="footer-text footer-copyright">© {new Date().getFullYear()} MindCheck. All rights reserved.</p>
      </div>
    </footer>
  );
}
