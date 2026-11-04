import {
  StageCaption,
  StageReveal,
} from "../../presentation/PresentationMotion";
import { Check, FolderOpen, HardDrive, ShieldCheck } from "lucide-react";
import { Choice, Stage } from "../../components/presentation/ScenePrimitives";
import type { SceneContext } from "../../presentation/types";
import { managementStages } from "./stages";
import { StageControls } from "./StageControls";

const questions = [
  {
    number: "Doğruluk",
    Icon: ShieldCheck,
    prompt: "Parite geçti. Veri kesin doğru mu?",
    options: ["Kesin doğru", "Kontrol sınırlı"],
    correct: 1,
    answer: "Çift sayıda bit değişimi pariteyi koruyabilir.",
  },
  {
    number: "Hazırlık",
    Icon: FolderOpen,
    prompt: "Bölüm oluşturuldu. Dosya sistemi de var mı?",
    options: ["Aynı işlem", "Farklı katmanlar"],
    correct: 1,
    answer: "Bölüm alan ayırır; dosya sistemi o alanı düzenler.",
  },
  {
    number: "Swap",
    Icon: HardDrive,
    prompt: "Yazma başladı. RAM frame'i hemen boş mu?",
    options: ["Hemen", "Tamamlanınca"],
    correct: 1,
    answer: "Bu örnekte veri korunmadan RAM kopyası bırakılmaz.",
  },
];
export function ManagementRecap({ stage, setStage }: SceneContext) {
  const index = Math.floor(stage / 2);
  const revealed = stage % 2 === 1;
  const question = questions[index];
  const Icon = question.Icon;
  return (
    <Stage
      title="Üç sorumluluğu ayır."
      controls={
        <div className="flex flex-wrap items-center justify-center gap-2">
          {questions.map((item, i) => (
            <Choice
              key={item.number}
              active={index === i}
              onClick={() => setStage(i * 2)}
            >
              {item.number}
            </Choice>
          ))}
          <StageControls
            stage={stage}
            setStage={setStage}
            labels={managementStages["management-decisions"]}
          />
        </div>
      }
    >
      <StageReveal
        key={index}
        effect="scale"
        className="flex max-w-3xl flex-col items-center gap-5 md:gap-8"
      >
        <div className="flex size-20 items-center justify-center rounded-3xl bg-blue/10 text-blue md:size-28">
          <Icon className="size-10 md:size-14" strokeWidth={1.5} />
        </div>
        <h2 className="text-center font-display text-2xl font-semibold md:text-4xl">
          {question.prompt}
        </h2>
        <div className="flex items-center gap-3">
          {question.options.map((option, i) => (
            <span
              key={option}
              className={`state-cell flex min-h-12 items-center gap-2 rounded-xl border-2 px-5 py-3 text-sm font-semibold ${revealed && i === question.correct ? "border-blue bg-blue text-white" : "border-slate-300 bg-white"}`}
            >
              {revealed && i === question.correct && <Check size={17} />}
              {option}
            </span>
          ))}
        </div>
        {revealed && (
          <StageReveal
            effect="wipe"
            className="flex flex-wrap items-center justify-center gap-3 rounded-xl border border-blue bg-blue/5 px-5 py-3 text-center text-xs font-semibold md:text-sm"
          >
            {index === 0 ? (
              <>
                <span className="font-mono">0111001 + P=0</span>
                <span>Çift hata · çift parite</span>
              </>
            ) : index === 1 ? (
              <>
                <span>Bölüm alanı</span>
                <span>≠</span>
                <span>Dosya sistemi metaverisi</span>
              </>
            ) : (
              <>
                <span>F0: P korunur</span>
                <span>→</span>
                <span>S0: yazma bekliyor</span>
              </>
            )}
          </StageReveal>
        )}
        <StageCaption className="flex min-h-12 items-center justify-center text-center text-xs font-semibold text-blue md:text-base">
          {revealed
            ? question.answer
            : "Önce tahmin et; sonraki aşamada gerekçeyi göster."}
        </StageCaption>
        {stage === 5 && (
          <span className="text-center text-xs font-semibold text-slate-600">
            Sonraki: bağlantı ve çoklu disk koruması →
          </span>
        )}
      </StageReveal>
    </Stage>
  );
}
