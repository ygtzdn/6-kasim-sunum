import { RotateCcw } from "lucide-react";
import { Choice } from "../../components/presentation/ScenePrimitives";
import type { SceneContext } from "../../presentation/types";

export function StoryControls({
  stage,
  setStage,
  openMenu,
  choices = [],
}: Pick<SceneContext, "stage" | "setStage" | "openMenu"> & {
  choices?: readonly { label: string; stage: number; until?: number }[];
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {choices.map((choice) => (
        <Choice
          key={choice.label}
          active={
            stage >= choice.stage && stage <= (choice.until ?? choice.stage)
          }
          onClick={() => setStage(choice.stage)}
        >
          {choice.label}
        </Choice>
      ))}
      <button
        className="icon-button"
        aria-label="Sahneyi başa al"
        disabled={stage === 0}
        onClick={() => setStage(0)}
      >
        <RotateCcw size={18} />
      </button>
      <button
        className="icon-button"
        aria-label="Sunum menüsünü aç"
        onClick={openMenu}
      >
        ?
      </button>
    </div>
  );
}
