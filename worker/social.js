/**
 * NIZAM.OS social worker — guestbook + live presence.
 * Deploy: npx wrangler deploy --config worker/wrangler-social.jsonc
 */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const MAX_ENTRIES = 50;

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    const url = new URL(request.url);

    // ── guestbook ──
    if (url.pathname === "/guestbook" && request.method === "GET") {
      const entries = JSON.parse((await env.SOCIAL.get("entries")) || "[]");
      return json({ entries: entries.slice(0, 20) });
    }

    if (url.pathname === "/sign" && request.method === "POST") {
      try {
        const { message } = await request.json();
        const clean = String(message || "").trim().slice(0, 140);
        if (clean.length < 2) return json({ ok: false, error: "message too short" });

        const entries = JSON.parse((await env.SOCIAL.get("entries")) || "[]");
        entries.unshift({ m: clean, t: Date.now() });
        await env.SOCIAL.put("entries", JSON.stringify(entries.slice(0, MAX_ENTRIES)));
        return json({ ok: true });
      } catch {
        return json({ ok: false }, 400);
      }
    }

    // ── presence ──
    if (url.pathname === "/presence" && request.method === "POST") {
      try {
        const { id } = await request.json();
        const key = `p:${String(id || "").slice(0, 40)}`;
        await env.SOCIAL.put(key, "1", { expirationTtl: 300 });
        const list = await env.SOCIAL.list({ prefix: "p:" });
        return json({ online: list.keys.length });
      } catch {
        return json({ online: 1 });
      }
    }

    return new Response("NIZAM.OS social", { headers: CORS });
  },
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}
