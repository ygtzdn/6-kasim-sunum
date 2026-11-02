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
    protocol: "NFS / SMB",
    nodes: ["İstemci", "Ağ · NFS / SMB", "Sunucu · dosya sistemi", "Aygıt"],
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
