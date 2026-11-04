import type { ReactNode } from "react";
import { StageTitle, StageVisual } from "../../presentation/PresentationMotion";

export function Stage({
  title,
  children,
  controls,
}: {
  title: string;
  children: ReactNode;
  controls?: ReactNode;
}) {
  return (
    <section className="stage">
      <StageTitle title={title} />
      <StageVisual>{children}</StageVisual>
      <div className="stage-controls">{controls}</div>
    </section>
  );
}
export function Choice({
  active,
  children,
  onClick,
  label,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      className={`choice ${active ? "choice-active" : ""}`}
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
    >
      {children}
    </button>
  );
}
