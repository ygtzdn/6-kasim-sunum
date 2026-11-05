export const scheduleAlgorithms = [
  "FCFS",
  "SSTF",
  "SCAN",
  "LOOK",
  "C-SCAN",
  "C-LOOK",
] as const;
export type ScheduleAlgorithm = (typeof scheduleAlgorithms)[number];
export type ScheduleDirection = "up" | "down";
export interface DiskRequest {
  id: number;
  cylinder: number;
}
export interface ScheduleInput {
  head: number;
  queue: number[];
  direction: ScheduleDirection;
  maximum?: number;
}
export interface ScheduleEvent {
  position: number;
  kind: "service" | "turn" | "wrap";
  requestId?: number;
  distance: number;
  total: number;
}
export interface ScheduleResult {
  algorithm: ScheduleAlgorithm;
  start: number;
  events: ScheduleEvent[];
  serviceOrder: DiskRequest[];
  path: number[];
  total: number;
}
export const cylinderMaximum = 199;
export const defaultSchedule: ScheduleInput = {
  head: 53,
  queue: [98, 183, 37, 122, 14, 124, 65, 67],
  direction: "down",
};

export function parseQueue(text: string): number[] {
  if (!text.trim()) return [];
  const tokens = text.trim().split(/[\s,]+/);
  if (tokens.length > 20) throw new Error("En fazla 20 istek girilebilir.");
  if (
    tokens.some(
      (token) => !/^\d+$/.test(token) || Number(token) > cylinderMaximum,
    )
  )
    throw new Error(
      `Her istek 0–${cylinderMaximum} arasında bir tam sayı olmalı.`,
    );
  return tokens.map(Number);
}

export function calculateSchedule(
  algorithm: ScheduleAlgorithm,
  input: ScheduleInput,
): ScheduleResult {
  const maximum = input.maximum ?? cylinderMaximum;
  if (!Number.isInteger(maximum) || maximum < 1)
    throw new Error("Geçerli bir en büyük silindir numarası girilmeli.");
  if (!Number.isInteger(input.head) || input.head < 0 || input.head > maximum)
    throw new Error(`Kafa 0–${maximum} arasında bir tam sayı olmalı.`);
  if (
    input.queue.length > 20 ||
    input.queue.some((n) => !Number.isInteger(n) || n < 0 || n > maximum)
  )
    throw new Error("Geçersiz istek kuyruğu.");
  if (input.direction !== "up" && input.direction !== "down")
    throw new Error("Geçersiz yön.");
  if (!scheduleAlgorithms.includes(algorithm))
    throw new Error("Geçersiz algoritma.");
  const result: ScheduleResult = {
    algorithm,
    start: input.head,
    events: [],
    serviceOrder: [],
    path: [input.head],
    total: 0,
  };
  let position = input.head;
  function visit(
    next: number,
    kind: ScheduleEvent["kind"],
    request?: DiskRequest,
  ) {
    const distance = Math.abs(next - position);
    result.total += distance;
    result.events.push({
      position: next,
      kind,
      requestId: request?.id,
      distance,
      total: result.total,
    });
    // Service events remain distinct even when two requests use the same cylinder.
    if (position !== next || kind === "service") result.path.push(next);
    if (request) result.serviceOrder.push(request);
    position = next;
  }
  const requests = input.queue.map((cylinder, id) => ({ cylinder, id }));
  if (algorithm === "FCFS") {
    for (const request of requests) visit(request.cylinder, "service", request);
    return result;
  }
  if (algorithm === "SSTF") {
    while (requests.length) {
      requests.sort(
        (a, b) =>
          Math.abs(a.cylinder - position) - Math.abs(b.cylinder - position) ||
          a.id - b.id,
      );
      const [nearest] = requests.splice(0, 1);
      visit(nearest.cylinder, "service", nearest);
    }
    return result;
  }
  const circular = algorithm === "C-SCAN" || algorithm === "C-LOOK";
  const usesPhysicalEdge = algorithm === "SCAN" || algorithm === "C-SCAN";
  const sign = input.direction === "up" ? 1 : -1;
  const sortForward = (a: DiskRequest, b: DiskRequest) =>
    sign * (a.cylinder - b.cylinder) || a.id - b.id;
  const here = requests.filter((r) => r.cylinder === input.head);
  const forward = requests
    .filter((r) => sign * (r.cylinder - input.head) > 0)
    .sort(sortForward);
  const behind = requests
    .filter((r) => sign * (r.cylinder - input.head) < 0)
    .sort(
      circular
        ? sortForward
        : (a, b) => -sign * (a.cylinder - b.cylinder) || a.id - b.id,
    );
  for (const request of [...here, ...forward])
    visit(request.cylinder, "service", request);
  if (behind.length) {
    const edge = sign > 0 ? maximum : 0;
    if (usesPhysicalEdge && position !== edge) visit(edge, "turn");
    if (circular) {
      // Arriving after a wrap and servicing the request are separate events.
      const wrapTarget = usesPhysicalEdge ? maximum - edge : behind[0].cylinder;
      visit(wrapTarget, "wrap");
    }
    for (const request of behind) visit(request.cylinder, "service", request);
  }
  return result;
}

export interface FlashPage {
  logical: number | null;
  version: number;
  status: "free" | "valid" | "invalid";
}
export interface FlashLocation {
  block: number;
  page: number;
}
export interface FlashState {
  step: number;
  blocks: FlashPage[][];
  mapping: Record<number, FlashLocation>;
  hostWrites: number;
  physicalWrites: number;
  erases: number;
  reservedBlock: number;
  event: string;
}
const emptyPage = (): FlashPage => ({
  logical: null,
  version: 0,
  status: "free",
});
export function createFlashState(): FlashState {
  const blocks = Array.from({ length: 3 }, () =>
    Array.from({ length: 4 }, emptyPage),
  );
  const mapping: Record<number, FlashLocation> = {};
  for (let logical = 0; logical < 6; logical++) {
    const block = Math.floor(logical / 4),
      page = logical % 4;
    blocks[block][page] = { logical, version: 0, status: "valid" };
    mapping[logical] = { block, page };
  }
  return {
    step: 0,
    blocks,
    mapping,
    hostWrites: 0,
    physicalWrites: 0,
    erases: 0,
    reservedBlock: 2,
    event: "Başlangıç · 6 mantıksal sayfa",
  };
}
export function flashWriteAmplification(state: FlashState): number | null {
  return state.hostWrites ? state.physicalWrites / state.hostWrites : null;
}

/** Replays the finite teaching scenario; revisiting a stage never mutates a later state. */
export function flashStateAtStage(stage: number): FlashState {
  let state = createFlashState();
  const target = Math.max(0, Math.min(5, Math.floor(stage)));
  for (let step = 0; step < target; step++) state = nextFlashStep(state);
  return state;
}

export function nextFlashStep(previous: FlashState): FlashState {
  if (previous.step >= 5) return previous;
  const state: FlashState = {
    ...previous,
    blocks: previous.blocks.map((block) => block.map((page) => ({ ...page }))),
    mapping: Object.fromEntries(
      Object.entries(previous.mapping).map(([logical, location]) => [
        logical,
        { ...location },
      ]),
    ),
  };
  function write(logical: number, block: number, page: number) {
    if (
      block === state.reservedBlock ||
      state.blocks[block][page].status !== "free"
    )
      throw new Error("Host yazması için boş ve ayrılmamış sayfa gerekir.");
    const old = state.mapping[logical];
    const version = state.blocks[old.block][old.page].version + 1;
    state.blocks[old.block][old.page].status = "invalid";
    state.blocks[block][page] = { logical, version, status: "valid" };
    state.mapping[logical] = { block, page };
    state.hostWrites++;
    state.physicalWrites++;
  }
  switch (state.step) {
    case 0:
      write(0, 1, 2);
      state.event = "L0:v1 → B1.P2";
      break;
    case 1:
      write(1, 1, 3);
      state.event = "L1:v1 → B1.P3";
      break;
    case 2: {
      const live = state.blocks[0]
        .map((page, index) => ({ page, index }))
        .filter(({ page }) => page.status === "valid");
      live.forEach(({ page, index }, target) => {
        if (page.logical === null || state.blocks[2][target].status !== "free")
          throw new Error("GC kopyası için geçerli veri ve boş hedef gerekir.");
        state.blocks[2][target] = { ...page };
        state.mapping[page.logical] = { block: 2, page: target };
        state.blocks[0][index].status = "invalid";
        state.physicalWrites++;
      });
      state.event = "GC · L2 + L3 → B2";
      break;
    }
    case 3:
      if (
        state.blocks[0].some((page) => page.status === "valid") ||
        Object.values(state.mapping).some((location) => location.block === 0)
      )
        throw new Error("Geçerli veri korunmadan blok silinemez.");
      state.blocks[0] = Array.from({ length: 4 }, emptyPage);
      state.erases++;
      state.reservedBlock = 0;
      state.event = "B0 silindi · yeni GC alanı";
      break;
    case 4:
      write(2, 2, 2);
      state.event = "L2:v1 → B2.P2";
      break;
  }
  state.step++;
  return state;
}
