// Mock data for the Sniper UI shell. Swappable for Supabase queries later.
// Design language reference: design-system/MASTER.md

export type RoleId = "frontend" | "ml" | "designer";

export type Role = {
  id: RoleId;
  title: string;
  team: string;
  candidatesInPipeline: number;
  gemsFlagged: number;
  oasOut: number;
  lastActivity: string;
  description: string;
};

export type CandidateSource = "Devpost" | "GitHub" | "Direct";
export type OAStatus = "Pending" | "In Progress" | "Submitted" | "Graded";

export type CandidateSignals = {
  wins: number;
  stackMatch: number; // 0-1
  commitFrequency: number; // 0-1, normalized
  starsNormalized: number; // 0-1
};

export type Candidate = {
  id: string;
  roleId: RoleId;
  name: string;
  handle: string;
  avatarSeed: string;
  source: CandidateSource;
  oaScore: number; // 0-1
  devpostScore: number; // 0-1
  githubScore: number; // 0-1
  oaStatus: OAStatus;
  isGem: boolean;
  signals: CandidateSignals;
  topProject: { name: string; hackathon: string; url: string };
  whyExplainer: string;
  oaResponseUrl: string;
  submittedAt: string;
};

export type DevpostFeedItem = {
  id: string;
  candidate: string;
  project: string;
  hackathon: string;
  matchPct: number;
  role: string;
  receivedAt: string;
};

export type OAQuestion =
  | {
      id: string;
      type: "multiple-choice";
      prompt: string;
      choices: string[];
      correctIndex: number;
    }
  | {
      id: string;
      type: "free-response";
      prompt: string;
      personalizedFrom: string;
      placeholder: string;
    };

export const mockRecruiter = {
  id: "rec_01",
  name: "Maya Chen",
  email: "maya@sniper.dev",
  workspace: "Acme Talent",
  initials: "MC",
};

export const mockRoles: Role[] = [
  {
    id: "frontend",
    title: "Senior Frontend Engineer",
    team: "Platform",
    candidatesInPipeline: 12,
    gemsFlagged: 2,
    oasOut: 7,
    lastActivity: "2 min ago",
    description:
      "React 18+, design-systems experience, ships fast. Hackathon-trained, not bootcamp-trained.",
  },
  {
    id: "ml",
    title: "ML Engineer",
    team: "Models",
    candidatesInPipeline: 9,
    gemsFlagged: 1,
    oasOut: 4,
    lastActivity: "14 min ago",
    description:
      "PyTorch, applied research, comfortable shipping evals. We weight Devpost ML wins heavily.",
  },
  {
    id: "designer",
    title: "Product Designer",
    team: "Design",
    candidatesInPipeline: 6,
    gemsFlagged: 0,
    oasOut: 2,
    lastActivity: "1 hr ago",
    description:
      "Hackathon designers who can ship a Figma file *and* a prototype before judging.",
  },
];

export const mockCandidates: Candidate[] = [
  // Frontend role
  {
    id: "cand_01",
    roleId: "frontend",
    name: "Sarah Khan",
    handle: "sarahk",
    avatarSeed: "sarahk",
    source: "Devpost",
    oaScore: 0.94,
    devpostScore: 0.92,
    githubScore: 0.71,
    oaStatus: "Graded",
    isGem: true,
    signals: { wins: 3, stackMatch: 0.97, commitFrequency: 0.62, starsNormalized: 0.55 },
    topProject: { name: "NeuralCanvas", hackathon: "HackMIT 2025", url: "#" },
    whyExplainer:
      "94% OA score with the highest free-response answer this week. NeuralCanvas (HackMIT 1st place, Frontend track) used React 19 + WebGPU — exact stack match.",
    oaResponseUrl: "#",
    submittedAt: "2026-05-09T18:42:00Z",
  },
  {
    id: "cand_02",
    roleId: "frontend",
    name: "Diego Alvarez",
    handle: "dalvarez",
    avatarSeed: "dalvarez",
    source: "Devpost",
    oaScore: 0.81,
    devpostScore: 0.88,
    githubScore: 0.62,
    oaStatus: "Submitted",
    isGem: false,
    signals: { wins: 2, stackMatch: 0.84, commitFrequency: 0.71, starsNormalized: 0.34 },
    topProject: { name: "InboxZero", hackathon: "TreeHacks 2026", url: "#" },
    whyExplainer:
      "Two TreeHacks wins, ships under deadline pressure. Stack match strong on React + Tailwind.",
    oaResponseUrl: "#",
    submittedAt: "2026-05-09T16:11:00Z",
  },
  {
    id: "cand_03",
    roleId: "frontend",
    name: "Priya Raman",
    handle: "praman",
    avatarSeed: "praman",
    source: "GitHub",
    oaScore: 0.76,
    devpostScore: 0.55,
    githubScore: 0.91,
    oaStatus: "Submitted",
    isGem: false,
    signals: { wins: 0, stackMatch: 0.78, commitFrequency: 0.94, starsNormalized: 0.88 },
    topProject: { name: "shadcn-charts", hackathon: "PennApps 2025", url: "#" },
    whyExplainer:
      "Maintains a popular OSS chart library — exceptional commit cadence and stars. Lower hackathon presence but the OSS depth compensates.",
    oaResponseUrl: "#",
    submittedAt: "2026-05-09T14:02:00Z",
  },
  {
    id: "cand_04",
    roleId: "frontend",
    name: "Ben Walters",
    handle: "bwalters",
    avatarSeed: "bwalters",
    source: "Devpost",
    oaScore: 0.62,
    devpostScore: 0.74,
    githubScore: 0.4,
    oaStatus: "In Progress",
    isGem: false,
    signals: { wins: 1, stackMatch: 0.71, commitFrequency: 0.42, starsNormalized: 0.21 },
    topProject: { name: "Lapse", hackathon: "Calhacks 2025", url: "#" },
    whyExplainer:
      "Solid hackathon design execution. Mid-pack on engineering signals — worth watching the OA for free-response depth.",
    oaResponseUrl: "#",
    submittedAt: "2026-05-09T11:55:00Z",
  },
  {
    id: "cand_05",
    roleId: "frontend",
    name: "Hana Sato",
    handle: "hsato",
    avatarSeed: "hsato",
    source: "Direct",
    oaScore: 0.71,
    devpostScore: 0.35,
    githubScore: 0.68,
    oaStatus: "Pending",
    isGem: false,
    signals: { wins: 0, stackMatch: 0.66, commitFrequency: 0.61, starsNormalized: 0.41 },
    topProject: { name: "ferry-ui", hackathon: "Personal", url: "#" },
    whyExplainer: "Strong portfolio site, OA pending. Lower Devpost weight here — applied directly.",
    oaResponseUrl: "#",
    submittedAt: "2026-05-08T22:30:00Z",
  },

  // ML role
  {
    id: "cand_06",
    roleId: "ml",
    name: "Mateo Ferreira",
    handle: "mferreira",
    avatarSeed: "mferreira",
    source: "Devpost",
    oaScore: 0.89,
    devpostScore: 0.93,
    githubScore: 0.78,
    oaStatus: "Graded",
    isGem: true,
    signals: { wins: 4, stackMatch: 0.92, commitFrequency: 0.55, starsNormalized: 0.67 },
    topProject: { name: "EvalGuard", hackathon: "HackTX 2025", url: "#" },
    whyExplainer:
      "Four hackathon ML wins in a year, including HackTX 1st (Eval track). PyTorch-native, ships evals.",
    oaResponseUrl: "#",
    submittedAt: "2026-05-09T19:21:00Z",
  },
  {
    id: "cand_07",
    roleId: "ml",
    name: "Anika Joshi",
    handle: "ajoshi",
    avatarSeed: "ajoshi",
    source: "GitHub",
    oaScore: 0.82,
    devpostScore: 0.6,
    githubScore: 0.89,
    oaStatus: "Submitted",
    isGem: false,
    signals: { wins: 1, stackMatch: 0.81, commitFrequency: 0.78, starsNormalized: 0.74 },
    topProject: { name: "ragmate", hackathon: "TreeHacks 2026", url: "#" },
    whyExplainer:
      "Strong applied-RAG OSS work. OA strong on retrieval reasoning. One Devpost win — keep an eye on free-response.",
    oaResponseUrl: "#",
    submittedAt: "2026-05-09T15:48:00Z",
  },
  {
    id: "cand_08",
    roleId: "ml",
    name: "Jonah Park",
    handle: "jpark",
    avatarSeed: "jpark",
    source: "Devpost",
    oaScore: 0.66,
    devpostScore: 0.71,
    githubScore: 0.58,
    oaStatus: "Submitted",
    isGem: false,
    signals: { wins: 1, stackMatch: 0.7, commitFrequency: 0.5, starsNormalized: 0.35 },
    topProject: { name: "voice2task", hackathon: "PennApps 2025", url: "#" },
    whyExplainer: "Applied-LLM project shipped at PennApps. Mid-pack, but free-response showed clarity.",
    oaResponseUrl: "#",
    submittedAt: "2026-05-09T12:32:00Z",
  },
  {
    id: "cand_09",
    roleId: "ml",
    name: "Lila Okafor",
    handle: "lokafor",
    avatarSeed: "lokafor",
    source: "Devpost",
    oaScore: 0.74,
    devpostScore: 0.79,
    githubScore: 0.51,
    oaStatus: "In Progress",
    isGem: false,
    signals: { wins: 2, stackMatch: 0.77, commitFrequency: 0.48, starsNormalized: 0.3 },
    topProject: { name: "AnomalyHive", hackathon: "Calhacks 2025", url: "#" },
    whyExplainer: "Two Calhacks wins in anomaly detection. Lower GitHub footprint — hackathon-native.",
    oaResponseUrl: "#",
    submittedAt: "2026-05-09T10:11:00Z",
  },
  {
    id: "cand_10",
    roleId: "ml",
    name: "Tomás Rivera",
    handle: "trivera",
    avatarSeed: "trivera",
    source: "Direct",
    oaScore: 0.58,
    devpostScore: 0.4,
    githubScore: 0.55,
    oaStatus: "Pending",
    isGem: false,
    signals: { wins: 0, stackMatch: 0.6, commitFrequency: 0.44, starsNormalized: 0.22 },
    topProject: { name: "embed-bench", hackathon: "Personal", url: "#" },
    whyExplainer: "Direct application. Modest signals — OA pending will determine the call.",
    oaResponseUrl: "#",
    submittedAt: "2026-05-08T19:00:00Z",
  },

  // Designer role
  {
    id: "cand_11",
    roleId: "designer",
    name: "Ava Lindholm",
    handle: "alindholm",
    avatarSeed: "alindholm",
    source: "Devpost",
    oaScore: 0.85,
    devpostScore: 0.9,
    githubScore: 0.32,
    oaStatus: "Graded",
    isGem: false,
    signals: { wins: 3, stackMatch: 0.88, commitFrequency: 0.18, starsNormalized: 0.12 },
    topProject: { name: "Ferment", hackathon: "HackMIT 2025", url: "#" },
    whyExplainer:
      "Three Devpost design-track wins. Ships Figma + Framer prototype reliably under hackathon deadline pressure.",
    oaResponseUrl: "#",
    submittedAt: "2026-05-09T18:00:00Z",
  },
  {
    id: "cand_12",
    roleId: "designer",
    name: "Rohan Mehta",
    handle: "rmehta",
    avatarSeed: "rmehta",
    source: "Devpost",
    oaScore: 0.72,
    devpostScore: 0.78,
    githubScore: 0.28,
    oaStatus: "Submitted",
    isGem: false,
    signals: { wins: 2, stackMatch: 0.74, commitFrequency: 0.2, starsNormalized: 0.15 },
    topProject: { name: "Stillframe", hackathon: "TreeHacks 2026", url: "#" },
    whyExplainer: "TreeHacks UX win. Strong narrative skill in OA free-response.",
    oaResponseUrl: "#",
    submittedAt: "2026-05-09T13:24:00Z",
  },
  {
    id: "cand_13",
    roleId: "designer",
    name: "Yuki Tanaka",
    handle: "ytanaka",
    avatarSeed: "ytanaka",
    source: "Direct",
    oaScore: 0.68,
    devpostScore: 0.42,
    githubScore: 0.36,
    oaStatus: "Submitted",
    isGem: false,
    signals: { wins: 0, stackMatch: 0.67, commitFrequency: 0.31, starsNormalized: 0.18 },
    topProject: { name: "Atlas Type", hackathon: "Personal", url: "#" },
    whyExplainer:
      "Direct apply with strong type-design portfolio. No hackathon record — OA carrying the score.",
    oaResponseUrl: "#",
    submittedAt: "2026-05-09T09:50:00Z",
  },
  {
    id: "cand_14",
    roleId: "designer",
    name: "Marcus Bell",
    handle: "mbell",
    avatarSeed: "mbell",
    source: "Devpost",
    oaScore: 0.61,
    devpostScore: 0.66,
    githubScore: 0.41,
    oaStatus: "In Progress",
    isGem: false,
    signals: { wins: 1, stackMatch: 0.65, commitFrequency: 0.36, starsNormalized: 0.22 },
    topProject: { name: "Loft", hackathon: "Calhacks 2025", url: "#" },
    whyExplainer: "Calhacks design win. Mid-pack — waiting on free-response to land.",
    oaResponseUrl: "#",
    submittedAt: "2026-05-08T20:14:00Z",
  },
  {
    id: "cand_15",
    roleId: "designer",
    name: "Elena Voss",
    handle: "evoss",
    avatarSeed: "evoss",
    source: "Direct",
    oaScore: 0.55,
    devpostScore: 0.3,
    githubScore: 0.4,
    oaStatus: "Pending",
    isGem: false,
    signals: { wins: 0, stackMatch: 0.58, commitFrequency: 0.4, starsNormalized: 0.2 },
    topProject: { name: "Glide UI Kit", hackathon: "Personal", url: "#" },
    whyExplainer: "Direct apply. OA still pending.",
    oaResponseUrl: "#",
    submittedAt: "2026-05-08T17:00:00Z",
  },
];

export const mockDevpostFeed: DevpostFeedItem[] = [
  {
    id: "feed_01",
    candidate: "Sarah K.",
    project: "NeuralCanvas",
    hackathon: "HackMIT",
    matchPct: 94,
    role: "Frontend",
    receivedAt: "just now",
  },
  {
    id: "feed_02",
    candidate: "Mateo F.",
    project: "EvalGuard",
    hackathon: "HackTX",
    matchPct: 89,
    role: "ML",
    receivedAt: "32s ago",
  },
  {
    id: "feed_03",
    candidate: "Anika J.",
    project: "ragmate",
    hackathon: "TreeHacks",
    matchPct: 82,
    role: "ML",
    receivedAt: "1m ago",
  },
  {
    id: "feed_04",
    candidate: "Diego A.",
    project: "InboxZero",
    hackathon: "TreeHacks",
    matchPct: 81,
    role: "Frontend",
    receivedAt: "2m ago",
  },
  {
    id: "feed_05",
    candidate: "Ava L.",
    project: "Ferment",
    hackathon: "HackMIT",
    matchPct: 85,
    role: "Designer",
    receivedAt: "3m ago",
  },
  {
    id: "feed_06",
    candidate: "Lila O.",
    project: "AnomalyHive",
    hackathon: "Calhacks",
    matchPct: 74,
    role: "ML",
    receivedAt: "4m ago",
  },
  {
    id: "feed_07",
    candidate: "Priya R.",
    project: "shadcn-charts",
    hackathon: "PennApps",
    matchPct: 76,
    role: "Frontend",
    receivedAt: "5m ago",
  },
  {
    id: "feed_08",
    candidate: "Rohan M.",
    project: "Stillframe",
    hackathon: "TreeHacks",
    matchPct: 72,
    role: "Designer",
    receivedAt: "6m ago",
  },
];

export const mockHackathons = [
  "HackMIT",
  "TreeHacks",
  "PennApps",
  "Calhacks",
  "HackTX",
  "HackHarvard",
  "HackPrinceton",
  "YHack",
  "DeltaHacks",
  "BoilerMake",
];

export const mockOAQuestions: OAQuestion[] = [
  {
    id: "q1",
    type: "multiple-choice",
    prompt:
      "Your team ships a React 19 app and Lighthouse flags 320ms of long-tasks during route changes. What's the first thing you investigate?",
    choices: [
      "Adding more `useMemo` calls in the affected components",
      "Moving the route logic into a Web Worker",
      "Server-rendering more of the route and using a `<Suspense>` boundary on the client work",
      "Switching to a different bundler",
    ],
    correctIndex: 2,
  },
  {
    id: "q2",
    type: "multiple-choice",
    prompt:
      "You're designing a candidate-facing form with a 6-step wizard. Which strategy minimizes drop-off?",
    choices: [
      "Show all steps on one page so users can scan ahead",
      "Show one step at a time with a persistent progress indicator and inline save",
      "Email each step as a separate link",
      "Hide the step count to reduce intimidation",
    ],
    correctIndex: 1,
  },
  {
    id: "q3",
    type: "multiple-choice",
    prompt:
      "When animating list reorders triggered by user input, which approach feels best at 60fps?",
    choices: [
      "Animate `top`/`left` on each item",
      "Use the FLIP technique (or `layout` props in framer-motion) to animate transforms",
      "Re-render the list after a `setTimeout`",
      "Disable animation when the list has > 10 items",
    ],
    correctIndex: 1,
  },
  {
    id: "q4",
    type: "free-response",
    prompt:
      "Walk us through the most surprising tradeoff you made in this project. What did you give up, and would you make the same call again?",
    personalizedFrom: "NeuralCanvas",
    placeholder:
      "Be specific about the constraint, the choice, and what you learned. 4–8 sentences is plenty.",
  },
];
