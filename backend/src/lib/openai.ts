import OpenAI from "openai";

let cached: OpenAI | null = null;

export function openaiClient(): OpenAI {
  if (cached) return cached;
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set in environment");
  cached = new OpenAI({ apiKey: key });
  return cached;
}

export type GradeResult = { score: number; reasoning: string };

export async function gradeFreeResponse(
  roleTitle: string,
  question: string,
  answer: string,
): Promise<GradeResult> {
  const system = `You are an expert technical recruiter grading a job application assessment.
Score the candidate's answer from 0.0 to 1.0 based on depth, specificity, and insight.
Be strict: generic or vague answers score below 0.5.
Respond ONLY with valid JSON: {"score": <number 0.0–1.0>, "reasoning": "<1–2 sentences>"}`;

  const user = `Role: ${roleTitle}

Question: ${question}

Answer: ${answer}`;

  const res = await openaiClient().chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    max_tokens: 200,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  const raw = res.choices[0]?.message.content ?? "{}";
  const parsed = JSON.parse(raw) as { score?: number; reasoning?: string };

  return {
    score: Math.min(1, Math.max(0, Number(parsed.score ?? 0))),
    reasoning: parsed.reasoning ?? "",
  };
}
