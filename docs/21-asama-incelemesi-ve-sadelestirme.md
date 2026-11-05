# 21 — Bütün aşamaların incelemesi ve sadeleştirme

5 Kasım 2026. Üç paralel ajan bölüm içeriklerini, ana ajan ortak arayüzü, açılışı ve alıştırmaları inceledi. Değişiklikler aynı çalışma alanında birleştirildi; ortak arayüz ve alıştırmalar ayrıca ikinci bir ajan tarafından gözden geçirildi.

## Kapsam ve kaynak

| Bölüm | Sahne | Aşama | Karşılaştırma kaynağı |
| --- | ---: | ---: | --- |
| Açılış ve harita | 2 | 7 | Resmî slayt 2–3 |
| 11.1 · Donanım | 13 | 55 | Resmî slayt 4–16 |
| 11.2–11.3 · Zamanlama ve NVM | 8 | 59 | Resmî slayt 17–26; flash için 9–11 |
| 11.4–11.6 · Doğruluk, aygıt yönetimi ve swap | 9 | 45 | Resmî slayt 27–31 |
| 11.7–11.8 · Bağlantı, RAID, bütünlük, havuz ve nesne | 16 | 89 | Resmî slayt 32–46; RAID şekilleri 40–41 |
| Kapanış ve altı alıştırma | 8 | 25 | Bölüm kavramları ve yerel Exercises PDF'si |
| **Toplam** | **56** | **280** | |

[10. baskının resmî Chapter 11 slaytları](https://os-book.com/OS10/slide-dir/PPTX-dir/ch11.pptx) yeniden indirildi; 47 slaydın metni kullanıldı. RAID düzeyleri ve iç içe RAID için özgün 40–41. slayt görselleri de incelendi. Bölüm sınırları [resmî içindekilerle](https://os-book.com/OS10/toc-dir/toc.pdf) karşılaştırıldı. Altı alıştırmanın soruları [yerel PDF'nin](../public/references/ch11-exercises.pdf) 1–3. sayfalarıyla karşılaştırıldı.

Tam kitap metni depoda yoktur. Bu inceleme, kitabın her sayfasının doğrulandığı veya özgün eğitim modellerinin kitap şekilleri olduğu anlamına gelmez. Kaynak slaytlardaki SCAN 208 ifadesiyle fiziksel uca giden 236 yolu arasındaki fark açıklamalarda korunur; sessizce kaynak düzeltilmez.

## Yapılan değişiklikler

- **N notları:** 280 aşamanın her biri için gösterilecek öğeyi, söylenecek açıklamayı ve gerekçeyi anlatan ayrı not var. Panel önce geçerli aşamanın notunu gösterir. Bütün anlatım, model sınırları ve kaynaklar açılır bölümlerde kalır. Tekrarlanan Enter/Backspace yönergeleri azaltıldı. Çevrimdışı notlarda bütün bölümler açık üretilir.
- **Ortak arayüz:** Sol alttaki Enter/Backspace ibaresi kaldırıldı; klavye işlevleri korundu. Sahne geçişleri sırayla çizilir; eski ve yeni sahnenin diyagramları aynı anda görünmez. Aşama başlıkları üst üste çapraz solmaz. Etkin grafik kartının boyutunu değiştiren büyütme kaldırıldı; kart yazıları için satır kırma düzenlendi.
- **Donanım ve zamanlama:** Komut/DMA yolu beş kartlık uzun sıradan iki satıra alındı. NVM görevlerini tekrarlayan rozetler kaldırıldı. Kafa yolu grafiğinde işaretle sayısal etiket arasındaki mesafe artırıldı. Flash GC'de birlikte taşınan L2 ve L3 birlikte vurgulanır. Açıklamanın sabit yüksekliği kaldırıldı. Bitişik sayı/sözcükler düzeltildi.
- **Doğruluk ve yönetim:** Bölüm kartlarında yüzde genişliklere eklenen boşluğun taşması giderildi. Remap'teki odak dışı 17 adres kutusu kaldırıldı. Boot'un ikinci büyük diyagramı kısa yükleme yoluna dönüştürüldü. Bit kutuları esnek genişlik kullanır; seçenekler satıra yayılabilir. Bağlama aşamasında dosya sistemi tutarlılık denetimi açıklanır.
- **Swap:** Sayfa yolculuğu iki sabit kart ve ayrı yazma/okuma bağlantılarıyla gösterilir. Okuma için ayrılan RAM hedefi, tamamlanmış veri gibi sunulmaz; dönüş sonunda boşalan swap slot'u dolu görünmez. Bu slot bırakma politikası model tercihi olarak notlarda açıklanır.
- **Bağlantı ve RAID:** SAN'da ayrı LUN kartları dizi içine alınarak yedi düğüm beşe indirildi. Çapraz iletişim çizgileri iki amaç kartıyla değiştirildi. Dizi hizmetleri üç açıklayıcı karta indirildi. Gereksiz kenar etiketleri ve dipnotlar kaldırıldı. MTTR, ortalama onarım süresi olarak tanımlandı.
- **Alıştırmalar:** Ekranda kısa gerekçe ve hesap görseli birlikte kalır; tam açıklama N notlarındadır. HDD/NVM iş yükü ayrımı ve MTBF'nin bağımsız/sabit arıza hızı varsayımı görünür açıklamada korunur.

Sahne kimlikleri, 280 aşama, 50 sahnelik ana rota, 56 sahnelik tam rota ve prova süreleri korundu. Sözleşmede yalnız okunurluğu düzeltilen aşama adları ve kaynak açıklamaları güncellendi.

## Doğrulama

- `pnpm test`: 75 test geçti. HDD hareketi, flash sayaçları, parite/ECC, swap, RAID, gezinme ve sabit kart çakışması denetlenir.
- `pnpm check:content`: 56 sahnenin bütün 280 aşaması, hareket açık/kapalı ve ileri/geri sırada Node/SSR ile üretildi. Aşama başına doğru not, 36 eski bağlantı, kaynaklar, medya, rota ve süreler doğrulandı.
- Aynı denetim, 68 React Flow çıktısında SVG bağlantılarının başka kartların içinden geçmediğini doğrular. Sabit yerleşimde kesişen kartlar açık hata üretir. Bu kontrol kart metninin gerçek tarayıcıdaki ölçümünü kapsamaz.
- `pnpm build`: TypeScript denetimi, çevrimdışı not üretimi ve Vite üretim derlemesi geçti. Vite'ın 500 kB üzerindeki JavaScript parçası uyarısı sürer; bu incelemede yükleme mimarisi değiştirilmedi.
- Yerel geliştirme sunucusu `http://localhost:5173/` üzerinden HTTP 200 döndürür.

Depodaki tarayıcı otomasyonu ve ekran görüntüsü kullanmama yönergesi korundu. Gerçek tarayıcı, odak sırası ve projeksiyon görünümü test edilmedi; yukarıdaki sonuçlar kaynak, model, statik çıktı, geometri ve HTTP kontrollerine dayanır.
