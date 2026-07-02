export interface Post {
  slug: string;
  title: string;
  date: string;
  minutes: number;
  body: string[];
}

export const posts: Post[] = [
  {
    slug: "rag-at-scale",
    title: "What 43,000 resumes taught me about RAG in production",
    date: "2026-05",
    minutes: 4,
    body: [
      "Everyone's RAG demo works. Almost nobody's RAG system works at scale. The gap between the two is where I've spent most of my time as an AI engineer.",
      "When we built AskAllen, the corpus was 43,000+ resumes. The first lesson: chunking strategy matters more than model choice. Resumes are semi-structured a naive fixed-size chunker splits a candidate's experience across chunks and retrieval quality collapses. We chunked along document structure instead, and retrieval precision jumped before we touched a single model parameter.",
      "Second lesson: evaluate retrieval separately from generation. If the right chunk isn't in the top-k, no LLM can save you. We measured recall@k on a hand-labeled query set before ever looking at end-to-end answers.",
      "Third: embedding model swaps are cheap wins. We evaluated Qwen and LLaMA variants in GPU environments, and re-embedding the corpus with a better model was often a bigger quality lift than prompt engineering.",
      "The unglamorous truth is that production RAG is a data-engineering problem wearing an AI costume. The teams that win treat it that way.",
    ],
  },
  {
    slug: "detecting-ai-faces",
    title: "Teaching a ResNet50 to spot AI-generated faces",
    date: "2025-07",
    minutes: 3,
    body: [
      "My published research (IJISRT 2025) started with a simple question: can a classical CNN reliably tell real faces from synthetic ones, without exotic architectures?",
      "The answer was yes 92%+ accuracy with a fine-tuned ResNet50. The interesting part wasn't the architecture, it was the failure analysis. The model keyed in on frequency-domain artifacts that GANs and diffusion models leave behind: subtle regularities in skin texture and background transitions that humans don't consciously perceive.",
      "The catch: detectors age. Every new generator release shifts the artifact distribution, so a detector is a snapshot, not a solution. That shaped my view on the whole field detection is an arms race, and provenance standards (like C2PA) are the more durable answer.",
      "The model lives on as a Hugging Face Space where anyone can test their own images. Try it: type `open detector` in this terminal.",
    ],
  },
  {
    slug: "multilingual-gov-chatbot",
    title: "Building a government chatbot that speaks 3 languages",
    date: "2025-11",
    minutes: 3,
    body: [
      "Citizen-facing AI is a different sport. At SAAR IT, I contributed to a chatbot for the Water Supply and Sanitation Department (WSSD) that had to handle Marathi, Hindi, and English often mixed in a single sentence.",
      "Voice was non-negotiable: many users preferred speaking to typing. Whisper handled speech-to-text surprisingly well for Marathi, and GTTS closed the loop with spoken responses.",
      "The feature citizens actually loved most wasn't the AI it was ticket tracking. We wired the bot to a SQL database so anyone could check their complaint status in real time with a ticket ID. Lesson: in public-sector AI, boring reliability beats clever generation every time.",
      "If your users measure success by 'did my water complaint get fixed', your LLM temperature setting is not the headline.",
    ],
  },
];
