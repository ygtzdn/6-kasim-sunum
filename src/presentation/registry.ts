import { introductionScenes } from "../chapters/chapter-11-1/scenes";
import { schedulingScenes } from "../chapters/chapter-11-2-3/scenes";
import { managementScenes } from "../chapters/chapter-11-4-6/scenes";
import { attachmentRaidScenes } from "../chapters/chapter-11-7-8/scenes";
import { closingScenes } from "../chapters/closing/scenes";
import type { SceneDefinition } from "./types";
import { openingScenes } from "../chapters/opening/scenes";

export const scenes: SceneDefinition[] = [
  ...openingScenes,
  ...introductionScenes,
  ...schedulingScenes,
  ...managementScenes,
  ...attachmentRaidScenes,
  ...closingScenes,
];
export const sceneGroups = [
  {
    id: "intro",
    label: "Giriş",
    sections: "Açılış",
    scenes: scenes.filter((s) => s.kind === "intro"),
  },
  ...([1, 2, 3, 4] as const).map((id) => ({
    id: `presenter-${id}`,
    label: `${id}. kişi`,
    sections: ["11.1", "11.2–11.3", "11.4–11.6", "11.7–11.8"][id - 1],
    scenes: scenes.filter((s) => s.presenterId === id && s.kind === "chapter"),
  })),
  {
    id: "closing",
    label: "Kapanış",
    sections: "Ortak",
    scenes: scenes.filter((s) => s.kind === "closing"),
  },
];
