import { useEffect, useState } from "react";

const USER = "NizamuddinMandekar";

interface Stats {
  repos: number;
  followers: number;
  stars: number;
  langs: [string, number][];
}

function Bar({ value, max }: { value: number; max: number }) {
  const width = Math.max(1, Math.round((value / Math.max(max, 1)) * 24));
  return <span className="text-phos">{"█".repeat(width)}</span>;
}

export default function GitHubStats() {
  const [stats, setStats] = useState<Stats | null | "error">(null);

  useEffect(() => {
    const cached = sessionStorage.getItem("nizamos-ghstats");
    if (cached) {
      setStats(JSON.parse(cached));
      return;
    }
    Promise.all([
      fetch(`https://api.github.com/users/${USER}`).then((r) => r.json()),
      fetch(`https://api.github.com/users/${USER}/repos?per_page=100`).then((r) => r.json()),
    ])
      .then(([user, repos]) => {
        if (!Array.isArray(repos)) throw new Error("rate limited");
        const langCount: Record<string, number> = {};
        let stars = 0;
        for (const r of repos) {
          stars += r.stargazers_count || 0;
          if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
        }
        const s: Stats = {
          repos: user.public_repos ?? repos.length,
          followers: user.followers ?? 0,
          stars,
          langs: Object.entries(langCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5),
        };
        sessionStorage.setItem("nizamos-ghstats", JSON.stringify(s));
        setStats(s);
      })
      .catch(() => setStats("error"));
  }, []);

  if (stats === null) {
    return (
      <span className="text-faint">
        querying api.github.com… <span className="cursor-block" />
      </span>
    );
  }
  if (stats === "error") {
    return (
      <span className="text-alert">
        github api unreachable (rate limit?) — try github.com/{USER} directly
      </span>
    );
  }

  const maxLang = stats.langs[0]?.[1] ?? 1;
  return (
    <div className="space-y-1">
      <div className="text-faint">live from api.github.com/{USER}:</div>
      <div>
        public repos: <span className="text-cyanx">{stats.repos}</span> · followers:{" "}
        <span className="text-cyanx">{stats.followers}</span> · total stars:{" "}
        <span className="text-cyanx">{stats.stars}</span>
      </div>
      <div className="pt-1">
        {stats.langs.map(([lang, count]) => (
          <div key={lang} className="flex gap-2">
            <span className="text-phos-dim w-24 shrink-0">{lang.padEnd(12)}</span>
            <Bar value={count} max={maxLang} />
            <span className="text-faint">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
