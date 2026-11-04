import {
  ArrowRight,
  Cloud,
  HardDrive,
  Laptop,
  Layers,
  Network,
  Server,
} from "lucide-react";
import { Stage } from "../../components/presentation/ScenePrimitives";
import { StageCaption } from "../../presentation/PresentationMotion";
import {
  FlowDiagram,
  type DiagramNode,
  type DiagramEdge,
} from "../../components/diagrams/FlowDiagram";
import type { SceneContext } from "../../presentation/types";
import { StoryControls } from "./StoryControls";

type PathNode = {
  label: string;
  detail: string;
  type?: "host" | "network" | "disk" | "server" | "cloud";
};
const ICONS = {
  host: Laptop,
  network: Network,
  disk: HardDrive,
  server: Server,
  cloud: Cloud,
};

function PathDiagram({
  id,
  nodes,
  active,
  fsIndex = -1,
  enabled,
}: {
  id: string;
  nodes: PathNode[];
  active: number;
  fsIndex?: number;
  enabled: boolean;
}) {
  const graphNodes: DiagramNode[] = nodes.map((node, index) => ({
    id: `step-${index}`,
    label: node.label,
    detail: node.detail,
    icon: ICONS[node.type ?? "disk"],
    tone: active === index ? "active" : index < active ? "complete" : "default",
    badge: fsIndex === index ? "Dosya sistemi" : undefined,
  }));
  const graphEdges: DiagramEdge[] = nodes.slice(1).map((_, index) => ({
    id: `route-${index}`,
    source: `step-${index}`,
    target: `step-${index + 1}`,
    active: index < active,
    muted: index >= active,
    animated: index + 1 === active,
  }));
  return (
    <FlowDiagram
      id={id}
      label={nodes
        .map(
          (node, index) =>
            `${node.label}: ${node.detail}${index === active ? ", açıklanan aşama" : ""}${index === fsIndex ? ", dosya sistemi burada" : ""}`,
        )
        .join(" → ")}
      nodes={graphNodes}
      edges={graphEdges}
      enabled={enabled}
      direction="LR"
      className="min-h-0 w-full flex-1"
    />
  );
}

function Caption({ children }: { children: string }) {
  return (
    <StageCaption className="max-w-4xl text-center text-sm font-semibold leading-relaxed md:text-xl">
      {children}
    </StageCaption>
  );
}

function AccessAxes() {
  return (
    <div className="grid w-full max-w-4xl grid-cols-2 gap-4 md:gap-8">
      {[
        {
          title: "Hangi yoldan?",
          labels: ["Host I/O", "Ağ", "WAN / Internet"],
        },
        { title: "Hangi arayüz?", labels: ["Blok", "Dosya", "Hizmet API’si"] },
      ].map((axis) => (
        <section
          key={axis.title}
          className="rounded-2xl border-2 border-ink bg-white p-4 md:p-7"
        >
          <h2 className="mb-5 font-display text-xl font-semibold md:text-3xl">
            {axis.title}
          </h2>
          {axis.labels.map((label) => (
            <div
              key={label}
              className="my-2 rounded-xl bg-blue/10 p-3 text-sm font-semibold text-blue md:text-xl"
            >
              {label}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

export function HostAttachedScene(context: SceneContext) {
  const { stage } = context;
  const captions = [
    "Aygıt hazır. Host ona hangi bağlantı yoluyla ulaşır?",
    "Host-attached erişim yerel I/O portu üzerinden aygıta ulaşır.",
    "Bir bus, host ile birden çok aygıtın bağlantısını taşıyabilir.",
    "Kaynak FC fabric örneğinde birden çok host ve depolama aygıtı bağlanabilir.",
    "Bağlantı konumu ve sunulan arayüz ayrı eksenlerdir; bu etiketler birbirini dışlayan üç ürün sınıfı değildir.",
  ];
  return (
    <Stage
      title="Depolamaya hangi yoldan ulaşırız?"
      controls={<StoryControls {...context} />}
    >
      <div className="flex h-full min-h-0 w-full max-w-6xl flex-col items-center justify-center gap-4 md:gap-7">
        {stage === 4 ? (
          <AccessAxes />
        ) : stage === 3 ? (
          <FabricDiagram
            id="host-fc-fabric"
            stage={2}
            enabled={context.enabled}
            generic
          />
        ) : (
          <PathDiagram
            id="host-attached-path"
            enabled={context.enabled}
            active={stage === 0 ? -1 : stage === 1 ? 1 : 2}
            nodes={
              stage === 0
                ? [
                    {
                      label: "Host",
                      detail: "Hazır aygıta erişim",
                      type: "host",
                    },
                    { label: "?", detail: "Bağlantı yolu", type: "network" },
                    { label: "Depolama", detail: "Veri", type: "disk" },
                  ]
                : stage === 1
                  ? [
                      { label: "Host", detail: "I/O isteği", type: "host" },
                      {
                        label: "Yerel port",
                        detail: "Host bağlantısı",
                        type: "network",
                      },
                      { label: "Aygıt", detail: "Blok erişimi", type: "disk" },
                    ]
                  : [
                      { label: "Host", detail: "I/O portu", type: "host" },
                      {
                        label: "Bus",
                        detail: "Birden çok bağlantı",
                        type: "network",
                      },
                      {
                        label: "Aygıtlar",
                        detail: "D0 · D1 · D2",
                        type: "server",
                      },
                    ]
            }
          />
        )}
        <Caption>{captions[stage]}</Caption>
      </div>
    </Stage>
  );
}

export function NasScene(context: SceneContext) {
  const { stage } = context;
  const captions = [
    "İstemci /sunum.pdf verisini istiyor. Uzaktaki dosyayı hangi uç yönetir?",
    "NAS, NFS/CIFS gibi dosya protokolleriyle uzak dosya sistemi hizmeti sunar.",
    "Kaynak örneğinde uzak çağrılar IP üzerinde TCP/UDP ile taşınır; fiziksel ağ, hizmet semantiği değildir.",
    "Sunucunun dosya sistemi dosya isteğini kendi aygıtındaki blok işlemlerine dönüştürür.",
    "Karşı örnek: iSCSI, SCSI/blok erişimini IP üzerinden taşır. NAS dosya protokolü değildir.",
    "Aynı ağda dosya hizmeti de blok hacmi de sunulabilir. Dosya sistemi sorumluluğu farklı uçtadır.",
  ];
  const fileNodes: PathNode[] = [
    { label: "İstemci", detail: "/sunum.pdf", type: "host" },
    {
      label: stage === 2 ? "IP · RPC" : "NFS / CIFS",
      detail: stage === 2 ? "TCP / UDP" : "Dosya protokolü",
      type: "network",
    },
    { label: "Sunucu", detail: "Dosya → blok", type: "server" },
    { label: "Aygıt", detail: "Mantıksal blok", type: "disk" },
  ];
  return (
    <Stage
      title="Ağda dosya mı, blok mu?"
      controls={
        <StoryControls
          {...context}
          choices={[
            { label: "NAS", stage: 0, until: 3 },
            { label: "iSCSI", stage: 4 },
            { label: "Karşılaştır", stage: 5 },
          ]}
        />
      }
    >
      <div className="flex h-full min-h-0 w-full max-w-6xl flex-col items-center justify-center gap-4 md:gap-6">
        {stage === 5 ? (
          <div className="grid w-full max-w-4xl grid-cols-2 gap-4">
            {[
              { title: "NAS", api: "Dosya / dizin", fs: "Sunucu" },
              { title: "iSCSI örneği", api: "Blok / LBA", fs: "Host" },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border-2 border-ink bg-white p-5 text-center"
              >
                <h2 className="font-display text-2xl font-semibold text-blue">
                  {item.title}
                </h2>
                <p className="my-5 text-lg font-semibold">{item.api}</p>
                <p className="text-sm">
                  Dosya sistemi: <strong>{item.fs}</strong>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <PathDiagram
            id="nas-access-path"
            enabled={context.enabled}
            nodes={
              stage === 4
                ? [
                    { label: "Host", detail: "Dosya sistemi", type: "host" },
                    {
                      label: "IP · iSCSI",
                      detail: "SCSI komutları",
                      type: "network",
                    },
                    { label: "Blok hacmi", detail: "LBA 42", type: "disk" },
                  ]
                : fileNodes
            }
            active={stage === 4 ? 1 : stage === 0 ? 0 : stage < 3 ? 1 : 2}
            fsIndex={stage === 4 ? 0 : stage === 3 ? 2 : -1}
          />
        )}
        <Caption>{captions[stage]}</Caption>
      </div>
    </Stage>
  );
}

export function CloudScene(context: SceneContext) {
  const { stage } = context;
  const captions = [
    "Program uzak depolama hizmetinde bir işlem oluşturur.",
    "İstek WAN / Internet üzerinden uzak veri merkezine gider.",
    "API bir fiziksel aygıt değil, programın hizmeti kullandığı arayüzdür.",
    "Uzak hizmet yanıt verebilir; bağlantı veya işlem başarısız da olabilir.",
    "Kitabın API gerekçesi yalnız aktarım hızı değildir: gecikme ve başarısızlık durumları da ele alınır.",
  ];
  return (
    <Stage
      title="Uzak depolamaya API ile erişim"
      controls={<StoryControls {...context} />}
    >
      <div className="flex h-full min-h-0 w-full max-w-6xl flex-col items-center justify-center gap-4 md:gap-6">
        {stage === 4 ? (
          <div className="grid w-full max-w-3xl grid-cols-2 gap-5">
            <div className="rounded-2xl border-2 border-blue bg-white p-7 text-center">
              <Cloud className="mx-auto size-16 text-blue" />
              <h2 className="mt-5 font-display text-2xl font-semibold">
                Gecikme
              </h2>
            </div>
            <div className="rounded-2xl border-2 border-orange bg-orange/5 p-7 text-center">
              <Network className="mx-auto size-16 text-orange" />
              <h2 className="mt-5 font-display text-2xl font-semibold">
                Başarısızlık
              </h2>
            </div>
          </div>
        ) : (
          <>
            <PathDiagram
              id="cloud-api-path"
              enabled={context.enabled}
              nodes={[
                { label: "Program", detail: "Depolama işlemi", type: "host" },
                {
                  label: "WAN / Internet",
                  detail: "Uzak bağlantı",
                  type: "cloud",
                },
                { label: "API", detail: "Hizmet arayüzü", type: "network" },
                {
                  label: "Veri merkezi",
                  detail: "Uzak depolama",
                  type: "server",
                },
              ]}
              active={stage}
            />
            {stage === 3 && (
              <div className="flex gap-3 text-sm font-semibold">
                <span className="rounded-lg bg-blue/10 p-3 text-blue">
                  Yanıt
                </span>
                <span className="rounded-lg bg-orange/10 p-3">
                  Hata / yanıt yok
                </span>
              </div>
            )}
          </>
        )}
        <Caption>{captions[stage]}</Caption>
      </div>
    </Stage>
  );
}

export function StorageArrayScene(context: SceneContext) {
  const { stage } = context;
  const captions = [
    "Host tek aygıta veya aygıtları birleştiren bir depolama dizisine bağlanabilir.",
    "Dizi host portları ve denetleyici üzerinden erişim sunar.",
    "Denetleyici bellek/yazılım ve çok sayıda diski yönetir; çizimdeki dört disk yalnız temsildir.",
    "Birden çok host paylaşılan dizi kaynaklarını kullanabilir; hacimler ve hizmetler ayrıca düzenlenir.",
    "RAID, snapshot, clone, thin provisioning, replication ve deduplication farklı görevlerdir; hepsi RAID seviyesi değildir.",
  ];
  return (
    <Stage
      title="Bir depolama dizisinin içi"
      controls={<StoryControls {...context} />}
    >
      <div className="flex h-full min-h-0 w-full max-w-5xl flex-col items-center justify-center gap-4 md:gap-6">
        {(stage === 0 || stage === 4) && (
          <div className="flex items-center justify-center gap-5">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Laptop />
              Host A
            </span>
            {stage >= 3 && (
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Laptop />
                Host B
              </span>
            )}
            <ArrowRight />
          </div>
        )}
        {stage === 0 ? (
          <div className="flex gap-6">
            <div className="rounded-2xl border-2 border-ink bg-white p-6 text-center">
              <HardDrive className="mx-auto size-16" />
              <strong>Tek aygıt</strong>
            </div>
            <div className="rounded-2xl border-2 border-blue bg-blue/5 p-6 text-center">
              <Layers className="mx-auto size-16 text-blue" />
              <strong>Depolama dizisi</strong>
            </div>
          </div>
        ) : stage === 4 ? (
          <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3">
            {[
              "RAID",
              "Snapshot",
              "Clone",
              "Thin provisioning",
              "Replication",
              "Deduplication",
            ].map((name) => (
              <div
                key={name}
                className={`rounded-xl border-2 p-4 text-center text-sm font-semibold md:text-lg ${name === "RAID" ? "border-blue bg-blue text-white" : "border-ink bg-white"}`}
              >
                {name}
              </div>
            ))}
          </div>
        ) : (
          <ArrayStructure stage={stage} enabled={context.enabled} />
        )}
        <Caption>{captions[stage]}</Caption>
      </div>
    </Stage>
  );
}

function ArrayStructure({
  stage,
  enabled,
}: {
  stage: number;
  enabled: boolean;
}) {
  const nodes: DiagramNode[] = [
    {
      id: "host-a",
      label: "Host A",
      detail: "Diziye erişim",
      icon: Laptop,
      tone: "active",
    },
    {
      id: "ports",
      label: "Host portları",
      detail: "Bağlantı uçları",
      icon: Network,
      tone: stage === 1 ? "active" : "complete",
    },
    {
      id: "controller",
      label: "Denetleyici",
      detail:
        stage >= 2 ? "Bellek / NVRAM · yönetim yazılımı" : "Host isteğini alır",
      icon: Layers,
      tone: stage >= 2 ? "active" : "default",
    },
  ];
  const edges: DiagramEdge[] = [
    { source: "host-a", target: "ports", active: true },
    {
      source: "ports",
      target: "controller",
      active: true,
      animated: stage === 1,
    },
  ];
  if (stage >= 2) {
    nodes.push({
      id: "disks",
      label: "Disk grubu",
      detail: "D0 · D1 · D2 · D3",
      icon: HardDrive,
      tone: "complete",
      badge: "Temsili aygıtlar",
    });
    edges.push({
      source: "controller",
      target: "disks",
      active: true,
      animated: stage === 2,
    });
  }
  if (stage === 3) {
    nodes.push({
      id: "host-b",
      label: "Host B",
      detail: "Paylaşılan diziye erişim",
      icon: Laptop,
      badge: "Ayrı hacim",
    });
    edges.push({
      source: "host-b",
      target: "ports",
      active: true,
      label: "Host B hacmi",
    });
    edges[0] = { ...edges[0], label: "Host A hacmi" };
  }
  const positions: Record<string, { x: number; y: number }> =
    stage === 1
      ? {
          "host-a": { x: 0, y: 0 },
          ports: { x: 320, y: 0 },
          controller: { x: 640, y: 0 },
        }
      : {
          "host-a": { x: 0, y: 0 },
          "host-b": { x: 0, y: 210 },
          ports: { x: 330, y: 0 },
          controller: { x: 330, y: 210 },
          disks: { x: 680, y: 210 },
        };
  for (const node of nodes) node.position = positions[node.id];
  if (stage >= 2) {
    edges[1].sourceSide = "bottom";
    edges[1].targetSide = "top";
  }
  return (
    <FlowDiagram
      id="storage-array-structure"
      label={`Host portları → denetleyici${stage >= 2 ? " → temsili disk grubu; bellek/NVRAM ve yazılım denetleyicide" : ""}${stage === 3 ? ". Host A ve Host B paylaşılan dizide ayrı hacimler kullanır." : "."}`}
      nodes={nodes}
      edges={edges}
      enabled={enabled}
      direction="LR"
      className="diagram-expanded"
    />
  );
}

function FabricDiagram({
  id,
  stage,
  enabled,
  generic = false,
}: {
  id: string;
  stage: number;
  enabled: boolean;
  generic?: boolean;
}) {
  const nodes: DiagramNode[] = [
    {
      id: "host-a",
      label: "Host A",
      detail: stage >= 4 ? "LUN A görünür" : "I/O isteği",
      icon: Laptop,
      tone: stage >= 2 ? "active" : "default",
      badge: stage >= 4 ? "Yalnız LUN A" : undefined,
    },
    {
      id: "host-b",
      label: "Host B",
      detail: stage >= 4 ? "LUN B görünür" : "I/O isteği",
      icon: Laptop,
      badge: stage >= 4 ? "Yalnız LUN B" : undefined,
    },
    {
      id: "fabric",
      label:
        stage === 0 ? "Bağlantı?" : generic ? "FC fabric" : "Switch / fabric",
      detail:
        stage === 0
          ? "Hostlar ve diziler"
          : generic
            ? "Ortak bağlantı"
            : "FC / InfiniBand",
      icon: Network,
      tone: stage === 0 ? "muted" : "active",
    },
    {
      id: "array-a",
      label: generic ? "Depolama A" : "Dizi 1",
      detail: generic ? "Aygıt bağlantısı" : "Blok erişimi",
      icon: Server,
      tone: stage >= 2 ? "complete" : "default",
    },
    {
      id: "array-b",
      label: generic ? "Depolama B" : "Dizi 2",
      detail: generic ? "Aygıt bağlantısı" : "Blok erişimi",
      icon: Server,
    },
  ];
  const edges: DiagramEdge[] = [
    {
      id: "a-to-fabric",
      source: "host-a",
      target: "fabric",
      active: stage >= 2,
      muted: stage === 0,
      animated: stage === 2,
    },
    {
      id: "b-to-fabric",
      source: "host-b",
      target: "fabric",
      muted: stage === 0,
    },
    {
      id: "fabric-to-a",
      source: "fabric",
      target: "array-a",
      active: stage >= 2,
      muted: stage === 0,
      animated: stage === 2,
    },
    {
      id: "fabric-to-b",
      source: "fabric",
      target: "array-b",
      muted: stage === 0,
    },
  ];
  if (stage >= 3 && stage < 5 && !generic) {
    nodes.push(
      {
        id: "lun-a",
        label: "LUN A",
        detail: "Sunulan blok hacmi",
        icon: HardDrive,
        badge: stage >= 4 ? "Yalnız Host A" : "Görünürlük seçilmedi",
        tone: stage >= 4 ? "active" : "default",
      },
      {
        id: "lun-b",
        label: "LUN B",
        detail: "Sunulan blok hacmi",
        icon: HardDrive,
        badge: stage >= 4 ? "Yalnız Host B" : "Görünürlük seçilmedi",
      },
    );
    edges.push(
      {
        id: "array-a-volume",
        source: "array-a",
        target: "lun-a",
        active: stage >= 4,
        label: "Hacim",
      },
      {
        id: "array-b-volume",
        source: "array-b",
        target: "lun-b",
        label: "Hacim",
      },
    );
  }
  if (stage === 5) {
    nodes.find((node) => node.id === "array-a")!.badge = "LUN A · Host A";
    nodes.find((node) => node.id === "array-b")!.badge = "LUN B · Host B";
    nodes.push({
      id: "communications",
      label: "İletişim ağı",
      detail: "Ayrı düzenlenebilir",
      icon: Cloud,
      badge: "iSCSI / FCoE bağlamı",
    });
    edges.push(
      {
        id: "a-communications",
        source: "host-a",
        target: "communications",
        muted: true,
        label: "İletişim yolu",
      },
      {
        id: "b-communications",
        source: "host-b",
        target: "communications",
        muted: true,
      },
    );
  }
  const positions: Record<string, { x: number; y: number }> = {
    "host-a": { x: 0, y: 0 },
    "host-b": { x: 0, y: 210 },
    fabric: { x: 290, y: stage === 5 ? 210 : 105 },
    "array-a": { x: 580, y: 0 },
    "array-b": { x: 580, y: 210 },
    "lun-a": { x: 870, y: 0 },
    "lun-b": { x: 870, y: 210 },
    communications: { x: 290, y: 0 },
  };
  for (const node of nodes) node.position = positions[node.id];
  return (
    <FlowDiagram
      id={id}
      label={
        generic
          ? "İki host FC fabric üzerinden iki depolama aygıtına bağlanır."
          : `İki host, switch/fabric ve iki dizi. ${stage >= 4 ? "LUN masking: Host A yalnız LUN A, Host B yalnız LUN B görür. Fiziksel bağlantı ile hacim görünürlüğü farklıdır." : "Hacim görünürlüğü henüz seçilmedi."}`
      }
      nodes={nodes}
      edges={edges}
      enabled={enabled}
      direction="LR"
      className="diagram-expanded"
    />
  );
}

export function SanScene(context: SceneContext) {
  const { stage } = context;
  const captions = [
    "Büyük ortamlarda birden çok host, birden çok depolama dizisini kullanabilir.",
    "Switch/fabric bu host ve dizileri bir depolama ağıyla bağlar.",
    "İstek host’tan fabric üzerinden hedef diziye gider; bu bir blok erişim yoludur.",
    "Dizi, host’a LUN olarak sunulacak hacimler içerir. Görünürlük ayrıca seçilir.",
    "LUN masking örneği: Host A yalnız LUN A’yı, Host B yalnız LUN B’yi görür.",
    "Depolama ve iletişim ağlarının ayrımı bir mimari karardır. Ortak blok hacmi tek başına dosya sistemi tutarlılığı sağlamaz.",
  ];
  return (
    <Stage
      title="Birçok host, birçok dizi"
      controls={<StoryControls {...context} />}
    >
      <div className="flex h-full min-h-0 w-full max-w-6xl flex-col items-center justify-center gap-3 md:gap-5">
        <FabricDiagram
          id="san-fabric"
          stage={stage}
          enabled={context.enabled}
        />
        <Caption>{captions[stage]}</Caption>
      </div>
    </Stage>
  );
}
