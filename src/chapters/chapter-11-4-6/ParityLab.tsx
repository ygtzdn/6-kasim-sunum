import { Check, CircleAlert, LockKeyhole, ShieldCheck, X } from "lucide-react";
import { motion } from "motion/react";
import { useStageMotion } from "../../presentation/PresentationMotion";
import { Stage } from "../../components/presentation/ScenePrimitives";
import type { SceneContext } from "../../presentation/types";
import { managementStages } from "./stages";
import { StageControls } from "./StageControls";
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
  small = false,
  parity = false,
}: {
  bit: number;
  index: number;
  changed: boolean;
  small?: boolean;
  parity?: boolean;
}) {
  const { enabled } = useStageMotion();
  const classes = `${small ? "h-11 w-7 text-xl md:h-16 md:w-10 lg:w-13 lg:text-3xl" : "h-16 w-8 text-2xl md:h-28 md:w-14 md:text-4xl lg:w-22 lg:text-6xl"} relative flex items-center justify-center rounded-xl border-2 font-display font-semibold ${changed ? "border-orange bg-orange/10 text-ink" : parity ? "border-blue/30 bg-blue/10 text-blue" : "border-slate-300 bg-white text-ink"}`;
  const inside = (
    <>
      <motion.span
        key={bit}
        initial={enabled ? { opacity: 0.4, scale: 0.8 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: enabled ? 0.22 : 0 }}
      >
        {bit}
      </motion.span>
      {changed && (
        <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-orange text-white">
          <X size={12} />
        </span>
      )}
    </>
  );
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`state-cell ${classes}`}
        aria-label={`${parity ? "Denetim" : index + 1 + "."} bit: ${bit}${changed ? ", değişmiş" : ""}`}
      >
        {inside}
      </div>
      <span className="text-[10px] font-semibold text-slate-500">
        {parity ? "P" : index + 1}
      </span>
    </div>
  );
}

export function ParityLab({ stage, setStage }: SceneContext) {
  if (stage === 3)
    return (
      <Stage
        title="Denetim bilgisi farklı yöntemlerle üretilebilir."
        controls={
          <StageControls
            stage={stage}
            setStage={setStage}
            labels={managementStages["error-detection"]}
          />
        }
      >
        <div className="flex w-full max-w-5xl flex-col gap-6 md:gap-10">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-5">
            {[
              [
                "Parite",
                "Çiftlik / teklik bilgisi",
                "Çift sayıda bit değişimi kaçabilir.",
              ],
              [
                "Checksum",
                "Sabit uzunluklu denetim değeri",
                "Hata kapsaması kullanılan yönteme bağlıdır.",
              ],
              [
                "CRC",
                "Ek denetim bilgisi",
                "Birçok hata örüntüsünü saptamak için kullanılır.",
              ],
            ].map(([title, detail, limit]) => (
              <div
                key={title}
                className="flex flex-col items-center gap-3 rounded-2xl border-2 border-blue bg-white p-4 text-center md:p-6"
              >
                <ShieldCheck className="size-9 text-blue md:size-14" />
                <strong className="font-display text-xl md:text-3xl">
                  {title}
                </strong>
                <span className="text-xs font-semibold">{detail}</span>
                <span className="text-xs text-slate-600">{limit}</span>
              </div>
            ))}
          </div>
          <p
            role="status"
            className="text-center text-sm font-semibold text-blue md:text-lg"
          >
            Kontrolün hata bulmaması, verinin kesin doğru olduğunu kanıtlamaz.
          </p>
        </div>
      </Stage>
    );
  const bits =
    stage === 0
      ? [...ORIGINAL_BITS]
      : stage === 1
        ? flipBit([...ORIGINAL_BITS], 2)
        : flipBit(flipBit([...ORIGINAL_BITS], 0), 1);
  const result = checkParity(bits, STORED_PARITY);
  return (
    <Stage
      title="Veri değişince kontrol ne görür?"
      controls={
        <StageControls
          stage={stage}
          setStage={setStage}
          labels={managementStages["error-detection"]}
        />
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
          <span
            className={`rounded-xl px-4 py-2 text-sm font-semibold md:text-xl ${result.detected ? "bg-orange/15 text-ink" : "bg-blue/10 text-blue"}`}
          >
            {result.detected ? "Tek" : "Çift"}
          </span>
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

export function EccLab({ stage, setStage }: SceneContext) {
  const errors = stage >= 3 ? 2 : stage >= 1 ? 1 : 0;
  const checked = stage === 2 || stage === 4;
  const parityBits =
    errors === 0
      ? [...ORIGINAL_BITS]
      : errors === 1
        ? flipBit([...ORIGINAL_BITS], 2)
        : flipBit(flipBit([...ORIGINAL_BITS], 0), 1);
  const received =
    errors === 0
      ? ECC_CODE
      : errors === 1
        ? flipBit(ECC_CODE, 4)
        : flipBit(flipBit(ECC_CODE, 2), 5);
  const decoded = decodeSecded(received);
  const displayCode = checked && decoded.code ? decoded.code : received;
  return (
    <Stage
      title="Tespit ≠ düzeltme."
      controls={
        <StageControls
          stage={stage}
          setStage={setStage}
          labels={managementStages["error-correction"]}
        />
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
                small
              />
            ))}
            <Bit bit={0} index={7} changed={false} parity small />
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
            ) : stage === 0 ? (
              "Kod saklandı"
            ) : (
              "Kontrol bekliyor"
            )}
          </div>
        </div>
        <div
          className={`grid grid-cols-[1fr_auto] items-center gap-2 rounded-2xl border-2 bg-white p-4 lg:grid-cols-[110px_1fr_170px] md:gap-5 md:p-6 ${checked && errors === 1 ? "border-blue" : "border-slate-300"}`}
        >
          <span className="font-display text-lg font-semibold md:text-xl">
            ECC
            <span className="mt-1 block text-[10px] font-sans font-semibold text-slate-500">
              Özgün kod örneği
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
            ) : stage === 0 ? (
              "Kod saklandı"
            ) : (
              "Kontrol bekliyor"
            )}
          </div>
        </div>
        <p className="text-center text-xs font-semibold text-slate-500">
          Bu örnekte: 1 bit düzeltme · 2 bit tespiti. Her ECC kodunun sınırı
          farklıdır.
        </p>
      </div>
    </Stage>
  );
}
