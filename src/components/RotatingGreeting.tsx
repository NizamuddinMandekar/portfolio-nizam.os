import { useEffect, useState } from "react";

const GREETINGS = [
  "Welcome.",
  "स्वागत आहे.", // Marathi
  "स्वागत है.", // Hindi
  "خوش آمدید.", // Urdu
];

export default function RotatingGreeting() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % GREETINGS.length);
        setFading(false);
      }, 200);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`text-cyanx inline-block min-w-[7.5rem] transition-opacity duration-200 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      {GREETINGS[index]}
    </span>
  );
}
