import { useState, useCallback, useRef } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { personalContent } from "../data/personalContent";
import { isDesktop } from "../lib/device";

type Project = (typeof personalContent.work.projects)[number];

const ProjectCard = ({
  project,
  index,
  toolsLabel,
}: {
  project: Project;
  index: number;
  toolsLabel: string;
}) => (
  <div className="carousel-content">
    <div className="carousel-info">
      <div className="carousel-number">
        <h3>0{index + 1}</h3>
      </div>
      <div className="carousel-details">
        <h4>{project.title}</h4>
        <p className="carousel-category">{project.category}</p>
        <p className="carousel-description">{project.description}</p>
        <div className="carousel-tools">
          <span className="tools-label">{toolsLabel}</span>
          <p>{project.tools}</p>
        </div>
      </div>
    </div>
    <div className="carousel-image-wrapper">
      <WorkImage
        image={project.image}
        alt={project.title}
        link={project.link}
      />
    </div>
  </div>
);

const Work = () => {
  const { work } = personalContent;
  const projects = work.projects;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef(0);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      delta > 0 ? goToPrev() : goToNext();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goToNext();
    }
  };

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          {work.title} <span>{work.titleHighlight}</span>
        </h2>

        {isDesktop ? (
          /* Desktop: Stacked layout showing all projects */
          <div className="work-stacked" role="region" aria-label="Projects">
            {projects.map((project, index) => (
              <div className="work-stacked-item" key={index}>
                <ProjectCard project={project} index={index} toolsLabel={work.toolsLabel} />
              </div>
            ))}
          </div>
        ) : (
          /* Mobile: Carousel with swipe */
          <div
            className="carousel-wrapper"
            role="region"
            aria-roledescription="carousel"
            aria-label="Project showcase"
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            <button
              className="carousel-arrow carousel-arrow-left"
              onClick={goToPrev}
              aria-label="Previous project"
              data-cursor="disable"
            >
              <MdArrowBack />
            </button>
            <button
              className="carousel-arrow carousel-arrow-right"
              onClick={goToNext}
              aria-label="Next project"
              data-cursor="disable"
            >
              <MdArrowForward />
            </button>

            <div
              className="carousel-track-container"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="carousel-track"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {projects.map((project, index) => (
                  <div
                    className="carousel-slide"
                    key={index}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`Slide ${index + 1} of ${projects.length}: ${project.title}`}
                  >
                    <ProjectCard project={project} index={index} toolsLabel={work.toolsLabel} />
                  </div>
                ))}
              </div>
            </div>

            <div className="carousel-dots">
              {projects.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${
                    index === currentIndex ? "carousel-dot-active" : ""
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to project ${index + 1}`}
                  data-cursor="disable"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Work;
