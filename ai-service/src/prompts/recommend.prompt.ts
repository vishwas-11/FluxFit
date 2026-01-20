export const buildPlanPrompt = (profile: any, context: string) => {
  const goal = profile?.goals?.primary || "fitness";
  const injury = profile?.preferences?.injury || "none";

  return `
You are a JSON API.

RULES:
- Output ONLY valid JSON
- No markdown
- No commentary

User goal: ${goal}
Injury: ${injury}

Return JSON:
{
  "workoutPlan": ["String"],
  "dietGuidance": {
    "dailyCalorieRange": "String",
    "macroSplit": "String",
    "mealSuggestions": ["String"]
  },
  "injuryConsiderations": ["String"]
}
`;
};

export const buildNarrativePrompt = (profile: any, context: string) => {
  const goal = profile?.goals?.primary || "fitness";

  return `
You are a JSON API.

RULES:
- Output ONLY valid JSON
- No markdown
- No commentary

User goal: ${goal}

Return JSON:
{
  "personalizedInsight": "String",
  "progressExpectations": {
    "month1": "String"
  },
  "commonMistakes": ["String"],
  "motivationalTip": "String"
}
`;
};
