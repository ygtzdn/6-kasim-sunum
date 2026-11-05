import { Cpu, GitMerge, Layers3 } from "lucide-react";
import { motion } from "motion/react";
import { StageCaption } from "../../presentation/PresentationMotion";
import type { SceneContext } from "../../presentation/types";
import { Choice, Stage } from "../../components/presentation/ScenePrimitives";
import { nvmRequests, nvmSchedulingStateAtStage } from "./nvm-model";
import "./scheduling.css";

function NvmRequestFlow({
  stage,
  enabled,
}: {
  stage: number;
  enabled: boolean;
}) {
  const state = nvmSchedulingStateAtStage(stage);
  const merged = stage >= 2;
  const sent = stage >= 3;
  const received = stage >= 4;
  const label = (id: string) => {
    const request =
      state.requests.find((item) => item.id === id) ??
      nvmRequests.find((item) => item.id === id)!;
    return `${request.operation === "read" ? "Oku" : "Yaz"} L${request.lba}${request.blocks > 1 ? `–L${request.lba + request.blocks - 1}` : ""}`;
  };
  return (
    <svg
      viewBox="0 0 1100 340"
      className="nvm-request-flow"
      role="img"
      aria-label={`${state.hostRequests} host isteği, ${state.commandCount} komut, ${state.logicalBlocks} mantıksal blok. ${received ? "Komutlar SSD denetleyicisine ulaştı." : sent ? "Komutlar arayüze gönderildi." : "İstekler OS kuyruğunda."}`}
    >
      {[
        {
          x: 20,
          width: 335,
          title: "OS kuyruğu",
          detail: merged ? "Bitişik okumalar birleşti" : "Host istekleri",
          active: !sent,
        },
        {
          x: 390,
          width: 260,
          title: "Komut arayüzü",
          detail: "Bu örnekte NVMe",
          active: sent && !received,
        },
        {
          x: 685,
          width: 395,
          title: "SSD denetleyicisi",
          detail: received ? "Gelen I/O komutları" : "Elektronik erişim",
          active: received,
        },
      ].map((box) => (
        <g key={box.title}>
          <rect
            x={box.x}
            y="20"
            width={box.width}
            height="280"
            rx="16"
            fill={box.active ? "#eef1ff" : "#fff"}
            stroke={box.active ? "#2247eb" : "#cbd5e1"}
            strokeWidth="2"
          />
          <text
            x={box.x + 20}
            y="52"
            fontSize="21"
            fontWeight="700"
            fill="#111827"
          >
            {box.title}
          </text>
          <text x={box.x + 20} y="76" fontSize="14" fill="#64748b">
            {box.detail}
          </text>
        </g>
      ))}
      <path
        d="M360 162h22m-8-7 8 7-8 7M655 162h22m-8-7 8 7-8 7"
        fill="none"
        stroke="#2247eb"
        strokeWidth="2"
      />
      {nvmRequests.map((request, i) => {
        const hidden = merged && i === 1;
        const row = i === 0 || i === 1 ? 0 : 1;
        const sentRow = i === 0 || i === 1 ? 0 : i - 1;
        const x = received
          ? 705
          : sent
            ? 410
            : merged && i === 1
              ? 50
              : 40 + (i % 2) * 155;
        const y = sent ? 110 + sentRow * 57 : 115 + row * 80;
        const width = received
          ? 355
          : sent
            ? 220
            : merged && i === 0
              ? 295
              : 140;
        return (
          <motion.g
            key={request.id}
            initial={false}
            animate={{ x, y, opacity: hidden ? 0 : 1 }}
            transition={{ duration: enabled ? 0.55 : 0, ease: "easeInOut" }}
            aria-hidden={hidden || undefined}
          >
            <motion.rect
              initial={false}
              animate={{ width }}
              transition={{ duration: enabled ? 0.4 : 0 }}
              height="46"
              rx="9"
              fill={request.operation === "write" ? "#fff0e9" : "#2247eb"}
              stroke={request.operation === "write" ? "#ef602e" : "#2247eb"}
              strokeWidth="2"
            />
            <motion.text
              initial={false}
              animate={{ x: width / 2 }}
              transition={{ duration: enabled ? 0.4 : 0 }}
              y="29"
              textAnchor="middle"
              fontSize="18"
              fontWeight="600"
              fill={request.operation === "write" ? "#b63c15" : "#fff"}
            >
              {label(request.id)}
            </motion.text>
          </motion.g>
        );
      })}
      <text x="40" y="279" fontSize="16" fontWeight="600" fill="#2247eb">
        {merged ? "4 host isteği / 3 komut" : "4 host isteği / 4 komut"}
      </text>
      <text x="705" y="290" fontSize="14" fill="#64748b">
        {stage >= 5
          ? "FTL · GC · wear leveling"
          : "Kafa hareketi ve dönme beklemesi yok"}
      </text>
      <text x="550" y="329" textAnchor="middle" fontSize="14" fill="#64748b">
        Komutların sayısı değişebilir. İstenen veri aynı kalır: 4 mantıksal
        blok.
      </text>
    </svg>
  );
}

export function NvmScheduling({ stage, setStage, enabled }: SceneContext) {
  const captions = [
    "SSD’de kafa ve plaka dönüşü yoktur. Silindirler arasında mekanik yol kısaltma hedefi ortadan kalkar.",
    "OS komutları hazırlar ve kuyruğa alır. SSD hızlı olduğundan yazılımın her komut için yaptığı iş önem kazanır.",
    "Bitişik L10 ve L11 okumaları tek komutta birleşir. Aktarılacak veri aynı kalırken komut sayısı 4’ten 3’e iner.",
    "Host, üç komutu arayüz üzerinden SSD’ye göndermeye başlar. NVMe iletişim arayüzüdür, flash adreslerini eşleyen FTL ayrı bir görevdir.",
    "Üç komut SSD denetleyicisine ulaşır. L10–L11 okuması iki bitişik bloğu tek komutta ister. Veri miktarı dört mantıksal blok olarak korunur.",
    "Host kuyruk ve komut işini yönetir. SSD denetleyicisi FTL, GC ve aşınma dağıtımını yürütür. GC ek fiziksel yazmalar doğurabilir.",
  ];
  return (
    <Stage
      title="SSD’de neden hâlâ optimizasyon var?"
      controls={
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "Seek yok",
            "Kuyruk maliyeti",
            "Birleştir",
            "Gönder",
            "SSD’ye ulaş",
            "Denetleyici",
          ].map((label, i) => (
            <Choice
              key={label}
              active={stage === i}
              onClick={() => setStage(i)}
            >
              {label}
            </Choice>
          ))}
        </div>
      }
    >
      <div className="nvm-scheduling-scene">
        <div className="scheduling-premise">
          {stage < 2 ? (
            <Cpu aria-hidden="true" />
          ) : stage === 2 ? (
            <GitMerge aria-hidden="true" />
          ) : (
            <Layers3 aria-hidden="true" />
          )}
          <div>
            <h2>
              {
                [
                  "Elektronik erişim, mekanik bekleme olmadan çalışır",
                  "Komut hazırlama ve kuyruk maliyeti devam eder",
                  "Bitişik istekleri birleştirmek komut yükünü azaltabilir",
                  "Komutlar host’tan aygıta ilerler",
                  "SSD aynı veriyi daha az komutla alır",
                  "Host ve SSD denetleyicisi farklı işleri yönetir",
                ][stage]
              }
            </h2>
            <p>
              {stage === 2
                ? "Kitaptaki örnek: RHEL 7’de NOOP, bitişik LBA isteklerini birleştirir."
                : stage >= 5
                  ? "FTL adres eşler, GC boş alan kazanır, wear leveling aşınmayı dağıtır."
                  : "Operating System Concepts, 10. baskı, 11.3"}
            </p>
          </div>
        </div>
        <NvmRequestFlow stage={stage} enabled={enabled} />
        <div className="nvm-stage-fact">
          <strong>
            {stage === 0
              ? "Seek + dönme: yok"
              : stage === 1
                ? "Her komut: yazılım işi"
                : stage === 2
                  ? "4 istek / 3 komut"
                  : stage === 3
                    ? "OS → arayüz → SSD"
                    : stage === 4
                      ? "4 mantıksal blok korunur"
                      : "1 host yazması ≠ 1 fiziksel yazma"}
          </strong>
        </div>
        <StageCaption className="scheduling-caption">
          {captions[stage]}
        </StageCaption>
      </div>
    </Stage>
  );
}

const initialWear = [8, 2, 2];
const wearExamples = [
  { title: "Tek bloğa yığılırsa", values: [11, 2, 2] },
  { title: "Bloklara dağıtılırsa", values: [8, 4, 3] },
];

function WearBars({ values, enabled }: { values: number[]; enabled: boolean }) {
  return (
    <div
      className="wear-bars"
      role="img"
      aria-label={values
        .map((value, index) => `B${index}: ${value} silme`)
        .join(", ")}
    >
      {values.map((value, index) => (
        <div key={index}>
          <div className="wear-bar-track">
            <motion.div
              initial={false}
              animate={{ height: `${(value / 12) * 100}%` }}
              transition={{ duration: enabled ? 0.35 : 0 }}
            />
          </div>
          <strong>{value}</strong>
          <span>B{index}</span>
        </div>
      ))}
    </div>
  );
}

export function NvmCheckpoint({ stage, setStage, enabled }: SceneContext) {
  const captions = [
    "Silme sayaçları geçmiş kullanımı gösterir. B0 daha çok aşınmıştır.",
    "Üç yeni silme B0'a yığılırsa sayaçlar [11, 2, 2] olur.",
    "Aynı üç yeni silme dağıtıldığında örnek sonuç [8, 4, 3]. Geçmiş aşınma silinmez.",
  ];
  return (
    <Stage
      title="Wear leveling"
      controls={
        <div className="flex flex-wrap justify-center gap-2">
          {["Başlangıç", "Tek blok", "Yükü dağıt"].map((label, index) => (
            <Choice
              key={label}
              active={stage === index}
              onClick={() => setStage(index)}
            >
              {label}
            </Choice>
          ))}
        </div>
      }
    >
      <div className="wear-leveling">
        <p className="wear-baseline">Başlangıç: B0 = 8, B1 = 2, B2 = 2 silme</p>
        {stage === 0 ? (
          <WearBars values={initialWear} enabled={enabled} />
        ) : (
          <div className="wear-options">
            {wearExamples.map((example, index) => (
              <section key={example.title}>
                <h2>{example.title}</h2>
                {index === 0 || stage >= 2 ? (
                  <WearBars values={example.values} enabled={enabled} />
                ) : (
                  <p className="wear-pending">Aynı üç yeni silme</p>
                )}
              </section>
            ))}
          </div>
        )}
        <StageCaption className="text-center text-sm font-semibold leading-relaxed text-slate-600 md:text-lg">
          {captions[stage]}
        </StageCaption>
      </div>
    </Stage>
  );
}
