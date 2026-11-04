# 3. sunucu prova rehberi — doğruluk, aygıt hazırlığı ve swap

**Kapsam:** Operating System Concepts, Tenth Edition, §11.4–11.6. **Sorumlu:** 3. kişi. **Rota hedefi:** kısa 9:00, tam 16:00. Bu süreler prova hedefidir; gerçek sunumda ölçülmüş süre değildir.

Bu rehber yeni anlamsal sahne kimliklerine bağlıdır. Ana plandaki dokuz sahnenin sekizi kısa rotadadır; `storage-access-modes` yalnız tam rotada bulunur. Kısa rotanın 41, tam rotanın 45 aşaması vardır. Bütün aşamalar her iki yönde seçilebilir.

**Kaynak sınırı:** Tam kitap metni yerel depoda bulunmuyor. Bölümler resmî içindekilerle; kavram ve örnek çerçevesi yazarların 47 slaytlık Chapter 11 materyaliyle denetlendi. Tam kitabın sayfa/paragraf düzeyinde karşılaştırıldığı iddia edilmez. Türkçe konuşmalar, sorular ve küçük modeller bu projeye aittir.

Kaynaklar: [resmî Chapter 11 slaytları](https://os-book.com/OS10/slide-dir/PPTX-dir/ch11.pptx), [resmî içindekiler](https://os-book.com/OS10/toc-dir/toc.pdf), [resmî tekrar soruları](https://os-book.com/OS10/review-dir/11-rev.pdf). Ayrıntılı tasarım: [3. sunucu bölüm planı](bolum-planlari/03-dogruluk-yonetim-swap.md).

## Açılış ve kişi değişimi

**2. kişinin son cümlesi:** “HDD'de hareketi, flash'ta kuyruk ve iç işleri yönettik. Sıranın hızlı olması verinin sağlam olduğu anlamına geliyor mu?”

**3. kişinin ilk cümlesi:** “Önce o ayrımı yapalım. Aygıttan okuduğumuz bitler değişmiş olabilir; bunu sakladığımız ek bilgiyle denetleyebiliriz.”

## Tuş kartı

- Sunum alanında **Enter:** sonraki aşama; **Backspace:** önceki aşama. İlk/son aşamada kalınır.
- **Sol/sağ ok:** önceki/sonraki sahne; aşama değiştirmek için kullanılmaz.
- Aşama listesinden ismi seçmek aynı durumu doğrudan açar. Tekrar Enter/Backspace kullanmadan önce odağı sunum alanına döndürün; açık menü ve form kontrolleri kendi tuş davranışını korur.
- **N:** notlar; **M:** menü; **Space:** hareketi duraklat/aç. Hareket, dersin durumunu kendiliğinden ilerletmez.
- Sahne içi sıfırla yalnız seçili sahnenin ilk aşamasına gider. Gerçek depolama aygıtında işlem veya geri alma yapılmaz.

## Süre çizelgesi

| Sahne | Kısa | Tam | Aşama |
|---|---:|---:|---:|
| `error-detection` | 1:15 | 2:00 | 4 |
| `error-correction` | 0:45 | 1:15 | 5 |
| `device-preparation` | 1:45 | 2:30 | 6 |
| `storage-access-modes` | 0:00 | 1:30 | 4 |
| `boot-sequence` | 1:00 | 1:45 | 5 |
| `bad-block-remapping` | 0:45 | 1:15 | 3 |
| `swap-space` | 1:00 | 1:30 | 5 |
| `swap-journey` | 1:45 | 2:45 | 7 |
| `management-decisions` | 0:45 | 1:30 | 6 |
| **Toplam** | **9:00** | **16:00** | **41 / 45** |

Kısa rota: 0:00–2:00 doğruluk/ECC; 2:00–3:45 hazırlama; 3:45–5:30 boot/remap; 5:30–8:15 swap; 8:15–9:00 kontrol ve teslim.

Tam rota: 0:00–3:15 doğruluk/ECC; 3:15–7:15 hazırlama + raw uzantısı; 7:15–10:15 boot/remap; 10:15–14:30 swap; 14:30–16:00 kontrol ve teslim. Soru beklemeleri bu sürelerin içindedir.

## 1. Veri bozulduğunu nasıl anlarız? — `error-detection`

**Kaynak:** §11.4, resmî slayt 27. **Süre:** kısa 1:15, tam 2:00.

**Söylenecek cümleler:** Veri ilk yazılırken küçük bir denetim bilgisi de saklıyoruz. Bir bit değişirse aynı saklanan bilgiyle tutarsızlık bulabiliriz. İki bit değiştiğinde ise parite yeniden korunabilir. Dolayısıyla bu kontrolün hata bulmaması, verinin kesin doğru olduğu anlamına gelmez. Checksum ve CRC gibi diğer yöntemlerin de kendi hata kapsaması vardır.

**Aşama sırası:** 1. Saklanan denetim bilgisi → 2. Tek bit değişimi → 3. Çift hata sınırı → 4. Diğer denetim yöntemleri.

**Tuş ve demo hareketleri:**

- Başlangıçta dört adet 1 ve P=0 birlikte çifttir. Saklanan P değeri deney boyunca değişmeyecek; okunan bozuk veriden yeniden üretilmeyecek.
- Enter ile 1001001 tek bit hatasına geçin: toplam 1 sayısı üç olur ve kontrol hata saptar. Dinleyiciye hangi bitin bozuk olduğunun bu tek kontrolden çıkıp çıkmadığını sorun.
- Sonraki aşama yeni iki bit hata örneğidir: 0111001 için dört adet 1 vardır. Veri değişmiştir ama parite kontrolü hata bulmaz. Bu, hatasızlık kanıtı değildir.
- Son aşamada parite, checksum ve CRC kartlarını gösterin. Bunların denetim bilgisini farklı yöntemlerle ürettiğini, kapsamanın yönteme bağlı olduğunu söyleyin. Backspace aynı bit dizilerini ve hesapları geri getirir.

**Dinleyiciye soru:** Parite hatayı bulunca bozuk bitin yerini biliyor muyuz?

**Beklenen gerekçe:** Hayır. Tek kontrol sonucu bozulmayı gösterebilir; hangi bitin bozuk olduğunu ve doğru değerini belirlemez.

**Dikkat:** P bozuk okumadan yeniden hesaplanmaz. Turuncu işaretler gerçek denetleyicinin bildiği hata yerleri değildir. CRC bütün olası hataları veya kötü niyetli değişikliği yakalar demeyin.

**Geçiş:** Uygun ek kodlama, yalnız hata bildirmekten fazlasını yapabilir mi?

## 2. Tespit etmek, düzeltmek değildir — `error-correction`

**Kaynak:** §11.4, resmî slayt 27. **Süre:** kısa 0:45, tam 1:15.

**Söylenecek cümleler:** Burada asıl fikir bir algoritma adı değil, ek bilginin neye yettiği. Üst satır hatayı bildiriyor; alt satırdaki özgün küçük kod örneği bir bitin konumunu çıkarıp düzeltiyor. İki bit değiştiğinde bu örnek düzeltemiyor. Ekrandaki bir ve iki sayıları bütün disklerin kapasitesi değildir.

**Aşama sırası:** 1. Veri ve ek kod → 2. Tek bozuk bit → 3. Tespit ve düzeltme → 4. İki bozuk bit → 5. Kodun sınırı.

**Tuş ve demo hareketleri:**

- İlk aşamada sağlam veri ve ek kodu gösterin. Buradaki ana konu algoritma adı veya bit konumları değil, ek bilginin neye yettiğidir.
- İkinci aşama tek hatalı okumadır. Tahmin alın; üçüncü aşamada parite yalnız hata bildirirken örnek ECC motoru bozuk biti hesaplayıp düzeltir.
- Dördüncü aşamada başlangıç kodunun yeni iki hatalı okuması açılır. Beşinci aşamada parite hata kaçırır; bu ECC örneği hatayı saptar ama düzeltemez. Bozuk bitler yerinde kalır.
- Backspace kontrol öncesi okumayı geri getirir; düzeltilmiş bit yeniden bozuk olur ve sonuç etiketi gizlenir. Gizli cevap veya düzeltme durumu saklanmaz.

**Dinleyiciye soru:** ECC kullanan bütün aygıtlar aynı sayıda biti düzeltebilir mi?

**Beklenen gerekçe:** Hayır. Kodun yapısı ve tasarlandığı hata modeli belirler; bu örneğin sınırı evrensel değildir.

**Dikkat:** Hamming konumları/sendromu bu dersin konusu yapılmaz. Gerçek motorun 1 düzeltme / 2 tespit sınırı bütün ECC aygıtlarına genellenmez.

**Geçiş:** Doğruluğu denetledik. Aygıtı dosya saklayabilir hale getirmek için hangi katmanlar hazırlanır?

## 3. Ham ortamdan dosyaya — `device-preparation`

**Kaynak:** §11.5, resmî slayt 28, 29. **Süre:** kısa 1:45, tam 2:30.

**Söylenecek cümleler:** İlk ayrım donanımın işleyebileceği sektör düzenidir. Bölümleme alanı mantıksal bölgelere ayırır. Dosya sistemi dosya ve dizinleri yönetmek için kendi metaverisini oluşturur. Bağlama bu dosya sistemini işletim sisteminde erişilebilir yapar. Alan ayırdığımız anda dosya saklayabileceğimiz sonucu çıkmaz.

**Aşama sırası:** 1. Ham ortam → 2. Fiziksel biçim → 3. Bölümleme → 4. Dosya sistemi → 5. Bağlama → 6. Dosya erişimi.

**Tuş ve demo hareketleri:**

- Ham ortamla başlayın. Enter ile denetleyicinin okuyup yazabildiği sektör ızgarasını açın; başlık, veri ve ECC ayrımını önceki sahneye bağlayın.
- Bölümleme aşaması alanı iki mantıksal bölüme ayırır. Dosya sistemi henüz yoktur; iki bölüm iki fiziksel disk değildir.
- Dosya sistemi aşamasında Bölüm 1 metaverisi görünür. Sonraki aşama onu OS ad alanına bağlar; bağlantı oku erişilebilirliği gösterir.
- Son aşamada yalnız bağlı dosya sistemine sunum.pdf örneği eklenir. Backspace ile dosya, bağlama, metaveri ve bölüm ayrımını ters sırada kaldırın; bunun gerçek biçimlendirmeyi geri almak olmadığını söyleyin.

**Dinleyiciye soru:** Bölüm oluşturunca dosya sistemi de oluşmuş olur mu?

**Beklenen gerekçe:** Hayır. Bölüm alanı ayırır; dosya/dizin ve tahsis yapıları ayrıca oluşturulur.

**Dikkat:** İki bölüm iki fiziksel disk değildir. Fiziksel biçim her kullanıcı kurulumu için zorunlu komut değildir. Sahneyi geriye almak gerçek biçimlendirmeyi geri alma vaadi değildir.

**Geçiş:** Kısa rotada kernel daha çalışmadan bu depolamaya kimin ulaştığını soracağız. Tam rotada önce dosya yolu ile raw blok yolunu ayıracağız.

## 4. Blokları kim yönetiyor? — `storage-access-modes`

**Kaynak:** §11.5, resmî slayt 28, 29, 30. **Süre:** kısa 0:00, tam 1:30.

**Söylenecek cümleler:** Aygıt bloklar sunar; dosya sistemi bunun üzerinde kendi düzenini kurar. Normal dosya yolunda uygulama dosya sistemi hizmetini kullanır. Raw erişimde uygulama blok yönetimini kendisi üstlenmek isteyebilir; kitap veritabanını örnek verir. Raw, bütün OS sürücülerinin aradan çıktığı demek değildir.

**Aşama sırası:** 1. Aygıt blokları → 2. Dosya sistemi gruplaması → 3. Normal dosya yolu → 4. Raw erişim.

**Tuş ve demo hareketleri:**

- İlk aşamada aygıtın mantıksal bloklarını gösterin. Bunlar dosya adı veya dizin değildir.
- Cluster aşamasında dört örnek blok bir çerçevede gruplanır. Grup boyutu gerçek bir dosya sistemi standardı değildir; kaynakta geçen gruplama fikrini somutlaştırır.
- Normal yol uygulama→dosya sistemi→OS I/O→blok aygıtıdır. Dosya sistemi dosya işlemlerini kendi blok düzenine çevirir.
- Raw aşamada veritabanı kendi blok düzenini üstlenir. OS I/O ve sürücü kutusunun kaybolmadığını özellikle gösterin. Backspace aynı iki sorumluluk sınırını tekrar açar.

**Dinleyiciye soru:** Raw blok erişimi dosya ve dizin hizmetlerini otomatik sağlar mı?

**Beklenen gerekçe:** Hayır. Bu düzeni uygulama veya uygun başka bir katman sağlamalıdır.

**Dikkat:** Yalnız tam rotada bulunur. Dört blokluk cluster ürün standardı değildir. Raw yolun sürücüleri atladığını veya her dosya çağrısının cluster büyüklüğünde olduğunu söylemeyin.

**Geçiş:** Dosya sistemiyle blokları ayırdık. Açılış kodu kernel görüntüsünü depolamadan RAM'e nasıl getirir?

## 5. Kernel'den önce hangi kod çalışır? — `boot-sequence`

**Kaynak:** §11.5, resmî slayt 29, 30. **Süre:** kısa 1:00, tam 1:45.

**Söylenecek cümleler:** OS daha çalışmıyorken ilk kod firmware içinde hazırdır. Açılış aygıtındaki kod sonraki yükleyiciye veya boot volume'a ulaşabilir. Yükleyici kernel görüntüsünü bulur, RAM'e getirir ve denetimi ona devreder. Bütün yükleyicinin ilk küçük boot block'a sığması gerektiğini düşünmeyin.

**Aşama sırası:** 1. İlk kod sorusu → 2. ROM / firmware → 3. Boot block → 4. Yükleyici → 5. Kernel RAM'de.

**Tuş ve demo hareketleri:**

- İlk soruda durun: kernel RAM'de değilse ilk komutu kim başlatır? Enter ile ROM/firmware kutusunu etkinleştirin.
- Boot block aşamasında denetimin seçilen açılış aygıtındaki koda geçişini gösterin. Boot block sonraki yükleyiciye veya boot volume'a ulaşabilir.
- Yükleyici aşamasında kernel görüntüsünden RAM'e yükleme yolu açılır. Bütün yükleyicinin ilk küçük boot block'a sığması gerekmediğini belirtin.
- Son aşamada denetim RAM'deki kernel'e geçer. Tam anlatımda resmî slayt 30'un Windows örneğinde MBR'nin boot code ve partition table içerdiğini, boot partition'a uzanan belirli bir düzen gösterdiğini bir cümleyle anın.

**Dinleyiciye soru:** Boot block ile kernel aynı şey mi?

**Beklenen gerekçe:** Hayır. Açılış kodu kernel'e ulaşan yolun parçasıdır; kernel yüklenecek OS kodudur.

**Dikkat:** Kitabın Windows/MBR şekli tarihsel ve belirli bir örnektir. MBR içinde boot code ve partition table, sonra boot partition gösterilir; bu figür yerel resmî slayt 30 içinde doğrulandı. UEFI/GPT/ESP, Secure Boot ve initramfs dalı açmayın.

**Geçiş:** Açılışta da normal I/O'da da fiziksel ortam var. Bir sektör kullanılamaz hale gelirse mantıksal adres ne olur?

## 6. Adres aynı kalırken yer değişebilir — `bad-block-remapping`

**Kaynak:** §11.5, resmî slayt 30. **Süre:** kısa 0:45, tam 1:15.

**Söylenecek cümleler:** OS bir mantıksal blok ister; fiziksel yeri aygıt yönetebilir. P45 bozulunca LBA 5 numarasını değiştirmek yerine yedek P90 konumuna yönlendirebiliriz. Fakat okunamayan eski içeriği yalnız adresi değiştirerek elde edemeyiz. Adres devamlılığı ve veri kurtarma ayrı iddialardır.

**Aşama sırası:** 1. Geçerli eşleme → 2. Sektör arızası → 3. Sector sparing.

**Tuş ve demo hareketleri:**

- LBA5→P45 kartını okuyun. Kimliklerin dosya adı veya gerçek plaka koordinatı olmadığını belirtin.
- İkinci aşamada P45 arızalıdır. Mantıksal adres hâlâ5; aygıtta erişim sorunu görünür.
- Son aşama sector sparing örneğidir: yedek P90 etkinleşir, aynı LBA korunur. Eski içerik okunamıyorsa yalnız adres değiştirerek geri gelmediğini söyleyin.

**Dinleyiciye soru:** Yeniden eşleme okunamayan eski veriyi kesin kurtarır mı?

**Beklenen gerekçe:** Hayır. Adres devamlılığı ve veri kurtarma farklı iddialardır.

**Dikkat:** P45/P90 geometri hesabı değildir. Yeniden eşleme okunamayan veriyi tek başına geri getirmez. Bu sektör arızası örneğini normal SSD FTL güncellemesiyle özdeşleştirmeyin.

**Geçiş:** Bu aygıt yalnız normal dosyalara değil, RAM'den taşınan içerik için arka alana da yer sağlar.

## 7. RAM yetmezse neyi, nereye taşırız? — `swap-space`

**Kaynak:** §11.6, resmî slayt 31. **Süre:** kısa 1:00, tam 1:30.

**Söylenecek cümleler:** Kitap bütün sürecin swapping'i ile sayfaların paging'ini ayırır. Birazdan yalnız P sayfasını izleyeceğiz. Swap alanı dosya veya ayrı bölüm içinde sağlanabilir; birden fazla alan I/O yükünü paylaşabilir. Bunlar RAM hızında ek bellek kazandırmaz; arka alan ve taşıma maliyeti getirir.

**Aşama sırası:** 1. RAM baskısı → 2. Taşınan birim → 3. Swap dosyası → 4. Raw bölüm → 5. Birden çok alan.

**Tuş ve demo hareketleri:**

- RAM'in sınırlı alanını gösterin. Yeni içerik için arka alan gerekebilir; swap RAM hızını artırmaz.
- Süreç bütünü ile sayfa taşınmasını ayırın. Sonraki modelde yalnız P sayfası seçilir; süreç değiştirme veya aday seçme algoritması anlatılmaz.
- Dosya aşamasında swap dosyası dosya sistemi içinde çizilir. Raw bölüm aşamasında bu katman yerine ayrılmış alan görünür.
- Son aşamada iki alanın I/O yükünü paylaşma fikrini gösterin. Kitabın dedicated device ve multiple swap bağlamını güncel bütün sistemler için satın alma veya sabit hız önerisi yapmayın.

**Dinleyiciye soru:** Swap alanı büyüyünce RAM'in erişim hızı artar mı?

**Beklenen gerekçe:** Hayır. Ek arka alan sağlanır; taşıma ve depolama I/O maliyeti sürer.

**Dikkat:** Swap RAM'in hızını artırmaz. RAM×2 gibi evrensel kapasite önerisi yoktur. Kitaptaki Linux örneğini güncel kernel veri yapısı olarak anlatmayın.

**Geçiş:** Alanı seçtik. P sayfası dışarı giderken ve geri gelirken hangi konumlar değişir?

## 8. Bir sayfanın dışarı ve geri yolculuğu — `swap-journey`

**Kaynak:** §11.6, resmî slayt 31. **Süre:** kısa 1:45, tam 2:45.

**Söylenecek cümleler:** P sayfanın kimliği; F0 ve S0 farklı ortamların konumlarıdır. Önce hedef ayrılır. Yazma sürerken RAM'deki güncel içeriği bırakmıyoruz. Yazma tamamlanınca RAM yeri boşalabilir. P tekrar gerektiğinde bir RAM hedefi ve okuma gerekir. Bu örnek geri okuma tamamlanınca swap slot'unu bırakmayı seçiyor; bütün OS politikalarının aynı olduğu iddiası yok.

**Aşama sırası:** 1. RAM'deki P → 2. Hedef ayır → 3. Dışarı yaz → 4. Yazma tamam → 5. Yeniden eriş → 6. Okuma tamam → 7. Maliyet ve kimlik.

**Tuş ve demo hareketleri:**

- P F0'da, S0 boştur. Hedef ayır aşamasında S0 P için ayrılır ama veri henüz geçerli değildir; F0 dolu kalır.
- Dışarı yaz aşamasında RAM→swap oku açılır. Animasyon bitse bile tamamlanma yoktur; Enter ile Yazma tamam aşaması seçilince F0 boşalır, S0 geçerli olur ve yazma 1 olur.
- Yeniden eriş aşamasında S0→F0 okuması başlar; F0 henüz boştur. Sonraki açık tamamlanmada P F0'a gelir ve okuma 1 olur.
- Bu model geri okuma tamamlandığında S0'ı bırakmayı seçer. Bunun bütün OS'lerin zorunlu politikası olmadığını belirtin. Son aşama aynı P kimliğini ve 1 yazma + 1 okuma yolunu birleştirir.
- Backspace veya aşama listesi aynı modeli başlangıçtan yeniden üretir; konumlar, rezerv, pending ve sayaçlar geçmiş görünümü eksiksiz geri getirir.

**Dinleyiciye soru:** Yazmanın başlaması RAM frame'ini hemen bırakmaya yeter mi?

**Beklenen gerekçe:** Bu örnekte hayır. Güncel içerik korunmadan aktarım tamamlanmış sayılamaz.

**Dikkat:** Her sayfa mutlaka dışarı yazılır sonucu çıkarılmaz; örnekte güncel içeriğin korunması gereken P seçildi. Slot bırakma model tercihidir. Gerçek page replacement, temiz dosya tahliyesi ve swap cache bu yalın akışa eklenmez.

**Geçiş:** Doğruluğu, aygıt hazırlığını ve arka alanı ayrı ayrı yönettik; üç ayrımı birlikte kontrol edelim.

## 9. Üç sorumluluğu ayır — `management-decisions`

**Kaynak:** §11.4–11.6, resmî slayt 27, 28, 29, 30, 31. **Süre:** kısa 0:45, tam 1:30.

**Söylenecek cümleler:** Üç farklı tamamlanma iddiasını ayırdık. Kontrolün geçmesi kesin doğruluk değil. Alanın ayrılması dosya sistemi değil. Yazmanın başlaması da tamamlanmış aktarım değil. Her karar için hangi bilginin gerçekten hazır olduğunu izlemeliyiz.

**Aşama sırası:** 1. Doğruluk sorusu → 2. Tespit sınırı → 3. Hazırlık sorusu → 4. Katman ayrımı → 5. Swap sorusu → 6. Tamamlanma ve teslim.

**Tuş ve demo hareketleri:**

- İlk soruda paritenin geçmesinin kesin veri doğruluğu olup olmadığını sorun. İkinci aşama iki bit örneğinin pariteyi koruyabildiğini gösterir.
- Üçüncü aşamada bölüm oluşturmanın dosya sistemi oluşturmakla aynı olup olmadığını sorun. Dördüncü aşamada alan ile metaveri ayrı görünür.
- Beşinci aşamada yazma başladıktan sonra frame'in hemen boş olup olmadığını sorun. Altıncı aşama P'nin korunmasını ve açık tamamlanmayı hatırlatır.
- Kişi4'e teslim edin: Tek aygıttaki bu kararların dışına çıkıyoruz; depolamaya nasıl bağlanırız ve birden çok aygıtla hangi korumaları kurarız?

**Dinleyiciye soru:** Bu üç örneğin ortak uyarısı nedir?

**Beklenen gerekçe:** Bir ara durumdan daha güçlü bir tamamlanma veya garanti iddiası çıkaramayız; hangi bilginin gerçekten hazır olduğunu kontrol etmeliyiz.

**Dikkat:** Dinleyici yanıtı bağımsız kaydedilmez; soru/cevap iki aşamadır. Cevabı açarken yanlış seçeneğin kullanıcı tarafından seçilmiş gibi görünmesine yol açmayın.

**Geçiş:** Depolamaya erişim yolunu ve birden çok diskle kurulan korumayı dördüncü kişiden dinleyeceğiz.

## 4. kişiye teslim

“Şimdi tek aygıttaki bu kararların dışına çıkıyoruz: depolamaya nasıl bağlanıyoruz ve birden fazla aygıtı bir araya getirince hangi korumaları elde ediyoruz?”

4. kişinin başlangıç sorusu bağlantı arayüzüdür. Hata tespitindeki pariteyi daha sonra RAID paritesinin bütün ayrıntılarıyla aynı düzeyde anlatmaya çalışmayın; disk kaybından yeniden üretim bir sonraki kişinin koruma katmanıdır.

## Aşama karışırsa kurtarma

1. Hareket dikkati dağıtıyorsa Space ile duraklatın. Bu seçim modelin değerlerini değiştirmez.
2. M ile menüyü açın, geçerli sahneyi ve aşama adını okuyun. Gerekirse notlardaki temsil alanından nesne anlamını tekrar kurun.
3. Bir aşama geriye gitmek için menüyü kapatıp Backspace kullanın; doğrudan aşama listesi de aynı durumu üretir. Bütün sahneyi baştan anlatmak gerekiyorsa sıfırla kontrolünü kullanın.
4. Swap'ta önce yalnız üç şeyi okuyun: P nerede, S0 geçerli mi, aktarım bekliyor mu? Sonra sayacı söyleyin. Yazma/okuma bir animasyon süresiyle kendiliğinden tamamlanmaz.
5. Yanlış sahnedeyseniz sahne menüsünden anlamsal başlığı seçin. Eski s18–s25 bağlantıları ilgili yeni sahneye yönlendirilir; ek raw sahnesinin eski bir numarası yoktur.

## Prova kabul kartı

- Doğruluk örneğinde P=0 bütün hata aşamalarında aynı mı? İki bit bozulduğunda verinin değiştiğini söyleyebiliyor musunuz?
- ECC'de “bu örnekte” sözünü kuruyor musunuz; Hamming dersine dallanmadan tespit/düzeltme farkını anlatabiliyor musunuz?
- Hazırlamada bölüm, FS, bağlama ve dosya farklı aşamalarda mı görünüyor?
- Boot'ta firmware, yükleyici ve kernel rolleri; remap'te adres devamlılığı ve veri kurtarma ayrımı net mi?
- Swap rezerv/pending/commit'i manuel takip edebiliyor musunuz? Sonuç 1 yazma + 1 okuma mı? Backspace doğru önceki değeri gösteriyor mu?
- Kısa rota uzantıyı atlıyor mu; tam rota raw farkına 90 saniye ayırıyor mu?
- Dördüncü kişiye devri bir cümlede yapabiliyor musunuz?

Bu çalışma sırasında ajan tarayıcı veya ekran görüntüsü kullanmadı. Kod/model/SSR denetimi, gerçek projeksiyon okunabilirliği veya fiziksel sunum provasının yapıldığı anlamına gelmez. Süre ve konuşma akışını anlatıcı kendi provasında ölçmelidir.
