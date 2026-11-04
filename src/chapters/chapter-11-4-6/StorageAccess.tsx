import { Database, File, FolderOpen, HardDrive } from "lucide-react";
import { Stage } from "../../components/presentation/ScenePrimitives";
import { StageCaption } from "../../presentation/PresentationMotion";
import {
  FlowDiagram,
  type DiagramNode,
  type DiagramEdge,
} from "../../components/diagrams/FlowDiagram";
import type { SceneContext } from "../../presentation/types";
import { managementStages } from "./stages";
import { StageControls } from "./StageControls";

const CAPTIONS = [
  "Aygıt, mantıksal bloklarla okunur ve yazılır.",
  "Dosya sistemi blokları gruplar; çizimde her cluster yalnız örnek olarak dört bloktur.",
  "Normal dosya yolu: dosya sistemi, dosya işlemini blok işlemlerine dönüştürür.",
  "Raw erişimde uygulama blok düzenini üstlenir; OS I/O ve sürücüler yine erişim yolundadır.",
];

export function StorageAccess({ stage, setStage, enabled }: SceneContext) {
  const raw = stage === 3;
  const grouped = stage >= 1 && !raw;
  const nodes: DiagramNode[] = [
    {
      id: "application",
      label: raw ? "Veritabanı" : "Uygulama",
      icon: raw ? Database : File,
      tone: "complete",
    },
    {
      id: "block-manager",
      label: raw ? "Kendi blok yönetimi" : "Dosya sistemi",
      icon: raw ? Database : FolderOpen,
      tone: "active",
    },
    { id: "os-io", label: "OS I/O", detail: "Sürücüler", tone: "complete" },
    {
      id: "block-device",
      label: "Mantıksal blok aygıtı",
      icon: HardDrive,
      tone: "complete",
    },
  ];
  const edges: DiagramEdge[] = nodes.slice(1).map((node, index) => ({
    id: `storage-access-${index}`,
    source: nodes[index].id,
    target: node.id,
    active: true,
  }));
  return (
    <Stage
      title="Blokları kim yönetiyor?"
      controls={
        <StageControls
          stage={stage}
          setStage={setStage}
          labels={managementStages["storage-access-modes"]}
        />
      }
    >
      <div className="flex w-full max-w-4xl flex-col items-center gap-3 md:gap-4">
        {stage >= 2 && (
          <FlowDiagram
            id="storage-access-path"
            label={
              raw
                ? "Veritabanı → kendi blok yönetimi → OS I/O ve sürücüler → blok aygıtı"
                : "Uygulama → dosya sistemi → OS I/O ve sürücüler → blok aygıtı"
            }
            nodes={nodes}
            edges={edges}
            enabled={enabled}
            className="h-[clamp(146px,24dvh,220px)] w-full"
          />
        )}
        <div className="w-full rounded-2xl border-2 border-ink bg-white p-4 md:p-6">
          <span className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold">
            <HardDrive size={20} /> Mantıksal blok aygıtı
          </span>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 4 }, (_, cluster) => (
              <div
                key={cluster}
                className={`state-cell rounded-xl border-2 p-2 ${grouped ? "border-blue bg-blue/5" : "border-transparent"}`}
              >
                <div className="grid grid-cols-4 gap-1">
                  {Array.from({ length: 4 }, (_, block) => (
                    <span
                      key={block}
                      className="flex h-9 items-center justify-center rounded-md border border-slate-400 bg-slate-100 text-[10px] font-semibold md:h-12 md:text-sm"
                    >
                      {cluster * 4 + block}
                    </span>
                  ))}
                </div>
                {grouped && (
                  <span className="mt-2 block text-center text-[10px] font-semibold text-blue">
                    Cluster {cluster}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <StageCaption className="text-center text-xs font-semibold text-slate-600 md:text-sm">
          {CAPTIONS[stage]}
        </StageCaption>
      </div>
    </Stage>
  );
}
