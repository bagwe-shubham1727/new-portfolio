import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";
import { personalContent } from "../data/personalContent";

const Contact = () => {
  const { contact } = personalContent;

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>{contact.title}</h3>
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
              data-cursor="disable"
              className="contact-social"
            >
              Github <MdArrowOutward />
            </a>
            <a
              href={contact.social.linkedin}
              target="_blank"
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
