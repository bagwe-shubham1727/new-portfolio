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
        category: "Multi-Tenant Event Processing on GCP",
        description:
          "Event-driven, multi-tenant log ingestion platform with Node.js services on Cloud Run, Pub/Sub workers, and tenant-isolated Firestore storage. Load-tested to 1,931 requests per minute at 126ms average latency and under 0.1% errors, with idempotent retries and a dead-letter topic.",
        tools:
          "Node.js, Express, GCP Cloud Run, Pub/Sub, Firestore, Cloud Logging, Docker",
        image:
          "https://opengraph.githubassets.com/1/bagwe-shubham1727/robust-data-processor",
        link: "https://github.com/bagwe-shubham1727/robust-data-processor",
      },
      {
        title: "Healthcare Plan Management System",
        category: "Distributed Search and Storage API",
        description:
          "Versioned REST API that decomposes nested healthcare plans into per-object Redis keys and Elasticsearch parent-child documents. A RabbitMQ worker with a dead-letter queue moved indexing off the request path, removing 200-500ms of blocking latency, with ETag concurrency control and Google OAuth2.",
        tools:
          "Node.js, Express, Redis, Elasticsearch, RabbitMQ, Google OAuth2, JSON Schema, Docker Compose",
        image:
          "https://opengraph.githubassets.com/1/bagwe-shubham1727/healthcare-plan-management-system",
        link: "https://github.com/bagwe-shubham1727/healthcare-plan-management-system",
      },
      {
        title: "Sentiment Aura",
        category: "Real-Time AI Voice Sentiment Visualization",
        description:
          "Streams live speech through Deepgram WebSockets to a Node.js backend and Google Gemini, turning audio into sentiment, tone, and keyword insights. A React and p5.js visualization engine renders orbital particles and hex grids at 60 FPS using spatial hashing and object pooling.",
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
          "Full-stack student housing platform with OAuth 2.0 and JWT authentication, Stripe payments, and geolocation-based housing recommendations. Built with React, TypeScript, Redux, and Express over MongoDB, with the backend on AWS Lambda and EC2 and the frontend on Vercel.",
        tools:
          "React, TypeScript, Redux, Node.js, Express, MongoDB, OAuth 2.0, JWT, Stripe, Material UI, AWS",
        image: "https://image.thum.io/get/width/1200/https://student-nexus.vercel.app/",
        link: "https://student-nexus.vercel.app/",
      },
      {
        title: "Health Bridge",
        category: "ML-Powered Healthcare Platform",
        description:
          "Healthcare platform for appointment booking and Skype video consultations, with disease detection models reaching 85% accuracy and a generic medicine recommender that compares scraped drug compositions. Published in IJRPR Vol. 3.",
        tools:
          "React, Node.js, Express, MongoDB, Python, Flask, Scikit-learn, BeautifulSoup4",
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
