import type { SceneContext, SceneDefinition } from "../../presentation/types";
import type { ReactNode } from "react";
import curriculum from "./curriculum.json";
import { introNotes } from "./notes";
import {
  StorageDevices,
  RamMemory,
  MemoryComparison,
} from "./components/MemoryScenes";
import {
  HddAnatomy,
  HddGeometry,
  NvmDevice,
  FlashBasics,
  FlashEndurance,
  LogicalBlocks,
  DataPath,
} from "./components/StorageScenes";
import {
  AccessCost,
  RequestSize,
  PerformanceMetrics,
} from "./components/CostScenes";
const renderers: Record<string, (context: SceneContext) => ReactNode> = {
  "hdd-anatomy": (context) => <HddAnatomy {...context} />,
  "hdd-geometry": (context) => <HddGeometry {...context} />,
  "hdd-access-cost": (context) => <AccessCost {...context} />,
  "hdd-request-size": (context) => <RequestSize {...context} />,
  "hdd-performance-metrics": (context) => <PerformanceMetrics {...context} />,
  "nvm-device": (context) => <NvmDevice {...context} />,
  "flash-page-block": (context) => <FlashBasics {...context} />,
  "flash-endurance": (context) => <FlashEndurance {...context} />,
  "ram-memory": (context) => <RamMemory {...context} />,
  "storage-devices": () => <StorageDevices />,
  "memory-comparison": () => <MemoryComparison />,
  "logical-blocks": (context) => <LogicalBlocks {...context} />,
  "storage-data-path": (context) => <DataPath {...context} />,
};
// This export contains chapter11.1 only. Shared opening scenes live in chapters/opening.
export const introductionScenes: SceneDefinition[] = curriculum.map(
  (scene) => ({
    ...scene,
    kind: "chapter",
    depth: scene.depth === "core" ? "core" : "extension",
    presenterId: 1,
    shortTitle: scene.title,
    notes: introNotes[scene.id],
    render: renderers[scene.id],
  }),
);
