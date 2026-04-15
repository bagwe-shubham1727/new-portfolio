import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Decal, Float, useTexture } from "@react-three/drei";
import { personalContent } from "../data/personalContent";
import { isDesktop } from "../lib/device";

import htmlIcon from "../assets/tech/html.png";
import cssIcon from "../assets/tech/css.png";
import javascriptIcon from "../assets/tech/javascript.png";
import typescriptIcon from "../assets/tech/typescript.png";
import reactjsIcon from "../assets/tech/reactjs.png";
import reduxIcon from "../assets/tech/redux.png";
import tailwindIcon from "../assets/tech/tailwind.png";
import nodejsIcon from "../assets/tech/nodejs.png";
import mongodbIcon from "../assets/tech/mongodb.png";
import threejsIcon from "../assets/tech/threejs.png";
import gitIcon from "../assets/tech/git.png";
import figmaIcon from "../assets/tech/figma.png";
import dockerIcon from "../assets/tech/docker.png";

const techIcons: Record<string, string> = {
  html: htmlIcon,
  css: cssIcon,
  javascript: javascriptIcon,
  typescript: typescriptIcon,
  reactjs: reactjsIcon,
  redux: reduxIcon,
  tailwind: tailwindIcon,
  nodejs: nodejsIcon,
  mongodb: mongodbIcon,
  threejs: threejsIcon,
  git: gitIcon,
  figma: figmaIcon,
  docker: dockerIcon,
};

const Ball = ({ imgUrl }: { imgUrl: string }) => {
  const [decalTexture] = useTexture([imgUrl]);

  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <mesh castShadow receiveShadow scale={2.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#fff8eb"
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />
        <Decal
          position={[0, 0, 1]}
          rotation={[2 * Math.PI, 0, 6.25]}
          scale={1}
          map={decalTexture}
        />
      </mesh>
    </Float>
  );
};

const BallCanvas = ({ icon }: { icon: string }) => {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: false }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
      <Suspense fallback={null}>
        <Ball imgUrl={icon} />
      </Suspense>
    </Canvas>
  );
};

const TechStack = () => {
  const { techStack } = personalContent;

  return (
    <div className="techstack">
      <h2>{techStack.title}</h2>
      <div className={isDesktop ? "tech-balls-grid" : "tech-icons-grid"}>
        {techStack.technologies.map((tech) => (
          <div
            className={isDesktop ? "tech-ball-wrapper" : "tech-icon-wrapper"}
            key={tech.name}
          >
            {isDesktop ? (
              <BallCanvas icon={techIcons[tech.icon]} />
            ) : (
              <img
                src={techIcons[tech.icon]}
                alt={tech.name}
                className="tech-icon-img"
                width={48}
                height={48}
                loading="lazy"
              />
            )}
            <p className="tech-label">{tech.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;
