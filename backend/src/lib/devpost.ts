const ROLE_KEYWORDS: Record<string, string[]> = {
  frontend: [
    "react", "next.js", "nextjs", "typescript", "javascript", "tailwind",
    "vue", "svelte", "webgpu", "webgl", "framer", "css", "ui", "component",
    "design-system", "vercel", "vite", "shadcn",
  ],
  ml: [
    "pytorch", "tensorflow", "python", "transformers", "llm", "gpt",
    "langchain", "rag", "embeddings", "neural", "bert", "huggingface",
    "scikit", "numpy", "pandas", "inference", "fine-tuning", "eval",
    "machine-learning", "computer-vision", "nlp",
  ],
  designer: [
    "figma", "sketch", "framer", "design", "prototype", "typography",
    "ux", "brand", "illustration", "animation", "motion", "blender",
  ],
};

export type DevpostProject = {
  id: number;
  title: string;
  tagline: string;
  url: string;
  builtWith: string[];
  memberNames: string[];
  likeCount: number;
};

type RawProject = {
  id: number;
  title: string;
  tagline?: string;
  url: string;
  built_with?: string[];
  member_names?: string[];
  like_count?: number;
};

export function scoreAgainstRole(project: DevpostProject, roleId: string): number {
  const keywords = ROLE_KEYWORDS[roleId] ?? [];
  if (keywords.length === 0) return 0;

  const haystack = [
    project.title,
    project.tagline,
    ...project.builtWith,
  ].join(" ").toLowerCase();

  const hits = keywords.filter((kw) => haystack.includes(kw)).length;
  // Scale so a 1/3 keyword hit → ~67%; cap at 100
  return Math.min(100, Math.round((hits / keywords.length) * 300));
}

export async function fetchRecentSubmissions(query: string): Promise<DevpostProject[]> {
  const url = `https://devpost.com/software/search.json?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": process.env.DEVPOST_USER_AGENT ?? "sniper-bot/0.1",
      Accept: "application/json",
    },
  });

  if (!res.ok) throw new Error(`Devpost responded ${res.status} for query "${query}"`);

  const json = (await res.json()) as { software: RawProject[] };
  return (json.software ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    tagline: p.tagline ?? "",
    url: p.url,
    builtWith: p.built_with ?? [],
    memberNames: p.member_names ?? [],
    likeCount: p.like_count ?? 0,
  }));
}
