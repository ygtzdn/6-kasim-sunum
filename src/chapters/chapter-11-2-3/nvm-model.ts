export interface NvmRequest {
  id: string;
  operation: "read" | "write";
  lba: number;
  blocks: number;
  sourceIds: string[];
}

export const nvmRequests: readonly NvmRequest[] = [
  { id: "r10", operation: "read", lba: 10, blocks: 1, sourceIds: ["r10"] },
  { id: "r11", operation: "read", lba: 11, blocks: 1, sourceIds: ["r11"] },
  { id: "w40", operation: "write", lba: 40, blocks: 1, sourceIds: ["w40"] },
  { id: "r90", operation: "read", lba: 90, blocks: 1, sourceIds: ["r90"] },
];

/** Teaching model: only consecutive, adjacent reads with matching properties merge. */
export function mergeAdjacentReads(
  requests: readonly NvmRequest[],
): NvmRequest[] {
  const merged: NvmRequest[] = [];
  for (const request of requests) {
    const previous = merged.at(-1);
    if (
      previous?.operation === "read" &&
      request.operation === "read" &&
      previous.lba + previous.blocks === request.lba
    ) {
      previous.blocks += request.blocks;
      previous.sourceIds.push(...request.sourceIds);
    } else {
      merged.push({ ...request, sourceIds: [...request.sourceIds] });
    }
  }
  return merged;
}

export function nvmSchedulingStateAtStage(stage: number) {
  const requests =
    stage >= 2
      ? mergeAdjacentReads(nvmRequests)
      : nvmRequests.map((request) => ({
          ...request,
          sourceIds: [...request.sourceIds],
        }));
  return {
    requests,
    hostRequests: nvmRequests.length,
    commandCount: requests.length,
    logicalBlocks: requests.reduce((sum, request) => sum + request.blocks, 0),
    location: stage >= 4 ? "device" : stage >= 3 ? "interface" : "host",
  } as const;
}
