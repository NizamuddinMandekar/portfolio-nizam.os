# NIZAM.OS — Terminal Portfolio

> The interactive terminal-OS portfolio of **Nizamuddin Mandekar**, AI Engineer.

**Live: https://nizamuddinmandekar.github.io/nizam.os/**

![NIZAM.OS preview](public/og.png)

Boot the OS, log in as root, and explore my work the way engineers do — through a shell.

## Try these commands

| Command | What it does |
|---|---|
| `help` | list everything |
| `about` / `projects` / `experience` / `skills` / `research` | my work, rendered as terminal output |
| `chat` | talk to **NIZ.AI**, a simulated me |
| `open askallen` | jump straight to a live project |
| `theme cyan` | switch the phosphor color (green / cyan / amber) |
| `snake` | yes, it's playable |
| `matrix` | follow the white rabbit |
| `sudo hire-me` | 🔓 |

There's also a Konami code. You know what to do.

## Stack

- **React 18 + TypeScript + Vite** — no template, every component handwritten
- **Tailwind CSS v4** — CRT theme with scanlines, vignette, phosphor glow
- **Framer Motion** — window/boot animations
- **Canvas** — matrix rain background
- **WebAudio** — synthesized key clicks (no audio files)
- **PWA** — installable, works offline
- Deployed via **GitHub Actions → GitHub Pages**

## Run locally

```bash
npm install
npm run dev
```

## Optional: make NIZ.AI a real LLM

By default `chat` uses local rules. To upgrade it to a live model:

1. Deploy `worker/chat-proxy.js` to Cloudflare Workers (free) — instructions are in the file
2. Build with `VITE_CHAT_PROXY=https://your-worker.workers.dev`

The client automatically falls back to local rules if the proxy is unreachable.

## Optional: custom domain

1. Buy a domain (e.g. from Namecheap/GoDaddy/Cloudflare, ~₹800/yr)
2. Repo **Settings → Pages → Custom domain** → enter it (GitHub creates the CNAME)
3. At your DNS provider, add a `CNAME` record pointing `www` (or an `ALIAS`/`A` for apex) to `nizamuddinmandekar.github.io`
4. Update the OG/canonical URLs in `index.html`

## About me

AI Engineer — LLM applications, RAG systems, published AI research.

- 📧 nizamuddin.mandekar@gmail.com
- 💼 [linkedin.com/in/nizamuddinmandekar](https://linkedin.com/in/nizamuddinmandekar)
- 🐙 [github.com/NizamuddinMandekar](https://github.com/NizamuddinMandekar)
