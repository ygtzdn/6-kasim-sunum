import { readFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { hardwarePhotos } from "../src/chapters/chapter-11-1/hardware-parts.mjs";

// The guide uses the same targets, names and rendering as the slides.
export async function hardwareGuideHTML({
  HardwarePhoto,
  HardwarePartsLegend,
}) {
  const css = await readFile(
    new URL("../src/chapters/chapter-11-1/hardware-photo.css", import.meta.url),
    "utf8",
  );
  const sections = [
    {
      device: "hdd",
      title: "HDD: iki farklı mekanik hareket",
      intro:
        "Veri plaka üzerinde tutulur. Mil plakayı döndürürken kol, kafa ucunu hedef yarıçapa götürür.",
      explanation:
        "Seek, kafanın hedef ize konumlanmasıdır. Dönme beklemesi ise istenen sektörün kafa altına gelmesidir. Bu iki maliyet farklıdır.",
      limit:
        "Kafa ucu fotoğrafta park alanındadır. Okuma/yazma elemanı bu ölçekte ayrı seçilemez. İz ve sektör çizgileri fotoğrafta görünmez; sonraki geometri slaydı bunları kavramsal olarak gösterir.",
      flow: [
        "Seek · kolun konumu",
        "Dönme · sektörün konumu",
        "Aktarım · veri hareketi",
      ],
    },
    {
      device: "ssd-board",
      title: "SSD: yönetim, kalıcı bellek ve bağlantı",
      intro:
        "Denetleyici işlemleri yönetir. NAND flash yongaları veriyi tutar. Bağlantı ucu, aygıtı bilgisayara bağlar.",
      explanation:
        "SSD'de mekanik seek ve dönme yoktur. Buna rağmen komut iletimi, veri aktarımı ve flash yönetimi işleri devam eder.",
      limit:
        "Fotoğraf belirli bir SATA SSD örneğidir. Her SSD aynı kart düzenini veya bağlantıyı kullanmaz. NAND işareti bütün yongaları sınıflandırmak yerine bir bellek yongasını örnek gösterir.",
      flow: [
        "SATA · komut ve veri",
        "Denetleyici · yönetim",
        "NAND · kalıcı kayıt",
      ],
    },
  ]
    .map(({ device, title, intro, explanation, limit, flow }, index) => {
      const visibleParts = hardwarePhotos[device].parts.map((part) => part.id);
      const visual = renderToStaticMarkup(
        createElement(
          "div",
          { className: "guide-layout" },
          createElement(HardwarePhoto, { device, visibleParts }),
          createElement(HardwarePartsLegend, { device, visibleParts }),
        ),
      ).replaceAll('href="/media/', 'href="../media/');
      return `<section class="guide-sheet" id="${device}"><header><span class="eyebrow">${index + 1} / 2 · Aygıtı tanı</span><h2>${title}</h2><p class="lead">${intro}</p></header>${visual}<ol class="function-flow">${flow.map((item) => `<li>${item}</li>`).join("")}</ol><p class="explanation">${explanation}</p><p class="limit">${limit}</p><p class="source">Fotoğraf: <a href="${hardwarePhotos[device].source}">${hardwarePhotos[device].credit}</a>. Kavramlar: Operating System Concepts, 10. baskı, Bölüm 11.1.</p></section>`;
    })
    .join("\n");
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HDD ve SSD · Görsel parça rehberi</title><style>
${css}
*{box-sizing:border-box}body{margin:0;background:#f8f9fc;color:#111827;font:16px/1.6 Manrope,Arial,sans-serif}main{width:min(1200px,100% - 48px);margin:auto}.guide-cover{padding:48px 0 20px}.eyebrow{color:#2247eb;text-transform:uppercase;font-size:11px;font-weight:700;letter-spacing:.12em}h1,h2{font-family:'Space Grotesk',Arial,sans-serif;line-height:1.15;letter-spacing:-.035em}h1{font-size:clamp(32px,5vw,56px);margin:12px 0}h2{font-size:clamp(26px,3vw,38px);margin:12px 0}.lead{font-size:18px;max-width:900px;color:#475569}.guide-sheet{padding:36px 0 44px;border-top:2px solid #111827}.guide-layout{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);align-items:center;gap:40px;margin:28px 0}.guide-layout .hardware-photo svg{max-height:none}.hardware-parts dt{font-size:22px}.hardware-parts dd{font-size:14px}.function-flow{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;list-style:none;counter-reset:flow;padding:20px 0;margin:0;border-block:1px solid #cbd5e1}.function-flow li{counter-increment:flow;font-size:16px;font-weight:600}.function-flow li:before{content:counter(flow,decimal-leading-zero);display:block;color:#2247eb;font-size:11px;margin-bottom:6px}.explanation{font-size:18px;max-width:1000px}.limit,.source{font-size:13px;color:#475569}.source{margin-top:24px}a{color:#2247eb}footer{font-size:12px;color:#64748b;padding:0 0 32px}
@media(max-width:767px){main{width:calc(100% - 28px)}.guide-layout{grid-template-columns:1fr;gap:20px}.hardware-parts{grid-template-columns:1fr}.hardware-parts dt{font-size:19px}.hardware-parts dd{font-size:14px}.function-flow{gap:12px}.function-flow li{font-size:13px}}
@page{size:A4 landscape;margin:12mm}@media print{body{background:white;font-size:10pt}main{width:100%}.guide-cover{display:none}.guide-cover h1{font-size:24pt}.guide-cover p{font-size:10pt}.guide-sheet{break-before:page;padding:0;border:0}.guide-sheet:first-of-type{break-before:auto}.guide-layout{grid-template-columns:1.6fr 1fr;gap:8mm;margin:5mm 0}.guide-layout .hardware-photo svg{max-height:105mm}.hardware-parts{display:flex;gap:3mm}.hardware-parts dt{font-size:13pt}.hardware-parts dd{font-size:9pt}.function-flow{padding:3mm 0}.function-flow li,.lead,.explanation{font-size:11pt}.limit,.source{font-size:8pt}h2{font-size:22pt}.source{margin-top:3mm}footer{display:none}}
</style></head><body><main><header class="guide-cover"><span class="eyebrow">Operating System Concepts · 10. baskı · 11.1</span><h1>HDD ve SSD<br>Görsel parça rehberi</h1><p>Fotoğraftaki numarayı sağdaki açıklamayla eşleştir. Önce parçayı, ardından işlevini ve erişim maliyetini düşün.</p></header>${sections}<footer>Fotoğraflar bu HTML dosyasının yanındaki ../media klasöründen okunur. Yerel proje veya sunum sunucusu üzerinden çevrimdışı kullanılabilir. Tarayıcının yazdır komutuyla yatay sayfa düzeninde yazdırılabilir.</footer></main></body></html>`;
}
