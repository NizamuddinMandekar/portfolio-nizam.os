import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "../data/portfolio";
import { heartbeat } from "../terminal/social";

const TICKER = [
  `${profile.name} · ${profile.role}`,
  "uptime: 3+ years in AI",
  "43,000+ documents indexed",
  "2 research papers published",
  "status: open to opportunities",
];

export default function TopBar() {
  const [time, setTime] = useState(() => new Date());
  const [online, setOnline] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((i) => (i + 1) % TICKER.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const beat = () => heartbeat().then((n) => n !== null && setOnline(n));
    beat();
    const t = setInterval(beat, 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="relative z-40 shrink-0 border-b border-linex bg-crt/95">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between text-base">
        <p className="text-phos glow select-none">
          ▞ NIZAM.OS <span className="text-faint">v2.6</span>
        </p>
        <span className="text-faint hidden md:block relative h-5 overflow-hidden min-w-[20rem] text-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={tick}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {TICKER[tick]}
            </motion.span>
          </AnimatePresence>
        </span>
        <div className="flex items-center gap-3">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="text-faint hover:text-phos transition-colors cursor-pointer"
          >
            <Github className="w-6 h-6" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="text-faint hover:text-phos transition-colors cursor-pointer"
          >
            <Linkedin className="w-6 h-6" />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="Send email"
            className="text-faint hover:text-phos transition-colors cursor-pointer"
          >
            <Mail className="w-6 h-6" />
          </a>
          {online !== null && (
            <span className="text-faint border-l border-linex pl-3 hidden md:inline">
              <span className="text-phos glow pulse-dot inline-block">●</span> {online} online
            </span>
          )}
          <span className="text-faint border-l border-linex pl-3 tabular-nums hidden sm:inline">
            {time.toLocaleTimeString("en-IN", { hour12: false })}
          </span>
          <span className="text-phos glow pulse-dot inline-block">●</span>
        </div>
      </div>
    </header>
  );
}
