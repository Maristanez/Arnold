import { AICheckInResponse, BackboardMemory, OnboardingData, Program, Session } from "@/types";
import Constants from "expo-constants";
import { ServiceResult } from "@/services/types";

const CLAUDE_MODEL = "claude-sonnet-4-5";
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

function sanitizeProgram(candidate: unknown, userId = ""): Program | null {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const value = candidate as Record<string, unknown>;
  if (!Array.isArray(value.days)) {
    return null;
  }

  return {
    id: String(value.id ?? "generated-program"),
    user_id: userId,
    name: String(value.name ?? "Generated Program"),
    description: String(value.description ?? "AI-generated weekly program"),
    fitness_identity: String(value.fitness_identity ?? "casual"),
    days: value.days as Program["days"],
    is_active: true,
    week_number: Number(value.week_number ?? 1),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function sanitizeCheckIn(candidate: unknown): AICheckInResponse | null {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const value = candidate as Record<string, unknown>;
  const assessment = String(value.assessment ?? "solid") as AICheckInResponse["assessment"];
  const allowed = ["strong", "solid", "challenging", "needs_recovery"];

  return {
    summary: String(value.summary ?? "Workout complete."),
    assessment: allowed.includes(assessment) ? assessment : "solid",
    encouragement: String(value.encouragement ?? "Nice work. Keep building momentum."),
    adjustments: Array.isArray(value.adjustments)
      ? (value.adjustments as AICheckInResponse["adjustments"])
      : [],
  };
}

async function callClaude(system: string, prompt: string): Promise<ServiceResult<unknown>> {
  const extra = Constants.expoConfig?.extra as { claudeApiKey?: string } | undefined;
  const apiKey = extra?.claudeApiKey;

  if (!apiKey) {
    return { data: null, error: "Missing Claude API key" };
  }

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 1200,
        temperature: 0.5,
        system,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      return { data: null, error: "Claude request failed" };
    }

    const json = (await response.json()) as {
      content?: Array<{ type?: string; text?: string }>;
    };
    const content = Array.isArray(json.content) ? json.content : [];
    const textBlock = content.find((item) => item?.type === "text");
    const text = textBlock?.text;

    if (typeof text !== "string") {
      return { data: null, error: "Claude response missing text output" };
    }

    try {
      const parsed = JSON.parse(text);
      return { data: parsed, error: null };
    } catch {
      return { data: null, error: "Claude JSON parse failed" };
    }
  } catch {
    return { data: null, error: "Claude request failed" };
  }
}

export const claudeService = {
  async generateProgram(
    onboardingData: OnboardingData,
    memories: BackboardMemory[]
  ): Promise<ServiceResult<Program>> {
    const system =
      "You are an elite fitness coach AI. Return only valid JSON for a weekly training program.";
    const prompt = JSON.stringify(
      {
        task: "Generate a personalized weekly training program",
        schema: {
          name: "string",
          description: "string",
          fitness_identity: "string",
          week_number: "number",
          days: [
            {
              day_number: "number",
              name: "string",
              focus: "string",
              exercises: [
                {
                  id: "string",
                  name: "string",
                  sets: "number",
                  reps: "string",
                  rest_seconds: "number",
                  notes: "string (optional)",
                },
              ],
            },
          ],
        },
        onboardingData,
        memories,
      },
      null,
      2
    );

    const response = await callClaude(system, prompt);
    if (response.error || !response.data) {
      return { data: null, error: response.error ?? "Program generation failed" };
    }

    const program = sanitizeProgram(response.data);
    if (!program) {
      return { data: null, error: "Program validation failed" };
    }

    return { data: program, error: null };
  },

  async generateCheckIn(
    session: Session,
    program: Program
  ): Promise<ServiceResult<AICheckInResponse>> {
    const system =
      "You are a post-workout coach AI. Return only valid JSON for a concise check-in response.";

    const prompt = JSON.stringify(
      {
        task: "Generate post-workout check-in",
        schema: {
          summary: "string",
          assessment: "strong|solid|challenging|needs_recovery",
          encouragement: "string",
          adjustments: [
            {
              exercise_name: "string",
              adjustment: "string",
              reason: "string",
            },
          ],
        },
        session,
        program,
      },
      null,
      2
    );

    const response = await callClaude(system, prompt);
    if (response.error || !response.data) {
      return { data: null, error: response.error ?? "Check-in generation failed" };
    }

    const checkIn = sanitizeCheckIn(response.data);
    if (!checkIn) {
      return { data: null, error: "Check-in validation failed" };
    }

    return { data: checkIn, error: null };
  },
};
