import { useEffect, useState } from "react";
import TypeWriter from "./TypeWriter";
import { aiReply } from "../terminal/chat";

/**
 * Optional live-LLM mode: set VITE_CHAT_PROXY at build time to the URL of a
 * proxy (see worker/chat-proxy.js) and NIZ.AI answers with a real model.
 * Without it — or if the proxy fails — it falls back to the local rules.
 */
const PROXY = import.meta.env.VITE_CHAT_PROXY as string | undefined;

export default function AIReply({ message }: { message: string }) {
  const [text, setText] = useState<string | null>(PROXY ? null : aiReply(message));

  useEffect(() => {
    if (!PROXY) return;
    let alive = true;
    const timeout = setTimeout(() => alive && setText(aiReply(message)), 8000);
    fetch(PROXY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (alive) setText(typeof d.reply === "string" ? d.reply : aiReply(message));
      })
      .catch(() => alive && setText(aiReply(message)))
      .finally(() => clearTimeout(timeout));
    return () => {
      alive = false;
      clearTimeout(timeout);
    };
  }, [message]);

  if (text === null) {
    return (
      <span className="text-faint">
        thinking… <span className="cursor-block" />
      </span>
    );
  }
  return <TypeWriter text={text} />;
}
