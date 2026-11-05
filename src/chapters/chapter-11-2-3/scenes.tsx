import type { ReactNode } from "react";
import type { SceneContext, SceneDefinition } from "../../presentation/types";
import curriculum from "./curriculum.json";
import { schedulingNotes } from "./notes";
import { QueueSetup, ScheduleComparison, SchedulingLab } from "./SchedulingLab";
import { FlashLab, FlashAddressing } from "./FlashLab";
import { NvmCheckpoint, NvmScheduling } from "./NvmScenes";
const renderers: Record<string, (context: SceneContext) => ReactNode> = {
  "hdd-request-queue": (context) => <QueueSetup {...context} />,
  "fcfs-path": (context) => <SchedulingLab {...context} algorithm="FCFS" />,
  "sstf-path": (context) => <SchedulingLab {...context} algorithm="SSTF" />,
  "scan-path": (context) => <SchedulingLab {...context} algorithm="SCAN" />,
  "look-path": (context) => <SchedulingLab {...context} algorithm="LOOK" />,
  "cscan-path": (context) => <SchedulingLab {...context} algorithm="C-SCAN" />,
  "clook-path": (context) => <SchedulingLab {...context} algorithm="C-LOOK" />,
  "scheduling-tradeoffs": (context) => <ScheduleComparison {...context} />,
  "nvm-scheduling": (context) => <NvmScheduling {...context} />,
  "flash-addressing": (context) => <FlashAddressing {...context} />,
  "flash-write-amplification": (context) => <FlashLab {...context} />,
  "nvm-management-summary": (context) => <NvmCheckpoint {...context} />,
};
export const schedulingScenes: SceneDefinition[] = curriculum.map((scene) => ({
  ...scene,
  kind: "chapter",
  presenterId: 2,
  shortTitle: scene.title,
  notes: schedulingNotes[scene.id],
  render: renderers[scene.id],
}));
