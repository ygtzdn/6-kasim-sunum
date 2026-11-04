import type { ReactNode } from "react";

export interface SceneNotes {
  represents: string;
  learningGoal: string;
  walkthrough: string[];
  keyPoints: string[];
  limits: string;
  question?: { prompt: string; answer: string };
  transition?: string;
}
export interface SceneContext {
  enabled: boolean;
  stage: number;
  setStage: (stage: number) => void;
  goTo: (id: string) => void;
  openMenu: () => void;
}
export interface SceneDefinition {
  id: string;
  legacyIds?: readonly string[];
  kind: "intro" | "chapter" | "closing";
  depth: "core" | "extension";
  seconds: { core: number; full: number };
  title: string;
  shortTitle: string;
  chapter: string;
  presenterId: 1 | 2 | 3 | 4;
  notes: SceneNotes;
  stages: readonly string[];
  render: (context: SceneContext) => ReactNode;
}
