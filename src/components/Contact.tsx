import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";
import { personalContent } from "../data/personalContent";

const WORDS = ["build", "create", "ship", "design", "craft"] as const;

const Contact = () => {
  const { contact } = personalContent;

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % WORDS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h2 className="contact-cta-heading">
          Lets{" "}
          <span className="contact-cta-word-wrap">
            <AnimatePresence mode="wait">
              <motion.span
                key={WORDS[idx]}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="contact-cta-word"
                aria-live="polite"
              >
                {WORDS[idx]}
              </motion.span>
            </AnimatePresence>
          </span>{" "}
          <br /> incredible work together.
        </h2>
        <h3>{contact.title}</h3>
        <p className="contact-cta-text">
          Have an idea or opportunity? Let's build something together.
        </p>
        <a
          href={`mailto:${contact.email}`}
          className="contact-cta-button"
          data-cursor="disable"
        >
          Say Hello <MdArrowOutward />
        </a>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href={`mailto:${contact.email}`} data-cursor="disable">
                {contact.email}
              </a>
            </p>
            <h4>Education</h4>
            <p>{contact.education}</p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href={contact.social.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Github <MdArrowOutward />
            </a>
            <a
              href={contact.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Linkedin <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>{contact.creditName}</span>
            </h2>
            <h5>
              <MdCopyright /> {contact.year}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
