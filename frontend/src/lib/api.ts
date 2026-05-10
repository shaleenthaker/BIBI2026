import type {
  Candidate,
  CandidateSource,
  OAQuestion,
  OAStatus,
  Role,
  RoleId,
} from "./mock-data";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

// ── Raw API shapes ────────────────────────────────────────────────────────────

export type ApiRole = {
  id: string;
  title: string;
  team: string;
  description: string;
  candidatesInPipeline: number;
  gemsFlagged: number;
  oasOut: number;
  lastActivityAt: string | null;
};

export type ApiCandidate = {
  id: string;
  roleId: string;
  name: string;
  handle: string;
  avatarSeed: string;
  source: string;
  oaScore: number;
  devpostScore: number;
  githubScore: number;
  oaStatus: string;
  isGem: boolean;
  signals: { wins?: number; stackMatch?: number; commitFrequency?: number; starsNormalized?: number } | null;
  topProject: { name?: string; hackathon?: string; url?: string } | null;
  whyExplainer: string;
  oaResponseUrl: string;
  submittedAt: string | null;
};

// Questions come back snake_case from the OA route (raw Supabase row)
export type ApiOAQuestion = {
  id: string;
  type: "multiple-choice" | "free-response";
  prompt: string;
  choices: string[] | null;
  correct_index: number | null;
  personalized_from: string | null;
  placeholder: string | null;
  sort_order: number;
};

export type ApiOAData = {
  token: string;
  candidate: { id: string; name: string; role_id: string; top_project: { name?: string } | null };
  questions: ApiOAQuestion[];
};

// ── Helpers ───────────────────────────────────────────────────────────────────

export function relativeTime(iso: string | null): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 90) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} d ago`;
}

// ── Converters ────────────────────────────────────────────────────────────────

export function apiRoleToRole(r: ApiRole): Role {
  return {
    id: r.id as RoleId,
    title: r.title,
    team: r.team,
    description: r.description,
    candidatesInPipeline: r.candidatesInPipeline,
    gemsFlagged: r.gemsFlagged,
    oasOut: r.oasOut,
    lastActivity: relativeTime(r.lastActivityAt),
  };
}

export function apiCandidateToCandidate(r: ApiCandidate): Candidate {
  return {
    id: r.id,
    roleId: r.roleId as RoleId,
    name: r.name,
    handle: r.handle,
    avatarSeed: r.avatarSeed,
    source: (r.source as CandidateSource) ?? "Direct",
    oaScore: r.oaScore,
    devpostScore: r.devpostScore,
    githubScore: r.githubScore,
    oaStatus: (r.oaStatus as OAStatus) ?? "Pending",
    isGem: Boolean(r.isGem),
    signals: {
      wins: r.signals?.wins ?? 0,
      stackMatch: r.signals?.stackMatch ?? 0,
      commitFrequency: r.signals?.commitFrequency ?? 0,
      starsNormalized: r.signals?.starsNormalized ?? 0,
    },
    topProject: {
      name: r.topProject?.name ?? "",
      hackathon: r.topProject?.hackathon ?? "",
      url: r.topProject?.url ?? "#",
    },
    whyExplainer: r.whyExplainer,
    oaResponseUrl: r.oaResponseUrl || "#",
    submittedAt: r.submittedAt ?? new Date().toISOString(),
  };
}

export function apiOAQuestionToOAQuestion(q: ApiOAQuestion): OAQuestion {
  if (q.type === "multiple-choice") {
    return {
      id: q.id,
      type: "multiple-choice",
      prompt: q.prompt,
      choices: q.choices ?? [],
      correctIndex: q.correct_index ?? 0,
    };
  }
  return {
    id: q.id,
    type: "free-response",
    prompt: q.prompt,
    personalizedFrom: q.personalized_from ?? "your project",
    placeholder:
      q.placeholder ??
      "Be specific about the constraint, the choice, and what you learned. 4–8 sentences is plenty.",
  };
}

// ── Fetch functions with graceful mock fallback ──────────────────────────────
//
// When the backend is unreachable (Supabase not set up locally, server down,
// or running on a static deploy), we transparently fall back to mock-data and
// flip the "demo mode" flag so the UI can show a small banner. This keeps the
// project running end-to-end without env vars.

import {
  mockRoles,
  mockCandidates,
  mockOAQuestions,
} from "./mock-data";

const DEMO_FLAG_KEY = "sniper.demoMode";

export function isDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(DEMO_FLAG_KEY) === "1";
  } catch {
    return false;
  }
}

function flagDemo() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(DEMO_FLAG_KEY, "1");
    window.dispatchEvent(new Event("sniper.demoMode"));
  } catch {
    // ignore
  }
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

async function tryOr<T>(real: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await real();
  } catch {
    flagDemo();
    return fallback();
  }
}

export async function fetchRoles(): Promise<Role[]> {
  return tryOr(
    async () => {
      const json = await get<{ data: ApiRole[] }>("/api/roles");
      return json.data.map(apiRoleToRole);
    },
    () => mockRoles,
  );
}

export async function fetchCandidates(roleId?: string): Promise<Candidate[]> {
  return tryOr(
    async () => {
      const qs = roleId ? `?roleId=${encodeURIComponent(roleId)}` : "";
      const json = await get<{ data: ApiCandidate[] }>(`/api/candidates${qs}`);
      return json.data.map(apiCandidateToCandidate);
    },
    () => (roleId ? mockCandidates.filter((c) => c.roleId === roleId) : mockCandidates),
  );
}

export async function fetchGems(): Promise<Candidate[]> {
  return tryOr(
    async () => {
      const json = await get<{ data: ApiCandidate[] }>("/api/gems");
      return json.data.map(apiCandidateToCandidate);
    },
    () => mockCandidates.filter((c) => c.isGem),
  );
}

export async function fetchOA(token: string): Promise<ApiOAData> {
  return tryOr(
    async () => {
      const json = await get<{ data: ApiOAData }>(`/api/oa/${token}`);
      return json.data;
    },
    () => ({
      token,
      candidate: {
        id: "cand_01",
        name: "Maya Ostrowski",
        role_id: "frontend",
        top_project: { name: "NeuralCanvas" },
      },
      questions: mockOAQuestions.map((q, i) => {
        if (q.type === "multiple-choice") {
          return {
            id: q.id,
            type: "multiple-choice" as const,
            prompt: q.prompt,
            choices: q.choices,
            correct_index: q.correctIndex,
            personalized_from: null,
            placeholder: null,
            sort_order: i,
          };
        }
        return {
          id: q.id,
          type: "free-response" as const,
          prompt: q.prompt,
          choices: null,
          correct_index: null,
          personalized_from: q.personalizedFrom,
          placeholder: q.placeholder,
          sort_order: i,
        };
      }),
    }),
  );
}

export async function submitOA(
  token: string,
  responses: { questionId: string; answer: string }[],
): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/api/oa/${token}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responses }),
    });
    if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
  } catch {
    // In demo mode, treat submit as success so the flow completes.
    flagDemo();
  }
}
