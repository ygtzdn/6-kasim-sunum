import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

test("scheduling visuals restore head, counters and merged commands when revisiting stages", async () => {
  const server = await createServer({
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    appType: "custom",
    logLevel: "error",
  });
  try {
    const { QueueSetup, ScheduleComparison, SchedulingLab } =
      await server.ssrLoadModule(
        "/src/chapters/chapter-11-2-3/SchedulingLab.tsx",
      );
    const { schedulingScenes } = await server.ssrLoadModule(
      "/src/chapters/chapter-11-2-3/scenes.tsx",
    );
    const { calculateSchedule, defaultSchedule } = await server.ssrLoadModule(
      "/src/chapters/chapter-11-2-3/model.ts",
    );
    const { NvmScheduling } = await server.ssrLoadModule(
      "/src/chapters/chapter-11-2-3/NvmScenes.tsx",
    );
    const render = (Component, stage, extra = {}, enabled = false) =>
      renderToStaticMarkup(
        createElement(Component, {
          stage,
          enabled,
          setStage() {},
          goTo() {},
          openMenu() {},
          ...extra,
        }),
      );

    assert.match(render(QueueSetup, 0), /HDD kafası 53 silindirinde/);
    assert.match(render(QueueSetup, 1), /HDD kafası 98 silindirinde/);
    assert.match(render(QueueSetup, 1), /Bekleyen silindirler: 183, 37/);
    assert.match(render(QueueSetup, 2), /276 silindir hareketi/);
    assert.match(render(QueueSetup, 2), /162 silindir hareketi/);

    const scanEdge = render(SchedulingLab, 3, { algorithm: "SCAN" });
    const circularWrap = render(SchedulingLab, 4, { algorithm: "C-SCAN" });
    assert.match(scanEdge, /53 silindir hareketi/);
    assert.match(circularWrap, /252 silindir hareketi/);
    assert.match(circularWrap, /Servis yok/);
    // Neither the edge nor the return trip completes another request.
    for (const html of [scanEdge, circularWrap]) {
      assert.equal(
        (html.match(/aria-label="İstek \d+, silindir \d+, tamamlandı"/g) ?? [])
          .length,
        2,
      );
    }
    for (const [id, algorithm, total] of [
      ["sstf-path", "SSTF", 236],
      ["look-path", "LOOK", 208],
      ["clook-path", "C-LOOK", 326],
    ]) {
      const scene = schedulingScenes.find((scene) => scene.id === id);
      const { events } = calculateSchedule(algorithm, defaultSchedule);
      assert.equal(scene.stages.length, events.length + 2);
      const finalStage = render(scene.render, scene.stages.length - 1);
      assert.match(finalStage, new RegExp(`${total} silindir hareketi`));
      assert.match(finalStage, /8\/8 istek/);
    }
    const clookWrap = render(SchedulingLab, 3, { algorithm: "C-LOOK" });
    assert.match(clookWrap, /Servis yok · \+169/);
    assert.match(clookWrap, /208 silindir hareketi/);
    assert.match(clookWrap, /2\/8 istek/);
    const clookService = render(SchedulingLab, 4, { algorithm: "C-LOOK" });
    assert.match(clookService, /208 silindir hareketi/);
    assert.match(clookService, /3\/8 istek/);
    const comparison = render(ScheduleComparison, 1);
    assert.match(
      comparison,
      /C-SCAN, 386 silindir hareketi, bunun 199 silindiri servissiz dönüş/,
    );
    assert.match(
      comparison,
      /C-LOOK, 326 silindir hareketi, bunun 169 silindiri servissiz dönüş/,
    );
    assert.match(
      render(NvmScheduling, 1),
      /4 host isteği, 4 komut, 4 mantıksal blok/,
    );
    assert.match(
      render(NvmScheduling, 2),
      /4 host isteği, 3 komut, 4 mantıksal blok/,
    );
    assert.match(render(NvmScheduling, 3), /Komutlar arayüze gönderildi/);
    assert.match(
      render(NvmScheduling, 4),
      /Komutlar SSD denetleyicisine ulaştı/,
    );
  } finally {
    await server.close();
  }
});
