import test from "node:test";
import assert from "node:assert/strict";
import {
  advanceRebuild,
  ATTACHMENTS,
  configureRaid,
  createRaidState,
  RAID_LEVELS,
  raidLayout,
  raidStatus,
  recoverable,
  startRebuild,
  STRIPES,
  toggleFailure,
  topologyStep,
  usableCapacity,
  validDiskCounts,
  xorBlocks,
} from "../src/chapters/chapter-11-7-8/model.mjs";

test("başlangıç RAID 5 kapasitesi ve koruma durumu", () => {
  const state = createRaidState();
  assert.equal(state.disks * state.sizeTB, 16);
  assert.equal(usableCapacity(state), 12);
  assert.equal(raidStatus(state), "healthy");
  const one = toggleFailure(state, 1);
  assert.equal(raidStatus(one), "degraded");
  assert.equal(
    usableCapacity(one),
    12,
    "tek disk kaybı mantıksal kapasiteyi 8 TB yapmaz",
  );
  const two = toggleFailure(one, 2);
  assert.equal(raidStatus(two), "unrecoverable");
  assert.equal(
    usableCapacity(two),
    12,
    "nominal kapasite ile erişilebilirlik ayrı",
  );
});

test("her seviyenin geçerli disk sayısı ve kapasite sözleşmesi", () => {
  assert.deepEqual(validDiskCounts(1), [2]);
  assert.deepEqual(validDiskCounts(10), [4, 6, 8]);
  assert.equal(usableCapacity(createRaidState(0, 4, 4)), 16);
  assert.equal(usableCapacity(createRaidState(1, 2, 4)), 4);
  assert.equal(usableCapacity(createRaidState(4, 4, 4)), 12);
  assert.equal(usableCapacity(createRaidState(5, 4, 4)), 12);
  assert.equal(usableCapacity(createRaidState(6, 4, 4)), 8);
  assert.equal(usableCapacity(createRaidState(10, 4, 4)), 8);
  for (const [level, count] of [
    [0, 1],
    [1, 4],
    [4, 2],
    [5, 2],
    [6, 3],
    [10, 5],
    [10, 2],
  ]) {
    assert.throws(() => createRaidState(level, count, 4), RangeError);
  }
  for (const size of [0, 9, NaN, Infinity, 1.5])
    assert.throws(() => createRaidState(5, 4, size), RangeError);
  assert.throws(() => validDiskCounts(3), RangeError);
});

test("tam disk arızası sayısı RAID 0/1/4/5/6 sınırlarını uygular", () => {
  for (const level of [0, 1, 4, 5, 6]) {
    const n = level === 1 ? 2 : 4;
    let state = createRaidState(level, n, 4);
    const tolerates = level === 0 ? 0 : level === 6 ? 2 : 1;
    for (let disk = 0; disk < n; disk++) {
      state = toggleFailure(state, disk);
      assert.equal(
        recoverable(state),
        state.failed.length <= tolerates,
        `RAID ${level}, ${state.failed.length} kayıp`,
      );
    }
  }
});

test("RAID 10 aynı sayıda arızada ayna çiftlerinin dağılımını dikkate alır", () => {
  const state = createRaidState(10, 4, 4);
  assert.equal(recoverable(toggleFailure(toggleFailure(state, 0), 2)), true);
  assert.equal(recoverable(toggleFailure(toggleFailure(state, 0), 1)), false);
  for (const disks of [4, 6, 8]) {
    const max = 2 ** disks;
    for (let mask = 0; mask < max; mask++) {
      let scenario = createRaidState(10, disks, 4);
      for (let disk = 0; disk < disks; disk++)
        if (mask & (1 << disk)) scenario = toggleFailure(scenario, disk);
      const expected = Array.from(
        { length: disks / 2 },
        (_, pair) =>
          !(mask & (1 << (pair * 2)) && mask & (1 << (pair * 2 + 1))),
      ).every(Boolean);
      assert.equal(
        recoverable(scenario),
        expected,
        `${disks} disk, maske ${mask}`,
      );
    }
  }
});

test("seviye değişimi disk sayısını bildirerek düzeltir ve eski arızaları temizler", () => {
  const lost = toggleFailure(createRaidState(), 2);
  const mirror = configureRaid(lost, { level: 1 });
  assert.equal(mirror.disks, 2);
  assert.deepEqual(mirror.failed, []);
  assert.match(mirror.message, /disk sayısı 2/);
  assert.equal(mirror.rebuilding, false);
  const corrected = configureRaid(createRaidState(5, 5, 4), { level: 10 });
  assert.ok([4, 6].includes(corrected.disks));
  assert.match(corrected.message, /RAID 10/);
  assert.equal(configureRaid(lost, { sizeTB: 8 }).sizeTB, 8);
  assert.deepEqual(configureRaid(lost, { sizeTB: 8 }).failed, []);
});

test("RAID 4 ayrılmış parite; RAID 5 dönen parite; RAID 6 bağımsız P/Q sütunları", () => {
  for (const disks of [3, 4, 5, 8]) {
    const dedicated = raidLayout(createRaidState(4, disks, 4));
    assert.ok(dedicated.every((row) => row[disks - 1].kind === "parity"));
    const rotated = raidLayout(createRaidState(5, disks, 4));
    assert.equal(
      new Set(
        rotated.map((row) => row.find((cell) => cell.kind === "parity").disk),
      ).size,
      STRIPES,
    );
    for (const row of rotated)
      assert.equal(row.filter((cell) => cell.kind === "parity").length, 1);
  }
  for (const disks of [4, 5, 8]) {
    const dual = raidLayout(createRaidState(6, disks, 4));
    const positions = [];
    for (const row of dual) {
      const p = row.find((cell) => cell.kind === "parity");
      const q = row.find((cell) => cell.kind === "q");
      assert.notEqual(p.disk, q.disk);
      assert.equal(
        q.bits,
        null,
        "gerçek Q cebiri hesaplanıyormuş gibi bit deseni üretilmez",
      );
      assert.equal(
        row.filter((cell) => cell.kind === "data").length,
        disks - 2,
      );
      positions.push(q.disk);
    }
    assert.equal(new Set(positions).size, STRIPES);
  }
});

test("şeritleme kopya üretmez, aynalama aynı veri kimliği ve bitleri korur", () => {
  const stripe = raidLayout(createRaidState(0, 4, 4));
  assert.equal(new Set(stripe.flat().map((cell) => cell.label)).size, 12);
  const mirror = raidLayout(createRaidState(1, 2, 4));
  for (const row of mirror) {
    assert.equal(row[0].label, row[1].label);
    assert.equal(row[0].bits, row[1].bits);
  }
  const paired = raidLayout(createRaidState(10, 8, 4));
  for (const row of paired) {
    assert.equal(new Set(row.map((cell) => cell.label)).size, 4);
    for (let disk = 0; disk < 8; disk += 2) {
      assert.equal(row[disk].label, row[disk + 1].label);
      assert.equal(row[disk].bits, row[disk + 1].bits);
    }
  }
});

test("XOR kayıp veri ve kayıp parite için sağlam bloklardan çözüm üretir", () => {
  assert.equal(xorBlocks(["1100", "1010", "0110"]), "0000");
  assert.equal(xorBlocks(["0000", "1100", "0110"]), "1010");
  for (const level of [4, 5])
    for (const disks of validDiskCounts(level)) {
      const rows = raidLayout(createRaidState(level, disks, 4));
      for (const row of rows)
        for (const missing of row) {
          const recovered = xorBlocks(
            row.filter((cell) => cell !== missing).map((cell) => cell.bits),
          );
          assert.equal(
            recovered,
            missing.bits,
            `RAID ${level}, ${disks} disk, kayıp D${missing.disk}`,
          );
        }
    }
  for (const invalid of [
    [],
    [""],
    ["101"],
    ["11112"],
    ["abcd"],
    ["1010", "100"],
  ])
    assert.throws(() => xorBlocks(invalid), RangeError);
});

test("rebuild yalnızca bilgi yeterliyken başlar; yeni arıza engellenir; üç adımda tamamlanır", () => {
  for (const level of RAID_LEVELS) {
    const disks = level === 1 ? 2 : 4;
    const healthy = createRaidState(level, disks, 4);
    assert.equal(
      startRebuild(healthy),
      healthy,
      "sağlıklı dizide rebuild başlatılmaz",
    );
    const failed = toggleFailure(healthy, 0);
    const begun = startRebuild(failed);
    if (level === 0) {
      assert.equal(begun, failed);
      continue;
    }
    assert.equal(begun.rebuilding, true);
    assert.equal(begun.rebuild, 0);
    assert.equal(
      toggleFailure(begun, 1),
      begun,
      "rebuild sırasında arıza seçimi kapalı",
    );
    let state = begun;
    for (let step = 1; step <= STRIPES; step++) {
      state = advanceRebuild(state);
      assert.equal(state.rebuild, step);
      assert.equal(state.rebuilding, step < STRIPES);
      if (step < STRIPES)
        assert.deepEqual(
          state.failed,
          [0],
          "tamamlanmadan diski sağlam saymaz",
        );
    }
    assert.deepEqual(state.failed, []);
    assert.equal(raidStatus(state), "healthy");
    assert.deepEqual(
      raidLayout(state),
      raidLayout(healthy),
      "veri yerleşimi rebuild ile değişmez",
    );
    assert.equal(
      advanceRebuild(state),
      state,
      "tamamlanan rebuild daha fazla ilerlemez",
    );
  }
  const lost = toggleFailure(toggleFailure(createRaidState(), 0), 1);
  assert.equal(
    startRebuild(lost),
    lost,
    "iki kayıplı RAID 5 sihirli olarak kurtarılmaz",
  );
  const pairLost = toggleFailure(
    toggleFailure(createRaidState(10, 4, 4), 0),
    1,
  );
  assert.equal(
    startRebuild(pairLost),
    pairLost,
    "kayıp ayna çifti yeniden kurulamaz",
  );
});

test("model önceki nesneleri değiştirmez ve geçersiz diskleri reddeder", () => {
  const state = createRaidState();
  const failed = toggleFailure(state, 0);
  assert.deepEqual(state.failed, []);
  assert.deepEqual(failed.failed, [0]);
  assert.deepEqual(toggleFailure(failed, 0).failed, []);
  for (const disk of [-1, 4, 1.2, NaN])
    assert.throws(() => toggleFailure(state, disk), RangeError);
});

test("DAS/NAS/SAN farklı semantik ve dosya sistemi sorumluluğu taşır", () => {
  assert.equal(ATTACHMENTS.DAS.abstraction, "Blok");
  assert.equal(ATTACHMENTS.DAS.filesystem, "Host");
  assert.equal(ATTACHMENTS.NAS.abstraction, "Dosya");
  assert.equal(ATTACHMENTS.NAS.filesystem, "Sunucu");
  assert.equal(ATTACHMENTS.SAN.abstraction, "Blok");
  assert.equal(ATTACHMENTS.SAN.filesystem, "Host");
  for (const kind of Object.keys(ATTACHMENTS)) {
    const topology = ATTACHMENTS[kind];
    assert.equal(topology.steps.length, topology.nodes.length);
    assert.equal(
      topologyStep(kind, topology.steps.length - 1),
      topology.steps.at(-1),
    );
    assert.throws(() => topologyStep(kind, topology.steps.length), RangeError);
  }
  assert.throws(() => topologyStep("unknown", 0), RangeError);
});
