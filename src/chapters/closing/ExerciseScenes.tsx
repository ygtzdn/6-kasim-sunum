import { Cpu, HardDrive, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Choice, Stage } from "../../components/presentation/ScenePrimitives";
import { StageReveal } from "../../presentation/PresentationMotion";
import { chapters } from "../../presentation/chapters";
import type { SceneContext, SceneDefinition } from "../../presentation/types";
import {
  calculateSchedule,
  type ScheduleAlgorithm,
} from "../chapter-11-2-3/model";
import { exercises, exerciseSchedule } from "./exercise-data.mjs";

const scheduleResults = (["FCFS", "SCAN", "C-SCAN"] as ScheduleAlgorithm[]).map(
  (algorithm) =>
    calculateSchedule(algorithm, { ...exerciseSchedule, direction: "up" }),
);
const n = (value: number) =>
  value.toLocaleString("tr-TR", { maximumFractionDigits: 4 });
const explanations: Record<string, string> = {
  nvm: "Mekanik seek ve dönme yoktur. FCFS basit ve düşük ek yüklüdür.",
  schedule:
    "Yön artandır. SCAN fiziksel uca gider; C-SCAN dönüş hareketini de sayar.",
  rotation:
    "Ortalama bekleme bir turun yarısıdır. Seek ve aktarım bu hesaba dahil değildir.",
  comparison:
    "HDD’de büyük sıralı aktarım mekanik maliyetin payını azaltır; NVM’de küçük rastgele I/O düşük gecikmeden yararlanır.",
  "raid-write":
    "Yeni pariteyi hesaplamak için eski veri ve eski parite gerekir.",
  reliability:
    "Bağımsız ve sabit arıza hızı varsayımıyla disklerin arıza hızları toplanır. MTBF, garanti süresini belirlemez.",
};

function ExerciseVisual({
  type,
  revealed,
  enabled,
}: {
  type: string;
  revealed: boolean;
  enabled: boolean;
}) {
  if (type === "schedule")
    return (
      <div className="exercise-schedule">
        <p>0–4999 · kafa 2150 · önceki 1805 · yön ↑</p>
        <div className="exercise-queue">
          {exerciseSchedule.queue.map((value) => (
            <span key={value}>{value}</span>
          ))}
        </div>
        {scheduleResults.map((result) => (
          <div className="exercise-result" key={result.algorithm}>
            <strong>{result.algorithm}</strong>
            <div>
              <motion.span
                initial={false}
                animate={{
                  width: revealed
                    ? `${(result.total / Math.max(...scheduleResults.map((item) => item.total))) * 100}%`
                    : "0%",
                }}
                transition={{ duration: enabled ? 0.4 : 0 }}
              />
            </div>
            <b>{revealed ? n(result.total) : "?"}</b>
          </div>
        ))}
        {revealed && (
          <div className="exercise-calculation">
            SCAN: 2849 + 4643 = 7492
            <br />
            C-SCAN: 2849 + 4999 + 2069 = 9917
          </div>
        )}
      </div>
    );
  if (type === "rotation")
    return (
      <div className="exercise-equation">
        <span>7200 RPM</span>
        <ArrowRight />
        <strong>{revealed ? "8,3333 ms / tur" : "Bir tur kaç ms?"}</strong>
        <span>Ortalama bekleme · yarım tur</span>
        <b>{revealed ? "4,1667 ms" : "? ms"}</b>
      </div>
    );
  if (type === "reliability")
    return (
      <div className="exercise-equation">
        <span>1000 disk</span>
        <strong>750000 disk-saat / arıza</strong>
        <span>Çiftlikte ortalama aralık</span>
        <b>{revealed ? "750 saat" : "? saat"}</b>
        <span>
          {revealed
            ? "≈ 31,25 gün · garanti süresi değildir"
            : "Disk sayısı toplam arıza hızını nasıl değiştirir?"}
        </span>
      </div>
    );
  if (type === "raid-write")
    return (
      <div className="exercise-io-grid">
        {(revealed
          ? [
              "Eski veri · oku",
              "Eski P · oku",
              "Yeni veri · yaz",
              "Yeni P · yaz",
            ]
          : ["Veri bloğu", "Parite bloğu"]
        ).map((label, i) => (
          <div key={label}>
            <span>{revealed ? `${i + 1}. I/O` : "? I/O"}</span>
            <strong>{label}</strong>
          </div>
        ))}
        {revealed && <b>2 okuma + 2 yazma = 4 I/O</b>}
      </div>
    );
  return (
    <div className="exercise-device-pair">
      <div>
        {type === "nvm" ? <Cpu /> : <HardDrive />}
        <strong>{type === "nvm" ? "FCFS kuyruğu" : "HDD"}</strong>
        <p>
          {revealed
            ? type === "nvm"
              ? "Basit sıra · düşük ek yük"
              : "Seek + dönme + aktarım"
            : "Hangi maliyet?"}
        </p>
      </div>
      <ArrowRight />
      <div>
        <Cpu />
        <strong>NVM</strong>
        <p>{revealed ? "Mekanik seek ve dönme yok" : "Hareketli parça yok"}</p>
      </div>
    </div>
  );
}

export const exerciseScenes: SceneDefinition[] = exercises.map((exercise) => {
  const presenters = new Set(
    chapters
      .filter(({ number }) => exercise.sections.includes(number))
      .map(({ presenterId }) => `${presenterId}.`),
  );
  const topicPresenterLabel = `${[...presenters].join(" ve ")} kişinin konusu`;
  return {
    id: exercise.id,
    title: `Alıştırma ${exercise.label} · ${exercise.title}`,
    shortTitle: `${exercise.label} · ${exercise.title}`,
    kind: "closing",
    presenterId: 4,
    chapter: exercise.chapter,
    legacyIds: [],
    stages: exercise.stages,
    seconds: exercise.seconds,
    notes: { explanation: exercise.answer, topicPresenterLabel },
    render: (context) => (
      <ExerciseScene
        {...context}
        exercise={exercise}
        topicPresenterLabel={topicPresenterLabel}
      />
    ),
  };
});

function ExerciseScene({
  exercise,
  topicPresenterLabel,
  stage,
  setStage,
  enabled,
}: SceneContext & {
  exercise: (typeof exercises)[number];
  topicPresenterLabel: string;
}) {
  const revealed = stage === 1;
  return (
    <Stage
      title={`Alıştırma ${exercise.label}`}
      controls={
        <div className="flex gap-3">
          <Choice active={!revealed} onClick={() => setStage(0)}>
            Soru
          </Choice>
          <Choice active={revealed} onClick={() => setStage(1)}>
            Çözüm ve gerekçe
          </Choice>
        </div>
      }
    >
      <div className="exercise-scene">
        <div className="exercise-question">
          <p className="text-sm font-semibold text-slate-700">
            {topicPresenterLabel}
          </p>
          <a
            href={`/references/ch11-exercises.pdf#page=${exercise.page}`}
            target="_blank"
            rel="noreferrer"
          >
            Exercises {exercise.label} · kaynak PDF
          </a>
          <h2>{revealed ? exercise.title : exercise.question}</h2>
          {revealed ? (
            <StageReveal className="exercise-answer">
              <strong>Gerekçe</strong>
              <p>{explanations[exercise.visual]}</p>
            </StageReveal>
          ) : (
            <p className="exercise-prompt">
              Sonucunu gerekçesiyle birlikte düşün.
            </p>
          )}
        </div>
        <div className="exercise-evidence">
          <ExerciseVisual
            type={exercise.visual}
            revealed={revealed}
            enabled={enabled}
          />
        </div>
      </div>
    </Stage>
  );
}
