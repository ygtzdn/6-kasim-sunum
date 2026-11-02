/** @param {{rpm:number, seek:number, sizeKiB:number, rateMBps:number}} input */
export function calculateAccess({ rpm, seek, sizeKiB, rateMBps }) {
  if (
    ![rpm, seek, sizeKiB, rateMBps].every(Number.isFinite) ||
    rpm <= 0 ||
    seek < 0 ||
    sizeKiB <= 0 ||
    rateMBps <= 0
  ) {
    throw new RangeError("Geçerli, pozitif eğitim parametreleri girin.");
  }
  const rotation = 30000 / rpm;
  const transfer = ((sizeKiB * 1024) / (rateMBps * 1_000_000)) * 1000;
  return { seek, rotation, transfer, total: seek + rotation + transfer };
}
