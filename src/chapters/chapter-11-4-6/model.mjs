/** Pure educational models: no disk, file-system or browser APIs. */
export const ORIGINAL_BITS = Object.freeze([1, 0, 1, 1, 0, 0, 1]);
export const STORED_PARITY = 0;

/** @param {number[]} bits @param {number} [storedParity] */
export function checkParity(bits, storedParity = STORED_PARITY) {
  if (
    !bits.length ||
    [...bits, storedParity].some((bit) => bit !== 0 && bit !== 1)
  ) {
    throw new RangeError("Parite yalnızca 0 ve 1 bitleriyle hesaplanır.");
  }
  const ones = bits.reduce((sum, bit) => sum + bit, 0);
  return { ones, storedParity, detected: (ones + storedParity) % 2 !== 0 };
}

/** @param {number[]} bits @param {number} index */
export function flipBit(bits, index) {
  if (!Number.isInteger(index) || index < 0 || index >= bits.length) {
    throw new RangeError("Bit konumu aralık dışında.");
  }
  return bits.map((bit, position) => (position === index ? 1 - bit : bit));
}

/** Extended Hamming (8,4): positions 1, 2, 4 are parity; 8 is overall parity.
 * @param {number[]} data */
export function encodeSecded(data) {
  if (data.length !== 4 || data.some((bit) => bit !== 0 && bit !== 1)) {
    throw new RangeError("Bu eğitim kodu dört veri biti alır.");
  }
  const code = [0, 0, data[0], 0, data[1], data[2], data[3], 0];
  for (const parityPosition of [1, 2, 4]) {
    code[parityPosition - 1] = code
      .slice(0, 7)
      .reduce(
        (sum, bit, index) =>
          ((index + 1) & parityPosition) !== 0 ? sum ^ bit : sum,
        0,
      );
  }
  code[7] = code.slice(0, 7).reduce((sum, bit) => sum ^ bit, 0);
  return code;
}

/** Decode only within the demo's 0/1/2-flip error model. Three or more errors
 * are intentionally not classified as correctable.
 * @param {number[]} received */
export function decodeSecded(received) {
  if (received.length !== 8 || received.some((bit) => bit !== 0 && bit !== 1)) {
    throw new RangeError("SECDED kod sözcüğü sekiz bit olmalı.");
  }
  let syndrome = 0;
  for (let index = 0; index < 7; index += 1) {
    if (received[index] === 1) syndrome ^= index + 1;
  }
  const overall = received.reduce((sum, bit) => sum ^ bit, 0);
  if (syndrome === 0 && overall === 0) {
    return { kind: "clean", position: null, code: [...received], syndrome };
  }
  if (overall === 1) {
    const position = syndrome === 0 ? 8 : syndrome;
    return {
      kind: "corrected",
      position,
      code: flipBit(received, position - 1),
      syndrome,
    };
  }
  return { kind: "double-error", position: null, code: null, syndrome };
}

/** @typedef {{id: number, percent: number, filesystem: boolean, mounted: boolean, files: number}} DemoPartition */
/** @typedef {{partitions: DemoPartition[], selected: number}} DeviceState */
/** @returns {DeviceState} */
export function createDevice() {
  return { partitions: [], selected: 0 };
}
/** @param {DeviceState} state @returns {DeviceState} */
export function partitionDevice(state) {
  if (state.partitions.length) return state;
  return {
    selected: 0,
    partitions: [60, 40].map((percent, id) => ({
      id,
      percent,
      filesystem: false,
      mounted: false,
      files: 0,
    })),
  };
}
/** @param {DeviceState} state @param {'filesystem'|'mount'|'save'} action @returns {DeviceState} */
export function prepareDevice(state, action) {
  const selected = state.partitions[state.selected];
  if (!selected) throw new Error("Önce bölüm oluşturun.");
  if (action === "mount" && !selected.filesystem)
    throw new Error("Dosya sistemi hazırlanmadı.");
  if (action === "save" && !selected.mounted)
    throw new Error("Seçili bölüm bağlı değil.");
  return {
    ...state,
    partitions: state.partitions.map((part, index) =>
      index !== state.selected
        ? { ...part }
        : {
            ...part,
            filesystem: part.filesystem || action === "filesystem",
            mounted: part.mounted || action === "mount",
            files: part.files + (action === "save" ? 1 : 0),
          },
    ),
  };
}

/** @param {number[]} mapping @param {number} lba @param {number} spare */
export function remapBlock(mapping, lba, spare) {
  if (
    !Number.isInteger(lba) ||
    lba < 0 ||
    lba >= mapping.length ||
    mapping.includes(spare)
  ) {
    throw new RangeError(
      "Yeniden eşleme için geçerli LBA ve kullanılmayan yedek alan gerekli.",
    );
  }
  return mapping.map((physical, index) => (index === lba ? spare : physical));
}

/** @typedef {{id: string, kind: 'anonymous'|'file', dirty: boolean, frame: number|null, slot: number|null, swapValid: boolean}} Page */
/** @typedef {{kind: 'write'|'read', pageId: string, frame: number, slot: number|null, source: 'swap'|'file'}} Transfer */
/** @typedef {{pages: Record<string, Page>, frames: (string|null)[], slots: (string|null)[], reads: number, writes: number, pending: Transfer|null, notice: string, error: string|null}} SwapState */
/** @param {boolean} [full] @returns {SwapState} */
export function createSwapState(full = false) {
  /** @type {Record<string, Page>} */
  const pages = {
    A: {
      id: "A",
      kind: "anonymous",
      dirty: true,
      frame: 0,
      slot: null,
      swapValid: false,
    },
    B: {
      id: "B",
      kind: "file",
      dirty: false,
      frame: 1,
      slot: null,
      swapValid: false,
    },
    C: {
      id: "C",
      kind: "anonymous",
      dirty: false,
      frame: 2,
      slot: 0,
      swapValid: true,
    },
    D: {
      id: "D",
      kind: "anonymous",
      dirty: false,
      frame: null,
      slot: 1,
      swapValid: true,
    },
  };
  if (full) {
    pages.E = {
      id: "E",
      kind: "anonymous",
      dirty: false,
      frame: null,
      slot: 2,
      swapValid: true,
    };
    pages.F = {
      id: "F",
      kind: "anonymous",
      dirty: false,
      frame: null,
      slot: 3,
      swapValid: true,
    };
  }
  return {
    pages,
    frames: ["A", "B", "C"],
    slots: ["C", "D", full ? "E" : null, full ? "F" : null],
    reads: 0,
    writes: 0,
    pending: null,
    notice: "A: kirli · B: dosya · C: geçerli kopya",
    error: null,
  };
}

/** @param {SwapState} state @param {string} pageId @returns {SwapState} */
export function beginPageOut(state, pageId) {
  if (state.pending) throw new Error("Bir aktarım zaten sürüyor.");
  const page = state.pages[pageId];
  if (!page || page.frame === null) throw new Error("Sayfa RAM içinde değil.");
  const canDrop = !page.dirty && (page.kind === "file" || page.swapValid);
  if (canDrop) {
    return {
      ...state,
      pages: { ...state.pages, [pageId]: { ...page, frame: null } },
      frames: state.frames.map((id) => (id === pageId ? null : id)),
      notice: `${pageId} temiz; swap yazması yok.`,
      error: null,
    };
  }
  const slot = page.slot ?? state.slots.indexOf(null);
  if (slot < 0)
    return {
      ...state,
      notice: "Boş swap slot’u yok; tahliye tamamlanamadı.",
      error: "full",
    };
  return {
    ...state,
    slots: state.slots.map((id, index) => (index === slot ? pageId : id)),
    pages: { ...state.pages, [pageId]: { ...page, slot, swapValid: false } },
    pending: { kind: "write", pageId, frame: page.frame, slot, source: "swap" },
    notice: `${pageId} yazılıyor; frame henüz serbest değil.`,
    error: null,
  };
}

/** @param {SwapState} state @param {string} pageId @returns {SwapState} */
export function beginPageIn(state, pageId) {
  if (state.pending) throw new Error("Bir aktarım zaten sürüyor.");
  const page = state.pages[pageId];
  if (!page) throw new Error("Bilinmeyen sayfa.");
  if (page.frame !== null)
    return { ...state, notice: `${pageId} zaten RAM içinde.`, error: null };
  const frame = state.frames.indexOf(null);
  if (frame < 0)
    return {
      ...state,
      notice: "RAM dolu; önce bir frame serbest bırakın.",
      error: "ram-full",
    };
  if (page.kind === "anonymous" && (!page.swapValid || page.slot === null))
    throw new Error("Geçerli swap kopyası yok.");
  return {
    ...state,
    pending: {
      kind: "read",
      pageId,
      frame,
      slot: page.slot,
      source: page.kind === "file" ? "file" : "swap",
    },
    notice: `${pageId}: page fault → ${page.kind === "file" ? "dosyadan" : "swap’tan"} oku.`,
    error: null,
  };
}

/** Commit transfer only after animation/completion; write failure never releases RAM.
 * @param {SwapState} state @returns {SwapState} */
export function completeTransfer(state) {
  const transfer = state.pending;
  if (!transfer) return state;
  const page = state.pages[transfer.pageId];
  if (transfer.kind === "write") {
    return {
      ...state,
      pages: {
        ...state.pages,
        [page.id]: { ...page, dirty: false, frame: null, swapValid: true },
      },
      frames: state.frames.map((id, index) =>
        index === transfer.frame ? null : id,
      ),
      writes: state.writes + 1,
      pending: null,
      notice: `${page.id} swap’ta; F${transfer.frame} serbest.`,
      error: null,
    };
  }
  return {
    ...state,
    pages: { ...state.pages, [page.id]: { ...page, frame: transfer.frame } },
    frames: state.frames.map((id, index) =>
      index === transfer.frame ? page.id : id,
    ),
    reads: state.reads + (transfer.source === "swap" ? 1 : 0),
    pending: null,
    notice:
      transfer.source === "swap"
        ? `${page.id}, F${transfer.frame} içinde; swap kopyası saklandı.`
        : `${page.id}, dosyadan F${transfer.frame} içine okundu.`,
    error: null,
  };
}

/** @param {SwapState} state */
export function swapInvariant(state) {
  for (let frame = 0; frame < state.frames.length; frame += 1) {
    const id = state.frames[frame];
    if (id !== null && state.pages[id]?.frame !== frame) return false;
  }
  for (const page of Object.values(state.pages)) {
    if (page.frame !== null && state.frames[page.frame] !== page.id)
      return false;
    if (page.slot !== null && state.slots[page.slot] !== page.id) return false;
    if (page.swapValid && page.slot === null) return false;
  }
  return true;
}
