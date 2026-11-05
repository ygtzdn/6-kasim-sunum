import { ArrowRight, CircleAlert, HardDrive, ShieldCheck } from "lucide-react";
import { Stage } from "../../components/presentation/ScenePrimitives";
import {
  StageCaption,
  StageReveal,
} from "../../presentation/PresentationMotion";
import type { SceneContext } from "../../presentation/types";
import { IntegrityBits } from "./IntegrityBits";
import { ORIGINAL_BITS, flipBit } from "./model.mjs";
import { StageControls } from "./StageControls";
import { managementStages } from "./stages";

const CAPTIONS = [
  "Veriyi saklarız, sonra geri okuruz. Okunan içeriğin doğruluğunu da denetlemeliyiz.",
  "Tek bir bit değiştiğinde okunan veri de değişir.",
  "Denetim bilgisiyle hata aranır. Hata saptanırsa işlem durdurulabilir.",
];

export function ErrorNeed({ stage, setStage }: SceneContext) {
  const bits = stage === 0 ? ORIGINAL_BITS : flipBit([...ORIGINAL_BITS], 2);
  const Icon =
    stage === 0 ? HardDrive : stage === 1 ? CircleAlert : ShieldCheck;
  return (
    <Stage
      title="Hata tespitine neden ihtiyaç var?"
      controls={
        <StageControls
          stage={stage}
          setStage={setStage}
          labels={managementStages["why-error-detection"]}
        />
      }
    >
      <div className="integrity-scene">
        <div
          className="integrity-path"
          role="group"
          aria-label="Yazılan veriden okunan veriye"
        >
          <div className="integrity-panel">
            <h2>Yazılan veri</h2>
            <IntegrityBits bits={ORIGINAL_BITS} label="Yazılan veri" compact />
            <span className="integrity-detail">Başlangıçtaki bitler</span>
          </div>
          <ArrowRight className="integrity-arrow" aria-hidden="true" />
          <div
            className={`integrity-panel ${stage === 1 ? "integrity-panel-error" : stage === 2 ? "integrity-panel-active" : ""}`}
          >
            <Icon
              className="integrity-icon"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <h2>
              {stage === 0
                ? "Saklama ve okuma"
                : stage === 1
                  ? "Bir bit değişti"
                  : "Denetim gerekir"}
            </h2>
            <span className="integrity-detail">
              {stage === 0
                ? "Veri depolamadan geri gelir."
                : stage === 1
                  ? "1 değeri 0 oldu."
                  : "Veriyle birlikte ek bilgi saklarız."}
            </span>
          </div>
          <ArrowRight className="integrity-arrow" aria-hidden="true" />
          <div
            className={`integrity-panel ${stage > 0 ? "integrity-panel-error" : ""}`}
          >
            <h2>Okunan veri</h2>
            <IntegrityBits
              bits={bits}
              original={ORIGINAL_BITS}
              label="Okunan veri"
              compact
            />
            <span className="integrity-detail">
              {stage === 0
                ? "Bu okumada değişiklik yok."
                : "Başlangıçtaki veriden farklı."}
            </span>
          </div>
        </div>
        <StageCaption className="integrity-caption">
          {CAPTIONS[stage]}
        </StageCaption>
        <div className="integrity-takeaway">
          {stage === 2 ? (
            <StageReveal key="control">
              Sonraki soru: Ek bilgiyle hatayı nasıl tespit ederiz?
            </StageReveal>
          ) : (
            <span>
              Hızlı erişim, veri doğruluğunu tek başına garanti etmez.
            </span>
          )}
        </div>
      </div>
    </Stage>
  );
}
