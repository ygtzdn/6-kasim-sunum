import { useEffect, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  SkipForward,
} from "lucide-react";
import { Choice, Stage } from "../../components/presentation/ScenePrimitives";
import {
  calculateSchedule,
  defaultSchedule,
  parseQueue,
  type ScheduleAlgorithm,
  type ScheduleInput,
  type ScheduleResult,
} from "./model";

interface LabState {
  input: ScheduleInput;
  progress: Record<ScheduleAlgorithm, number>;
}
let labState: LabState = {
  input: { ...defaultSchedule, queue: [...defaultSchedule.queue] },
  progress: { FCFS: 0, SCAN: 0, "C-SCAN": 0 },
};
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
function updateState(next: LabState) {
  labState = next;
  listeners.forEach((listener) => listener());
}
function changeInput(input: ScheduleInput) {
  updateState({ input, progress: { FCFS: 0, SCAN: 0, "C-SCAN": 0 } });
}
function setProgress(algorithm: ScheduleAlgorithm, step: number) {
  updateState({
    ...labState,
    progress: { ...labState.progress, [algorithm]: step },
  });
}
export const useScheduleState = () =>
  useSyncExternalStore(subscribe, () => labState);
const colors: Record<ScheduleAlgorithm, string> = {
  FCFS: "#2247eb",
  SCAN: "#111827",
  "C-SCAN": "#ef602e",
};
const number = (n: number) => new Intl.NumberFormat("tr-TR").format(n);

export function QueueSetup({
  goTo,
  enabled,
}: {
  goTo: (id: string) => void;
  enabled: boolean;
}) {
  const { input } = useScheduleState();
  const [draft, setDraft] = useState(input.queue.join(", "));
  const [queueError, setQueueError] = useState("");
  const [headError, setHeadError] = useState("");
  const error = queueError || headError;
  const [headDraft, setHeadDraft] = useState(String(input.head));
  const updateQueue = (text: string) => {
    setDraft(text);
    try {
      changeInput({ ...input, queue: parseQueue(text) });
      setQueueError("");
    } catch (reason) {
      setQueueError((reason as Error).message);
    }
  };
  return (
    <Stage
      title="Aynı kuyruk. Farklı sıra."
      controls={
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Choice
            active={input.direction === "up"}
            onClick={() => changeInput({ ...input, direction: "up" })}
          >
            <ArrowUp size={16} />
            Artan
          </Choice>
          <Choice
            active={input.direction === "down"}
            onClick={() => changeInput({ ...input, direction: "down" })}
          >
            <ArrowDown size={16} />
            Azalan
          </Choice>
          <button className="primary-button" onClick={() => goTo("s11")}>
            Dene <ArrowRight size={18} />
          </button>
          <button
            className="icon-button"
            aria-label="Varsayılan örneği yükle"
            onClick={() => {
              changeInput({
                ...defaultSchedule,
                queue: [...defaultSchedule.queue],
              });
              setDraft(defaultSchedule.queue.join(", "));
              setHeadDraft("35");
              setQueueError("");
              setHeadError("");
            }}
          >
            <RotateCcw size={18} />
          </button>
        </div>
      }
    >
      <div className="flex h-full max-h-[520px] w-full max-w-[1120px] flex-col justify-center gap-5 md:gap-9">
        <div className="flex items-center justify-between gap-3">
          <span className="eyebrow">İstek kuyruğu · t = 0</span>
          <span className="eyebrow">0–99 silindir</span>
        </div>
        <div
          className={`flex min-h-0 items-center justify-center ${input.queue.length > 10 ? "gap-1 md:gap-2" : "gap-2 md:gap-4"}`}
        >
          {input.queue.length ? (
            input.queue.map((cylinder, index) => (
              <motion.div
                key={`${index}-${cylinder}`}
                initial={false}
                animate={{ y: enabled ? [4, 0] : 0, scale: 1 }}
                transition={{ delay: enabled ? index * 0.035 : 0 }}
                className="flex min-w-0 flex-1 flex-col items-center gap-2"
              >
                <span className="text-[10px] font-semibold text-slate-500">
                  {index + 1}
                </span>
                <div
                  className="flex aspect-square max-h-24 w-full items-center justify-center rounded-xl border-2 border-ink bg-white font-display font-medium"
                  style={{
                    fontSize:
                      input.queue.length > 10
                        ? "clamp(10px, 2vw, 22px)"
                        : "clamp(12px, 4vw, 52px)",
                  }}
                >
                  {cylinder}
                </div>
              </motion.div>
            ))
          ) : (
            <span className="font-display text-3xl text-slate-500">
              Boş kuyruk
            </span>
          )}
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_100px] items-end gap-4 md:grid-cols-[minmax(0,1fr)_140px] md:gap-7">
          <label className="flex min-w-0 flex-col gap-2 text-xs font-semibold">
            İstekler
            <input
              aria-label="Virgül veya boşlukla ayrılmış silindir istekleri"
              aria-invalid={Boolean(queueError)}
              aria-describedby={queueError ? "schedule-input-error" : undefined}
              className="h-12 min-w-0 rounded-xl border-2 border-ink bg-white px-4 font-display text-base md:h-15 md:text-2xl"
              value={draft}
              onChange={(event) => updateQueue(event.target.value)}
            />
          </label>
          <label className="flex flex-col gap-2 text-xs font-semibold">
            İlk kafa
            <input
              type="number"
              min={0}
              max={99}
              step={1}
              aria-label="Başlangıç kafa silindiri"
              aria-invalid={Boolean(headError)}
              aria-describedby={headError ? "schedule-input-error" : undefined}
              className="h-12 rounded-xl border-2 border-blue bg-white px-3 font-display text-xl text-blue md:h-15 md:text-3xl"
              value={headDraft}
              onChange={(event) => {
                const text = event.target.value;
                setHeadDraft(text);
                if (/^\d+$/.test(text) && Number(text) <= 99) {
                  changeInput({ ...input, head: Number(text) });
                  setHeadError("");
                } else
                  setHeadError("İlk kafa 0–99 arasında bir tam sayı olmalı.");
              }}
            />
          </label>
        </div>
        <div
          className="h-5 text-center text-xs font-semibold text-red-700"
          id="schedule-input-error"
          role={error ? "alert" : undefined}
        >
          {error}
        </div>
      </div>
    </Stage>
  );
}

function SchedulePlot({
  result,
  step,
  enabled,
}: {
  result: ScheduleResult;
  step: number;
  enabled: boolean;
}) {
  const x = (position: number) => 55 + (position / 99) * 970;
  const row = 330 / Math.max(6, result.events.length);
  const y = (index: number) => 60 + index * row;
  const points = [{ position: result.start }, ...result.events];
  const current = points[step];
  return (
    <svg
      viewBox="0 0 1080 450"
      className="h-full min-h-0 w-full"
      role="img"
      aria-label={`Kafa yolu, başlangıç ${result.start}. ${result.events
        .slice(0, step)
        .map(
          (event) =>
            `${event.position}${event.kind === "wrap" ? " servis yapılmayan dönüş" : ""}`,
        )
        .join(
          ", ",
        )}. ${step ? result.events[step - 1].total : 0} silindir hareketi.`}
    >
      {[0, 25, 50, 75, 99].map((tick) => (
        <g key={tick}>
          <path d={`M${x(tick)} 42V406`} stroke="#d5dbe4" strokeWidth="1" />
          <text
            x={x(tick)}
            y="435"
            textAnchor="middle"
            fontSize="15"
            fill="#475569"
          >
            {tick}
          </text>
        </g>
      ))}
      {result.events.map((event, index) => {
        const previous = points[index];
        const complete = index < step;
        return (
          <g key={index}>
            <motion.line
              initial={false}
              animate={
                event.kind === "wrap"
                  ? {
                      opacity: complete ? 1 : 0.12,
                    }
                  : {
                      opacity: complete ? 1 : 0.12,
                      pathLength: complete ? 1 : 0.6,
                    }
              }
              transition={{ duration: enabled ? 0.35 : 0 }}
              x1={x(previous.position)}
              y1={y(index)}
              x2={x(event.position)}
              y2={y(index + 1)}
              stroke={
                event.kind === "wrap" ? "#ef602e" : colors[result.algorithm]
              }
              strokeWidth={complete ? 4 : 2}
              strokeDasharray={event.kind === "wrap" ? "9 7" : undefined}
            />
            {event.kind === "wrap" && complete && (
              <text
                x={(x(previous.position) + x(event.position)) / 2}
                y={(y(index) + y(index + 1)) / 2 - 12}
                textAnchor="middle"
                fill="#b63c15"
                fontSize="15"
                fontWeight="700"
              >
                Servis yok · +{event.distance}
              </text>
            )}
            <circle
              cx={x(event.position)}
              cy={y(index + 1)}
              r={event.kind === "service" ? 5 : 4}
              fill={complete ? colors[result.algorithm] : "#fff"}
              stroke={complete ? colors[result.algorithm] : "#a1aabb"}
              strokeWidth="2"
            />
            {event.kind === "service" && (
              <text
                x={x(event.position) + (event.position > 85 ? -11 : 11)}
                y={y(index + 1) + 5}
                textAnchor={event.position > 85 ? "end" : "start"}
                fontSize="15"
                fill={complete ? "#111827" : "#64748b"}
              >
                {event.position}
              </text>
            )}
          </g>
        );
      })}
      <motion.circle
        initial={false}
        animate={{ cx: x(current.position), cy: y(step) }}
        transition={{ duration: enabled ? 0.5 : 0, ease: "easeInOut" }}
        r="12"
        fill="#fed84b"
        stroke="#111827"
        strokeWidth="3"
      />
      <text
        x={x(result.start) + 20}
        y="54"
        fill="#111827"
        fontSize="15"
        fontWeight="700"
      >
        {result.start}
      </text>
    </svg>
  );
}

export function SchedulingLab({
  algorithm,
  enabled,
  goTo,
}: {
  algorithm: ScheduleAlgorithm;
  enabled: boolean;
  goTo: (id: string) => void;
}) {
  const state = useScheduleState();
  const result = calculateSchedule(algorithm, state.input);
  const step = Math.min(state.progress[algorithm], result.events.length);
  const [playing, setPlaying] = useState(false);
  const signature = `${algorithm}:${state.input.head}:${state.input.queue.join(",")}:${state.input.direction}`;
  useEffect(() => {
    setPlaying(false);
  }, [signature, enabled]);
  useEffect(() => {
    if (!enabled || !playing || step >= result.events.length) return;
    const timer = window.setTimeout(
      () => setProgress(algorithm, step + 1),
      950,
    );
    return () => window.clearTimeout(timer);
  }, [enabled, playing, step, algorithm, result.events.length]);
  const completeIds = new Set(
    result.events
      .slice(0, step)
      .filter((event) => event.kind === "service")
      .map((event) => event.requestId),
  );
  const last = result.events[step - 1];
  const total = last?.total ?? 0;
  const done = step >= result.events.length;
  return (
    <Stage
      title={
        algorithm === "FCFS"
          ? "FCFS. Geliş sırası."
          : algorithm === "SCAN"
            ? "SCAN. Tara, dön."
            : "C-SCAN. Tek yönde servis."
      }
      controls={
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            className="primary-button disabled:opacity-35"
            disabled={done}
            onClick={() => {
              setPlaying(false);
              setProgress(algorithm, step + 1);
            }}
          >
            <SkipForward size={18} />
            Adım
          </button>
          <button
            className="icon-button disabled:opacity-35"
            aria-label={
              playing && !done ? "Animasyonu duraklat" : "Animasyonu oynat"
            }
            aria-pressed={playing && !done}
            disabled={done || !enabled}
            onClick={() => setPlaying(!playing)}
          >
            {playing && !done ? <Pause size={19} /> : <Play size={19} />}
          </button>
          <button
            className="icon-button"
            aria-label={`${algorithm} adımlarını sıfırla`}
            onClick={() => {
              setPlaying(false);
              setProgress(algorithm, 0);
            }}
          >
            <RotateCcw size={19} />
          </button>
          <button
            className="choice"
            onClick={() => goTo("s10")}
            aria-label="Kuyruğu ve ilk kafa konumunu düzenle"
          >
            <Settings2 size={17} />
            <span className="hidden md:inline">Kuyruk</span>
          </button>
          <span className="ml-1 text-xs font-semibold text-slate-600">
            {state.input.direction === "up" ? "↑ 99" : "↓ 0"}
          </span>
        </div>
      }
    >
      <div className="flex h-full w-full max-w-[1120px] flex-col gap-2 md:gap-3">
        <div className="flex items-end justify-between gap-4 px-2">
          <div className="flex items-baseline gap-2">
            <strong className="font-display text-4xl font-medium text-blue md:text-6xl">
              {number(total)}
            </strong>
            <span className="text-[10px] font-semibold text-slate-600 md:text-xs">
              silindir hareketi
            </span>
            {last && (
              <span className="ml-2 rounded-lg bg-[#fed84b] px-2 py-1 text-xs font-semibold">
                +{last.distance}
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-slate-600">
            {completeIds.size}/{state.input.queue.length}{" "}
            <span className="hidden md:inline">istek</span>
          </span>
        </div>
        <div className="min-h-0 flex-1">
          <SchedulePlot result={result} step={step} enabled={enabled} />
        </div>
        <div
          className="flex min-h-7 flex-wrap justify-center gap-1.5"
          aria-label="Geliş sırasındaki istekler"
        >
          {state.input.queue.map((cylinder, id) => (
            <span
              key={id}
              aria-label={`İstek ${id + 1}, silindir ${cylinder}, ${completeIds.has(id) ? "tamamlandı" : "bekliyor"}`}
              className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 font-display text-xs md:text-sm ${completeIds.has(id) ? "border-blue bg-blue text-white" : "border-slate-300 bg-white text-ink"}`}
            >
              <small className="text-[8px] opacity-70">{id + 1}</small>
              {cylinder}
              {completeIds.has(id) && <Check size={12} />}
            </span>
          ))}
        </div>
        <div
          className="h-5 text-center text-xs font-semibold text-slate-600"
          role="status"
          aria-live="polite"
        >
          {last
            ? last.kind === "service"
              ? `İstek ${(last.requestId ?? 0) + 1} tamamlandı · kafa ${last.position}`
              : last.kind === "wrap"
                ? "Diğer uca dönüş · servis yok"
                : "Fiziksel uç · yön sınırı"
            : state.input.queue.length
              ? `Başlangıç ${state.input.head}`
              : "Boş kuyruk · hareket yok"}
        </div>
      </div>
    </Stage>
  );
}

export function ScheduleComparison({
  enabled,
  goTo,
}: {
  enabled: boolean;
  goTo: (id: string) => void;
}) {
  const { input } = useScheduleState();
  const [answer, setAnswer] = useState<boolean | null>(null);
  const algorithms: ScheduleAlgorithm[] = ["FCFS", "SCAN", "C-SCAN"];
  const results = algorithms.map((algorithm) =>
    calculateSchedule(algorithm, input),
  );
  const max = Math.max(1, ...results.map((result) => result.total));
  return (
    <Stage
      title="Yol, tek ölçüt mü?"
      controls={
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="mr-2 text-xs font-semibold">Dönüş ücretsiz mi?</span>
          <Choice active={answer === true} onClick={() => setAnswer(true)}>
            Evet
          </Choice>
          <Choice active={answer === false} onClick={() => setAnswer(false)}>
            Hayır
          </Choice>
          <button
            className="icon-button"
            aria-label="Soru cevabını temizle"
            onClick={() => setAnswer(null)}
          >
            <RotateCcw size={17} />
          </button>
        </div>
      }
    >
      <div className="flex h-full max-h-[500px] w-full max-w-[980px] flex-col justify-center gap-5 md:gap-8">
        {results.map((result, index) => (
          <button
            key={result.algorithm}
            className="grid grid-cols-[75px_minmax(0,1fr)_55px] items-center gap-3 text-left md:grid-cols-[120px_minmax(0,1fr)_90px] md:gap-7"
            onClick={() => goTo(["s11", "s12", "s13"][index])}
            aria-label={`${result.algorithm}, ${result.total} silindir hareketi. İlgili sahneye git.`}
          >
            <span className="font-display text-base font-medium md:text-2xl">
              {result.algorithm}
            </span>
            <div className="h-10 rounded-lg bg-slate-100 md:h-16">
              <motion.div
                initial={false}
                animate={{ width: `${(result.total / max) * 100}%` }}
                transition={{ duration: enabled ? 0.65 : 0 }}
                className="h-full rounded-lg"
                style={{ background: colors[result.algorithm] }}
              />
            </div>
            <strong className="font-display text-2xl font-medium md:text-5xl">
              {result.total}
            </strong>
          </button>
        ))}
        <div className="flex items-center justify-center gap-4 pt-2 text-xs font-semibold text-slate-600 md:gap-10 md:text-base">
          <span>Hareket</span>
          <span>Bekleme</span>
          <span>Adalet</span>
        </div>
        <div
          className="h-7 text-center font-display text-base font-medium text-blue md:text-2xl"
          aria-live="polite"
        >
          {answer === false
            ? "Dönüş de harekettir."
            : answer === true
              ? "Servis yok. Hareket var."
              : ""}
        </div>
      </div>
    </Stage>
  );
}
