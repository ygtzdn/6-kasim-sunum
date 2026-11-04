import type { SceneDefinition } from "./types";
import { formatSlideNumbers, sceneReferences, textbook } from "./textbook";

export default function NotesPanel({
  scene,
  stage = 0,
}: {
  scene: SceneDefinition;
  stage?: number;
}) {
  const notes = scene.notes;
  const reference = sceneReferences[scene.id];
  return (
    <article className="menu-notes">
      <span className="eyebrow">
        {scene.chapter} · {scene.presenterId}. kişi
      </span>
      <h2>{scene.title}</h2>
      <p role="status">
        Aşama {stage + 1}/{scene.stages.length} · {scene.stages[stage]}
      </p>
      <section className="note-question">
        <h3>Bu sahneden çıkarım</h3>
        <p>{reference.takeaway}</p>
      </section>
      <section>
        <h3>Kitap dayanağı</h3>
        <p>
          {textbook.title} · {textbook.edition}
          <br />
          Bölüm {reference.sections.join(", ")}
        </p>
        <p>
          <a
            href={textbook.slidesUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue underline"
          >
            Resmî Chapter 11 slaytları · {formatSlideNumbers(reference.slides)}
          </a>
        </p>
        <p>{reference.model}</p>
        {reference.exercise && (
          <p>
            <a
              href={`${textbook.exercisesUrl}#page=${reference.exercise.page}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue underline"
            >
              Kullanıcının sağladığı PDF · Exercises {reference.exercise.label}
            </a>
          </p>
        )}
        <small>{textbook.verification}</small>
      </section>
      <section>
        <h3>Bu sayfa neyi temsil ediyor?</h3>
        <p>{notes.represents}</p>
      </section>
      <section>
        <h3>Öğrenme hedefi</h3>
        <p>{notes.learningGoal}</p>
      </section>
      <section>
        <h3>Nasıl anlatılır?</h3>
        <ol>
          {notes.walkthrough.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>
      <section>
        <h3>Ana kavramlar</h3>
        <ul>
          {notes.keyPoints.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Modelin sınırları</h3>
        <p>{notes.limits}</p>
      </section>
      {notes.question && (
        <section className="note-question">
          <h3>Dinleyiciye sor</h3>
          <p>{notes.question.prompt}</p>
          <p>
            <strong>Beklenen gerekçe:</strong> {notes.question.answer}
          </p>
        </section>
      )}
      {notes.transition && (
        <section>
          <h3>Sonraki sahneye geçiş</h3>
          <p>{notes.transition}</p>
        </section>
      )}
      <small>Bu panel projeksiyonda da görünür.</small>
    </article>
  );
}
