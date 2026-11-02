import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Check,
  Cpu,
  GitMerge,
  Layers3,
  RotateCcw,
  ShieldCheck,
  TimerReset,
  X,
} from "lucide-react";
import { Choice, Stage } from "../../components/presentation/ScenePrimitives";

export function NvmScheduling({ enabled }: { enabled: boolean }) {
  const [layer, setLayer] = useState<"os" | "controller">("os");
  const [sent, setSent] = useState(false);
  return (
    <Stage
      title="Seek yok. Kuyruk var."
      controls={
        <div className="flex flex-wrap justify-center gap-2">
          <Choice active={layer === "os"} onClick={() => setLayer("os")}>
            OS
          </Choice>
          <Choice
            active={layer === "controller"}
            onClick={() => setLayer("controller")}
          >
            SSD denetleyicisi
          </Choice>
          <button className="primary-button" onClick={() => setSent(!sent)}>
            {sent ? "Yeniden" : "Gönder"}
            <ArrowRight size={17} />
          </button>
        </div>
      }
    >
      <div className="flex h-full max-h-[540px] w-full max-w-[1050px] flex-col justify-center gap-5 md:gap-8">
        <div className="grid min-h-0 grid-cols-[1fr_34px_1fr_34px_1.2fr] items-center gap-2 md:grid-cols-[1fr_60px_1fr_60px_1.2fr] md:gap-6">
          <div
            className={`flex flex-col gap-2 rounded-xl border-2 p-3 md:gap-4 md:rounded-2xl md:p-6 ${layer === "os" ? "border-blue bg-[#e7eaff]" : "border-ink bg-white"}`}
          >
            <span className="text-[10px] font-semibold md:text-sm">
              OS kuyruğu
            </span>
            {["Oku A", "Yaz B", "Oku C", "Yaz D"].map((label, i) => (
              <motion.div
                key={label}
                initial={false}
                animate={{
                  x: sent && enabled ? [0, 7, 0] : 0,
                  opacity: sent ? 0.5 : 1,
                }}
                transition={{
                  duration: enabled ? 0.4 : 0,
                  delay: enabled ? i * 0.08 : 0,
                }}
                className="rounded-lg border border-ink bg-white p-2 text-center font-display text-[11px] font-medium md:p-3 md:text-xl"
              >
                {label}
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center">
            <ArrowRight className="w-5 md:w-8" />
          </div>
          <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-ink bg-[#fed84b] px-2 py-6 md:rounded-2xl md:py-10">
            <Cpu className="size-9 md:size-16" strokeWidth={1.5} />
            <span className="text-center text-[10px] font-semibold md:text-sm">
              NVMe
              <br />
              kuyrukları
            </span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{ backgroundColor: sent ? "#2247eb" : "#fff" }}
                  transition={{
                    duration: enabled ? 0.25 : 0,
                    delay: enabled ? 0.2 + i * 0.1 : 0,
                  }}
                  className="h-2 w-3 rounded-sm border border-ink md:h-3 md:w-5"
                />
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <ArrowRight className="w-5 md:w-8" />
          </div>
          <div
            className={`flex flex-col gap-2 rounded-xl border-2 p-3 md:gap-4 md:rounded-2xl md:p-6 ${layer === "controller" ? "border-blue bg-[#e7eaff]" : "border-ink bg-white"}`}
          >
            <span className="text-[10px] font-semibold md:text-sm">
              SSD / NAND
            </span>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  backgroundColor: sent ? "#2247eb" : "#fff",
                  color: sent ? "#fff" : "#111827",
                }}
                transition={{
                  duration: enabled ? 0.35 : 0,
                  delay: enabled ? 0.6 : 0,
                }}
                className="flex items-center justify-between gap-2 rounded-lg border border-ink p-2 text-[10px] font-semibold md:p-3 md:text-base"
              >
                <span>Kanal {i}</span>
                {sent ? <Check size={15} /> : <Layers3 size={15} />}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(layer === "os"
            ? [
                { title: "Birleştirme", Icon: GitMerge },
                { title: "Öncelik", Icon: ShieldCheck },
                { title: "Deadline", Icon: TimerReset },
              ]
            : [
                { title: "FTL", Icon: GitMerge },
                { title: "GC", Icon: Layers3 },
                { title: "Aşınma", Icon: ShieldCheck },
              ]
          ).map(({ title, Icon }) => (
            <div
              key={title}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-2 py-3 text-[10px] font-semibold md:gap-4 md:py-5 md:text-base"
            >
              <Icon size={20} />
              <span>{title}</span>
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
}

const featureLabels = ["Paralellik", "Wear leveling", "TRIM", "Ayrılmış alan"];
export function NvmCheckpoint({
  enabled,
  goTo,
}: {
  enabled: boolean;
  goTo: (id: string) => void;
}) {
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [feature, setFeature] = useState(0);
  const [applied, setApplied] = useState(false);
  const captions = [
    "Birden çok kanal.",
    applied ? "Yeni yükü daha az aşınanlara dağıt." : "Aşınma dağılımı.",
    applied ? "Gereksiz ≠ fiziksel olarak silinmiş." : "L2 artık gereksiz.",
    "Host dışında, denetleyicinin alanı.",
  ];
  return (
    <Stage
      title={
        answer === null ? "Seek = 0. İş = 0?" : "Hareket yok. Yönetim var."
      }
      controls={
        <div className="flex flex-wrap items-center justify-center gap-2">
          {answer === null ? (
            <>
              <Choice active={false} onClick={() => setAnswer(true)}>
                Evet
              </Choice>
              <Choice active={false} onClick={() => setAnswer(false)}>
                Hayır
              </Choice>
            </>
          ) : (
            <>
              {featureLabels.map((label, index) => (
                <Choice
                  key={label}
                  active={feature === index}
                  onClick={() => {
                    setFeature(index);
                    setApplied(false);
                  }}
                >
                  {label}
                </Choice>
              ))}
              <button
                className="icon-button"
                aria-label="NVM kontrol sorusunu sıfırla"
                onClick={() => {
                  setAnswer(null);
                  setApplied(false);
                }}
              >
                <RotateCcw size={17} />
              </button>
              <button
                className="icon-button"
                aria-label="Hata ve alan yönetimi bölümüne geç"
                onClick={() => goTo("s18")}
              >
                <ArrowRight size={19} />
              </button>
            </>
          )}
        </div>
      }
    >
      {answer === null ? (
        <div className="flex items-center gap-6 font-display text-[clamp(45px,13vw,160px)] font-medium">
          <span className="text-blue">0</span>
          <span className="text-slate-300">≟</span>
          <span>0</span>
        </div>
      ) : (
        <div className="flex h-full max-h-[470px] w-full max-w-[980px] flex-col items-center justify-center gap-6 md:gap-10">
          <div className="grid w-full grid-cols-4 gap-3 md:gap-7">
            {[0, 1, 2, 3].map((block) => {
              const wear = applied ? [8, 8, 8, 8] : [8, 2, 2, 1];
              const reserved = feature === 3 && block === 3;
              return (
                <button
                  key={block}
                  onClick={() => setApplied(!applied)}
                  aria-label={
                    feature === 1
                      ? "Aşınma dağılımını değiştir"
                      : feature === 2
                        ? "L2 için TRIM bildirimini göster"
                        : `Kanal veya blok ${block}`
                  }
                  className={`flex aspect-[.85] flex-col items-center justify-center gap-3 rounded-xl border-2 px-2 py-4 md:gap-6 md:rounded-2xl ${reserved ? "border-dashed border-slate-500 bg-slate-100" : "border-ink bg-white"}`}
                >
                  <span className="text-[10px] font-semibold text-slate-600 md:text-sm">
                    {feature === 0 ? `Kanal ${block}` : `B${block}`}
                  </span>
                  <div className="flex w-full max-w-28 flex-col gap-1.5">
                    {[0, 1, 2, 3].map((page) => (
                      <motion.div
                        initial={false}
                        key={page}
                        animate={{
                          backgroundColor: reserved
                            ? "#e2e8f0"
                            : feature === 2 &&
                                block === 1 &&
                                page === 2 &&
                                applied
                              ? "#cbd5e1"
                              : feature === 1
                                ? "#111827"
                                : "#2247eb",
                          opacity:
                            feature === 1 ? 0.25 + wear[block] * 0.08 : 1,
                        }}
                        transition={{ duration: enabled ? 0.4 : 0 }}
                        className="flex h-5 items-center justify-center rounded text-[9px] text-white md:h-8 md:text-xs"
                      >
                        {feature === 2 && block === 1 && page === 2 ? (
                          applied ? (
                            <X size={13} />
                          ) : (
                            "L2"
                          )
                        ) : (
                          ""
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <span className="font-display text-xl font-medium md:text-3xl">
                    {feature === 1 ? (
                      wear[block]
                    ) : reserved ? (
                      "GC"
                    ) : feature === 2 && block === 1 && applied ? (
                      "×"
                    ) : (
                      <Cpu className="size-5 md:size-8" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex min-h-8 flex-col items-center gap-2 text-center">
            <span className="font-display text-base font-medium md:text-2xl">
              {captions[feature]}
            </span>
            {feature === 1 || feature === 2 ? (
              <button
                className="text-xs font-semibold text-blue underline underline-offset-4"
                onClick={() => setApplied(!applied)}
              >
                {feature === 1
                  ? "Yeni yükü dağıt / sıfırla"
                  : "TRIM bildir / geri al"}
              </button>
            ) : (
              <span className="text-xs text-slate-500">
                {feature === 3
                  ? "Over-provisioning"
                  : "Kuyruklar ve paralellik"}
              </span>
            )}
          </div>
          <div className="h-5 text-xs font-semibold text-blue" role="status">
            {answer === true
              ? "Seek yok; kuyruk, yazma ve silme işleri sürer."
              : "Kuyruk, yazma ve silme işleri sürer."}
          </div>
        </div>
      )}
    </Stage>
  );
}
