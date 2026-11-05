import {
  ArrowDown,
  Check,
  File,
  HardDrive,
  Layers3,
  LockKeyhole,
} from "lucide-react";
import { Stage } from "../../components/presentation/ScenePrimitives";
import { StageCaption } from "../../presentation/PresentationMotion";
import {
  FlowDiagram,
  type DiagramNode,
  type DiagramEdge,
} from "../../components/diagrams/FlowDiagram";
import type { SceneContext } from "../../presentation/types";
import { pageJourneyAtStage } from "./model.mjs";
import { managementStages } from "./stages";
import { StageControls } from "./StageControls";

const SPACE_CAPTIONS = [
  "RAM yetersiz kaldığında bazı içerikler depolamadaki swap alanına taşınabilir.",
  "Bütün süreç veya sayfalar taşınabilir. Sonraki örnekte yalnız P sayfasını izleyeceğiz.",
  "Dosya sistemi içindeki bir dosyada swap alanı sağlanabilir; alan eklemek kolaylaşabilir.",
  "Swap ayrı bir raw bölümde de sağlanabilir. Bu, normal dosya/dizin hizmeti değildir.",
  "Farklı aygıtlardaki swap alanları I/O yükünü paylaşabilir.",
];
function PageTile({
  id,
  selected = false,
}: {
  id: string;
  selected?: boolean;
}) {
  return (
    <span
      className={`flex size-12 items-center justify-center rounded-lg border-2 font-display text-xl font-semibold md:size-16 md:text-3xl ${selected ? "border-blue bg-blue text-white" : "border-slate-300 bg-slate-100"}`}
    >
      {id}
    </span>
  );
}

export function SwapConcept({ stage, setStage, enabled }: SceneContext) {
  return (
    <Stage
      title="RAM yetmezse neyi, nereye taşırız?"
      controls={
        <StageControls
          stage={stage}
          setStage={setStage}
          labels={managementStages["swap-space"]}
        />
      }
    >
      <div className="flex w-full max-w-4xl flex-col items-center gap-5 md:gap-8">
        {stage === 0 ? (
          <>
            <div className="rounded-2xl border-2 border-ink bg-white p-5 md:p-8">
              <span className="mb-4 block text-center text-sm font-semibold">
                RAM · 3 dolu frame
              </span>
              <div className="flex gap-3">
                {["P", "Q", "R"].map((id) => (
                  <PageTile key={id} id={id} />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <PageTile id="S" selected />
              <span className="text-sm font-semibold">
                Yeni içerik için alan gerekiyor.
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border-2 border-dashed border-blue px-5 py-4 text-sm font-semibold">
              <HardDrive className="text-blue" /> Depolamada arka alan
            </div>
          </>
        ) : stage === 1 ? (
          <div className="grid w-full grid-cols-2 gap-4 md:gap-8">
            <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-ink bg-white p-4 md:p-6">
              <strong className="font-display text-xl md:text-2xl">
                Süreç bütünü
              </strong>
              <div className="flex flex-wrap justify-center gap-2 rounded-xl border-2 border-blue p-3">
                {["P", "Q", "R"].map((id) => (
                  <PageTile key={id} id={id} />
                ))}
              </div>
              <ArrowDown />
              <span className="text-xs font-semibold">Swapping</span>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-blue bg-blue/5 p-4 md:p-6">
              <strong className="font-display text-xl md:text-2xl">
                Sayfalar
              </strong>
              <PageTile id="P" selected />
              <ArrowDown />
              <span className="text-xs font-semibold">Paging · örneğimiz</span>
            </div>
          </div>
        ) : stage === 2 || stage === 3 ? (
          <div className="flex w-full max-w-2xl flex-col items-center gap-4 rounded-3xl border-2 border-ink bg-white p-5 md:p-8">
            <HardDrive className="size-12 text-blue md:size-16" />
            <strong className="font-display text-2xl md:text-3xl">
              Depolama aygıtı
            </strong>
            <div
              className={`w-full rounded-2xl border-2 p-4 ${stage === 2 ? "border-blue bg-blue/5" : "border-ink bg-slate-100"}`}
            >
              {stage === 2 && (
                <span className="mb-4 flex items-center justify-center gap-2 text-sm font-semibold">
                  <Layers3 size={20} /> Dosya sistemi
                </span>
              )}
              <div className="flex items-center justify-center gap-3 rounded-xl border-2 border-blue bg-white p-4">
                {stage === 2 ? (
                  <File size={30} className="text-blue" />
                ) : (
                  <HardDrive size={30} className="text-blue" />
                )}
                <span className="font-display text-lg font-semibold md:text-2xl">
                  {stage === 2 ? "Swap dosyası" : "Raw swap bölümü"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <FlowDiagram
            id="multiple-swap-areas"
            label="OS swap yönetimi I/O yükünü iki swap alanına paylaştırabilir"
            nodes={[
              {
                id: "swap-manager",
                label: "OS · swap yönetimi",
                icon: Layers3,
                tone: "active",
              },
              {
                id: "swap-area-1",
                label: "Swap alanı 1",
                icon: HardDrive,
                tone: "complete",
              },
              {
                id: "swap-area-2",
                label: "Swap alanı 2",
                icon: HardDrive,
                tone: "complete",
              },
            ]}
            edges={[
              { source: "swap-manager", target: "swap-area-1", active: true },
              { source: "swap-manager", target: "swap-area-2", active: true },
            ]}
            direction="TB"
            enabled={enabled}
            className="h-[clamp(220px,42dvh,380px)] w-full"
          />
        )}
        <StageCaption className="max-w-3xl text-center text-xs font-semibold text-slate-600 md:text-sm">
          {SPACE_CAPTIONS[stage]}
        </StageCaption>
      </div>
    </Stage>
  );
}

const JOURNEY_CAPTIONS = [
  "P bir sayfa kimliği; F0 RAM konumu, S0 swap konumudur.",
  "S0 hedef olarak ayrıldı; henüz geçerli veri yok. P, F0'da kalır.",
  "P dışarı yazılıyor. Yazma tamamlanmadan F0 serbest bırakılmaz.",
  "Yazma tamamlandı: S0 geçerli, F0 serbest. Yazma sayacı şimdi 1.",
  "P yeniden gerekli. S0'dan F0'a okuma başladı; P henüz RAM'de geçerli değil.",
  "P RAM'e döndü. Bu örnekte swap slot'u artık bırakılır; okuma sayacı 1.",
  "P'nin kimliği korundu. İki farklı konum arasında 1 yazma ve 1 okuma yapıldı.",
];
export function SwapJourney({ stage, setStage, enabled }: SceneContext) {
  const state = pageJourneyAtStage(stage);
  const summary = stage === 6;
  const nodes: DiagramNode[] = [
    {
      id: "ram-f0",
      label: "RAM · Frame F0",
      detail: state.ram
        ? "Sayfa P"
        : state.pending === "read"
          ? "Okuma için ayrıldı"
          : "Boş frame",
      position: { x: 0, y: 40 },
      tone: summary ? "complete" : state.ram ? "active" : "muted",
      body: (
        <span
          className="font-display text-3xl font-semibold"
          aria-label={`RAM F0: ${state.ram ?? "boş"}`}
        >
          {state.ram ?? "—"}
        </span>
      ),
    },
    {
      id: "swap-s0",
      label: "Swap · Slot S0",
      position: { x: 440, y: 40 },
      detail:
        state.slotStatus === "reserved"
          ? "Ayrıldı · henüz geçerli değil"
          : state.slotStatus === "valid"
            ? "Geçerli sayfa P"
            : "Boş slot",
      tone:
        state.slotStatus === "valid"
          ? "active"
          : state.slotStatus === "reserved"
            ? "default"
            : "muted",
      body: (
        <span
          className="inline-flex items-center gap-2 font-display text-3xl font-semibold"
          aria-label={`Swap S0: ${state.slotStatus === "reserved" ? "P için ayrılmış; veri henüz geçerli değil" : state.slotStatus === "valid" ? "P geçerli" : "boş"}`}
        >
          {state.slot ?? "—"}
          {state.slotStatus === "reserved" && <LockKeyhole size={18} />}
          {state.slotStatus === "valid" && <Check size={18} />}
        </span>
      ),
    },
  ];
  const edges: DiagramEdge[] = [
    {
      id: "page-write",
      source: "ram-f0",
      target: "swap-s0",
      label: state.writes ? "Yazma tamamlandı" : "Yazma",
      active: state.pending === "write" || state.writes > 0,
      muted: state.pending !== "write" && state.writes === 0,
      animated: state.pending === "write",
      sourceSide: "right",
      targetSide: "left",
    },
    {
      id: "page-read",
      source: "swap-s0",
      target: "ram-f0",
      label: state.reads ? "Okuma tamamlandı" : "Okuma",
      active: state.pending === "read" || state.reads > 0,
      muted: state.pending !== "read" && state.reads === 0,
      animated: state.pending === "read",
      sourceSide: "bottom",
      targetSide: "bottom",
    },
  ];
  return (
    <Stage
      title={
        summary
          ? "Kimlik aynı. Konum ve maliyet farklı."
          : "Bir sayfanın dışarı ve geri yolculuğu."
      }
      controls={
        <StageControls
          stage={stage}
          setStage={setStage}
          labels={managementStages["swap-journey"]}
        />
      }
    >
      <div className="flex w-full max-w-3xl flex-col items-center gap-3 md:gap-4">
        {summary && (
          <div className="rounded-full bg-blue/10 px-5 py-2 text-sm font-semibold text-blue">
            P · Sayfa kimliği
          </div>
        )}
        <FlowDiagram
          id="page-swap-journey"
          label={`P sayfası; RAM F0 ${state.ram ?? "boş"}, swap S0 ${state.slotStatus === "reserved" ? "P için ayrılmış, henüz geçerli değil" : state.slotStatus === "valid" ? "P geçerli" : "boş"}; ${state.writes} yazma, ${state.reads} okuma`}
          nodes={nodes}
          edges={edges}
          enabled={enabled}
          className="h-[clamp(220px,35dvh,320px)] w-full"
        />
        {state.pending && (
          <span role="status" className="text-sm font-semibold text-blue">
            P · {state.pending === "write" ? "yazma sürüyor" : "okuma sürüyor"}
          </span>
        )}
        <div className="flex gap-6 text-xs font-semibold md:text-sm">
          <span>
            Yazma{" "}
            <strong className="ml-1 font-display text-xl text-blue">
              {state.writes}
            </strong>
          </span>
          <span>
            Okuma{" "}
            <strong className="ml-1 font-display text-xl text-blue">
              {state.reads}
            </strong>
          </span>
        </div>
        <StageCaption className="text-center text-xs font-semibold text-slate-600 md:text-sm">
          {JOURNEY_CAPTIONS[stage]}
        </StageCaption>
      </div>
    </Stage>
  );
}
