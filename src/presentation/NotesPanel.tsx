import type { SceneDefinition } from "./types";

export default function NotesPanel({ scene }: { scene: SceneDefinition }) {
  return (
    <article className="menu-notes">
      <span className="eyebrow">
        {scene.chapter} · {scene.presenterId}. kişi
      </span>
      <h2>{scene.title}</h2>
      <p>{scene.notes.explanation}</p>
    </article>
  );
}
