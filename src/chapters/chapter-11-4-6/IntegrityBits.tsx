import { X } from "lucide-react";
import { motion } from "motion/react";
import { useStageMotion } from "../../presentation/PresentationMotion";

/** Changed-bit marks describe the injected example, not a detector's knowledge. */
export function IntegrityBits({
  bits,
  original = bits,
  label,
  compact = false,
}: {
  bits: readonly number[];
  original?: readonly number[];
  label: string;
  compact?: boolean;
}) {
  const { enabled } = useStageMotion();
  return (
    <div
      className={`integrity-bits ${compact ? "integrity-bits-compact" : ""}`}
      role="group"
      aria-label={`${label}: ${bits.join("")}`}
    >
      {bits.map((bit, index) => {
        const changed = bit !== original[index];
        return (
          <div
            key={index}
            className={`integrity-bit ${changed ? "integrity-bit-changed" : ""}`}
            aria-label={`${index + 1}. bit: ${bit}${changed ? ", örnekte değiştirilen bit" : ""}`}
          >
            <motion.span
              key={bit}
              initial={enabled ? { opacity: 0.4, scale: 0.8 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: enabled ? 0.22 : 0 }}
            >
              {bit}
            </motion.span>
            {changed && (
              <span className="integrity-bit-mark" aria-hidden="true">
                <X size={12} />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
