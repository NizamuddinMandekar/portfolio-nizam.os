import { useEffect, useRef, useState } from "react";

const COLS = 26;
const ROWS = 12;
const TICK_MS = 130;

type Point = { x: number; y: number };

function randFood(snake: Point[]): Point {
  while (true) {
    const p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    if (!snake.some((s) => s.x === p.x && s.y === p.y)) return p;
  }
}

export default function Snake() {
  const [, setTickCount] = useState(0); // re-render driver
  const [phase, setPhase] = useState<"playing" | "over" | "quit">("playing");
  const [score, setScore] = useState(0);

  const snake = useRef<Point[]>([
    { x: 8, y: 6 },
    { x: 7, y: 6 },
    { x: 6, y: 6 },
  ]);
  const dir = useRef<Point>({ x: 1, y: 0 });
  const nextDir = useRef<Point>({ x: 1, y: 0 });
  const food = useRef<Point>(randFood(snake.current));
  const boxRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const restart = () => {
    snake.current = [
      { x: 8, y: 6 },
      { x: 7, y: 6 },
      { x: 6, y: 6 },
    ];
    dir.current = { x: 1, y: 0 };
    nextDir.current = { x: 1, y: 0 };
    food.current = randFood(snake.current);
    setScore(0);
    setPhase("playing");
    boxRef.current?.focus();
  };

  const quit = () => {
    setPhase("quit");
    window.dispatchEvent(new CustomEvent("nizamos:focus-input"));
  };

  useEffect(() => {
    boxRef.current?.focus();
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    const interval = setInterval(() => {
      dir.current = nextDir.current;
      const head = snake.current[0];
      const nh = { x: head.x + dir.current.x, y: head.y + dir.current.y };

      const hitWall = nh.x < 0 || nh.x >= COLS || nh.y < 0 || nh.y >= ROWS;
      const hitSelf = snake.current.some((s) => s.x === nh.x && s.y === nh.y);
      if (hitWall || hitSelf) {
        setPhase("over");
        return;
      }

      snake.current = [nh, ...snake.current];
      if (nh.x === food.current.x && nh.y === food.current.y) {
        setScore((s) => s + 10);
        food.current = randFood(snake.current);
      } else {
        snake.current.pop();
      }
      setTickCount((t) => t + 1);
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [phase]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const d = dir.current;
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        if (d.y === 0) nextDir.current = { x: 0, y: -1 };
        break;
      case "ArrowDown":
        e.preventDefault();
        if (d.y === 0) nextDir.current = { x: 0, y: 1 };
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (d.x === 0) nextDir.current = { x: -1, y: 0 };
        break;
      case "ArrowRight":
        e.preventDefault();
        if (d.x === 0) nextDir.current = { x: 1, y: 0 };
        break;
      case "r":
        if (phaseRef.current === "over") restart();
        break;
      case "q":
      case "Escape":
        e.preventDefault();
        quit();
        break;
    }
  };

  if (phase === "quit") {
    return (
      <div className="text-faint">
        snake exited · final score: <span className="text-cyanx">{score}</span> · thanks for playing
      </div>
    );
  }

  // render board as text
  const rows: string[] = [];
  for (let y = 0; y < ROWS; y++) {
    let row = "";
    for (let x = 0; x < COLS; x++) {
      const isHead = snake.current[0].x === x && snake.current[0].y === y;
      const isBody = snake.current.some((s, i) => i > 0 && s.x === x && s.y === y);
      const isFood = food.current.x === x && food.current.y === y;
      row += isHead ? "█" : isBody ? "▓" : isFood ? "◆" : "·";
    }
    rows.push(row);
  }

  return (
    <div
      ref={boxRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="outline-none inline-block border border-linex p-3 focus:border-phos/50"
      aria-label="Snake game. Use arrow keys to steer, q to quit."
    >
      <div className="flex justify-between text-sm mb-2">
        <span className="text-phos glow">SNAKE.EXE</span>
        <span className="text-cyanx">score: {score}</span>
      </div>
      <pre className="leading-[1.05] text-[13px] sm:text-sm select-none">
        {rows.map((r, i) => (
          <div key={i}>
            {r.split("").map((c, j) => (
              <span
                key={j}
                className={
                  c === "█" ? "text-phos glow"
                  : c === "▓" ? "text-phos-dim"
                  : c === "◆" ? "text-amberx"
                  : "text-faint/30"
                }
              >
                {c}
              </span>
            ))}
          </div>
        ))}
      </pre>
      <p className="text-sm text-faint mt-2">
        {phase === "over" ? (
          <span>
            <span className="text-alert">game over</span> · press <span className="text-phos">r</span> to
            restart · <span className="text-phos">q</span> to quit
          </span>
        ) : (
          <span>arrows to steer · q to quit</span>
        )}
      </p>
    </div>
  );
}
