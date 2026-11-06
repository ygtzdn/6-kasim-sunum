import { curveLinear, line } from "d3-shape";
import { scaleLinear } from "d3-scale";
import { motion } from "motion/react";
import {
  ArrowDown,
  Check,
  RotateCcw,
  SkipForward,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import type { SceneContext } from "../../presentation/types";
import { Choice, Stage } from "../../components/presentation/ScenePrimitives";
import { StageCaption } from "../../presentation/PresentationMotion";
import { HddRationale } from "./SchedulingVisuals";
import "./scheduling.css";
import {
  calculateSchedule,
  cylinderMaximum,
  defaultSchedule,
  scheduleAlgorithms,
  type ScheduleAlgorithm,
  type ScheduleResult,
} from "./model";

const traceDetails: Record<
  ScheduleAlgorithm,
  {
    sceneId: string;
    color: string;
    title: string;
    rule: string;
    summary: string;
    breakdown?: string[];
  }
> = {
  FCFS: {
    sceneId: "fcfs-path",
    color: "#2247eb",
    title: "FCFS. Geliş sırası.",
    rule: "En önce gelen isteği seç",
    summary:
      "640 silindir. Kafa, geliş sırasını izleyerek uzak silindirler arasında gidip geldi.",
    breakdown: ["45 + 85 + 146 = 276", "85 + 108 + 110 = 303", "59 + 2 = 61"],
  },
  SSTF: {
    sceneId: "sstf-path",
    color: "#6843b6",
    title: "SSTF · En yakın istek",
    rule: "Her adımda kafaya en yakın bekleyen isteği seç",
    summary:
      "236 = 14 + 53 + 169. Sürekli yeni yakın istekler gelirse uzaktaki istekler uzun süre bekleyebilir.",
    breakdown: ["14 · 53’ten 67’ye", "53 · 67’den 14’e", "169 · 14’ten 183’e"],
  },
  SCAN: {
    sceneId: "scan-path",
    color: "#111827",
    title: "SCAN. Fiziksel uca git, dön.",
    rule: "Aynı yönde servis ver, fiziksel uçta dön",
    summary:
      "236 = 53 + 183. SCAN fiziksel uç 0’a gider. LOOK, 14’te döner ve 208 silindir yol alır.",
  },
  LOOK: {
    sceneId: "look-path",
    color: "#087c68",
    title: "LOOK · Son istekte yön değişimi",
    rule: "Seçilen yöndeki son istekte yön değiştir",
    summary:
      "208 = 39 + 169. Kafa 14’te döner. SCAN’in 0’a gidip geri gelmek için harcadığı 28 silindirlik yolu atlar.",
  },
  "C-SCAN": {
    sceneId: "cscan-path",
    color: "#ef602e",
    title: "C-SCAN. Dönüşte servis yok.",
    rule: "Tek yönde servis ver, fiziksel uçlar arasında dön",
    summary:
      "386 = 53 + 199 + 134. Servissiz 0 → 199 dönüşü toplam harekete dahildir.",
    breakdown: ["53 · 0’a kadar", "199 · servis yok", "134 · kalan servis"],
  },
  "C-LOOK": {
    sceneId: "clook-path",
    color: "#99621f",
    title: "C-LOOK · İstekler arasında dönüş",
    rule: "Tek yönde servis ver, son istekten karşıdaki en uç isteğe dön",
    summary:
      "326 = 39 + 169 + 118. Servis 183’te yeniden başlar ve azalan yönde sürer.",
    breakdown: ["39 · 14’e kadar", "169 · servis yok", "118 · kalan servis"],
  },
};
const number = (n: number) => new Intl.NumberFormat("tr-TR").format(n);

const chartPolyline = line<[number, number]>()
  .x((point) => point[0])
  .y((point) => point[1])
  .curve(curveLinear);
const boundaryX = scaleLinear([0, 183], [35, 660]);

export function QueueSetup({ stage, setStage, enabled }: SceneContext) {
  return (
    <Stage
      title="HDD’de neden zamanlama gerekir?"
      controls={
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "Mekanik maliyet",
            "Bekleyen istekler",
            "Sıranın etkisi",
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
      <div className="queue-setup-scene flex h-full w-full max-w-[1080px] flex-col justify-center">
        {stage < 3 ? (
          <HddRationale stage={stage} enabled={enabled} />
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
                { name: "Kafa", value: stage >= 4 ? "53" : "?" },
                { name: "Fiziksel sınır", value: stage >= 4 ? "0–199" : "?" },
                { name: "Yön", value: stage >= 5 ? "↓ Azalan" : "?" },
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
            {stage === 5 && (
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
              "Zamanlama, bekleyen isteklerin servis sırasını seçerek seek maliyetini azaltmayı amaçlar.",
              "Kuyrukta birden çok hazır istek varsa servis sırası için seçim yapabiliriz.",
              "Sadece sıra değişti: aynı iki isteğin toplam kafa hareketi 276’dan 162’ye indi.",
              "Kart sırası fiziksel yakınlık değil, geliş kimliğidir.",
              "Kuyruk, kafa ve sınırlar bütün karşılaştırmalarda aynı kalır.",
              "Taramalı algoritmalar azalan yönde başlar. Ölçü silindir hareketidir.",
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
  const color = traceDetails[result.algorithm].color;
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
              stroke={event.kind === "wrap" ? "#ef602e" : color}
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
              fill={complete ? color : "#fff"}
              stroke={complete ? color : "#a1aabb"}
              strokeWidth="2"
            />
            {event.kind === "service" && (
              <text
                x={
                  x(event.position) +
                  (event.position > cylinderMaximum * 0.85 ? -22 : 22)
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
  const details = traceDetails[algorithm];
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
  const next = result.events[step];
  const total = last?.total ?? 0;
  const usesDirection = algorithm !== "FCFS" && algorithm !== "SSTF";
  let caption =
    "Kafa 53’te. Bir sonraki hareketin yönünü ve mesafesini tahmin edin.";
  if (conclusion) caption = details.summary;
  else if (last?.kind === "wrap")
    caption = `${result.path[step - 1]} → ${last.position}: servis yok · +${last.distance}`;
  else if (last?.kind === "turn")
    caption = `Fiziksel uç ${last.position}’a ulaşıldı · bu adım bir isteği tamamlamaz`;
  else if (algorithm === "LOOK" && last?.position === 14)
    caption = "14 bu yöndeki son istek. Kafa şimdi yön değiştirir.";
  else if (last?.kind === "service")
    caption = `İstek ${(last.requestId ?? 0) + 1} tamamlandı · kafa ${last.position}`;
  return (
    <Stage
      title={details.title}
      controls={
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            className="icon-button"
            disabled={stage === 0}
            aria-label={`${algorithm} önceki hareket`}
            onClick={() => setStage(stage - 1)}
          >
            <ChevronLeft size={20} />
          </button>
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
            {usesDirection && (
              <>
                <ArrowDown size={14} /> Azalan ·{" "}
              </>
            )}
            Başlangıç 53
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
            {completeIds.size}/{defaultSchedule.queue.length} istek
          </span>
        </div>
        <div className="schedule-decision">
          <span>{details.rule}</span>
          <strong>
            {conclusion
              ? "Kuyruk tamamlandı"
              : next
                ? `Sıradaki: ${next.position}${next.kind === "wrap" ? " · servis yok" : next.kind === "turn" ? " · fiziksel uç" : ""}`
                : "Sonuç hazır"}
          </strong>
        </div>
        <div className="min-h-0 flex-1">
          <SchedulePlot result={result} step={step} enabled={enabled} />
        </div>
        {conclusion && algorithm === "SCAN" && (
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
              SCAN: 53 → 0 → 183 = 236
            </text>
            <text x="230" y="63" fontSize="17" fill="#a93411">
              LOOK: 53 → 14 → 183 = 208
            </text>
            <text x="20" y="48" fontSize="13">
              0
            </text>
            <text x="70" y="101" fontSize="13">
              14
            </text>
          </svg>
        )}
        {conclusion && details.breakdown && (
          <div className="grid shrink-0 grid-cols-3 gap-2 text-center text-xs font-semibold">
            {details.breakdown.map((label, index) => (
              <div
                key={label}
                className={`rounded-lg px-2 py-2 ${index === 1 && (algorithm === "C-SCAN" || algorithm === "C-LOOK") ? "bg-orange/10 text-orange" : "bg-blue/10 text-blue"}`}
              >
                {label}
              </div>
            ))}
          </div>
        )}
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
          {caption}
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
  const results = scheduleAlgorithms.map((algorithm) =>
    calculateSchedule(algorithm, defaultSchedule),
  );
  const comparisonWidth = scaleLinear(
    [0, Math.max(...results.map(({ total }) => total))],
    [0, 100],
  );
  const captions = [
    "Aynı kuyrukta LOOK 208 silindirle en kısa yolu izler. SSTF ve SCAN farklı rotalarda 236 silindire ulaşır.",
    "Turuncu bölümler servissiz dönüşü gösterir. C-SCAN fiziksel uçlar, C-LOOK bekleyen istekler arasında döner.",
    "Tablo, her algoritmanın istekleri hangi sırayla tamamladığını gösterir. Bekleme süresi ayrıca ölçülür.",
  ];
  return (
    <Stage
      title="HDD zamanlama karşılaştırması"
      controls={
        <div className="flex flex-wrap justify-center gap-2">
          {["Toplam hareket", "Servissiz dönüş", "Servis sırası"].map(
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
      <div className="flex h-full w-full max-w-[1000px] flex-col justify-center gap-2 md:gap-3">
        {stage < 2 ? (
          results.map((result) => {
            const { algorithm, total } = result;
            const details = traceDetails[algorithm];
            const wrap =
              stage === 1
                ? result.events.find((event) => event.kind === "wrap")
                : undefined;
            return (
              <button
                className="grid grid-cols-[60px_1fr_44px] items-center gap-2 text-left md:grid-cols-[100px_1fr_65px] md:gap-3"
                key={algorithm}
                onClick={() => goTo(details.sceneId)}
                aria-label={`${algorithm}, ${total} silindir hareketi${wrap ? `, bunun ${wrap.distance} silindiri servissiz dönüş` : ""}. İlgili sahneye git.`}
              >
                <span className="font-display text-base md:text-xl">
                  {algorithm}
                </span>
                <div className="h-[clamp(18px,4.7dvh,48px)] rounded-lg bg-slate-100">
                  <motion.div
                    initial={false}
                    animate={{ width: `${comparisonWidth(total)}%` }}
                    transition={{ duration: enabled ? 0.25 : 0 }}
                    className="relative h-full overflow-hidden rounded-lg"
                    style={{ background: details.color }}
                  >
                    {wrap && (
                      <span
                        className="absolute inset-y-0 flex items-center justify-center border-x-2 border-white bg-[#b63c15] text-[10px] font-bold text-white md:text-xs"
                        style={{
                          left: `${((wrap.total - wrap.distance) / total) * 100}%`,
                          width: `${(wrap.distance / total) * 100}%`,
                        }}
                      >
                        {wrap.distance}
                      </span>
                    )}
                  </motion.div>
                </div>
                <strong className="font-display text-xl md:text-3xl">
                  {total}
                </strong>
              </button>
            );
          })
        ) : (
          <div className="w-full overflow-hidden rounded-xl border-2 border-ink">
            <table className="w-full table-fixed text-center text-xs md:text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th scope="col" className="w-16 py-2 md:w-28">
                    Algoritma
                  </th>
                  <th colSpan={defaultSchedule.queue.length}>
                    Servis edilen silindirler
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map(({ algorithm, serviceOrder }) => (
                  <tr key={algorithm} className="border-t border-slate-200">
                    <th scope="row" className="py-1.5 md:py-2">
                      {algorithm}
                    </th>
                    {serviceOrder.map(({ id, cylinder }) => (
                      <td key={id} className="font-display text-blue">
                        {cylinder}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <StageCaption className="text-center text-xs font-semibold leading-relaxed text-slate-600 md:text-sm">
          {captions[stage]}
        </StageCaption>
      </div>
    </Stage>
  );
}
