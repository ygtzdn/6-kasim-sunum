import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  CircleAlert,
  File,
  HardDrive,
  Layers3,
  LockKeyhole,
  RotateCcw,
} from "lucide-react";
import { Choice, Stage } from "../../components/presentation/ScenePrimitives";
import {
  beginPageIn,
  beginPageOut,
  completeTransfer,
  createSwapState,
} from "./model.mjs";

type SwapState = ReturnType<typeof createSwapState>;
const colors: Record<string, string> = {
  A: "bg-orange/15 border-orange text-ink",
  B: "bg-slate-100 border-slate-400 text-ink",
  C: "bg-blue/10 border-blue text-blue",
  D: "bg-ink border-ink text-white",
  E: "bg-slate-200 border-slate-400 text-ink",
  F: "bg-slate-200 border-slate-400 text-ink",
};

function MemoryMap({
  state,
  enabled,
  selected,
  onSelect,
}: {
  state: SwapState;
  enabled: boolean;
  selected?: string;
  onSelect?: (id: string) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="eyebrow">RAM · frame</span>
        <span className="text-[10px] font-semibold text-slate-500">
          {state.frames.filter(Boolean).length} / {state.frames.length}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {state.frames.map((id, frame) => (
          <MemoryCell
            key={`frame-${frame}`}
            id={id}
            label={`F${frame}`}
            enabled={enabled}
            selected={id === selected}
            pending={state.pending?.frame === frame}
            onSelect={onSelect}
            dirty={id ? state.pages[id].dirty : false}
            file={id ? state.pages[id].kind === "file" : false}
          />
        ))}
      </div>
      <div
        className="relative flex h-[clamp(28px,6vh,58px)] items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <AnimatePresence mode="wait">
          {state.pending ? (
            <motion.div
              key={`${state.pending.pageId}-${state.pending.kind}`}
              initial={
                enabled
                  ? { y: state.pending.kind === "write" ? -20 : 20, opacity: 0 }
                  : false
              }
              animate={{
                y: enabled
                  ? state.pending.kind === "write"
                    ? [-20, 20]
                    : [20, -20]
                  : 0,
                opacity: 1,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: enabled ? 0.85 : 0 }}
              className="flex items-center gap-3 rounded-xl bg-blue px-5 py-2 text-sm font-semibold text-white"
            >
              {state.pending.kind === "write" ? (
                <ArrowDown size={21} />
              ) : (
                <ArrowUp size={21} />
              )}
              {state.pending.pageId} ·{" "}
              {state.pending.kind === "write" ? "yaz" : "oku"}
            </motion.div>
          ) : (
            <motion.span
              key="idle"
              initial={false}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-[10px] font-semibold text-slate-500 md:text-xs"
            >
              <Layers3 size={16} />
              {selected
                ? "Aynı harf = aynı sayfa"
                : "Sayfalar, bütün süreç değil"}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between">
        <span className="eyebrow">Swap · slot</span>
        <span className="text-[10px] font-semibold text-slate-500">
          {state.slots.filter(Boolean).length} / {state.slots.length}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        {state.slots.map((id, slot) => (
          <MemoryCell
            key={`slot-${slot}`}
            id={id}
            label={`S${slot}`}
            enabled={enabled}
            selected={id === selected}
            pending={state.pending?.slot === slot}
            onSelect={onSelect}
            reserved={Boolean(id && !state.pages[id].swapValid)}
          />
        ))}
      </div>
    </div>
  );
}

function MemoryCell({
  id,
  label,
  selected,
  pending,
  enabled,
  onSelect,
  dirty = false,
  file = false,
  reserved = false,
}: {
  id: string | null;
  label: string;
  selected?: boolean;
  pending?: boolean;
  enabled: boolean;
  onSelect?: (id: string) => void;
  dirty?: boolean;
  file?: boolean;
  reserved?: boolean;
}) {
  return (
    <button
      disabled={!onSelect || !id}
      onClick={() => id && onSelect?.(id)}
      aria-pressed={selected === undefined ? undefined : selected}
      aria-label={`${label}: ${id ? `sayfa ${id}${dirty ? ", kirli" : ""}${file ? ", temiz dosya sayfası" : ""}${reserved ? ", slot ayrıldı, yazma tamamlanmadı" : ""}` : "boş"}`}
      className={`relative flex h-[clamp(58px,12vh,104px)] min-w-0 items-center justify-center rounded-2xl border-2 disabled:opacity-100 ${id ? colors[id] : "border-dashed border-slate-300 bg-white text-slate-400"} ${selected ? "ring-4 ring-blue/20 ring-offset-3 ring-offset-paper" : ""}`}
    >
      <span className="absolute top-2 left-2 text-[9px] font-semibold opacity-70 md:text-[10px]">
        {label}
      </span>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={id ?? "empty"}
          initial={enabled ? { scale: 0.5, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          exit={enabled ? { scale: 0.5, opacity: 0 } : undefined}
          transition={{ duration: enabled ? 0.25 : 0 }}
          className="font-display text-3xl font-semibold md:text-5xl"
        >
          {id ?? "—"}
        </motion.span>
      </AnimatePresence>
      {dirty && (
        <span className="absolute right-2 bottom-2 text-[8px] font-bold md:text-[10px]">
          KİRLİ
        </span>
      )}
      {file && <File size={14} className="absolute right-2 bottom-2" />}
      {reserved && (
        <LockKeyhole size={13} className="absolute right-2 bottom-2" />
      )}
      {pending && (
        <motion.span
          animate={{ opacity: enabled ? [0.25, 1, 0.25] : 1 }}
          transition={{ duration: 0.65, repeat: enabled ? Infinity : 0 }}
          className="absolute inset-0 rounded-[14px] border-3 border-blue"
        />
      )}
    </button>
  );
}

export function SwapConcept({ enabled }: { enabled: boolean }) {
  const [selected, setSelected] = useState("C");
  const [backing, setBacking] = useState<"file" | "partition">("file");
  const state = createSwapState();
  const page = state.pages[selected];
  return (
    <Stage
      title="RAM yetmezse?"
      controls={
        <div className="flex items-center justify-center gap-2">
          <Choice
            active={backing === "file"}
            onClick={() => setBacking("file")}
          >
            <File size={17} />
            Swap dosyası
          </Choice>
          <Choice
            active={backing === "partition"}
            onClick={() => setBacking("partition")}
          >
            <HardDrive size={17} />
            Ayrı bölüm
          </Choice>
        </div>
      }
    >
      <div className="grid w-full max-w-5xl items-center gap-5 md:grid-cols-[1fr_200px] md:gap-10">
        <MemoryMap
          state={state}
          enabled={enabled}
          selected={selected}
          onSelect={setSelected}
        />
        <div className="flex items-center justify-center gap-4 rounded-2xl border border-slate-300 bg-white p-4 md:flex-col md:gap-6 md:p-6">
          <motion.div
            key={selected}
            initial={enabled ? { scale: 0.85 } : false}
            animate={{ scale: 1 }}
            className={`flex size-14 shrink-0 items-center justify-center rounded-xl border-2 font-display text-3xl font-semibold md:size-20 md:text-5xl ${colors[selected]}`}
          >
            {selected}
          </motion.div>
          <div className="flex flex-col gap-2 text-xs font-semibold md:w-full">
            <span>
              {page.kind === "file" ? "Dosya destekli" : "Anonim"} ·{" "}
              {page.dirty ? "kirli" : "temiz"}
            </span>
            <span className="flex items-center justify-between gap-2 text-slate-600">
              RAM{" "}
              <strong className="text-ink">
                {page.frame === null ? "—" : `F${page.frame}`}
              </strong>
            </span>
            <span className="flex items-center justify-between gap-2 text-slate-600">
              Swap{" "}
              <strong className="text-ink">
                {page.slot === null ? "—" : `S${page.slot}`}
              </strong>
            </span>
          </div>
          <div className="hidden h-px w-full bg-slate-200 md:block" />
          <span className="hidden items-center gap-2 text-[10px] font-semibold text-slate-600 md:flex">
            {backing === "file" ? <File size={18} /> : <HardDrive size={18} />}
            {backing === "file"
              ? "Dosya içindeki slot’lar"
              : "Bölüm içindeki slot’lar"}
          </span>
        </div>
      </div>
    </Stage>
  );
}

export function SwapJourney({ enabled }: { enabled: boolean }) {
  const [state, setState] = useState(createSwapState);
  const [step, setStep] = useState(0);
  const [full, setFull] = useState(false);
  useEffect(() => {
    if (!state.pending) return;
    const timer = window.setTimeout(
      () => setState((current) => completeTransfer(current)),
      enabled ? 1100 : 0,
    );
    return () => window.clearTimeout(timer);
  }, [state.pending, enabled]);
  function reset(useFull = false) {
    setState(createSwapState(useFull));
    setFull(useFull);
    setStep(0);
  }
  function advance() {
    const next =
      step === 0
        ? beginPageOut(state, "A")
        : step === 1
          ? beginPageIn(state, "D")
          : step === 2
            ? beginPageOut(state, "B")
            : beginPageIn(state, "A");
    setState(next);
    if (!next.error) setStep(step + 1);
  }
  const actions = ["A → swap", "D’ye eriş", "B’yi bırak", "A’ya eriş"];
  return (
    <Stage
      title="Bir sayfanın yolculuğu."
      controls={
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            className="primary-button"
            onClick={advance}
            disabled={Boolean(state.pending) || step >= actions.length}
          >
            {state.pending
              ? "Aktarılıyor…"
              : step >= actions.length
                ? "Yolculuk tamam"
                : actions[step]}
            {step >= actions.length ? (
              <Check size={18} />
            ) : (
              <ArrowRight size={18} />
            )}
          </button>
          <Choice active={full} onClick={() => reset(!full)}>
            Swap dolu
          </Choice>
          <button
            className="icon-button"
            aria-label="RAM ve swap modelini sıfırla"
            onClick={() => reset(full)}
          >
            <RotateCcw size={19} />
          </button>
        </div>
      }
    >
      <div className="flex w-full max-w-4xl flex-col gap-3">
        <MemoryMap state={state} enabled={enabled} />
        <div className="flex items-center justify-center gap-4 text-xs font-semibold md:gap-8 md:text-sm">
          <span className="flex items-center gap-2">
            <ArrowDown size={17} className="text-orange" />
            Swap yazma{" "}
            <strong className="font-display text-xl md:text-2xl">
              {state.writes}
            </strong>
          </span>
          <span className="flex items-center gap-2">
            <ArrowUp size={17} className="text-blue" />
            Swap okuma{" "}
            <strong className="font-display text-xl md:text-2xl">
              {state.reads}
            </strong>
          </span>
        </div>
        <div
          role="status"
          aria-live="polite"
          className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2 text-center text-[10px] font-semibold md:text-xs ${state.error ? "bg-orange/15 text-ink" : "bg-blue/8 text-blue"}`}
        >
          {state.error && <CircleAlert size={18} className="shrink-0" />}
          {state.notice}
        </div>
      </div>
    </Stage>
  );
}
