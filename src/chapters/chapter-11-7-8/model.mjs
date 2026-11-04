/** Educational, deterministic full-disk-failure model; never accesses an actual disk. */
export const RAID_LEVELS = [0, 1, 4, 5, 6, 10];
export const STRIPES = 3;

export function validDiskCounts(level) {
  if (!RAID_LEVELS.includes(level))
    throw new RangeError("Bilinmeyen RAID seviyesi.");
  if (level === 1) return [2];
  if (level === 10) return [4, 6, 8];
  const minimum = level === 0 ? 2 : level === 6 ? 4 : 3;
  return Array.from({ length: 9 - minimum }, (_, i) => minimum + i);
}

export function createRaidState(level = 5, disks = 4, sizeTB = 4) {
  if (!validDiskCounts(level).includes(disks))
    throw new RangeError("Bu seviye için geçersiz disk sayısı.");
  if (!Number.isInteger(sizeTB) || sizeTB < 1 || sizeTB > 8)
    throw new RangeError("Kapasite 1–8 TB olmalı.");
  return {
    level,
    disks,
    sizeTB,
    failed: /** @type {number[]} */ ([]),
    rebuild: 0,
    rebuilding: false,
    message: "",
  };
}

/** A parameter change starts a fresh example and explicitly reports any disk-count correction. */
export function configureRaid(state, patch) {
  const level = patch.level ?? state.level;
  const requested = patch.disks ?? state.disks;
  const counts = validDiskCounts(level);
  const disks = counts.includes(requested)
    ? requested
    : counts.reduce((best, n) =>
        Math.abs(n - requested) < Math.abs(best - requested) ? n : best,
      );
  return {
    ...createRaidState(level, disks, patch.sizeTB ?? state.sizeTB),
    message:
      disks === requested
        ? ""
        : `RAID ${level}: disk sayısı ${disks} olarak ayarlandı.`,
  };
}

export function usableCapacity(state) {
  const { level, disks: n, sizeTB: s } = state;
  return (
    (level === 0
      ? n
      : level === 1
        ? 1
        : level === 6
          ? n - 2
          : level === 10
            ? n / 2
            : n - 1) * s
  );
}

export function recoverable(state) {
  const lost = new Set(state.failed);
  if (state.level === 0) return lost.size === 0;
  if (state.level === 1) return lost.size < 2;
  if (state.level === 10) {
    for (let disk = 0; disk < state.disks; disk += 2)
      if (lost.has(disk) && lost.has(disk + 1)) return false;
    return true;
  }
  return lost.size <= (state.level === 6 ? 2 : 1);
}

export function raidStatus(state) {
  if (!recoverable(state)) return "unrecoverable";
  if (state.rebuilding) return "rebuilding";
  return state.failed.length ? "degraded" : "healthy";
}

export function toggleFailure(state, disk) {
  if (!Number.isInteger(disk) || disk < 0 || disk >= state.disks)
    throw new RangeError("Disk bulunamadı.");
  if (state.rebuilding) return state;
  return {
    ...state,
    failed: state.failed.includes(disk)
      ? state.failed.filter((n) => n !== disk)
      : [...state.failed, disk].sort((a, b) => a - b),
    rebuild: 0,
    message: "",
  };
}

export function startRebuild(state) {
  if (!state.failed.length || !recoverable(state) || state.rebuilding)
    return state;
  return {
    ...state,
    rebuilding: true,
    rebuild: 0,
    message: "Arızalı disklerin yerine boş yedekler takıldı.",
  };
}

/** One step reconstructs one symbolic stripe; steps are NOT elapsed time. */
export function advanceRebuild(state) {
  if (!state.rebuilding || !recoverable(state)) return state;
  const rebuild = Math.min(STRIPES, state.rebuild + 1);
  return rebuild === STRIPES
    ? {
        ...state,
        failed: [],
        rebuilding: false,
        rebuild,
        message: "Üç temsili şerit yeniden kuruldu; koruma geri geldi.",
      }
    : {
        ...state,
        rebuild,
        message: `${rebuild}/${STRIPES} temsili şerit yeniden kuruldu.`,
      };
}

export function xorBlocks(blocks) {
  if (!blocks.length || blocks.some((bits) => !/^[01]{4}$/.test(bits)))
    throw new RangeError("Dört bitlik veri blokları gerekli.");
  return blocks
    .reduce((value, bits) => value ^ Number.parseInt(bits, 2), 0)
    .toString(2)
    .padStart(4, "0");
}

/** A schematic left-rotating parity layout, not a vendor/controller format. Q is symbolic. */
export function raidLayout(state) {
  const { level, disks } = state;
  return Array.from({ length: STRIPES }, (_, stripe) => {
    const pDisk =
      level === 4 ? disks - 1 : (disks - 1 - (stripe % disks) + disks) % disks;
    const qDisk = (pDisk - 1 + disks) % disks;
    let dataIndex = 0;
    const dataCount = level === 6 ? disks - 2 : disks - 1;
    const values = Array.from(
      { length: dataCount },
      (_, index) => ["1100", "1010", "0110"][index] ?? "0000",
    );
    return Array.from({ length: disks }, (_, disk) => {
      if ((level === 4 || level === 5 || level === 6) && disk === pDisk)
        return {
          stripe,
          disk,
          kind: "parity",
          label: `P${stripe}`,
          bits: xorBlocks(values),
        };
      if (level === 6 && disk === qDisk)
        return { stripe, disk, kind: "q", label: `Q${stripe}`, bits: null };
      const block =
        level === 1
          ? stripe
          : level === 10
            ? stripe * (disks / 2) + Math.floor(disk / 2)
            : level === 0
              ? stripe * disks + disk
              : stripe * dataCount + dataIndex;
      const bits =
        level === 4 || level === 5 || level === 6
          ? values[dataIndex++]
          : ["1100", "1010", "0110"][block % 3];
      return {
        stripe,
        disk,
        kind: level === 1 || level === 10 ? "mirror" : "data",
        label: `A${block}`,
        bits,
      };
    });
  });
}

export const ATTACHMENTS = {
  DAS: {
    abstraction: "Blok",
    filesystem: "Host",
    protocol: "Yerel I/O",
    nodes: ["Host · dosya sistemi", "Yerel I/O", "Blok aygıtı"],
    steps: [
      "Host dosya sisteminin blok isteği oluşur.",
      "İstek yerel I/O bağlantısından geçer.",
      "Aygıt, istenen mantıksal bloğu sunar.",
    ],
  },
  NAS: {
    abstraction: "Dosya",
    filesystem: "Sunucu",
    protocol: "NFS / CIFS",
    nodes: ["İstemci", "Ağ · NFS / CIFS", "Sunucu · dosya sistemi", "Aygıt"],
    steps: [
      "İstemci bir dosya/dizin işlemi ister.",
      "İstek ağ üzerinden dosya protokolüyle taşınır.",
      "Sunucunun dosya sistemi işlemi blok isteklerine dönüştürür.",
      "Sunucu aygıttan veriyi okur ve dosya yanıtını üretir.",
    ],
  },
  SAN: {
    abstraction: "Blok",
    filesystem: "Host",
    protocol: "FC / iSCSI",
    nodes: ["Host · dosya sistemi", "Depolama ağı", "Blok hacmi"],
    steps: [
      "Host dosya sistemi bir blok isteği oluşturur.",
      "İstek depolama ağından blok erişim protokolüyle taşınır.",
      "Dizi host’a bir blok hacmi sunar; dosya sistemi host’ta kalır.",
    ],
  },
};

export function topologyStep(kind, step) {
  const path = ATTACHMENTS[kind];
  if (!path || !Number.isInteger(step) || step < 0 || step >= path.steps.length)
    throw new RangeError("Topoloji adımı bulunamadı.");
  return path.steps[step];
}

/** Four-disk reduction of the two groupings illustrated in OSC10 slide 41. */
export function nestedRaid(kind, failed = []) {
  if (!["0+1", "1+0"].includes(kind))
    throw new RangeError("İç içe RAID türü bulunamadı.");
  if (failed.some((disk) => !Number.isInteger(disk) || disk < 0 || disk > 3))
    throw new RangeError("Disk bulunamadı.");
  const lost = [...new Set(failed)].sort((a, b) => a - b);
  const groups = [
    [0, 1],
    [2, 3],
  ];
  const available =
    kind === "0+1"
      ? groups.some((group) => group.every((disk) => !lost.includes(disk)))
      : groups.every((group) => group.some((disk) => !lost.includes(disk)));
  const labels =
    kind === "0+1" ? ["A0", "A1", "A0", "A1"] : ["A0", "A0", "A1", "A1"];
  return { kind, failed: lost, groups, labels, available };
}

/** Space quantities are teaching units; all stages conserve the 12-unit physical pool. */
export function poolStory(stage) {
  if (!Number.isInteger(stage) || stage < 0 || stage > 4)
    throw new RangeError("Havuz aşaması bulunamadı.");
  const [a, b] = [
    [4, 2],
    [6, 2],
    [6, 2],
    [8, 2],
    [5, 2],
  ][stage];
  const capacity = 12;
  return {
    mode: stage < 2 ? "traditional" : "pool",
    capacity,
    a,
    b,
    free: capacity - a - b,
    reserved: stage < 2 ? [6, 6] : null,
    blocked: stage === 1,
    request: stage === 1 ? 2 : 0,
  };
}

/** Two explicitly separate examples: lifecycle of obj:42, then placement of obj:99. */
export function objectStory(stage) {
  if (!Number.isInteger(stage) || stage < 0 || stage > 5)
    throw new RangeError("Nesne aşaması bulunamadı.");
  const placement = stage >= 4;
  return {
    example: placement ? "placement" : "lifecycle",
    id: stage === 0 ? null : placement ? "obj:99" : "obj:42",
    data: placement ? "1100" : "1010",
    exists: stage === 1 || stage === 2 || placement,
    read: stage === 2,
    deleted: stage === 3,
    systems: placement ? (stage === 4 ? 3 : 4) : 0,
    copies: placement ? (stage === 4 ? [0, 1, 2] : [0, 2, 3]) : [],
  };
}

/** Canonical semantic stories; independent of previous scenes and navigation order. */
export function raidSceneState(id, stage) {
  const counts = {
    "raid-striping": 6,
    "raid-parity": 6,
    "raid-xor": 5,
    "raid-rebuild": 7,
  };
  if (!Number.isInteger(stage) || stage < 0 || stage >= (counts[id] ?? 0))
    throw new RangeError("RAID sahnesi/aşaması bulunamadı.");
  if (id === "raid-striping") {
    let state = createRaidState(stage < 2 ? 0 : 1, stage < 2 ? 4 : 2, 4);
    if (stage === 1 || stage === 3 || stage === 4)
      state = toggleFailure(state, 0);
    if (stage === 4) state = toggleFailure(state, 1);
    return state;
  }
  if (id === "raid-parity") {
    let state = createRaidState(stage <= 1 ? 4 : stage === 4 ? 6 : 5, 4, 4);
    if (stage === 3 || stage === 4) state = toggleFailure(state, 1);
    if (stage === 4) state = toggleFailure(state, 2);
    return state;
  }
  if (id === "raid-xor") {
    let state = createRaidState();
    if (stage >= 2) state = toggleFailure(state, 1);
    if (stage === 4) state = toggleFailure(state, 2);
    return state;
  }
  let state = createRaidState();
  if (stage >= 1) state = toggleFailure(state, 0);
  if (stage >= 2) state = startRebuild(state);
  for (
    let stripe = 0;
    stripe < Math.min(STRIPES, Math.max(0, stage - 2));
    stripe++
  )
    state = advanceRebuild(state);
  return state;
}
