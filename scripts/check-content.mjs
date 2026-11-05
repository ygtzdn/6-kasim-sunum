import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { resolveSceneId } from "../src/presentation/navigation.mjs";

// Basic page loading, links and local assets only.
// No note-format requirements, curriculum contract or per-stage checks.
const server = await createServer({
  server: { middlewareMode: true, hmr: false, watch: null },
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
  const ids = new Set(scenes.map((scene) => scene.id));
  assert.equal(ids.size, scenes.length, "Sayfa adresleri benzersiz olmalı.");
  for (const chapter of chapters) {
    assert.ok(
      ids.has(chapter.firstScene),
      `${chapter.number}: bölüm bağlantısı bulunamadı.`,
    );
  }
  for (const scene of scenes) {
    for (const alias of scene.legacyIds ?? []) {
      assert.equal(
        resolveSceneId(scenes, alias),
        scene.id,
        `${alias}: eski bağlantı çözülemedi.`,
      );
    }
    const html = renderToStaticMarkup(
      createElement(SceneFrame, {
        scene,
        direction: 1,
        menu: false,
        initialScene: true,
        context: {
          stage: 0,
          enabled: false,
          setStage() {},
          goTo() {},
          openMenu() {},
        },
      }),
    );
    for (const [, asset] of html.matchAll(
      /(?:src|href)="(\/media\/[^"#]+)"/g,
    )) {
      assert.ok(
        existsSync(`public${asset}`),
        `${scene.id}: eksik görsel ${asset}`,
      );
    }
  }
  console.log(
    `Ana akıştaki ${scenes.length} sayfanın açılışı, bölüm bağlantıları ve yerel görseller kontrol edildi.`,
  );
} finally {
  await server.close();
}
