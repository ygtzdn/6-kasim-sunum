import type { SceneContext } from "../../../presentation/types";
import { motion } from "motion/react";
import AccessLab, { initialAccess } from "../../../components/AccessLab";
import { calculateAccess } from "../../../models/hdd.mjs";
import { hardwareCaptions } from "../notes";
import { Lesson, Metric, number } from "./LearningPrimitives";
export function AccessCost(context: SceneContext) {
  return (
    <Lesson
      title="Konumlandırma ≠ toplam servis süresi."
      caption={hardwareCaptions["hdd-access-cost"][context.stage]}
    >
      <AccessLab stage={context.stage} enabled={context.enabled} />
    </Lesson>
  );
}
export function RequestSize({ stage, enabled }: SceneContext) {
  const rate = stage >= 2 ? 250 : 125;
  return (
    <Lesson
      title="Veri büyür. Mekanik bekleme aynı kalır."
      caption={hardwareCaptions["hdd-request-size"][stage]}
    >
      <div className="grid w-full max-w-[950px] grid-cols-2 gap-4 md:gap-10">
        {[4, 1024].map((size, index) => {
          const shown = index === 0 || stage >= 1,
            r = calculateAccess({
              ...initialAccess,
              sizeKiB: size,
              rateMBps: rate,
            });
          return (
            <div
              key={size}
              className={`flex flex-col gap-4 rounded-2xl border-2 p-4 md:p-6 ${shown ? "border-ink bg-white" : "border-dashed border-slate-300"}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-display text-xl md:text-3xl">
                  {size === 4 ? "4 KiB" : "1 MiB"}
                </h2>
                <span className="text-[10px] font-semibold text-slate-500 md:text-xs">
                  {shown ? `${rate} MB/s` : "?"}
                </span>
              </div>
              {shown ? (
                <>
                  <div className="flex h-40 items-end justify-center md:h-48">
                    <motion.div
                      className="flex w-24 flex-col-reverse md:w-36"
                      initial={enabled ? { height: 0 } : false}
                      animate={{ height: `${(r.total / 20) * 100}%` }}
                      transition={{ duration: enabled ? 0.45 : 0 }}
                      aria-label={`${number(r.positioning + r.controller)} ms sabit pay, ${number(r.transfer, 4)} ms aktarım`}
                    >
                      <motion.div
                        className={`flex items-center justify-center bg-blue text-[9px] font-semibold text-white ${stage === 3 ? "outline-2 outline-offset-2 outline-blue" : ""}`}
                        initial={false}
                        animate={{
                          height: `${((r.positioning + r.controller) / r.total) * 100}%`,
                        }}
                        transition={{ duration: enabled ? 0.45 : 0 }}
                      >
                        Seek + dönme + C
                      </motion.div>
                      <motion.div
                        className="min-h-[2px] bg-orange"
                        initial={false}
                        animate={{ height: `${(r.transfer / r.total) * 100}%` }}
                        transition={{ duration: enabled ? 0.45 : 0 }}
                      />
                    </motion.div>
                  </div>
                  <Metric
                    value={`${number(r.total)} ms`}
                    label="Toplam servis"
                  />
                  <p className="text-center text-[10px] font-semibold text-slate-600 md:text-xs">
                    Aktarım: {number(r.transfer, 4)} ms
                    <br />
                    Sabit: {number(r.positioning + r.controller, 4)} ms
                  </p>
                </>
              ) : (
                <div className="flex h-64 items-center justify-center font-display text-6xl text-slate-300">
                  ?
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Lesson>
  );
}
export function PerformanceMetrics({ stage, enabled }: SceneContext) {
  return (
    <Lesson
      title="Hız, gecikme, bandwidth."
      caption={hardwareCaptions["hdd-performance-metrics"][stage]}
    >
      <div className="flex w-full max-w-[900px] flex-col gap-4 md:gap-7">
        {stage < 2 ? (
          <div className="space-y-5">
            <p className="text-center text-xs font-semibold text-slate-500">
              Kitabın tarihsel örnek değerleri
            </p>
            {[
              { name: "Arayüz tavanı", value: 6 },
              { name: "Etkin örnek", value: 1 },
            ].map((m, i) => (
              <div
                key={m.name}
                className="grid grid-cols-[100px_1fr_60px] items-center gap-3 text-xs font-semibold md:grid-cols-[140px_1fr_90px]"
              >
                <span>{m.name}</span>
                <div className="h-14 rounded-lg bg-slate-100">
                  <motion.div
                    className="h-full rounded-lg bg-blue"
                    initial={false}
                    animate={{
                      width: stage >= i ? `${(m.value / 6) * 100}%` : 0,
                    }}
                    transition={{ duration: enabled ? 0.48 : 0 }}
                  />
                </div>
                <span>{stage >= i ? `${m.value} Gb/s` : "?"}</span>
              </div>
            ))}
          </div>
        ) : stage === 2 ? (
          <div className="grid grid-cols-2 gap-5">
            <Metric value="1 Gb/s" label="Etkin aktarım örneği" />
            <Metric value="9,30 ms" label="Tek I/O servis hesabı" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2 rounded-xl border-2 border-ink p-4 text-center text-xs font-semibold md:p-8">
              <span>
                İlk istek
                <br />
                t₀
              </span>
              <div className="flex flex-1 gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    className="flex-1 rounded bg-blue p-3 text-white"
                    key={i}
                  >
                    I/O
                  </div>
                ))}
              </div>
              <span>
                Son tamamlanma
                <br />
                t₁
              </span>
            </div>
            <Metric
              value="Σ byte / (t₁ − t₀)"
              label="Bütün ölçüm penceresinin disk bandwidth’i"
            />
          </>
        )}
      </div>
    </Lesson>
  );
}
