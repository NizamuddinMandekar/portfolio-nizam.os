import { useEffect, useState } from "react";
import { fetchGuestbook, signGuestbook, type GuestEntry } from "../terminal/social";

export function SignResult({ message }: { message: string }) {
  const [state, setState] = useState<"sending" | "ok" | "fail">("sending");

  useEffect(() => {
    signGuestbook(message).then((ok) => setState(ok ? "ok" : "fail"));
  }, [message]);

  if (state === "sending")
    return (
      <span className="text-faint">
        writing to guestbook… <span className="cursor-block" />
      </span>
    );
  if (state === "fail")
    return <span className="text-alert">guestbook unreachable — try again later.</span>;
  return (
    <span>
      <span className="text-phos glow">signed.</span>{" "}
      <span className="text-faint">
        your message is now part of NIZAM.OS history. type{" "}
        <span className="text-cyanx">guestbook</span> to see it.
      </span>
    </span>
  );
}

export function GuestbookList() {
  const [entries, setEntries] = useState<GuestEntry[] | null | "error">(null);

  useEffect(() => {
    fetchGuestbook().then((e) => setEntries(e === null ? "error" : e));
  }, []);

  if (entries === null)
    return (
      <span className="text-faint">
        reading guestbook… <span className="cursor-block" />
      </span>
    );
  if (entries === "error")
    return <span className="text-alert">guestbook unreachable — try again later.</span>;
  if (entries.length === 0)
    return (
      <span className="text-faint">
        the guestbook is empty. be the first: <span className="text-cyanx">sign &lt;message&gt;</span>
      </span>
    );

  return (
    <div className="space-y-1.5">
      <div className="text-faint">// visitors who signed NIZAM.OS</div>
      {entries.map((e, i) => (
        <div key={i} className="flex gap-3">
          <span className="text-faint shrink-0 text-sm">
            {new Date(e.t).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
          </span>
          <span className="text-phos-dim">{e.m}</span>
        </div>
      ))}
    </div>
  );
}
