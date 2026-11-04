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
    { controllerMs: -0.1 },
    { controllerMs: Infinity },
  ])
    assert.throws(
      () => calculateAccess({ ...initial, ...replacement }),
      RangeError,
    );
});

test("kitap örneğinin açık KiB ve ondalık MB/s yorumu controller maliyetini ayrı ekler", () => {
  const r = calculateAccess({
    rpm: 7200,
    seek: 5,
    sizeKiB: 4,
    rateMBps: 125,
    controllerMs: 0.1,
  });
  assert.ok(Math.abs(r.transfer - 0.032768) < 1e-12);
  assert.equal(r.controller, 0.1);
  assert.ok(Math.abs(r.positioning - 9.166666666666668) < 1e-12);
  assert.ok(Math.abs(r.total - 9.299434666666666) < 1e-12);
  const withoutController = calculateAccess({
    rpm: 7200,
    seek: 5,
    sizeKiB: 4,
    rateMBps: 125,
  });
  assert.ok(Math.abs(r.total - withoutController.total - 0.1) < 1e-12);
});

test("istek boyutu ve transfer hızı karşılaştırmasında mekanik ve controller payı sabit kalır", () => {
  const base = { rpm: 7200, seek: 5, controllerMs: 0.1 };
  const small = calculateAccess({ ...base, sizeKiB: 4, rateMBps: 125 });
  const large = calculateAccess({ ...base, sizeKiB: 1024, rateMBps: 125 });
  const fastSmall = calculateAccess({ ...base, sizeKiB: 4, rateMBps: 250 });
  const fastLarge = calculateAccess({ ...base, sizeKiB: 1024, rateMBps: 250 });
  assert.ok(Math.abs(large.transfer - 8.388608) < 1e-12);
  assert.equal(fastSmall.transfer, small.transfer / 2);
  assert.equal(fastLarge.transfer, large.transfer / 2);
  for (const r of [large, fastSmall, fastLarge]) {
    assert.equal(r.positioning, small.positioning);
    assert.equal(r.controller, small.controller);
  }
  assert.ok(Math.abs(large.total - 17.655274666666667) < 1e-12);
  assert.ok(Math.abs(fastLarge.total - 13.460970666666667) < 1e-12);
  assert.ok(fastSmall.total > small.total / 2);
});
