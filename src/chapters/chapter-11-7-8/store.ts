import { useSyncExternalStore } from "react";
import {
  advanceRebuild,
  configureRaid,
  createRaidState,
  startRebuild,
  toggleFailure,
} from "./model.mjs";

let current = createRaidState();
const listeners = new Set<() => void>();
type RaidState = ReturnType<typeof createRaidState>;
function publish(next: RaidState) {
  if (next === current) return;
  current = next;
  listeners.forEach((listener) => listener());
}
export const raidActions = {
  configure: (patch: { level?: number; disks?: number; sizeTB?: number }) =>
    publish(configureRaid(current, patch)),
  fail: (disk: number) => publish(toggleFailure(current, disk)),
  rebuild: () => publish(startRebuild(current)),
  step: () => publish(advanceRebuild(current)),
  reset: () =>
    publish(createRaidState(current.level, current.disks, current.sizeTB)),
  example: () => publish(createRaidState()),
};
export function useRaid() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
  );
}
