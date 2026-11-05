import {
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
  return (
    <FlowDiagram
      id={id}
      label={nodes
        .map(
          (node, index) =>
            `${node.label}: ${node.detail}${index === fsIndex ? ", dosya sistemi burada" : ""}`,
        )
        .join(" → ")}
      nodes={nodes.map((node, index) => ({
        id: `step-${index}`,
        label: node.label,
        detail: node.detail,
        icon: ICONS[node.type ?? "disk"],
        tone:
          active === index ? "active" : index < active ? "complete" : "default",
        badge: fsIndex === index ? "Dosya sistemi" : undefined,
      }))}
      edges={nodes
        .slice(1)
        .map((_, index) => ({
          id: `route-${index}`,
          source: `step-${index}`,
          target: `step-${index + 1}`,
          active: index < active,
          muted: index >= active,
          animated: index + 1 === active,
        }))}
      enabled={enabled}
      direction="LR"
      className="diagram-expanded"
    />
  );
}

function Caption({ children }: { children: string }) {
  return <StageCaption className="attachment-caption">{children}</StageCaption>;
}

export function HostAttachedScene(context: SceneContext) {
  const { stage, enabled } = context;
  const bus = stage === 2;
  const captions = [
    "Host-attached depolama, bilgisayarın yerel I/O portu üzerinden bağlanır.",
    "I/O isteği host’tan yerel bağlantı üzerinden depolama aygıtına gider.",
    "Bir bus birden çok aygıtı bağlayabilir. Üst düzey sistemlerde Fibre Channel (FC) de kullanılır.",
  ];
  const nodes: DiagramNode[] = [
    {
      id: "host",
      label: "Host",
      detail: "I/O isteği",
      icon: Laptop,
      tone: stage === 0 ? "active" : "complete",
      position: { x: 0, y: 110 },
    },
    {
      id: "port",
      label: bus ? "Depolama bus’ı" : "Yerel I/O portu",
      detail: bus ? "Birden çok aygıt" : "Doğrudan bağlantı",
      icon: Network,
      tone: stage >= 1 ? "active" : "default",
      position: { x: 320, y: 110 },
    },
    {
      id: "disk-a",
      label: bus ? "Aygıt A" : "Depolama aygıtı",
      detail: "Blok erişimi",
      icon: HardDrive,
      tone: stage >= 1 ? "complete" : "default",
      position: { x: 640, y: 110 },
    },
  ];
  const edges: DiagramEdge[] = [
    {
      source: "host",
      target: "port",
      active: stage >= 1,
      animated: stage === 1,
    },
    {
      source: "port",
      target: "disk-a",
      active: stage >= 1,
      animated: stage === 1,
    },
  ];
  if (bus) {
    nodes.push({
      id: "disk-b",
      label: "Aygıt B",
      detail: "Aynı bus",
      icon: HardDrive,
      position: { x: 640, y: 310 },
    });
    edges.push({
      source: "port",
      target: "disk-b",
      active: true,
      animated: true,
    });
  }
  return (
    <Stage
      title="Host-attached: yerel I/O bağlantısı"
      controls={<StoryControls {...context} />}
    >
      <div className="attachment-scene">
        <FlowDiagram
          id="host-attached-path"
          label={
            bus
              ? "Host aynı yerel bus üzerinden Aygıt A ve Aygıt B’ye ulaşır."
              : "Host, yerel I/O portu üzerinden depolama aygıtına ulaşır."
          }
          nodes={nodes}
          edges={edges}
          enabled={enabled}
          className="diagram-expanded"
        />
        <div className="attachment-facts">
          <span>USB</span>
          <span>FireWire</span>
          <span>Thunderbolt</span>
        </div>
        <Caption>{captions[stage]}</Caption>
      </div>
    </Stage>
  );
}

export function NasScene(context: SceneContext) {
  const { stage, enabled } = context;
  const block = stage === 3;
  const captions = [
    "NAS, ağ üzerinden uzak bir dosya sistemine erişim sağlar. İstemci bir dosya ister.",
    "NFS ve CIFS dosya işlemlerini IP ağı üzerinden uzak çağrılarla taşır.",
    "NAS sunucusu dosya sistemini yönetir ve dosya isteğini depolama bloklarına dönüştürür.",
    "Aynı IP ağı blok erişimi de taşıyabilir: iSCSI, SCSI komutlarını uzak aygıta iletir.",
  ];
  return (
    <Stage
      title="Network-attached: ağdan depolamaya"
      controls={
        <StoryControls
          {...context}
          choices={[
            { label: "NAS · dosya", stage: 0, until: 2 },
            { label: "iSCSI · blok", stage: 3 },
          ]}
        />
      }
    >
      <div className="attachment-scene">
        <PathDiagram
          id="nas-access-path"
          enabled={enabled}
          active={stage === 0 ? 0 : stage === 1 ? 1 : 3}
          fsIndex={block ? 0 : 2}
          nodes={
            block
              ? [
                  {
                    label: "Host",
                    detail: "Dosya sistemi host’ta",
                    type: "host",
                  },
                  {
                    label: "IP · iSCSI",
                    detail: "SCSI komutları",
                    type: "network",
                  },
                  {
                    label: "Uzak aygıt",
                    detail: "Blok arayüzü",
                    type: "server",
                  },
                  { label: "Blok", detail: "Mantıksal adres", type: "disk" },
                ]
              : [
                  { label: "İstemci", detail: "/sunum.pdf", type: "host" },
                  {
                    label: "IP ağı",
                    detail: "NFS / CIFS · RPC",
                    type: "network",
                  },
                  {
                    label: "NAS sunucusu",
                    detail: "Dosya işlemleri",
                    type: "server",
                  },
                  { label: "Depolama", detail: "Blok işlemleri", type: "disk" },
                ]
          }
        />
        <div className="attachment-facts">
          <span className={block ? "" : "attachment-fact-active"}>
            {block ? "Ağ: IP" : "İstek: /sunum.pdf"}
          </span>
          <span className={block ? "attachment-fact-active" : ""}>
            {block ? "Erişim: blok" : "Erişim: dosya / dizin"}
          </span>
        </div>
        <Caption>{captions[stage]}</Caption>
      </div>
    </Stage>
  );
}

export function CloudScene(context: SceneContext) {
  const { stage, enabled } = context;
  const captions = [
    "Program, bulut depolama hizmetinin API’sini kullanır.",
    "API isteği Internet veya WAN üzerinden uzak veri merkezine gider.",
    "Uzak veri merkezi depolama hizmetini sağlar. Program yanıtı ağ üzerinden alır.",
    "Uzak erişimin gecikmesi ve başarısızlık durumları, API kullanımının gerekçeleridir.",
  ];
  return (
    <Stage
      title="Cloud: Internet üzerinden API erişimi"
      controls={<StoryControls {...context} />}
    >
      <div className="attachment-scene">
        <PathDiagram
          id="cloud-api-path"
          enabled={enabled}
          active={Math.min(stage, 2)}
          nodes={[
            { label: "Program", detail: "Depolama API’si", type: "host" },
            { label: "Internet / WAN", detail: "Uzak bağlantı", type: "cloud" },
            {
              label: "Veri merkezi",
              detail: "Depolama hizmeti",
              type: "server",
            },
          ]}
        />
        <div className="attachment-facts">
          <span className={stage === 3 ? "attachment-fact-active" : ""}>
            Gecikme
          </span>
          <span className={stage === 3 ? "attachment-fact-active" : ""}>
            Bağlantı / hizmet hatası
          </span>
        </div>
        <Caption>{captions[stage]}</Caption>
      </div>
    </Stage>
  );
}

export function StorageArrayScene(context: SceneContext) {
  const { stage, enabled } = context;
  const captions = [
    "Host tek bir diske veya birden çok diski birleştiren depolama dizisine bağlanabilir.",
    "Dizinin host portları, bilgisayarların denetleyiciye bağlanmasını sağlar.",
    "Denetleyici, bellek ve yönetim yazılımı disk grubunu birlikte yönetir.",
    "Birden çok host aynı depolama dizisinden yararlanabilir. SAN, host’larla dizileri bir ağda birleştirir.",
  ];
  const nodes: DiagramNode[] = [
    {
      id: "host-a",
      label: "Host A",
      detail: "Diziye erişim",
      icon: Laptop,
      tone: "complete",
      position: { x: 0, y: 0 },
    },
    {
      id: "ports",
      label: "Host portları",
      detail: "Bağlantı uçları",
      icon: Network,
      tone: stage === 1 ? "active" : "default",
      position: { x: 330, y: 0 },
    },
    {
      id: "controller",
      label: "Denetleyici",
      detail: "Bellek · yönetim yazılımı",
      icon: Layers,
      tone: stage === 2 ? "active" : "default",
      position: { x: 330, y: 220 },
    },
    {
      id: "disks",
      label: "Disk grubu",
      detail: "Birden çok aygıt",
      icon: HardDrive,
      tone: stage >= 2 ? "complete" : "default",
      position: { x: 680, y: 220 },
    },
  ];
  const edges: DiagramEdge[] = [
    {
      source: "host-a",
      target: "ports",
      active: stage >= 1,
      animated: stage === 1,
    },
    {
      source: "ports",
      target: "controller",
      active: stage >= 2,
      animated: stage === 2,
      sourceSide: "bottom",
      targetSide: "top",
    },
    {
      source: "controller",
      target: "disks",
      active: stage >= 2,
      animated: stage === 2,
    },
  ];
  if (stage === 3) {
    nodes.push({
      id: "host-b",
      label: "Host B",
      detail: "Aynı diziye erişim",
      icon: Laptop,
      tone: "active",
      position: { x: 0, y: 220 },
    });
    edges.push({
      source: "host-b",
      target: "ports",
      active: true,
      animated: true,
    });
  }
  return (
    <Stage
      title="Depolama dizisi: denetleyici ve diskler"
      controls={<StoryControls {...context} />}
    >
      <div className="attachment-scene">
        <FlowDiagram
          id="storage-array-structure"
          label="Depolama dizisinin host portları, denetleyicisi, belleği, yönetim yazılımı ve disk grubu."
          nodes={nodes}
          edges={edges}
          enabled={enabled}
          className="diagram-expanded"
        />
        <Caption>{captions[stage]}</Caption>
      </div>
    </Stage>
  );
}

export function SanScene(context: SceneContext) {
  const { stage, enabled } = context;
  const selected = stage === 3 ? "b" : "a";
  const masking = stage === 2 || stage === 3;
  const captions = [
    "Storage Area Network (SAN), birden çok host ile depolama dizisini bağlar.",
    "Host’lar ve diziler Fibre Channel switch’lerine veya InfiniBand ağına bağlanır. İstek bu ağdan geçer.",
    "LUN masking, belirli dizilerdeki mantıksal birimleri belirli host’lara sunar. Burada Host A, LUN A’yı görür.",
    "Aynı fiziksel ağda Host B’ye LUN B sunulur. Fiziksel bağlantı ile birimin görünürlüğü ayrı düzenlenir.",
    "SAN depolama trafiğini taşır. İletişim trafiği için ayrı bir ağ kullanılabilir.",
  ];
  const nodes: DiagramNode[] = [
    ...(["a", "b"] as const).map((letter, index) => ({
      id: `host-${letter}`,
      label: `Host ${letter.toUpperCase()}`,
      detail: "Blok isteği",
      icon: Laptop,
      tone:
        stage > 0 && selected === letter
          ? ("active" as const)
          : ("default" as const),
      badge: masking ? `Görünür: LUN ${letter.toUpperCase()}` : undefined,
      position: { x: 0, y: index * 220 },
    })),
    {
      id: "fabric",
      label: "SAN",
      detail: "FC switch / InfiniBand",
      icon: Network,
      tone: stage > 0 ? "active" : "default",
      position: { x: 330, y: 110 },
    },
    ...(["a", "b"] as const).map((letter, index) => ({
      id: `array-${letter}`,
      label: `Dizi ${index + 1}`,
      detail: "Depolama blokları",
      icon: Server,
      tone:
        stage > 0 && selected === letter
          ? ("complete" as const)
          : ("default" as const),
      badge: masking
        ? `LUN ${letter.toUpperCase()} · Host ${letter.toUpperCase()}`
        : undefined,
      position: { x: 660, y: index * 220 },
    })),
  ];
  const edges: DiagramEdge[] = (["a", "b"] as const).flatMap((letter) => [
    {
      source: `host-${letter}`,
      target: "fabric",
      active: stage > 0 && selected === letter,
      animated: stage > 0 && stage < 4 && selected === letter,
    },
    {
      source: "fabric",
      target: `array-${letter}`,
      active: stage > 0 && selected === letter,
      animated: stage > 0 && stage < 4 && selected === letter,
    },
  ]);
  return (
    <Stage
      title="Storage Area Network (SAN)"
      controls={<StoryControls {...context} />}
    >
      <div className="attachment-scene">
        <FlowDiagram
          id="san-fabric"
          label={
            masking
              ? `LUN masking örneği: Host A yalnız LUN A, Host B yalnız LUN B görür. Vurgulanan erişim: Host ${selected.toUpperCase()} ile LUN ${selected.toUpperCase()}. Çizgiler fiziksel bağlantıları gösterir.`
              : "İki host ve iki depolama dizisi SAN üzerinden bağlanır."
          }
          nodes={nodes}
          edges={edges}
          enabled={enabled}
          className="diagram-expanded"
        />
        <div className="attachment-facts">
          <span className={masking ? "attachment-fact-active" : ""}>
            {masking
              ? `Görünür birim: LUN ${selected.toUpperCase()}`
              : "Birden çok host"}
          </span>
          <span>
            {stage === 4 ? "iSCSI / FCoE" : "Birden çok depolama dizisi"}
          </span>
        </div>
        <Caption>{captions[stage]}</Caption>
      </div>
    </Stage>
  );
}
