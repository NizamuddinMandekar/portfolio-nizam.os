// Tiny virtual filesystem for ls / cd / cat / pwd.
import { experience, profile, projects, publications } from "../data/portfolio";
import { posts } from "../data/posts";

type VNode = { type: "dir"; children: Record<string, VNode> } | { type: "file"; content: string };

const file = (content: string): VNode => ({ type: "file", content });
const dir = (children: Record<string, VNode>): VNode => ({ type: "dir", children });

function projectFile(i: number): string {
  const p = projects[i];
  return [
    `# ${p.title} ${p.subtitle}`,
    "",
    p.description,
    "",
    `tags: ${p.tags.join(", ")}`,
    p.link ? `live: ${p.link}` : "",
    p.github ? `source: ${p.github}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export const ROOT: VNode = dir({
  "about.txt": file(`${profile.name} ${profile.role}\n\n${profile.summary}`),
  "contact.txt": file(
    `email: ${profile.email}\nphone: ${profile.phone}\ngithub: ${profile.github}\nlinkedin: ${profile.linkedin}\nlocation: ${profile.location}`
  ),
  projects: dir(
    Object.fromEntries(
      projects.map((p, i) => [
        p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".md",
        file(projectFile(i)),
      ])
    )
  ),
  research: dir(
    Object.fromEntries(
      publications.map((pub) => [
        pub.title.toLowerCase().slice(0, 24).replace(/[^a-z0-9]+/g, "-") + ".md",
        file(`# ${pub.title} (${pub.year})\n\n${pub.journal}\nDOI: ${pub.doi}`),
      ])
    )
  ),
  work: dir(
    Object.fromEntries(
      experience.map((job) => [
        job.company.toLowerCase().split(" ")[0] + ".md",
        file(
          `# ${job.role} @ ${job.company}\n${job.period}\n\n${job.points.map((pt) => "- " + pt).join("\n")}\n\nstack: ${job.tech.join(", ")}`
        ),
      ])
    )
  ),
  blog: dir(
    Object.fromEntries(
      posts.map((p) => [p.slug + ".md", file(`# ${p.title}\n${p.date} · ${p.minutes} min\n\n${p.body.join("\n\n")}`)])
    )
  ),
});

let cwd: string[] = [];

export function pwd(): string {
  return "~" + (cwd.length ? "/" + cwd.join("/") : "");
}

function nodeAt(path: string[]): VNode | null {
  let node: VNode = ROOT;
  for (const seg of path) {
    if (node.type !== "dir" || !node.children[seg]) return null;
    node = node.children[seg];
  }
  return node;
}

export function ls(): { dirs: string[]; files: string[] } | null {
  const node = nodeAt(cwd);
  if (!node || node.type !== "dir") return null;
  const dirs: string[] = [];
  const files: string[] = [];
  for (const [name, child] of Object.entries(node.children)) {
    (child.type === "dir" ? dirs : files).push(name);
  }
  return { dirs: dirs.sort(), files: files.sort() };
}

export function cd(target: string): string | null {
  if (!target || target === "~" || target === "/") {
    cwd = [];
    return null;
  }
  if (target === "..") {
    cwd.pop();
    return null;
  }
  const clean = target.replace(/\/+$/, "");
  const node = nodeAt([...cwd, clean]);
  if (!node) return `cd: no such directory: ${target}`;
  if (node.type !== "dir") return `cd: not a directory: ${target}`;
  cwd.push(clean);
  return null;
}

export function cat(name: string): { error?: string; content?: string } {
  if (!name) return { error: "cat: missing file name" };
  const node = nodeAt([...cwd, name]);
  if (!node) return { error: `cat: no such file: ${name}` };
  if (node.type !== "file") return { error: `cat: ${name} is a directory` };
  return { content: node.content };
}
