import { curveLinear, line } from "d3-shape";
import { scaleLinear } from "d3-scale";
import { motion } from "motion/react";
import {
  ArrowDown,
  Check,
  RotateCcw,
  SkipForward,
  ArrowRight,
  Cpu,
  Database,
} from "lucide-react";
import type { SceneContext } from "../../presentation/types";
import { Choice, Stage } from "../../components/presentation/ScenePrimitives";
import { StageCaption } from "../../presentation/PresentationMotion";
import {
  calculateSchedule,
  cylinderMaximum,
  defaultSchedule,
  type ScheduleAlgorithm,
  type ScheduleResult,
} from "./model";

const colors: Record<ScheduleAlgorithm, string> = {
  FCFS: "#2247eb",
  SCAN: "#111827",
  "C-SCAN": "#ef602e",
};
const number = (n: number) => new Intl.NumberFormat("tr-TR").format(n);

const chartPolyline = line<[number, number]>()
  .x((point) => point[0])
  .y((point) => point[1])
  .curve(curveLinear);
const comparisonWidth = scaleLinear([0, 640], [0, 100]);
const circularSegmentWidth = scaleLinear([0, 386], [0, 100]);
const boundaryX = scaleLinear([0, 183], [35, 660]);

export function QueueSetup({ stage, setStage }: SceneContext) {
  return (
    <Stage
      title="Aynı kuyruk. Aynı başlangıç."
      controls={
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "Neden kuyruk?",
            "Geliş sırası",
            "Kafa ve sınırlar",
            "Yön ve ölçü",
          ].map((label, i) => (
            <Choice
              key={label}
              active={stage === i}
              onClick={() => setStage(i)}
            >
              {label}
            </Choice>
          ))}
        </div>
      }
    >
      <div className="flex h-full w-full max-w-[1080px] flex-col justify-center gap-5 md:gap-8">
        {stage === 0 ? (
          <div className="grid grid-cols-2 gap-5">
            {[false, true].map((busy) => (
              <div
                key={String(busy)}
                className="flex flex-col items-center gap-5 rounded-2xl border-2 border-ink bg-white p-5 md:p-8"
              >
                <Cpu size={45} />
                <h2 className="font-display text-xl">
                  {busy ? "Aygıt meşgul" : "Aygıt boşta"}
                </h2>
                <div className="flex gap-2">
                  {Array.from({ length: busy ? 3 : 1 }, (_, i) => (
                    <span
                      className={`rounded-lg px-3 py-2 text-xs font-semibold ${busy ? "bg-orange/15 text-orange" : "bg-blue/10 text-blue"}`}
                      key={i}
                    >
                      İstek{i + 1}
                    </span>
                  ))}
                </div>
                <ArrowDown />
                <Database size={45} />
                <p className="text-center text-xs font-semibold text-slate-500">
                  {busy
                    ? "Bekleyen istekler: sıra seçimi var"
                    : "Tek hazır istek: hemen işlenebilir"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="text-center text-xs font-semibold text-slate-500">
              Resmî sekiz istek · geliş sırası · t=0’da hazır
            </p>
            <div className="grid grid-cols-8 gap-2 md:gap-4">
              {defaultSchedule.queue.map((value, i) => (
                <div key={value} className="flex flex-col items-center gap-2">
                  <small className="text-slate-500">{i + 1}</small>
                  <span className="flex aspect-square w-full items-center justify-center rounded-xl border-2 border-ink bg-white font-display text-[clamp(16px,3.5vw,46px)]">
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "Kafa", value: stage >= 2 ? "53" : "?" },
                { name: "Fiziksel sınır", value: stage >= 2 ? "0–199" : "?" },
                { name: "Yön", value: stage >= 3 ? "↓ Azalan" : "?" },
              ].map((m) => (
                <div
                  key={m.name}
                  className="rounded-xl border border-slate-300 bg-white p-4 text-center"
                >
                  <small className="text-xs font-semibold text-slate-500">
                    {m.name}
                  </small>
                  <strong className="mt-2 block font-display text-xl text-blue md:text-3xl">
                    {m.value}
                  </strong>
                </div>
              ))}
            </div>
            {stage === 3 && (
              <div className="flex justify-center gap-3 rounded-xl bg-blue/5 p-4 font-display text-lg text-blue md:text-2xl">
                <span>Σ |sonraki − önceki|</span>
                <ArrowRight />
                <span>Silindir hareketi</span>
              </div>
            )}
          </>
        )}
        <p className="text-center text-xs font-semibold text-slate-600 md:text-sm">
          {
            [
              "Birden çok bekleyen istek varsa yeniden sıralama seçimi doğar.",
              "Kart sırası fiziksel yakınlık değil, geliş kimliğidir.",
              "Kuyruk, kafa ve sınırlar bütün karşılaştırmalarda aynı kalır.",
              "Ortak yön azalan. FCFS yönü kullanmaz. Ölçü ms değil, silindir hareketidir.",
            ][stage]
          }
        </p>
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
  const x = scaleLinear([0, cylinderMaximum], [55, 1025]);
  const y = scaleLinear([0, Math.max(6, result.events.length)], [60, 390]);
  const plotLine = line<{ position: number; row: number }>()
    .x((point) => x(point.position))
    .y((point) => y(point.row))
    .curve(curveLinear);
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
      {[0, 50, 100, 150, cylinderMaximum].map((tick) => (
        <g key={tick}>
          <path
            d={
              chartPolyline([
                [x(tick), 42],
                [x(tick), 406],
              ]) ?? ""
            }
            stroke="#d5dbe4"
            strokeWidth="1"
          />
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
          <motion.g
            key={index}
            initial={false}
            animate={{ opacity: complete ? 1 : 0 }}
            transition={{ duration: enabled ? 0.18 : 0 }}
          >
            <motion.path
              initial={false}
              animate={
                event.kind === "wrap"
                  ? {
                      opacity: complete ? 1 : 0.12,
                    }
                  : {
                      opacity: complete ? 1 : 0.12,
                      pathLength: complete ? 1 : 0,
                    }
              }
              transition={{ duration: enabled ? 0.46 : 0, ease: "easeInOut" }}
              d={
                plotLine([
                  { position: previous.position, row: index },
                  { position: event.position, row: index + 1 },
                ]) ?? ""
              }
              fill="none"
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
                x={
                  x(event.position) +
                  (event.position > cylinderMaximum * 0.85 ? -11 : 11)
                }
                y={y(index + 1) + 5}
                textAnchor={
                  event.position > cylinderMaximum * 0.85 ? "end" : "start"
                }
                fontSize="15"
                fill={complete ? "#111827" : "#64748b"}
              >
                {event.position}
              </text>
            )}
          </motion.g>
        );
      })}
      <motion.circle
        initial={false}
        animate={{ cx: x(current.position), cy: y(step) }}
        transition={{ duration: enabled ? 0.46 : 0, ease: "easeInOut" }}
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
  stage,
  setStage,
  enabled,
}: SceneContext & { algorithm: ScheduleAlgorithm }) {
  const result = calculateSchedule(algorithm, defaultSchedule);
  const step = Math.min(stage, result.events.length);
  const conclusion = stage > result.events.length;
  const completeIds = new Set(
    result.events
      .slice(0, step)
      .filter((event) => event.kind === "service")
      .map((event) => event.requestId),
  );
  const last = result.events[step - 1];
  const total = last?.total ?? 0;
  return (
    <Stage
      title={
        algorithm === "FCFS"
          ? "FCFS. Geliş sırası."
          : algorithm === "SCAN"
            ? "SCAN. Fiziksel uca git, dön."
            : "C-SCAN. Dönüşte servis yok."
      }
      controls={
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            className="primary-button disabled:opacity-35"
            disabled={conclusion}
            onClick={() => setStage(stage + 1)}
          >
            <SkipForward size={18} />
            {step === result.events.length
              ? "Sonucu yorumla"
              : "Sonraki hareket"}
          </button>
          <button
            className="icon-button"
            aria-label={`${algorithm} aşamalarını başa al`}
            onClick={() => setStage(0)}
          >
            <RotateCcw size={19} />
          </button>
          <span className="ml-1 inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
            <ArrowDown size={14} /> Azalan · kafa 53
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
            {completeIds.size}/8 istek
          </span>
        </div>
        <div className="min-h-0 flex-1">
          <SchedulePlot result={result} step={step} enabled={enabled} />
        </div>
        {conclusion &&
          (algorithm === "SCAN" ? (
            <svg
              viewBox="0 0 720 105"
              className="h-20 w-full shrink-0"
              role="img"
              aria-label="SCAN:53→0→183=236; LOOK:53→14→183=208"
            >
              <path
                d={
                  chartPolyline([
                    [boundaryX(53), 24],
                    [boundaryX(0), 24],
                    [boundaryX(183), 24],
                  ]) ?? ""
                }
                fill="none"
                stroke="#2247eb"
                strokeWidth="5"
              />
              <path
                d={
                  chartPolyline([
                    [boundaryX(53), 74],
                    [boundaryX(14), 74],
                    [boundaryX(183), 74],
                  ]) ?? ""
                }
                fill="none"
                stroke="#f05b28"
                strokeWidth="5"
              />
              <circle cx={boundaryX(0)} cy="24" r="7" fill="#2247eb" />
              <circle cx={boundaryX(14)} cy="74" r="7" fill="#f05b28" />
              <text x="230" y="15" fontSize="17" fill="#2247eb">
                SCAN:53→0→183 =236
              </text>
              <text x="230" y="63" fontSize="17" fill="#a93411">
                LOOK:53→14→183 =208
              </text>
              <text x="20" y="48" fontSize="13">
                0
              </text>
              <text x="70" y="101" fontSize="13">
                14
              </text>
            </svg>
          ) : (
            <div className="grid shrink-0 grid-cols-3 gap-2 text-center text-xs font-semibold">
              {(algorithm === "FCFS"
                ? ["45+85+146=276", "85+108+110=303", "59+2=61"]
                : ["53 · 0’a kadar", "199 · servis yok", "134 · kalan servis"]
              ).map((label, index) => (
                <div
                  key={label}
                  className={`rounded-lg px-2 py-3 ${algorithm === "C-SCAN" && index === 1 ? "bg-orange/10 text-orange" : "bg-blue/10 text-blue"}`}
                >
                  {label}
                </div>
              ))}
            </div>
          ))}
        <div
          className="flex min-h-7 flex-wrap justify-center gap-1.5"
          aria-label="Geliş sırasındaki istekler"
        >
          {defaultSchedule.queue.map((cylinder, id) => (
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
        <StageCaption className="min-h-10 text-center text-xs font-semibold text-slate-600 md:text-sm">
          {conclusion
            ? algorithm === "FCFS"
              ? "640: geliş sırası korundu, fakat kafa uzak silindirler arasında gidip geldi."
              : algorithm === "SCAN"
                ? "236 = 53 + 183. 14’te dönmek LOOK olurdu: 208. Burada fiziksel uç 0’a gidildi."
                : "386 = 53 + 199 + 134. 0 → 199 dönüşü servis yapmaz, hareketi toplamdan silinmez."
            : last
              ? last.kind === "service"
                ? `İstek ${(last.requestId ?? 0) + 1} tamamlandı · kafa ${last.position}`
                : last.kind === "wrap"
                  ? "0 → 199: fiziksel dönüş, servis yok · +199"
                  : "Fiziksel uç 0’a ulaşıldı · bu adım bir isteği tamamlamaz"
              : "Kafa 53’te. Bir sonraki hareketin yönünü ve mesafesini tahmin edin."}
        </StageCaption>
      </div>
    </Stage>
  );
}

export function ScheduleComparison({
  stage,
  setStage,
  enabled,
  goTo,
}: SceneContext) {
  const algorithms: ScheduleAlgorithm[] = ["FCFS", "SCAN", "C-SCAN"];
  const results = algorithms.map((algorithm) =>
    calculateSchedule(algorithm, defaultSchedule),
  );
  const captions = [
    "Geliş sırası:640 silindir.",
    "Aynı kuyruk, fiziksel uca giden SCAN:236 silindir.",
    "Aynı kuyruk, azalan C-SCAN:386 silindir.",
    "53+199+134=386. Dönüşte servis yapılmaz; hareket toplamda kalır.",
    "Tablo servis sırasıdır; gerçek bekleme süresi veya adalet puanı değildir.",
    "Kaynağın tarihsel deadline örneği: her batch sonrasında eski bekleyen isteği gözet; bu güncel Linux varsayılanı iddiası değildir.",
  ];
  return (
    <Stage
      title="Kısa yol tek ölçüt mü?"
      controls={
        <div className="flex flex-wrap justify-center gap-2">
          {["FCFS", "SCAN", "C-SCAN", "Dönüş", "Servis sırası", "Politika"].map(
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
      <div className="flex h-full w-full max-w-[1000px] flex-col justify-center gap-3 md:gap-5">
        {stage < 4 ? (
          results.map((r, index) => (
            <button
              className="grid grid-cols-[75px_1fr_55px] items-center gap-3 text-left md:grid-cols-[120px_1fr_90px]"
              key={r.algorithm}
              onClick={() =>
                goTo(["fcfs-path", "scan-path", "cscan-path"][index])
              }
              aria-label={`${r.algorithm}, ${stage >= index ? r.total : "henüz açılmadı"}, ilgili sahneye git`}
            >
              <span className="font-display text-base md:text-xl">
                {r.algorithm}
              </span>
              <div className="h-12 rounded-lg bg-slate-100 md:h-16">
                <motion.div
                  initial={false}
                  animate={{
                    width:
                      stage >= index ? `${comparisonWidth(r.total)}%` : "0%",
                  }}
                  transition={{ duration: enabled ? 0.25 : 0 }}
                  className="flex h-full overflow-hidden rounded-lg"
                  style={{ background: colors[r.algorithm] }}
                >
                  {r.algorithm === "C-SCAN" && stage >= 3 && (
                    <>
                      <span
                        className="h-full bg-blue"
                        style={{ width: `${circularSegmentWidth(53)}%` }}
                      />
                      <span
                        className="flex h-full items-center justify-center border-x-2 border-white bg-orange text-xs font-bold text-white"
                        style={{ width: `${circularSegmentWidth(199)}%` }}
                      >
                        199
                      </span>
                      <span
                        className="h-full bg-blue"
                        style={{ width: `${circularSegmentWidth(134)}%` }}
                      />
                    </>
                  )}
                </motion.div>
              </div>
              <strong className="font-display text-2xl md:text-5xl">
                {stage >= index ? r.total : "?"}
              </strong>
            </button>
          ))
        ) : stage === 4 ? (
          <div className="w-full overflow-hidden rounded-xl border-2 border-ink">
            <div className="grid grid-cols-[100px_1fr] bg-slate-100 p-3 text-xs font-semibold">
              <span>Politika</span>
              <span>Servis edilen silindirler · olay sırası</span>
            </div>
            {results.map((r) => (
              <div
                key={r.algorithm}
                className="grid grid-cols-[100px_1fr] items-center gap-2 border-t border-slate-200 p-3"
              >
                <strong className="text-xs">{r.algorithm}</strong>
                <div className="flex flex-wrap gap-1">
                  {r.serviceOrder.map((request) => (
                    <span
                      key={request.id}
                      className="rounded bg-blue/10 px-2 py-1 font-display text-xs text-blue"
                    >
                      {request.cylinder}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                name: "Oku · LBA sırası",
                value: "12 → 44 → 90",
                selected: true,
              },
              { name: "Yaz · LBA sırası", value: "20 → 70", selected: false },
              {
                name: "Oku · FCFS yaşı",
                value: "R0(LBA90):600 ms > örnek500 ms",
                selected: false,
              },
              { name: "Yaz · FCFS yaşı", value: "W0:80 ms", selected: false },
            ].map((q) => (
              <div
                key={q.name}
                className={`rounded-xl border-2 p-4 md:p-6 ${q.selected ? "border-blue bg-blue/10" : "border-slate-300 bg-white"}`}
              >
                <h2 className="mb-3 text-xs font-semibold md:text-base">
                  {q.name}
                </h2>
                <p className="font-display text-sm md:text-xl">{q.value}</p>
                {q.selected && (
                  <span className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-blue">
                    <ArrowRight size={15} />
                    Sonraki batch için seçildi
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
        {stage === 3 && (
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
            {[
              "53 · 0’a kadar",
              "199 · dönüş / servis yok",
              "134 · kalan servis",
            ].map((x, i) => (
              <div
                key={x}
                className={`rounded-lg p-3 ${i === 1 ? "bg-orange/10 text-orange" : "bg-blue/10 text-blue"}`}
              >
                {x}
              </div>
            ))}
          </div>
        )}
        {stage >= 4 && (
          <div className="flex justify-center gap-5 text-xs font-semibold text-blue">
            <span>Hareket</span>
            <span>Bekleme</span>
            <span>Adalet</span>
          </div>
        )}
        <StageCaption className="text-center text-xs font-semibold leading-relaxed text-slate-600 md:text-sm">
          {captions[stage]}
        </StageCaption>
      </div>
    </Stage>
  );
}
