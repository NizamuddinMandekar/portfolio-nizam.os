import { useEffect, useRef } from "react";

const GLYPHS = "01アイウエオカキクケコサシスセソタチツ<>[]{}$#@%&*+=?";

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const takeover = useRef(false);
  const surgeAt = useRef(0);

  // commands make the rain surge briefly, like the system is computing
  useEffect(() => {
    const onActivity = () => {
      surgeAt.current = performance.now();
    };
    window.addEventListener("nizamos:activity", onActivity);
    return () => window.removeEventListener("nizamos:activity", onActivity);
  }, []);

  useEffect(() => {
    const onTakeover = () => {
      takeover.current = true;
      canvasRef.current?.classList.remove("opacity-50");
      canvasRef.current?.classList.add("opacity-100", "z-[60]");
      setTimeout(() => {
        takeover.current = false;
        canvasRef.current?.classList.add("opacity-50");
        canvasRef.current?.classList.remove("opacity-100", "z-[60]");
      }, 6000);
    };
    window.addEventListener("nizamos:matrix", onTakeover);
    return () => window.removeEventListener("nizamos:matrix", onTakeover);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let cols = 0;
    let drops: number[] = [];
    const fontSize = 14;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width / fontSize);
      drops = Array(cols)
        .fill(0)
        .map(() => Math.floor(Math.random() * (canvas.height / fontSize)));
    };
    resize();
    window.addEventListener("resize", resize);

    let last = 0;
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      const surging = t - surgeAt.current < 800;
      if (t - last < (takeover.current ? 25 : surging ? 22 : 33)) return;
      last = t;

      ctx.fillStyle = "rgba(3, 7, 9, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      const theme = document.documentElement.dataset.theme;
      const alpha = surging ? "0.5" : "0.34";
      const body =
        theme === "cyan" ? `rgba(53,216,255,${alpha})`
        : theme === "amber" ? `rgba(255,179,71,${alpha})`
        : `rgba(46,232,138,${alpha})`;
      const spark =
        theme === "amber" ? "rgba(56,225,255,0.5)" : "rgba(255,200,87,0.5)";

      for (let i = 0; i < cols; i++) {
        const char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        ctx.fillStyle = Math.random() > 0.96 ? spark : body;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    if (!reduce) {
      raf = requestAnimationFrame(draw);
    } else {
      // static faint frame for reduced motion
      ctx.fillStyle = "rgba(4, 7, 10, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 opacity-50 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
}
