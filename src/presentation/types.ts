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
  goTo: (id: string) => void;
  openMenu: () => void;
}
export interface SceneDefinition {
  id: string;
  title: string;
  shortTitle: string;
  chapter: string;
  presenterId: 1 | 2 | 3 | 4;
  notes: SceneNotes;
  render: (context: SceneContext) => ReactNode;
}
