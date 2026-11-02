import { motion } from "motion/react";
import { useId } from "react";

export const diskParts = ["Plaka", "İz", "Sektör", "Kafa"];
export default function DiskDiagram({
  selected = -1,
  moving = true,
  onSelect,
}: {
  selected?: number;
  moving?: boolean;
  onSelect?: (index: number) => void;
}) {
  const id = useId().replace(/:/g, "");
  const choose = (i: number) => onSelect?.(i);
  const buttonProps = (i: number) =>
    onSelect
      ? {
          role: "button",
          tabIndex: 0,
          "aria-label": diskParts[i],
          "aria-pressed": selected === i,
          onClick: () => choose(i),
          onKeyDown: (e: React.KeyboardEvent<SVGGElement>) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              choose(i);
            }
          },
        }
      : {};
  return (
    <svg
      className="disk-diagram"
      viewBox="0 0 660 440"
      aria-label="Dönen manyetik plaka ve hareketli okuma yazma kafası"
    >
      <defs>
        <radialGradient id={`${id}-metal`}>
          <stop stopColor="#fdfdfc" />
          <stop offset=".4" stopColor="#dee2e9" />
          <stop offset=".68" stopColor="#f5f6f8" />
          <stop offset="1" stopColor="#bac2d1" />
        </radialGradient>
        <pattern
          id={`${id}-dots`}
          width="9"
          height="9"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1" fill="#153ee8" opacity=".38" />
        </pattern>
      </defs>
      <motion.g
        animate={{
          scale: selected === 1 || selected === 2 ? 1.09 : 1,
          x: selected === 3 ? -13 : 0,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 24 }}
        style={{ transformOrigin: "320px 220px" }}
      >
        <rect
          x="81"
          y="24"
          width="484"
          height="392"
          rx="34"
          fill="#eceef3"
          stroke="#12171f"
          strokeWidth="2"
        />
        {[
          [101, 44],
          [545, 44],
          [101, 396],
          [545, 396],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="5" fill="#fff" stroke="#12171f" />
            <path d={`M${x - 2} ${y}h4`} stroke="#12171f" />
          </g>
        ))}
        <g {...buttonProps(0)} className={onSelect ? "svg-interactive" : ""}>
          <circle
            cx="290"
            cy="220"
            r="169"
            fill={`url(#${id}-metal)`}
            stroke={selected === 0 ? "#2247eb" : "#12171f"}
            strokeWidth={selected === 0 ? 5 : 2}
          />
        </g>
        <g {...buttonProps(1)} className={onSelect ? "svg-interactive" : ""}>
          {[56, 70, 84, 98, 112, 126, 140, 154].map((r) => (
            <circle
              key={r}
              cx="290"
              cy="220"
              r={r}
              fill="none"
              stroke={selected === 1 && r === 126 ? "#2247eb" : "#7f8b9e"}
              strokeWidth={selected === 1 && r === 126 ? 7 : 1}
              opacity={selected === 1 && r === 126 ? 1 : 0.7}
            />
          ))}
          <circle
            cx="290"
            cy="220"
            r="126"
            fill="none"
            stroke="transparent"
            strokeWidth="15"
          />
        </g>
        <g {...buttonProps(2)} className={onSelect ? "svg-interactive" : ""}>
          {moving && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 290 220"
              to="360 290 220"
              dur="9s"
              repeatCount="indefinite"
            />
          )}
          <path
            d="M290 220L398.6 90.5A169 169 0 0 1 456.4 249.3Z"
            fill={selected === 2 ? "#2247eb" : "#2247eb22"}
            stroke="#2247eb"
            strokeWidth="2"
          />
          {selected !== 2 && (
            <path
              d="M290 220L398.6 90.5A169 169 0 0 1 456.4 249.3Z"
              fill={`url(#${id}-dots)`}
            />
          )}
          {[78, 104, 130, 156].map((r) => (
            <path
              key={r}
              d={`M${290 + r * 0.64} ${220 - r * 0.77}A${r} ${r} 0 0 1 ${290 + r * 0.985} ${220 + r * 0.17}`}
              fill="none"
              stroke={selected === 2 ? "white" : "#2247eb"}
              strokeWidth="2"
            />
          ))}
        </g>
        <circle
          cx="290"
          cy="220"
          r="35"
          fill="#fff"
          stroke="#12171f"
          strokeWidth="2"
        />
        <circle cx="290" cy="220" r="13" fill="#12171f" />
        {[0, 60, 120, 180, 240, 300].map((d) => (
          <circle
            key={d}
            cx={290 + 25 * Math.cos((d * Math.PI) / 180)}
            cy={220 + 25 * Math.sin((d * Math.PI) / 180)}
            r="2.4"
            fill="#758092"
          />
        ))}
        <motion.g
          {...buttonProps(3)}
          className={onSelect ? "svg-interactive" : ""}
          animate={{
            rotate: moving ? [0, -14, 5, 0] : selected === 3 ? -9 : 0,
          }}
          transition={
            moving
              ? { duration: 5, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.4 }
          }
          style={{ transformOrigin: "506px 324px" }}
        >
          <path
            d="M506 324L352 135L329 145L486 334Z"
            fill={selected === 3 ? "#ff6b35" : "#fafafa"}
            stroke="#12171f"
            strokeWidth="2"
          />
          <path d="M490 313L349 145" stroke="#12171f" strokeWidth="4" />
          <rect
            x="324"
            y="132"
            width="30"
            height="19"
            rx="4"
            fill="#ff6b35"
            stroke="#12171f"
            strokeWidth="2"
          />
          <circle
            cx="506"
            cy="324"
            r="29"
            fill="#fff"
            stroke="#12171f"
            strokeWidth="2"
          />
          <circle cx="506" cy="324" r="12" fill="#12171f" />
        </motion.g>
      </motion.g>
    </svg>
  );
}
