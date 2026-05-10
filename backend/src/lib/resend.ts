import { Resend } from "resend";

let cached: Resend | null = null;

export function resendClient(): Resend {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set in environment");
  cached = new Resend(key);
  return cached;
}

export const FROM_ADDRESS = "Sniper <onboarding@resend.dev>";
