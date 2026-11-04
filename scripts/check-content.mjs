import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { AnimatePresence } from "motion/react";
import {
  motionGroups,
  sceneMotionProfile,
} from "../src/presentation/motion-presets.mjs";
import { nextStage, previousStage } from "../src/presentation/controls.mjs";
import {
  adjacentSceneId,
  resolveSceneId,
  sceneIdFromHash,
  scenesForMode,
} from "../src/presentation/navigation.mjs";

// Validate the implemented curriculum against its pre-implementation design contract.
// All rendering runs in Node. No browser, screenshots, or browser automation.
const contract = JSON.parse(
  readFileSync(
    new URL("../docs/presentation-contract.json", import.meta.url),
    "utf8",
  ),
);
const server = await createServer({
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
  logLevel: "error",
});
try {
  const { scenes, sceneGroups } = await server.ssrLoadModule(
    "/src/presentation/registry.ts",
  );
  const { sceneReferences, formatSlideNumbers } = await server.ssrLoadModule(
    "/src/presentation/textbook.ts",
  );
  const { default: NotesPanel } = await server.ssrLoadModule(
    "/src/presentation/NotesPanel.tsx",
  );
  const { SceneFrame } = await server.ssrLoadModule(
    "/src/presentation/PresentationMotion.tsx",
  );
  const { FlowDiagram } = await server.ssrLoadModule(
    "/src/components/diagrams/FlowDiagram.tsx",
  );
  const overlappingDiagrams = renderToStaticMarkup(
    createElement(
      "div",
      null,
      ...[0, 1].map((key) =>
        createElement(FlowDiagram, {
          key,
          id: "overlapping-stage",
          label: "Aynı sahnenin iki geçiş katmanı",
          nodes: [{ id: "ram", label: "RAM" }],
          edges: [],
          enabled: false,
        }),
      ),
    ),
  );
  const graphIds = [
    ...overlappingDiagrams.matchAll(/id="(flow-overlapping-stage-[^"]+)"/g),
  ].map((match) => match[1]);
  assert.equal(graphIds.length, 2);
  assert.equal(
    new Set(graphIds).size,
    2,
    "Birlikte görünen geçiş katmanları benzersiz React Flow/SVG kimliği taşımalı.",
  );
  for (const direction of ["LR", "TB"]) {
    const graph = renderToStaticMarkup(
      createElement(FlowDiagram, {
        id: "ssr-contract",
        label: "RAM ve swap",
        direction,
        enabled: false,
        nodes: [
          { id: "ram", label: "RAM F0" },
          { id: "swap", label: "Swap S0" },
        ],
        edges: [
          {
            id: "write",
            source: "ram",
            target: "swap",
            label: "Yazma",
            active: true,
          },
          { id: "read", source: "swap", target: "ram", label: "Okuma" },
        ],
      }),
    );
    assert.equal(
      (graph.match(/react-flow__edge-path/g) ?? []).length,
      2,
      "Kitaplık karşılıklı bağlantıları SSR'de çizmeli.",
    );
    assert.equal((graph.match(/data-id="(?:ram|swap)"/g) ?? []).length, 2);
    assert.ok(
      graph.includes("Yazma") &&
        graph.includes("Okuma") &&
        !graph.includes('tabindex="0"'),
    );
  }
  assert.equal(
    scenes.length,
    contract.length,
    "Uygulama planın bütün sahnelerini içermeli.",
  );
  assert.deepEqual(
    scenes.map((s) => s.id),
    contract.map((s) => s.id),
    "Kitap için planlanan sahne sırası korunmalı.",
  );
  const ids = new Set(scenes.map((s) => s.id));
  assert.deepEqual(
    Object.values(motionGroups).flat().toSorted(),
    [...ids].toSorted(),
    "Her sahne içerik türüne uygun tek bir hareket profiline bağlı olmalı.",
  );
  assert.equal(ids.size, scenes.length, "Sahne kimlikleri benzersiz olmalı.");
  assert.deepEqual(
    Object.keys(sceneReferences).sort(),
    [...ids].sort(),
    "Kaynaklar sahnelerle birebir eşleşmeli.",
  );
  const aliases = new Set();
  for (const [index, scene] of scenes.entries()) {
    const planned = contract[index];
    assert.match(scene.id, /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/);
    for (const field of [
      "kind",
      "depth",
      "presenterId",
      "chapter",
      "seconds",
      "legacyIds",
      "stages",
    ])
      assert.deepEqual(
        scene[field] ?? (field === "legacyIds" ? [] : undefined),
        planned[field],
        `${scene.id}: ${field} planla uyuşmuyor.`,
      );
    assert.equal(typeof scene.render, "function");
    assert.ok(
      scene.stages.length >= 2,
      `${scene.id}: en az iki anlamlı aşama gerekli.`,
    );
    assert.equal(
      new Set(scene.stages).size,
      scene.stages.length,
      `${scene.id}: aşama adı tekrarı.`,
    );
    assert.ok(scene.stages.every((name) => name.trim().length >= 3));
    assert.ok(
      Number.isInteger(scene.seconds.core) &&
        Number.isInteger(scene.seconds.full),
    );
    assert.ok(
      scene.seconds.full > 0 && scene.seconds.full >= scene.seconds.core,
    );
    assert.equal(scene.seconds.core === 0, scene.depth === "extension");
    for (const alias of scene.legacyIds ?? []) {
      assert.ok(
        !ids.has(alias) && !aliases.has(alias),
        `${alias}: kimlik/alias çakışması.`,
      );
      aliases.add(alias);
      assert.equal(resolveSceneId(scenes, alias), scene.id);
      assert.equal(sceneIdFromHash(`#/sunum/${alias}`, scenes), scene.id);
    }
    assert.equal(sceneIdFromHash(`#/sunum/${scene.id}`, scenes), scene.id);
    for (const field of ["represents", "learningGoal", "limits"])
      assert.ok(
        scene.notes[field]?.length >= 40,
        `${scene.id}: ${field} açıklaması eksik.`,
      );
    assert.ok(
      scene.notes.represents.length >= 150,
      `${scene.id}: sahnenin anlamı ayrıntılandırılmalı.`,
    );
    for (const field of ["walkthrough", "keyPoints"])
      assert.ok(
        scene.notes[field]?.length >= 2,
        `${scene.id}: ${field} eksik.`,
      );
    assert.ok(
      scene.notes.question?.prompt && scene.notes.question.answer,
      `${scene.id}: gerekçeli öğrenme sorusu eksik.`,
    );
    const reference = sceneReferences[scene.id];
    for (const field of ["sections", "slides", "takeaway", "model"])
      assert.deepEqual(
        reference[field],
        planned[field],
        `${scene.id}: kaynak ${field} planla uyuşmuyor.`,
      );
    assert.ok(reference.sections.length > 0);
    for (const section of reference.sections)
      assert.match(section, /^11\.[1-8]$/);
    assert.ok(
      reference.slides.length > 0 &&
        reference.slides.every(
          (n, i, a) =>
            Number.isInteger(n) &&
            n >= 1 &&
            n <= 47 &&
            (i === 0 || n > a[i - 1]),
        ),
    );
    assert.ok(reference.takeaway.length > 40 && reference.model.length > 40);
    const notesHtml = renderToStaticMarkup(
      createElement(NotesPanel, { scene }),
    );
    assert.ok(
      notesHtml.includes("Operating System Concepts") &&
        notesHtml.includes("Tenth Edition") &&
        notesHtml.includes(formatSlideNumbers(reference.slides)),
    );
  }
  for (let i = 1; i <= 36; i++)
    assert.ok(
      aliases.has(`s${String(i).padStart(2, "0")}`),
      "Eski bağlantı kaybolmamalı.",
    );
  const grouped = sceneGroups.flatMap((g) => g.scenes.map((s) => s.id));
  assert.equal(grouped.length, scenes.length);
  assert.equal(new Set(grouped).size, scenes.length);
  assert.ok(
    scenes.some((s) => s.kind === "intro") &&
      scenes.some((s) => s.kind === "closing"),
  );
  for (const mode of ["core", "full"]) {
    const route = scenesForMode(scenes, mode);
    const covered = new Set(
      route
        .filter((s) => s.kind === "chapter")
        .flatMap((s) => s.chapter.match(/11\.\d+/g) ?? []),
    );
    for (let section = 1; section <= 8; section++)
      assert.ok(covered.has(`11.${section}`), `${mode}: 11.${section} eksik.`);
    for (const [index, scene] of route.entries()) {
      assert.equal(
        adjacentSceneId(scenes, scene.id, -1, mode),
        route[index - 1]?.id ?? null,
      );
      assert.equal(
        adjacentSceneId(scenes, scene.id, 1, mode),
        route[index + 1]?.id ?? null,
      );
    }
  }
  let totalStages = 0;
  for (const scene of scenes) {
    const renderStage = (stage, enabled = false, direction = 1) =>
      renderToStaticMarkup(
        createElement(
          AnimatePresence,
          { initial: false, custom: { enabled, direction } },
          createElement(SceneFrame, {
            key: scene.id,
            scene,
            direction,
            menu: false,
            context: {
              stage,
              enabled,
              setStage() {},
              goTo() {
                throw new Error("Aşama oluşturulurken sahne değişemez.");
              },
              openMenu() {},
            },
          }),
        ),
      );
    const forward = [];
    for (let stage = 0; stage < scene.stages.length; stage++) {
      const html = renderStage(stage);
      const animatedHtml = renderStage(stage, true);
      forward.push(html);
      if (stage > 0)
        assert.notEqual(
          html,
          forward[stage - 1],
          `${scene.id}/${stage}: görünüm değişmiyor.`,
        );
      assert.ok(
        !/<video|<canvas|undefined|NaN/.test(html + animatedHtml),
        `${scene.id}/${stage}: geçersiz çıktı.`,
      );
      assert.equal(
        (html.match(/id="scene-heading"/g) ?? []).length,
        1,
        `${scene.id}/${stage}: tek başlık gerekli.`,
      );
      assert.ok(
        html.includes(`data-motion-profile="${sceneMotionProfile(scene.id)}"`),
      );
      assert.equal(
        (html.match(/class="stage-visual"/g) ?? []).length,
        scene.id === "storage-opening" ? 0 : 1,
        `${scene.id}/${stage}: tek görsel alan olmalı.`,
      );
      for (const [, asset] of html.matchAll(
        /(?:src|href)="(\/media\/[^"#]+)"/g,
      ))
        assert.ok(
          existsSync(`public${asset}`),
          `${scene.id}: medya eksik ${asset}`,
        );
      totalStages++;
    }
    for (let stage = scene.stages.length - 1; stage >= 0; stage--) {
      assert.equal(
        renderStage(stage, false, -1),
        forward[stage],
        `${scene.id}/${stage}: geri dönüş aynı durumu vermeli.`,
      );
      if (stage < scene.stages.length - 1)
        assert.equal(
          previousStage(
            nextStage(stage, scene.stages.length),
            scene.stages.length,
          ),
          stage,
        );
    }
    assert.equal(previousStage(0, scene.stages.length), 0);
    assert.equal(
      nextStage(scene.stages.length - 1, scene.stages.length),
      scene.stages.length - 1,
    );
  }
  const core = scenesForMode(scenes, "core");
  console.log(
    `${scenes.length} sahne, ${totalStages} aşamanın hareket açık/kapalı ve ileri/geri çıktıları; ${core.length} ana rota sahnesi, ${aliases.size} eski bağlantı, kaynaklar, süreler, notlar ve medya doğrulandı.`,
  );
  console.log(
    `Rota hedefleri: ${core.reduce((sum, s) => sum + s.seconds.core, 0)} / ${scenes.reduce((sum, s) => sum + s.seconds.full, 0)} saniye.`,
  );
} finally {
  await server.close();
}
