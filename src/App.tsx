import { AnimatePresence, MotionConfig } from "motion/react";
import { useEffect, useRef } from "react";
import { usePresentation } from "./presentation/usePresentation";
import SideMenu from "./presentation/SideMenu";
import { SceneFrame } from "./presentation/PresentationMotion";

export default function App() {
  const presentation = usePresentation();
  const initialScene = useRef(true);
  useEffect(() => {
    initialScene.current = false;
  }, []);
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
          <AnimatePresence
            mode="sync"
            initial={false}
            custom={{ enabled, direction: presentation.direction }}
          >
            <SceneFrame
              key={current.id}
              scene={current}
              direction={presentation.direction}
              menu={presentation.menu}
              initialScene={initialScene.current}
              context={{
                enabled,
                goTo,
                openMenu,
                stage: presentation.stage,
                setStage: presentation.setStage,
              }}
            />
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
