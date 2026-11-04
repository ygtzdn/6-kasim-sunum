import { ArrowRight, RotateCcw } from "lucide-react";
import type { SceneContext } from "../../presentation/types";

export function StageControls({
  stage,
  setStage,
  labels,
}: Pick<SceneContext, "stage" | "setStage"> & { labels: readonly string[] }) {
  const complete = stage === labels.length - 1;
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        className="primary-button"
        disabled={complete}
        onClick={() => setStage(Math.min(stage + 1, labels.length - 1))}
      >
        {complete ? "Aşamalar tamamlandı" : labels[stage + 1]}{" "}
        <ArrowRight size={17} />
      </button>
      <button
        className="icon-button"
        aria-label="Bu sahnenin ilk aşamasına dön"
        disabled={stage === 0}
        onClick={() => setStage(0)}
      >
        <RotateCcw size={19} />
      </button>
    </div>
  );
}
