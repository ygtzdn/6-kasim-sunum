import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import {
  adjacentSceneId,
  resolveSceneId,
} from "../src/presentation/navigation.mjs";

test("11.7 introduces the source's three approaches, then ends with SAN and the file/block comparison", async () => {
  const server = await createServer({
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    appType: "custom",
    logLevel: "error",
  });
  try {
    const { scenes } = await server.ssrLoadModule(
      "/src/presentation/registry.ts",
    );
    const { chapters } = await server.ssrLoadModule(
      "/src/presentation/chapters.ts",
    );
    const { SceneFrame } = await server.ssrLoadModule(
      "/src/presentation/PresentationMotion.tsx",
    );
    const order = [
      "storage-attachment",
      "host-attached",
      "nas",
      "cloud-storage",
      "storage-arrays",
      "san",
      "nas-san-comparison",
    ];
    assert.deepEqual(
      scenes
        .filter((scene) => scene.chapter === "11.7")
        .map((scene) => scene.id),
      order,
    );
    assert.equal(
      chapters.find((chapter) => chapter.number === "11.7").firstScene,
      order[0],
    );
    assert.equal(adjacentSceneId(scenes, order.at(-1), 1), "raid-intro");
    assert.equal(resolveSceneId(scenes, "s26"), "host-attached");

    const render = (id, stage) =>
      renderToStaticMarkup(
        createElement(SceneFrame, {
          scene: scenes.find((scene) => scene.id === id),
          direction: 1,
          menu: false,
          initialScene: true,
          context: {
            stage,
            enabled: false,
            setStage() {},
            goTo() {},
            openMenu() {},
          },
        }),
      );
    const intro = render(order[0], 0);
    for (const name of ["Host-attached", "Network-attached", "Cloud"])
      assert.ok(intro.includes(name));

    // An IP connection must not silently turn file service into block service.
    const nas = render("nas", 2);
    assert.match(nas, /NAS sunucusu: Dosya işlemleri, dosya sistemi burada/);
    assert.match(nas, /Erişim: dosya \/ dizin/);
    const iscsi = render("nas", 3);
    assert.match(iscsi, /Host: Dosya sistemi host’ta, dosya sistemi burada/);
    assert.match(iscsi, /SCSI komutları/);
    assert.match(iscsi, /Erişim: blok/);

    // Changing the highlighted host restores the corresponding visible logical unit.
    assert.match(render("san", 2), /Vurgulanan erişim: Host A ile LUN A/);
    assert.match(render("san", 3), /Vurgulanan erişim: Host B ile LUN B/);
    assert.match(render("san", 2), /Vurgulanan erişim: Host A ile LUN A/);

    const comparison = render("nas-san-comparison", 2);
    assert.match(comparison, /Dosya \/ dizin/);
    assert.match(comparison, /Blok \/ mantıksal hacim/);
    assert.match(comparison, /NAS sunucusunda/);
    assert.match(comparison, /Host tarafında/);
  } finally {
    await server.close();
  }
});
