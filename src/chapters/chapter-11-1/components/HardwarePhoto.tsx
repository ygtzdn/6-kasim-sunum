import { motion } from "motion/react";
import { useStageMotion } from "../../../presentation/PresentationMotion";
import { hardwarePhotos } from "../hardware-parts.mjs";

export type HardwareDevice = keyof typeof hardwarePhotos;

export function HardwarePhoto({
  device = "hdd",
  visibleParts = [],
  activeParts = visibleParts,
}: {
  device?: HardwareDevice;
  visibleParts?: readonly string[];
  activeParts?: readonly string[];
}) {
  const photo = hardwarePhotos[device];
  const { enabled } = useStageMotion();
  // One coordinate space for photograph, targets and leaders prevents letterboxing drift.
  const height = (photo.height / photo.width) * 1000;
  const parts = photo.parts.filter((part) => visibleParts.includes(part.id));
  return (
    <figure className="hardware-photo">
      <svg
        viewBox={`0 0 1000 ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`${photo.alt}${parts.length ? `. İşaretler: ${parts.map((part) => `${part.number} ${part.label}`).join(", ")}` : ""}`}
      >
        <image href={photo.src} width="1000" height={height} />
        {parts.map((part) => {
          const x = part.x * 1000,
            y = part.y * height;
          const labelX = part.labelX * 1000,
            labelY = part.labelY * height;
          const active = activeParts.includes(part.id);
          const endY = labelY > y ? labelY - 46 : labelY;
          const path = `M ${x} ${y} L ${labelX} ${y} L ${labelX} ${endY}`;
          return (
            <motion.g
              key={part.id}
              data-hardware-part={part.id}
              initial={enabled ? { opacity: 0 } : false}
              animate={{ opacity: active ? 1 : 0.55 }}
              transition={{ duration: enabled ? 0.24 : 0 }}
              className="hardware-callout"
            >
              <path
                d={path}
                fill="none"
                stroke="white"
                strokeWidth="7"
                strokeLinejoin="round"
              />
              <path
                d={path}
                fill="none"
                stroke={part.color}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <circle
                cx={x}
                cy={y}
                r="7"
                fill="white"
                stroke={part.color}
                strokeWidth="3"
              />
              <text
                x={labelX}
                y={labelY - 10}
                textAnchor={part.align === "end" ? "end" : "start"}
                fill={part.color}
                fontSize="30"
                fontWeight="700"
                stroke="white"
                strokeWidth="7"
                paintOrder="stroke"
                strokeLinejoin="round"
              >
                {part.number} · {part.label}
              </text>
            </motion.g>
          );
        })}
      </svg>
      <figcaption>{photo.credit} · Gerçek aygıt örneği</figcaption>
    </figure>
  );
}

export function HardwarePartsLegend({
  device,
  visibleParts,
  activeParts = visibleParts,
}: {
  device: HardwareDevice;
  visibleParts: readonly string[];
  activeParts?: readonly string[];
}) {
  return (
    <dl className="hardware-parts">
      {hardwarePhotos[device].parts
        .filter((part) => visibleParts.includes(part.id))
        .map((part) => (
          <div
            key={part.id}
            className={
              activeParts.includes(part.id) ? "part-active" : "part-context"
            }
          >
            <dt>
              <span style={{ color: part.color }}>
                {part.number.toString().padStart(2, "0")}
              </span>
              {part.label}
            </dt>
            <dd>{part.detail}</dd>
          </div>
        ))}
    </dl>
  );
}
