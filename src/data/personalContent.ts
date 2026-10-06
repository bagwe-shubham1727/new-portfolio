export type CareerItem = {
  role: string;
  company: string;
  period: string;
  description: string;
};

export type ProjectLink = {
  label: string;
  url: string;
};

export type ProjectItem = {
  title: string;
  category: string;
  highlights: string[];
  tools: string;
  image: string;
  link?: string;
  links: ProjectLink[];
};

export type TechItem = {
  name: string;
  icon: string;
};

export type TestimonialItem = {
  quote: string;
  author: string;
  title: string;
  company: string;
  image: string;
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
      "Full-Stack Software Engineer with 2+ years of professional experience building high-scale web platforms and transaction-critical systems using React, TypeScript, Node.js, and C# .NET. Most recently, I rewrote a legacy healthcare portal as a React 19 SPA at Abacus Health Solutions. I focus on performance, observability, and resilient architecture, and I enjoy shipping reliable products from backend services to polished frontend experiences.",
  },
  career: {
    titleLine1: "My career",
    titleLine2: "experience",
    items: [
      {
        role: "Application Developer Intern",
        company: "Abacus Health Solutions",
        period: "Jan 2026 - Aug 2026",
        description:
          "Rewrote a legacy ASP.NET Web Forms healthcare wellness portal as a React 19 and TypeScript SPA, authoring ~73% of commits and shipping 17 routes to production on Azure Static Web Apps. Built config-driven registration flows, Sentry monitoring with PHI redaction, English and Spanish localization, and Vitest and Playwright test suites.",
      },
      {
        role: "Software Development Engineer (Full Stack)",
        company: "Ingram Micro",
        period: "Jul 2022 - Aug 2024",
        description:
          "Built asynchronous, cache-backed C# .NET microservices for cart and checkout, cutting latency from 500ms to 170ms for $1M+ in daily sales, and contributed to a React and TypeScript checkout redesign that sped up page loads by 25% and reduced abandonment by about 15%. Introduced Datadog monitoring, improving MTTR from 2 hours to under 1 hour.",
      },
      {
        role: "Software Developer Intern",
        company: "GEP Worldwide",
        period: "May 2022 - Jul 2022",
        description:
          "Optimized procurement workflow REST APIs on the GEP SMART platform with Redis caching, reducing response latency from 1s to 780ms for 5,000+ daily users. Built JavaScript automation and validation for procurement workflows, partnering with stakeholders at enterprise clients including Liberty Mutual.",
      },
    ] as CareerItem[],
  },
  work: {
    title: "My",
    titleHighlight: "Work",
    toolsLabel: "Tools & Features",
    projects: [
      {
        title: "EventFlow Engine",
        category: "Multi-Tenant Ingestion and Processing on GCP",
        highlights: [
          "Load-tested to 1,931 requests per minute at 126ms average latency and under 0.1% errors",
          "Node.js services on Cloud Run feed Pub/Sub workers that write to tenant-isolated Firestore storage",
          "Crash-safe under at-least-once delivery with idempotent writes, capped retries, and a dead-letter topic",
        ],
        tools:
          "Node.js, Express, GCP Cloud Run, Pub/Sub, Firestore, Cloud Logging, Docker",
        image:
          "https://opengraph.githubassets.com/1/bagwe-shubham1727/robust-data-processor",
        link: "https://github.com/bagwe-shubham1727/robust-data-processor",
        links: [
          { label: "Code", url: "https://github.com/bagwe-shubham1727/robust-data-processor" },
          { label: "Write-up", url: "https://bustling-bellflower-465.notion.site/Eventflow-Engine-2cca1c2c8ee280698fc9fd9bb67c5f54" },
          { label: "Video", url: "https://drive.google.com/file/d/14lmYrRHP5mJnZAI4noTT-HDkmuW19AjT/view?usp=sharing" },
        ],
      },
      {
        title: "Healthcare Plan Management System",
        category: "Distributed Search and Storage API",
        highlights: [
          "Removed 200-500ms of blocking latency by moving Elasticsearch indexing to a RabbitMQ worker",
          "Nested plans stored as per-object Redis keys and Elasticsearch parent-child documents",
          "Optimistic concurrency with SHA-256 ETags, secured by Google OAuth2 and JSON Schema validation",
        ],
        tools:
          "Node.js, Express, Redis, Elasticsearch, RabbitMQ, Google OAuth2, JSON Schema, Docker Compose",
        image:
          "https://opengraph.githubassets.com/1/bagwe-shubham1727/healthcare-plan-management-system",
        link: "https://github.com/bagwe-shubham1727/healthcare-plan-management-system",
        links: [
          { label: "Code", url: "https://github.com/bagwe-shubham1727/healthcare-plan-management-system" },
          { label: "Write-up", url: "https://bustling-bellflower-465.notion.site/Healthcare-Plan-Management-System-2cca1c2c8ee280ceb4bbd7addf382663" },
        ],
      },
      {
        title: "Sentiment Aura",
        category: "Real-Time AI Voice Sentiment Visualization",
        highlights: [
          "Streams live speech through Deepgram WebSockets to Google Gemini for sentiment, tone, and keywords",
          "60 FPS React and p5.js visualization engine using spatial hashing and object pooling",
          "Retry logic, exponential backoff, and fault-tolerant parsing keep streaming resilient to transient failures",
        ],
        tools:
          "React, Node.js, p5.js, Deepgram WebSockets, Google Gemini",
        image:
          "https://opengraph.githubassets.com/176da5bf12d3d442055291f62feb99a72d065a7da4256e6ccd531c9dc6abe7d6/bagwe-shubham1727/sentiment-aura",
        link: "https://github.com/bagwe-shubham1727/sentiment-aura",
        links: [
          { label: "Code", url: "https://github.com/bagwe-shubham1727/sentiment-aura" },
        ],
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
      { name: "Redux", icon: "redux" },
      { name: "Zustand", icon: "zustand" },
      { name: "Tailwind CSS", icon: "tailwind" },
      { name: "Node JS", icon: "nodejs" },
      { name: "C# / .NET", icon: "dotnet" },
      { name: "Python", icon: "python" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "Redis", icon: "redis" },
      { name: "Docker", icon: "docker" },
      { name: "AWS", icon: "aws" },
      { name: "GCP", icon: "gcp" },
      { name: "Git", icon: "git" },
      { name: "Figma", icon: "figma" },
    ] as TechItem[],
  },
  testimonials: {
    title: "What People",
    titleHighlight: "Say",
    items: [
      {
        quote:
          "Shubham is a proactive, collaborative, and highly supportive student. His problem-solving ability, leadership, and empathy make him stand out. I'm confident he will be a valuable asset to any team or organization he joins.",
        author: "Dr. Yu Jones",
        title: "Teaching Professor",
        company: "Northeastern University",
        image: "yu",
      },
      {
        quote:
          "Shubham is a dedicated and high-performing engineer who consistently delivers excellent results. His initiative-driven mindset, quick learning ability, and strong problem-solving skills made him a key contributor to multiple high-impact projects. He is reliable, collaborative, and an asset to any team.",
        author: "Dibyajit Chatterjee",
        title: "Director of Engineering",
        company: "Ingram Micro",
        image: "dj",
      },
      {
        quote:
          "Shubham quickly translates business needs into effective technical solutions. His work improving procurement workflows, optimizing APIs, and enhancing system performance had a clear impact on efficiency and user experience. He is dependable, skilled, and delivers results.",
        author: "Shirish Joshi",
        title: "Senior Engineering Manager",
        company: "GEP Worldwide",
        image: "shirish",
      },
      {
        quote:
          "Shubham is a technically strong, detail-oriented, and quick-learning student. His project work in SQL and NoSQL, along with his leadership and problem-solving abilities, consistently stood out. He is disciplined, reliable, and well-prepared to excel in any future endeavor.",
        author: "Rohit Barve",
        title: "Professor",
        company: "Vidyalankar Institute of Technology",
        image: "rohit",
      },
    ] as TestimonialItem[],
  },
  contact: {
    title: "Contact",
    email: "workwithshubhambagwe@gmail.com",
    education:
      "MS in Computer Software Engineering, Northeastern University (Expected Dec 2026)",
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
  },
} as const;
