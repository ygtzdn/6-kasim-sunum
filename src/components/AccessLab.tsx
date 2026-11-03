import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { calculateAccess } from "../models/hdd.mjs";

export const initialAccess = { rpm: 7200, seek: 6, sizeKiB: 4, rateMBps: 200 };
export type AccessInput = typeof initialAccess;
const format = (n: number, digits = 2) =>
  n.toLocaleString("tr-TR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
export default function AccessLab({
  input,
  onChange,
  stage,
}: {
  input: AccessInput;
  onChange: (v: AccessInput) => void;
  stage: number;
}) {
  const result = calculateAccess(input);
  const values = [
    { name: "Seek", value: result.seek, color: "#2247eb" },
    { name: "Dönme", value: result.rotation, color: "#f05b28" },
    { name: "Aktarım", value: result.transfer, color: "#7b35ce" },
  ];
  return (
    <div className="access-lab" data-stage={stage}>
      <div className="access-summary">
        <span>ÖRNEK I/O SERVİS SÜRESİ</span>
        <div aria-live="polite">
          <strong>{format(result.total)}</strong>
          <small>ms</small>
        </div>
      </div>
      <div className="latency-rings">
        {values.map((s, i) => (
          <div
            className={`latency-metric ${stage < 3 && stage !== i ? "metric-dimmed" : ""}`}
            key={s.name}
          >
            <svg viewBox="0 0 220 220" aria-hidden="true">
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
                stroke={s.color}
                strokeWidth="10"
                strokeLinecap="round"
                initial={false}
                animate={{
                  pathLength: s.value / result.total,
                }}
                transition={{ type: "spring", stiffness: 75, damping: 20 }}
                style={{ rotate: -90, transformOrigin: "110px 110px" }}
              />
            </svg>
            <div className="ring-value">
              <strong>{format(s.value, s.name === "Aktarım" ? 3 : 2)}</strong>
              <span>ms</span>
            </div>
            <span
              className="metric-label"
              style={{ color: s.name === "Dönme" ? "#a93411" : s.color }}
            >
              {s.name}
            </span>
          </div>
        ))}
      </div>
      <div className="access-phase" aria-live="polite">
        <strong>
          {
            [
              "1 · Kafa hedef ize gider.",
              "2 · Sektör kafa altına döner.",
              "3 · Veri aktarılır.",
              "Seek + dönme + aktarım",
            ][stage]
          }
        </strong>
        <span>
          {stage === 3
            ? `Konumlandırma: ${format(result.seek + result.rotation)} ms · Aktarım: ${format(result.transfer, 3)} ms`
            : [
                "Seek: kolun konumlanma süresi.",
                "Ortalama dönme gecikmesi: yarım tur.",
                "Aktarım: veri miktarı / aktarım hızı.",
              ][stage]}
        </span>
        <small>Kuyruk ve denetleyici ek yükü bu örneğe dahil değildir.</small>
      </div>
      <div className="access-controls">
        {[
          {
            key: "rpm" as const,
            label: "RPM",
            unit: "",
            min: 3600,
            max: 15000,
            step: 100,
          },
          {
            key: "seek" as const,
            label: "Seek",
            unit: "ms",
            min: 0,
            max: 30,
            step: 0.5,
          },
          {
            key: "sizeKiB" as const,
            label: "Veri",
            unit: "KiB",
            min: 1,
            max: 16384,
            step: 1,
          },
          {
            key: "rateMBps" as const,
            label: "Hız",
            unit: "MB/s",
            min: 1,
            max: 2000,
            step: 1,
          },
        ].map((p) => (
          <label key={p.key}>
            <span>
              {p.label}
              <strong>
                {format(input[p.key], p.key === "seek" ? 1 : 0)}{" "}
                <small>{p.unit}</small>
              </strong>
            </span>
            <input
              type="range"
              aria-label={p.label}
              min={p.min}
              max={p.max}
              step={p.step}
              value={input[p.key]}
              onChange={(e) =>
                onChange({ ...input, [p.key]: Number(e.target.value) })
              }
            />
          </label>
        ))}
        <button
          className="icon-button"
          aria-label="Hesabı sıfırla"
          onClick={() => onChange(initialAccess)}
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
}
