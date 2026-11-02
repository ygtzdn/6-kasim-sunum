import assert from "node:assert/strict";
import { createServer } from "vite";

// Inspect the actual module registry in Node. No browser, rendering, or screenshots.
const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});
try {
  const { scenes, sceneGroups } = await server.ssrLoadModule(
    "/src/presentation/registry.ts",
  );
  assert.equal(scenes.length, 36, "36 sahne bulunmalı.");
  const allIds = new Set(scenes.map((s) => s.id));
  assert.equal(allIds.size, 36, "Sahne kimlikleri benzersiz olmalı.");
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    assert.equal(scene.id, `s${String(i + 1).padStart(2, "0")}`);
    const expected = i < 9 ? 1 : i < 17 ? 2 : i < 25 ? 3 : 4;
    assert.equal(scene.presenterId, expected, scene.id);
    assert.equal(typeof scene.render, "function");
    for (const field of ["represents", "learningGoal", "limits"])
      assert.ok(
        scene.notes[field]?.length >= 40,
        `${scene.id}: ${field} ayrıntılandırılmalı.`,
      );
    assert.ok(
      scene.notes.represents.length >= 150,
      `${scene.id}: sayfanın anlamı ayrıntılı yazılmalı.`,
    );
    for (const field of ["walkthrough", "keyPoints"])
      assert.ok(
        scene.notes[field]?.length >= 2,
        `${scene.id}: ${field} eksik.`,
      );
  }
  const grouped = sceneGroups.flatMap((g) => g.scenes.map((s) => s.id));
  assert.equal(grouped.length, 36);
  assert.equal(new Set(grouped).size, 36);
  const sections = new Set(
    scenes.flatMap((s) => s.chapter.match(/11\.\d+/g) ?? []),
  );
  for (const section of [
    "11.1",
    "11.2",
    "11.3",
    "11.4",
    "11.5",
    "11.6",
    "11.7",
    "11.8",
  ])
    assert.ok(sections.has(section), `${section} eksik.`);
  console.log(
    "36 sahne, dört sunucu, 11.1–11.8 kapsamı, menü grupları ve ayrıntılı notlar doğrulandı.",
  );
} finally {
  await server.close();
}
