export type CareerItem = {
  role: string;
  company: string;
  period: string;
  description: string;
};

export type ProjectItem = {
  title: string;
  category: string;
  description: string;
  tools: string;
  image: string;
  link?: string;
};

export type TechItem = {
  name: string;
  icon: string;
};

export const personalContent = {
  landing: {
    greeting: "Hello! I'm",
    firstName: "SHUBHAM",
    lastName: "BAGWE",
    rolePrefix: "A Full-Stack",
    rolePrimary: "Software",
    roleSecondary: "Engineer",
  },
  about: {
    title: "About Me",
    summary:
      "Full-Stack Software Engineer with 2+ years of professional experience building high-scale web platforms and transaction-critical systems using React, TypeScript, Node.js, and C# .NET. I focus on performance, observability, and resilient architecture, and I enjoy shipping reliable products from backend services to polished frontend experiences.",
  },
  career: {
    titleLine1: "My career",
    titleLine2: "experience",
    items: [
      {
        role: "Software Development Engineer (Full Stack)",
        company: "Ingram Micro",
        period: "Jul 2022 - Aug 2024",
        description:
          "Built scalable C# .NET microservices and React/TypeScript checkout flows that improved transaction efficiency by 30% and reduced checkout abandonment by ~15%. Introduced Datadog dashboards and stronger test coverage (Jest/NUnit), cutting debugging time by 50% and supporting 100+ enterprise clients with 99% uptime.",
      },
      {
        role: "Software Developer Intern",
        company: "GEP Worldwide",
        period: "May 2022 - Jul 2022",
        description:
          "Partnered with stakeholders to deliver procurement solutions using SAP, Oracle, SQL, and JavaScript. Optimized API workflows with REST and Redis caching, improving procurement efficiency by 20% and reducing latency by 30% for 5K+ daily users.",
      },
    ] as CareerItem[],
  },
  work: {
    title: "My",
    titleHighlight: "Work",
    toolsLabel: "Tools & Features",
    projects: [
      {
        title: "Sentiment Aura",
        category: "Real-Time AI Voice Sentiment Visualization",
        description:
          "Captures live voice input via Deepgram WebSockets and analyzes sentiment in real time using Google Gemini, rendering dynamic p5.js visualizations that shift color and form based on emotional tone.",
        tools:
          "React, Node.js, p5.js, Deepgram WebSockets, Google Gemini",
        image:
          "https://opengraph.githubassets.com/176da5bf12d3d442055291f62feb99a72d065a7da4256e6ccd531c9dc6abe7d6/bagwe-shubham1727/sentiment-aura",
        link: "https://github.com/bagwe-shubham1727/sentiment-aura",
      },
      {
        title: "Student Nexus",
        category: "Student Accommodation Platform",
        description:
          "End-to-end student housing platform with OAuth 2.0 authentication, Stripe payments, and real-time listing search. Deployed on AWS with MongoDB and Express.js backend.",
        tools:
          "React, TypeScript, Redux, Express.js, OAuth 2.0, JWT, Stripe, MongoDB, AWS",
        image: "https://image.thum.io/get/width/1200/https://student-nexus.vercel.app/",
        link: "https://student-nexus.vercel.app/",
      },
      {
        title: "Health Bridge",
        category: "ML-Powered Healthcare Platform",
        description:
          "All-in-one healthcare system with ML-powered disease prediction using Scikit-learn, integrated appointment booking, and patient record management through a React frontend and Flask API.",
        tools:
          "ReactJS, Node.js, Express.js, MongoDB, Python, Flask, Scikit-learn",
        image:
          "https://image.thum.io/get/width/1200/https://bustling-bellflower-465.notion.site/Health-Bridge-All-In-One-HealthCare-System-1f0a1c2c8ee28170b200f3b1263efb66",
        link:
          "https://bustling-bellflower-465.notion.site/Health-Bridge-All-In-One-HealthCare-System-1f0a1c2c8ee28170b200f3b1263efb66",
      },
    ] as ProjectItem[],
  },
  techStack: {
    title: "My Techstack",
    technologies: [
      { name: "HTML 5", icon: "html" },
      { name: "CSS 3", icon: "css" },
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
      { name: "React JS", icon: "reactjs" },
      { name: "Redux Toolkit", icon: "redux" },
      { name: "Tailwind CSS", icon: "tailwind" },
      { name: "Node JS", icon: "nodejs" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "Three JS", icon: "threejs" },
      { name: "Git", icon: "git" },
      { name: "Figma", icon: "figma" },
      { name: "Docker", icon: "docker" },
    ] as TechItem[],
  },
  contact: {
    title: "Contact",
    email: "bagwe.sh@northeastern.edu",
    education:
      "MS in Computer Software Engineering (Northeastern University)",
    social: {
      github: "https://github.com/bagwe-shubham1727",
      linkedin: "https://www.linkedin.com/in/shubham-bagwe/",
    },
    creditName: "Shubham Bagwe",
    year: "2026",
  },
  socialIcons: {
    github: "https://github.com/bagwe-shubham1727",
    linkedin: "https://www.linkedin.com/in/shubham-bagwe/",
    resumeUrl: "/Shubham_Bagwe_Resume.pdf",
  },
} as const;

export const getResumeHref = (resumeUrl?: string | null) => {
  if (!resumeUrl) return "#";
  const trimmedUrl = resumeUrl.trim();
  return trimmedUrl.length > 0 ? trimmedUrl : "#";
};
