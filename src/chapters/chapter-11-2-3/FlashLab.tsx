import { useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Check,
  LockKeyhole,
  RotateCcw,
  SkipForward,
  X,
} from "lucide-react";
import { Stage } from "../../components/presentation/ScenePrimitives";
import {
  createFlashState,
  flashWriteAmplification,
  nextFlashStep,
} from "./model";

let flashState = createFlashState();
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function advance() {
  flashState = nextFlashStep(flashState);
  listeners.forEach((listener) => listener());
}
function reset() {
  flashState = createFlashState();
  listeners.forEach((listener) => listener());
}
const actions = [
  "L0’ı güncelle",
  "L1’i güncelle",
  "Canlı veriyi taşı",
  "B0’ı sil",
  "L2’yi güncelle",
  "Tamamlandı",
];

export function FlashLab({ enabled }: { enabled: boolean }) {
  const state = useSyncExternalStore(subscribe, () => flashState);
  const [selected, setSelected] = useState(0);
  const ratio = flashWriteAmplification(state);
  return (
    <Stage
      title="3 yazma. 5 fiziksel yazma."
      controls={
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            data-presentation-next
            className="primary-button disabled:opacity-40"
            disabled={state.step >= 5}
            onClick={advance}
          >
            {actions[state.step]}
            <SkipForward size={18} />
          </button>
          <button
            className="icon-button"
            aria-label="Flash yazma ve GC modelini sıfırla"
            onClick={reset}
          >
            <RotateCcw size={19} />
          </button>
          <span className="ml-2 text-xs font-semibold text-slate-600">
            {state.step}/5
          </span>
        </div>
      }
    >
      <div className="flex h-full w-full max-w-[1100px] flex-col justify-center gap-2 md:gap-4">
        <div className="flex shrink-0 items-center justify-center gap-5 md:gap-12">
          {[
            [state.hostWrites, "Host yazması"],
            [state.physicalWrites, "Fiziksel yazma"],
            [state.erases, "Silme"],
          ].map(([value, label]) => (
            <div className="flex flex-col items-center gap-1" key={label}>
              <strong className="font-display text-3xl font-medium text-blue md:text-5xl">
                {value}
              </strong>
              <span className="text-[9px] font-semibold text-slate-600 md:text-xs">
                {label}
              </span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-1 border-l border-slate-300 pl-4 md:pl-10">
            <strong className="font-display text-3xl font-medium md:text-5xl">
              {ratio === null
                ? "—"
                : ratio.toLocaleString("tr-TR", { maximumFractionDigits: 2 })}
              <span className="text-sm">×</span>
            </strong>
            <span className="text-[9px] font-semibold text-slate-600 md:text-xs">
              Yazma büyütmesi
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-between text-[9px] font-semibold text-slate-500 md:text-[10px]">
          <span>SSD denetleyicisi / flash</span>
          <span>Eğitim modeli · 3 × 4 sayfa</span>
        </div>
        <div className="grid min-h-0 grid-cols-3 gap-2 md:gap-5">
          {state.blocks.map((block, blockIndex) => (
            <div
              key={blockIndex}
              className={`flex min-h-0 flex-col gap-2 rounded-xl border-2 p-2 md:rounded-2xl md:p-4 ${state.reservedBlock === blockIndex ? "border-dashed border-slate-500 bg-slate-50" : "border-ink bg-white"}`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="font-display text-sm font-medium md:text-xl">
                  B{blockIndex}
                </span>
                {state.reservedBlock === blockIndex && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-slate-600">
                    <LockKeyhole size={11} />
                    GC
                  </span>
                )}
              </div>
              <div className="grid min-h-0 grid-rows-4 gap-1.5 md:gap-2">
                {block.map((page, pageIndex) => {
                  const active =
                    page.status === "valid" && page.logical === selected;
                  const invalid = page.status === "invalid";
                  return (
                    <motion.div
                      initial={false}
                      key={pageIndex}
                      animate={{
                        backgroundColor: active
                          ? "#2247eb"
                          : invalid
                            ? "#e7e9ee"
                            : "#fff",
                        color: active ? "#fff" : "#111827",
                        scale: 1,
                      }}
                      transition={{ duration: enabled ? 0.3 : 0 }}
                      className={`flex min-h-0 items-center justify-between gap-1 rounded-lg border px-2 py-[clamp(4px,1.2vh,12px)] md:px-3 ${active ? "border-blue" : "border-slate-300"}`}
                      aria-label={`B${blockIndex}.P${pageIndex}, ${page.logical === null ? "boş" : `L${page.logical} sürüm ${page.version}, ${invalid ? "geçersiz" : "geçerli"}`}`}
                      style={
                        invalid
                          ? {
                              backgroundImage:
                                "repeating-linear-gradient(135deg, transparent, transparent 5px, #d0d5de 5px, #d0d5de 6px)",
                            }
                          : undefined
                      }
                    >
                      <small className="text-[8px] opacity-70 md:text-[10px]">
                        P{pageIndex}
                      </small>
                      <strong
                        className={`font-display text-base font-medium md:text-2xl ${invalid ? "line-through" : ""}`}
                      >
                        {page.logical === null ? "—" : `L${page.logical}`}
                        <small className="ml-1 text-[8px] font-sans md:text-[10px]">
                          {page.logical !== null ? `v${page.version}` : ""}
                        </small>
                      </strong>
                      <span className="shrink-0">
                        {invalid ? (
                          <X size={12} />
                        ) : page.status === "valid" ? (
                          <Check size={12} />
                        ) : (
                          <span className="block size-3" />
                        )}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div
          className="flex shrink-0 flex-wrap items-center justify-center gap-1.5 md:gap-2"
          aria-label="FTL mantıksal fiziksel eşleme tablosu"
        >
          <span className="mr-1 text-[9px] font-semibold text-slate-500">
            FTL
          </span>
          {Object.entries(state.mapping).map(([logical, location]) => (
            <button
              key={logical}
              onClick={() => setSelected(Number(logical))}
              aria-pressed={selected === Number(logical)}
              className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-1 text-[9px] font-semibold md:px-2 md:text-[10px] ${selected === Number(logical) ? "border-blue bg-blue text-white" : "border-slate-300 bg-white"}`}
            >
              L{logical}
              <ArrowRight size={10} />B{location.block}.P{location.page}
            </button>
          ))}
        </div>
        <div
          className="h-4 text-center text-[10px] font-semibold text-slate-600 md:h-5 md:text-xs"
          role="status"
          aria-live="polite"
        >
          {state.event}
        </div>
      </div>
    </Stage>
  );
}
