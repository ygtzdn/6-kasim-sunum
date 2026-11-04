# V3 tasarım önerisi — 3. sunucu: doğruluk, aygıt hazırlığı ve swap

**Aşama:** Yalnız planlama; bu turda `src/` değiştirilmedi. Önceki 36 sahne veya S18–S25 sınırı bu tasarımı bağlamaz. Dört sunucu dağılımı korunur: üçüncü kişi §11.4, §11.5, §11.6'yı anlatır. Görsel dil korunur; dersin yapısı yeniden kurulabilir.

## 1. Öğrenme omurgası ve içerik kararı

İkinci kişinin bitirdiği soru: **“İsteği verimli yürüttük; okuduğumuz verinin doğru olduğunu ve aygıtın kullanılabilir olduğunu nasıl biliriz?”**

Üçüncü kişinin tek omurgası:

1. **Doğru mu?** Denetim bilgisi, hata tespiti ve sınırları olan düzeltme.
2. **Kullanıma hazır mı?** Sektör düzeni → bölüm → dosya sistemi → bağlama; açılış ve bozuk blok yönetimi bu zincirin ayrı sorumluluklarıdır.
3. **RAM yetmediğinde nerede tutulur?** Swap alanının amacı, yerleşimi ve bir sayfanın depolama/RAM hareketi.
4. **Sonraki ölçek ne?** Tek aygıttaki kararları bağlantı ve çoklu disk korumasına teslim et.

Öneri: **8 ana sahne + 1 tam anlatım uzantısı = toplam 9 sahne.** Kısa anlatımda 8 sahne / **9 dakika**, tam anlatımda 9 sahne / **16 dakika**. Süreler soru için bekleme ve kişi değişimini içerir; bunlar ikinci kez eklenmez. Görünür metin kısa kalır, ayrıntı konuşmacı notlarındadır. 45/75 dakika bütün sunumun süresidir; aşağıdaki 9/16 dakika üçüncü kişinin bu toplam içindeki payıdır. Ana ajan diğer üç kişinin ve açılış/kapanışın sürelerini aynı toplam altında dengelemelidir.

### Kesin sahne kimlikleri ve metadata

Metadata `seconds: { core: number, full: number }` ile tam sayı saniye kullanır. `kind` bütün bu sahnelerde `chapter` olur. `depth` sahne seçimi içindir; kısa mod bir uzantı sahnesini açmadan sonraki ana sahneye geçer. Sahne içi bütün aşamalar her iki modda da tek sıradadır; kısa mod gizlice bazı aşamaları atlamaz.

| Sıra | Semantic ID | Başlık | Kitap | depth | seconds.core | seconds.full | Aşama |
|---:|---|---|---|---|---:|---:|---:|
| 1 | `error-detection` | Veri bozulduğunu nasıl anlarız? | 11.4 / slayt 27 | core | 75 | 120 | 4 |
| 2 | `error-correction` | Tespit etmek, düzeltmek değildir | 11.4 / slayt 27 | core | 45 | 75 | 5 |
| 3 | `device-preparation` | Ham ortamdan dosyaya | 11.5 / slayt 28–29 | core | 105 | 150 | 6 |
| 4 | `storage-access-modes` | Blokları kim yönetiyor? | 11.5 / slayt 28–30 | extension | 0 | 90 | 4 |
| 5 | `boot-sequence` | Kernel'den önce hangi kod çalışır? | 11.5 / slayt 29–30 | core | 60 | 105 | 5 |
| 6 | `bad-block-remapping` | Adres aynı kalırken yer değişebilir | 11.5 / slayt 30 | core | 45 | 75 | 3 |
| 7 | `swap-space` | RAM yetmezse neyi, nereye taşırız? | 11.6 / slayt 31 | core | 60 | 90 | 5 |
| 8 | `swap-journey` | Bir sayfanın dışarı ve geri yolculuğu | 11.6 / slayt 31 | core | 105 | 165 | 7 |
| 9 | `management-decisions` | Üç sorumluluğu ayır | 11.4–11.6 / slayt 27–31 | core | 45 | 90 | 6 |
| | **Toplam** | | | | **540** | **960** | **45** |

Kısa modda 41 aşama, tam modda 45 aşama vardır. Aşama sayısı sunum temposunun kendisi değildir: bir aşama tek bir gözlenebilir farktır; soru beklemesi anlatıcı tarafından verilir. Önceki 44 yönetim aşamasını sırf sayıyı korumak için taşımıyoruz. Karmaşık dört sayfalı swap örneği sadeleşir; raw erişim gibi bağımsız bir kavram gerçek bir uzantı kazanır.

## 2. Sahne başına uygulanabilir tasarım

### 2.1 `error-detection`

**Ana iddia:** Veriyle birlikte saklanan denetim bilgisi bazı bozulmaları saptamaya yarar; tek paritenin kontrolü geçmesi, verinin kesin doğru olduğunu kanıtlamaz.

**Görsel nesne:** 7 veri biti + sabit P; ilk yazma anında hesaplanmış P hiçbir hata aşamasında yeniden hesaplanmaz. Özgün örnek: 1011001, çift parite P=0. Renk dışında değişmiş bitler çarpı/etiket taşır. Kitap şekli kopyalanmaz.

| stage | Etiket | Gerçek görünen durum / hesap |
|---:|---|---|
| 0 | Saklanan denetim bilgisi | 1011001 + P=0; dört adet 1; çift parite; bozulma yok |
| 1 | Tek bit değişimi | 1001001 + aynı P; üç adet 1; kontrol hata saptar |
| 2 | Çift hata sınırı | 0111001 + aynı P; dört adet 1; veri değişmişken parite hata saptamaz |
| 3 | Diğer denetim yöntemleri | Bit dizisi küçülür; parite / checksum / CRC kartları ayrı yöntemler olarak açılır. CRC için sahte sonuç veya seçilmemiş polinom hesabı üretilmez. |

**Konuşmacı akışı:** “Veri ilk yazılırken küçük bir denetim bilgisi de saklıyoruz. Bir bit değiştiğinde aynı saklanan bilgiyi kullanarak tutarsızlık bulabiliyoruz. İki bit değiştiğinde ise çiftlik yeniden korunabiliyor. Dolayısıyla ‘bu kontrol hata bulmadı’ ile ‘veri kesin doğru’ aynı cümle değildir. Kitap checksum ve CRC gibi başka tespit yöntemlerini de anıyor; burada kapasitelerini tek pariteninkiyle eşitlemiyoruz.”

**Soru → cevap:** “Parite hatayı bulunca bozuk bitin yerini biliyor muyuz?” → “Hayır; bu tek kontrol hangi bitin bozuk olduğunu söylemez.”

**Geçiş:** “Yalnız bir hata bayrağı yerine, doğru veriyi elde etmeye yetecek daha fazla bilgi tutabilir miyiz?”

**Kaynak sınırı:** Resmî slayt 27 kavram kaynağı; bu bit dizisi özgün matematik örneğidir. CRC'nin bütün çoklu hataları yakaladığı veya checksum ile kriptografik güvence sağlandığı söylenmez.

### 2.2 `error-correction`

**Ana iddia:** Uygun ECC, tasarlandığı sınırlar içinde bazı hataları düzeltebilir; hata tespit edilebilir olduğu halde düzeltilemeyebilir.

**Görsel nesne:** Tespit satırı ile örnek ECC satırı; sayılar yalnız bu özgün küçük kod örneğine aittir. Halihazırda test edilen SECDED motoru gerçek sonuç üretmek için kullanılabilir, fakat arayüz Hamming öğretim ekranına dönüşmez.

| stage | Etiket | Gerçek durum |
|---:|---|---|
| 0 | Veri ve ek kod | Veri + denetim bilgisi; her iki satır başlangıçta sağlam |
| 1 | Tek bozuk bit | İki satırda seçilmiş birer bit değişir; kontrol sonucu henüz kapalı |
| 2 | Tespit ve düzeltme | Parite yalnız bayrak verir; örnek ECC motoru bozuk biti hesaplayıp düzeltir |
| 3 | İki bozuk bit | Başlangıç kodunun yeni iki hatalı okuması görünür; sonuç yine kapalı |
| 4 | Kodun sınırı | Parite hata kaçırır; bu ECC örneği iki hatayı saptar ama düzeltmez; bitler bozuk kalır |

**Konuşmacı akışı:** “Burada asıl fikir bir algoritma adı değil, ek bilginin neye yettiği. Üst satır yalnız tespit eder. Alt satırdaki özgün küçük kod örneği tek bitin konumunu çıkarıp düzeltiyor. İki bit değiştiğinde bu örnek artık düzeltemiyor. Ekrandaki bir ve iki sayıları tüm diskler için bir kural değildir.”

**Soru → cevap:** “ECC yazan bütün aygıtlar aynı sayıda biti düzeltebilir mi?” → “Hayır; kodun yapısı ve tasarlandığı hata modeli belirler.”

**Geçiş:** “Doğruluğu kontrol edecek bilgiyi gördük. Şimdi bu bilgiyi ve dosya verisini barındıran aygıt hangi hazırlıklardan geçer?”

**Ana / isteğe bağlı / çıkarılacak ayrımı:** Ana anlatımda ECC'nin rolü ve kapasitesinin sınırlılığı bulunur. SECDED/Hamming adı, 1/2/4/8 konumları, sendrom ve ikili denklemler ne kısa ne 75 dakikalık bölüm akışına alınır; erişilebilen OSC10 slaytı bu ayrıntıları öğretmez. Motorun matematiği geliştirici testlerinde kalabilir. “Özgün kod örneği” etiketi ve slayt 27 bağlantısı bulunur. Başka üniversite veya ürün belgesi müfredat otoritesi olarak eklenmez.

### 2.3 `device-preparation`

**Ana iddia:** Fiziksel biçimlendirme, bölümleme, dosya sistemi oluşturma ve bağlama farklı işlemlerdir.

| stage | Etiket | Gerçek durum |
|---:|---|---|
| 0 | Ham ortam | Tek alan; sektör kutuları, bölüm, FS ve dosya simgesi yok |
| 1 | Fiziksel biçim | Denetleyicinin okuyup yazdığı sektör düzeni açılır; örnek sektörde başlık / veri / ECC ayrımı |
| 2 | Bölümleme | Alan 60/40 iki mantıksal bölüme ayrılır; FS simgesi yok |
| 3 | Dosya sistemi | Bölüm 1'in dizin/tahsis gibi metaverisi oluşur; Bölüm 2 karşı örnek olarak boş kalır |
| 4 | Bağlama | Bölüm 1, OS'nin dosya erişim düzenine bağlanır; bağlı etiketi ve ad alanı bağlantısı görünür |
| 5 | Dosya erişimi | Yalnız bağlı Bölüm 1'de bir örnek dosya simgesi görünür |

**Konuşmacı akışı:** “İlk ayrım donanımın işleyebileceği sektör düzenidir. Bölümleme bu aygıtın alanını mantıksal bölgelere ayırır. Dosya sistemi ise dosya ve dizinleri yönetmek için kendi metaverisini oluşturur. Bağlama, hazırlanmış dosya sistemini işletim sisteminde erişilebilir yapar. Alan ayırdığımız anda normal dosya saklayabileceğimiz sonucu çıkmaz.”

**Soru → cevap:** “Bölüm oluşturunca dosya sistemi de oluşmuş olur mu?” → “Hayır; ayrılan alan ile o alandaki dosya sistemi yapıları ayrıdır.”

**Geçiş, kısa mod:** “Dosya sistemi hazır; peki kernel henüz çalışmıyorken ona kim ulaşır?”

**Geçiş, tam mod:** “Bu katmanlar normal dosya erişiminde birlikte çalışır. Her uygulama mutlaka aynı katmanları kullanmak zorunda mı?”

**Sınırlar:** Oran ve dosya adı özgün örnektir. Fiziksel biçim işlemi son kullanıcının her kurulumda çalıştırdığı bir komut diye sunulmaz. 512 bayt yalnız kitaptaki tarihsel/seçilebilir örnek olarak anılabilir; evrensel güncel sektör boyutu değildir. Geri aşama seçimi gerçek biçimlendirmeyi geri alma vaadi değildir.

### 2.4 `storage-access-modes` — yalnız tam anlatım

**Neden ayrı uzantı:** Bu kavramı hazırlama akışına sıkıştırmak bölümleme/FS ayrımını dağıtır. Slayt 28–30'daki blok/cluster/raw ayrımı için tam anlatımda odaklı bir durak sağlar.

**Ana iddia:** Dosya sistemi blokların üstünde düzen kurar; uygulamalar uygun bağlamda dosya sistemi yerine raw blok erişimi de isteyebilir.

| stage | Etiket | Gerçek durum |
|---:|---|---|
| 0 | Aygıt blokları | Bağımsız mantıksal blok sırası |
| 1 | Dosya sistemi gruplaması | Bazı bloklar örnek cluster çerçevelerine alınır; örnek grup boyutu gerçek dosya sistemi standardı değildir |
| 2 | Normal dosya yolu | Uygulama → dosya sistemi → blok aygıtı yolu çizilir |
| 3 | Raw erişim | Örnek veritabanı → raw blok aygıtı yolu açılır; dosya/dizin işini üst uygulamanın üstlenebildiği belirtilir |

**Konuşmacı akışı:** “Kitap blok I/O ile dosya sisteminin blokları gruplamasını ayrı düzeylerde ele alır. Normal dosya yolunda uygulama dosya sistemi hizmetini kullanır. Raw erişimde ise uygulama blok yönetimini kendisi üstlenmek isteyebilir; kitap veritabanını örnek verir. Raw demek bütün OS sürücülerinin fiziksel olarak aradan çıktığı demek değildir.”

**Soru → cevap:** “Raw blok erişimi dosya ve dizin hizmetlerini otomatik sağlar mı?” → “Hayır; bu düzeni uygulama veya başka bir katman sağlamalıdır.”

**Geçiş:** “Artık dosya sistemini ve blokları ayırdık. Açılış kodu kernel'i bu depolamadan RAM'e nasıl getirir?”

**Sınırlar:** Güncel Linux `O_DIRECT` davranışı, I/O izinleri veya gerçek blok aygıtına erişim komutları anlatılmaz. Dosya API'sindeki her çağrının zorunlu olarak bir cluster taşıdığı iddia edilmez; burada dosya sisteminin gruplama/tahsis fikri gösterilir.

### 2.5 `boot-sequence`

**Ana iddia:** Kernel'den önce çalışan firmware ve depolamadaki yükleyici kodu, kernel'in RAM'e yüklenmesini sağlar.

| stage | Etiket | Gerçek durum |
|---:|---|---|
| 0 | İlk kod sorusu | Firmware, boot block, loader, RAM/kernel kutuları henüz etkin değil |
| 1 | ROM / firmware | Yalnız ilk kod kutusu etkin; kernel hâlâ depolamada |
| 2 | Boot block | Denetim seçilen açılış aygıtının koduna geçer; ok bu bölgeyi gösterir |
| 3 | Yükleyici | Kernel görüntüsünden RAM'e yükleme oku ve yüklenen içerik görünür |
| 4 | Kernel RAM'de | RAM'deki kernel etkinleşir; yürütme artık bu koddadır |

**Konuşmacı akışı:** “OS henüz çalışmazken ilk kod zaten firmware'de bulunur. Açılış aygıtındaki kod sonraki yükleyiciye veya boot volume'a ulaşabilir. Yükleyici kernel görüntüsünü bulup RAM'e getirir; ardından denetim kernel'e geçer. Bütün yükleyicinin ilk küçük boot block'a sığması gerektiğini düşünmeyin.”

**Soru → cevap:** “Boot block ile kernel aynı şey mi?” → “Hayır; biri kernel'e ulaşan açılış yolunun parçasıdır, diğeri yüklenip çalıştırılacak OS kodudur.”

**Geçiş:** “Açılışta da normal I/O'da da fiziksel ortamla çalışıyoruz. Bir sektör kullanılamaz hale gelirse üst katmandaki adres ne olur?”

**Tam anlatım farkı:** Slayt 30'daki Windows/MBR örneği sözlü olarak kitaptaki belirli düzen diye anılır. Ayrı UEFI/GPT/ESP sekmesi, Secure Boot ve initramfs ayrıntıları eklenmez. Akış bütün platformların tek zorunlu açılış biçimi diye sunulmaz.

### 2.6 `bad-block-remapping`

**Ana iddia:** Sorunlu fiziksel sektör yedek alana eşlenebilir; üst katmanın mantıksal adresi korunabilir.

| stage | Etiket | Gerçek durum |
|---:|---|---|
| 0 | Geçerli eşleme | LBA 5 → P45; yedek P90 kullanılmıyor |
| 1 | Sektör arızası | P45 arızalı; LBA 5 değişmedi; erişim sorunu görünür |
| 2 | Sector sparing | Eşleme LBA 5 → P90; bozuk P45 görünür kalır, yedek hedef etkinleşir |

**Konuşmacı akışı:** “OS bir mantıksal blok istiyor; fiziksel yeri aygıt yönetebiliyor. P45 bozulduğunda LBA 5'i uygulamalar için yeniden numaralamak yerine yedek konuma yönlendirebiliriz. Fakat okunamayan eski verinin içeriğini, yalnız adresi değiştirerek elde edemeyiz.”

**Soru → cevap:** “Yeniden eşleme eski okunamayan veriyi kesin kurtarır mı?” → “Hayır; adres devamlılığı ile veri kurtarma ayrı iddialardır.”

**Geçiş:** “Bu aygıt yalnız normal dosyaları barındırmaz; bellek için arka alan da sağlayabilir.”

**Sınırlar:** Physical ID'ler geometri değil öğretim kimliğidir. Gerçek remap politikası, kurtarma denemeleri ve üretici firmware'i modellenmez. SSD FTL'nin normal sürekli eşleme göreviyle aynı mekanizma diye anlatılmaz.

### 2.7 `swap-space`

**Ana iddia:** Swap yönetimi RAM'den depolamaya taşınan içerik için arka alan sağlar; bu alan RAM hızında değildir ve yerleşimi ayrı bir karardır.

| stage | Etiket | Gerçek durum |
|---:|---|---|
| 0 | RAM baskısı | Sınırlı RAM alanı ve dışarı alınabilecek içerik; henüz aktarım yok |
| 1 | Taşınan birim | Sürecin bütünü / sayfalar ayrımı; sonraki model için tek sayfa seçilir |
| 2 | Swap dosyası | Dosya sistemi içinde ayrılan swap alanı çizilir |
| 3 | Raw bölüm | Dosya yerine ayrı swap bölgesi çizilir; aynı sayfa/alan soyutlaması sürer |
| 4 | Birden çok alan | İki aygıt/alanın I/O yükünü paylaşma fikri görünür; hız çarpanı yazılmaz |

**Konuşmacı akışı:** “Kitap bütün sürecin swapping'i ile sayfaların paging'ini ayırır. Şimdi yalnız bir sayfayı izleyeceğiz. Swap alanı dosya veya ayrı bölüm içinde sağlanabilir; dosya biçimi eklemeyi kolaylaştırabilir. Birden fazla alan I/O yükünü paylaşabilir. Bunlar RAM'e eş hızda ek bellek kazandırmaz; depolama I/O'su ve yerleşim kararlarıdır.”

**Soru → cevap:** “Swap alanı artınca RAM'in erişim hızı artar mı?” → “Hayır; ek arka alan sağlanır, taşıma ve depolama maliyeti devam eder.”

**Geçiş:** “Yerleşimi seçtik. Bir sayfa giderken ve geri gelirken hangi konumlar değişir?”

**Sınırlar:** Kitaptaki dedicated device ve multiple swap space bağlamı güncel her sistem için satın alma önerisi yapılmaz. Evrensel ‘RAM'in iki katı swap’ kuralı eklenmez. Güncel Linux Swap Table/Swap Entry belgeleri müfredatı genişletmez. Slayt 31'in Linux veri yapısı görseli ancak tarihsel kitap örneği olarak tanıtılabilir; yeni kernel sürümünün veri yapısı diye sunulmaz.

### 2.8 `swap-journey`

**Ana iddia:** Sayfa ile RAM frame'i ve swap alanı konumu farklı şeylerdir; taşımanın başlangıcı ile tamamlanması ayrıdır.

**Sadeleşme kararı:** Önceki A/B/C/D, anonim/temiz dosya sayfası, saklanan swap cache, dört I/O eylemi ve dolu alan yan senaryosu ana akıştan çıkarılır. Tek sayfalı model yeterlidir. Bu ayrıntılar farklı bellek yönetimi politikalarını birden anlatıyor ve erişilebilen 11.6 slaytından daha fazla dayanak gerektiriyor.

| stage | Etiket | Gerçek durum |
|---:|---|---|
| 0 | RAM'deki P | P, RAM frame F0'da; swap'taki örnek hedef S0 boş; sayaçlar 0/0 |
| 1 | Hedef ayır | S0, P için ayrılmış/henüz geçerli değil; F0'da P kalır |
| 2 | Dışarı yaz | P için RAM→swap yazma oku; tamamlanma yok; F0 hâlâ dolu |
| 3 | Yazma tamam | S0'da geçerli P; F0 boş; yazma sayacı 1 |
| 4 | Yeniden eriş | P'ye ihtiyaç ve S0→F0 okuma isteği; F0 henüz boş |
| 5 | Okuma tamam | P F0'da; okuma sayacı 1; bu örnekte tamamlanmış geri alımdan sonra S0 serbest bırakılır |
| 6 | Maliyet ve kimlik | P kimliği, F0/S0 konumlarından ayrı gösterilir; tamamlanan 1 yazma + 1 okuma yolu vurgulanır |

**Konuşmacı akışı:** “P sayfanın kimliği; F0 ve S0 iki farklı ortamın konumlarıdır. Önce hedef alan ayrılır. Yazma sürerken RAM'deki güncel içeriği bırakmıyoruz. Yazma tamamlanınca RAM yeri boşalabilir. P tekrar gerektiğinde bir RAM hedefi ve okuma gerekir. Bu bir OS'nin bütün tahliye politikasını simüle etmek değil, tek sayfanın depolama yolculuğunu izlemek için kurulmuş modeldir.”

**Soru → cevap:** “Yazma başlamış olması RAM frame'ini hemen bırakmaya yeter mi?” → “Bu örnekte hayır; güncel içerik korunmadan tamamlanmış aktarım sayılmaz.”

**Geçiş:** “Doğruluğu, aygıtın hazırlığını ve bellek için arka alanı ayrı ayrı yönettik; bunları karıştırmadan toparlayalım.”

**Politika sınırı:** S0'ın page-in sonrasında serbest bırakılması bu modelin açık tercihidir; kitabın bütün OS'ler için zorunlu kuralı diye yazılmaz. Bir fiziksel sayfanın her durumda dışarı yazılması gerektiği genellemesi yapılmaz; örnekte güncel içeriğin korunması gereken bir P seçilmiştir. LRU/FIFO seçimi, page fault türleri, clean file eviction ve Linux swap cache ana sahnenin konusu değildir.

**Uygulama sözleşmesi:** `swapJourneyAtStage(stage)` her görünümü başlangıçtan saf işlemlerle üretir. Ayırma, pending ve commit ayrı state değerleridir. Model animasyon tamamlanınca kendi kendine ilerlemez. `Backspace` ayırmayı, yazmayı, okunmayı ve sayaçları seçilen eski aşamaya eksiksiz döndürür. Eski multi-page motoru test değeri taşısa da anlatı veri kaynağı olarak zorunlu değildir.

### 2.9 `management-decisions`

**Ana iddia:** Hata tespiti/düzeltme, aygıtın mantıksal hazırlığı ve swap yönetimi farklı sorumluluklardır.

| stage | Etiket | Gerçek durum |
|---:|---|---|
| 0 | Doğruluk sorusu | “Parite kontrolü geçti. Veri kesin doğru mu?”; cevap kapalı |
| 1 | Tespit sınırı | “Hayır”; iki bit örneği kısa görsel karşılık olarak açılır |
| 2 | Hazırlık sorusu | “Bölüm oluşturuldu. Dosya sistemi de var mı?”; cevap kapalı |
| 3 | Katman ayrımı | “Hayır”; bölüm alanı ve FS metaverisi ayrı gösterilir |
| 4 | Swap sorusu | “Dışarı yazma başladı. RAM frame'i hemen boş mu?”; cevap kapalı |
| 5 | Tamamlanma ve teslim | “Hayır”; pending/commit ayrımı ve bağlantı/RAID'e geçiş oku açılır |

**Konuşmacı akışı:** “Üç ayrı ‘hazır’ kavramını gördük. Kontrolün geçmesi kesin doğruluk değildir. Alanın ayrılması dosya sisteminin oluşması değildir. Aktarımın başlaması tamamlanması değildir. Her biri farklı bilgi ve durum gerektiriyor.”

**Kişi 4'e teslim cümlesi:** “Şimdi tek aygıttaki bu kararların dışına çıkıyoruz: depolamaya nasıl bağlanıyoruz ve birden fazla aygıtı bir araya getirince hangi korumaları elde ediyoruz?”

**Yanıt davranışı:** Soru/cevap çiftleri aynı aşama listesinde yer alır. Enter bütün cevapları açar; Backspace cevapları ve diyagram karşılıklarını tekrar gizler. Kullanıcı seçimi için ayrı, geri alınmayan bir yanıt state'i tutulmaz. Yanlış seçenek tıklamasını doğru cevap gibi göstermemek için bu sahne sınıf tartışmasıdır; cevap seçimi simülatörü değildir.

## 3. Sunucu hazırlığı ve prova

### Kişi 2'den devir

Kişi 2: “HDD'de hareketi, flash'ta kuyruk ve iç işleri yönettik. Sıranın hızlı olması verinin sağlam olduğu anlamına geliyor mu?”

Kişi 3 başlangıcı: “Önce o ayrımı yapalım. Aygıttan okuduğumuz bitler değişmiş olabilir; bunu ancak sakladığımız ek bilgiyle denetleyebiliriz.”

### 45 dakikalık ana anlatım için kişi 3 provası — 9 dakika

- **0:00–2:00:** Parite örneği ve ECC ayrımı. Bir soru beklemesi, uzun algoritma açıklaması yok.
- **2:00–3:45:** Hazırlama zinciri. Sektör ile bölüm ve FS birbirine karıştırılmadan tek kez yürütülür.
- **3:45–5:30:** Boot ve remap; ikisi de hazırlama sihirbazına ek birer zorunlu adım gibi sunulmaz.
- **5:30–8:15:** Swap alanı ve tek sayfanın yolculuğu. İki sayacın hangi tamamlanmada arttığını bir kez sorun.
- **8:15–9:00:** Üç kısa kontrol sorusu ve kişi 4'e teslim.

### 75 dakikalık tam anlatım için kişi 3 provası — 16 dakika

- **0:00–3:15:** Denetim ve ECC. Dinleyiciden iki bit sonucu tahmini; ECC sınırının sözlü tekrarına zaman var.
- **3:15–7:15:** Hazırlama + `storage-access-modes` uzantısı. Raw ve normal dosya yolunu ayrı oklarla karşılaştır.
- **7:15–10:15:** Boot ve remap. Kitabın Windows/MBR bağlamını bir cümlede an; güncel açılış teknolojilerine dallanma.
- **10:15–14:30:** Swap yerleşimi ve tek sayfa. Hedef ayırma ile I/O tamamlamayı dinleyiciye adlandırttır.
- **14:30–16:00:** Üç soruya gerekçeli yanıt; kişi 4'e teslim.

### Konuşmacının sahne başına hazır bulunduracağı dört cümle

1. Bu diyagramdaki bir nesnenin neyi temsil ettiği.
2. Sonraki Enter'da hangi durumun değişeceği.
3. Sonuçtan hangi iddianın çıkarılabildiği / çıkarılamadığı.
4. Bir sonraki sahnenin sorusu.

Notlar “bu düğmeye basın” metninden ibaret olmaz. Yukarıdaki her sahnede bu dört rol için hazır cümle var. Prova sırasında kişi 3 her sahnenin başını/sonunu, bir ara aşamasını ve Backspace dönüşünü klavyeyle takip ederek çalışabilir; ajan bu görevde tarayıcı açmaz.

## 4. 47 slaydın tamamı için kaynak ve baskı politikası

### Kaynak önceliği

1. Eser kimliği ve baskı: `https://os-book.com/OS10/index.html`.
2. Bölüm numarası/başlığı: `https://os-book.com/OS10/toc-dir/toc.pdf`.
3. Erişilebilir kavram dayanağı: `https://os-book.com/OS10/slide-dir/PPTX-dir/ch11.pptx`; **47 slayt**, 1 tabanlı dosya sırası.
4. Slayt kümesinin yazar kaydı ve kullanım koşulları: `https://os-book.com/OS10/slide-dir/index.html`.
5. Kavramsal soru derinliği: `https://os-book.com/OS10/review-dir/11-rev.pdf`.
6. Baskı düzeltmeleri: resmî errata dizini; print ve ePub dosyaları ayrı kontrol edilir.

**Kesin doğrulama sınırı:** Tam kitap metni yerel depoda yoktur. Bu nedenle “kitabın her sayfası karşılaştırıldı”, “tam metinle birebir doğrulandı” veya belirli bir paragraf/sayfa için içerik doğrulaması yapıldı denmez. Resmî slaytlar birincil ders destek materyalidir; tam kitabın kendisi yerine geçtiği iddia edilmez. TOC'deki sayfa başlangıcı bir iddianın o sayfada gerçekten anlatıldığının bağımsız kanıtı sayılmaz. Yasal tam metin sonradan gelirse ikinci bir sayfa/şekil denetimi yapılabilir; mevcut plan onun yapılmış olduğunu varsaymaz.

### 47 slaydın yapı haritası

| Slayt | Konu | Müfredat rolü ve dikkat |
|---|---|---|
| 1–3 | Başlık, bölüm haritası, hedefler | Açılış ve öğrenme hedefi; ayrıca zorunlu üç bilgi slaydı olarak çoğaltmak gerekmez |
| 4–7 | HDD yapı ve erişim maliyeti | Seek / dönme / aktarım ayrımı; tarihsel kapasite/arayüz rakamları güncel ürün iddiasına dönüşmez |
| 8 | İlk ticari disk örneği | Tam anlatım için tarihsel uzantı olabilir; gerekli ana kavram değildir |
| 9–11 | NVM, flash, FTL/GC/OP/wear leveling | NVM ile NAND/SSD özdeşleştirilmez; erase ömrü ve DWPD rakamları tarihsel örnek diye sınırlandırılır |
| 12–13 | Volatil RAM disk ve teyp | RAM'in secondary storage ile teknik ayrımı, geçici depolama ve erişim biçimi |
| 14–16 | Mantıksal bloklar, attachment, eşleme | 14/16 tekrarını iki özdeş sahne yapmak gerekmez. Basitleştirilmiş geometri gerçek modern firmware eşlemesi diye gösterilmez. |
| 17–25 | HDD zamanlama ve seçim | Kuyruk/aralık/yön/sayma sözleşmesi açıklanır. 208 ifadesi ile fiziksel uç yolunun farkı sessizce gizlenmez. RHEL7/NOOP/CFQ güncel varsayılan ilan edilmez. |
| 26 | NVM zamanlama | Mekanik maliyet yok; birleştirme ve yazma büyütmesi var. Tarihsel IOPS/throughput farkı güncel benchmark değildir. |
| 27 | Hata tespiti/düzeltme | Parite/checksum/CRC/ECC ana kapsam. Hamming ve kod inşası bu slaytın zorunlu öğretimi değildir. |
| 28–30 | Aygıt yönetimi | Fiziksel biçim, bölüm, FS, cluster, raw, mount, boot ve sector sparing; bu konular tek doğrusal kurulum komutu dizisi diye sunulmaz. |
| 31 | Swap alanı | Amaç, birim, yerleşim ve I/O yükü. Görseldeki Linux örneği yeni kernel veri yapısına ilişkin iddia değildir. |
| 32–37 | Attachment, NAS, cloud, array, SAN | Dosya/blok/API ve sorumluluk sınırı; yerleşim veya düğüm sayısı doğrudan performans ölçüsü değildir. Bulutun kitaptaki API/WAN örneği güncel bütün ürünlere evrensel sınıflandırma yapılmaz. |
| 38–42 | RAID, seviyeler, 1+0/0+1, yedek/replication | Kapasite, arıza deseni, yeniden kurma ve zaman istatistikleri ayrıdır. Aşırı büyük MTTDL örneği ürün garantisi veya insan ömrü ölçüsü gibi sunulmaz. |
| 43–46 | Bütünlük, pooled/object storage | RAID tek başına veri bozulması denetimi değildir. Checksum ile tespit ve yeterli doğru bilgiyle onarım ayrı iddialardır. |
| 47 | Bölüm sonu | Kapanışta sentez yapılır; tek “End” başlığını ayrı eğitim sahnesi yapmak gerekmez. |

### Genel editoryal kurallar

- Öğretim iddiasının kaynak kaydı `sections`, `slides`, `takeaway`, `model` alanlarını içerir. Model alanı örnek veri, algoritma ayrıntısı ve gerçek sistem sınırını ayırır.
- Bir resmî slaytta adının geçmesi, onun bütün güncel uygulama ayrıntılarının müfredata dahil olduğu anlamına gelmez. Kapsam başlık üzerinden büyütülmez.
- OSC8/OSC9/Essentials kaynakları bu baskının bölüm yapısı için kullanılmaz. Global Edition sayfa farkı varsayımıyla kesin sayfa numarası üretilmez.
- Fotoğraf lisansları ve yazılım teknik belgeleri içerik otoritesinden ayrı tutulur; atıfları kaldırılmaz.
- Metin, şekil ve kontrol soruları özgün hazırlanır. Kitap/slayt ekran görüntüleri projeye kopyalanmaz.
- Sayısal bir demo gerçekten hesap yapıyorsa motor test edilir. Kavramsal bir yol diyagramı çalıştırılmayan algoritmanın hesap sonucu gibi sunulmaz.
- Hard/soft hata ve CRC gibi slayttaki kısa genellemeler, kapsamı geniş evrensel teoremlere çevrilmez. ECC için kullanılan kod/hata sınırı açık tutulur.
- Düzeltmeler: 5 Haziran 2024 print errata'da Bölüm11 için “cache and host DRAM”, `DIRECT` yazımı ve “hard drives and other nonvolatile” düzeltmeleri bulunur; bunlar kaynak denetiminin notudur. Algoritma düzeltmesi varmış veya bu dosya tam kitap doğrulamasıymış gibi sunulmaz. ePub errata'nın sürümü ayrı kaydedilir.

## 5. Uygulama öncesi onaylanacak kararlar ve kabul

Bu rapor ana ajanın birleştireceği tasarım girdisidir; uygulama başlamadı. Ana plan onaylandığında dosya sahipliği üçüncü sunucu modülü ve ilgili model testleri olmalıdır. Kimlik alias'ları, sıraya göre numaralar, source map ve genel mod seçimi ana ajanda kalır.

Kabul koşulları:

1. 9 sahnenin sırası ve kimliği yukarıdaki listeyle aynı; yalnız `storage-access-modes` extension.
2. Her sahne tanımlı aşama listesine sahip; Enter son aşamada kalır, Backspace ilk aşamada kalır; sahne değişimi ayrı eylemdir.
3. İleri/geri/sekmeden doğrudan seçilen aynı aşama aynı model ve HTML üretir. Sonraki aşamayı bekleyen hiçbir zamanlayıcı yoktur.
4. Parite sabit saklanan P ile hesaplanır; örnek ECC gerçek motorla sınırlı sonuç verir; kod kapasitesi evrenselleştirilmez.
5. Hazırlama görünümünde bölüm, FS, mount ve dosya durumları gerçekten değişir. Boot ve remap ayrı senaryolardır.
6. Swap modeli ana akışta tek sayfa kullanır; rezerv/pending/commit ayrı test edilir; 1 yazma/1 okuma sayacı doğru anda artar; geriye dönüşte aynı değerler geri gelir.
7. Tam modun süre toplamı 16; kısa modun süre toplamı 9 dakikadır. Bütün sunum toplamı ayrıca ana planda 45/75 olarak doğrulanır.
8. 27–31 kavramları dış Linux/UEFI/SNIA/Hamming müfredatıyla genişletilmez; özgün model kayıtları açık kalır.
9. Test/SSR/TypeScript/HTTP doğrulaması yapılabilir. Tarayıcı, ekran görüntüsü veya görsel tarayıcı doğrulaması kullanılmaz ve yapılmış gibi raporlanmaz.
