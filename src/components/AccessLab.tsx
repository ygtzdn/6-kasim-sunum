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
  enabled,
}: {
  input: AccessInput;
  onChange: (v: AccessInput) => void;
  enabled: boolean;
}) {
  const result = calculateAccess(input);
  const values = [
    { name: "Seek", value: result.seek, color: "#2247eb" },
    { name: "Dönme", value: result.rotation, color: "#f05b28" },
    { name: "Aktarım", value: result.transfer, color: "#7b35ce" },
  ];
  return (
    <div className="access-lab">
      <div className="access-summary">
        <span>ERİŞİM SÜRESİ</span>
        <div aria-live="polite">
          <strong>{format(result.total)}</strong>
          <small>ms</small>
        </div>
      </div>
      <div className="latency-rings">
        {values.map((s, i) => (
          <div className="latency-metric" key={s.name}>
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
              {enabled && (
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 110 110"
                    to="360 110 110"
                    dur={`${3 + i}s`}
                    repeatCount="indefinite"
                  />
                  <circle cx="110" cy="16" r="7" fill={s.color} />
                </g>
              )}
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
