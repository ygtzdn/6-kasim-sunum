import type { SceneDefinition } from "./types";
import { formatSlideNumbers, sceneReferences, textbook } from "./textbook";

export default function SceneSources({ scene }: { scene: SceneDefinition }) {
  const reference = sceneReferences[scene.id];
  if (!reference) return null;
  return (
    <section className="scene-sources">
      <span className="eyebrow">Bu sayfanın kaynağı</span>
      <h2>{scene.title}</h2>
      <p>
        {textbook.title} · {textbook.edition}
        <br />
        Bölüm {reference.sections.join(", ")}
      </p>
      <a href={textbook.slidesUrl} target="_blank" rel="noreferrer">
        Chapter 11 · {formatSlideNumbers(reference.slides)}
      </a>
      <p>{reference.model}</p>
      {reference.supplement && (
        <a href={reference.supplement.url} target="_blank" rel="noreferrer">
          {reference.supplement.label}
        </a>
      )}
      {reference.exercise && (
        <a
          href={`${textbook.exercisesUrl}#page=${reference.exercise.page}`}
          target="_blank"
          rel="noreferrer"
        >
          Exercises {reference.exercise.label} · kaynak PDF
        </a>
      )}
    </section>
  );
}
