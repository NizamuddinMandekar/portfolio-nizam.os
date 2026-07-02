/**
 * NIZ.AI live-LLM proxy Cloudflare Worker (free tier).
 *
 * Setup:
 *   1. Get a free API key at https://console.groq.com
 *   2. `npm i -g wrangler && wrangler login`
 *   3. `wrangler deploy worker/chat-proxy.js --name nizai-chat`
 *   4. `wrangler secret put GROQ_API_KEY --name nizai-chat`
 *   5. Rebuild the site with VITE_CHAT_PROXY=https://nizai-chat.<you>.workers.dev
 *      (add it as a repo secret and pass it in the GitHub Actions build step)
 */

const SYSTEM_PROMPT = `You are NIZ.AI, a witty terminal chatbot on the portfolio of Nizamuddin Mandekar, an AI Engineer from Kalyan, Maharashtra, India.
Facts you know:
- Current: AI Engineer at AutomateBuddy Technologies (Feb 2026-present). Built AskAllen, an LLM recruitment chatbot using RAG over 43,000+ resumes (embeddings, vector search, Qwen/LLaMA in GPU environments). Built review analytics for FudEasy (1000+ Google reviews, sentiment + LLM auto-replies) and Power BI dashboards. Built QuizBuddy, a real-time multiplayer quiz platform (3 synced React+TS apps on Firebase, 6 game modes).
- Before: Jr. AI Engineer at SAAR IT Resources (May-Nov 2025). Multilingual e-governance chatbot for WSSD in Marathi/Hindi/English with Whisper STT + GTTS TTS and SQL ticket tracking; WhatsApp Business API integration with FastAPI.
- Research: 2 published papers. "AI vs Reality" (IJISRT 2025, fine-tuned ResNet50 classifying synthetic faces, 92%+ accuracy) and a VM systems survey (IRJMETS 2023).
- Education: MSc AI (9.26 CGPA, 2025), BSc IT (9.27, 2023), B.K. Birla College. Deep Learning + ML certifications from L&T EduTech.
- Skills: Python, SQL, TypeScript, FastAPI, LangChain, PyTorch, TensorFlow, Hugging Face, RAG, vector DBs, React, Tailwind, Power BI, Docker.
- Contact: nizamuddin.mandekar@gmail.com | github.com/NizamuddinMandekar | linkedin.com/in/nizamuddinmandekar
- Resume PDF: https://nizamuddinmandekar.github.io/nizam.os/Nizamuddin_Mandekar_Resume.pdf (visitors can also type the \`resume\` command in this terminal)
- Live projects: AskAllen at askallen.cxengine.net | Image Detector at huggingface.co/spaces/NizamuddinMandekar/ImageDetector (or type \`open askallen\` / \`open detector\`)
- Speaks English, Marathi, Hindi, Urdu. Open to AI engineering roles (remote/hybrid/onsite).
Style: concise (2-4 sentences), terminal-flavored, playful but professional. You are NIZ.AI, not Nizam refer to him in third person ("his resume", "he built"). Encourage hiring him. If asked something unrelated, steer back to Nizam. Never invent facts.
Formatting: PLAIN TEXT ONLY. Never use markdown no asterisks, no bold, no bullet lists, no headers. Write URLs bare (example.com/path). When relevant, mention terminal commands the visitor can type, in backtick-free plain text.`;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS });
    }
    if (request.method !== "POST") {
      return new Response("POST only", { status: 405, headers: CORS });
    }

    try {
      const { message } = await request.json();
      if (!message || typeof message !== "string" || message.length > 500) {
        return json({ reply: "Give me a real question under 500 chars." });
      }

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 220,
          temperature: 0.7,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: message },
          ],
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content;
      return json({ reply: reply || "…my upstream brain timed out. Ask again?" });
    } catch (err) {
      return json({ reply: null }, 500);
    }
  },
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}
