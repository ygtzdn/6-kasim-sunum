import {
  ArrowRight,
  Check,
  Laptop,
  ListOrdered,
  Network,
  Layers3,
  HardDrive,
  ShieldCheck,
} from "lucide-react";
import type { SceneContext, SceneDefinition } from "../../presentation/types";
import { Stage } from "../../components/presentation/ScenePrimitives";
import { StageCaption } from "../../presentation/PresentationMotion";
import {
  FlowDiagram,
  type DiagramNode,
  type DiagramEdge,
} from "../../components/diagrams/FlowDiagram";
import { StoryControls } from "../chapter-11-7-8/StoryControls";
import { closingStoryData } from "../chapter-11-7-8/storyData";
import { attachmentRaidNotes } from "../chapter-11-7-8/notes";
import { exerciseScenes } from "./ExerciseScenes";

const JOURNEY = [
  {
    label: "Uygulama",
    detail: "Bir dosyanın verisi istenir; uygulama fiziksel sektör seçmez.",
  },
  {
    label: "OS kuyruğu",
    detail:
      "İşletim sistemi I/O isteklerini sıraya koyar. HDD’de servis sırası kafa hareketini etkileyebilir.",
  },
  {
    label: "Bağlantı",
    detail:
      "İstek yerel bağlantıdan veya ağdan geçer. NAS dosya hizmeti, SAN örneği blok hacmi sunar.",
  },
  {
    label: "RAID (varsa)",
    detail:
      "Çok diskli bir hacim varsa mantıksal blokların dağıtımı ve koruma düzeni devreye girer. RAID zorunlu değildir.",
  },
  {
    label: "Aygıt",
    detail:
      "HDD’de seek ve dönme; flash’ta sayfa yazma, blok silme ve denetleyici yönetimi farklı maliyetler doğurur.",
  },
  {
    label: "Bütünlük",
    detail:
      "ECC ve checksum veri hatalarına, RAID belirli disk arızalarına yanıt verir. Hepsi aynı güvenceyi sağlamaz.",
  },
];
const WRAP_UP = [
  {
    label: "İş yükü",
    detail:
      "Rastgele mi sıralı mı? Okuma mı yazma mı? İstek boyutu nedir? Aygıt ve politika bu bağlamda değerlendirilir.",
  },
  {
    label: "Gecikme",
    detail:
      "Kuyruk, seek, dönme ve aktarımın katkıları ayrıdır. Bir bileşeni azaltmak diğerlerini ortadan kaldırmaz.",
  },
  {
    label: "Hata modeli",
    detail:
      "Bit bozulması, tam disk kaybı ve bütün dizinin kaybı farklı hatalardır. Korumanın hangi hatayı kapsadığını belirtin.",
  },
  {
    label: "Yedekleme",
    detail:
      "RAID, yanlış silme veya bütün dizinin kaybı için bağımsız bir geri dönüş kopyasının yerine geçmez.",
  },
];

function Journey(context: SceneContext) {
  const { stage, enabled } = context;
  const icons = [Laptop, ListOrdered, Network, Layers3, HardDrive, ShieldCheck];
  const details = [
    "Dosya isteği",
    "I/O sırası",
    "Yerel / ağ",
    "İsteğe bağlı",
    "HDD / flash",
    "ECC / checksum",
  ];
  const nodes: DiagramNode[] = JOURNEY.map((step, index) => ({
    id: `journey-${index}`,
    label: step.label,
    detail: details[index],
    icon: icons[index],
    badge: String(index + 1).padStart(2, "0"),
    position: {
      x: (index < 3 ? index : 5 - index) * 330,
      y: index < 3 ? 0 : 220,
    },
    tone:
      stage === index + 1 ? "active" : stage > index + 1 ? "complete" : "muted",
  }));
  const edges: DiagramEdge[] = nodes.slice(1).map((node, index) => ({
    id: `journey-link-${index}`,
    source: nodes[index].id,
    target: node.id,
    active: stage >= index + 2,
    muted: stage < index + 2,
    animated: stage === index + 2 && stage < 6,
    sourceSide: index === 2 ? "bottom" : index >= 3 ? "left" : "right",
    targetSide: index === 2 ? "top" : index >= 3 ? "right" : "left",
  }));
  return (
    <Stage
      title="Tek istek. Bütün sistem."
      controls={
        <StoryControls
          {...context}
          choices={JOURNEY.map((step, index) => ({
            label: step.label,
            stage: index + 1,
          }))}
        />
      }
    >
      <div className="flex h-full min-h-0 w-full max-w-6xl flex-col items-center justify-center gap-6 md:gap-10">
        <FlowDiagram
          id="whole-io-journey"
          label="Kavramsal istek yolu: uygulama, OS kuyruğu, bağlantı, varsa RAID, aygıt ve bütünlük"
          nodes={nodes}
          edges={edges}
          enabled={enabled}
          className="diagram-expanded"
        />
        <StageCaption className="max-w-4xl shrink-0 text-center text-base font-semibold leading-relaxed md:text-xl">
          {stage === 0
            ? "Dört bölümün kararlarını tek bir dosya okuma isteğinde birleştirelim."
            : JOURNEY[stage - 1].detail}
        </StageCaption>
        {stage === 6 && (
          <span className="rounded-xl bg-blue/10 px-4 py-2 text-center text-xs font-semibold md:text-sm">
            Bu kavramsal yol örnektir; swap sıradan dosya okumasının zorunlu
            aşaması değildir.
          </span>
        )}
      </div>
    </Stage>
  );
}

function WrapUp(context: SceneContext) {
  const { stage, setStage, openMenu } = context;
  return (
    <Stage
      title={
        stage === 0
          ? "Doğru tasarım için hangi sorular?"
          : stage === 5
            ? "Kararları birlikte değerlendir."
            : WRAP_UP[stage - 1].label
      }
      controls={<StoryControls {...context} />}
    >
      <div className="flex h-full min-h-0 w-full max-w-4xl flex-col items-center justify-center gap-5 md:gap-8">
        <div className="grid w-full grid-cols-2 gap-3 md:gap-6">
          {WRAP_UP.map(({ label }, index) => (
            <button
              key={label}
              onClick={() => setStage(index + 1)}
              aria-pressed={stage >= index + 1}
              className={`state-cell flex min-h-20 items-center justify-center gap-3 rounded-2xl border-2 p-4 font-display text-lg font-semibold md:min-h-32 md:text-3xl ${stage >= index + 1 ? "border-blue bg-blue text-white" : "border-ink bg-white"}`}
            >
              {label}
              {stage >= index + 1 && <Check size={23} />}
            </button>
          ))}
        </div>
        <StageCaption className="max-w-3xl text-center text-sm font-semibold leading-relaxed md:text-xl">
          {stage === 0
            ? "En hızlı aygıt veya en yüksek kapasite tek başına bir depolama tasarımını tanımlamaz."
            : stage === 5
              ? "İş yükü, gecikme, hata modeli ve geri dönüş ihtiyacı birlikte tanımlanır. Bir model yalnız açıkladığı varsayımlar içinde sonuç üretir."
              : WRAP_UP[stage - 1].detail}
        </StageCaption>
        {stage === 5 && (
          <button className="choice" onClick={openMenu}>
            Sorular için ilgili sahneye dön <ArrowRight size={17} />
          </button>
        )}
      </div>
    </Stage>
  );
}

const summaryScenes: SceneDefinition[] = closingStoryData.map((topic) => ({
  ...topic,
  shortTitle: topic.id === "io-journey" ? "Tek istek" : "Tasarım ve sorular",
  notes: attachmentRaidNotes[topic.id],
  render: (context) =>
    topic.id === "io-journey" ? (
      <Journey {...context} />
    ) : (
      <WrapUp {...context} />
    ),
}));

export const closingScenes: SceneDefinition[] = [
  summaryScenes[0],
  ...exerciseScenes,
  summaryScenes[1],
];
