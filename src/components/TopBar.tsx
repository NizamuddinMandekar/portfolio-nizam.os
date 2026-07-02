import { useEffect, useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "../data/portfolio";
import { heartbeat } from "../terminal/social";

export default function TopBar() {
  const [time, setTime] = useState(() => new Date());
  const [online, setOnline] = useState<number | null>(null);

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
        <p className="text-faint hidden md:block">
          {profile.name} · {profile.role}
        </p>
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
              <span className="text-phos glow">●</span> {online} online
            </span>
          )}
          <span className="text-faint border-l border-linex pl-3 tabular-nums hidden sm:inline">
            {time.toLocaleTimeString("en-IN", { hour12: false })}
          </span>
          <span className="text-phos glow">●</span>
        </div>
      </div>
    </header>
  );
}
