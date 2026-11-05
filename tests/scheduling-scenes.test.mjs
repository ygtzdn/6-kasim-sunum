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
    const { QueueSetup, SchedulingLab } = await server.ssrLoadModule(
      "/src/chapters/chapter-11-2-3/SchedulingLab.tsx",
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
