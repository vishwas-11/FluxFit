import axios, { AxiosError } from "axios";

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://localhost:6000/api/internal";

function getInternalKey(): string {
  const key = process.env.INTERNAL_API_KEY;
  if (!key) {
    throw new Error(
      "INTERNAL_API_KEY is not set in Backend .env. It must match ai-service and be used as x-internal-key."
    );
  }
  return key;
}

function toUserMessage(e: unknown): string {
  const err = e as AxiosError<{ message?: string; error?: string }>;
  const status = err.response?.status;
  const body = err.response?.data;

  if (status === 403) {
    return "AI service rejected the request (403). Ensure INTERNAL_API_KEY is identical in Backend/.env and ai-service/.env.";
  }
  if (status === 400) {
    return body?.message || body?.error || "AI service: bad request.";
  }
  if (status && status >= 500) {
    return body?.message || body?.error || "AI service error. Check ai-service logs (e.g. GEMINI_API_KEY, MONGO_URI).";
  }
  if (err.code === "ECONNREFUSED" || err.message?.includes("ECONNREFUSED")) {
    return "Cannot reach ai-service. Is it running? With Docker, ensure ai-service is up and AI_SERVICE_URL is set (e.g. http://ai-service:6000/api/internal).";
  }
  if (err.code === "ETIMEDOUT" || err.message?.includes("timeout")) {
    return "AI service timed out. Try again in a moment.";
  }
  return body?.message || body?.error || err.message || "AI service request failed.";
}

export async function getAIRecommendation(profile: any, logs: any[]) {
  const config = {
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      "x-internal-key": getInternalKey(),
    },
  };

  try {
    console.log("➡️ Calling AI plan...");
    const planRes = await axios.post(
      `${AI_SERVICE_URL}/recommend/plan`,
      { profile, recentLogs: logs },
      config
    );

    console.log("➡️ Calling AI narrative...");
    const narrativeRes = await axios.post(
      `${AI_SERVICE_URL}/recommend/narrative`,
      { profile, recentLogs: logs },
      config
    );

    const planData = planRes.data?.data ?? planRes.data;
    const narrativeData = narrativeRes.data?.data ?? narrativeRes.data;

    return { ...planData, ...narrativeData };
  } catch (e) {
    const msg = toUserMessage(e);
    console.error("❌ AI recommendation failed:", msg);
    throw new Error(msg);
  }
}
