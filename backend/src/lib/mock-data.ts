// Mock data for the API shell. Mirrors frontend/src/lib/mock-data.ts shape.
// Replace with Supabase queries once schema is live.

export type RoleId = "frontend" | "ml" | "designer";

export type Role = {
  id: RoleId;
  title: string;
  team: string;
  candidatesInPipeline: number;
  gemsFlagged: number;
  oasOut: number;
  description: string;
};

export type Candidate = {
  id: string;
  roleId: RoleId;
  name: string;
  handle: string;
  source: "Devpost" | "GitHub" | "Direct";
  oaScore: number;
  devpostScore: number;
  githubScore: number;
  oaStatus: "Pending" | "In Progress" | "Submitted" | "Graded";
  isGem: boolean;
  topProject: { name: string; hackathon: string };
  submittedAt: string;
};

export const mockRoles: Role[] = [
  {
    id: "frontend",
    title: "Senior Frontend Engineer",
    team: "Platform",
    candidatesInPipeline: 12,
    gemsFlagged: 2,
    oasOut: 7,
    description: "React 18+, design-systems experience, hackathon-trained.",
  },
  {
    id: "ml",
    title: "ML Engineer",
    team: "Models",
    candidatesInPipeline: 9,
    gemsFlagged: 1,
    oasOut: 4,
    description: "PyTorch, applied research, ships evals.",
  },
  {
    id: "designer",
    title: "Product Designer",
    team: "Design",
    candidatesInPipeline: 6,
    gemsFlagged: 0,
    oasOut: 2,
    description: "Hackathon designers who can ship Figma + prototype before judging.",
  },
];

export const mockCandidates: Candidate[] = [
  {
    id: "cand_01",
    roleId: "frontend",
    name: "Sarah Khan",
    handle: "sarahk",
    source: "Devpost",
    oaScore: 0.94,
    devpostScore: 0.92,
    githubScore: 0.71,
    oaStatus: "Graded",
    isGem: true,
    topProject: { name: "NeuralCanvas", hackathon: "HackMIT 2025" },
    submittedAt: "2026-05-09T18:42:00Z",
  },
  {
    id: "cand_06",
    roleId: "ml",
    name: "Mateo Ferreira",
    handle: "mferreira",
    source: "Devpost",
    oaScore: 0.89,
    devpostScore: 0.93,
    githubScore: 0.78,
    oaStatus: "Graded",
    isGem: true,
    topProject: { name: "EvalGuard", hackathon: "HackTX 2025" },
    submittedAt: "2026-05-09T19:21:00Z",
  },
  {
    id: "cand_03",
    roleId: "frontend",
    name: "Priya Raman",
    handle: "praman",
    source: "GitHub",
    oaScore: 0.76,
    devpostScore: 0.55,
    githubScore: 0.91,
    oaStatus: "Submitted",
    isGem: false,
    topProject: { name: "shadcn-charts", hackathon: "PennApps 2025" },
    submittedAt: "2026-05-09T14:02:00Z",
  },
];
