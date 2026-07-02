const SOCIAL_URL = "https://nizamos-social.nizamos.workers.dev";

export interface GuestEntry {
  m: string;
  t: number;
}

export async function signGuestbook(message: string): Promise<boolean> {
  try {
    const r = await fetch(`${SOCIAL_URL}/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const d = await r.json();
    return !!d.ok;
  } catch {
    return false;
  }
}

export async function fetchGuestbook(): Promise<GuestEntry[] | null> {
  try {
    const r = await fetch(`${SOCIAL_URL}/guestbook`);
    const d = await r.json();
    return Array.isArray(d.entries) ? d.entries : [];
  } catch {
    return null;
  }
}

let sessionId: string | null = null;

export async function heartbeat(): Promise<number | null> {
  if (!sessionId) {
    sessionId = sessionStorage.getItem("nizamos-sid");
    if (!sessionId) {
      sessionId = Math.random().toString(36).slice(2, 12);
      sessionStorage.setItem("nizamos-sid", sessionId);
    }
  }
  try {
    const r = await fetch(`${SOCIAL_URL}/presence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: sessionId }),
    });
    const d = await r.json();
    return typeof d.online === "number" ? d.online : null;
  } catch {
    return null;
  }
}
