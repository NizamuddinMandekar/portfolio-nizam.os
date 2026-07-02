import type { ReactNode } from "react";
import RotatingGreeting from "../components/RotatingGreeting";
import { sound } from "./sound";
import {
  education,
  experience,
  profile,
  projects,
  publications,
  skillGroups,
  stats,
} from "../data/portfolio";

export interface CommandResult {
  output: ReactNode;
  clear?: boolean;
  enterChat?: boolean;
}

const Line = ({ children }: { children: ReactNode }) => (
  <div className="leading-relaxed">{children}</div>
);

const Key = ({ children }: { children: ReactNode }) => (
  <span className="text-cyanx">{children}</span>
);

const Dim = ({ children }: { children: ReactNode }) => (
  <span className="text-faint">{children}</span>
);

const Link = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    target={href.startsWith("mailto") ? undefined : "_blank"}
    rel="noopener noreferrer"
    className="text-cyanx underline decoration-cyanx/40 underline-offset-4 hover:text-white hover:decoration-white transition-colors cursor-pointer"
  >
    {children}
  </a>
);

export const ASCII_BANNER = String.raw`
███╗   ██╗██╗███████╗ █████╗ ███╗   ███╗    ██████╗ ███████╗
████╗  ██║██║╚══███╔╝██╔══██╗████╗ ████║   ██╔═══██╗██╔════╝
██╔██╗ ██║██║  ███╔╝ ███████║██╔████╔██║   ██║   ██║███████╗
██║╚██╗██║██║ ███╔╝  ██╔══██║██║╚██╔╝██║   ██║   ██║╚════██║
██║ ╚████║██║███████╗██║  ██║██║ ╚═╝ ██║██╗╚██████╔╝███████║
╚═╝  ╚═══╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝ ╚═════╝ ╚══════╝
`;

export function welcomeOutput(): ReactNode {
  return (
    <div>
      <pre className="text-phos-dim text-[6px] min-[420px]:text-[8px] sm:text-[9px] md:text-[11px] leading-[1.2] whitespace-pre overflow-x-auto pb-1 [text-shadow:0_0_10px_rgba(46,232,138,0.25)]">
        {ASCII_BANNER}
      </pre>
      <Line>
        <Dim>──────────────────────────────────────────────</Dim>
      </Line>
      <Line>
        identity: <Key>{profile.name.toUpperCase()}</Key>
      </Line>
      <Line>
        role: <Key>AI_ENGINEER</Key> <Dim>· {profile.location}</Dim>
      </Line>
      <Line>
        status: <span className="text-phos glow">● ONLINE open to opportunities</span>
      </Line>
      <Line>
        <Dim>──────────────────────────────────────────────</Dim>
      </Line>
      <Line>
        <RotatingGreeting /> Type <Key>help</Key> to list commands, or click a
        command below.
      </Line>
    </div>
  );
}

const COMMAND_LIST: [string, string][] = [
  ["about", "who is nizamuddin?"],
  ["projects", "list shipped AI systems"],
  ["experience", "work history"],
  ["skills", "tech stack & capabilities"],
  ["research", "published papers"],
  ["education", "degrees & certifications"],
  ["chat", "talk to NIZ.AI a simulated me"],
  ["contact", "reach out / hire"],
  ["resume", "open resume PDF"],
  ["neofetch", "system info card"],
  ["open", "open a project: open askallen | detector"],
  ["theme", "switch color: green | cyan | amber"],
  ["sound", "toggle sfx: sound on | off"],
  ["matrix", "follow the white rabbit"],
  ["history", "your recent commands"],
  ["clear", "wipe the screen"],
];

export const KNOWN_COMMANDS = [
  ...COMMAND_LIST.map(([c]) => c),
  "help",
  "whoami",
  "banner",
  "socials",
  "hire",
  "ls",
  "sudo",
  "chat",
  "exit",
  "date",
  "uptime",
  "ping",
  "echo",
];

export function runCommand(raw: string): CommandResult {
  const input = raw.trim().toLowerCase();
  const [cmd, ...args] = input.split(/\s+/);

  switch (cmd) {
    case "":
      return { output: null };

    case "help":
    case "ls":
      return {
        output: (
          <div>
            <Line>
              <Dim>available commands:</Dim>
            </Line>
            {COMMAND_LIST.map(([c, desc]) => (
              <Line key={c}>
                <Key>{c.padEnd(12, " ")}</Key> <Dim>{desc}</Dim>
              </Line>
            ))}
          </div>
        ),
      };

    case "about":
    case "whoami":
      return {
        output: (
          <div className="space-y-2">
            <Line>
              <span className="text-phos glow">{profile.name}</span> <Dim>{profile.role}</Dim>
            </Line>
            <p className="text-phos-dim leading-relaxed max-w-2xl">{profile.summary}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {stats.map((s) => (
                <div key={s.label} className="border border-linex p-3">
                  <p className="text-cyanx glow-cyan text-lg">{s.value}</p>
                  <p className="text-faint text-sm leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        ),
      };

    case "projects": {
      return {
        output: (
          <div className="space-y-3">
            <Line>
              <Dim>~/projects $ ls -la · {projects.length} systems shipped</Dim>
            </Line>
            {projects.map((p, i) => (
              <div key={p.title} className="border border-linex p-4">
                <Line>
                  <Dim>[{String(i + 1).padStart(2, "0")}]</Dim>{" "}
                  <span className="text-phos glow">{p.title}</span>{" "}
                  <Dim>{p.subtitle}</Dim>
                </Line>
                <p className="text-phos-dim text-base leading-relaxed mt-1.5">{p.description}</p>
                <Line>
                  <span className="text-faint text-sm">
                    tags: {p.tags.map((t) => `[${t}]`).join(" ")}
                  </span>
                </Line>
                {(p.link || p.github) && (
                  <div className="mt-1.5 flex gap-4 text-base">
                    {p.link && <Link href={p.link}>▸ {p.linkLabel ?? "live"}</Link>}
                    {p.github && <Link href={p.github}>▸ source</Link>}
                  </div>
                )}
              </div>
            ))}
          </div>
        ),
      };
    }

    case "experience":
      return {
        output: (
          <div className="space-y-3">
            {experience.map((job) => (
              <div key={job.company} className="border-l-2 border-phos/40 pl-4">
                <Line>
                  <span className="text-phos glow">{job.role}</span>{" "}
                  <Dim>@ {job.company}</Dim>
                </Line>
                <Line>
                  <span className="text-amberx text-sm">{job.period}</span>
                </Line>
                <ul className="mt-2 space-y-1.5">
                  {job.points.map((pt) => (
                    <li key={pt} className="text-phos-dim text-base leading-relaxed flex gap-2">
                      <span className="text-cyanx shrink-0">›</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
                <Line>
                  <span className="text-faint text-sm">
                    stack: {job.tech.join(" · ")}
                  </span>
                </Line>
              </div>
            ))}
          </div>
        ),
      };

    case "skills":
      return {
        output: (
          <div className="space-y-3">
            {skillGroups.map((g) => (
              <div key={g.title}>
                <Line>
                  <Key>▾ {g.title}</Key>
                </Line>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {g.skills.map((s) => (
                    <span
                      key={s}
                      className="text-sm px-2 py-1 border border-linex text-phos-dim hover:text-phos hover:border-phos/50 transition-colors cursor-default"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ),
      };

    case "research":
    case "publications":
      return {
        output: (
          <div className="space-y-3">
            {publications.map((pub) => (
              <div key={pub.title} className="border border-linex p-4">
                <Line>
                  <span className="text-amberx">[{pub.year}]</span>{" "}
                  <span className="text-phos glow">{pub.title}</span>
                </Line>
                <p className="text-faint text-sm mt-1">{pub.journal}</p>
                <Line>
                  <Link href={pub.doi}>▸ read paper (DOI)</Link>
                </Line>
              </div>
            ))}
          </div>
        ),
      };

    case "education":
      return {
        output: (
          <div className="space-y-2">
            {education.map((e) => (
              <Line key={e.degree}>
                <Key>{e.degree}</Key> <Dim>{e.school}</Dim>{" "}
                <span className="text-amberx text-sm">{e.detail}</span>
              </Line>
            ))}
          </div>
        ),
      };

    case "contact":
    case "hire":
      return {
        output: (
          <div className="space-y-1.5">
            <Line>
              <span className="text-phos glow">
                {cmd === "hire" ? "excellent decision. initiating handshake…" : "open channel:"}
              </span>
            </Line>
            <Line>
              email: <Link href={`mailto:${profile.email}`}>{profile.email}</Link>
            </Line>
            <Line>
              phone: <Key>{profile.phone}</Key>
            </Line>
            <Line>
              github: <Link href={profile.github}>{profile.github.replace("https://", "")}</Link>
            </Line>
            <Line>
              linkedin:{" "}
              <Link href={profile.linkedin}>{profile.linkedin.replace("https://", "")}</Link>
            </Line>
            <Line>
              location: <Dim>{profile.location}</Dim>
            </Line>
          </div>
        ),
      };

    case "socials":
      return {
        output: (
          <div>
            <Line>
              github: <Link href={profile.github}>{profile.github.replace("https://", "")}</Link>
            </Line>
            <Line>
              linkedin:{" "}
              <Link href={profile.linkedin}>{profile.linkedin.replace("https://", "")}</Link>
            </Line>
          </div>
        ),
      };

    case "resume": {
      const pdf = `${import.meta.env.BASE_URL}Nizamuddin_Mandekar_Resume.pdf`;
      window.open(pdf, "_blank", "noopener");
      return {
        output: (
          <Line>
            opening <Key>Nizamuddin_Mandekar_Resume.pdf</Key> …{" "}
            <Link href={pdf}>click here if it didn't open</Link>
          </Line>
        ),
      };
    }

    case "neofetch":
      return {
        output: (
          <div className="flex flex-col sm:flex-row gap-4">
            <pre className="text-cyanx glow-cyan text-[10px] leading-tight shrink-0">
              {String.raw`
   ▄▄▄▄▄▄▄▄▄
  █ ◉    ◉ █
  █   ▽▽   █
  █ NIZ.AI █
   ▀▀▀▀▀▀▀▀▀
`}
            </pre>
            <div className="text-base space-y-0.5">
              <Line><Key>user</Key>@nizam.os</Line>
              <Line><Dim>─────────────────</Dim></Line>
              <Line><Key>OS:</Key> NIZAM.OS v2.6 (Kalyan LTS)</Line>
              <Line><Key>Kernel:</Key> transformer-9.26-cgpa</Line>
              <Line><Key>Shell:</Key> rag-sh 43k</Line>
              <Line><Key>Uptime:</Key> {new Date().getFullYear() - 2023}+ yrs in AI</Line>
              <Line><Key>Packages:</Key> pytorch, langchain, fastapi</Line>
              <Line><Key>GPU:</Key> whatever the job needs</Line>
              <Line><Key>Memory:</Key> vector-indexed, semantic</Line>
            </div>
          </div>
        ),
      };

    case "open": {
      const targets: Record<string, { url: string; label: string }> = {
        askallen: { url: "https://askallen.cxengine.net/", label: "AskAllen (live demo)" },
        detector: {
          url: "https://huggingface.co/spaces/NizamuddinMandekar/ImageDetector",
          label: "AI Image Detector (Hugging Face)",
        },
        github: { url: profile.github, label: "GitHub profile" },
        linkedin: { url: profile.linkedin, label: "LinkedIn profile" },
        resume: {
          url: `${import.meta.env.BASE_URL}Nizamuddin_Mandekar_Resume.pdf`,
          label: "Resume PDF",
        },
      };
      const key = args[0];
      const target = key ? targets[key] : undefined;
      if (!target) {
        return {
          output: (
            <div>
              <Line>
                usage: <Key>open {Object.keys(targets).join(" | ")}</Key>
              </Line>
            </div>
          ),
        };
      }
      window.open(target.url, "_blank", "noopener");
      return {
        output: (
          <Line>
            opening <Key>{target.label}</Key> … <Link href={target.url}>direct link</Link>
          </Line>
        ),
      };
    }

    case "date":
      return {
        output: (
          <Line>
            <Key>{new Date().toString()}</Key>
          </Line>
        ),
      };

    case "uptime": {
      const years = new Date().getFullYear() - 2023;
      const session = Math.round(performance.now() / 1000);
      return {
        output: (
          <Line>
            career uptime: <Key>{years}+ years in AI</Key>{" "}
            <Dim>· this session: {session}s · zero crashes (in production, mostly)</Dim>
          </Line>
        ),
      };
    }

    case "ping":
      return {
        output: (
          <Line>
            PONG <Dim>time=0.042ms reflexes of a production API</Dim>
          </Line>
        ),
      };

    case "echo":
      return {
        output: raw.trim().slice(4).trim() ? (
          <Line>{raw.trim().slice(4).trim()}</Line>
        ) : (
          <Line><Dim>echo what? give me words.</Dim></Line>
        ),
      };

    case "theme": {
      const themes = ["green", "cyan", "amber"];
      const pick = args[0];
      if (!pick || !themes.includes(pick)) {
        return {
          output: (
            <Line>
              usage: <Key>theme green | cyan | amber</Key>{" "}
              <Dim>(current: {document.documentElement.dataset.theme || "green"})</Dim>
            </Line>
          ),
        };
      }
      if (pick === "green") {
        delete document.documentElement.dataset.theme;
      } else {
        document.documentElement.dataset.theme = pick;
      }
      localStorage.setItem("nizamos-theme", pick);
      return {
        output: (
          <Line>
            phosphor recalibrated to <Key>{pick}</Key>. easy on the eyes.
          </Line>
        ),
      };
    }

    case "sound": {
      const arg = args[0];
      if (arg === "on") {
        sound.setMuted(false);
        sound.enter();
        return { output: <Line>sfx <Key>enabled</Key>. clack away.</Line> };
      }
      if (arg === "off") {
        sound.setMuted(true);
        return { output: <Line>sfx <Key>disabled</Key>. silence is golden.</Line> };
      }
      return {
        output: (
          <Line>
            usage: <Key>sound on | off</Key>{" "}
            <Dim>(current: {sound.isMuted() ? "off" : "on"})</Dim>
          </Line>
        ),
      };
    }

    case "matrix":
      window.dispatchEvent(new CustomEvent("nizamos:matrix"));
      return {
        output: (
          <Line>
            <span className="text-phos glow">wake up, neo…</span>{" "}
            <Dim>the matrix has you. (6 seconds)</Dim>
          </Line>
        ),
      };

    case "history": {
      const stored: string[] = JSON.parse(
        localStorage.getItem("nizamos-history") ?? "[]"
      );
      if (stored.length === 0) {
        return { output: <Line><Dim>no history yet. type something memorable.</Dim></Line> };
      }
      return {
        output: (
          <div>
            {stored.slice(0, 20).map((c, i) => (
              <Line key={i}>
                <Dim>{String(stored.length - i).padStart(4, " ")}</Dim>{" "}
                <span className="text-phos">{c}</span>
              </Line>
            ))}
          </div>
        ),
      };
    }

    case "chat":
      return {
        enterChat: true,
        output: (
          <div className="space-y-1">
            <Line>
              <span className="text-cyanx glow-cyan">NIZ.AI v0.1</span>{" "}
              <Dim>simulated Nizamuddin (100% rule-based, 0% hallucination-free)</Dim>
            </Line>
            <Line>
              <Dim>ask me anything about his projects, skills, or hiring him. type</Dim>{" "}
              <Key>exit</Key> <Dim>to leave chat.</Dim>
            </Line>
          </div>
        ),
      };

    case "banner":
      return { output: welcomeOutput() };

    case "clear":
      return { output: null, clear: true };

    case "sudo":
      if (args.join(" ").includes("hire")) {
        return {
          output: (
            <Line>
              <span className="text-amberx">[sudo]</span> permission granted. email me:{" "}
              <Link href={`mailto:${profile.email}`}>{profile.email}</Link> 🔓
            </Line>
          ),
        };
      }
      return {
        output: (
          <Line>
            <span className="text-alert">you're already root here. absolute power looks good on you.</span>
          </Line>
        ),
      };

    case "rm":
      return {
        output: (
          <Line>
            <span className="text-alert">nice try.</span> <Dim>even root can't delete nizam's work ethic.</Dim>
          </Line>
        ),
      };

    default:
      return {
        output: (
          <Line>
            <span className="text-alert">command not found:</span> {cmd}{" "}
            <Dim>type</Dim> <Key>help</Key>
          </Line>
        ),
      };
  }
}
