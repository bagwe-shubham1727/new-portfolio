import "./styles/About.css";
import { personalContent } from "../data/personalContent";

const About = () => {
  const { about } = personalContent;

  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">{about.title}</h3>
        <p className="para">{about.summary}</p>
      </div>
    </div>
  );
};

export default About;
