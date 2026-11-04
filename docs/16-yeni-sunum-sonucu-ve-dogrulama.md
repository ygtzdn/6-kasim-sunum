# 16 — Yeni sunum: sonuç ve doğrulama

**5 Kasım 2026.** Tasarım dili korunarak sahne sayısı, sıra, içerik derinliği, rota ve sunum hazırlığı yeniden kuruldu. Önce üç paralel kaynak/öğretim planı yazıldı; ardından üç paralel uygulama paketi yürütüldü. Son fazda ajanlar birbirlerinin bölümlerini ve ortak kabuğu bağımsız inceledi. Ana ajan birleşik planı, kaynak haritasını, navigasyonu, kabul betiğini ve bu sonucu hazırladı.

## 1. Son ürün

| Rota | Sahne | Aşama | Hedef süre |
| --- | ---: | ---: | --- |
| Ana anlatım | 44 | 244 | 44:20 · yaklaşık 45 dk |
| Ayrıntılı | 50 | 268 | 76:40 · yaklaşık 77 dk |

Rotalar aynı kitap sırasını ve 11.1–11.8 kapsamını kullanır. Altı ek açıklama, ayrıntılı rotada yer alır; menüden doğrudan erişilebilir. Süreler ölçülmüş sunum süresi değil, soru araları dahil prova hedefidir. Uzun tartışma/tekrar için 90 dakikalık hazırlık önerileri ayrıca bulunur.

**Etkileşim:** Enter aynı sahnede ileri, Backspace geri. İlk/son aşamada kalınır. Diyagram, sayaç, eşleme, cevap ve arıza/yeniden kurma durumu seçilen aşamadan üretilir. Sol/sağ ok seçili rotada sahne değiştirir. Sahne içi hareket URL'yi değiştirmez. Form/seçim alanları yerel klavyeyi korur. Aşama düğmeleri kullanıldıktan sonra odak başlığa döner; Enter akışı sürer. Menü açıkken hareket durur.

**Adresler:** Sıralı kimliklere bağımlılık kaldırıldı. `hdd-anatomy`, `swap-journey`, `raid-rebuild` gibi kalıcı konu adresleri kullanılır. Eski 36 bağlantı anlamına uygun yeni sahneye yönlenir. Yeni sahne eklemek önceki sahnelerin adresini değiştirmez.

**Görsel dil:** Açık zemin, mevcut fontlar, mavi/turuncu vurgu, küçük yan menü, yerel gerçek donanım fotoğrafları ve özgün HTML/SVG anlatımı korunur. Yeni framework, backend, dış API, 3D veya video eklenmedi.

## 2. Kitap akışına göre yeniden hazırlanan içerik

- **11.1:** HDD fotoğrafından görevler ve geometriye; seek/dönme/aktarım/denetleyici hesabına; istek boyutu karşılaştırmasına; NVM/flash'a; ayrı RAM disk, teyp, LBA ve veri yoluna geçilir. Tarih, performans ölçüleri ve DWPD ek sahnelerdir.
- **11.2–11.3:** Sabit kaynak kuyruğunda her hareket ayrı aşamadır. Politika seçimi yalnız yol uzunluğuna indirgenmez. NVM birleştirme/iletim/paralellik ile flash içi işleri ayırır. Ayrıntılı FTL/GC hesabı bir kez oynatılır.
- **11.4–11.6:** Parite, checksum/CRC ve genel ECC sınırı; katmanlı hazırlama; raw erişim ek sahnesi; firmware/boot; remapping; swap amacı ve tek P sayfasının dışarı/geri yolculuğu. Rezerv, bekleyen I/O ve açık tamamlanma ayrı durumlardır.
- **11.7:** Kitap sırası host-attached → NAS → bulut → storage array → SAN olarak uygulanır. iSCSI dosya protokolü gibi sunulmaz. SAN çok host/dizi/fabric ve LUN görünürlüğüyle gösterilir.
- **11.8:** Güvenilirlik ve onarım aralığı; striping/mirroring/parite; özgün gerçek XOR; çok boyutlu parite ek açıklaması; gerçek 0+1/1+0 arıza deseni; yedek/rebuild; snapshot/replication; checksum; havuz ve nesne yaşam döngüsü ayrı amaçlara bölünür.
- **Kapanış:** Kavramsal I/O yolu ile iş yükü, gecikme, hata modeli ve geri dönüş gereksinimleri birleştirilir.

## 3. Hazırlık teslimleri

- [Ana mimari, kaynak politikası ve 50 sahnenin kesin tablosu](14-kitaba-dayali-yeni-sunum-mimarisi.md)
- [Ana prova/kurtarma rehberi ve yaygın kavram yanılgıları](15-sunum-prova-ve-kaynak-rehberi.md)
- [Sunucu 1 prova kartları](sunucu-1-prova.md), [sunucu 2](sunucu-2-prova.md), [sunucu 3](sunucu-3-prova.md), [sunucu 4](sunucu-4-prova.md)
- [Donanım/zamanlama ayrıntılı planı](bolum-planlari/01-02-donanim-zamanlama.md), [yönetim planı](bolum-planlari/03-dogruluk-yonetim-swap.md), [bağlantı/RAID planı](bolum-planlari/04-baglanti-raid-kapanis.md)
- [Uygulama öncesi makine sözleşmesi](presentation-contract.json)
- [Yazdırılabilir çevrimdışı sunum notları](../public/references/sunum-notlari.html)

Prova kartları yalnız sahne başlığı listesi değildir: konuşma başlangıcı, ekrandaki nesnelerin anlamı, her aşamada neyin değiştiği, soru/cevap, kavram yanılgısı, süre ve sunucu devir cümlesi içerir. Gerçek süre, sınıf ve projeksiyon provası tamamlandı olarak işaretlenmedi.

Not HTML'i gerçek `NotesPanel` ve güncel sahne dizininden üretilir. 50 sahne, 268 aşama listesi, kaynak ve konuşmacı notları içerir. Ana/tam filtre, içindekiler ve yazdırma kontrolü vardır. Sekiz yerel WOFF2 ve lisansları gömülüdür; okuma/yazdırma için dış CSS, font, resim veya script yüklemez. Resmî kaynak bağlantıları açılırsa internet gerekir. `pnpm build:notes` veya normal üretim derlemesi yeniden üretir.

## 4. Giderilen somut akış ve model sorunları

| Sorun | Son davranış |
| --- | --- |
| Bazı sahnelerde Enter düğme araması ilerleme bulamıyordu | Tüm sahnelerde zorunlu aşama ve tek `context.stage`; DOM tıklama yedeği yok |
| Yerel sayaç, cevap veya ortak RAID deposu geri aşamayı boşa düşürüyordu | Saf yeniden üretim; aynı aşama aynı model ve görünüm |
| Swap yazması süreyle kendi kendine tamamlanıyordu | Rezerv/pending/commit ayrı manuel aşamalar; RAM kopyası korunur |
| Yoğun sahnelerde birden çok kavram saklı kalıyordu | RAM disk/teyp/LBA/veri yolu ile RAID uzantıları ayrı amaçlara bölündü |
| HDD maliyetinde denetleyici ek yükü gösterilmiyordu | Tam servis hesabında ayrı controller bileşeni ve açık birimler |
| SCAN kaynaktaki 208 sayısına körce bağlanabilirdi | Fiziksel uç yolunun 236 hesabı korunur; LOOK 208 farkı kaynak notunda açıklanır |
| İleri gidince flash silme sayacı görünürde azalıyordu | Birikmiş aşınma ileri yönde korunur ve artar; geri aşama eğitim geçmişini yeniden çizer |
| C-SCAN dönüş maliyeti yalnız açıklamada kalıyordu | 53+199+134=386 ayrıştırması ve servis verilmeyen dönüş görseli |
| Yedek takılmış disk hâlâ arızalı X ile görünüyordu | Yedek/rebuild durumu ayrı etiket ve hücrelerle gösterilir |
| İç içe RAID yalnız iki başlıkla geçiliyordu | Aynı fiziksel arızaların 0+1 ve 1+0'da farklı grup sonuçları hesaplanır |
| İlk sahnede sol ok aynı sahnenin aşamasını sıfırlıyordu | Gezinme sınırda etkisiz |
| Menü kapanışı dışarıda seçilen kontrolün odağını alıyordu | Dış etkileşimi dikkate alan Radix odak dönüşü |

## 5. Yapılan doğrulamalar

| Kontrol | Sonuç |
| --- | --- |
| `pnpm test` | **61/61 başarılı**: HDD, zamanlama, flash, hata, aygıt, swap, rota, klavye, RAID, havuz ve nesne |
| `pnpm check:content` | **50 sahne /268 aşama**; hareket açık/kapalı, ileri/ters aynı çıktı; plan metadata'sı, kaynaklar, notlar ve medya doğru |
| Rotalar ve eski adresler | **44 ana rota sahnesi**,50tam;36 eski adres; her komşu geçiş ve sınır denetlendi |
| Süreler | **2660 /4600 saniye**, yani 44:20 /76:40; sözleşmeyle aynı |
| `pnpm build` | TypeScript, offline not üretimi ve Vite üretim derlemesi başarılı |
| Canlı HTTP | HTML, tüm kaynak/metadata modülleri, işlenmiş CSS, PDF, not HTML'i ve dört PNG dahil **59 kontrol HTTP 200** |
| Offline not dosyası |50 sahne,50 gerçek NotesPanel,268 aşama,8 gömülü font; iç bağlantılar geçerli; dış varlık gereksinimi yok |
| `git diff --check` | Temiz |
| Yerel belge bağlantıları | README ve alt plan/prova dosyaları dahil geçerli |

Çapraz incelemeler de paralel yapıldı: bağlantı/RAID ajanı donanım/zamanlama modellerini ve 114 aşamayı; donanım/zamanlama ajanı yönetimin 9 sahne/45 aşamasını; yönetim ajanı ortak navigasyon/rota/alias ve süreleri bağımsız inceledi. Yeni bir somut model/kaynak hatası bulunmadı. React hook, erişilebilir adlar, odağın korunması, sonlu ilerleme ve zamanlayıcı yokluğu kod üzerinden incelendi.

## 6. Kaynak ve doğrulama sınırları

**Tam kitap metni depoda bulunmuyor.** İçerik aynı 10.baskının resmî içindekiler,47 slaytlık destek dosyası, tekrar soruları ve düzeltmeleriyle denetlendi. Tam kitap sayfası/satırıyla karşılaştırma yapılmış sayılmaz. Kaynak çelişkileri ve özgün model sınırları ana planda/notlarda açıkça kaydedilir.

**Uygulama tarayıcı üzerinden test edilmedi.** Ekran görüntüsü veya tarayıcı otomasyonu kullanılmadı. Node/SSR, model, TypeScript ve HTTP kontrolleri; gerçek ekran taşması, odak sırası, yazdırılmış sayfa düzeni veya projeksiyon okunabilirliği doğrulaması değildir.

Üretim JavaScript paketi yaklaşık **694,61 kB** (gzip 207,87 kB). Vite 500 kB parça uyarısı sürüyor; derleme başarılıdır. Bütün sahneler ve notlar aynı istemci paketinde bulunur. Not HTML'i yaklaşık362 KiB'dir. Haricî dağıtım, gerçek disk işlemi veya kullanıcı verisi işlemi yapılmadı.

Geliştirme sunucusu açık bırakıldı: **[http://localhost:5173/](http://localhost:5173/)**.
