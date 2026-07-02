import "./styles/Footer.css";
import { personalContent } from "../data/personalContent";

const Footer = () => {
  const { contact } = personalContent;
  const [firstName] = contact.creditName.split(" ");

  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="site-footer-wordmark" aria-hidden="true">
        {firstName.toUpperCase()}
      </div>
      <div className="site-footer-row">
        <div className="site-footer-cell site-footer-cell--left">
          <span className="site-footer-label">Based in</span>
          <span className="site-footer-value">Boston, MA</span>
        </div>
        <div className="site-footer-cell site-footer-cell--center">
          <span className="site-footer-led" aria-hidden="true" />
          <span className="site-footer-value">Open to Work</span>
        </div>
        <div className="site-footer-cell site-footer-cell--right">
          <span className="site-footer-value">
            © {contact.year} {contact.creditName}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
