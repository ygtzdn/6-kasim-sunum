import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Check,
  Cpu,
  File,
  FileCode2,
  FolderOpen,
  HardDrive,
  LayoutPanelLeft,
  Play,
  Power,
  RotateCcw,
  Undo2,
} from "lucide-react";
import { Choice, Stage } from "../../components/presentation/ScenePrimitives";
import {
  createDevice,
  partitionDevice,
  prepareDevice,
  remapBlock,
} from "./model.mjs";

export function DeviceLab({ enabled }: { enabled: boolean }) {
  const [device, setDevice] = useState(createDevice);
  const [history, setHistory] = useState<ReturnType<typeof createDevice>[]>([]);
  const selected = device.partitions[device.selected];
  const step = !selected
    ? 0
    : !selected.filesystem
      ? 1
      : !selected.mounted
        ? 2
        : 3;
  const labels = [
    "Bölüm oluştur",
    "Dosya sistemi oluştur",
    "Bağla",
    "Dosya kaydet",
  ];
  function advance() {
    setHistory((past) => [...past, device]);
    setDevice(
      step === 0
        ? partitionDevice(device)
        : prepareDevice(
            device,
            step === 1 ? "filesystem" : step === 2 ? "mount" : "save",
          ),
    );
  }
  function back() {
    const previous = history.at(-1);
    if (!previous) return;
    setDevice(previous);
    setHistory(history.slice(0, -1));
  }
  return (
    <Stage
      title="Aygıttan dosyaya."
      controls={
        <div className="flex items-center justify-center gap-2">
          <button
            className="icon-button"
            onClick={back}
            disabled={!history.length}
            aria-label="Son hazırlık adımını geri al"
          >
            <Undo2 size={20} />
          </button>
          <button className="primary-button" onClick={advance}>
            {labels[step]} <ArrowRight size={17} />
          </button>
          <button
            className="icon-button"
            onClick={() => {
              setDevice(createDevice());
              setHistory([]);
            }}
            aria-label="Aygıt modelini sıfırla"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      }
    >
      <div className="flex w-full max-w-4xl flex-col gap-3 md:gap-4">
        <div className="relative rounded-[24px] border-2 border-ink bg-white p-4">
          <div className="mb-4 flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-2">
              <HardDrive size={20} />
              Fiziksel aygıt <Check size={15} className="text-blue" />
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px]">
              Eğitim modeli
            </span>
          </div>
          <div
            className="flex h-[clamp(120px,22vh,180px)] gap-2"
            aria-label="Örnek aygıtın mantıksal bölümleri"
          >
            <AnimatePresence initial={false} mode="wait">
              {!device.partitions.length ? (
                <motion.div
                  key="unpartitioned"
                  initial={enabled ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl bg-slate-100"
                >
                  <div className="grid w-4/5 grid-cols-12 gap-1">
                    {Array.from({ length: 48 }, (_, i) => (
                      <div
                        key={i}
                        className="h-3 rounded-sm bg-slate-300 md:h-5"
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-600">
                    Fiziksel hazırlık tamam
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="partitions"
                  initial={enabled ? { opacity: 0, scaleX: 0.85 } : false}
                  animate={{ opacity: 1, scaleX: 1 }}
                  className="flex w-full gap-2"
                >
                  {device.partitions.map((part) => (
                    <button
                      key={part.id}
                      onClick={() =>
                        setDevice({ ...device, selected: part.id })
                      }
                      aria-pressed={device.selected === part.id}
                      aria-label={`Bölüm ${part.id + 1}, yüzde ${part.percent}${part.filesystem ? ", dosya sistemi var" : ""}${part.mounted ? ", bağlı" : ""}`}
                      style={{ width: `${part.percent}%` }}
                      className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 transition-colors ${device.selected === part.id ? "border-blue bg-blue/8" : "border-slate-300 bg-slate-50"}`}
                    >
                      <div className="flex items-center gap-2">
                        {part.filesystem ? (
                          <FolderOpen size={35} className="text-blue" />
                        ) : (
                          <LayoutPanelLeft
                            size={35}
                            className="text-slate-500"
                          />
                        )}
                        {part.mounted && (
                          <span className="flex size-5 items-center justify-center rounded-full bg-blue text-white">
                            <Check size={13} />
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-semibold md:text-base">
                        Bölüm {part.id + 1} · {part.percent}%
                      </span>
                      {part.filesystem && (
                        <span className="absolute top-2 left-2 text-[9px] font-bold text-blue md:top-3 md:left-3">
                          FS
                        </span>
                      )}
                      <div className="flex h-5 items-center gap-1">
                        {Array.from(
                          { length: Math.min(part.files, 4) },
                          (_, i) => (
                            <motion.span
                              key={i}
                              initial={enabled ? { y: -15, opacity: 0 } : false}
                              animate={{ y: 0, opacity: 1 }}
                            >
                              <File
                                size={17}
                                className="fill-blue/10 text-blue"
                              />
                            </motion.span>
                          ),
                        )}
                        {part.files > 4 && (
                          <span className="text-[10px] text-blue">
                            +{part.files - 4}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div
          className="grid grid-cols-4 gap-2"
          aria-label="Hazırlama katmanları"
        >
          {[
            { label: "Fiziksel", Icon: HardDrive },
            { label: "Bölüm", Icon: LayoutPanelLeft },
            { label: "Dosya sistemi", Icon: FolderOpen },
            { label: "Bağlama", Icon: Check },
          ].map(({ label, Icon }, i) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-2 rounded-xl px-1 py-3 ${i <= step ? "bg-blue/10 text-blue" : "text-slate-400"}`}
            >
              <Icon size={22} />
              <span className="text-center text-[10px] font-semibold md:text-xs">
                {label}
              </span>
            </div>
          ))}
        </div>
        <p
          className="text-center text-xs font-semibold text-slate-600"
          role="status"
        >
          {step === 0
            ? "Bölüm tablosu henüz yok."
            : step === 1
              ? "Alan ayrıldı; dosya sistemi henüz yok."
              : step === 2
                ? "Dosya sistemi hazır; henüz bağlı değil."
                : selected.files > 0
                  ? `${selected.files} örnek dosya, Bölüm ${device.selected + 1} içinde.`
                  : `Bölüm ${device.selected + 1}, dosya erişimine hazır.`}
        </p>
      </div>
    </Stage>
  );
}

export function BootLab({ enabled }: { enabled: boolean }) {
  const [mode, setMode] = useState<"uefi" | "bios">("uefi");
  const [step, setStep] = useState(-1);
  const nodes =
    mode === "uefi"
      ? [
          { title: "UEFI", detail: "Firmware", Icon: Power },
          { title: "ESP", detail: "bootloader.efi", Icon: FileCode2 },
          { title: "Kernel", detail: "RAM", Icon: Cpu },
        ]
      : [
          { title: "BIOS", detail: "Firmware", Icon: Power },
          { title: "MBR", detail: "İlk açılış kodu", Icon: HardDrive },
          { title: "Bootloader", detail: "Yükleyici", Icon: FileCode2 },
          { title: "Kernel", detail: "RAM", Icon: Cpu },
        ];
  return (
    <Stage
      title="İlk komut nereden gelir?"
      controls={
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Choice
            active={mode === "uefi"}
            onClick={() => {
              setMode("uefi");
              setStep(-1);
            }}
          >
            UEFI / GPT
          </Choice>
          <Choice
            active={mode === "bios"}
            onClick={() => {
              setMode("bios");
              setStep(-1);
            }}
          >
            BIOS / MBR
          </Choice>
          <button
            className="primary-button"
            onClick={() => setStep(step >= nodes.length - 1 ? -1 : step + 1)}
          >
            {step < 0
              ? "Başlat"
              : step >= nodes.length - 1
                ? "Yeniden"
                : "İlerle"}
            {step >= nodes.length - 1 ? (
              <RotateCcw size={17} />
            ) : (
              <Play size={16} />
            )}
          </button>
        </div>
      }
    >
      <div className="flex w-full max-w-5xl flex-col items-center gap-8 md:gap-12">
        <div className="flex w-full items-center justify-center gap-1 md:gap-3">
          {nodes.map(({ title, detail, Icon }, index) => (
            <div key={`${mode}-${title}`} className="contents">
              <motion.div
                animate={{
                  y: enabled && step === index ? -10 : 0,
                  scale: enabled && step === index ? 1.04 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 22,
                  duration: enabled ? undefined : 0,
                }}
                className={`flex min-w-0 flex-1 flex-col items-center gap-3 rounded-2xl border-2 px-1 py-5 text-center md:py-9 ${step === index ? "border-blue bg-blue text-white" : step > index ? "border-blue/40 bg-blue/10 text-blue" : "border-slate-300 bg-white"}`}
              >
                <Icon className="size-7 md:size-12" strokeWidth={1.5} />
                <span className="font-display text-xs font-semibold md:text-2xl">
                  {title}
                </span>
                <span className="text-[8px] font-semibold md:text-xs">
                  {detail}
                </span>
              </motion.div>
              {index < nodes.length - 1 && (
                <motion.div
                  animate={{
                    color: step > index ? "#2247eb" : "#cbd5e1",
                    x: enabled && step === index ? [0, 4, 0] : 0,
                  }}
                  transition={{
                    duration: enabled ? 0.8 : 0,
                    repeat: enabled && step === index ? Infinity : 0,
                  }}
                >
                  <ArrowRight className="size-4 md:size-6" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
        <div
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-center text-xs font-semibold md:text-sm"
          role="status"
        >
          {mode === "uefi"
            ? "GPT → EFI System Partition → .efi yükleyici"
            : "MBR açılış kodu → sonraki yükleyici aşamaları"}
        </div>
      </div>
    </Stage>
  );
}

const PHYSICAL = [40, 41, 42, 43, 44, 45, 46, 47];
export function RemapLab({ enabled }: { enabled: boolean }) {
  const [failed, setFailed] = useState(false);
  const [remapped, setRemapped] = useState(false);
  const mapping = remapped ? remapBlock(PHYSICAL, 5, 90) : PHYSICAL;
  return (
    <Stage
      title="Adres aynı. Yer değişir."
      controls={
        <div className="flex items-center justify-center gap-2">
          <button
            className="primary-button"
            disabled={remapped}
            onClick={() => (failed ? setRemapped(true) : setFailed(true))}
          >
            {failed ? "Yedek alana eşle" : "Sektör hatası ekle"}
            <ArrowRight size={17} />
          </button>
          <button
            className="icon-button"
            aria-label="Yeniden eşleme örneğini sıfırla"
            onClick={() => {
              setFailed(false);
              setRemapped(false);
            }}
          >
            <RotateCcw size={19} />
          </button>
        </div>
      }
    >
      <div className="flex w-full max-w-5xl flex-col gap-3 md:gap-4">
        <div className="flex items-center justify-between">
          <span className="eyebrow">OS · mantıksal adres</span>
          <span className="text-[10px] font-semibold text-slate-500">LBA</span>
        </div>
        <div className="grid grid-cols-9 gap-1 md:gap-3">
          {PHYSICAL.map((_, i) => (
            <div
              key={i}
              className={`flex h-[clamp(42px,10vh,80px)] items-center justify-center rounded-xl border-2 font-display text-xl font-semibold md:text-3xl ${i === 5 ? "border-blue bg-blue text-white" : "border-slate-300 bg-white"}`}
            >
              {i}
            </div>
          ))}
          <span aria-hidden="true" />
        </div>
        <div className="relative h-[clamp(40px,10vh,75px)]">
          <svg
            viewBox="0 0 900 100"
            preserveAspectRatio="none"
            className="h-full w-full"
            role="img"
            aria-label={
              remapped
                ? "Mantıksal blok 5 artık fiziksel yedek 90 adresine eşleniyor."
                : "Mantıksal blok 5 fiziksel sektör 45 adresine eşleniyor."
            }
          >
            <defs>
              <marker
                id="management-arrow"
                markerWidth="7"
                markerHeight="7"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6" fill="#2247eb" />
              </marker>
            </defs>
            {PHYSICAL.map(
              (_, i) =>
                i !== 5 && (
                  <path
                    key={i}
                    d={`M${50 + i * 100},0 L${50 + i * 100},90`}
                    stroke="#cbd5e1"
                    strokeWidth="2"
                  />
                ),
            )}
            <motion.path
              d={remapped ? "M550,0 C550,45 840,45 850,90" : "M550,0 L550,90"}
              fill="none"
              stroke="#2247eb"
              strokeWidth="5"
              markerEnd="url(#management-arrow)"
              initial={enabled ? { pathLength: 0 } : false}
              animate={{ pathLength: 1, opacity: 1 }}
              key={String(remapped)}
              transition={{ duration: enabled ? 0.7 : 0 }}
            />
          </svg>
        </div>
        <div className="grid grid-cols-9 gap-1 md:gap-3">
          {[...PHYSICAL, 90].map((physical, i) => (
            <motion.div
              key={physical}
              animate={{
                scale: enabled && failed && i === 5 ? [1, 0.94, 1] : 1,
              }}
              transition={{ duration: enabled ? 0.25 : 0 }}
              className={`relative flex h-[clamp(42px,10vh,80px)] items-center justify-center rounded-xl border-2 font-display text-base font-semibold md:text-2xl ${i === 5 && failed ? "border-orange bg-orange/10 text-ink" : i === 8 ? (remapped ? "border-blue bg-blue/10 text-blue" : "border-dashed border-blue/50 bg-blue/5 text-blue") : "border-slate-300 bg-slate-100 text-slate-600"}`}
            >
              {physical}
              {failed && i === 5 && (
                <span className="absolute -top-2 -right-1 flex size-5 items-center justify-center rounded-full bg-orange font-sans text-sm text-white">
                  ×
                </span>
              )}
            </motion.div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="eyebrow">Aygıt · fiziksel sektör</span>
          <div
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 font-display text-sm font-semibold md:text-lg ${remapped ? "border-blue bg-blue/10 text-blue" : "border-slate-300 bg-white"}`}
          >
            <span>LBA 5</span>
            <ArrowRight size={16} />
            <span>P{mapping[5]}</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-500">
            Yedek: P90
          </span>
        </div>
      </div>
    </Stage>
  );
}
