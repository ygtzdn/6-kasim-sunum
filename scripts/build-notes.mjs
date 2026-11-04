import assert from "node:assert/strict";
import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { hardwareGuideHTML } from "./hardware-guide.mjs";

// A standalone offline reading/printing artifact; no browser or network calls.
const root = fileURLToPath(new URL("../", import.meta.url));
const output = resolve(root, "public/references/sunum-notlari.html");
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const duration = (seconds) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
const contract = JSON.parse(
  await readFile(resolve(root, "docs/presentation-contract.json"), "utf8"),
);

async function embeddedFonts() {
  const faces = [];
  for (const [font, family, weights] of [
    ["manrope", "Manrope", [400, 600]],
    ["space-grotesk", "Space Grotesk", [500, 600]],
  ]) {
    for (const weight of weights) {
      for (const subset of ["latin", "latin-ext"]) {
        const data = await readFile(
          resolve(
            root,
            `node_modules/@fontsource/${font}/files/${font}-${subset}-${weight}-normal.woff2`,
          ),
        );
        const range =
          subset === "latin"
            ? "U+0000-00FF,U+2000-206F"
            : "U+0100-024F,U+1E00-1EFF";
        faces.push(
          `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:swap;src:url(data:font/woff2;base64,${data.toString("base64")}) format('woff2');unicode-range:${range}}`,
        );
      }
    }
  }
  return faces.join("\n");
}

let generatedHTML;
let generatedHardwareGuide;
let generatedSceneCount = 0;
let generatedStageCount = 0;
const server = await createServer({
  root,
  server: { middlewareMode: true, hmr: false, watch: null },
  appType: "custom",
  logLevel: "error",
});
try {
  const { scenes } = await server.ssrLoadModule(
    "/src/presentation/registry.ts",
  );
  const { default: NotesPanel } = await server.ssrLoadModule(
    "/src/presentation/NotesPanel.tsx",
  );
  const hardwareComponents = await server.ssrLoadModule(
    "/src/chapters/chapter-11-1/components/HardwarePhoto.tsx",
  );
  generatedHardwareGuide = await hardwareGuideHTML(hardwareComponents);
  const { sceneReferences, textbook } = await server.ssrLoadModule(
    "/src/presentation/textbook.ts",
  );
  assert.deepEqual(
    scenes.map((scene) => scene.id),
    contract.map((scene) => scene.id),
    "Notlar üretilmeden bütün planlanan sahneler registry'de bulunmalı.",
  );
  assert.equal(new Set(scenes.map((scene) => scene.id)).size, scenes.length);
  const totals = {
    full: {
      count: scenes.length,
      seconds: scenes.reduce((sum, scene) => sum + scene.seconds.full, 0),
      stages: scenes.reduce((sum, scene) => sum + scene.stages.length, 0),
    },
    core: {
      count: scenes.filter((scene) => scene.depth === "core").length,
      seconds: scenes.reduce((sum, scene) => sum + scene.seconds.core, 0),
      stages: scenes
        .filter((scene) => scene.depth === "core")
        .reduce((sum, scene) => sum + scene.stages.length, 0),
    },
  };
  const rows = scenes
    .map(
      (scene, index) =>
        `<tr data-depth="${scene.depth}"><td>${String(index + 1).padStart(2, "0")}</td><td><a href="#scene-${escape(scene.id)}">${escape(scene.title)}</a><small>${escape(scene.id)}</small></td><td>${escape(scene.chapter)}<br>${scene.presenterId}. kişi</td><td>${scene.depth === "extension" ? "Ek" : "Ana"}</td><td>${duration(scene.seconds.core)} / ${duration(scene.seconds.full)}</td></tr>`,
    )
    .join("\n");
  const articles = scenes
    .map((scene, index) => {
      assert.match(scene.id, /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/);
      assert.ok(sceneReferences[scene.id], `${scene.id}: kaynak kaydı yok.`);
      assert.ok(scene.stages.length > 1, `${scene.id}: aşama listesi gerekli.`);
      const notes = renderToStaticMarkup(
        createElement(NotesPanel, { scene, stage: 0 }),
      );
      assert.ok(
        notes.includes("Kitap dayanağı"),
        `${scene.id}: NotesPanel oluşturulamadı.`,
      );
      return `<section class="scene-sheet" id="scene-${escape(scene.id)}" data-depth="${scene.depth}">
      <header class="scene-header"><span class="eyebrow">${String(index + 1).padStart(2, "0")} · ${escape(scene.chapter)} · ${scene.presenterId}. kişi · ${scene.depth === "extension" ? "Ek açıklama" : "Ana rota"}</span><h2>${escape(scene.title)}</h2><p class="scene-meta">Kısa ${duration(scene.seconds.core)} · Tam ${duration(scene.seconds.full)} · ${scene.stages.length} aşama <a href="#contents">İçindekilere dön ↑</a></p></header>
      <section class="stage-list"><h3>Aşama sırası</h3><ol>${scene.stages.map((stage) => `<li>${escape(stage)}</li>`).join("")}</ol></section>
      ${notes}
    </section>`;
    })
    .join("\n");
  const [fonts, manropeLicense, spaceLicense] = await Promise.all([
    embeddedFonts(),
    readFile(resolve(root, "node_modules/@fontsource/manrope/LICENSE"), "utf8"),
    readFile(
      resolve(root, "node_modules/@fontsource/space-grotesk/LICENSE"),
      "utf8",
    ),
  ]);
  const html = `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Operating System Concepts 10. baskı Bölüm 11 için çevrimdışı sunum ve konuşmacı notları"><title>Bölüm 11 · Sunum notları</title><style>
${fonts}
:root{color-scheme:light;--paper:#f8f9fc;--ink:#111827;--blue:#2247eb;--line:#d5dbe4}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font-family:Manrope,Arial,sans-serif;font-size:15px;line-height:1.7}a{color:var(--blue);text-underline-offset:.2em}button{font:inherit;cursor:pointer}button:focus-visible,a:focus-visible,summary:focus-visible{outline:3px solid var(--blue);outline-offset:4px}[hidden]{display:none!important}.page{width:min(100% - 40px,1000px);margin:0 auto}.cover{padding:64px 0 30px}.eyebrow{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#475569}h1,h2,h3{font-family:'Space Grotesk',Manrope,Arial,sans-serif;line-height:1.25;letter-spacing:-.025em}h1{max-width:800px;font-size:clamp(32px,6vw,56px);margin:16px 0}h2{font-size:30px;margin:12px 0 18px}h3{font-size:19px;margin:0 0 10px}p{margin:0 0 14px}strong{font-weight:600}.lead{max-width:800px;font-size:18px;color:#334155}.source-note{padding:18px 22px;background:#e8edff;border-left:4px solid var(--blue);border-radius:0 14px 14px 0;font-size:13px}.toolbar{position:sticky;top:0;z-index:10;background:rgba(248,249,252,.98);border-block:1px solid var(--line);padding:14px 0;margin:18px 0 30px}.toolbar-inner{display:flex;flex-wrap:wrap;gap:10px;align-items:center}.toolbar button{min-height:42px;border:1px solid var(--line);border-radius:10px;padding:8px 15px;background:white;color:var(--ink);font-weight:600;font-size:13px}.toolbar button[aria-pressed=true],.toolbar .print-button{background:var(--blue);color:white;border-color:var(--blue)}#route-summary{margin:0 0 0 auto;font-size:12px;color:#475569}.toc{padding:0 0 40px}.table-wrap{overflow-x:auto}table{width:100%;border-collapse:collapse;background:white;font-size:13px}caption{text-align:left;margin-bottom:12px;color:#475569}th,td{text-align:left;vertical-align:top;padding:12px;border-bottom:1px solid var(--line)}th{font-weight:600;background:#edf0f6}td:first-child{font-family:'Space Grotesk',sans-serif;color:var(--blue);font-weight:600}td small{display:block;color:#64748b;font-size:10px;margin-top:3px}td:last-child{white-space:nowrap}.scene-sheet{background:white;border:1px solid var(--line);border-radius:22px;padding:32px 40px;margin:0 0 28px;scroll-margin-top:95px}.scene-header{border-bottom:2px solid var(--ink);padding-bottom:14px;margin-bottom:24px}.scene-meta{display:flex;flex-wrap:wrap;gap:12px;font-size:12px;color:#475569;margin:0}.scene-meta a{margin-left:auto}.stage-list{background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:18px 22px;margin-bottom:28px}.stage-list ol{columns:2;column-gap:32px;font-size:13px;margin:0;padding-left:22px}.stage-list li{break-inside:avoid;margin-bottom:5px}.menu-notes>h2,.menu-notes>.eyebrow,.menu-notes>p[role=status],.menu-notes>small:last-child{display:none}.menu-notes section{margin:0 0 25px}.menu-notes p,.menu-notes li{font-size:14px}.menu-notes ol,.menu-notes ul{padding-left:24px;margin:0}.menu-notes li{padding-left:4px;margin-bottom:10px}.menu-notes small{font-size:11px;color:#64748b}.note-question{border-left:3px solid var(--blue);background:#f0f3ff;padding:15px 20px;border-radius:0 12px 12px 0}.note-question p:last-child{margin-bottom:0}.footer{padding:8px 0 50px;font-size:12px;color:#475569}.licenses{font-size:11px;margin-top:30px}.licenses pre{white-space:pre-wrap;font:10px/1.5 monospace;background:white;padding:18px;border:1px solid var(--line)}
@media(max-width:650px){.page{width:min(100% - 24px,1000px)}.cover{padding-top:35px}.scene-sheet{padding:22px 18px}.stage-list ol{columns:1}.toolbar-inner{gap:7px}#route-summary{flex-basis:100%;margin-left:0}th,td{padding:8px}table{font-size:11px}.scene-meta a{margin-left:0}h2{font-size:25px}}
@page{size:A4;margin:16mm 14mm 17mm}@media print{html{scroll-behavior:auto}body{background:white;font-size:10pt;line-height:1.5;print-color-adjust:exact;-webkit-print-color-adjust:exact}.page{width:100%;margin:0}.cover{padding:0 0 10mm}h1{font-size:29pt}h2{font-size:20pt}h3{font-size:12pt;break-after:avoid}p,li{orphans:3;widows:3}.lead{font-size:12pt}.toolbar,.scene-meta a{display:none}.source-note{font-size:9pt;padding:4mm 5mm}.toc{padding-bottom:0;break-after:page}.toc h2{break-after:avoid}table{font-size:8.5pt}thead{display:table-header-group}tr{break-inside:avoid}th,td{padding:2.5mm}td small{font-size:7pt}.scene-sheet{border:0;border-radius:0;padding:0;margin:0;break-before:page}.scene-header{padding-bottom:3mm;margin-bottom:5mm;break-inside:avoid;break-after:avoid}.scene-meta{font-size:8pt}.stage-list{padding:3mm 4mm;margin-bottom:6mm;break-inside:avoid}.stage-list ol{font-size:8.5pt}.menu-notes section{margin-bottom:5mm}.menu-notes p,.menu-notes li{font-size:9.5pt}.menu-notes li{margin-bottom:2.5mm}.menu-notes small{font-size:8pt}.note-question{padding:3mm 4mm}.footer{padding-top:8mm;font-size:8pt}.licenses{break-before:page}.licenses pre{font-size:6.5pt;border:0;padding:0}a{color:inherit}}
</style></head><body>
<header class="page cover"><span class="eyebrow">${escape(textbook.title)} · ${escape(textbook.edition)}</span><h1>Bölüm 11<br>Sunum ve konuşmacı notları</h1><p class="lead">Dört sunucu için kaynaklar, sahne aşamaları, anlatım akışı, kavram soruları ve model sınırları.</p><p>${escape(textbook.authors)}</p><p class="source-note">${escape(textbook.verification)} Bu belgenin metni ve fontları dosyanın içindedir; notları okumak veya yazdırmak için bağlantı gerekmez. Resmî kaynak bağlantıları tıklandığında internet gerekebilir.</p></header>
<div class="toolbar"><div class="page toolbar-inner"><button type="button" data-mode="full" aria-pressed="true">Bütün sahneler</button><button type="button" data-mode="core" aria-pressed="false">Yalnız ana rota</button><button type="button" class="print-button" id="print-notes">Yazdır / PDF olarak kaydet</button><p id="route-summary" role="status">${totals.full.count} sahne · ${totals.full.stages} aşama · ${duration(totals.full.seconds)} hedef</p></div></div>
<main class="page"><nav class="toc" id="contents" aria-label="Notların içindekileri"><h2>İçindekiler</h2><div class="table-wrap"><table><caption>Sıra numaraları tam rotaya aittir. Süreler kısa / tam rota prova hedefidir.</caption><thead><tr><th>No</th><th>Sahne</th><th>Bölüm / sunucu</th><th>Derinlik</th><th>Süre</th></tr></thead><tbody>${rows}</tbody></table></div></nav>
${articles}
</main><footer class="page footer"><p>Bu notlar uygulamanın güncel sahne dizini, kaynak eşlemesi ve gerçek NotesPanel bileşeninden oluşturuldu. Süreler ölçülmüş gerçek sunum süresi değil, prova hedefidir. Aşama adları eğitim durumlarını anlatır; gerçek aygıtta işlem veya geri alma yapılmaz.</p><p>Kaynak: <a href="${escape(textbook.slidesUrl)}">OSC10 Chapter 11 resmî slaytları</a>. Bu dosya kitap veya slayt görsellerinin kopyalarını içermez.</p><details class="licenses"><summary>Yerel fontlar ve lisansları</summary><h3>Manrope</h3><pre>${escape(manropeLicense)}</pre><h3>Space Grotesk</h3><pre>${escape(spaceLicense)}</pre></details></footer>
<script>
const totals=${JSON.stringify(totals)};
function setMode(mode){document.querySelectorAll('[data-depth="extension"]').forEach(node=>{node.hidden=mode==='core'});document.querySelectorAll('[data-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mode===mode)));const value=totals[mode];document.getElementById('route-summary').textContent=value.count+' sahne · '+value.stages+' aşama · '+Math.floor(value.seconds/60)+':'+String(value.seconds%60).padStart(2,'0')+' hedef'}
document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.mode)));
document.getElementById('print-notes').addEventListener('click',async()=>{if(document.fonts)await document.fonts.ready;window.print()});
</script></body></html>`;
  assert.equal(
    (html.match(/class="scene-sheet"/g) ?? []).length,
    scenes.length,
  );
  assert.equal((html.match(/class="menu-notes"/g) ?? []).length, scenes.length);
  assert.ok(
    !html.includes('<link rel="stylesheet"'),
    "Notlar dış CSS yüklememeli.",
  );
  generatedHTML = html;
  generatedSceneCount = scenes.length;
  generatedStageCount = totals.full.stages;
} finally {
  await server.close();
}
// Finish the SSR lifecycle before changing public files; Vite must not watch its output.
assert.equal(typeof generatedHTML, "string");
await mkdir(resolve(root, "public/references"), { recursive: true });
await writeFile(`${output}.tmp`, generatedHTML, "utf8");
await rename(`${output}.tmp`, output);
const guideOutput = resolve(
  root,
  "public/references/donanim-gorsel-rehberi.html",
);
await writeFile(`${guideOutput}.tmp`, generatedHardwareGuide, "utf8");
await rename(`${guideOutput}.tmp`, guideOutput);
console.log(`Görsel parça rehberi üretildi: ${guideOutput}`);
console.log(
  `Notlar üretildi: ${output} · ${generatedSceneCount} sahne · ${generatedStageCount} aşama · ${Math.ceil(Buffer.byteLength(generatedHTML) / 1024)} KiB; fontlar ve içerik gömülü.`,
);
