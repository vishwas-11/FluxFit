import { GoogleGenerativeAI } from "@google/generative-ai";

export const rerankSources = async (
  userContext: any,
  sources: any[]
): Promise<number[]> => {
  // Default fallback: return original order [0, 1, 2...]
  const defaultOrder = sources.map((_, i) => i);

  try {
    const slicedSources = sources.slice(0, 10);

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY as string
    );

    // FIXED: Use currently supported v1beta model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
User context:
${JSON.stringify(userContext)}

Sources:
${slicedSources
  .map(
    (s, i) =>
      `[${i}] ${s.title}: ${s.content.slice(0, 200)}`
  )
  .join("\n")}

You are a ranking system. Return ONLY a JSON array of integers representing the indices of the most relevant sources, in order of relevance.
Example: [0, 3, 1]
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // FIXED: Clean potential markdown backticks
    const cleanedText = text.replace(/```json|```/g, "").trim();
    
    const parsed = JSON.parse(cleanedText);

    if (!Array.isArray(parsed)) return defaultOrder;

    return parsed.filter((n: any) => Number.isInteger(n));
  } catch (error) {
    console.error("⚠️ Gemini Rerank Failed (Using default order):", error);
    return defaultOrder;
  }
};