import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Generates AI recommendation using Google's Gemini model
 * Returns a STRICT JSON string (no markdown, no text)
 */
export const generateRecommendation = async (
  prompt: string
): Promise<string> => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    /**
     * 🔑 IMPORTANT CONFIG CHANGES
     * - temperature ↓ (JSON stability)
     * - maxOutputTokens ↑ (avoid truncation)
     * - responseMimeType = application/json
     */
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,          // ⬅️ CRITICAL
        maxOutputTokens: 4096,     // ⬅️ CRITICAL
      },
    });

    console.log("🚀 Calling Gemini API...");
    const startTime = Date.now();

    const result = await model.generateContent(prompt);
    const response = result.response;

    console.log(`✅ Gemini responded in ${Date.now() - startTime}ms`);

    let text = response.text().trim();

    /**
     * 🧹 SAFETY CLEANER
     * Gemini *sometimes* still adds code fences despite rules
     */
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();

    /**
     * 🛡️ FINAL JSON VALIDATION
     * Never return broken data downstream
     */
    try {
      JSON.parse(text);
    } catch (err) {
      console.error("❌ Gemini RAW OUTPUT (INVALID JSON):");
      console.error(text);
      throw new Error("AI returned invalid JSON format");
    }

    return text;
  } catch (error: any) {
    console.error("❌ Gemini Service Error:", error.message);

    if (error.message?.includes("404")) {
      throw new Error("Gemini model not found or unavailable");
    }

    throw error;
  }
};
