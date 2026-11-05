import { ArrowUpRight } from "lucide-react";
import { chapters } from "../presentation/chapters";

export function ChapterOverview({ goTo }: { goTo: (id: string) => void }) {
  return (
    <section className="contents-scene">
      <header>
        <p className="eyebrow">
          Operating System Concepts · 10. baskı · Bölüm 11
        </p>
        <h1 id="scene-heading" tabIndex={-1}>
          Kütlesel depolama
        </h1>
      </header>
      <nav className="chapter-contents" aria-label="Bölüm 11 konuları">
        {chapters.map((chapter) => (
          <button
            key={chapter.number}
            onClick={() => goTo(chapter.firstScene)}
            aria-label={`${chapter.number} ${chapter.title} bölümüne geç`}
          >
            <span>{chapter.number}</span>
            <strong>{chapter.title}</strong>
            <ArrowUpRight aria-hidden="true" size={22} />
          </button>
        ))}
      </nav>
    </section>
  );
}
