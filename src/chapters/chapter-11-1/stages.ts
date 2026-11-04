import curriculum from "./curriculum.json";
export const introStages: Record<string, readonly string[]> =
  Object.fromEntries(curriculum.map((scene) => [scene.id, scene.stages]));
