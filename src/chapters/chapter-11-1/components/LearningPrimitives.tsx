import type { ReactNode } from "react";
import { StageCaption } from "../../../presentation/PresentationMotion";
export { HardwarePhoto as Photo } from "./HardwarePhoto";
import type { SceneContext } from "../../../presentation/types";
import {
  Stage,
  Choice,
} from "../../../components/presentation/ScenePrimitives";

export const number = (n: number, digits = 2) =>
  n.toLocaleString("tr-TR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export function Lesson({
  title,
  children,
  caption,
  controls,
}: {
  title: string;
  children: ReactNode;
  caption: string;
  controls?: ReactNode;
}) {
  return (
    <Stage title={title} controls={controls}>
      <div className="flex h-full min-h-0 w-full max-w-[1120px] flex-col items-center justify-center gap-4 md:gap-6">
        <div className="flex min-h-0 w-full flex-1 items-center justify-center">
          {children}
        </div>
        <StageCaption className="max-w-[970px] shrink-0 text-center text-xs font-semibold leading-relaxed text-slate-600 md:text-base">
          {caption}
        </StageCaption>
      </div>
    </Stage>
  );
}
export function Tabs({
  labels,
  stage,
  setStage,
}: Pick<SceneContext, "stage" | "setStage"> & { labels: string[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {labels.map((label, i) => (
        <Choice key={label} active={stage === i} onClick={() => setStage(i)}>
          {label}
        </Choice>
      ))}
    </div>
  );
}
export function Bits({
  value = "10100101",
  lost = false,
}: {
  value?: string;
  lost?: boolean;
}) {
  return (
    <div
      className="flex justify-center gap-1 md:gap-2"
      aria-label={lost ? "Veri kayboldu" : `Veri: ${value}`}
    >
      {value.split("").map((bit, i) => (
        <span
          key={i}
          className={`state-cell flex size-6 items-center justify-center rounded border font-display text-xs md:size-9 md:text-base ${lost ? "border-slate-300 bg-slate-100 text-slate-400" : "border-blue bg-blue/10 text-blue"}`}
        >
          {lost ? "–" : bit}
        </span>
      ))}
    </div>
  );
}
export function Metric({
  value,
  label,
  active = true,
}: {
  value: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`state-cell flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-center md:p-5 ${active ? "border-blue bg-blue/5" : "border-slate-200 bg-white text-slate-400"}`}
    >
      <strong className="font-display text-xl font-medium md:text-3xl">
        {value}
      </strong>
      <span className="text-[10px] font-semibold md:text-xs">{label}</span>
    </div>
  );
}
