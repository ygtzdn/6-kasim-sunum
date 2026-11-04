import {
  FlowDiagram,
  type DiagramNode,
  type DiagramEdge,
} from "../../components/diagrams/FlowDiagram";
import { Cpu, GitMerge, Layers3, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { StageCaption } from "../../presentation/PresentationMotion";
import type { SceneContext } from "../../presentation/types";
import { Choice, Stage } from "../../components/presentation/ScenePrimitives";

export function NvmScheduling({ stage, setStage, enabled }: SceneContext) {
  const sent = stage >= 2,
    parallel = stage >= 3,
    controller = stage >= 4;
  const requests =
    stage === 0
      ? ["Oku L10", "Oku L11", "Yaz L40", "Oku L90"]
      : ["Oku L10–L11", "Yaz L40", "Oku L90"];
  const nodes: DiagramNode[] = [
    {
      id: "os",
      label: "OS kuyruğu",
      detail: "Host isteklerini hazırlar",
      icon: GitMerge,
      tone: sent ? "complete" : "active",
      badge: stage === 0 ? "4 istek" : "Bitişik okumalar birleşti",
    },
    {
      id: "nvme",
      label: "NVMe komut yolu",
      detail: "Host → aygıt · FTL değildir",
      icon: Cpu,
      tone: stage === 2 ? "active" : sent ? "complete" : "muted",
      badge: sent ? "Komutlar iletildi" : undefined,
    },
    {
      id: "nand",
      label: "SSD denetleyicisi / NAND",
      detail: parallel ? "İç iş1 · İç iş2 · İç iş3" : "Aygıt içi işler",
      icon: Layers3,
      tone: parallel ? "active" : "muted",
      badge: controller
        ? "FTL · GC · wear leveling"
        : parallel
          ? "Paralel işler"
          : undefined,
    },
  ];
  const edges: DiagramEdge[] = [
    {
      source: "os",
      target: "nvme",
      label: "I/O komutları",
      active: sent,
      muted: !sent,
    },
    {
      source: "nvme",
      target: "nand",
      label: "Aygıta gönder",
      active: sent,
      muted: !sent,
    },
  ];
  const captions = [
    "Mekanik seek ve dönme yoktur; istek hazırlama ve kuyruk işi sürer.",
    "Bitişik L10 ve L11 birleştirilir. Bu, silindirler arasında kafa hareketini azaltmak değildir.",
    "Host komutları aygıta iletir. NVMe erişim arayüzüdür; FTL değildir.",
    "Aygıt bağımsız iç işleri paralel yürütebilir. Çizim bir hız ölçümü değildir.",
    "FTL eşler, GC alan geri kazanır, wear leveling aşınmayı dağıtır. Bunlar denetleyicinin işleridir.",
  ];
  return (
    <Stage
      title="Seek yok. Kuyruk ve flash işi var."
      controls={
        <div className="flex flex-wrap justify-center gap-2">
          {["Kuyruk", "Birleştir", "Gönder", "Paralellik", "Denetleyici"].map(
            (label, i) => (
              <Choice
                key={label}
                active={stage === i}
                onClick={() => setStage(i)}
              >
                {label}
              </Choice>
            ),
          )}
        </div>
      }
    >
      <div className="flex h-full w-full max-w-[1100px] flex-col justify-center gap-3 md:gap-5">
        <div
          className="flex shrink-0 justify-center gap-2"
          aria-label="Host istekleri"
        >
          {requests.map((label) => (
            <span
              key={label}
              className={`rounded-lg border border-ink bg-white px-2 py-2 font-display text-[10px] md:px-4 md:text-sm ${sent ? "opacity-40" : ""}`}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="min-h-0 flex-1">
          <FlowDiagram
            id="nvm-command-flow"
            label="OS isteği, NVMe komut yolu ve SSD denetleyicisinin farklı görevleri"
            nodes={nodes}
            edges={edges}
            direction="LR"
            enabled={enabled}
          />
        </div>
        <div className="grid shrink-0 grid-cols-3 gap-2">
          {(controller
            ? [
                { title: "FTL · eşleme", Icon: GitMerge },
                { title: "GC · alan", Icon: Layers3 },
                { title: "Wear leveling", Icon: ShieldCheck },
              ]
            : [
                { title: "Yazılım yükü", Icon: Cpu },
                { title: "Birleştirme", Icon: GitMerge },
                { title: "I/O hedefleri", Icon: ShieldCheck },
              ]
          ).map(({ title, Icon }) => (
            <div
              key={title}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-2 py-3 text-[10px] font-semibold md:text-sm"
            >
              <Icon size={18} />
              <span>{title}</span>
            </div>
          ))}
        </div>
        <StageCaption className="shrink-0 text-center text-xs font-semibold text-slate-600 md:text-sm">
          {captions[stage]}
        </StageCaption>
      </div>
    </Stage>
  );
}

export function NvmCheckpoint({ stage, setStage, enabled }: SceneContext) {
  const wear =
    stage >= 3 ? [9, 8, 8, 8] : stage >= 2 ? [8, 8, 8, 8] : [8, 2, 2, 1];
  const captions = [
    "Host I/O sırası ile FTL, GC ve wear leveling aynı iş değildir.",
    "Birikmiş silmeler eşit olmayabilir; bu sayılar ürün ömrü veya sağlık yüzdesi değildir.",
    "Yeni 19 döngü az aşınanlara dağıtıldı: B1+6, B2+6, B3+7. Geçmiş sayaçlar azalmadı.",
    "B0 bir kez daha silindi:9,8,8,8. Yeniden kullanılabilir alan kazanıldı; aşınma silinmedi.",
    "Over-provisioning, host’a doğrudan sunulmayan çalışma alanıdır. Dosya sistemi boşluğu ile aynı kavram değildir.",
  ];
  return (
    <Stage
      title="Alan geri gelir. Aşınma geri alınmaz."
      controls={
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "Görevler",
            "Sayaçlar",
            "Yükü dağıt",
            "Bir silme daha",
            "Ayrılmış alan",
          ].map((name, i) => (
            <Choice key={name} active={stage === i} onClick={() => setStage(i)}>
              {name}
            </Choice>
          ))}
        </div>
      }
    >
      <div className="flex h-full w-full max-w-[1020px] flex-col items-center justify-center gap-5 md:gap-7">
        {stage === 0 ? (
          <div className="grid w-full grid-cols-2 gap-5">
            {[
              {
                title: "Host / OS",
                jobs: ["İstek gönderme", "Birleştirme", "I/O hedefleri"],
              },
              {
                title: "SSD denetleyicisi",
                jobs: [
                  "FTL: eşleme",
                  "GC: alan geri kazanma",
                  "Wear leveling: aşınma dağıtma",
                ],
              },
            ].map((layer) => (
              <div
                key={layer.title}
                className="rounded-2xl border-2 border-ink bg-white p-5 md:p-7"
              >
                <h2 className="mb-5 font-display text-xl md:text-3xl">
                  {layer.title}
                </h2>
                {layer.jobs.map((job) => (
                  <div
                    key={job}
                    className="mb-3 rounded-lg bg-blue/10 px-3 py-3 text-xs font-semibold text-blue md:text-sm"
                  >
                    {job}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : stage <= 3 ? (
          <div className="grid w-full grid-cols-4 gap-3 md:gap-6">
            {wear.map((value, i) => (
              <div
                key={i}
                className={`flex flex-col items-center gap-4 rounded-xl border-2 p-3 md:p-5 ${stage === 3 && i === 0 ? "border-orange bg-orange/5" : "border-ink bg-white"}`}
              >
                <strong className="text-xs font-semibold">B{i}</strong>
                <div className="flex h-32 w-full items-end justify-center md:h-44">
                  <motion.div
                    className={`w-9 rounded-t-lg md:w-16 ${stage === 3 && i === 0 ? "bg-orange" : "bg-blue"}`}
                    initial={false}
                    animate={{ height: `${(value / 10) * 100}%` }}
                    transition={{
                      duration: enabled ? 0.5 : 0,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </div>
                <span className="font-display text-3xl md:text-5xl">
                  {value}
                </span>
                <small className="text-[9px] font-semibold text-slate-500">
                  Birikmiş silme
                </small>
                {stage === 2 && (
                  <span className="text-xs font-bold text-blue">
                    +{[0, 6, 6, 7][i]}
                  </span>
                )}
                {stage === 3 && (
                  <span
                    className={`text-xs font-bold ${i === 0 ? "text-orange" : "text-slate-400"}`}
                  >
                    +{i === 0 ? 1 : 0}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full space-y-5">
            <div className="rounded-xl border-2 border-blue bg-blue/5 p-4 md:p-6">
              <h2 className="mb-4 text-sm font-semibold">
                Host’a sunulan mantıksal görünüm
              </h2>
              <div className="grid grid-cols-6 gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-blue px-2 py-3 text-center text-xs font-semibold text-white"
                  >
                    LBA{i}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`rounded-xl border-2 p-3 text-center ${i === 3 ? "border-dashed border-slate-500 bg-slate-100" : "border-ink bg-white"}`}
                >
                  <span className="text-xs font-semibold">Fiziksel B{i}</span>
                  <div className="my-3 grid grid-cols-2 gap-1">
                    {[0, 1, 2, 3].map((p) => (
                      <div
                        key={p}
                        className={`h-6 rounded ${i === 3 ? "bg-slate-300" : "bg-blue/15"}`}
                      />
                    ))}
                  </div>
                  <strong className="text-xs">
                    {i === 3 ? "GC çalışma alanı" : "Aygıt içi yerleşim"}
                  </strong>
                </div>
              ))}
            </div>
            <p className="text-center text-[10px] font-semibold text-slate-500">
              Kavramsal şema · oranlar gerçek aygıt kapasitesi değildir · önceki
              sayaçlar9,8,8,8
            </p>
          </div>
        )}
        <StageCaption className="max-w-[950px] text-center text-xs font-semibold leading-relaxed text-slate-600 md:text-base">
          {captions[stage]}
        </StageCaption>
      </div>
    </Stage>
  );
}
