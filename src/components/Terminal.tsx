import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { KNOWN_COMMANDS, runCommand, welcomeOutput } from "../terminal/commands";
import { sound } from "../terminal/sound";
import AIReply from "./AIReply";

interface HistoryEntry {
  id: number;
  command: string | null; // null = system output (no prompt echo)
  output: ReactNode;
  chat?: boolean; // entry was typed inside chat mode
}

const DOCK_COMMANDS = [
  "about",
  "chat",
  "projects",
  "experience",
  "skills",
  "research",
  "contact",
  "resume",
  "neofetch",
];

const CHAT_PROMPT = (
  <>
    <span className="text-cyanx">you</span>
    <span className="text-faint"> ▸</span>
  </>
);

const PROMPT = (
  <>
    <span className="text-cyanx">root</span>
    <span className="text-faint">@</span>
    <span className="text-phos">nizam.os</span>
    <span className="text-faint">:~$</span>
  </>
);

let entryId = 0;

export default function Terminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { id: entryId++, command: null, output: welcomeOutput() },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("nizamos-history") ?? "[]");
    } catch {
      return [];
    }
  });
  const [histIndex, setHistIndex] = useState(-1);
  const [chatMode, setChatMode] = useState(false);
  const [ghost, setGhost] = useState<HistoryEntry[] | null>(null);
  const [wobble, setWobble] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tourTimer = useRef<number | null>(null);
  const historyRef = useRef<HistoryEntry[]>([]);
  historyRef.current = history;
  const typingRef = useRef(false);

  // phosphor afterglow: cleared output fades instead of vanishing
  const clearWithGhost = () => {
    setGhost(historyRef.current);
    setHistory([]);
    window.setTimeout(() => setGhost(null), 750);
  };

  const stopTour = () => {
    if (tourTimer.current !== null) {
      clearInterval(tourTimer.current);
      tourTimer.current = null;
    }
  };

  // scroll so the newest command starts at the top of the viewport,
  // not the bottom of its output
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const entries = el.querySelectorAll<HTMLElement>("[data-entry]");
    const last = entries[entries.length - 1];
    if (last) {
      el.scrollTo({ top: last.offsetTop - 12 });
    } else {
      el.scrollTo({ top: el.scrollHeight });
    }
  }, [history]);

  // snake (and other embeds) ask us to take focus back on exit
  useEffect(() => {
    const refocus = () => inputRef.current?.focus();
    window.addEventListener("nizamos:focus-input", refocus);
    return () => window.removeEventListener("nizamos:focus-input", refocus);
  }, []);


  const execute = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();

      if (chatMode) {
        if (trimmed.toLowerCase() === "exit") {
          setChatMode(false);
          setHistory((h) => [
            ...h,
            {
              id: entryId++,
              command: trimmed,
              output: (
                <span className="text-faint">
                  NIZ.AI session closed. back to shell type{" "}
                  <span className="text-cyanx">help</span> for commands.
                </span>
              ),
              chat: true,
            },
          ]);
        } else if (trimmed) {
          setHistory((h) => [
            ...h,
            {
              id: entryId++,
              command: trimmed,
              chat: true,
              output: (
                <div className="flex gap-2">
                  <span className="text-cyanx glow-cyan shrink-0">niz.ai ▸</span>
                  <span className="text-phos-dim">
                    <AIReply message={trimmed} />
                  </span>
                </div>
              ),
            },
          ]);
        }
      } else {
        const result = runCommand(trimmed);
        if (result.enterChat) setChatMode(true);
        if (result.clear) {
          clearWithGhost();
        } else if (result.output !== null || trimmed) {
          setHistory((h) => [
            ...h,
            { id: entryId++, command: trimmed, output: result.output },
          ]);
        }
        if (result.tour) {
          const queue = [...result.tour];
          stopTour();
          tourTimer.current = window.setInterval(() => {
            const next = queue.shift();
            if (!next) {
              stopTour();
              return;
            }
            const r = runCommand(next);
            setHistory((h) => [...h, { id: entryId++, command: next, output: r.output }]);
          }, 2400);
        }
      }

      if (trimmed) {
        setCmdHistory((h) => {
          const next = [trimmed, ...h].slice(0, 50);
          localStorage.setItem("nizamos-history", JSON.stringify(next));
          return next;
        });
        // pulse the matrix rain + wobble the screen like the beam resyncing
        window.dispatchEvent(new CustomEvent("nizamos:activity"));
        setWobble(true);
        window.setTimeout(() => setWobble(false), 180);
      }
      setHistIndex(-1);
      setInput("");
    },
    [chatMode]
  );

  // dock clicks type the command out character-by-character before running
  const typeAndRun = useCallback(
    (cmd: string) => {
      if (typingRef.current) return;
      stopTour();
      typingRef.current = true;
      let i = 0;
      const iv = window.setInterval(() => {
        i++;
        setInput(cmd.slice(0, i));
        sound.key();
        if (i >= cmd.length) {
          clearInterval(iv);
          window.setTimeout(() => {
            typingRef.current = false;
            sound.enter();
            execute(cmd);
          }, 250);
        }
      }, 75);
    },
    [execute]
  );

  // external UI (tip line, etc.) can run a command in this terminal
  useEffect(() => {
    const run = (e: Event) => {
      const cmd = (e as CustomEvent<string>).detail;
      if (typeof cmd === "string") {
        typeAndRun(cmd);
        inputRef.current?.focus();
      }
    };
    window.addEventListener("nizamos:run-command", run);
    return () => window.removeEventListener("nizamos:run-command", run);
  }, [typeAndRun]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    stopTour(); // any manual input takes the wheel back
    if (e.key.length === 1 || e.key === "Backspace") {
      sound.key();
    }
    if (e.key === "Enter") {
      sound.enter();
      execute(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIndex + 1, cmdHistory.length - 1);
      if (cmdHistory[next]) {
        setHistIndex(next);
        setInput(cmdHistory[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = histIndex - 1;
      setHistIndex(next);
      setInput(next >= 0 ? cmdHistory[next] : "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const match = KNOWN_COMMANDS.find((c) => c.startsWith(input.toLowerCase()));
      if (match && input) setInput(match);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      clearWithGhost();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`term-window rounded-lg overflow-hidden w-full max-w-4xl mx-auto flex flex-col flex-1 min-h-0 ${wobble ? "wobble" : ""}`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* title bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-linex bg-black/40 select-none">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-alert/80" />
          <span className="w-3 h-3 rounded-full bg-amberx/80" />
          <span className="w-3 h-3 rounded-full bg-phos/80" />
        </div>
        <p className="text-sm text-faint">
          root@nizam.os /portfolio 80×24
        </p>
        <p className="text-sm text-phos glow hidden sm:block">
          <span className="pulse-dot inline-block">●</span> LIVE
        </p>
      </div>

      {/* scrollback */}
      <div
        ref={scrollRef}
        className="relative flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 text-[0.95rem] sm:text-base"
      >
        {ghost && (
          <div className="phosphor-fade space-y-4" aria-hidden="true">
            {ghost.map((entry) => (
              <div key={`g-${entry.id}`}>
                {entry.command !== null && (
                  <div className="flex gap-2 flex-wrap">
                    <span>{entry.chat ? CHAT_PROMPT : PROMPT}</span>
                    <span className="text-phos">{entry.command}</span>
                  </div>
                )}
                {entry.output && <div className="mt-2">{entry.output}</div>}
              </div>
            ))}
          </div>
        )}
        {history.map((entry) => (
          <div key={entry.id} data-entry>
            {entry.command !== null && (
              <div className="flex gap-2 flex-wrap">
                <span>{entry.chat ? CHAT_PROMPT : PROMPT}</span>
                <span className="text-phos glow">{entry.command}</span>
              </div>
            )}
            {entry.output && <div className="mt-2 stagger">{entry.output}</div>}
          </div>
        ))}

        {/* input line */}
        <div className="flex gap-2 items-center">
          <span className="shrink-0">{chatMode ? CHAT_PROMPT : PROMPT}</span>
          <div className="relative flex-1 min-w-[8rem]">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              className="w-full bg-transparent outline-none text-phos glow caret-transparent"
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoFocus
              aria-label="Terminal command input"
            />
            <span
              className="cursor-block absolute top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: `${input.length * 0.6}em` }}
            />
          </div>
        </div>
      </div>

      {/* command dock */}
      <div className="border-t border-linex px-3 py-2.5 bg-black/40 flex flex-wrap gap-1.5">
        {(chatMode ? ["exit"] : DOCK_COMMANDS).map((c) => (
          <button
            key={c}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              typeAndRun(c);
              inputRef.current?.focus();
            }}
            className="chip text-sm px-3 py-1.5 border border-linex text-phos-dim hover:text-phos hover:border-phos/60 hover:bg-phos/5 transition-colors duration-150 cursor-pointer"
          >
            {c}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
