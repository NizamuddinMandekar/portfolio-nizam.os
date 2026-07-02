import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const BOOT_LINES = [
  "NIZAM.OS v2.6 bootloader",
  "loading kernel: transformer-9.26 .............. OK",
  "mounting /skills (python, pytorch, langchain) . OK",
  "indexing 43,000+ documents into vector store .. OK",
  "loading RAG pipeline .......................... OK",
  "establishing neural link ...................... OK",
  "nizam.os login: root",
  "password: ************",
  "authentication .................... ACCESS GRANTED",
  "starting session: root@nizam.os",
];

export default function BootSequence({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(0);
  const [finished, setFinished] = useState(false);
  const doneRef = useRef(false);

  // timer + keypress both advance the same counter
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(BOOT_LINES.length);
      return;
    }
    const advance = () => setVisible((v) => Math.min(v + 1, BOOT_LINES.length));
    const interval = setInterval(advance, 240);
    return () => clearInterval(interval);
  }, []);

  // once every line is on screen, wait for a key/tap to enter
  const ready = visible >= BOOT_LINES.length;
  useEffect(() => {
    if (!ready) return;
    const enter = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setFinished(true);
      onDone();
    };
    window.addEventListener("keydown", enter);
    window.addEventListener("pointerdown", enter);
    return () => {
      window.removeEventListener("keydown", enter);
      window.removeEventListener("pointerdown", enter);
    };
  }, [ready, onDone]);

  return (
    <AnimatePresence>
      {!finished && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] bg-crt flex items-center justify-center px-6"
        >
          <div className="w-full max-w-xl text-sm">
            {BOOT_LINES.slice(0, visible).map((line, i) => (
              <p key={i} className="text-phos glow leading-loose">
                <span className="text-faint mr-2">[{(i * 0.24).toFixed(2)}s]</span>
                {line}
              </p>
            ))}
            {visible < BOOT_LINES.length && <span className="cursor-block" />}
            {ready && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="text-cyanx mt-6"
              >
                press any key to enter…
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
