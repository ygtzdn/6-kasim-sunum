import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { adjacentSceneId } from "../src/presentation/navigation.mjs";

test("integrity teaching keeps detection separate from corruption and correction", async () => {
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
    const { sceneReferences } = await server.ssrLoadModule(
      "/src/presentation/textbook.ts",
    );
    const { SceneFrame } = await server.ssrLoadModule(
      "/src/presentation/PresentationMotion.tsx",
    );
    const render = (id, stage, enabled = false) =>
      renderToStaticMarkup(
        createElement(SceneFrame, {
          scene: scenes.find((scene) => scene.id === id),
          direction: 1,
          menu: false,
          initialScene: true,
          context: { stage, enabled, setStage() {}, goTo() {}, openMenu() {} },
        }),
      );
    const order = [
      "why-error-detection",
      "error-detection",
      "error-correction",
      "device-preparation",
    ];
    assert.equal(
      chapters.find((chapter) => chapter.number === "11.4").firstScene,
      order[0],
    );
    const route = scenes.map((scene) => scene.id);
    const start = route.indexOf(order[0]);
    assert.deepEqual(route.slice(start, start + order.length), order);
    assert.equal(
      adjacentSceneId(scenes, "nvm-management-summary", 1),
      order[0],
    );
    assert.match(render(order[0], 0), /Okunan veri: 1011001/);
    assert.match(render(order[0], 1), /Okunan veri: 1001001/);
    assert.match(render(order[0], 2), /Hata saptanırsa işlem durdurulabilir/);

    for (const stage of [0, 1, 2, 3])
      assert.match(
        render("error-detection", stage),
        /Saklanan parite biti P: 0, sabit/,
      );
    const pending = render("error-detection", 1);
    assert.match(pending, /Parite örneğindeki veri: 1001001/);
    assert.match(pending, /Kontrol bekliyor/);
    assert.doesNotMatch(pending, /Tek: hata tespit edildi/);
    assert.match(render("error-detection", 2), /Tek: hata tespit edildi/);
    const missed = render("error-detection", 3);
    assert.match(missed, /Parite örneğindeki veri: 0111001/);
    assert.match(missed, /kontrol hata bulmadı/);
    assert.match(missed, /Bu parite kontrolü hatayı kaçırdı/);
    assert.match(render("error-detection", 4), /Basit bir checksum türü/);

    assert.match(
      render("error-correction", 0),
      /Okunan ECC örneği verisi: 1011/,
    );
    assert.match(
      render("error-correction", 1),
      /Okunan ECC örneği verisi: 1001/,
    );
    assert.match(render("error-correction", 1), /Kontrol bekliyor/);
    assert.match(render("error-correction", 2), /Düzeltilen veri: 1011/);
    const hardError = render("error-correction", 3);
    assert.match(hardError, /Hard error/);
    assert.match(hardError, /ECC fiziksel arızayı onaramaz/);
    assert.doesNotMatch(hardError, /Düzeltilen veri:/);

    for (const id of order.slice(0, 3)) {
      assert.deepEqual(sceneReferences[id].sections, ["11.4"]);
      assert.deepEqual(sceneReferences[id].slides, [27]);
    }
  } finally {
    await server.close();
  }
});
