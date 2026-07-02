import { useEffect, useState } from "react";

const IDLE_MS = 60000;

export default function Screensaver() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let timer: number;
    const arm = () => {
      setActive(false);
      clearTimeout(timer);
      timer = window.setTimeout(() => setActive(true), IDLE_MS);
    };
    arm();
    const events = ["keydown", "pointerdown", "pointermove", "wheel", "touchstart"];
    events.forEach((e) => window.addEventListener(e, arm, { passive: true }));
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, arm));
    };
  }, []);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/95 overflow-hidden" aria-hidden="true">
      <div className="dvd-x">
        <div className="dvd-y">
          <div className="border border-linex px-6 py-3 text-center">
            <p className="text-phos glow font-bold text-xl">NIZAM.OS</p>
            <p className="text-faint text-xs mt-1">ai engineer · idle</p>
          </div>
        </div>
      </div>
      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-faint text-sm">
        system idle — press any key to resume
      </p>
    </div>
  );
}
