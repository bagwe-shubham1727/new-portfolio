import "./styles/Career.css";
import { personalContent } from "../data/personalContent";

const Career = () => {
  const { career } = personalContent;

  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          {career.titleLine1} <span>&</span>
          <br /> {career.titleLine2}
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          {career.items.map((item, index) => (
            <div className="career-info-box" key={`${item.company}-${index}`}>
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{item.role}</h4>
                  <h5>{item.company}</h5>
                </div>
                <h3>{item.period}</h3>
              </div>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
