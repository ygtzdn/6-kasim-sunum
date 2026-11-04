import curriculum from "./curriculum.json";
export const schedulingStages: Record<string, readonly string[]> =
  Object.fromEntries(curriculum.map((scene) => [scene.id, scene.stages]));
