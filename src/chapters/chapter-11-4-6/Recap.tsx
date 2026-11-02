import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Check,
  FolderOpen,
  HardDrive,
  ShieldCheck,
  X,
} from "lucide-react";
import { Choice, Stage } from "../../components/presentation/ScenePrimitives";

const questions = [
  {
    number: "Q04",
    Icon: ShieldCheck,
    prompt: "Parite her iki bit hatasını yakalar mı?",
    options: ["Evet", "Hayır"],
    correct: 1,
    answer: "Çift sayıda bit değişimi pariteyi koruyabilir.",
  },
  {
    number: "Q05",
    Icon: FolderOpen,
    prompt: "Bölüm = dosya sistemi mi?",
    options: ["Aynı işlem", "Farklı katmanlar"],
    correct: 1,
    answer: "Bölüm alan ayırır; dosya sistemi o alanı düzenler.",
  },
  {
    number: "Q06",
    Icon: HardDrive,
    prompt: "Her tahliye swap’a yazar mı?",
    options: ["Her zaman", "Gerekmez"],
    correct: 1,
    answer: "Temiz dosya sayfası yeniden dosyadan okunabilir.",
  },
];

export function ManagementRecap({
  enabled,
  goTo,
}: {
  enabled: boolean;
  goTo: (id: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
  const question = questions[index];
  const answer = answers[index];
  const Icon = question.Icon;
  return (
    <Stage
      title="Üç karar."
      controls={
        <div className="flex flex-wrap items-center justify-center gap-2">
          {questions.map((item, i) => (
            <Choice
              active={index === i}
              onClick={() => setIndex(i)}
              key={item.number}
            >
              {item.number}
              {answers[i] !== null && <Check size={13} />}
            </Choice>
          ))}
          <button className="primary-button" onClick={() => goTo("s26")}>
            Bağlantı & RAID <ArrowRight size={18} />
          </button>
        </div>
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={enabled ? { y: 20, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          exit={enabled ? { y: -15, opacity: 0 } : undefined}
          transition={{ duration: enabled ? 0.2 : 0 }}
          className="flex max-w-3xl flex-col items-center gap-5 md:gap-8"
        >
          <div className="flex size-20 items-center justify-center rounded-3xl bg-blue/10 text-blue md:size-28">
            <Icon className="size-10 md:size-14" strokeWidth={1.5} />
          </div>
          <h2 className="text-center font-display text-2xl font-semibold md:text-4xl">
            {question.prompt}
          </h2>
          <div className="flex items-center gap-3">
            {question.options.map((option, i) => (
              <button
                key={option}
                className={`flex min-h-12 items-center gap-2 rounded-xl border-2 px-5 py-3 text-sm font-semibold transition-colors ${answer === i ? (i === question.correct ? "border-blue bg-blue text-white" : "border-orange bg-orange/10") : "border-slate-300 bg-white hover:border-blue"}`}
                onClick={() =>
                  setAnswers(
                    answers.map((value, position) =>
                      position === index ? i : value,
                    ),
                  )
                }
              >
                {answer === i &&
                  (i === question.correct ? (
                    <Check size={17} />
                  ) : (
                    <X size={17} />
                  ))}
                {option}
              </button>
            ))}
          </div>
          <div
            role="status"
            aria-live="polite"
            className="flex min-h-12 items-center justify-center text-center text-xs font-semibold text-blue md:text-base"
          >
            {answer !== null && question.answer}
          </div>
        </motion.div>
      </AnimatePresence>
    </Stage>
  );
}
