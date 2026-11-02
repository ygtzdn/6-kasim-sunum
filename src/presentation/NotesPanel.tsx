import type { SceneDefinition } from "./types";

export default function NotesPanel({ scene }: { scene: SceneDefinition }) {
  const notes = scene.notes;
  return (
    <article className="menu-notes">
      <span className="eyebrow">
        {scene.id.toUpperCase()} · {scene.chapter}
      </span>
      <h2>{scene.title}</h2>
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
