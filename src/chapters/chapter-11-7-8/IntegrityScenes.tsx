import {
  ArrowRight,
  Check,
  Copy,
  Database,
  File,
  HardDrive,
  Layers,
  Server,
  ShieldAlert,
  ShieldCheck,
  X,
} from "lucide-react";
import { Stage } from "../../components/presentation/ScenePrimitives";
import { StageCaption } from "../../presentation/PresentationMotion";
import {
  FlowDiagram,
  type DiagramNode,
  type DiagramEdge,
} from "../../components/diagrams/FlowDiagram";
import type { SceneContext } from "../../presentation/types";
import { objectStory, poolStory } from "./model.mjs";
import { StoryControls } from "./StoryControls";

function Caption({ children }: { children: string }) {
  return (
    <StageCaption className="max-w-4xl text-center text-sm font-semibold leading-relaxed md:text-xl">
      {children}
    </StageCaption>
  );
}

function integrityGraph(stage: number): {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
} {
  if (stage === 0)
    return {
      nodes: [
        {
          id: "disk",
          label: "Disk erişilebilir",
          detail: "Aygıt yanıt veriyor",
          icon: HardDrive,
          tone: "complete",
        },
        {
          id: "observed-data",
          label: "İçerik değişmiş",
          detail: "Beklenen 1010 · okunan 1011",
          icon: Database,
          tone: "error",
        },
      ],
      edges: [
        {
          source: "disk",
          target: "observed-data",
          label: "Okuma",
          error: true,
        },
      ],
    };
  if (stage === 1)
    return {
      nodes: [
        {
          id: "data",
          label: "Veri",
          detail: "Nesnenin içeriği",
          icon: Database,
          tone: "active",
        },
        {
          id: "metadata",
          label: "Metadata",
          detail: "Veriyi tanımlayan bilgiler",
          icon: File,
          tone: "active",
        },
        {
          id: "data-checksum",
          label: "Veri checksum",
          detail: "Veriyi denetle",
          icon: ShieldCheck,
          tone: "complete",
        },
        {
          id: "metadata-checksum",
          label: "Metadata checksum",
          detail: "Metadata’yı denetle",
          icon: ShieldCheck,
          tone: "complete",
        },
      ],
      edges: [
        { source: "data", target: "data-checksum", active: true },
        { source: "metadata", target: "metadata-checksum", active: true },
      ],
    };
  if (stage === 2 || stage === 3) {
    const mismatch = stage === 3;
    return {
      nodes: [
        {
          id: "pointer",
          label: "Pointer",
          detail: "Kimlik: obj:42 · checksum: C₁",
          icon: File,
          badge: "Beklenen nesne ve denetim",
          tone: "active",
        },
        {
          id: "observed-data",
          label: mismatch ? "Okunan: obj:99" : "Okunan: obj:42",
          detail: mismatch ? "1011 · hesaplanan C₂" : "1010 · hesaplanan C₁",
          icon: Database,
          tone: mismatch ? "error" : "complete",
        },
        {
          id: "verification",
          label: mismatch ? "Uyuşmazlık" : "Beklenen nesne ve içerik",
          detail: mismatch
            ? "Kimlik / checksum farklı"
            : "Kimlik ve checksum uyumlu",
          icon: mismatch ? ShieldAlert : Check,
          tone: mismatch ? "error" : "complete",
        },
      ],
      edges: [
        {
          source: "pointer",
          target: "observed-data",
          label: "Nesneyi oku",
          active: true,
        },
        {
          source: "observed-data",
          target: "verification",
          label: "Karşılaştır",
          active: !mismatch,
          error: mismatch,
        },
      ],
    };
  }
  return {
    nodes: [
      {
        id: "detected-error",
        label: "Bozulma saptandı",
        detail: "Tespit tek başına düzeltme değildir",
        icon: X,
        tone: "error",
      },
      {
        id: "sound-copy",
        label: "Sağlam kopya varsa",
        detail: "Doğru içerik: 1010",
        icon: Copy,
        tone: "active",
        badge: "Yeterli sağlam bilgi gerekir",
      },
      {
        id: "recovered",
        label: "Doğru içeriği geri al",
        detail: "1010",
        icon: Check,
        tone: "complete",
      },
    ],
    edges: [
      {
        source: "detected-error",
        target: "sound-copy",
        label: "Sağlam bilgi gerekir",
        muted: true,
      },
      {
        source: "sound-copy",
        target: "recovered",
        label: "Kopyadan düzelt",
        active: true,
        animated: true,
      },
    ],
  };
}

export function IntegrityScene(context: SceneContext) {
  const { stage, enabled } = context;
  const captions = [
    "Bir disk çalışıyor olsa da veri veya metadata bozulmuş olabilir. RAID tek başına bu hataların genel tespit sistemi değildir.",
    "Kaynakta ZFS veri ve metadata için checksum tutar; yalnız disk arızası göstergesinden daha farklı bir denetim yapılır.",
    "Checksum nesneye işaret eden pointer ile ilişkilendirilir; doğru nesnenin ve beklenen içeriğin okunması denetlenir.",
    "Beklenen kimlik veya checksum uyuşmazlığı yanlış nesne / değişmiş içerik sorununu işaret eder.",
    "Tespit düzeltme değildir. Yeterli sağlam kopya varsa doğru içerik ondan alınabilir; tek checksum kayıp veriyi üretmez.",
  ];
  const graph = integrityGraph(stage);
  return (
    <Stage
      title="Disk çalışırken veri bozulabilir"
      controls={<StoryControls {...context} />}
    >
      <div className="flex h-full min-h-0 w-full max-w-5xl flex-col items-center justify-center gap-5 md:gap-7">
        <FlowDiagram
          id="integrity-verification"
          label={captions[stage]}
          nodes={graph.nodes}
          edges={graph.edges}
          enabled={enabled}
          direction="LR"
          className="min-h-0 w-full flex-1"
        />
        <Caption>{captions[stage]}</Caption>
        {stage >= 2 && (
          <small className="text-center text-[10px] text-slate-600">
            C₁/C₂: temsili checksum değerleri
          </small>
        )}
      </div>
    </Stage>
  );
}

function UnitCells({
  a,
  b,
  capacity,
}: {
  a: number;
  b: number;
  capacity: number;
}) {
  return (
    <div className="grid w-full grid-cols-6 gap-2">
      {Array.from({ length: capacity }, (_, index) => (
        <div
          key={index}
          className={`state-cell flex h-10 items-center justify-center rounded-lg border text-sm font-semibold md:h-14 ${index < a ? "border-blue bg-blue text-white" : index < a + b ? "border-ink bg-[#fed84b]" : "border-dashed border-slate-300 bg-white text-slate-500"}`}
        >
          {index < a ? "A" : index < a + b ? "B" : "Boş"}
        </div>
      ))}
    </div>
  );
}

export function PoolScene(context: SceneContext) {
  const { stage } = context;
  const state = poolStory(stage);
  const captions = [
    "Geleneksel örnekte iki dosya sistemine altışar birim sabit alan ayrılmıştır.",
    "A altı birimini doldurdu. İki birim daha isterken B’nin ayrılmış alanı içindeki dört boş birim A’ya kendiliğinden geçmez.",
    "Havuz yaklaşımında aynı fiziksel alan dosya sistemlerinin ortak kullanımına sunulur.",
    "A havuzdan iki birim daha kullandı. B’nin iki birimi korunur; toplam fiziksel kapasite değişmez.",
    "A üç birim bıraktı. Boş ortak alan arttı; havuz sınırları değiştirir, sınırsız kapasite üretmez.",
  ];
  return (
    <Stage
      title="Sabit sınırlar mı, ortak alan mı?"
      controls={
        <StoryControls
          {...context}
          choices={[
            { label: "Geleneksel", stage: 0, until: 1 },
            { label: "Havuz", stage: 2, until: 4 },
          ]}
        />
      }
    >
      <div className="flex h-full min-h-0 w-full max-w-5xl flex-col items-center justify-center gap-4 md:gap-6">
        <div className="flex items-center gap-4 text-sm font-semibold">
          <HardDrive />
          <span>12 temsili alan birimi</span>
          <ArrowRight />
          {state.mode === "pool" ? (
            <>
              <Layers className="text-blue" />
              <span className="text-blue">Ortak havuz</span>
            </>
          ) : (
            <span>İki sabit bölüm / volume</span>
          )}
        </div>
        {state.mode === "traditional" ? (
          <div className="grid w-full grid-cols-2 gap-4">
            {[
              { name: "A", used: state.a, color: "bg-blue text-white" },
              { name: "B", used: state.b, color: "bg-[#fed84b]" },
            ].map((fs) => (
              <div
                key={fs.name}
                className={`rounded-2xl border-2 bg-white p-4 ${state.blocked && fs.name === "A" ? "border-orange" : "border-ink"}`}
              >
                <h2 className="mb-3 text-center font-display text-xl font-semibold">
                  Dosya sistemi {fs.name} · {fs.used}/6
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 6 }, (_, index) => (
                    <div
                      key={index}
                      className={`state-cell flex h-10 items-center justify-center rounded-lg border text-xs md:h-14 ${index < fs.used ? fs.color : "border-dashed border-slate-300 bg-white text-slate-500"}`}
                    >
                      {index < fs.used ? fs.name : "Boş"}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full max-w-3xl rounded-2xl border-2 border-blue bg-blue/5 p-4 md:p-6">
            <UnitCells a={state.a} b={state.b} capacity={state.capacity} />
            <div className="mt-4 flex justify-center gap-4 text-sm font-semibold">
              <span className="text-blue">A: {state.a}</span>
              <span>B: {state.b}</span>
              <span>Boş: {state.free}</span>
            </div>
          </div>
        )}
        {state.blocked && (
          <div className="rounded-xl bg-orange/10 p-3 text-sm font-semibold">
            A’nın +{state.request} birim isteği sabit sınırda bekliyor
          </div>
        )}
        <Caption>{captions[stage]}</Caption>
      </div>
    </Stage>
  );
}

function objectGraph(
  state: ReturnType<typeof objectStory>,
  stage: number,
): { nodes: DiagramNode[]; edges: DiagramEdge[] } {
  if (state.example === "placement") {
    const nodes: DiagramNode[] = [
      {
        id: "placed-object",
        label: state.id ?? "Nesne",
        detail: `Veri: ${state.data} · N = ${state.copies.length} kopya`,
        icon: Database,
        tone: "active",
        badge: "Yeni yerleştirme örneği",
      },
    ];
    const edges: DiagramEdge[] = [];
    for (let system = 0; system < state.systems; system++) {
      const copied = state.copies.includes(system);
      nodes.push({
        id: `system-${system}`,
        label: `Sistem ${system + 1}`,
        detail: copied
          ? `${state.id} · ${state.data}`
          : "Bu nesnenin kopyası yok",
        icon: Server,
        tone: copied ? "complete" : "muted",
        badge:
          stage === 5 && system === 3
            ? "Yeni sistem"
            : copied
              ? "Kopya"
              : undefined,
      });
      edges.push({
        source: "placed-object",
        target: `system-${system}`,
        active: copied,
        muted: !copied,
        animated: stage === 5 && system === 3,
      });
    }
    return { nodes, edges };
  }
  const nodes: DiagramNode[] = [
    {
      id: "operation",
      label:
        stage === 0
          ? "Veri: 1010"
          : stage === 1
            ? "Oluştur"
            : stage === 2
              ? "Eriş: obj:42"
              : "Sil: obj:42",
      detail:
        stage === 0
          ? "Nesne oluşturulacak"
          : stage === 1
            ? "1010 verisini sakla"
            : "Nesne kimliğiyle işlem",
      icon: File,
      tone: "active",
    },
    {
      id: "object-pool",
      label: state.id ?? "Nesne havuzu",
      detail: state.exists
        ? `Veri: ${state.data}`
        : state.deleted
          ? "∅ · canlı nesne yok"
          : "Henüz ID yok",
      icon: Database,
      tone: state.deleted ? "error" : state.exists ? "complete" : "default",
      badge: state.deleted
        ? "Silindi"
        : state.exists
          ? "Canlı nesne"
          : undefined,
    },
  ];
  const edges: DiagramEdge[] = [
    {
      source: "operation",
      target: "object-pool",
      label:
        stage === 0
          ? "Oluşturulacak"
          : stage === 1
            ? "Oluştur"
            : stage === 2
              ? "ID ile oku"
              : "ID ile sil",
      active: stage > 0,
      muted: stage === 0,
      error: state.deleted,
      animated: stage === 1 || stage === 2,
    },
  ];
  if (stage > 0) {
    nodes.push({
      id: "operation-result",
      label:
        stage === 1 ? "Dönen ID" : state.read ? "Veri döndü" : "Sonraki erişim",
      detail:
        stage === 1
          ? (state.id ?? "")
          : state.read
            ? state.data
            : "Bu ID ile canlı nesne yok",
      icon: state.deleted ? X : Check,
      tone: state.deleted ? "error" : "complete",
    });
    edges.push({
      source: "object-pool",
      target: "operation-result",
      label: stage === 1 ? "ID al" : state.read ? "Yanıt" : "Silme sonrası",
      active: !state.deleted,
      error: state.deleted,
    });
  }
  return { nodes, edges };
}

export function ObjectStorageScene(context: SceneContext) {
  const { stage, enabled } = context;
  const state = objectStory(stage);
  const captions = [
    "Nesne havuzu veriyi kapsayıcı nesneler olarak tutar; programın arayüzü nesne kimliğidir.",
    "Oluşturma işlemi obj:42 kimliğini döndürdü. Program bu kimliği sonraki işlemler için saklar.",
    "Program obj:42 ile erişti; var olan nesnenin verisi 1010 olarak döndü.",
    "obj:42 silindi. Bu örnekte aynı kimlikle okunabilecek canlı nesne kalmadı.",
    "Yeni örnek: obj:99, üç farklı sistemde üç kopya olarak korunur.",
    "Dördüncü sistem eklendi. Örnek yönetici obj:99’un üç kopyasını yeni yerleşime dağıttı; uygulama hâlâ aynı kimliği kullanır.",
  ];
  const graph = objectGraph(state, stage);
  return (
    <Stage
      title="Nesneyi kimliğiyle bulmak"
      controls={
        <StoryControls
          {...context}
          choices={[
            { label: "Yaşam döngüsü", stage: 0, until: 3 },
            { label: "Yerleştirme", stage: 4, until: 5 },
          ]}
        />
      }
    >
      <div className="flex h-full min-h-0 w-full max-w-5xl flex-col items-center justify-center gap-4 md:gap-6">
        <FlowDiagram
          id={
            state.example === "placement"
              ? "object-placement"
              : "object-lifecycle"
          }
          label={captions[stage]}
          nodes={graph.nodes}
          edges={graph.edges}
          enabled={enabled}
          direction={state.example === "placement" ? "TB" : "LR"}
          className="min-h-0 w-full flex-1"
        />
        {state.example === "placement" && (
          <span className="text-center text-xs font-semibold text-slate-600">
            Yerleştirme ve koruma: depolama yönetim yazılımı
          </span>
        )}
        <Caption>{captions[stage]}</Caption>
      </div>
    </Stage>
  );
}
