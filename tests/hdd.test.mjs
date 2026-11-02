import test from "node:test";
import assert from "node:assert/strict";
import { calculateAccess } from "../src/models/hdd.mjs";

const initial = { rpm: 7200, seek: 6, sizeKiB: 4, rateMBps: 200 };
test("KiB ve MB birimlerini koruyarak erişim maliyetini hesaplar", () => {
  const r = calculateAccess(initial);
  assert.ok(Math.abs(r.total - 10.187146666666667) < 1e-10);
  assert.equal(r.transfer, 0.02048);
});
test("RPM artışı yalnızca dönme bileşenini etkiler", () => {
  const first = calculateAccess(initial),
    second = calculateAccess({ ...initial, rpm: 14400 });
  assert.equal(second.rotation, first.rotation / 2);
  assert.equal(second.seek, first.seek);
  assert.equal(second.transfer, first.transfer);
});
test("veri miktarı artınca yalnızca aktarım maliyeti artar", () => {
  const first = calculateAccess(initial),
    second = calculateAccess({ ...initial, sizeKiB: 8 });
  assert.equal(second.transfer, first.transfer * 2);
  assert.equal(second.rotation, first.rotation);
});
test("geçersiz veya sonsuz parametrelerden sonuç üretmez", () => {
  for (const replacement of [
    { rpm: 0 },
    { seek: -1 },
    { sizeKiB: 0 },
    { rateMBps: 0 },
    { rpm: Infinity },
    { seek: NaN },
  ])
    assert.throws(
      () => calculateAccess({ ...initial, ...replacement }),
      RangeError,
    );
});
