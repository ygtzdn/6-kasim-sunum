# 08 — Güncel modüler sunum mimarisi

**5 Kasım 2026.** Güncel içerik sözleşmesi [14 — Yeni sunum mimarisi](14-kitaba-dayali-yeni-sunum-mimarisi.md), sunucu hazırlığı [15 — Prova rehberi](15-sunum-prova-ve-kaynak-rehberi.md) içindedir. Önceki 36 sahne sınırı kaldırılmıştır.

## İçerik yapısı

50 sahne / 268 aşama; ana rota 44 sahne / 244 aşama. Açılış ve kapanış ortak; dört sunucu sırasıyla 11.1, 11.2–11.3, 11.4–11.6 ve 11.7–11.8'i anlatır. Ek altı sahne ana kavramları değiştirmeden ayrıntılı rotaya katılır.

| Konum | Sorumluluk |
| --- | --- |
| `src/chapters/opening/` | Açılış sorusu ve dört sunucu haritası |
| `src/chapters/chapter-11-1/` | 13 donanım/ortam/adresleme sahnesi |
| `src/chapters/chapter-11-2-3/` | 8 zamanlama/NVM sahnesi ve saf hesap motorları |
| `src/chapters/chapter-11-4-6/` | 9 hata/aygıt/swap sahnesi ve durum modelleri |
| `src/chapters/chapter-11-7-8/` | 16 bağlantı/RAID/bütünlük/havuz/nesne sahnesi |
| `src/chapters/closing/` | İsteğin yolculuğu ve tasarım ölçütleri |
| `src/presentation/types.ts` | Ortak sahne, not, aşama ve rota metadata sözleşmesi |
| `src/presentation/registry.ts` | Kitap sırası ve sunucu grupları |
| `src/presentation/navigation.mjs` | Anlamlı URL, eski kimlik alias'ı ve rota sırası |
| `src/presentation/controls.mjs` | İleri/geri aşama ve klavye kararları |
| `src/presentation/usePresentation.ts` | URL, rota, aşama, hareket, menü, tam ekran |
| `src/presentation/textbook.ts` | Her sahne için baskı/bölüm/slayt/çıkarım/model ayrımı |
| `src/presentation/SideMenu.tsx` | Ana/ayrıntılı rota, bütün sahneler, aşama listesi, notlar ve kaynaklar |
| `src/presentation/NotesPanel.tsx` | Geçerli aşama ve ayrıntılı kaynaklı anlatım |
| `docs/presentation-contract.json` | Uygulama öncesi onaylanan makine okunabilir plan |
| `scripts/check-content.mjs` | Sözleşme, kaynak, rota ve tüm aşamaların Node/SSR denetimi |

## Tek ilerleme durumu

Her sahnede `stages` zorunludur. Enter/Backspace, aşama listesi, sekme ve demo kontrolleri aynı `context.stage` değerini değiştirir. Model durumu bu değerden yeniden üretilir. Bağımsız ilerleme deposu, gizli cevap hafızası veya otomatik ders adımı yoktur. Geri gitmek önceki gerçek veriyi ve diyagramı geri kurar.

Sahne kimliği konuya bağlıdır; ekrandaki numara diziden hesaplanır. Eski s01–s36 adresleri eski konuyu temsil eden yeni kimliğe yönlenir. Ana rotada ek açıklamalar oklarla atlanır; menü onları yine açabilir. Bir ek sahneye doğrudan gidildiğinde sonraki ok seçili rotaya geri katılır.

## Kaynak ve doğrulama

İçerik Operating System Concepts, Tenth Edition, Bölüm 11.1–11.8'in resmî içindekiler ve 47 slaytlık destek materyaline bağlıdır. Tam kitap metni yerel olmadığı için tam sayfa karşılaştırması iddia edilmez. Kitap kavramı, özgün Türkçe öğretim örneği ve model sınırı ayrı kaydedilir.

Testler hesap/durum/rota/klavye davranışını doğrular. Bütün sahne aşamaları hareket açık/kapalı ve ileri/ters sırada oluşturulur. Kaynaklar, süreler, eski URL'ler, notlar ve medya denetlenir. TypeScript ve üretim derlemesi ayrıca çalışır.

Kullanıcının isteğiyle uygulama tarayıcı üzerinden test edilmez; ekran görüntüsü ve tarayıcı otomasyonu kullanılmaz. Gerçek ekran/odak/projeksiyon uyumu doğrulanmış sayılmaz. React, TypeScript, Vite, Tailwind, Motion, Radix Dialog ve Lucide; yerel font ve gerçek PNG fotoğrafları kullanılır. Tasarım dili korunur; 3D/WebGL/video eklenmez.
