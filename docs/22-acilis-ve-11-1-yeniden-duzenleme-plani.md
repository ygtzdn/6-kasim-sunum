# 22 — Açılış ve 11.1 yeniden düzenleme planı

5 Kasım 2026

Bu belge, kullanıcının tarif ettiği akışın uygulama planı ve karar kaydıdır. Plan uygulandı. İlk incelemedeki durum 2. bölümde tarihsel başlangıç olarak korunur. Güncel sonuç README ve 23 numaralı uygulama kaydındadır.

Son kapsam düzeltmesi: GC, wear leveling ve ayrıntılı adresleme/veri taşıma örneği 2. kişinin sunumunda kalır. Teyp ve HDD tarihçesi çıkarılır. DWPD, 11.1'de korunur.

## 1. Temel kararlar

- İlk ekranda 11.1–11.8 başlıklarının tamamı birlikte görünür.
- 11.1, HDD, SSD ve RAM'in gerçek fotoğraflarıyla başlar. RAM çalışma alanı, HDD ve SSD kalıcı veri depolama aygıtları olarak ayrılır.
- Konuların sırası HDD, flash tabanlı NVM/SSD, ardından RAM olur.
- HDD'nin mevcut anlatımı büyük ölçüde kullanılır.
- 11.1'de SSD'nin gerçek parçaları, sayfa/blok yapısı, temel yazma/silme kuralları ve DWPD açıklanır.
- Ayrıntılı mantıksal/fiziksel adresleme, güncelleme, veri taşıma, garbage collection ve wear leveling 2. kişinin 11.3 anlatımında kalır.
- İki kişinin flash diyagramlarında aynı adlandırma kullanılır. Yönetim örneği ilk kez 2. kişinin bölümünde açılır.
- Teyp ve HDD tarihçesi sunumdan çıkarılır. DWPD ana akışta kalır.
- RAM anlatımının odağı çalışma alanı ve güç bağımlılığıdır. RAM drive ve dosya sistemi üzerinden RAM disk anlatımı yeni ana akışta yer almaz.
- Notlar yalnızca sayfanın anlattığı konuyu açıklar. Sunucuya hitap eden yönergeler, soru yöneltme önerileri ve geçiş konuşmaları kaldırılır.
- Her sayfada bir ana fikir bulunur. Sayfa ve aşama sayısı, mevcut 56/280 sayısını korumak için zorlanmaz.

## 2. Projenin mevcut durumu

### Uygulama öncesindeki içerik ve altyapı

Proje React, TypeScript ve Vite ile hazırlanmış etkileşimli bir web sunumudur. Yerel fotoğraflar, yazı tipleri, sayfa içi modeller ve çevrimdışı not çıktısı vardır. Sunum sırasında bir dış hizmete bağlanması gerekmez.

Mevcut dizin 56 sayfa ve 280 aşama içerir. Ana rota 50 sayfadır. Sunum şu anda bütün sayfaların bulunduğu rotayla açılır. Bölüm sırası açılış, 11.1, 11.2–11.3, 11.4–11.6, 11.7–11.8 ve kapanış şeklindedir.

| Alan | Mevcut yapı | Yeni akış açısından sonuç |
| --- | --- | --- |
| Açılış | HDD fotoğraflı kapak ve dört sunucu grubuna ayrılan harita | Sekiz kitap başlığını ilk ekranda birlikte gösteren bir içerik sayfasına dönüşmeli |
| 11.1 | 13 sayfa, 55 aşama | HDD bölümü kullanılabilir. Ortak cihaz tanıtımı eklenmeli. Teyp ve tarihçe çıkarılır, DWPD korunur |
| HDD | Gerçek fotoğraf, parça işaretleri, iz/sektör/silindir, erişim hesabı ve istek boyutu karşılaştırması | Temel yapı korunabilir |
| SSD fotoğrafları | Dış kasa ve iç kart. Denetleyici, NAND ve SATA bağlantısı işaretli | Yeni gerçek parça anlatımı için yeterli temel var |
| Flash temelleri | 11.1'de iki bloklu ayrı bir sayfa/blok örneği | Yapı ve temel işlem kurallarıyla sınırlı tutulmalı. Ayrıntılı yönetim örneği 2. kişide kalmalı |
| Adresleme ve GC | 11.3'te üç bloklu, dört sayfalı model ve FTL tablosu | 2. kişinin bölümünde korunmalı ve sadeleştirilmeli |
| Wear leveling | 11.3 özetinin içinde sayaç karşılaştırması | 2. kişinin bölümünde GC'den sonra açıklanmalı |
| RAM | Gerçek RAM fotoğrafı var, anlatım RAM disk ve dosya sistemi etrafında kurulmuş | Çalışma alanı ve güç bağımlılığı etrafında yeniden yazılmalı |
| Notlar | Aşama başına konuşma metni, soru, geçiş, öğrenme hedefi ve model açıklaması | Sayfa başına kısa konu açıklamasına dönüşmeli |
| Menü | Dört sunucuya göre gruplanıyor | Sekiz bölüm başlığıyla eşleşen gezinme önerilir. Sunucu bilgisi ikincil kalabilir |
| Denetimler | Her sayfada en az iki aşama, aşama başına uzun not ve gerekçeli soru zorunlu | Sadelik ilkesine uygun biçimde değişmeli |

### Kullanılabilecek gerçek fotoğraflar

| Varlık | Kullanım |
| --- | --- |
| `public/media/hdd-open.png` | Ortak tanıtım ve HDD parçaları |
| `public/media/ssd-case.png` | Ortak tanıtım ve SSD dış görünüşü |
| `public/media/ssd-board.png` | NAND, denetleyici ve bağlantının gerçek kart üzerinden açıklanması |
| `public/media/ram-module.png` | Ortak tanıtım, RAM ve son karşılaştırma |

Üç cihazın mevcut fotoğrafları görsel olarak incelendi. İlk uygulama için yeni fotoğraf üretmek gerekmiyor. Aynı cihaz fotoğrafının tanıtımda ve ayrıntılı anlatımda yeniden kullanılması, cihazın tanınmasını destekler. Fotoğraf üzerindeki işaretler fotoğraftan ayrı tutulur. Var olan lisans ve fotoğraf atıfları korunur.

### İnceleme sırasında doğrulananlar

- 75 mevcut test geçti.
- 56 sayfanın 280 aşaması hareket açık/kapalı ve ileri/geri sırada içerik denetiminden geçti.
- 36 eski bağlantı, kaynak eşlemeleri ve yerel medya denetlendi.
- 68 diyagram çıktısında bağlantıların başka kartların içinden geçmediği doğrulandı.

Bunlar mevcut sürümün başlangıç durumudur. Yeni akışın uygulanmış veya görsel olarak doğrulanmış olduğu anlamına gelmez. Depodaki tarayıcı otomasyonu kullanmama yönergesi doğrultusunda bu incelemede tarayıcı açılmadı. Çalışma alanında önceden bulunan değişikliklere dokunulmadı.

## 3. Açılış ekranı

### İçerik

İlk sayfa bölüm başlığı ve aşağıdaki sekiz satırdan oluşur:

| Bölüm | Görünür başlık |
| --- | --- |
| 11.1 | Kütlesel depolamaya genel bakış |
| 11.2 | HDD zamanlaması |
| 11.3 | NVM zamanlaması |
| 11.4 | Hata tespiti ve düzeltme |
| 11.5 | Depolama aygıtı yönetimi |
| 11.6 | Takas alanı yönetimi |
| 11.7 | Depolamanın sisteme bağlanması |
| 11.8 | RAID yapısı |

Başlıklar [10. baskının resmî içindekilerindeki](https://os-book.com/OS10/toc-dir/toc.pdf) bölüm sırasına dayanır. Türkçe ifadeler sunum için seçilmiş kısa karşılıklardır.

### Yerleşim ve davranış

- Masaüstü sunum ekranında iki sütun ve dört satır önerilir. Bölüm numarası ve başlık yeterlidir.
- Sekiz başlık ilk açılışta görünür ve okunur olur. Başlıklar aşamalarla tek tek açılmaz, diğer konular soluklaştırılarak gizlenmez.
- İlk konuya geçiş 11.1'in ortak cihaz tanıtımını açar.
- Her başlık ilgili bölümün ilk sayfasına bağlanır.
- Başlıkların görünmesi menünün açılmasına veya bir düğmeye basılmasına bağlı olmaz.
- Ayrı kapak ve dört soruluk harita bu başlangıç işlevinde birleşir.
- Dar ekranlarda başlıklar alt alta sıralanabilir. Hepsinin kaydırmasız görünmesi hedefi esas olarak sunumun masaüstü ekranı içindir.

**Sayfa notu taslağı:**

> Bölüm 11, depolama aygıtlarının yapısını ve işletim sisteminin bu aygıtları nasıl kullandığını ele alır. Konular aygıtların tanıtımıyla başlar, zamanlama ve yönetimle devam eder, bağlantı biçimleri ve RAID yapısıyla tamamlanır.

## 4. 11.1 için önerilen sayfa sırası

Aşağıdaki 10 sayfa güncel başlangıç planıdır. Yeni bir sayfa gerekmeyen açıklamalar, aynı sayfanın anlamlı durum değişimleri olarak kalabilir. Sırf bir sayıyı tutturmak için sayfa veya aşama eklenmez.

| Sıra | Sayfa | Ana fikir | İşlem |
| --- | --- | --- | --- |
| 1 | HDD, SSD ve RAM | RAM çalışma alanıdır. HDD ve SSD veri depolar | Yeni ortak tanıtım |
| 2 | HDD'nin parçaları | Plaka, mil, kol ve kafa farklı görevler üstlenir | Mevcut gerçek fotoğraf anlatımı |
| 3 | İz, sektör ve silindir | HDD'nin kayıt düzeni | Mevcut diyagram |
| 4 | HDD'de okuma ve erişim süresi | Hedefe ulaşma ve veriyi aktarma ayrı işlerdir | Mevcut erişim modeli |
| 5 | İstek boyutu ve mekanik bekleme | Daha hızlı aktarım bütün gecikmeyi aynı oranda azaltmaz | Mevcut karşılaştırma |
| 6 | NVM ve SSD'nin parçaları | NAND veriyi tutar, denetleyici işlemleri yönetir | Gerçek SSD kartı |
| 7 | NAND'da sayfa ve blok | Sayfa yazılır, daha büyük blok silinir | Birleştirilmiş yeni yapı diyagramı |
| 8 | Flash dayanıklılığı ve DWPD | Kapasiteye göre günlük yazma hacmi | Mevcut DWPD örneği ana akışta korunur |
| 9 | RAM ve elektrik | RAM çalışan verinin bulunduğu uçucu çalışma alanıdır | Gerçek RAM fotoğrafı ve güç durumu |
| 10 | RAM, HDD ve SSD karşılaştırması | Çalışma alanı, kalıcılık ve hareketli parçalar | Kısa sonuç karşılaştırması |

### 4.1. HDD, SSD ve RAM

HDD, SSD kasası ve RAM modülü ilk anda aynı ekranda bulunur. Cihaz isimleri fotoğraflarla birlikte görünür. Açıklama iki görevle sınırlıdır: çalışma alanı ve kalıcı depolama. NAND, FTL ve dosya sistemi gibi ayrıntılar bu sayfaya eklenmez.

**Sayfa notu taslağı:**

> RAM, çalışan programların ve o anda kullanılan verilerin bulunduğu çalışma alanıdır. HDD ve SSD, kaydedilen verileri güç kapalıyken de tutar. Bu aygıtlar bilgisayarda farklı görevleri birlikte üstlenir.

### 4.2. HDD'nin parçaları

Mevcut gerçek HDD fotoğrafı ve parça koordinatları kullanılır. Plaka, mil, kol ve okuma/yazma kafası kısa görevleriyle açıklanır. Fotoğraftaki kafa park konumundadır. Küçük okuma/yazma elemanı, fotoğrafta ayrıntılı seçilebilen bir parça gibi gösterilmez. Mevcut normal çalışma/head crash ayrımı kısa tutulabilir.

**Sayfa notu taslağı:**

> HDD, veriyi manyetik kaplamalı plakalar üzerinde saklar. Mil plakaları döndürür, kol ise okuma/yazma kafasını hedef izin üzerine taşır. Normal çalışmada kafa plaka yüzeyine temas etmez.

### 4.3. İz, sektör ve silindir

Mevcut şema korunur. İz dairesel kayıt yolu, sektör bu yolun bir parçası, silindir farklı yüzeylerde aynı yarıçaptaki izler grubu olarak gösterilir. Şema, gerçek fotoğrafta görülmeyen kayıt düzenini açıklar.

**Sayfa notu taslağı:**

> İz, disk yüzeyindeki dairesel kayıt yoludur. Sektör, bir izin veri taşıyan parçasıdır. Farklı yüzeylerde aynı yarıçapta bulunan izler bir silindir oluşturur.

### 4.4. HDD'de okuma ve erişim süresi

Mevcut erişim anlatımı büyük ölçüde korunur. Kolun hedef ize gitmesi, sektörün kafa altına gelmesi ve aktarım sıralı olarak açıklanır. Var olan 7200 RPM ve 4 KiB hesabı kullanılabilir. Yeni hesap veya yeni bir performans laboratuvarı eklenmez.

**Sayfa notu taslağı:**

> Bir HDD okumasında kafa hedef ize konumlanır ve ilgili sektörün kafa altına gelmesi beklenir. Ardından veri aktarılır. Bu sayfadaki örnek servis süresi, konumlanma ve aktarımın yanında denetleyici katkısını da içerir.

### 4.5. İstek boyutu ve mekanik bekleme

Mevcut karşılaştırma korunur. HDD bölümü daha sonra kısaltılacaksa, ana anlatımdan ayrıntılara taşınabilecek ilk sayfa budur. Bu plan HDD'nin kullanılabilir anlatımını baştan kurmayı gerektirmez.

**Sayfa notu taslağı:**

> Aynı HDD'de daha büyük veri isteği daha uzun aktarım süresi gerektirir. Aktarım hızı artarken kafa konumlandırma ve dönme beklemesi aynı kalabilir. Bu nedenle küçük bir isteğin toplam süresi, aktarım hızıyla aynı oranda azalmaz.

### 4.6. NVM ve SSD'nin parçaları

NVM, kalıcı bellek anlamıyla tanıtılır. Somut örnek NAND flash kullanan SSD'dir. Kısa dış görünüşten sonra gerçek iç kart kullanılır. Denetleyici, NAND yongaları ve bağlantı gösterilir. Gereksiz aygıt ailesi kartları kaldırılabilir.

Mevcut fotoğraf SATA SSD'ye aittir. NVMe aygıt fotoğrafı gibi etiketlenmez. NVM bir bellek kavramı, SSD bir aygıt, NVMe bir erişim arayüzü/protokolüdür. Bu ayrım kısa bir tanım düzeyinde tutulur. Sayfa/blok ve silme kuralları NAND flash örneğine bağlanır.

**Sayfa notu taslağı:**

> NVM, güç kesildiğinde verisini koruyan bellektir. Bu SSD'de veriyi NAND flash yongaları saklar, denetleyici ise istekleri ve flash işlemlerini yönetir. Fotoğraftaki SATA bağlantısı aygıtın bilgisayarla iletişimini ve güç bağlantısını sağlar.

### 4.7. NAND'da sayfa ve blok

HDD'nin iz/sektör şemasına karşılık SSD'de blokların ve içlerindeki sayfaların düzeni gösterilir. Yerleşim bloklar ve küçük sayfa hücrelerinden oluşur. Dairesel iz görünümü SSD'ye taşınmaz.

Önce bir blok ve içindeki bir sayfa ayırt edilir. Sonra okuma/yazma birimi ve silme birimi açıklanır. Geçerli, geçersiz ve silinmiş/boş durumları metin ve desenle ayrılır. 11.1'de bu yapı ve temel kurallar açıklanır. FTL tablosu, canlı veri taşıma, GC ve wear leveling örnekleri 2. kişinin bölümünde kalır. [Resmî Chapter 11 slaytlarının](https://os-book.com/OS10/slide-dir/PPTX-dir/ch11.pptx) 10–11. sayfaları bu NAND kurallarını ve yönetim görevlerini açıklar.

**Sayfa notu taslağı:**

> NAND flash'ta sayfalar daha büyük silme bloklarının içinde bulunur. Okuma ve yazma sayfa düzeyinde, silme ise blok düzeyinde yapılır. Yazılmış bir sayfanın yerine yeni veri koymak için denetleyici başka bir boş sayfa kullanır. Geçersiz sayfa, silinmiş ve yeniden yazılabilir boş sayfadan farklıdır.

### 4.8. Flash dayanıklılığı ve DWPD

Mevcut DWPD sayfası ana akışta korunur. Flash'ın sınırlı yazma/silme dayanıklılığı kısaca açıklanır. DWPD, aygıt kapasitesi üzerinden günlük yazma hacmi olarak tanımlanır. Mevcut 1 TB ve 5 DWPD örneği kullanılır: tanımlı garanti koşullarında 5 TB/gün. 3 TB/gün ile 6 TB/gün karşılaştırması aynı sayfada kalabilir. Aşınmayı dağıtma algoritmaları 2. kişinin bölümündedir.

**Sayfa notu taslağı:**

> DWPD, garanti süresi ve koşulları içinde aygıt kapasitesinin günde kaç katı veri yazılabileceğini ifade eden dayanıklılık derecelendirmesidir. 1 TB kapasiteli ve 5 DWPD değerli bir aygıt için bu hacim 5 TB/gündür. DWPD hücre başına silme sayısı değildir ve kesin arıza günü vermez.

### 4.9. RAM ve elektrik

Gerçek RAM modülü büyük gösterilir. Çalışan program/veri ve güç durumu arasında basit bir ilişki kurulur. Güç varken tutulan çalışma verisi, güç kesildikten sonra korunmuş görünmez. Güç tekrar geldiğinde eski veri kendiliğinden geri dönmez.

RAM disk, raw blok aygıtı, dosya sistemi ve tmpfs zinciri bu sayfadan çıkarılır. NAND flash sayfalarıyla RAM sayfalarının ayrı bağlamlarda kullanılan kavramlar olduğu kaynak eşlemesinde korunur.

**Sayfa notu taslağı:**

> RAM, işlemcinin çalışan programlara ve kullanılan verilere eriştiği çalışma alanıdır. Bu modüldeki DRAM, verisini korumak için güç gerektirir. Güç kesildiğinde içerik korunmaz. Gücün geri gelmesi eski çalışma verilerini geri getirmez.

### 4.10. RAM, HDD ve SSD karşılaştırması

Önceki sayfanın ardından üç cihaz kısa bir tabloda karşılaştırılır. İlk ortak tanıtımdaki görev ayrımı, açıklanmış fiziksel özelliklerle tamamlanır.

| Özellik | RAM | HDD | Flash SSD |
| --- | --- | --- | --- |
| Temel görev | Çalışma alanı | Kalıcı depolama | Kalıcı depolama |
| Güç kesilince kaydedilmiş içerik | Korunmaz | Korunur | Korunur |
| Veri erişiminde hareketli parçalar | Yok | Var | Yok |

Hız, kapasite ve fiyat için ürüne bağlı rakamlar eklenmez. Kalıcılık, güç kesilmeden önce aygıta kaydedilmiş içerik üzerinden anlatılır.

**Sayfa notu taslağı:**

> RAM çalışma verisini, HDD ve SSD kaydedilmiş veriyi tutar. Güç kesildiğinde RAM içeriği korunmaz, HDD ve SSD'deki kayıtlar korunur. HDD veriye mekanik hareketle erişir. Flash SSD ve RAM'de veri erişimi için hareketli parça bulunmaz.

## 5. 2. kişinin flash örneğinin ayrıntıları

Mevcut üç bloklu model 2. kişinin bölümünde korunur. Ayrıntılı adresleme, güncelleme ve GC bu model üzerinde açıklanır. 11.1'deki temel yapı şeması da aynı blok/sayfa adlandırmasını kullanır. İki kişinin bölümleri ortak bir ilerleme durumuna bağlı olmaz.

### Başlangıç yerleşimi

| Blok | P0 | P1 | P2 | P3 |
| --- | --- | --- | --- | --- |
| B0 | L0 | L1 | L2 | L3 |
| B1 | L4 | L5 | Boş | Boş |
| B2 | Boş | Boş | Boş | Boş |

B2 başlangıçta veri taşımak için ayrılmış çalışma alanıdır. Bu, öğretim modelinin tercihidir. Gerçek SSD'lerde her zaman aynı bloğun ayrıldığı gibi bir kural oluşturmaz.

### İşlem sırası

| Adım | İşlem | Eşlemedeki değişim | Fiziksel sonuç |
| --- | --- | --- | --- |
| 0 | Başlangıç | L0 B0.P0, L1 B0.P1 | B0 dolu, B1'de iki boş sayfa var |
| 1 | L0 güncellenir | L0 B1.P2'yi gösterir | B0.P0 geçersizleşir |
| 2 | L1 güncellenir | L1 B1.P3'ü gösterir | B0.P1 geçersizleşir. Ayrılmamış boş yazma alanı tükenir |
| 3 | L2 ve L3 taşınır | L2 B2.P0, L3 B2.P1 olur | Geçerli içerik korunur. B0'da geçerli veri kalmaz |
| 4 | B0 silinir | Hiçbir güncel eşleme B0'ı göstermez | Dört sayfa birlikte yeniden kullanılabilir hale gelir |

Silinen B0 yeni çalışma bloğu olabilir. B2'nin kalan iki sayfası sonraki yazmalara açılabilir. Ek yazma örneği gerekirse mevcut L2 güncellemesiyle devam edilebilir.

2. kişinin sayfaları bu örneğin farklı aralıklarını gösterir. Adresleme sayfası başlangıç eşlemesini, güncelleme sayfası başlangıçtan iki güncellemenin tamamlanmasına kadar olan durumu, GC sayfası ise iki güncelleme yapılmış halden taşıma ve silmenin bitimine kadar olan durumu kullanır. GC sayfasına doğrudan gidildiğinde de ilk görünen durum iki güncellemenin tamamlandığı durumdur. Sayfalar başka bir sayfanın önceden açılmış veya ilerletilmiş olmasına bağlı olmaz.

Bu örnekte iki kullanıcı güncellemesine karşılık iki güncelleme yazması ve iki taşıma yazması gerçekleşir. Fiziksel yazma sayısı dörttür. Yazma büyütmesi hesabı 2. kişinin 11.3 anlatımında kalır. Ölçüm aralığı ve eşit veri boyutu varsayımı açık tutulur. Mevcut üçüncü kullanıcı yazması da eklenirse toplam üç kullanıcı yazması, beş fiziksel yazma ve bir blok silme olur.

### Model ve gösterim kuralları

- B0/B1/B2 ve P0–P3 adları bütün sayfalarda aynı kalır.
- Mantıksal adresin güncel fiziksel karşılığı her işlemden sonra doğru veriyi gösterir.
- Her mantıksal veri biriminin tek geçerli güncel kopyası bulunur.
- Güncelleme yalnız silinmiş/boş sayfaya yazılır.
- Geçersiz sayfa boş sayfa gibi kullanılamaz.
- Kaynak blok, içindeki bütün geçerli veri güvenli bir konuma taşınmadan silinemez.
- Taşıma verinin içeriğini ve sürümünü korur. Kullanıcı güncellemesi yeni sürüm oluşturur.
- Geri aşama ve doğrudan aşama seçimi aynı eşleme, veri ve sayaçları yeniden üretir.
- Renkler yardımcıdır. Geçersiz sayfa ayrıca tarama/çizgi ve metinle ayırt edilir.
- Örnek dosya silme işlemiyle başlamaz. Güncellemenin eski sürümü geçersizleştirmesi üzerinden ilerler.

## 6. 1. ve 2. kişinin içerik sınırı

Kullanıcının güncel görev dağılımına göre 1. kişi aygıtların yapısını ve temel özelliklerini açıklar. 2. kişi, 11.2–11.3 kapsamındaki zamanlama anlatımının yanında ayrıntılı flash adresleme ve yönetim örneklerini sunar. GC ve wear leveling açılışa veya 11.1'e alınmaz.

| 1. kişi · 11.1 | 2. kişi · 11.2–11.3 |
| --- | --- |
| Gerçek HDD, SSD ve RAM tanıtımı | HDD ve NVM zamanlaması |
| HDD parçaları ve erişim maliyeti | İstek birleştirme, komut yükü ve aygıt içi paralellik |
| SSD parçaları, sayfa ve blok yapısı | Ayrıntılı mantıksal/fiziksel adresleme ve FTL örneği |
| Temel sayfa yazma ve blok silme kuralları | Güncelleme, geçersiz sayfalar ve canlı veri taşıma örneği |
| Flash dayanıklılığı ve DWPD | Garbage collection ve yazma büyütmesi |
| RAM'in çalışma alanı ve güç ilişkisi | Wear leveling ve ayrılmış çalışma alanı |

11.1'de NAND'ın fiziksel kuralları, 2. kişinin örneği için yeterli temel oluşturur. Ayrıntılı FTL tablosu ve yönetim senaryosu 2. kişide açılır. Aynı blok/sayfa adlandırması korunarak kavramlar bağlanır. Kullanıcı 2. kişinin akışını anlattığında bu bölümün kesin sayfa sırası ayrıca düzenlenir.

Aşağıdaki açıklama ve not taslakları 2. kişinin bölümüne aittir:

### 6.1. Mantıksal ve fiziksel adres

Sol tarafta kısa bir mantıksal adres listesi, sağda bloklar ve sayfalar bulunur. İlk anda tek bir adresin eşlemesi vurgulanır. FTL, mantıksal adresin güncel fiziksel karşılığını tutan eşleme olarak tanımlanır.

Bu anlatım SSD adreslemesidir. RAM'deki sanal adres/fiziksel adres konusuna yeni bir yan anlatım açılmaz. `L0` gibi işaretler örnekte eşit boyutlu mantıksal veri birimlerini temsil eder. Gerçek aygıtta bir LBA ile bir NAND sayfasının aynı boyutta olduğu varsayımı yapılmaz.

**Sayfa notu taslağı:**

> İşletim sistemi veriyi mantıksal adreslerle ister. SSD denetleyicisi bu adresleri NAND üzerindeki fiziksel konumlarla eşler. Verinin fiziksel yeri değiştiğinde mantıksal adres aynı kalabilir. FTL güncel eşlemeyi tutar.

### 6.2. Flash'ta veri güncelleme

Önce L0, ardından L1 güncellenir. Yeni veri boş sayfaya yazılır, eski sayfa geçersiz olur ve eşleme yeni konumu gösterir. Yerleşim sabit kalır. Aynı anda sayfaların yerini değiştiren veya bütün diyagramı yeniden kuran hareketler kullanılmaz.

**Sayfa notu taslağı:**

> L0 güncellendiğinde yeni sürümü boş bir fiziksel sayfaya yazılır. Eski sürüm geçersiz olur ve FTL yeni konumu gösterir. L1 için de aynı işlem gerçekleşir. Geçersiz sayfalar blok silinene kadar doğrudan yeniden kullanılamaz.

### 6.3. Garbage collection

Örnekte eski ve güncel verinin birlikte kaldığı blok gösterilir. Geçersiz sayfaların neden tek tek temizlenemediği, blok silme kuralıyla açıklanır. Geçerli L2/L3 başka bloğa kopyalanır, eşlemeleri güncellenir ve kaynak blok silinir. Yeniden kullanılabilir alanın oluşması örneğin sonucudur.

**Sayfa notu taslağı:**

> Güncellemeler bir blokta geçerli ve geçersiz sayfaları birlikte bırakabilir. Garbage collection, geçerli sayfaları başka bir bloğa kopyalar ve eşlemelerini günceller. Ardından eski bloğu silerek yeniden yazılabilir alan kazanır. Bu taşıma, uygulamanın yeni veri yazmadığı durumda da fiziksel yazma gerektirir.

Güncelleme ve GC'nin teknik ilişkisi [Samsung'un üretici açıklamasıyla](https://semiconductor.samsung.com/news-events/tech-blog/a-brief-history-of-data-placement-technologies/) da karşılaştırıldı. Bu kaynak doğruluk desteğidir. Yeni ürün özellikleri veya yeni bir müfredat eklemek için kullanılmaz.

### 6.4. Wear leveling

GC'nin ardından birikmiş blok silme sayıları gösterilir. Aynı başlangıç ve aynı sayıda yeni silme için, yükün tek bloğa yığılması ile farklı bloklara dağıtılması karşılaştırılır. Önceki aşınma sayıları azaltılmaz. Her blok sayacının anında eşitlenmesi gibi bir sonuç verilmez.

Örnek: başlangıç `[8, 2, 2]` ve üç yeni silme. Tek bloğa yığılmış sonuç `[11, 2, 2]`, dağıtılmış örnek sonuç `[8, 4, 3]` olabilir. Her iki durumda da toplam üç artar. Bunlar gerçek bir ürünün algoritma çıktısı veya ömür tahmini değildir.

**Sayfa notu taslağı:**

> Flash blokları sınırlı sayıda yazma ve silme döngüsüne dayanır. Wear leveling, yeni işlemleri bloklar arasında dağıtarak belirli blokların erken aşınmasını azaltır. Önceden oluşan aşınma silinmez. Garbage collection alan kazanırken wear leveling aşınmanın dağılımını yönetir.

Temel açıklama [KIOXIA'nın wear leveling teknik belgesiyle](https://www.kioxia.com/content/dam/kioxia/shared/business/memory/mlc-nand/asset/productbrief/KIOXIA_Understanding_Wear_Leveling_Tech_Brief.pdf) karşılaştırıldı. Statik/dinamik algoritma türleri ve ayrıntılı ömür ölçüleri bu ilk akışa eklenmez.

## 7. Mevcut sayfaların durumu

| Mevcut kimlik | Planlanan işlem |
| --- | --- |
| `storage-opening` | Sekiz bölüm başlığını içeren yeni ilk ekran |
| `presentation-map` | Açılışla birleştirme. Eski bağlantıyı açılışa yönlendirme |
| `hdd-anatomy` | Fotoğraf, işaretler ve temel açıklamalar korunur |
| `hdd-geometry` | Korunur |
| `hdd-access-cost` | Korunur, sayfa notu sadeleştirilir |
| `hdd-request-size` | Başlangıç planında korunur, gerekirse ayrıntıya alınabilir |
| `hdd-history` | Sunum rotalarından, menüden ve güncel notlardan çıkarılır |
| `hdd-performance-metrics` | Yeni ana sıranın dışında ek içerik önerisi |
| `nvm-device` | Gerçek parça anlatımına odaklanır |
| `flash-page-block` | Ortak flash modelini kullanan yapı ve işlem kuralları sayfası olur |
| `flash-endurance` | Dayanıklılık ve DWPD açıklaması 11.1 ana akışında korunur |
| `ram-disk` | Yeni RAM açıklamasına yönlenir. RAM disk anlatımı ana akıştan çıkar |
| `logical-blocks` | 2. kişinin ayrıntılı SSD adresleme örneğiyle kavramsal bağlantısı kurulur. HDD'ye özgü ayrıntılı geometri eşlemesi ek içerik olarak değerlendirilebilir |
| `magnetic-tape` | Sunum rotalarından, menüden ve güncel notlardan çıkarılır |
| `storage-data-path` | Bu mesajda tarif edilen sıranın dışında kalan mevcut konu. Ayrıntı/ek içerik önerisi |
| `flash-write-amplification` | Adresleme, veri taşıma, GC ve yazma büyütmesi örneği 2. kişinin bölümünde korunur |
| `nvm-management-summary` | Wear leveling ve ayrılmış çalışma alanı 2. kişinin bölümünde kalır |

Teyp ve HDD tarihçesi, kullanıcının güncel kararıyla sunumdan çıkarılır. DWPD ana akışta korunur. Veri yolu ve ek performans sayfalarının yerleşimi ayrıca değerlendirilir. Varsayılan bütün-sahneler rotası bunları otomatik araya sokuyorsa rota da yeni akışla birlikte düzenlenmelidir. Mevcut ana/ayrıntılı rota mekanizması bu iş için yeterlidir. Yeni bir gezinme sistemi kurmak gerekmiyor.

## 8. Notların yeni standardı

### Görünür içerik

Her sayfanın notunda sayfa başlığı ve kısa konu açıklaması bulunur. Hesap sayfaları gerekli formül veya sonucu içerebilir. Not uzunluğu, cümle sayısı, soru veya aşama başına ayrı metin için zorunlu denetim uygulanmaz.

| Mevcut unsur | Yeni yaklaşım |
| --- | --- |
| Şimdi anlat | Sayfanın konu açıklaması |
| Bütün aşamaların anlatımı | Zorunlu aşama konuşmaları kaldırılır |
| Dinleyiciye sor / beklenen gerekçe | Notlardan kaldırılır |
| Sonraki sahneye geçiş | Notlardan kaldırılır |
| Öğrenme hedefi | Ayrı tekrar bölümü olmaz |
| Bu sahneden çıkarım | Aynı bilgiyi tekrar eden ayrı kutu olmaz |
| Modelin sınırları ve kaynak | İlgili teknik ayrıntılar Kaynaklar bölümünde tutulur |
| Sunucuya yönelik eylemler | “Gösterin”, “sorun”, “vurgulayın”, “burada bekleyin” gibi ifadeler kullanılmaz |

Notlar, ekrandaki durumu anlamayı sağlayan açıklamaları içerir. “İlk aşamada bunu söyleyin” veya “sonraki sayfaya böyle geçin” gibi sunum yöntemleri içermez. Aşama değişimlerinin kısa açıklamaları gerektiğinde doğrudan sayfa alt yazısında bulunabilir.

### Uygulama yaklaşımı

- Nihai not veri yapısı tek bir açıklama alanına indirilebilir: `explanation`.
- Bütün bölümlerin notları aynı standarda dönüştürülür. İçerik sırası henüz değişmeyen 11.2–11.8 ve kapanış için de yalnız sayfa açıklaması yazılır.
- Önce bütün sayfalar için açıklamalar hazırlanır. Ortak panel ve veri tipi daha sonra birlikte geçirilir.
- Kaynakların ve teknik model bilgilerinin mevcut ayrı eşleme yapısında tutulması sürer. Kaynaklar sekmesi geçerli sayfanın dayanağını da gösterecek şekilde düzenlenir.
- 11.1'de ekranda gösterilen `hardwareCaptions` şu anda not dosyasından geliyor. Notları değiştirmeden önce bu altyazılar ayrı içerik dosyasına ayrılır.
- Çevrimdışı notlar yeni panelden yeniden üretilir. Eski soru, prova ve geçiş metinleri üretilen HTML'de kalmaz.
- Prova belgeleri yeni not içeriğinin kaynağı olarak kullanılmaz. Güncel akışla çelişen bölümleri uygulama sonrasında güncellenir veya tarihçe olarak belirtilir.

## 9. Değişikliklerin uygulanacağı parçalar

### Parça 1 — Açılış, bölüm haritası ve ortak cihaz tanıtımı

Sekiz başlığı ilk anda gösteren sayfa hazırlanır. Bölüm bağlantıları gerçek ilk sayfalara bağlanır. Kapak/harita birleştirilir. Menüde bölüm başlıklarına göre gruplama yapılır. 11.1'in ilk sayfasında üç gerçek fotoğraf birlikte yer alır ve çalışma alanı/kalıcı depolama görevleri açıklanır.

**Tamamlanma ölçütü:** Kökte açılan sunumda 11.1–11.8 başlıkları birlikte görünür. Her başlık doğru bölümü açar. 11.1 önce üç cihazın ortak tanıtımını açar.

### Parça 2 — HDD anlatımının bağlanması

Mevcut HDD anlatımı ortak cihaz tanıtımının arkasına bağlanır. Gerçek parça işaretleri, geometri ve erişim açıklamaları korunur. HDD tarihçesi rotalardan, menüden ve güncel notlardan çıkarılır. HDD notları yeni dille yazılır.

**Tamamlanma ölçütü:** Üç cihaz ilk tanıtımda birlikte görünür. HDD parça işaretleri fotoğraftaki doğru konumları gösterir. HDD'den NVM'ye geçişte konu dışı ek sayfa araya girmez.

### Parça 3 — SSD parçaları, sayfa/blok ve DWPD

Gerçek iç kartın kısa parça açıklamaları hazırlanır. Sayfa/blok yapısı ve okuma/yazma/silme birimleri gösterilir. Mevcut dayanıklılık ve DWPD sayfası ana akışta korunur. Ayrıntılı adresleme ve yönetim örneği 2. kişinin bölümünde kalır.

**Tamamlanma ölçütü:** Fotoğraf parçaları doğru adlandırılır. Yapı diyagramında sayfa ile silme bloğu farklıdır. DWPD örneği 11.1 ana akışında görünür. NAND kuralları bütün NVM türlerinin değişmez özelliği gibi sunulmaz.

### Parça 4 — 2. kişinin adresleme ve flash yönetimi örneği

Mevcut saf durum modeli 2. kişinin bölümünde kalır. Adresleme, iki güncelleme, canlı veri taşıma ve silme aynı durum dizisinden üretilir. Wear leveling bunun ardından ayrı amaçla açıklanır. Bu içeriğin 11.1'e taşınması planlanmaz. Ayrıntılı sayfa sırası 2. kişinin akışı tarif edildiğinde kesinleşir.

**Tamamlanma ölçütü:** Fiziksel yer değişirken mantıksal adresin korunduğu görülür. Geçerli veri kaybolmadan blok silinir. Boş alan ihtiyacının GC ile ilişkisi anlaşılır. Wear leveling örneğinde toplam işlem sayısı korunur ve geçmiş aşınma azalmaz.

### Parça 5 — RAM ve son karşılaştırma

RAM disk akışı yeni RAM sayfasıyla değiştirilir. Güç bağımlılığı gösterilir. Teyp sayfası rotalardan, menüden ve güncel notlardan çıkarılır. Üç cihazın karşılaştırmasıyla 11.1 tamamlanır.

**Tamamlanma ölçütü:** RAM'in çalışma alanı olduğu açıklanır. Güç kesilip geri geldiğinde eski içerik dönmez. RAM disk/dosya sistemi zinciri ana akışta görünmez.

### Parça 6 — Bütün notlar ve son eşleme

Ortak not yapısı ve bütün bölüm notları yeni standarda geçirilir. Çevrimdışı notlar üretilir. Kaynaklar, sahne sözleşmesi, bağlantılar ve güncel belge açıklamaları yeni sırayla eşleştirilir.

**Tamamlanma ölçütü:** Açılıştan kapanışa kadar her sayfada konu açıklaması vardır. Notlarda sunum yönergesi, zorunlu dinleyici sorusu veya geçiş konuşması kalmaz. Görünen açıklama ile çevrimdışı dosya aynı içeriği taşır.

## 10. Teknik değişiklik haritası

Bu bölüm uygulama içindir. Buradaki dosya ve model bilgileri sunumun sayfa metinlerine veya notlarına taşınmaz.

| Alan | Başlıca dosyalar | Değişiklik |
| --- | --- | --- |
| Açılış | `src/chapters/opening/scenes.tsx`, `src/components/VisualScenes.tsx` | Kapak ve dört gruplu harita yerine sekiz başlıklı giriş |
| Ortak dizin ve menü | `src/presentation/registry.ts`, `src/presentation/SideMenu.tsx` | Yeni sıra, bölüm grupları, hedef sayfalar ve kaynak sekmesi |
| 11.1 sırası | `src/chapters/chapter-11-1/curriculum.json`, `scenes.tsx`, `stages.ts` | Yeni sayfalar ve anlamlı aşamalar |
| Donanım sayfaları | `src/chapters/chapter-11-1/components/StorageScenes.tsx`, `CostScenes.tsx` | Ortak tanıtım, SSD yapısı ve yeni RAM anlatımı |
| Fotoğraf altyapısı | `HardwarePhoto.tsx`, `hardware-parts.mjs`, `hardware-photo.css` | Gereken yerleşim uyarlamaları. Gerçek parça koordinatları korunur |
| Flash modeli | `src/chapters/chapter-11-2-3/model.ts`, `FlashLab.tsx` | Ayrıntılı modeli 2. kişinin bölümünde koruma. 11.1'de temel yapı ve işlem kuralları gösterilir |
| 11.3 içeriği | `NvmScenes.tsx`, `curriculum.json`, `notes.ts` | Adresleme, GC ve wear leveling'i 2. kişinin kapsamında tutma |
| Not yapısı | `src/presentation/types.ts`, `NotesPanel.tsx`, bütün bölüm not dosyaları | Sayfa açıklaması standardı |
| Ekran altyazıları | 11.1 `notes.ts` içindeki `hardwareCaptions` ve kullanan bileşenler | Notlardan bağımsız içerik dosyasına ayırma |
| Kaynaklar | `src/presentation/textbook.ts`, `src/data/content.ts` | Yeni sayfalara doğru kitap/slayt dayanağı |
| Görünüm ve geçiş | `src/styles.css`, `src/presentation/motion-presets.mjs` | Yeni sayfaların yerleşimi ve hareket eşlemeleri |
| İçerik sözleşmesi | `docs/presentation-contract.json`, `scripts/check-content.mjs` | Yeni sıra ve sade not koşulları |
| Çevrimdışı çıktı | `scripts/build-notes.mjs`, `public/references/sunum-notlari.html` | Yeni notların üretimi |
| Belgeler | `README.md`, ilgili güncel akış ve prova belgeleri | Yeni sayfa sayısı, bölüm akışı ve not tanımı |

Yeni sayfalarda kimlikler sayfa numarasına bağlanmaz. Korunan sayfaların kimliği korunur. Birleşen veya kaldırılan sayfaların eski adresleri karşılık gelen yeni sayfaya yönlendirilir. Örneğin eski RAM disk bağlantısı yeni RAM açıklamasını, eski harita bağlantısı sekiz başlıklı açılışı açabilir. Birleşen kimlikler hem gerçek sayfa kimliği hem yönlendirme olarak iki kez tanımlanmaz.

## 11. Sadelik ve kabul ölçütleri

### İçerik

1. İlk ekranda sekiz bölüm başlığı eksiksizdir.
2. 11.1 ilk açıldığında HDD, SSD ve RAM birlikte görünür.
3. Ana sıra HDD, NVM/SSD, RAM şeklindedir.
4. HDD'nin kullanılabilir mevcut açıklamaları korunur.
5. Gerçek SSD parçaları ile kavramsal sayfa/blok diyagramı birbirine bağlanır.
6. Ayrıntılı mantıksal/fiziksel adres, güncelleme ve GC örneği 2. kişinin bölümünde kalır.
7. 2. kişi GC'nin amacını alan kazanma, wear leveling'in amacını aşınmayı dağıtma üzerinden açıklar.
8. DWPD, 11.1 ana akışında örnek hesabıyla korunur.
9. RAM'in görev ve güç ilişkisi açıktır. RAM drive konusu zorunlu değildir.
10. Teyp ve HDD tarihçesi sunum rotalarında ve güncel notlarda yer almaz.

### Görsel dil

- Her sayfada bir ana görsel ve onu açıklayan kısa metin bulunur.
- Donanımın fiziksel görünüşü gerçek fotoğrafla verilir.
- Kavramsal düzenler küçük, açık ve tutarlı diyagramlarla verilir.
- Kalıcı kutular, renkler, adresler ve etiketler aşamalar arasında yer değiştirmez.
- Uzun metni sığdırmak için yazıyı küçültmek yerine içerik bölünür veya kısaltılır.
- Ekrandaki kontroller aynı işlemi tekrar eden düğmelerle çoğaltılmaz.
- Dekoratif hareket yerine değişen veri, konum ve ilişki görünür hale getirilir.

### Notlar

- Notlar yalnızca sayfanın konusunu ve gerekli açıklamasını içerir.
- Aynı çıkarımı tekrar eden ayrı bölümler olmaz.
- Sunum tekniği ve sunucu yönlendirmesi bulunmaz.
- Kaynaklar ayrı alanda erişilebilir kalır.

### Denetim

- Mevcut gezinme, HDD, zamanlama, swap ve RAID testleri korunur.
- Değişen flash modeli için eşleme doğruluğu, geçerli veri korunumu, silme önkoşulu ve geri aşama tutarlılığı test edilir.
- Wear leveling örneğinde sayaçların azalmadığı ve iki karşılaştırmanın eşit sayıda yeni işlem içerdiği doğrulanır.
- İlk ekranda sekiz başlık ve doğru bölüm hedefleri denetlenir.
- Kullanıcının son talebiyle aşama sayısını, aşama adlarını ve her aşamanın farklı görünmesini zorunlu tutan içerik denetimleri kaldırılır.
- Not biçimi, uzunluğu, soru, geçiş cümlesi ve aşamayla birebir eşleşme kuralları kaldırılır. Yerlerine yeni not kuralları konmaz.
- Eski sözleşmeye içerik dayatan eşitlik denetimleri kaldırılır. JSON dosyası güncel içerik dökümü olarak tutulur. Sayfa açılışı, bağlantılar ve yerel görseller için temel kontrol kalır.
- İşlem modellerinin testleri ve üretim derlemesi çalıştırılır. Her aşamayı hareket açık/kapalı veya ileri/geri sırada tekrar tekrar oluşturan kontrol kaldırılır.
- Statik denetimlerin gerçek ekrandaki okunurluğu kanıtlamadığı belirtilir. Depodaki mevcut tarayıcı kullanmama sınırı korunur.

## 12. Bu planın sınırı

Açılış ve 11.1 için uygulanabilir sıra, örnek veri, not taslakları ve teknik bağımlılıklar hazırdır. 11.2–11.8'in yeni ayrıntılı akışı, kullanıcının sonraki tarifleriyle bölüm bölüm şekillenecektir. Bu bölümlerde şu an önerilen ortak değişiklik not standardıdır. Ayrıntılı adresleme, GC ve wear leveling 2. kişinin kapsamında korunur. Bu içeriğin 11.1'e taşınması kaldırılmıştır.

Tam kitap metni yerel depoda bulunmadığından sayfa/satır düzeyinde kitap doğrulaması iddia edilmez. Bölüm başlıkları resmî içindekilerle, temel HDD/NAND/RAM kapsamı yazarların resmî Chapter 11 slaytlarıyla karşılaştırıldı. Üretici belgeleri yalnız flash mekanizmasının doğruluk kontrolünde kullanıldı.

Uygulamadaki ilk somut parça, sekiz başlıklı açılış ile HDD–SSD–RAM ortak tanıtımıdır.
