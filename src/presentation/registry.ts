import { introductionScenes } from "../chapters/chapter-11-1/scenes";
import { schedulingScenes } from "../chapters/chapter-11-2-3/scenes";
import { managementScenes } from "../chapters/chapter-11-4-6/scenes";
import { attachmentRaidScenes } from "../chapters/chapter-11-7-8/scenes";
import { closingScenes } from "../chapters/closing/scenes";
import type { SceneDefinition } from "./types";
import { openingScenes } from "../chapters/opening/scenes";
import { chapters } from "./chapters";

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
  ...chapters.map((chapter) => ({
    id: chapter.number,
    label: `${chapter.number} · ${chapter.title}`,
    sections: `${chapter.presenterId}. kişi`,
    scenes: scenes.filter(
      (s) =>
        s.kind === "chapter" &&
        (s.chapter === chapter.number ||
          (chapter.number === "11.6" && s.id === "management-decisions")),
    ),
  })),
  {
    id: "closing",
    label: "Kapanış",
    sections: "Ortak",
    scenes: scenes.filter((s) => s.kind === "closing"),
  },
];
