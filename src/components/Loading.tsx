import { useEffect, useRef, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";

const marqueeItems = [
  "Full Stack Developer",
  "Software Engineer",
  "Full Stack Developer",
  "Software Engineer",
  "Full Stack Developer",
  "Software Engineer",
];

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (percent >= 100 && !hasTriggered.current) {
      hasTriggered.current = true;
      let t2: ReturnType<typeof setTimeout>;
      // Brief pause at 100%, then auto-transition
      const t1 = setTimeout(() => {
        setLoaded(true);
        t2 = setTimeout(() => setIsLoaded(true), 200);
      }, 200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [percent]);

  useEffect(() => {
    if (!isLoaded) return;
    import("./utils/initialFX").then((module) => {
      setClicked(true);
      setTimeout(() => {
        try {
          module.initialFX?.();
        } finally {
          setIsLoading(false);
        }
      }, 800);
    });
  }, [isLoaded, setIsLoading]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }

  return (
    <>
      <div className="loading-header">
        <a href="/#" className="loader-title" data-cursor="disable">
          SB
        </a>
        <div className={`loaderGame ${clicked && "loader-out"}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, index) => (
                <div className="loaderGame-line" key={index}></div>
              ))}
            </div>
            <div className="loaderGame-ball"></div>
          </div>
        </div>
      </div>
      <div className="loading-screen" role="status" aria-live="polite">
        <div className="loading-marquee" aria-hidden="true">
          <div className="marquee-track">
            {marqueeItems.map((text, i) => (
              <span key={i}>{text}</span>
            ))}
            {marqueeItems.map((text, i) => (
              <span key={`dup-${i}`}>{text}</span>
            ))}
          </div>
        </div>
        <div
          className={`loading-wrap ${clicked && "loading-clicked"}`}
          onMouseMove={(e) => handleMouseMove(e)}
        >
          <div className="loading-hover"></div>
          <div className={`loading-button ${loaded && "loading-complete"}`}>
            <div className="loading-container">
              <div className="loading-content">
                <div
                  className="loading-content-in"
                  aria-label={`Loading ${percent} percent`}
                >
                  Loading <span>{percent}%</span>
                </div>
              </div>
              <div className="loading-box"></div>
            </div>
            <div className="loading-content2">
              <span>Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;

  let interval = setInterval(() => {
    if (percent <= 50) {
      let rand = Math.round(Math.random() * 5);
      percent = percent + rand;
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = percent + Math.round(Math.random());
        setLoading(percent);
        if (percent > 91) {
          clearInterval(interval);
        }
      }, 2000);
    }
  }, 100);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent++;
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 2);
    });
  }
  return { loaded, percent, clear };
};
