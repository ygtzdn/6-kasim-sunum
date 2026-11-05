import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { hardwareGuideHTML } from "./hardware-guide.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
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

const server = await createServer({
  root,
  server: { middlewareMode: true, hmr: false, watch: null },
  appType: "custom",
  logLevel: "error",
});
let notesHTML;
let guideHTML;
let sceneCount;
try {
  const { scenes } = await server.ssrLoadModule(
    "/src/presentation/registry.ts",
  );
  const { default: NotesPanel } = await server.ssrLoadModule(
    "/src/presentation/NotesPanel.tsx",
  );
  const { default: SceneSources } = await server.ssrLoadModule(
    "/src/presentation/SceneSources.tsx",
  );
  const { textbook } = await server.ssrLoadModule(
    "/src/presentation/textbook.ts",
  );
  const hardwareComponents = await server.ssrLoadModule(
    "/src/chapters/chapter-11-1/components/HardwarePhoto.tsx",
  );
  const [fonts, manropeLicense, spaceLicense] = await Promise.all([
    embeddedFonts(),
    readFile(resolve(root, "node_modules/@fontsource/manrope/LICENSE"), "utf8"),
    readFile(
      resolve(root, "node_modules/@fontsource/space-grotesk/LICENSE"),
      "utf8",
    ),
  ]);
  const totals = {
    core: scenes.filter((scene) => scene.depth !== "extension").length,
    full: scenes.length,
  };
  const extraAttributes = (scene) =>
    `data-depth="${scene.depth}"${scene.depth === "extension" ? " hidden" : ""}`;
  const contents = scenes
    .map(
      (scene) =>
        `<li ${extraAttributes(scene)}><a href="#scene-${escape(scene.id)}">${escape(scene.title)}</a><span>${escape(scene.chapter)}</span></li>`,
    )
    .join("\n");
  const articles = scenes
    .map(
      (
        scene,
      ) => `<section class="scene-sheet" id="scene-${escape(scene.id)}" ${extraAttributes(scene)}>
    ${renderToStaticMarkup(createElement(NotesPanel, { scene }))}
    <a class="source-link" href="#source-${escape(scene.id)}">Kaynak</a>
  </section>`,
    )
    .join("\n");
  const sources = scenes
    .map(
      (scene) =>
        `<div id="source-${escape(scene.id)}" ${extraAttributes(scene)}>${renderToStaticMarkup(createElement(SceneSources, { scene }))}</div>`,
    )
    .join("\n");
  notesHTML = `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Bölüm 11 · Sayfa açıklamaları</title><style>
${fonts}
:root{color-scheme:light;--ink:#111827;--blue:#2247eb}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#f8f9fc;color:var(--ink);font:16px/1.8 Manrope,Arial,sans-serif}a{color:var(--blue);text-underline-offset:.2em}button{font:inherit;cursor:pointer}a:focus-visible,button:focus-visible,summary:focus-visible{outline:3px solid var(--blue);outline-offset:4px}[hidden]{display:none!important}.page{width:min(100% - 40px,1000px);margin:auto}.cover{padding:56px 0 24px}h1,h2{font-family:'Space Grotesk',Manrope,Arial,sans-serif;line-height:1.2;letter-spacing:-.025em}h1{font-size:clamp(32px,6vw,56px);margin:12px 0 20px}h2{font-size:27px;margin:12px 0 18px}.eyebrow{font-size:12px;color:#475569}.toolbar{position:sticky;top:0;background:#f8f9fc;border-block:1px solid #cbd5e1;padding:12px 0;margin-bottom:28px;z-index:1}.toolbar .page{display:flex;flex-wrap:wrap;align-items:center;gap:10px}.toolbar button{padding:8px 14px;background:white;border:1px solid #cbd5e1;border-radius:8px}.toolbar button[aria-pressed=true]{background:var(--blue);color:white;border-color:var(--blue)}#route-summary{margin-left:auto;font-size:13px}.toc{list-style:none;padding:0 0 32px}.toc li{display:flex;justify-content:space-between;gap:20px;padding:8px 0;border-bottom:1px solid #e2e8f0}.toc span{font-size:12px;color:#64748b;white-space:nowrap}.scene-sheet{background:white;border:1px solid #d5dbe4;border-radius:16px;padding:28px 36px;margin-bottom:20px;scroll-margin-top:90px}.menu-notes p{margin:0}.source-link{display:inline-block;margin-top:18px;font-size:12px}.sources{padding:36px 0}.sources>div{scroll-margin-top:90px}.scene-sources{padding:20px 0;border-top:1px solid #cbd5e1;font-size:13px}.scene-sources h2{font-size:20px}.scene-sources p{margin:10px 0}.licenses{padding:24px 0;font-size:12px}.licenses pre{white-space:pre-wrap;font:10px/1.5 monospace}footer{padding-bottom:40px;font-size:12px;color:#475569}
@media(max-width:650px){.scene-sheet{padding:20px}.toc li{display:block}.toc span{display:block}#route-summary{width:100%;margin:0}h2{font-size:23px}}
@page{size:A4;margin:16mm}@media print{html{scroll-behavior:auto}body{background:white;font-size:11pt;line-height:1.6}.page{width:100%}.toolbar,.source-link{display:none}.cover{padding-top:0}h1{font-size:30pt}h2{font-size:18pt}.toc{break-after:page}.scene-sheet{border:0;border-radius:0;padding:8mm 0;margin:0;border-bottom:1px solid #cbd5e1;break-inside:avoid}.sources{break-before:page}.scene-sources{break-inside:avoid}h2{break-after:avoid}.licenses{break-before:page}a{color:inherit}}
</style></head><body><header class="page cover"><span class="eyebrow">${escape(textbook.title)} · ${escape(textbook.edition)}</span><h1>Bölüm 11<br>Sayfa açıklamaları</h1><p>Her sayfanın konusunu açıklayan notlar. Kitap ve model dayanakları ayrı kaynak bölümündedir.</p></header>
<div class="toolbar"><div class="page"><button data-mode="core" aria-pressed="true">Ana akış</button><button data-mode="full" aria-pressed="false">Tüm içerik</button><button id="print-notes">Yazdır / PDF olarak kaydet</button><span id="route-summary">${totals.core} sayfa</span></div></div>
<main class="page"><nav aria-label="Notların içindekileri"><h2>İçindekiler</h2><ol class="toc">${contents}</ol></nav>${articles}<section class="sources"><h2>Kaynaklar</h2><p>${escape(textbook.verification)}</p>${sources}<p>Fotoğraf atıfları: Evan-Amos / AGreuet ve An-d / AGreuet · CC BY-SA 3.0. SSD fotoğrafları: MatteX · CC0. Ayrıntılar <a href="donanim-gorsel-rehberi.html">donanım görsel rehberindedir</a>.</p></section></main>
<footer class="page">Bu belge sunumun güncel sayfa açıklamalarından oluşturulur. Metin ve fontlar dosyaya gömülüdür.<details class="licenses"><summary>Font lisansları</summary><h2>Manrope</h2><pre>${escape(manropeLicense)}</pre><h2>Space Grotesk</h2><pre>${escape(spaceLicense)}</pre></details></footer>
<script>
const totals=${JSON.stringify(totals)};
function setMode(mode){document.querySelectorAll('[data-depth="extension"]').forEach(node=>{node.hidden=mode==='core'});document.querySelectorAll('[data-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mode===mode)));document.getElementById('route-summary').textContent=totals[mode]+' sayfa'}
document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.mode)));
document.getElementById('print-notes').addEventListener('click',async()=>{if(document.fonts)await document.fonts.ready;window.print()});
</script></body></html>`;
  guideHTML = await hardwareGuideHTML(hardwareComponents);
  sceneCount = scenes.length;
} finally {
  await server.close();
}
await mkdir(resolve(root, "public/references"), { recursive: true });
for (const [name, html] of [
  ["sunum-notlari.html", notesHTML],
  ["donanim-gorsel-rehberi.html", guideHTML],
]) {
  const output = resolve(root, "public/references", name);
  await writeFile(`${output}.tmp`, html, "utf8");
  await rename(`${output}.tmp`, output);
}
console.log(
  `${sceneCount} sayfanın açıklaması ve donanım görsel rehberi üretildi.`,
);
