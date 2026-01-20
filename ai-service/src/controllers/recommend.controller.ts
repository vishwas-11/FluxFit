import { Request, Response } from "express";
import { retrieveCandidateSources } from "../services/retrieval.service";
import { rerankSources } from "../services/geminiRerank.service";
import { generateRecommendation } from "../services/gemini.service";
import {
  buildPlanPrompt,
  buildNarrativePrompt,
} from "../prompts/recommend.prompt";

/**
 * =====================================================
 * 🔹 SHARED CONTEXT BUILDER
 * Used by both PLAN + NARRATIVE generation
 * =====================================================
 */
async function buildContext(profile: any, recentLogs: any[]) {
  const tags = [
    profile?.goals?.primary,
    profile?.preferences?.dietType,
  ].filter(Boolean);

  let context = "";

  try {
    const candidates = await retrieveCandidateSources(tags, recentLogs || []);

    if (candidates?.length) {
      let selectedSources = candidates.slice(0, 3);

      // Optional rerank (timeout protected)
      if (candidates.length > 3) {
        const selectedIndexes = await Promise.race([
          rerankSources({ profile }, candidates),
          new Promise<number[]>((resolve) =>
            setTimeout(() => resolve([]), 4000)
          ),
        ]);

        if (selectedIndexes?.length) {
          selectedSources = selectedIndexes
            .slice(0, 3)
            .map((i) => candidates[i])
            .filter(Boolean);
        }
      }

      context = selectedSources
        .map(
          (s) =>
            `Title: ${s.title}\n${s.content.substring(0, 500)}`
        )
        .join("\n\n---\n\n");
    }
  } catch (err) {
    console.warn("⚠️ Context build skipped:", err);
  }

  return context;
}

/**
 * =====================================================
 * 🔹 PLAN GENERATION
 * Returns ONLY:
 * - workoutPlan
 * - dietGuidance
 * - injuryConsiderations
 * =====================================================
 */
export const generatePlan = async (req: Request, res: Response) => {
  try {
    const { profile, recentLogs = [] } = req.body;

    if (!profile) {
      return res.status(400).json({
        success: false,
        message: "Profile required",
      });
    }

    const context = await buildContext(profile, recentLogs);
    const prompt = buildPlanPrompt(profile, context);

    const jsonText = await Promise.race([
      generateRecommendation(prompt),
      new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error("Plan generation timeout")), 20000)
      ),
    ]);

    const parsed = JSON.parse(jsonText);

    return res.status(200).json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error("💥 Plan Controller Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to generate plan",
      error: error.message,
    });
  }
};

/**
 * =====================================================
 * 🔹 NARRATIVE GENERATION
 * Returns ONLY:
 * - personalizedInsight
 * - progressExpectations
 * - commonMistakes
 * - motivationalTip
 * =====================================================
 */
export const generateNarrative = async (req: Request, res: Response) => {
  try {
    const { profile, recentLogs = [] } = req.body;

    if (!profile) {
      return res.status(400).json({
        success: false,
        message: "Profile required",
      });
    }

    const context = await buildContext(profile, recentLogs);
    const prompt = buildNarrativePrompt(profile, context);

    const jsonText = await Promise.race([
      generateRecommendation(prompt),
      new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error("Narrative generation timeout")), 20000)
      ),
    ]);

    const parsed = JSON.parse(jsonText);

    return res.status(200).json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error("💥 Narrative Controller Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to generate narrative",
      error: error.message,
    });
  }
};
