# 12 — Tüm sahnelerde kitaba bağlı ileri/geri akış

> **Tarihsel revizyon:** 36 sahne / 213 aşamalı çalışma temelidir. Güncel sahne sayısı, kapsam ve rota kararı [14 — Yeni sunum mimarisi](14-kitaba-dayali-yeni-sunum-mimarisi.md), hazırlık [15 — Prova rehberi](15-sunum-prova-ve-kaynak-rehberi.md) içindedir.

**5 Kasım 2026 · Uygulama öncesi plan.** Bu revizyon, 10–11 belgelerindeki yalnız ilk dokuz sahnenin ortak aşamaya sahip olduğu durumun yerini alır. Kullanıcı bütün sahnelerin yeniden değerlendirilmesini, Enter ile ileri ve Backspace ile sahne içinde geri hareketi, paralel bölüm tasarımını ve yalnız kodla doğrulamayı istedi.

## 1. Kaynak ve tasarım sınırı

Temel eser **Operating System Concepts, Tenth Edition**, Bölüm 11.1–11.8. Resmî [içindekiler](https://os-book.com/OS10/toc-dir/toc.pdf) ve [47 slaytlık Chapter 11 dosyası](https://os-book.com/OS10/slide-dir/PPTX-dir/ch11.pptx) mevcut içerik dayanağıdır. Tam kitap metni depoda bulunmadığı için doğrudan kitap sayfası doğrulaması iddia edilmez. Önceki revizyondaki bölüm/slayt kaynak eşlemesi korunur ve değişen anlatımla yeniden karşılaştırılır.

- 36 sahne kimliği ve dört sunucunun bölüm dağılımı korunur; sahne içi anlatım yeniden tasarlanabilir.
- Her sahne açık, sonlu ve adlandırılmış aşamalara sahip olur. Tek aşamalı veya klavyeyle ilerlemeyen sonradan eklenmiş demo kalmaz.
- Kitabın kavram sırası izlenir: donanım → zamanlama → hata/yönetim/swap → bağlantı/RAID → bütünleştirme.
- Ana ders örnekleri sabittir. Serbest laboratuvar girdisi öğretim sırasını veya geri almayı bozuyorsa sunum yüzeyinden kaldırılır; saf modeller ve sayısal testler korunur.
- Özgün küçük flash, swap, ECC ve RAID örnekleri açıkça eğitim modeli olarak tanımlanır. Yeni ürün, güncel işletim sistemi veya kaynakta doğrulanmayan ek konu eklenmez.
- Tarayıcı, tarayıcı otomasyonu ve ekran görüntüsü kullanılmaz. Yerel HTTP ve Node statik oluşturma tarayıcı testi değildir.

## 2. Saptanan mimari problem

İlk dokuz sahne `context.stage` kullanırken sonraki sahneler `useState`, modül deposu, timer veya ayrı demo düğmelerinden ilerliyordu. Enter kimi sahnede DOM üzerinden `data-presentation-next` düğmesine tıklıyordu; bazı sahnelerde böyle bir düğme yoktu. Bu yapı tüm sahnelerde geri gitmeyi güvenilir biçimde destekleyemez. Sadece Backspace kısayolu eklemek sorunu çözmez.

Yeni sözleşme: **Tek ilerleme kaynağı `SceneContext.stage`**. Sahnenin görünür diyagramı, sayısal sonuçları, açıklaması ve cevap açılması aynı aşamadan türetilir. Durum motoru olan örnekler başlangıçtan ilgili aşamaya kadar saf geçişleri yeniden uygular. Geri gitmek önceki matematiksel durumu yeniden gösterir; yalnız sayaç veya başlık değiştirmez.

## 3. Klavye ve geçiş kuralları

| Eylem | Davranış |
| --- | --- |
| Enter | Geçerli sahnede bir aşama ileri; son aşamada kalır |
| Backspace | Geçerli sahnede bir aşama geri; ilk aşamada kalır; tarayıcı geçmişine gitmez |
| Sol / sağ ok | Önceki / sonraki sahne; yeni sahne başlangıç aşamasında açılır |
| Aşama listesi | Doğrudan seçilen aşamayı ve ona ait gerçek model durumunu gösterir |
| Aşamaları başa al | Aynı sahnenin aşama 0 durumunu gösterir |
| Space | Açıklayıcı hareketi duraklatır/oynatır; dersin aşamasını ilerletmez |
| Açık menü / metin ve form girdisi | Sunum kısayolları uygulanmaz; yerel kullanım korunur |
| Odaktaki düğme/link | Enter/Space kendi eylemini çalıştırır; Backspace sunum geri hareketidir |
| Basılı tuş / IME / değiştirici tuş | İstenmeyen çoklu adım veya yerel düzenleme kaybı oluşmaz |

Görünür Enter düğmesi geri getirilmez. Geri aşama için küçük erişilebilir bir kontrol ve Backspace ipucu bulunabilir. Aşama seçimi dokunmatik kullanım sağlar. URL yalnız sahne değişiminde değişir; ileri/geri aşama URL veya tarayıcı geçmişi üretmez.

## 4. Paralel sorumluluklar

| Paket | Sahiplik | Tasarım ve düzeltme |
| --- | --- | --- |
| Donanım ve zamanlama ajanı | S01–S17, 11.1 ve 11.2–11.3 bileşenleri; HDD hesabı; zamanlama testleri | İlk dokuz sahneyi geri alma açısından denetle; resmi sabit kuyruk ve gerçek servis adımları; GC replay; NVM kavram aşamaları |
| Yönetim ajanı | S18–S25 ve 11.4–11.6 modelleri/bileşenleri; yönetim testleri | Parite/ECC, hazırlama, firmware/boot, remapping, swap ve kontrol sorularını kontrollü aşamalara çevir |
| Bağlantı/RAID ajanı | S26–S36, 11.7–11.8 ve kapanış; RAID testleri | Topoloji, WAN/API, şerit/ayna/parite, arıza/rebuild ve kapanışı deterministik kitaba bağlı öyküler yap |
| Ana ajan | Sunum tipi, hook/klavye, yan menü, ortak stiller, kaynak eşlemesi, kontrol betiği ve belgeler | Ortak ileri/geri altyapısı, tüm aşamaların ileri/ters sırada statik denetimi, birleşik kabul |

Ajanlar mevcut dosya değişikliklerini silmez; yalnız kendi dosyalarını düzenler. Kaynakta olmayan başlık veya model davranışı eklemek yerine ana ajana bildirir. Birleşik TypeScript kontrolü diğer paketler tamamlanmadan geçici olarak eksik `stages` alanı bildirebilir.

## 5. Bölümlerin sahne içi tasarımı

- **11.1:** Fotoğraflarda parçalar; kalıcılık; seek/dönme/aktarım; SSD görevleri; sayfa/blok; RAM disk/teyp/LBA. Aşama geri alınınca vurgu, bit durumu ve açıklama birlikte geri döner.
- **11.2:** Resmî kuyruk 98,183,37,122,14,124,65,67; kafa 53; 0–199 aralığı. Başlangıç, her servis/uca varma/dönüş ve sonuç ayrı aşamadır. Varsayılan azalan yönle FCFS 640 / SCAN 236 / C-SCAN 386. Resmî slayttaki SCAN 208 ifadesi ile fiziksel-uç hesabı arasındaki açıklanmış fark korunur.
- **11.3:** Mekanik maliyetin kalkması; kuyruk/birleştirme; GC ve yazma büyütmesi. Flash'ın geçerli eşlemesi ve sayaçları aşamadan saf replay ile üretilir.
- **11.4:** Sağlam veri, tek bit, çift bit; tespit/düzeltme sınırı. Örnek ECC kodunun sınırları genel ECC kavramıyla karıştırılmaz.
- **11.5:** Hazırlama katmanları ve açılış zinciri. Remapping'de LBA sabit kalırken hedef değişir; geri aşama eski hedefi gösterir.
- **11.6:** RAM/swap sayfasının aktarım başlangıcı ve tamamlanması ayrı aşamalardır. Zamanlayıcıyla ilerleme yoktur; yazma tamamlanmadan RAM kopyası atılmaz.
- **11.7:** Topolojide isteğin yolu, dosya sistemi sorumluluğu, WAN/API gecikme ve hata nedeni. Aynı sahnede ileri/geri aynı düğümleri izler.
- **11.8:** Kapasite/paralellik/yedeklilik hedefleri; RAID0/1; parite; arıza yerleşimi; degraded/rebuild; bütünlük/havuz/nesne. Önceki sahneden taşan bağımsız durum anlatımı değiştirmez.
- **Kapanış:** İsteğin kavramsal yolculuğu ve tasarım ölçütleri, Enter/Backspace ile bütünüyle gezilir.

## 6. Kodla doğrulama ve kabul

1. `SceneDefinition.stages` zorunlu; tüm 36 sahnede en az iki benzersiz, anlamlı aşama adı.
2. Klavye testleri Enter/Backspace yönünü, sınırda kalmayı, tekrar basmayı, metin düzenlemeyi, menüyü ve değiştirici tuşları kapsar.
3. Bütün sahneler tüm aşamalarında Node/SSR ile oluşturulur. Her sahnede ilerleyen aşamalar gerçekten farklı çıktı üretmeli.
4. Aynı aşamalar ters sırada yeniden oluşturulduğunda aynı çıktı alınmalı: ileri hareketin bıraktığı gizli durum veya geri dönüş bozukluğu bulunmamalı.
5. Saf model testleri korunur; ek replay modellerinin kritik ara durumları için davranış testi eklenir.
6. Kaynak eşlemeleri ve notlar yeni görünür anlatımla tutarlı; önceki bağımsız demo/timer/serbest girdi talimatları temizlenmiş olmalı.
7. TypeScript ve üretim derlemesi başarılı; diff boşluk ve yerel belge bağlantısı kontrolleri temiz.
8. Geliştirme sunucusu HTTP yanıtı ve uygulama modülleri denetlenir; tarayıcı testi yapılmış denmez.

## 7. Teslim

Güncel README, sahne/aşama sayıları, bulunan/düzeltilen somut hatalar, test kanıtları ve kaynak/görsel doğrulama sınırı sonuç belgesine yazılır. Geliştirme sunucusu çalışır bırakılır. Sonuç sadece yeni klavye eşlemesi değil, bütün sahnelerde geri alınabilir gerçek anlatım akışıdır.
