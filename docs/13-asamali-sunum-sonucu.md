# 13 — Bütün sahnelerde geri alınabilir sunum: sonuç

> **Tarihsel revizyon:** 36 sahne / 213 aşamalı çalışma temelidir. Güncel sahne sayısı, kapsam ve rota kararı [14 — Yeni sunum mimarisi](14-kitaba-dayali-yeni-sunum-mimarisi.md), hazırlık [15 — Prova rehberi](15-sunum-prova-ve-kaynak-rehberi.md) içindedir.

**5 Kasım 2026.** Uygulama sözleşmesi [12 — Tüm sahnelerde ileri/geri akış](12-tum-sahnelerde-ileri-geri-akis.md) içinde yazıldı. Üç paralel ajan donanım/zamanlama, yönetim ve bağlantı/RAID/kapanış bölümlerini yeniden tasarladı. Ana ajan ortak klavye/odak akışını, kaynak eşlemesini, bütünleşik kontrolü ve belgeleri yürüttü.

## Son davranış

**36 sahne, 213 adlandırılmış aşama.** Her sahne `SceneContext.stage` ile ilerler. Enter bir sonraki aşamayı, Backspace aynı sahnenin önceki aşamasını gösterir. İlk/son aşamada sınır korunur; sahne ve URL değişmez. Sahne geçişi sol/sağ ok veya menüyle yapılır.

Aşama seçimi ve sahne içindeki sekme/adım/sıfırlama kontrolleri aynı `setStage` işlevine gider. Diyagram, bitler, kafa yolu, sayaçlar, flash eşlemesi, RAM/swap konumları, arızalı diskler, yeniden kurulan şeritler ve görünür cevap o aşamadan üretilir. Geri hareket sadece başlığı veya sayacı değiştirmez.

- Metin/form alanlarında Backspace normal düzenleme işlevini korur; açık menüde sunum kısayolları çalışmaz.
- Odaktaki düğme ve bağlantılarda Enter/Space kontrolün kendi eylemini çalıştırır. Backspace, form alanları dışında geri aşama hareketidir.
- Tuş tekrarı, IME ve değiştirici tuş korumaları sürer.
- Menü açılınca hareket duraklar; hiçbir zamanlayıcı dersin aşamasını ilerletmez. Space yalnız açıklayıcı hareketi denetler.
- Sol altta aşama seçimi, sıfırlama ve Backspace için geri kontrolü vardır. Görünür Enter düğmesi geri eklenmedi.
- Notlar geçerli aşamayı, ana çıkarımı, kitap bölümü/slaytını, anlatımı ve model sınırını birlikte gösterir.

## Bölüm ve aşama dökümü

| Sahne | Sayı | Ana anlatım |
| --- | ---: | --- |
| S01 | 3 | Okuma isteği → OS → aygıt |
| S02 | 4 | Dört sunucunun kapsamı |
| S03 | 6 | HDD fotoğrafı ve parçalar |
| S04 | 4 | Uçuculuk ve güç kesme |
| S05 | 4 | Seek, dönme, aktarım, toplam |
| S06 | 5 | SSD fotoğrafları ve görevler |
| S07 | 4 | Flash sayfa güncelleme ve blok silme |
| S08 | 5 | RAM disk, teyp, LBA ve veri yolu |
| S09 | 3 | Mekanik bekleme kontrolü |
| S10 | 4 | Kitabın kuyruğu, kafa, sınırlar, yön |
| S11 | 10 | FCFS başlangıç, sekiz servis ve sonuç |
| S12 | 11 | SCAN servisleri, fiziksel uç ve sonuç |
| S13 | 12 | C-SCAN servisleri, uç/dönüş ve sonuç |
| S14 | 5 | Üç sonuç, dönüş maliyeti ve ödünleşim |
| S15 | 5 | Kuyruk, birleştirme, iletim, paralellik, denetleyici |
| S16 | 6 | FTL/GC ve yazma büyütmesi |
| S17 | 8 | Paralellik, aşınma, silme ömrü, ayrılmış alan |
| S18 | 3 | Sağlam/tek hata/çift hata paritesi |
| S19 | 5 | ECC örneği, kontrol ve kodun sınırı |
| S20 | 6 | Ham ortamdan dosyaya hazırlama |
| S21 | 5 | Firmware, boot block, yükleyici, kernel |
| S22 | 3 | Başlangıç, arızalı sektör, yedek eşleme |
| S23 | 6 | Sayfa türleri, swap dosyası/bölümü |
| S24 | 10 | Swap aktarım başlangıç/tamamlanma ve dolu alan |
| S25 | 6 | Üç soru ve üç gerekçe |
| S26 | 12 | DAS/NAS/SAN'da her düğüm ve karşılaştırma |
| S27 | 4 | Dosya sistemi sorumluluğu ve dosya/blok ayrımı |
| S28 | 6 | Uygulama, WAN, API, veri merkezi, hata/gecikme |
| S29 | 4 | Tek aygıt, kapasite, paralellik, yedeklilik |
| S30 | 6 | RAID 0/1, kayıp ve karşılaştırma |
| S31 | 7 | RAID 4/5, XOR, iki kayıp, RAID 6 |
| S32 | 5 | RAID 10 arıza yerleşimi |
| S33 | 7 | Kapasite, arıza, yedek, üç rebuild şeridi ve sonuç |
| S34 | 6 | İç içe RAID, checksum, havuz, nesne, yedekleme |
| S35 | 7 | İsteğin kavramsal yolculuğu |
| S36 | 6 | Tasarım ölçütleri ve kapanış |

Açılış ve 11.1 toplam **38**, 11.2–11.3 **61**, 11.4–11.6 **44**, 11.7–11.8 ve kapanış **70** aşamadır.

## Bulunan ve giderilen sorunlar

| Önceki sorun | Düzeltme |
| --- | --- |
| Enter yalnız bazı sahnelerde DOM'daki sonraki düğmeye tıklıyordu; diğerleri ilerlemiyordu | `stages` zorunlu; DOM sorgusu/tıklama yedeği kaldırıldı; bütün ilerleme tek durumdan |
| Birbirinden bağımsız demo sayaçları geçmiş aşamayı geri kuramıyordu | Flash/swap/RAID modelleri başlangıçtan aşamaya kadar saf geçişlerle yeniden üretiliyor |
| Swap bekleyen aktarımı süre sonunda kendiliğinden tamamlıyor, sunucu aşamasıyla ayrışıyordu | Başlama ve tamamlanma ayrı Enter aşamaları; otomatik tamamlanma ve timer kaldırıldı |
| Boot düğmesi son adımda başlangıca dönüyor, dosya sayacı sınırsız artıyor, sorular gizli cevap hafızası tutuyordu | Sonlu akış, ayrı sıfırlama, aşamaya bağlı tek sonuç/cevap |
| RAID ortak deposu diğer sahnenin seviyesi/arıza/rebuild durumunu taşıyordu | Her sahnenin sabit ders senaryosu; bağımsız ortak depo kaldırıldı |
| Serbest kuyruk girdileri sabit aşama listesinin uzunluğunu/anlamını bozabilirdi | Sunum kitabın sabit örneğini kullanıyor; esnek saf motor ve sınır testleri korunuyor |
| İlk sahnede sol ok aynı sahneye gidip aşamayı sıfırlıyordu | Gerçek sahne değişimi yoksa gezinme etkisiz |
| Menü dışındaki bir kontrol seçilince kapanış odağı zorla menü düğmesine taşıyordu | Radix'in dış etkileşimi dikkate alan varsayılan odak geri dönüşü kullanılıyor |
| Hatalı aşama sayısı NaN veya aralık dışı durum üretebilirdi | Merkezi tamsayı/aralık denetimi |
| RAM bitlerinin erişilebilir etiketi görünen diziyle aynı değildi | Etiket ve görünen veri eşleştirildi |

## Kaynakla ilişki

Kaynak çerçevesi **Operating System Concepts, Tenth Edition**, 11.1–11.8; [resmî içindekiler](https://os-book.com/OS10/toc-dir/toc.pdf) ve [yazarların 47 slaytlık Chapter 11 materyali](https://os-book.com/OS10/slide-dir/PPTX-dir/ch11.pptx). Bütün 36 sahnenin bölüm/slayt kaydı korunuyor. S15'in denetleyici/FTL aşaması için 11.1/slayt 11 geri referansı eklendi.

Sabit kuyruk: kafa 53, aralık 0–199, sıra 98,183,37,122,14,124,65,67. Ortak azalan yönde **FCFS 640 / SCAN 236 / C-SCAN 386**. Resmî SCAN slaydındaki 208 ifadesi ile açık fiziksel-uç yolu arasındaki fark korunuyor: 53→0→183 =236; 14'te dönen LOOK yolu =208. Kitabın tam metni görülmeden kitap hatası iddiası yapılmıyor.

Özgün Türkçe sahneler ve küçük sayfa/bit/disk örnekleri kitabın kavramlarını açıklayan eğitim modelleridir; kitap şekli veya tam sistem simülasyonu olduğu söylenmez. SECDED örneğinin sınırı, RAID 6 Q cebirinin sembolik olduğu ve aşamanın geri gösterilmesinin fiziksel aygıtta işlemi geri alma garantisi olmadığı açıkça belirtilir.

## Doğrulama yöntemi

- Hesap ve model testleri: HDD, FCFS/SCAN/C-SCAN, flash canlı eşleme ve sayaçlar, parite/SECDED, hazırlama/remapping, swap ve RAID.
- Yeni geri kurma testleri: aşamalar karışık ve ters sırada çağrıldığında eşlemeler, ayrılmış alan, frame/slot, pending, hata, arıza/rebuild ve sayaçlar aynı değerleri vermeli.
- Klavye testleri: Enter/Backspace yönleri, ilk/son aşamada kalma, NaN/aralık denetimi, odaktaki kontrol, metin alanı, menü, tekrar/IME/değiştirici tuşlar.
- `pnpm check:content`: 36 kayıt, 36 kaynak/not görünümü, **213 aşama**. Her aşama hareket açık ve kapalıyken oluşturulur. Ardışık çıktılar farklı; bütün aşamalar ters sırada oluşturulunca ilk çıktıyla birebir aynı; tek başlık, yerel medya ve geçersiz çıktı kontrolleri başarılı olmalı.
- TypeScript ve üretim derlemesi; canlı HTML, kaynak modülleri, CSS, yerel PDF ve görseller için HTTP denetimi; diff ve belge bağlantısı kontrolü.

## Doğrulama sınırları

**Tarayıcı açılmadı, tarayıcı otomasyonu veya ekran görüntüsü kullanılmadı.** Statik çıktılar gerçek tarayıcı etkileşimi, görsel taşma, odak sırası veya projeksiyon okunabilirliği denetimi yerine geçmez. Tam kitap metni depoda bulunmadığından doğrudan sayfa düzeyinde tam kitap karşılaştırması yapılmış sayılmaz.

Yerel geliştirme sunucusu: [http://localhost:5173/](http://localhost:5173/). Haricî yayımlama veya gerçek depolama işlemi yapılmadı.
