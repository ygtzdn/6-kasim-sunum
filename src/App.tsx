import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { usePresentation } from "./presentation/usePresentation";
import SideMenu from "./presentation/SideMenu";

export default function App() {
  const presentation = usePresentation();
  const { current, enabled, goTo, openMenu, index, notice } = presentation;
  return (
    <MotionConfig
      reducedMotion={enabled ? "never" : "always"}
      transition={{ duration: enabled ? 0.3 : 0 }}
    >
      <div
        className={`app ${index === 0 ? "is-home" : "is-presenting"} ${enabled ? "" : "motion-off"}`}
      >
        <main className="presentation-canvas" aria-label="Sunum">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              data-scene-id={current.id}
              className="scene-frame"
              initial={enabled ? { opacity: 0, y: 14 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: enabled ? -8 : 0 }}
              transition={{ duration: enabled ? 0.2 : 0 }}
              onAnimationComplete={() =>
                document
                  .getElementById("scene-heading")
                  ?.focus({ preventScroll: true })
              }
            >
              {current.render({
                enabled,
                goTo,
                openMenu,
                stage: presentation.stage,
                setStage: presentation.setStage,
              })}
            </motion.div>
          </AnimatePresence>
        </main>
        <SideMenu {...presentation} />
        {notice && (
          <div className="toast" role="status">
            {notice}
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
