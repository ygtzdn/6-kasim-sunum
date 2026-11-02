import type { ReactNode } from "react";

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
      <h1 id="scene-heading" tabIndex={-1} className="stage-title">
        {title}
      </h1>
      <div className="stage-visual">{children}</div>
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
