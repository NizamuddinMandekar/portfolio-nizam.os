export const profile = {
  name: "Nizamuddin Mandekar",
  role: "AI Engineer",
  tagline: "I build and ship LLM-powered systems from RAG pipelines to production chatbots.",
  location: "Kalyan, Maharashtra, India",
  email: "nizamuddin.mandekar@gmail.com",
  phone: "+91 8879992052",
  github: "https://github.com/NizamuddinMandekar",
  linkedin: "https://linkedin.com/in/nizamuddinmandekar",
  summary:
    "AI Engineer with 1.5+ years of experience building and deploying LLM-powered chatbots and machine learning applications. Skilled in Python, FastAPI, NLP, transformers, and RAG-based systems with public-sector delivery experience, including a multilingual e-governance chatbot for a government department, and a published research record in AI.",
};

export const stats = [
  { value: "43K+", label: "Resumes processed into semantic search" },
  { value: "2", label: "Published research papers" },
  { value: "9.26", label: "CGPA MSc Artificial Intelligence" },
  { value: "6+", label: "Production AI systems shipped" },
];

export const experience = [
  {
    role: "AI Engineer",
    company: "AutomateBuddy Technologies Pvt. Ltd.",
    period: "Feb 2026 Present",
    points: [
      "Developed and deployed AskAllen, an LLM-powered chatbot, using RAG architecture, embeddings, and vector search to improve response accuracy and retrieval efficiency.",
      "Evaluated and integrated LLM models (Qwen, LLaMA variants) and built embedding and vector-storage pipelines in GPU environments, processing 43,000+ resumes into searchable chunks.",
      "Built AI review-analytics for FudEasy a pipeline ingesting 1000+ Google reviews for sentiment analysis with LLM-generated contextual automated replies.",
      "Designed interactive Power BI dashboards tracking sales and expenses for restaurant clients, cutting manual reporting time.",
      "Deployed and optimized AI services on Windows and Ubuntu servers.",
      "Built QuizBuddy, a real-time multiplayer quiz platform with three synced React + TypeScript apps on Firebase Firestore, featuring 6 game modes.",
    ],
    tech: ["Python", "RAG", "Vector DBs", "Qwen / LLaMA", "Power BI", "React", "Firebase"],
  },
  {
    role: "Jr. AI Engineer",
    company: "SAAR IT Resources Pvt. Ltd.",
    period: "May 2025 Nov 2025",
    points: [
      "Built WhatsApp integration using FastAPI, Meta WhatsApp Business API, and Ngrok for webhook communication.",
      "Contributed to a multilingual e-governance chatbot for the Water Supply and Sanitation Department (WSSD) handling citizen queries in Marathi, Hindi, and English, with real-time complaint tracking via SQL-backed ticket IDs.",
      "Implemented a RAG pipeline using TF-IDF and Groq LLM for context-aware responses.",
      "Integrated Whisper (STT) and GTTS (TTS) for voice interaction.",
    ],
    tech: ["FastAPI", "LangChain", "Groq", "Whisper", "WhatsApp API", "SQL"],
  },
];

export const projects = [
  {
    title: "AskAllen",
    subtitle: "LLM-Powered Recruitment Chatbot",
    description:
      "Production RAG chatbot with embeddings and vector search over 43,000+ resumes. Evaluated Qwen and LLaMA variants in GPU environments for semantic retrieval at scale.",
    tags: ["RAG", "Vector Search", "LLM", "GPU"],
    link: "https://askallen.cxengine.net/",
    linkLabel: "Live Demo",
    accent: "#22d3ee",
  },
  {
    title: "AI Image Detector",
    subtitle: "Real vs. AI-Generated Image Classifier",
    description:
      "Fine-tuned ResNet50 neural network classifying synthetic faces with 92%+ accuracy. Published in IJISRT and deployed as a live Hugging Face Space.",
    tags: ["Deep Learning", "ResNet50", "PyTorch", "Published"],
    link: "https://huggingface.co/spaces/NizamuddinMandekar/ImageDetector",
    linkLabel: "Try it on Hugging Face",
    github: "https://github.com/NizamuddinMandekar/ImageDetector",
    accent: "#a78bfa",
  },
  {
    title: "QuizBuddy",
    subtitle: "Real-Time Multiplayer Quiz Platform",
    description:
      "Three synced React + TypeScript apps (Host, TV, Player) on Firebase Firestore with 6 game modes and a CRUD-managed question bank a live, game-show experience.",
    tags: ["React", "TypeScript", "Firebase", "Real-time"],
    accent: "#34d399",
  },
  {
    title: "WSSD e-Governance Chatbot",
    subtitle: "Multilingual Citizen Services AI",
    description:
      "Government chatbot serving citizens in Marathi, Hindi, and English with voice interaction (Whisper + GTTS) and real-time complaint tracking through unique ticket IDs.",
    tags: ["NLP", "Multilingual", "Voice AI", "Public Sector"],
    accent: "#f472b6",
  },
  {
    title: "FudEasy Review Analytics",
    subtitle: "AI Sentiment & Auto-Reply Engine",
    description:
      "Pipeline ingesting 1000+ Google reviews for sentiment analysis, paired with an LLM system generating contextual automated replies and Power BI reporting dashboards.",
    tags: ["Sentiment Analysis", "LLM", "Power BI", "Pandas"],
    accent: "#fbbf24",
  },
];

export const skillGroups = [
  {
    title: "AI / Machine Learning",
    skills: ["Machine Learning", "Deep Learning", "NLP", "Transformers", "Generative AI", "LLM Applications", "RAG", "Vector Databases", "Prompt Engineering"],
  },
  {
    title: "Languages & Frameworks",
    skills: ["Python", "SQL", "TypeScript", "FastAPI", "LangChain", "Hugging Face", "PyTorch", "TensorFlow"],
  },
  {
    title: "Frontend",
    skills: ["React", "Vite", "Tailwind CSS", "Zustand", "Framer Motion", "React Router"],
  },
  {
    title: "Data & Infrastructure",
    skills: ["PostgreSQL", "MSSQL", "Supabase", "Firebase", "Power BI", "Tableau", "Docker", "WebSockets", "Linux/Ubuntu"],
  },
];

export const publications = [
  {
    year: "2025",
    title: "AI vs Reality: Classifying Synthetic Faces with a Fine-Tuned ResNet50 Neural Network",
    journal: "International Journal of Innovative Science and Research Technology (IJISRT), 10(7), 809–816",
    doi: "https://doi.org/10.38124/ijisrt/25jul706",
  },
  {
    year: "2023",
    title: "A Survey of Virtual Machine System: Current Technology",
    journal: "International Research Journal of Modernization in Engineering Technology and Science (IRJMETS)",
    doi: "https://doi.org/10.56726/IRJMETS30061",
  },
];

export const education = [
  {
    degree: "MSc, Artificial Intelligence",
    school: "B.K. Birla College, Kalyan",
    detail: "9.26 CGPA · 2025",
  },
  {
    degree: "BSc, Information Technology",
    school: "B.K. Birla College, Kalyan",
    detail: "9.27 CGPA · 2023",
  },
  {
    degree: "Certifications",
    school: "L&T EduTech",
    detail: "Deep Learning (2025) · Machine Learning (2024)",
  },
];
