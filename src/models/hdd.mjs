/** @param {{rpm:number, seek:number, sizeKiB:number, rateMBps:number, controllerMs?:number}} input */
export function calculateAccess({
  rpm,
  seek,
  sizeKiB,
  rateMBps,
  controllerMs = 0,
}) {
  if (
    ![rpm, seek, sizeKiB, rateMBps, controllerMs].every(Number.isFinite) ||
    rpm <= 0 ||
    seek < 0 ||
    sizeKiB <= 0 ||
    rateMBps <= 0 ||
    controllerMs < 0
  ) {
    throw new RangeError("Geçerli, pozitif eğitim parametreleri girin.");
  }
  const rotation = 30000 / rpm;
  const transfer = ((sizeKiB * 1024) / (rateMBps * 1_000_000)) * 1000;
  const positioning = seek + rotation;
  return {
    seek,
    rotation,
    positioning,
    transfer,
    controller: controllerMs,
    total: positioning + transfer + controllerMs,
  };
}
