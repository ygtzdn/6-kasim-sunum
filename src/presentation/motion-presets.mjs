import { exercises } from "../chapters/closing/exercise-data.mjs";
/** Movement follows the teaching format, rather than rotating effects by slide number. */
export const motionGroups = {
  cover: ["storage-opening"],
  focus: [
    "hdd-anatomy",
    "hdd-geometry",
    "nvm-device",
    "flash-page-block",
    "ram-memory",
    "storage-devices",
    "flash-addressing",
    "error-detection",
    "error-correction",
    "bad-block-remapping",
  ],
  compare: [
    "hdd-request-size",
    "memory-comparison",
    "flash-endurance",
    "scheduling-tradeoffs",
    "nvm-management-summary",
    "swap-space",
    "raid-intro",
    "raid-nested",
    "raid-features",
    "storage-pools",
    "nas-san-comparison",
  ],
  trace: [
    "fcfs-path",
    "sstf-path",
    "scan-path",
    "look-path",
    "cscan-path",
    "clook-path",
  ],
  flow: [
    "why-error-detection",
    "hdd-request-queue",
    "nvm-scheduling",
    "device-preparation",
    "boot-sequence",
    "swap-journey",
    "storage-attachment",
    "host-attached",
    "nas",
    "cloud-storage",
    "storage-arrays",
    "san",
    "raid-striping",
    "raid-parity",
    "raid-rebuild",
    "raid-integrity",
    "object-storage",
    "io-journey",
  ],
  resolve: [
    ...exercises.map((exercise) => exercise.id),
    "hdd-access-cost",
    "flash-write-amplification",
    "management-decisions",
    "storage-wrap-up",
  ],
};

const profiles = new Map(
  Object.entries(motionGroups).flatMap(([profile, ids]) =>
    ids.map((id) => [id, profile]),
  ),
);

/** @type {[number, number, number, number]} */
export const EASE = [0.22, 1, 0.36, 1];

export function sceneMotionProfile(sceneId) {
  return profiles.get(sceneId) ?? "focus";
}

/**
 * No timing changes lesson state. Disabled motion always returns the settled pose.
 * @param {string} profile
 * @param {'enter'|'visible'|'exit'} phase
 * @param {{enabled:boolean, direction:number}} state
 */
export function sceneMotionPose(profile, phase, { enabled, direction }) {
  const resting = { opacity: 1, x: 0, y: 0, scale: 1 };
  if (!enabled) return { ...resting, transition: { duration: 0 } };
  const sign = direction < 0 ? -1 : 1;
  const entrance = {
    cover: { scale: 0.975, y: 0, x: 0 },
    focus: { scale: 1, y: 12 * sign, x: 0 },
    compare: { scale: 0.99, y: 0, x: 0 },
    trace: { scale: 1, y: 0, x: 0 },
    flow: { scale: 1, y: 0, x: 28 * sign },
    resolve: { scale: 1, y: -10 * sign, x: 0 },
  }[profile] ?? { scale: 1, y: 12 * sign, x: 0 };
  const duration =
    profile === "cover" ? 0.48 : profile === "trace" ? 0.22 : 0.34;
  if (phase === "visible")
    return { ...resting, transition: { duration, ease: EASE } };
  if (phase === "enter") return { opacity: 0, ...entrance };
  return {
    opacity: 0,
    x: profile === "flow" ? -12 * sign : 0,
    y: 0,
    scale: 1,
    transition: { duration: 0.14, ease: EASE },
  };
}
