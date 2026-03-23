import { PropsWithChildren } from "react";
import "./styles/Landing.css";
import { personalContent } from "../data/personalContent";

const Landing = ({ children }: PropsWithChildren) => {
  const { landing } = personalContent;

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>{landing.greeting}</h2>
            <h1>
              {landing.firstName}
              <br />
              <span>{landing.lastName}</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>{landing.rolePrefix}</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">{landing.rolePrimary}</div>
              <div className="landing-h2-2">{landing.roleSecondary}</div>
            </h2>
            <h2>
              <div className="landing-h2-info">{landing.roleSecondary}</div>
              <div className="landing-h2-info-1">{landing.rolePrimary}</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
