export const buildRetrievalQuery = (
  profile: any,
  logs: any[]
) => {
  return `
  Fitness goal: ${profile.goals?.primary}
  Injury: ${profile.preferences?.injury}
  Recent activity: ${logs
    .map((l) => l.workout?.type)
    .join(", ")}
  Diet type: ${profile.preferences?.dietType}
  `;
};
