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

    // one line per distinct press — ignore key auto-repeat, throttle to 90ms
    let lastPress = 0;
    const onPress = (e: KeyboardEvent | PointerEvent) => {
      if ("repeat" in e && e.repeat) return;
      const now = performance.now();
      if (now - lastPress < 90) return;
      lastPress = now;
      advance();
    };
    window.addEventListener("keydown", onPress);
    window.addEventListener("pointerdown", onPress);
    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", onPress);
      window.removeEventListener("pointerdown", onPress);
    };
  }, []);

  // finish once every line is on screen, however we got there
  useEffect(() => {
    if (visible < BOOT_LINES.length || doneRef.current) return;
    doneRef.current = true;
    const t = setTimeout(() => {
      setFinished(true);
      onDone();
    }, 400);
    return () => clearTimeout(t);
  }, [visible, onDone]);

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
              <p className="text-faint text-xs mt-4">press any key (or tap) to boot faster…</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
