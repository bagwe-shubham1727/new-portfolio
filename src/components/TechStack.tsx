import { Suspense, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Decal,
  Float,
  OrbitControls,
  PerspectiveCamera,
  useTexture,
  View,
} from "@react-three/drei";
import { personalContent } from "../data/personalContent";
import { isDesktop } from "../lib/device";

import htmlIcon from "../assets/tech/html.png";
import cssIcon from "../assets/tech/css.png";
import javascriptIcon from "../assets/tech/javascript.png";
import typescriptIcon from "../assets/tech/typescript.png";
import reactjsIcon from "../assets/tech/reactjs.png";
import reduxIcon from "../assets/tech/redux.png";
import zustandIcon from "../assets/tech/zustand.png";
import tailwindIcon from "../assets/tech/tailwind.png";
import nodejsIcon from "../assets/tech/nodejs.png";
import dotnetIcon from "../assets/tech/dotnet.png";
import pythonIcon from "../assets/tech/python.png";
import postgresqlIcon from "../assets/tech/postgresql.png";
import mongodbIcon from "../assets/tech/mongodb.png";
import redisIcon from "../assets/tech/redis.png";
import dockerIcon from "../assets/tech/docker.png";
import awsIcon from "../assets/tech/aws.png";
import gcpIcon from "../assets/tech/gcp.png";
import gitIcon from "../assets/tech/git.png";
import figmaIcon from "../assets/tech/figma.png";

const techIcons: Record<string, string> = {
  html: htmlIcon,
  css: cssIcon,
  javascript: javascriptIcon,
  typescript: typescriptIcon,
  reactjs: reactjsIcon,
  redux: reduxIcon,
  zustand: zustandIcon,
  tailwind: tailwindIcon,
  nodejs: nodejsIcon,
  dotnet: dotnetIcon,
  python: pythonIcon,
  postgresql: postgresqlIcon,
  mongodb: mongodbIcon,
  redis: redisIcon,
  docker: dockerIcon,
  aws: awsIcon,
  gcp: gcpIcon,
  git: gitIcon,
  figma: figmaIcon,
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

// Views render into a shared canvas without clearing it, so wipe the whole
// frame first (priority 0 runs before the views' priority 1).
const ClearFrame = () => {
  useFrame(({ gl }) => {
    gl.setScissorTest(false);
    gl.clear(true, true);
  }, 0);
  return null;
};

// Each ball used to own a WebGL canvas. Browsers cap live contexts (~16 in
// Chrome) and drop the oldest one, which is the hero character, so all balls
// share one fixed canvas and each renders into its own <View> rectangle.
const SharedBallCanvas = ({ active }: { active: boolean }) =>
  createPortal(
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 5,
        visibility: active ? "visible" : "hidden",
      }}
    >
      <ClearFrame />
      <View.Port />
    </Canvas>,
    document.body
  );

const BallView = ({ icon }: { icon: string }) => (
  <View className="tech-ball-view">
    <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
    <OrbitControls enableZoom={false} enablePan={false} />
    <ambientLight intensity={0.25} />
    <directionalLight position={[0, 0, 0.05]} />
    <Suspense fallback={null}>
      <Ball imgUrl={icon} />
    </Suspense>
  </View>
);

const TechStack = () => {
  const { techStack } = personalContent;
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!isDesktop || !sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      // ScrollSmoother clips content to #smooth-wrapper, so observe against it
      { root: document.querySelector("#smooth-wrapper"), rootMargin: "200px 0px" }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="techstack" ref={sectionRef}>
      <h2>{techStack.title}</h2>
      <div className={isDesktop ? "tech-balls-grid" : "tech-icons-grid"}>
        {techStack.technologies.map((tech) => (
          <div
            className={isDesktop ? "tech-ball-wrapper" : "tech-icon-wrapper"}
            key={tech.name}
          >
            {isDesktop ? (
              <BallView icon={techIcons[tech.icon]} />
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
      {isDesktop && <SharedBallCanvas active={active} />}
    </div>
  );
};

export default TechStack;
