import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

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

  // pressing keys during boot speeds it up, hacker style
  useEffect(() => {
    const onKey = () => setVisible((v) => Math.min(v + 1, BOOT_LINES.length));
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setFinished(true);
      onDone();
      return;
    }
    const interval = setInterval(() => {
      setVisible((v) => {
        if (v >= BOOT_LINES.length) {
          clearInterval(interval);
          setTimeout(() => {
            setFinished(true);
            onDone();
          }, 500);
          return v;
        }
        return v + 1;
      });
    }, 240);
    return () => clearInterval(interval);
  }, [onDone]);

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
            {visible < BOOT_LINES.length - 2 && (
              <p className="text-faint text-xs mt-4">press any key to boot faster…</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
