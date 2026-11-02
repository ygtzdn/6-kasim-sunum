import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronRight,
  Copy,
  Database,
  HardDrive,
  Layers,
  RotateCcw,
  Server,
  ShieldAlert,
  ShieldCheck,
  X,
} from "lucide-react";
import { Choice, Stage } from "../../components/presentation/ScenePrimitives";
import type { SceneContext } from "../../presentation/types";
import {
  advanceRebuild,
  createRaidState,
  RAID_LEVELS,
  raidLayout,
  raidStatus,
  recoverable,
  STRIPES,
  usableCapacity,
  validDiskCounts,
  xorBlocks,
} from "./model.mjs";
import { raidActions, useRaid } from "./store";

type RaidState = ReturnType<typeof createRaidState>;
const STATUS = {
  healthy: {
    label: "Sağlıklı",
    className: "border-blue bg-blue text-white",
    Icon: ShieldCheck,
  },
  degraded: {
    label: "Erişim var · koruma azaldı",
    className: "border-ink bg-[#fed84b] text-ink",
    Icon: ShieldAlert,
  },
  rebuilding: {
    label: "Yeniden kuruluyor",
    className: "border-blue bg-blue/10 text-blue",
    Icon: RotateCcw,
  },
  unrecoverable: {
    label: "Modelde kurtarılamaz",
    className: "border-ink bg-orange text-ink",
    Icon: X,
  },
};

function RaidSettings({ state }: { state: RaidState }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
      <fieldset
        className="flex flex-wrap items-center justify-center gap-1.5"
        aria-label="RAID seviyeleri"
        disabled={state.rebuilding}
      >
        {RAID_LEVELS.map((level) => (
          <Choice
            key={level}
            active={state.level === level}
            onClick={() => {
              if (!state.rebuilding) raidActions.configure({ level });
            }}
            label={`RAID ${level} seç`}
          >
            {level}
          </Choice>
        ))}
      </fieldset>
      <label className="flex items-center gap-2 text-xs font-semibold">
        <span>Disk</span>
        <select
          className="min-h-10 rounded-xl border border-slate-300 bg-white px-2 text-base font-semibold"
          aria-label="Dizideki disk sayısı"
          value={state.disks}
          disabled={state.rebuilding}
          onChange={(event) =>
            raidActions.configure({ disks: Number(event.target.value) })
          }
        >
          {validDiskCounts(state.level).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-xs font-semibold">
        <select
          className="min-h-10 rounded-xl border border-slate-300 bg-white px-2 text-base font-semibold"
          aria-label="Her diskin TB cinsinden kapasitesi"
          value={state.sizeTB}
          disabled={state.rebuilding}
          onChange={(event) =>
            raidActions.configure({ sizeTB: Number(event.target.value) })
          }
        >
          {Array.from({ length: 8 }, (_, index) => index + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span>TB / disk</span>
      </label>
    </div>
  );
}

function RaidHealth({ state }: { state: RaidState }) {
  const status = STATUS[raidStatus(state) as keyof typeof STATUS];
  const Icon = status.Icon;
  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-center text-xs font-semibold md:text-sm ${status.className}`}
      aria-live="polite"
    >
      <Icon size={17} />
      {status.label}
    </div>
  );
}

function RaidBoard({
  state,
  enabled,
  compact = false,
}: {
  state: RaidState;
  enabled: boolean;
  compact?: boolean;
}) {
  const reduce = useReducedMotion();
  const rows = raidLayout(state);
  return (
    <div className="flex min-h-0 w-full max-w-5xl flex-col gap-2">
      {state.level === 10 && (
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${state.disks},minmax(0,1fr))`,
          }}
        >
          {Array.from({ length: state.disks / 2 }, (_, pair) => (
            <div
              key={pair}
              className="col-span-2 rounded-t-xl border-x-2 border-t-2 border-blue pt-1 text-center text-[10px] font-bold text-blue md:text-xs"
            >
              Ayna {pair + 1}
            </div>
          ))}
        </div>
      )}
      <div
        className="grid min-h-0 gap-1.5 md:gap-3"
        style={{ gridTemplateColumns: `repeat(${state.disks},minmax(0,1fr))` }}
      >
        {Array.from({ length: state.disks }, (_, disk) => {
          const failed = state.failed.includes(disk);
          const replacement = failed && state.rebuilding;
          return (
            <button
              key={disk}
              className={`flex min-h-0 min-w-0 flex-col items-center gap-2 overflow-hidden rounded-xl border-2 p-1.5 text-center transition-colors md:p-3 ${failed ? "border-orange bg-orange/5" : "border-ink bg-white"}`}
              aria-label={`D${disk}, ${state.sizeTB} TB, ${replacement ? "boş yedek; yeniden kuruluyor" : failed ? "arızalı; arızayı geri al" : "sağlam; arıza ekle"}`}
              aria-pressed={failed}
              disabled={state.rebuilding}
              onClick={() => raidActions.fail(disk)}
            >
              <div className="flex flex-wrap items-center justify-center gap-1 text-xs font-bold md:gap-2 md:text-base">
                <HardDrive className="size-4 md:size-6" strokeWidth={1.5} />
                <span>D{disk}</span>
                {failed && <X size={13} className="text-orange" />}
              </div>
              <div className="grid w-full grid-rows-3 gap-1.5 md:gap-2">
                {rows.map((row, stripe) => {
                  const cell = row[disk];
                  const reconstructed = replacement && stripe < state.rebuild;
                  const missing = failed && !reconstructed;
                  const color =
                    cell.kind === "q"
                      ? "bg-[#c4b2fa] text-ink"
                      : cell.kind === "parity"
                        ? "bg-[#fed84b] text-ink"
                        : "bg-blue text-white";
                  return (
                    <motion.div
                      key={stripe}
                      initial={false}
                      animate={{
                        opacity: 1,
                        scale: reconstructed && enabled ? [1, 1.05, 1] : 1,
                      }}
                      transition={{ duration: enabled && !reduce ? 0.3 : 0 }}
                      className={`flex min-h-0 flex-col items-center justify-center rounded-lg px-1 ${compact ? "h-[clamp(28px,5.2dvh,55px)]" : "h-[clamp(38px,7dvh,78px)]"} ${missing ? "border border-dashed border-orange bg-white text-ink" : color}`}
                    >
                      <span className="font-display text-sm font-semibold md:text-xl">
                        {missing ? (replacement ? "∅" : "×") : cell.label}
                      </span>
                      {!compact && (
                        <small className="hidden text-[9px] font-medium sm:block md:text-[10px]">
                          {missing
                            ? replacement
                              ? "Yedek"
                              : "Kayıp"
                            : reconstructed
                              ? "Yeniden kuruldu"
                              : cell.kind === "q"
                                ? "Q ≠ P"
                                : cell.bits}
                        </small>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-4 text-[10px] font-semibold text-slate-700 md:text-xs">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-blue" />
          {state.level === 1 || state.level === 10 ? "Kopya" : "Veri"}
        </span>
        {[4, 5, 6].includes(state.level) && (
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-[#fed84b]" />P · XOR
          </span>
        )}
        {state.level === 6 && (
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-[#c4b2fa]" />Q · bağımsız
            kod
          </span>
        )}
      </div>
    </div>
  );
}

function Capacity({ state }: { state: RaidState }) {
  return (
    <div className="flex items-baseline justify-center gap-3 font-display">
      <strong className="text-[clamp(30px,5vw,64px)] font-medium tracking-tight text-blue">
        {usableCapacity(state)}
        <small className="ml-1 text-lg md:text-2xl">TB</small>
      </strong>
      <span className="text-xs text-slate-600 md:text-sm">
        / {state.disks * state.sizeTB} TB fiziksel
      </span>
    </div>
  );
}

function Utility({ openMenu }: SceneContext) {
  return (
    <div className="flex items-center gap-1">
      <button
        className="icon-button"
        aria-label="Arızaları ve yeniden kurmayı sıfırla; seçili RAID ayarlarını koru"
        onClick={raidActions.reset}
      >
        <RotateCcw size={18} />
      </button>
      <button
        className="icon-button"
        onClick={openMenu}
        aria-label="RAID modelinin açıklamasını ve sınırlarını aç"
      >
        ?
      </button>
    </div>
  );
}

function Announcement({ state }: { state: RaidState }) {
  return (
    <p
      className={
        state.message.startsWith("RAID ")
          ? "text-center text-xs font-semibold text-orange"
          : "sr-only"
      }
      aria-live="polite"
    >
      {state.message}
    </p>
  );
}

export function RaidOverviewScene(context: SceneContext) {
  const state = useRaid();
  const [focus, setFocus] = useState<"capacity" | "parallel" | "protection">(
    "capacity",
  );
  return (
    <Stage
      title="Bir dizi. Birden çok disk."
      controls={
        <div className="flex flex-col items-center gap-2">
          <RaidSettings state={state} />
          <Utility {...context} />
        </div>
      }
    >
      <div className="flex h-full min-h-0 w-full max-w-5xl flex-col items-center justify-center gap-3 md:gap-5">
        <div className="flex items-center justify-center gap-4 text-xs font-semibold md:gap-7 md:text-base">
          <span className="flex items-center gap-2">
            <Server className="size-5 md:size-7" />
            Host
          </span>
          <ArrowRight size={20} />
          <span className="flex items-center gap-2 rounded-xl border-2 border-ink bg-white px-3 py-2">
            <Layers className="size-5 md:size-7" />
            Denetleyici
          </span>
          <ArrowDown size={20} />
          <strong>RAID {state.level}</strong>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Choice
            active={focus === "capacity"}
            onClick={() => setFocus("capacity")}
          >
            <Database size={16} />
            Kapasite
          </Choice>
          <Choice
            active={focus === "parallel"}
            onClick={() => setFocus("parallel")}
          >
            <Layers size={16} />
            Dağıtım
          </Choice>
          <Choice
            active={focus === "protection"}
            onClick={() => setFocus("protection")}
          >
            <ShieldCheck size={16} />
            Koruma
          </Choice>
        </div>
        <div
          className="flex h-13 shrink-0 items-center justify-center"
          aria-live="polite"
        >
          {focus === "capacity" ? (
            <Capacity state={state} />
          ) : focus === "parallel" ? (
            <div className="flex gap-4 font-display text-2xl font-semibold text-blue">
              {Array.from({ length: Math.min(state.disks, 4) }, (_, index) => (
                <motion.span
                  key={index}
                  animate={{ y: context.enabled ? [0, -7, 0] : 0 }}
                  transition={{ duration: 0.45, delay: index * 0.1 }}
                >
                  <ArrowDown />A{index}
                </motion.span>
              ))}
            </div>
          ) : (
            <RaidHealth state={state} />
          )}
        </div>
        <RaidBoard state={state} enabled={context.enabled} compact />
        <Announcement state={state} />
      </div>
    </Stage>
  );
}

export function StripingMirrorScene(context: SceneContext) {
  const state = useRaid();
  return (
    <Stage
      title="Şerit mi, kopya mı?"
      controls={
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Choice
            active={state.level === 0}
            onClick={() => raidActions.configure({ level: 0 })}
          >
            RAID 0 · şerit
          </Choice>
          <Choice
            active={state.level === 1}
            onClick={() => raidActions.configure({ level: 1 })}
          >
            RAID 1 · ayna
          </Choice>
          <Utility {...context} />
        </div>
      }
    >
      <div className="flex h-full min-h-0 w-full flex-col items-center justify-center gap-4 md:gap-6">
        <div className="flex items-center gap-5">
          <span className="rounded-xl border-2 border-ink bg-white px-4 py-2 font-display text-lg font-semibold">
            RAID {state.level}
          </span>
          <Capacity state={state} />
        </div>
        <RaidBoard state={state} enabled={context.enabled} />
        <RaidHealth state={state} />
        <Announcement state={state} />
      </div>
    </Stage>
  );
}

function XorProof({ state }: { state: RaidState }) {
  const row = raidLayout(state)[0];
  const failed = state.failed;
  const parity = row.find((cell) => cell.kind === "parity");
  if (!parity || ![4, 5].includes(state.level))
    return (
      <div className="text-center text-sm font-semibold text-slate-700">
        {state.level === 6
          ? "P / Q: bağımsız koruma · Q hesabı kapsam dışında"
          : "XOR örneği için RAID 4 veya 5"}
      </div>
    );
  if (failed.length > 1)
    return (
      <div className="flex items-center gap-2 text-sm font-semibold text-orange">
        <ShieldAlert size={18} />
        İki bilinmeyen · tek parite yetmez
      </div>
    );
  const missing = failed.length === 1 ? row[failed[0]] : parity;
  const operands =
    missing.kind === "parity"
      ? row.filter((cell) => cell.kind === "data")
      : row.filter((cell) => cell.disk !== missing.disk);
  const answer = xorBlocks(operands.map((cell) => cell.bits as string));
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-2"
      role="group"
      aria-label={`Birinci şeritte ${missing.label} = ${operands.map((cell) => cell.bits).join(" XOR ")} = ${answer}`}
    >
      <span
        className={`rounded-lg border-2 border-ink px-3 py-2 font-display text-base font-semibold ${missing.kind === "parity" ? "bg-[#fed84b]" : "bg-orange/10"}`}
      >
        {missing.label}
      </span>
      <span className="font-semibold">=</span>
      {operands.map((cell, index) => (
        <span key={cell.disk} className="inline-flex items-center gap-2">
          {index > 0 && <span className="text-lg text-slate-500">⊕</span>}
          <span
            className={`flex flex-col items-center rounded-lg px-2 py-1 ${cell.kind === "parity" ? "bg-[#fed84b] text-ink" : "bg-blue text-white"}`}
          >
            <small className="text-[9px]">
              D{cell.disk} · {cell.label}
            </small>
            <strong className="font-mono text-sm md:text-lg">
              {cell.bits}
            </strong>
          </span>
        </span>
      ))}
      <span className="font-semibold">=</span>
      <strong className="font-mono text-xl text-blue">{answer}</strong>
    </div>
  );
}

export function ParityRaidScene(context: SceneContext) {
  const state = useRaid();
  const [showXor, setShowXor] = useState(false);
  const demonstrate = () => {
    raidActions.configure({ level: 5, disks: 4 });
    raidActions.fail(1);
    setShowXor(true);
  };
  return (
    <Stage
      title="Kopyalamadan korumak."
      controls={
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[4, 5, 6].map((level) => (
            <Choice
              key={level}
              active={state.level === level}
              onClick={() => raidActions.configure({ level })}
            >
              RAID {level}
            </Choice>
          ))}
          <Choice active={showXor} onClick={() => setShowXor(!showXor)}>
            XOR
          </Choice>
          <button
            className="choice"
            disabled={state.rebuilding}
            onClick={demonstrate}
          >
            A1 kaybolsun
          </button>
          <Utility {...context} />
        </div>
      }
    >
      <div className="flex h-full min-h-0 w-full flex-col items-center justify-center gap-3 md:gap-5">
        <div className="flex items-center gap-4">
          <strong className="font-display text-lg md:text-2xl">
            RAID {state.level}
          </strong>
          <Capacity state={state} />
        </div>
        <RaidBoard state={state} enabled={context.enabled} compact={showXor} />
        <div className="flex min-h-11 items-center justify-center">
          {showXor ? <XorProof state={state} /> : <RaidHealth state={state} />}
        </div>
        <Announcement state={state} />
      </div>
    </Stage>
  );
}

export function FailureRaidScene(context: SceneContext) {
  const state = useRaid();
  const preset = (samePair: boolean) => {
    raidActions.configure({ level: 10, disks: 4 });
    raidActions.fail(0);
    raidActions.fail(samePair ? 1 : 2);
  };
  return (
    <Stage
      title="Hangi iki disk?"
      controls={
        <div className="flex flex-col items-center gap-2">
          <RaidSettings state={state} />
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              className="choice"
              disabled={state.rebuilding}
              onClick={() => preset(false)}
            >
              D0 + D2
            </button>
            <button
              className="choice"
              disabled={state.rebuilding}
              onClick={() => preset(true)}
            >
              D0 + D1
            </button>
            <Utility {...context} />
          </div>
        </div>
      }
    >
      <div className="flex h-full min-h-0 w-full flex-col items-center justify-center gap-3 md:gap-5">
        <div className="flex items-center gap-4">
          <strong className="font-display text-lg md:text-2xl">
            RAID {state.level}
          </strong>
          <Capacity state={state} />
        </div>
        <RaidBoard state={state} enabled={context.enabled} />
        <RaidHealth state={state} />
        <Announcement state={state} />
      </div>
    </Stage>
  );
}

export function RebuildRaidScene(context: SceneContext) {
  const state = useRaid();
  const [compare, setCompare] = useState(false);
  const canRebuild =
    recoverable(state) && state.failed.length > 0 && !state.rebuilding;
  const rows = RAID_LEVELS.map((level) => {
    const count = validDiskCounts(level).includes(state.disks)
      ? state.disks
      : validDiskCounts(level)[0];
    return createRaidState(level, count, state.sizeTB);
  });
  const progress = state.rebuilding || state.rebuild > 0;
  const next = advanceRebuild(state);
  return (
    <Stage
      title="Koruma geri nasıl gelir?"
      controls={
        <div className="flex flex-col items-center gap-2">
          <RaidSettings state={state} />
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              className="primary-button"
              disabled={!canRebuild && !state.rebuilding}
              onClick={
                state.rebuilding ? raidActions.step : raidActions.rebuild
              }
            >
              {state.rebuilding ? (
                <>
                  <ChevronRight size={17} />
                  Şerit {next.rebuild}/{STRIPES}
                </>
              ) : (
                <>
                  <RotateCcw size={17} />
                  Yedek tak · yeniden kur
                </>
              )}
            </button>
            <Choice active={compare} onClick={() => setCompare(!compare)}>
              Kapasiteler
            </Choice>
            <Utility {...context} />
          </div>
        </div>
      }
    >
      <div className="flex h-full min-h-0 w-full flex-col items-center justify-center gap-3 md:gap-4">
        <div className="flex items-center gap-5">
          <strong className="font-display text-lg md:text-2xl">
            RAID {state.level}
          </strong>
          <Capacity state={state} />
        </div>
        {compare ? (
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl border-2 border-ink bg-white">
            <table className="w-full text-center text-xs md:text-base">
              <caption className="sr-only">
                Eşit disk boyutlarıyla kapasite karşılaştırması. RAID 1 yalnızca
                iki disk kullanır.
              </caption>
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-2 py-2">RAID</th>
                  <th className="px-2 py-2">Disk × TB</th>
                  <th className="px-2 py-2">Kullanılabilir</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.level}
                    className={`border-t border-slate-200 ${row.level === state.level ? "bg-blue text-white" : ""}`}
                  >
                    <th className="p-1.5 md:p-2.5">{row.level}</th>
                    <td>
                      {row.disks} × {row.sizeTB}
                    </td>
                    <td className="font-display text-lg font-semibold">
                      {usableCapacity(row)} TB
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <RaidBoard state={state} enabled={context.enabled} compact />
        )}
        {progress && (
          <div
            className="w-full max-w-lg"
            aria-label={`${state.rebuild}/${STRIPES} temsili şerit yeniden kuruldu`}
          >
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: STRIPES }, (_, index) => (
                <div
                  key={index}
                  className={`flex h-7 items-center justify-center rounded-lg border border-ink text-xs font-semibold ${index < state.rebuild ? "bg-blue text-white" : "bg-white"}`}
                >
                  {index < state.rebuild ? <Check size={16} /> : index + 1}
                </div>
              ))}
            </div>
            <span className="mt-1 block text-center text-[10px] text-slate-600">
              Şerit adımları · süre tahmini yok
            </span>
          </div>
        )}
        <RaidHealth state={state} />
        <Announcement state={state} />
      </div>
    </Stage>
  );
}

export function RaidTradeoffScene(context: SceneContext) {
  const [topic, setTopic] = useState<"pairs" | "integrity" | "object">("pairs");
  const [revealed, setRevealed] = useState(false);
  return (
    <Stage
      title="Yedeklilik ≠ yedekleme"
      controls={
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Choice
            active={topic === "pairs"}
            onClick={() => {
              setTopic("pairs");
              setRevealed(false);
            }}
          >
            1+0 / 0+1
          </Choice>
          <Choice
            active={topic === "integrity"}
            onClick={() => {
              setTopic("integrity");
              setRevealed(false);
            }}
          >
            Bütünlük
          </Choice>
          <Choice
            active={topic === "object"}
            onClick={() => {
              setTopic("object");
              setRevealed(false);
            }}
          >
            Nesne
          </Choice>
          <button
            className="icon-button"
            aria-label="Ödünleşimleri ve kaynak notlarını aç"
            onClick={context.openMenu}
          >
            ?
          </button>
        </div>
      }
    >
      <div className="flex h-full min-h-0 w-full max-w-4xl flex-col items-center justify-center gap-5 md:gap-8">
        {topic === "pairs" ? (
          <>
            <div className="grid w-full grid-cols-2 gap-4 md:gap-8">
              {["1+0", "0+1"].map((level, index) => (
                <div
                  key={level}
                  className="rounded-2xl border-2 border-ink bg-white p-3 text-center md:p-6"
                >
                  <h2 className="font-display text-2xl font-semibold md:text-4xl">
                    {level}
                  </h2>
                  <div className="my-5 grid grid-cols-2 gap-3">
                    {[0, 1].map((group) => (
                      <div
                        key={group}
                        className={`flex justify-center gap-1 rounded-xl border-2 p-2 md:gap-3 md:p-4 ${index === 0 ? "border-blue bg-blue/5" : "border-orange bg-orange/5"}`}
                      >
                        {[0, 1].map((disk) => (
                          <HardDrive
                            key={disk}
                            className="size-6 md:size-10"
                            strokeWidth={1.5}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-semibold md:text-base">
                    {index === 0 ? "Aynaları şeritle" : "Şeritleri aynala"}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button className="choice" onClick={() => setRevealed(!revealed)}>
                RAID 10: her iki kayıp tolere edilir mi?
              </button>
              {revealed && (
                <p
                  className="mt-3 text-sm font-semibold text-blue"
                  aria-live="polite"
                >
                  Hayır. Aynı ayna çifti kaybolabilir.
                </p>
              )}
            </div>
          </>
        ) : topic === "integrity" ? (
          <>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-7">
              <Database className="size-14 text-blue md:size-22" />
              <ArrowRight />
              <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-ink bg-[#fed84b] p-5">
                <ShieldCheck className="size-12 md:size-18" />
                <span className="font-mono text-xs md:text-lg">checksum</span>
              </div>
              <ArrowRight />
              <div className="flex flex-col items-center gap-3">
                <Layers className="size-14 text-blue md:size-22" />
                <span className="font-display text-lg font-semibold">
                  Havuz → dosya sistemi
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-center text-sm font-semibold md:text-xl">
              <Copy size={22} />
              <span>Bağımsız yedek · ayrı geri dönüş noktası</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center gap-5 md:gap-10">
              <span className="rounded-xl border-2 border-ink bg-[#fed84b] px-5 py-4 font-mono text-xl md:text-3xl">
                id:42
              </span>
              <ArrowRight className="shrink-0" />
              <div className="grid grid-cols-3 gap-2 rounded-2xl border-2 border-blue p-4 md:gap-4 md:p-7">
                {Array.from({ length: 6 }, (_, index) => (
                  <motion.div
                    key={index}
                    animate={{ opacity: context.enabled ? [1, 0.55, 1] : 1 }}
                    transition={{ duration: 0.5, delay: index * 0.07 }}
                    className="flex size-11 items-center justify-center rounded-lg bg-blue text-white md:size-17"
                  >
                    <Database size={26} />
                  </motion.div>
                ))}
              </div>
            </div>
            <span className="text-center font-display text-xl font-semibold md:text-3xl">
              Kimlik · metadata · veri
            </span>
          </>
        )}
      </div>
    </Stage>
  );
}
