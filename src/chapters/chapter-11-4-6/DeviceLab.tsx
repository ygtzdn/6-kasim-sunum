import {
  ArrowRight,
  Check,
  Cpu,
  File,
  FileCode2,
  FolderOpen,
  HardDrive,
  LayoutPanelLeft,
  Power,
} from "lucide-react";
import { Stage } from "../../components/presentation/ScenePrimitives";
import {
  StageCaption,
  StageReveal,
} from "../../presentation/PresentationMotion";
import {
  FlowDiagram,
  type DiagramNode,
  type DiagramEdge,
} from "../../components/diagrams/FlowDiagram";
import type { SceneContext } from "../../presentation/types";
import { deviceAtStage, remapBlock } from "./model.mjs";
import { managementStages } from "./stages";
import { StageControls } from "./StageControls";

const PREPARATION = [
  "Sektör düzeni henüz oluşturulmadı.",
  "Denetleyicinin okuyup yazabildiği sektörler: başlık, veri ve ECC.",
  "Alan iki mantıksal bölüme ayrıldı; henüz dosya sistemi yok.",
  "Bölüm 1'de dosya sistemi metaverisi oluşturuldu.",
  "Bölüm 1'in dosya sistemi denetlenip bağlandı; dosya erişimine hazır.",
  "Örnek dosya, bağlı dosya sistemi içinde saklandı.",
];

export function DeviceLab({ stage, setStage }: SceneContext) {
  const device = deviceAtStage(stage);
  return (
    <Stage
      title="Aygıttan dosyaya."
      controls={
        <StageControls
          stage={stage}
          setStage={setStage}
          labels={managementStages["device-preparation"]}
        />
      }
    >
      <div className="flex w-full max-w-4xl flex-col gap-4">
        <div className="rounded-3xl border-2 border-ink bg-white p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-2">
              <HardDrive size={22} /> Fiziksel aygıt
            </span>
          </div>
          <div
            className="flex h-[clamp(150px,28vh,240px)] gap-3"
            aria-label={PREPARATION[stage]}
          >
            {stage === 0 ? (
              <div className="flex w-full items-center justify-center rounded-2xl bg-slate-200 font-display text-2xl text-slate-600">
                Ham ortam
              </div>
            ) : stage === 1 ? (
              <div className="flex w-full flex-col items-center justify-center gap-4 rounded-2xl bg-slate-100 p-4">
                <div className="grid w-full grid-cols-8 gap-2">
                  {Array.from({ length: 16 }, (_, i) => (
                    <div key={i} className="h-5 rounded bg-blue/70 md:h-7" />
                  ))}
                </div>
                <div
                  className="flex w-full overflow-hidden rounded-lg border border-ink text-center text-[10px] font-semibold md:text-xs"
                  aria-label="Örnek bir sektör: başlık, veri ve ECC"
                >
                  <span className="flex-1 bg-slate-200 px-2 py-2">Başlık</span>
                  <span className="flex-3 bg-blue px-2 py-2 text-white">
                    Veri
                  </span>
                  <span className="flex-1 bg-blue/15 px-2 py-2 text-blue">
                    ECC
                  </span>
                </div>
              </div>
            ) : (
              device.partitions.map((part) => (
                <div
                  key={part.id}
                  style={{ flex: part.percent }}
                  className={`state-cell relative flex min-w-0 flex-col items-center justify-center gap-2 rounded-2xl border-2 p-2 ${part.filesystem ? "border-blue bg-blue/8" : "border-slate-300 bg-slate-50"}`}
                >
                  {part.filesystem ? (
                    <FolderOpen className="size-9 text-blue md:size-14" />
                  ) : (
                    <LayoutPanelLeft className="size-9 text-slate-500 md:size-14" />
                  )}
                  <span className="text-xs font-semibold md:text-base">
                    Bölüm {part.id + 1} · {part.percent}%
                  </span>
                  {part.filesystem && (
                    <span className="text-xs font-bold text-blue">
                      Dosya sistemi
                    </span>
                  )}
                  {part.mounted && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-blue">
                      <Check size={16} /> Bağlı
                    </span>
                  )}
                  {part.files > 0 && (
                    <StageReveal className="flex items-center gap-2 text-xs font-semibold text-blue">
                      <File size={20} /> sunum.pdf
                    </StageReveal>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center text-xs font-semibold sm:grid-cols-4">
          {["Fiziksel biçim", "Bölümleme", "Dosya sistemi", "Bağlama"].map(
            (label, i) => (
              <div
                key={label}
                className={`rounded-xl px-2 py-3 ${stage > i ? "bg-blue/10 text-blue" : "bg-slate-100 text-slate-500"}`}
              >
                {label}
              </div>
            ),
          )}
        </div>
        {stage >= 4 && (
          <div className="flex items-center justify-center gap-3 rounded-xl bg-blue/5 px-4 py-2 text-xs font-semibold text-blue">
            <span>OS ad alanı</span>
            <ArrowRight size={18} />
            <span>Bölüm 1 · dosya sistemi</span>
            {stage === 5 && <File size={18} />}
          </div>
        )}
        <StageCaption className="text-center text-xs font-semibold text-slate-600 md:text-sm">
          {PREPARATION[stage]}
        </StageCaption>
      </div>
    </Stage>
  );
}

const BOOT_NODES = [
  {
    id: "firmware",
    label: "Firmware",
    detail: "ROM'daki ilk kod",
    icon: Power,
  },
  {
    id: "boot-block",
    label: "Boot block",
    detail: "Açılış bölgesindeki kod",
    icon: HardDrive,
  },
  {
    id: "loader",
    label: "Yükleyici",
    detail: "Kernel'i bul ve yükle",
    icon: FileCode2,
  },
  { id: "kernel", label: "Kernel", detail: "RAM'de yürütme", icon: Cpu },
];
const BOOT_EXPLANATIONS = [
  "Kernel henüz RAM'de değil. İlk komutu hangi bileşen başlatır?",
  "İlk kod ROM / firmware içinde hazırdır; henüz işletim sistemi çalışmaz.",
  "Firmware, seçilen açılış aygıtındaki boot block koduna denetimi aktarır.",
  "Yükleyici, dosya sistemindeki kernel görüntüsünü bulup RAM'e getirir.",
  "Denetim RAM'deki kernel'e geçer; işletim sisteminin başlangıcı sürer.",
];

export function BootLab({ stage, setStage, enabled }: SceneContext) {
  const active = stage - 1;
  const nodes: DiagramNode[] = BOOT_NODES.map((node, index) => ({
    ...node,
    tone: index === active ? "active" : index < active ? "complete" : "muted",
  }));
  const edges: DiagramEdge[] = BOOT_NODES.slice(1).map((node, index) => ({
    id: `boot-control-${index}`,
    source: BOOT_NODES[index].id,
    target: node.id,
    active: active > index,
    muted: active <= index,
  }));
  return (
    <Stage
      title="İlk komut nereden gelir?"
      controls={
        <StageControls
          stage={stage}
          setStage={setStage}
          labels={managementStages["boot-sequence"]}
        />
      }
    >
      <div className="flex w-full max-w-5xl flex-col items-center gap-4 md:gap-5">
        <FlowDiagram
          id="boot-control"
          label="Firmware, boot block, yükleyici ve RAM'deki kernel arasında açılış denetimi"
          nodes={nodes}
          edges={edges}
          enabled={enabled}
          className="h-[clamp(150px,25dvh,230px)] w-full"
        />
        {stage >= 3 && (
          <div
            role="status"
            className="flex flex-wrap items-center justify-center gap-3 rounded-xl bg-blue/5 px-5 py-3 text-center text-xs font-semibold text-blue md:text-sm"
          >
            <span className="inline-flex items-center gap-2">
              <HardDrive size={20} /> Depolamadaki kernel görüntüsü
            </span>
            <ArrowRight size={20} aria-hidden="true" />
            <span className="inline-flex items-center gap-2">
              <Cpu size={20} /> RAM · {stage === 4 ? "yüklendi" : "yükleniyor"}
            </span>
          </div>
        )}
        <StageCaption className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-center text-xs font-semibold md:text-sm">
          {BOOT_EXPLANATIONS[stage]}
        </StageCaption>
      </div>
    </Stage>
  );
}

const PHYSICAL = [40, 41, 42, 43, 44, 45, 46, 47];
const REMAP_EXPLANATIONS = [
  "OS'nin kullandığı adres LBA 5; fiziksel hedef P45.",
  "P45 arızalı. Mantıksal adres aynı kalır; bu aşamada erişim sorunu var.",
  "LBA 5 artık yedek P90'a gider. Yeniden eşleme eski okunamayan veriyi tek başına kurtarmaz.",
];
export function RemapLab({ stage, setStage, enabled }: SceneContext) {
  const mapping = stage === 2 ? remapBlock(PHYSICAL, 5, 90) : PHYSICAL;
  const nodes: DiagramNode[] = [
    {
      id: "lba-5",
      label: "LBA 5",
      detail: "OS'nin mantıksal adresi",
      tone: "active",
    },
    {
      id: "physical-45",
      label: "P45",
      detail: stage >= 1 ? "Arızalı sektör" : "Başlangıç hedefi",
      icon: HardDrive,
      tone: stage >= 1 ? "error" : "complete",
    },
    {
      id: "physical-90",
      label: "P90",
      detail: "Yedek sektör",
      icon: HardDrive,
      tone: stage === 2 ? "complete" : "muted",
    },
  ];
  const edges: DiagramEdge[] = [
    {
      id: "initial-mapping",
      source: "lba-5",
      target: "physical-45",
      label: stage === 2 ? "Eski hedef" : "Eşleme",
      active: stage === 0,
      error: stage === 1,
      muted: stage === 2,
    },
    {
      id: "spare-mapping",
      source: "lba-5",
      target: "physical-90",
      label: stage === 2 ? "Yeni eşleme" : "Yedek",
      active: stage === 2,
      muted: stage !== 2,
    },
  ];
  return (
    <Stage
      title="Adres aynı. Yer değişir."
      controls={
        <StageControls
          stage={stage}
          setStage={setStage}
          labels={managementStages["bad-block-remapping"]}
        />
      }
    >
      <div className="remap-scene">
        <FlowDiagram
          id="sector-remapping"
          label={`LBA 5 → P${mapping[5]}; ${stage === 1 ? "P45 arızalı" : stage === 2 ? "yedek eşleme etkin" : "ilk eşleme"}`}
          nodes={nodes}
          edges={edges}
          enabled={enabled}
          className="diagram-expanded"
        />
        <StageCaption className="text-center text-xs font-semibold text-slate-600 md:text-sm">
          {REMAP_EXPLANATIONS[stage]}
        </StageCaption>
      </div>
    </Stage>
  );
}
