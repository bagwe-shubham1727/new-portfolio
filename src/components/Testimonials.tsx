import "./styles/Testimonials.css";
import { personalContent } from "../data/personalContent";

import yuImg from "../assets/testimonials/yu.png";
import djImg from "../assets/testimonials/DJ.png";
import shirishImg from "../assets/testimonials/shirish.png";
import rohitImg from "../assets/testimonials/rohit.png";

const avatarMap: Record<string, string> = {
  yu: yuImg,
  dj: djImg,
  shirish: shirishImg,
  rohit: rohitImg,
};

const Testimonials = () => {
  const { testimonials } = personalContent;

  return (
    <div className="testimonials-section section-container">
      <h2>
        {testimonials.title} <span>&</span>
        <br /> {testimonials.titleHighlight}
      </h2>
      <div className="testimonials-grid">
        {testimonials.items.map((item, index) => (
          <div
            className="testimonial-card"
            key={`${item.author}-${index}`}
          >
            <p className="testimonial-quote">{item.quote}</p>
            <div className="testimonial-author">
              <img
                src={avatarMap[item.image]}
                alt={item.author}
                className="testimonial-avatar"
                loading="lazy"
              />
              <div className="testimonial-info">
                <span className="testimonial-name">{item.author}</span>
                <span className="testimonial-role">
                  {item.title}, {item.company}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
