import { useEffect, useState } from "react";
import BootSequence from "./components/BootSequence";
import MatrixRain from "./components/MatrixRain";
import Terminal from "./components/Terminal";
import TopBar from "./components/TopBar";
import { profile } from "./data/portfolio";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

export default function App() {
  const [booted, setBooted] = useState(false);
  const [godMode, setGodMode] = useState(false);

  // konami code → god mode: matrix takeover + toast
  useEffect(() => {
    let progress = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === KONAMI[progress]) {
        progress++;
        if (progress === KONAMI.length) {
          progress = 0;
          window.dispatchEvent(new CustomEvent("nizamos:matrix"));
          setGodMode(true);
          setTimeout(() => setGodMode(false), 4000);
        }
      } else {
        progress = key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative h-dvh flex flex-col overflow-hidden crt-flicker">
      <MatrixRain />

      <BootSequence onDone={() => setBooted(true)} />

      {booted && (
        <>
          <TopBar />
          <main className="relative z-10 flex-1 min-h-0 flex flex-col items-center px-4 py-4">
            <Terminal />
            <p className="mt-3 text-sm text-faint text-center max-w-xl shrink-0">
              tip: try{" "}
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("nizamos:run-command", { detail: "sudo hire-me" })
                  )
                }
                className="text-phos underline decoration-phos/40 underline-offset-4 hover:decoration-phos hover:glow transition-all cursor-pointer"
              >
                sudo hire-me
              </button>{" "}
              · tab autocompletes · ctrl+L clears
            </p>
          </main>
          <footer className="relative z-10 shrink-0 border-t border-linex py-4 text-center text-base text-faint">
            © {new Date().getFullYear()} {profile.name} · handcrafted terminal, no templates
          </footer>
        </>
      )}

      {godMode && (
        <div className="god-toast fixed top-20 left-1/2 -translate-x-1/2 z-[70] border border-phos/60 bg-crt/95 px-6 py-3 text-phos glow text-lg">
          ⬆⬆⬇⬇⬅➡⬅➡BA GOD MODE UNLOCKED
        </div>
      )}

      {/* CRT effects */}
      <div className="fixed inset-0 z-50 crt-overlay" />
      <div className="fixed inset-0 z-50 crt-vignette" />
    </div>
  );
}
