import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import {
  motion,
  useIsPresent,
  usePresenceData,
  type Variants,
} from "motion/react";
import type { SceneContext, SceneDefinition } from "./types";
import {
  EASE,
  motionGroups,
  sceneMotionPose,
  sceneMotionProfile,
} from "./motion-presets.mjs";

export interface TransitionState {
  enabled: boolean;
  direction: number;
}
const StageMotionContext = createContext<TransitionState>({
  enabled: false,
  direction: 1,
});
const sceneVariants = Object.fromEntries(
  Object.keys(motionGroups).map((profile) => [
    profile,
    {
      enter: (state: TransitionState) =>
        sceneMotionPose(profile, "enter", state),
      visible: (state: TransitionState) =>
        sceneMotionPose(profile, "visible", state),
      exit: (state: TransitionState) => sceneMotionPose(profile, "exit", state),
    } satisfies Variants,
  ]),
);
const titleVariants: Variants = {
  enter: ({ enabled }: TransitionState) => ({
    opacity: enabled ? 0 : 1,
  }),
  visible: ({ enabled }: TransitionState) => ({
    opacity: 1,
    transition: { duration: enabled ? 0.18 : 0, ease: EASE },
  }),
  exit: ({ enabled }: TransitionState) => ({
    opacity: 0,
    transition: { duration: enabled ? 0.18 : 0, ease: EASE },
  }),
};

export function SceneFrame({
  scene,
  context,
  direction,
  menu,
  initialScene = false,
}: {
  scene: SceneDefinition;
  context: SceneContext;
  direction: number;
  menu: boolean;
  initialScene?: boolean;
}) {
  const present = useIsPresent();
  const presence = usePresenceData() as TransitionState | undefined;
  const state = presence ?? { enabled: context.enabled, direction };
  const profile = sceneMotionProfile(scene.id);
  const frame = useRef<HTMLDivElement>(null);
  const entering = useRef(true);
  const menuRef = useRef(menu);
  useEffect(() => {
    menuRef.current = menu;
  }, [menu]);
  const focusHeading = () => {
    if (!present || menu || menuRef.current || !entering.current) return;
    entering.current = false;
    if (
      document.activeElement instanceof Element &&
      document.activeElement.closest(
        'input,textarea,select,[contenteditable]:not([contenteditable="false"])',
      )
    )
      return;
    frame.current
      ?.querySelector<HTMLElement>("#scene-heading")
      ?.focus({ preventScroll: true });
  };
  useEffect(() => {
    // Sync presence may reuse this frame if navigation reverses before its exit ends.
    if (!present) {
      entering.current = true;
      return;
    }
    // AnimatePresence suppresses the first entrance; there is no completion to await.
    if ((initialScene || !state.enabled) && !menu) focusHeading();
  });
  return (
    <motion.div
      ref={frame}
      data-scene-id={scene.id}
      data-motion-profile={profile}
      className="scene-frame scene-layer"
      custom={state}
      variants={sceneVariants[profile]}
      initial={context.enabled ? "enter" : false}
      animate="visible"
      exit="exit"
      inert={!present}
      aria-hidden={!present || undefined}
      style={{ pointerEvents: present ? "auto" : "none" }}
      onAnimationComplete={(definition) => {
        if (definition === "visible") focusHeading();
      }}
    >
      <StageMotionContext.Provider
        value={{
          enabled: state.enabled,
          direction,
        }}
      >
        {scene.render(context)}
      </StageMotionContext.Provider>
    </motion.div>
  );
}

export function StageVisual({ children }: { children: ReactNode }) {
  // Keep model views mounted: their paths, colors and positions interpolate between stages.
  // Keying this subtree by stage interrupts every local animation and refits every graph.
  return <div className="stage-visual">{children}</div>;
}

export function useStageMotion() {
  return useContext(StageMotionContext);
}

/** Mount only around a newly introduced explanation, never the whole stage. */
export function StageReveal({
  children,
  className = "",
  effect = "rise",
}: {
  children: ReactNode;
  className?: string;
  effect?: "rise" | "scale" | "wipe";
}) {
  const { enabled, direction } = useStageMotion();
  const start = {
    rise: {
      opacity: 0,
      y: 10 * direction,
      scale: 1,
      clipPath: "inset(0% 0% 0% 0%)",
    },
    scale: { opacity: 0, y: 0, scale: 0.96, clipPath: "inset(0% 0% 0% 0%)" },
    wipe: {
      opacity: 1,
      y: 0,
      scale: 1,
      clipPath: direction < 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
    },
  }[effect];
  return (
    <motion.div
      className={className}
      initial={enabled ? start : false}
      animate={{ opacity: 1, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }}
      transition={{ duration: enabled ? 0.28 : 0, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Only the changing explanation enters; diagrams and labels keep their identities. */
export function StageCaption({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const { enabled } = useStageMotion();
  return (
    <p
      className={className}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <motion.span
        className="block"
        key={children}
        initial={enabled ? { opacity: 0.35, y: 3 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: enabled ? 0.2 : 0, ease: EASE }}
      >
        {children}
      </motion.span>
    </p>
  );
}

function TitleLayer({
  title,
  state,
}: {
  title: string;
  state: TransitionState;
}) {
  return (
    <motion.span
      className="stage-title-layer"
      key={title}
      custom={state}
      variants={titleVariants}
      initial={state.enabled ? "enter" : false}
      animate="visible"
    >
      {title}
    </motion.span>
  );
}
export function StageTitle({ title }: { title: string }) {
  const state = useStageMotion();
  return (
    <h1
      id="scene-heading"
      tabIndex={-1}
      className="stage-title stage-title-stack"
    >
      <TitleLayer key={title} title={title} state={state} />
    </h1>
  );
}
