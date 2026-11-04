import { scaleLinear } from "d3-scale";
import { motion } from "motion/react";
import { StageCaption } from "../presentation/PresentationMotion";
import { calculateAccess } from "../models/hdd.mjs";
export const initialAccess = {
  rpm: 7200,
  seek: 5,
  sizeKiB: 4,
  rateMBps: 125,
  controllerMs: 0.1,
};
export type AccessInput = typeof initialAccess;
const n = (v: number, d = 2) =>
  v.toLocaleString("tr-TR", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
export default function AccessLab({
  stage,
  enabled,
  input = initialAccess,
}: {
  stage: number;
  enabled: boolean;
  input?: AccessInput;
}) {
  const result = calculateAccess(input);
  const durationShare = scaleLinear([0, result.total], [0, 1]);
  const metrics = [
    { name: "Seek", value: result.seek, from: 1, color: "#2247eb" },
    { name: "Dönme", value: result.rotation, from: 2, color: "#f05b28" },
    { name: "Aktarım", value: result.transfer, from: 4, color: "#7b35ce" },
    {
      name: "Denetleyici",
      value: result.controller,
      from: 5,
      color: "#111827",
    },
  ];
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-4 md:gap-7"
      data-stage={stage}
    >
      <div className="flex flex-wrap justify-center gap-2 text-[10px] font-semibold text-slate-600 md:gap-4 md:text-xs">
        {[
          "7200 RPM",
          "5 ms seek",
          "4 KiB",
          "125 MB/s",
          "0,1 ms controller",
        ].map((label) => (
          <span className="rounded-lg bg-slate-100 px-2 py-1" key={label}>
            {label}
          </span>
        ))}
      </div>
      <div className="grid w-full max-w-[1000px] grid-cols-4 gap-2 md:gap-5">
        {metrics.map((metric, index) => {
          const shown = stage >= metric.from,
            active =
              stage === 5 ||
              (stage === 3 && index < 2) ||
              (stage === 1 && index === 0) ||
              (stage === 2 && index === 1) ||
              (stage === 4 && index === 2);
          return (
            <div
              key={metric.name}
              className={`state-cell flex min-w-0 flex-col items-center gap-2 ${active ? "" : "opacity-35"}`}
            >
              <div className="relative aspect-square w-full max-w-48">
                <svg
                  viewBox="0 0 220 220"
                  className="h-full w-full"
                  aria-hidden="true"
                >
                  <circle
                    cx="110"
                    cy="110"
                    r="94"
                    fill="none"
                    stroke="#e4e6ed"
                    strokeWidth="10"
                  />
                  <motion.circle
                    cx="110"
                    cy="110"
                    r="94"
                    fill="none"
                    stroke={metric.color}
                    strokeWidth="10"
                    strokeLinecap="round"
                    initial={false}
                    animate={{
                      pathLength: shown ? durationShare(metric.value) : 0,
                    }}
                    transition={{
                      duration: enabled ? 0.5 : 0,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ rotate: -90, transformOrigin: "110px 110px" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <strong className="font-display text-[clamp(13px,2.8vw,32px)] font-medium">
                    {shown ? n(metric.value, index === 2 ? 4 : 2) : "?"}
                  </strong>
                  <small className="text-[9px] text-slate-500">ms</small>
                </div>
              </div>
              <span className="text-center text-[10px] font-semibold md:text-sm">
                {metric.name}
              </span>
            </div>
          );
        })}
      </div>
      <div className="grid w-full max-w-[750px] grid-cols-2 gap-3">
        <div
          className={`rounded-xl border px-3 py-3 text-center ${stage >= 3 ? "border-blue bg-blue/5" : "border-slate-200"}`}
        >
          <span className="text-xs font-semibold text-slate-500">
            Konumlandırma · seek + dönme
          </span>
          <strong className="mt-1 block font-display text-xl text-blue md:text-3xl">
            {stage >= 3 ? n(result.positioning, 4) : "?"}{" "}
            <small className="text-xs">ms</small>
          </strong>
        </div>
        <div
          className={`rounded-xl border px-3 py-3 text-center ${stage === 5 ? "border-ink bg-white" : "border-slate-200"}`}
        >
          <span className="text-xs font-semibold text-slate-500">
            Örnek I/O servis süresi
          </span>
          <strong className="mt-1 block font-display text-xl md:text-3xl">
            {stage === 5 ? n(result.total) : "?"}{" "}
            <small className="text-xs">ms</small>
          </strong>
        </div>
      </div>
      <StageCaption className="text-center text-[10px] font-semibold text-slate-500 md:text-xs">
        {
          [
            "İstek: 4096 B → DRAM",
            "Kafa hedef ize konumlanır",
            "Ortalama bekleme: yarım tur",
            "Seek ve dönme birlikte gruplandı",
            "Veri: 4096 B / 125.000.000 B/s",
            "5 + 4,1667 + 0,032768 + 0,1 ≈ 9,30 ms",
          ][stage]
        }
      </StageCaption>
    </div>
  );
}
