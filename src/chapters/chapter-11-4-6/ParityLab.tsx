import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  CircleAlert,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  X,
} from "lucide-react";
import { Choice, Stage } from "../../components/presentation/ScenePrimitives";
import {
  ORIGINAL_BITS,
  STORED_PARITY,
  checkParity,
  decodeSecded,
  encodeSecded,
  flipBit,
} from "./model.mjs";

function Bit({
  bit,
  index,
  changed,
  onClick,
  enabled,
  small = false,
  parity = false,
}: {
  bit: number;
  index: number;
  changed: boolean;
  onClick?: () => void;
  enabled: boolean;
  small?: boolean;
  parity?: boolean;
}) {
  const classes = `${small ? "h-11 w-7 text-xl md:h-16 md:w-10 lg:w-13 lg:text-3xl" : "h-16 w-8 text-2xl md:h-28 md:w-14 md:text-4xl lg:w-22 lg:text-6xl"} relative flex items-center justify-center rounded-xl border-2 font-display font-semibold ${changed ? "border-orange bg-orange/10 text-ink" : parity ? "border-blue/30 bg-blue/10 text-blue" : "border-slate-300 bg-white text-ink"}`;
  const inside = (
    <>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={bit}
          initial={enabled ? { y: 14, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          exit={enabled ? { y: -14, opacity: 0 } : undefined}
          transition={{ duration: enabled ? 0.18 : 0 }}
        >
          {bit}
        </motion.span>
      </AnimatePresence>
      {changed && (
        <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-orange text-white">
          <X size={12} />
        </span>
      )}
    </>
  );
  return (
    <div className="flex flex-col items-center gap-2">
      {onClick ? (
        <button
          className={classes}
          onClick={onClick}
          aria-label={`${index + 1}. bit ${bit}; değiştirmek için seçin`}
          aria-pressed={changed}
        >
          {inside}
        </button>
      ) : (
        <div className={classes}>{inside}</div>
      )}
      <span className="text-[10px] font-semibold text-slate-500">
        {parity ? "P" : index + 1}
      </span>
    </div>
  );
}

export function ParityLab({ enabled }: { enabled: boolean }) {
  const [bits, setBits] = useState<number[]>([...ORIGINAL_BITS]);
  const result = checkParity(bits, STORED_PARITY);
  const changed = bits.reduce(
    (sum, bit, index) => sum + Number(bit !== ORIGINAL_BITS[index]),
    0,
  );
  return (
    <Stage
      title="Bir bit değişirse?"
      controls={
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Choice
            active={changed === 1}
            onClick={() => setBits(flipBit([...ORIGINAL_BITS], 2))}
          >
            1 bit hata
          </Choice>
          <Choice
            active={changed === 2}
            onClick={() => setBits(flipBit(flipBit([...ORIGINAL_BITS], 0), 1))}
          >
            2 bit hata
          </Choice>
          <button
            className="icon-button"
            onClick={() => setBits([...ORIGINAL_BITS])}
            aria-label="Parite örneğini sıfırla"
          >
            <RotateCcw size={19} />
          </button>
        </div>
      }
    >
      <div className="flex w-full max-w-5xl flex-col items-center gap-6 md:gap-10">
        <div
          className="flex items-center gap-1 md:gap-3"
          role="group"
          aria-label="Saklanan veri bitleri"
        >
          {bits.map((bit, index) => (
            <Bit
              key={index}
              bit={bit}
              index={index}
              changed={bit !== ORIGINAL_BITS[index]}
              enabled={enabled}
              onClick={() => setBits(flipBit(bits, index))}
            />
          ))}
          <span className="mx-0.5 text-sm text-slate-400 md:mx-2 md:text-3xl">
            +
          </span>
          <div className="flex flex-col items-center gap-2">
            <div className="relative flex h-16 w-8 items-center justify-center rounded-xl border-2 border-blue bg-blue text-2xl font-semibold text-white md:h-28 md:w-14 md:text-4xl lg:w-22 lg:text-6xl">
              {STORED_PARITY}
              <LockKeyhole
                className="absolute -top-2 -right-2 rounded bg-paper text-blue"
                size={18}
              />
            </div>
            <span className="text-[10px] font-semibold text-blue">
              P · sabit
            </span>
          </div>
        </div>
        <div className="flex items-center gap-5 font-display text-2xl md:text-4xl">
          <span>
            Σ1 = <strong>{result.ones + STORED_PARITY}</strong>
          </span>
          <motion.span
            key={String(result.detected)}
            initial={enabled ? { scale: 0.85 } : false}
            animate={{ scale: 1 }}
            className={`rounded-xl px-4 py-2 text-sm font-semibold md:text-xl ${result.detected ? "bg-orange/15 text-ink" : "bg-blue/10 text-blue"}`}
          >
            {result.detected ? "Tek" : "Çift"}
          </motion.span>
        </div>
        <div
          role="status"
          aria-live="polite"
          className={`flex items-center gap-3 rounded-2xl px-5 py-4 text-center text-sm font-semibold md:text-lg ${result.detected ? "bg-orange/15 text-ink" : "bg-blue/10 text-blue"}`}
        >
          {result.detected ? <CircleAlert size={23} /> : <Check size={23} />}
          {result.detected
            ? "Hata saptandı."
            : "Bu parite kontrolü hata saptamadı."}
        </div>
      </div>
    </Stage>
  );
}

const ECC_DATA = [1, 0, 1, 1];
const ECC_CODE = encodeSecded(ECC_DATA);

export function EccLab({ enabled }: { enabled: boolean }) {
  const [errors, setErrors] = useState<1 | 2>(2);
  const [checked, setChecked] = useState(false);
  const parityBits =
    errors === 1
      ? flipBit([...ORIGINAL_BITS], 2)
      : flipBit(flipBit([...ORIGINAL_BITS], 0), 1);
  const received =
    errors === 1 ? flipBit(ECC_CODE, 4) : flipBit(flipBit(ECC_CODE, 2), 5);
  const decoded = decodeSecded(received);
  const displayCode = checked && decoded.code ? decoded.code : received;
  return (
    <Stage
      title="Tespit ≠ düzeltme."
      controls={
        <div className="flex items-center justify-center gap-2">
          <Choice
            active={errors === 1}
            onClick={() => {
              setErrors(1);
              setChecked(false);
            }}
          >
            1 bit
          </Choice>
          <Choice
            active={errors === 2}
            onClick={() => {
              setErrors(2);
              setChecked(false);
            }}
          >
            2 bit
          </Choice>
          <button
            className="primary-button"
            onClick={() => setChecked(!checked)}
          >
            {checked ? "Hatayı geri getir" : "Kontrol et"}
          </button>
        </div>
      }
    >
      <div className="grid w-full max-w-5xl gap-5 md:gap-8">
        <div className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-2xl border border-slate-300 bg-white p-4 lg:grid-cols-[110px_1fr_170px] md:gap-5 md:p-6">
          <span className="font-display text-lg font-semibold md:text-xl">
            Parite
          </span>
          <div className="col-span-2 row-start-2 flex justify-center gap-1.5 lg:col-span-1 lg:row-start-auto">
            {parityBits.map((bit, i) => (
              <Bit
                key={i}
                bit={bit}
                index={i}
                changed={bit !== ORIGINAL_BITS[i]}
                enabled={enabled}
                small
              />
            ))}
            <Bit
              bit={0}
              index={7}
              changed={false}
              enabled={enabled}
              parity
              small
            />
          </div>
          <div
            role="status"
            className="col-start-2 row-start-1 flex items-center gap-2 text-xs font-semibold lg:col-start-auto lg:row-start-auto md:text-sm"
          >
            {checked ? (
              <>
                {errors === 1 ? (
                  <CircleAlert className="text-orange" size={20} />
                ) : (
                  <X className="text-orange" size={20} />
                )}
                {errors === 1 ? "Tespit edildi" : "Hata kaçtı"}
              </>
            ) : (
              "Kontrol bekliyor"
            )}
          </div>
        </div>
        <motion.div
          animate={{
            borderColor: checked && errors === 1 ? "#2247eb" : "#cbd5e1",
          }}
          transition={{ duration: enabled ? 0.25 : 0 }}
          className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-2xl border-2 bg-white p-4 lg:grid-cols-[110px_1fr_170px] md:gap-5 md:p-6"
        >
          <span className="font-display text-lg font-semibold md:text-xl">
            ECC
            <span className="mt-1 block text-[10px] font-sans font-semibold text-slate-500">
              Hamming (8,4)
            </span>
          </span>
          <div className="col-span-2 row-start-2 flex justify-center gap-1.5 lg:col-span-1 lg:row-start-auto">
            {displayCode.map((bit, i) => (
              <Bit
                key={i}
                bit={bit}
                index={i}
                changed={bit !== ECC_CODE[i]}
                parity={[0, 1, 3, 7].includes(i)}
                enabled={enabled}
                small
              />
            ))}
          </div>
          <div
            role="status"
            className="col-start-2 row-start-1 flex items-center gap-2 text-xs font-semibold lg:col-start-auto lg:row-start-auto md:text-sm"
          >
            {checked ? (
              <>
                {errors === 1 ? (
                  <ShieldCheck className="text-blue" size={22} />
                ) : (
                  <CircleAlert className="text-orange" size={22} />
                )}
                {errors === 1 ? "1 bit düzeltildi" : "Tespit · düzeltilemez"}
              </>
            ) : (
              "Kontrol bekliyor"
            )}
          </div>
        </motion.div>
        <p className="text-center text-xs font-semibold text-slate-500">
          SECDED: 1 bit düzeltme · 2 bit tespiti
        </p>
      </div>
    </Stage>
  );
}
