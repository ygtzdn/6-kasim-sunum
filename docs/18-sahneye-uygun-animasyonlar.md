# 18 — Sahneye uygun animasyonlar ve proje incelemesi

**5 Kasım 2026.** İnceleme, [14 numaralı güncel mimari](14-kitaba-dayali-yeni-sunum-mimarisi.md), makine okunabilir sahne sözleşmesi, prova rehberleri, ortak sunum kabuğu, bölüm bileşenleri, hesap/durum modelleri ve testler üzerinden yapıldı. Proje, Operating System Concepts 10. baskının 11.1–11.8 kapsamını dört sunucuyla anlatan, yerel varlıklarla çalışan bir istemci uygulamasıdır. 50 sahne, 268 aşama, iki rota, kaynaklar ve açık tasarım dili korunur.

## Temel bulgu

Önceki `StageVisual`, aşama numarasını React anahtarı olarak kullanıyordu. Her Enter/Backspace bütün görsel alt ağacını yeniden oluşturuyor, eski ve yeni görünümü aynı yukarı kayma/solma efektiyle üst üste getiriyordu. Bu sırada React Flow yeniden kuruluyor, `initial={false}` kullanan disk kafası ve grafikler önceki değerlerini kaybediyordu. Yerel hareket tanımları olsa da bu hareketler önceki konumdan başlayamıyordu.

Görsel alan artık kalıcıdır. Aşama değişikliği mevcut bileşenlerin konum, renk, yol uzunluğu ve sayısal boyutlarını günceller. Yeni bir soru veya açıklama parçası gerektiğinde yalnız o öğe girer. Sahne değişimindeki çıkış katmanı, inert/erişilebilirlik koruması ve başlık odağı sürer.

## Hareket kararları

Sahne profilleri `src/presentation/motion-presets.mjs` içinde anlamlı kimliklere bağlıdır. Her sahnenin tam bir eşlemesi vardır; profil seçimi sahne numarasına veya rastgele sıraya dayanmaz.

| Anlatım | Sahne geçişi | Aşama içindeki davranış |
| --- | --- | --- |
| Açılış | Hafif yaklaşma, 480 ms | Yalnız değişen başlangıç açıklaması yenilenir |
| Fiziksel yapı ve odak | Kısa dikey giriş, 340 ms | Fotoğrafın sabit parça etiketleri aşama gruplarıyla açılır, seçili blok/bit vurgusu değişir |
| Karşılaştırma | Hafif ölçek, 340 ms | Sütun ve aşınma grafikleri değerlerine büyür; mevcut karşılaştırma yerinde kalır |
| FCFS / SCAN / C-SCAN | Konum/ölçek değiştirmeyen solma, 220 ms | Kafa ve yeni yol parçası aynı 460 ms süresini izler; C-SCAN dönüşünün kesikli gösterimi korunur |
| Akış ve topoloji | İleri/geri yönüne bağlı yatay giriş, 340 ms | Düğümler yerinde renk değiştirir, aktif düğüm hafif büyür; bağlantı vurgusu geçiş yapar |
| Hesap sonucu ve öğrenme kontrolü | Kısa üstten giriş, 340 ms | Soru değişiminde odaklı giriş, cevap açılınca yalnız gerekçe alanının açılması |

Ek ayrıntılar:

- Erişim maliyetinin halkaları oranlarına çizilir. İstek boyutu ve aktarım hızı değişirken sütunlar hesaplanan yüksekliklerine geçer.
- Flash sayfaları ve FTL, aynı nesne kimlikleriyle güncellenir. GC ve sayaçlar yine seçilen manuel aşamadan hesaplanır.
- Parite/ECC sahnelerinde değişen bit kısa bir ölçek vurgusu alır. Bu hareket veri modeline yeni bir durum eklemez.
- RAID arızasında disk/hücre renkleri değişir; yeniden kurulan hücrenin etiketi kendi alanında belirir. Diğer diskler yeniden girmez.
- Teyp konum göstergesi yerleşim üzerinden hedef konuma gider. RAM, LBA, havuz ve iç içe RAID hücreleri yerinde renk değiştirir.
- Açıklama metni 200 ms, değişen başlık 180 ms geçiş kullanır. Metin geçişi bütün diyagramı taşımaya gerek bırakmaz.
- Yol haritasındaki aktif bölüm yükselerek vurgulanır. Hareket kapalıyken hover hareketi de devre dışıdır.

Space, menü, görünmez sekme ve sistemin azaltılmış hareket tercihi mevcut ortak `enabled` değerini kullanır. Yeni hareketlerde kapalı durum süreyi sıfırlar ve görünümü son konumuna getirir. Aşamaları ilerleten zamanlayıcı, otomatik RAID/flash/swap işlemi veya yeni dış bağımlılık eklenmedi. Hareketi kapatma, başlamış bir kısa Motion çıkışının her karesini dondurma garantisi değildir.

## Doğrulama

| Kontrol | Sonuç |
| --- | --- |
| Model, klavye, gezinme ve hareket profilleri | `pnpm test`: 74/74 başarılı |
| Bütün sahneler | `pnpm check:content`: 50 sahne / 268 aşama, hareket açık/kapalı ve ileri/ters üretim başarılı |
| Sözleşme | 44 ana rota sahnesi, 36 eski bağlantı, kaynak/not/medya ve 2660 / 4600 saniyelik rota hedefleri geçerli |
| TypeScript ve üretim | `pnpm build` başarılı, çevrimdışı notlar üretildi |
| Yerel HTTP | 66 uygulama modülü/varlık ve 23 kütüphane isteği HTTP 200; Vite'ın güncel kaynakları dönüştürdüğü kontrol edildi |
| Biçim ve fark | Prettier ve `git diff --check` başarılı |

Yeni dört test; her sahnenin tek profile bağlanmasını, çizgi grafiği koordinatlarının sahne girişinde sabit kalmasını, ileri/geri yönünü ve hareket kapalıyken bütün profillerin anında okunur konuma gelmesini kapsar. İçerik denetimi gerçek sahne çerçevesindeki profil eşlemesini ve tek görsel alanı da denetler.

Vite'ın büyük parça uyarısı sürer: üretim JS'i yaklaşık 959 kB, gzip 297 kB. Bu çalışma yeni bir çalışma zamanı kütüphanesi eklemez. Tüm sahneleri önceden hazır tutan mevcut paketleme yapısı değiştirilmedi.

Depodaki kullanıcı kuralına uygun olarak **tarayıcı otomasyonu ve ekran görüntüsü kullanılmadı**. Node/SSR, model, tip, derleme ve HTTP kontrolleri; gerçek ekranda akıcılık, piksel taşması veya projeksiyon okuması testi olarak sunulmaz. Haricî dağıtım yapılmadı.

Teknik dayanaklar: [Motion animasyon ve SVG değer güncellemeleri](https://motion.dev/docs/react-animation), [AnimatePresence ve değişen React anahtarlarının yaşam döngüsü](https://motion.dev/docs/react-animate-presence).
