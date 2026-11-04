# V3 tasarım planı — 4. sunucu, §11.7–11.8 ve ortak kapanış

5 Kasım 2026. **Yalnız plan**: bu aşamada `src/` değiştirilmedi. Mevcut 213 aşamalı sürüm çalışma tabanıdır; 36 sahne veya Sxx sırası yeni tasarımın sınırı değildir.

## 1. Kaynak ve temel karar

Ana dayanak Operating System Concepts, Tenth Edition, Chapter 11'in resmî 47 slaytlık dosyasıdır: <https://os-book.com/OS10/slide-dir/PPTX-dir/ch11.pptx>. Kitap bölüm eşlemesi resmî içindekilerle yapılır: <https://os-book.com/OS10/toc-dir/toc.pdf>. Tam kitap metni yerel depoda olmadığından sayfa/satır doğrulaması veya bütün kitap alt başlıklarının eksiksiz karşılaştırıldığı iddia edilmez.

Bu planda yerel resmî dosyanın 32–46 metni yeniden okundu. Ayrıca PPTX'in **özgün gömülü kaynak figürleri** incelendi: slayt 40 / `ppt/media/image18.jpeg` ve slayt 41 / `image19.jpeg`. Bunlar tarayıcı veya uygulama ekran görüntüsü değildir; uygulama için yeniden kullanılmaları önerilmiyor. Kavramları aynı açık tasarım diliyle özgün HTML/SVG diyagramlarına dönüştürmek gerekir.

Kaynakta önemli ayrıntılar:

- Slayt 32 host-attached/network-attached/cloud ayrımını, 33 NAS'ın dosya erişimi yanında iSCSI'nin IP üzerinden SCSI/blok erişimini, 34 bulut/API/WAN gerekçesini anlatır. DAS/NAS/SAN birbirini dışlayan üç evrensel sınıf diye sunulmaz. **Bağlantı yolu** ve **dosya/blok/API arayüzü** ayrı eksenlerdir.
- Slayt 35 storage array'in host portları, denetleyici, bellek/yazılım, diskler ve snapshot/clone/thin provisioning/replication/deduplication gibi hizmetlerini açıkça içerir. Bunlar RAID seviyesinin eş anlamlısı değildir.
- Slayt 36–37 SAN'da çok host, switch/fabric, çok dizi ve **LUN masking** yer alır. Önceki tek host→ağ→hacim çizimi bu kapsamı tek başına karşılamıyordu.
- Slayt 38 MTTF, MTTR ve veri kaybına kadar süreyi ilişkilendirir. Metin çıkarımında örnekteki sayı ve formül tutarsız/bozuk görünür; bu planda astronomik sayısal ömür hesaplanmaz. Bağımsız arıza varsayımı açıklanır; hiçbir sayı garanti gibi sunulmaz.
- Slayt 40'ın gerçek figüründe **RAID 0, 1, 4, 5, 6 ve multidimensional RAID 6** bulunur. RAID 2/3 bu kaynak figüründe yoktur; tam kitap dayanağı olmadan eski dokümanlardaki tarihsel 2/3 genişlemesi eklenmemelidir.
- Slayt 41, 0+1 ve 1+0 için bir disk arızasında farklı grup sınırlarını gösterir. Yalnız iki yan yana başlık yeterli değildir; gruplamanın arıza etkisini gerçekten değiştiren bir model gerekir.
- Slayt 42 snapshot, senkron/asenkron replication ve hot spare/MTTR ilişkisini ayrı başlıklarla ele alır. Bunların eski S34'e sıkıştırılması veya notlarda görünmez kalması düzeltilmelidir.
- Slayt 43–44 checksum, ZFS veri/metaveri kontrolü, pointer ile ilişkilendirilen checksum ve partition/volume yaklaşımıyla havuz yaklaşımı karşılaştırmasını içerir. Havuz yalnız genel bir disk kutusu olarak geçilemez.
- Slayt 45–46 nesne oluşturma→ID alma→ID ile erişme→ID ile silme dizisini, yerleştirme/koruma yazılımını, birden çok sistemde kopyaları ve yatay büyümeyi içerir. Kimlik/metadata/veri kartı tek başına bu kapsamı tamamlamaz.

## 2. Yeni sıra ve kesin metaveri

16 bölüm sahnesi + 2 ortak kapanış önerilir. Sıra kitabın 32→46 düzenini izler; eski aynı konuyu ikinci kez açan karşılaştırmalar birleştirilir, aşırı yüklenmiş S34 ayrı amaçlara bölünür. `seconds` değerleri bütçe önerisidir; otomatik ilerleme/timer değildir.

| Sıra | Sabit semantic ID | Kind | Depth | Bölüm | Slaytlar | Aşama | core sn | full sn |
| --- | --- | --- | --- | --- | --- | ---: | ---: | ---: |
| 1 | `host-attached` | chapter | core | 11.7 | 32; 15 geri referans | 5 | 30 | 50 |
| 2 | `nas` | chapter | core | 11.7 | 33 | 6 | 45 | 75 |
| 3 | `cloud-storage` | chapter | core | 11.7 | 34 | 5 | 30 | 50 |
| 4 | `storage-arrays` | chapter | core | 11.7 | 35 | 5 | 45 | 65 |
| 5 | `san` | chapter | core | 11.7 | 36–37; 33 geri referans | 6 | 45 | 70 |
| 6 | `raid-intro` | chapter | core | 11.8 | 38–39 | 5 | 45 | 70 |
| 7 | `raid-striping` | chapter | core | 11.8 | 39–40 | 6 | 60 | 95 |
| 8 | `raid-parity` | chapter | core | 11.8 | 39–40 | 6 | 60 | 95 |
| 9 | `raid-xor` | chapter | extension | 11.8 | 39–40 kavram dayanağı | 5 | 0 | 70 |
| 10 | `raid-levels` | chapter | extension | 11.8 | 40, özellikle (f) figürü | 4 | 0 | 35 |
| 11 | `raid-nested` | chapter | core | 11.8 | 39, 41 | 7 | 60 | 85 |
| 12 | `raid-rebuild` | chapter | core | 11.8 | 38–39, 42 | 7 | 75 | 105 |
| 13 | `raid-features` | chapter | core | 11.8 | 42; 35, 39 geri referans | 6 | 45 | 70 |
| 14 | `raid-integrity` | chapter | core | 11.8 | 43 | 5 | 45 | 65 |
| 15 | `storage-pools` | chapter | core | 11.8 | 43–44 | 5 | 30 | 60 |
| 16 | `object-storage` | chapter | core | 11.8 | 45–46 | 6 | 45 | 75 |
| 17 | `io-journey` | closing | core | Bölüm sentezi | 15, 17–18, 27–46 seçili geri referanslar | 7 | 60 | 75 |
| 18 | `storage-wrap-up` | closing | core | Bölüm sentezi | 3, 38–46 seçili geri referanslar | 6 | 60 | 75 |

**Toplamlar:** bölüm 16 sahne / 89 aşama / core **660 sn = 11 dk** / full **1135 sn = 18 dk 55 sn**. Kapanış 2 sahne / 13 aşama / core **120 sn** / full **150 sn**. Birlikte **18 sahne, 102 aşama, core 780 sn = 13 dk, full 1285 sn = 21 dk 25 sn**. Core modunda iki extension sahnesi atlanır; 16 sahne ve 93 aşama kalır.

Merkezî registry/source map için kesin ID, tam slayt dizileri, saniye ve aşama sayısı makinece okunabilir `/tmp/osc10-v3-raid-metadata.json` dosyasına da yazıldı. Açılış kaynaklarına bırakılabilecek iki sentez sahnesinin kaynak seçimi de bu dosyada aralıksız/belirsiz genel başvuru yerine açık diziler olarak verilmiştir.

Ana ajanın diğer blok bütçeleriyle birleştirme: diğer bölümler core 1220+600=1820 sn, full 2175+950=3125 sn ise açılışa core 100 sn, full 90 sn ayrılması toplamları tam **2700/4500 sn = 45/75 dk** yapar.

**Süre sınırı:** 45 dk bir kavramsal genel bakıştır; her sahnede dinleyici cevabını uzun tartışmak mümkün değildir. 75 dk genişletilmiş, rehberli anlatımdır; her aşama için sınırsız soru-cevap veya tam matematik dersi diye adlandırılmamalıdır. Derin katılım isteniyorsa 90 dk tercih edilmeli: bu blokta nested RAID +45 sn, rebuild +45, integrity +30, object +30, features +30, XOR +30, multidimensional +30 ve kapanış +30 = **+270 sn** önerilir; kalan +630 sn diğer sunucular/sorular arasında dağıtılabilir. İçerik, bütçeye sığsın diye kaynaksız kesinliklere veya yalnız başlığa indirgenmez.

## 3. Sahne sözleşmeleri

Her sahnede ilk aşama amaç/soru veya gerekli başlangıç durumudur. Son aşama kısa gerekçeli sonuçtur. Enter son aşamada durur; Backspace gerçek önceki çizim/durum/hesabı geri getirir. Adlandırılmış seçimler ve sıfırlama aynı `setStage` değerini değiştirir. Sunucu geçişinde önceki modülden kalan bağımsız RAID/sekme/cevap durumu taşınmaz.

### 3.1 `host-attached` — Bağlantı ile hizmeti ayır

- **Ana iddia:** Host-attached erişim yerel I/O yolunu anlatır; aygıt arayüzü ve fiziksel bağlantı isimleri, dosya/blok hizmeti sınıflamasıyla aynı eksen değildir.
- **Aşamalar (5):** 0 host ve depolama sorusu; 1 host I/O portu ve doğrudan aygıt; 2 bus ile birden çok aygıt; 3 kaynaktaki FC/fabric örneğiyle birden çok host/aygıt; 4 iki eksen: bağlantı yolu / sunulan arayüz.
- **Anlatım:** 3. sunucunun hazırlama/swap hikâyesinden teslim alın; “Aygıt hazır, peki host ona hangi yoldan ulaşıyor?” deyin. Port ve veri yolunu işaretleyin. FC'yi daima tek yerel disk kablosu veya daima NAS protokolü gibi sınıflamayın. Yeni güncel ürün hızı/varsayılanı eklemeyin.
- **Soru → gerekçe:** “Bağlantıda ağ varsa dosya hizmeti mi vardır?” → Hayır; bağlantı yolu ile dosya/blok/API arayüzü ayrı sorulardır.
- **Geçiş:** “Şimdi uzak dosya sistemi hizmetini, aynı IP ağı üzerinden blok erişimiyle ayıralım.”

### 3.2 `nas` — Aynı ağ, farklı arayüz

- **Ana iddia:** NAS uzak dosya sistemi hizmeti verir; slayttaki iSCSI karşı örneği ağ üzerinden blok aygıtına erişmenin de mümkün olduğunu gösterir.
- **Aşamalar (6):** 0 dosya yolu isteği; 1 NFS/CIFS; 2 IP üzerinde uzak çağrı; 3 sunucu dosya sistemi ve aygıt yanıtı; 4 aynı ağ üzerindeki iSCSI/SCSI blok/LBA karşı yolu; 5 dosya sistemi sorumluluğu karşılaştırması.
- **Anlatım:** Dosya adının sunucudaki dosya sisteminde çözüldüğü aşamaya kadar ilerleyin. Sonra fiziksel ağı aynı bırakıp istemci arayüzünü LBA/blok hacmine dönüştürün. NAS protokol listesine iSCSI eklemeyin; karşı örnek olarak ayırın. NFS/CIFS adları kaynağın dönem bağlamıdır.
- **Soru → gerekçe:** “iSCSI aynı IP ağındaysa NAS dosya protokolü müdür?” → Hayır; SCSI/blok işlemlerini IP üzerinden taşır.
- **Geçiş:** “Uzak veri merkezi için kitap başka bir arayüzü, hizmet API'sini öne çıkarıyor.”

### 3.3 `cloud-storage` — Uzak hizmet ve API

- **Ana iddia:** Kitabın bulut örneği WAN/Internet üzerinden API kullanan programı, gecikme ve başarısızlık gerekçesiyle anlatır.
- **Aşamalar (5):** 0 uygulama isteği; 1 WAN/Internet yolu; 2 API arayüzü; 3 uzak veri merkezi ve yanıt/başarısızlık; 4 gecikme + hata sonucu.
- **Anlatım:** Fiziksel API cihazı çizmekten kaçının; API'yi hizmet sınırı olarak gösterin. NAS ile kitaptaki karşılaştırmayı anlatın; bütün güncel bulut ürünlerinin yalnız nesne depolama sunduğunu söylemeyin. Slayttaki ürün adları gerekli değil; verilirse tarihsel örnek etiketi taşımalı.
- **Soru → gerekçe:** “Uzak istekte yalnız aktarım hızı yeterli mi?” → Gecikme ve başarısızlık olasılığı program tasarımına dahildir.
- **Geçiş:** “Bu hizmetin veya host'un gördüğü hacmin arkasında bir depolama dizisi bulunabilir.”

### 3.4 `storage-arrays` — Dizi bir RAID seviyesi değildir

- **Ana iddia:** Storage array host portları, denetleyiciler, bellek/yazılım ve aygıtları birleştirir; RAID bunun sağladığı özelliklerden biridir.
- **Aşamalar (5):** 0 tek aygıt / dizi; 1 host portları ve denetleyici; 2 bellek/yazılım ve disk grubu; 3 paylaşılan kaynak ve hizmetler; 4 RAID / snapshot / clone / thin provisioning / replication / deduplication ayrımı.
- **Anlatım:** Görselde üç-beş temsilî disk yeterli; tüm kapasiteyi çizdiğinizi iddia etmeyin. Kaynaktaki NAS'ın iletişim ağı yükü karşılaştırmasını yalnız gösterilen doğrudan bağlı dizi örneğinin bağlamında anlatın; “diziler ağ kullanmaz” demeyin. Hizmet adlarını kısa görev kartlarında tanıtın; snapshot/replication ayrıntısı sonraki sahneye bırakılır.
- **Soru → gerekçe:** “Snapshot veya replication varsa RAID seviyesi belirlenmiş olur mu?” → Hayır; farklı görevlerdir.
- **Geçiş:** “Birçok host ve birçok dizi arasında bu bağlantıyı nasıl düzenleriz?”

### 3.5 `san` — Fabric ve hacim görünürlüğü

- **Ana iddia:** SAN çok host ve diziyi depolama ağı üzerinden esnek biçimde bağlar; belirli hacimler belirli host'lara sunulur.
- **Aşamalar (6):** 0 iki host ve iki dizi; 1 aradaki switch/fabric; 2 host→fabric→dizi yolu; 3 iki ayrı LUN/hacim; 4 LUN masking ile host başına görünürlük; 5 ayrı depolama/iletişim ağları sorusu ve iSCSI/FCoE karşı bağlamı.
- **Anlatım:** LUN masking'de A host'unun A hacmini, B host'unun B hacmini gördüğünü gerçekten değişen çizgilerle gösterin. Görünürlüğü genel kimlik doğrulama veya her üründe aynı güvenlik garantisi gibi sunmayın. FC/InfiniBand kaynak örnekleridir; ağ teknolojisiyle dosya sistemi koordinasyonu karıştırılmaz.
- **Soru → gerekçe:** “Bir hacmi birden çok host'a göstermek dosya sistemi tutarlılığını çözer mi?” → Hayır; blok görünürlüğü tek başına ortak dosya sistemi koordinasyonu değildir.
- **Geçiş:** “Hacme ulaşmayı çözdük; bu hacmin arkasında disk kaybına nasıl dayanabiliriz?”

### 3.6 `raid-intro` — Güvenilirlik ve onarım penceresi

- **Ana iddia:** Yedeklilik ve onarım birlikte değerlendirilir; arızadan sonraki onarım penceresi ek kayıba maruz kalınan dönemdir.
- **Aşamalar (5):** 0 kapasite/paralellik/güvenilirlik hedefleri; 1 sağlam kopya; 2 bir disk arızası ve MTTF kavramı; 3 onarım penceresi / MTTR; 4 veri kaybına kadar süre ve varsayımlar.
- **Anlatım:** “Ortalama”nın tek diske bitiş tarihi vermediğini söyleyin. Bağımsız arızalı ayna örneğinin teorik olduğunu açıkça belirtin. NVRAM'ın kaynakta yazma performansı desteği olarak yer aldığını notlarda anın; yeni kalıcılık garantisi üretmeyin. Metin çıkarımındaki bozuk sayı/formülden hesap türetmeyin.
- **Soru → gerekçe:** “Bir diski kaybettikten sonra hâlâ veri okunabiliyorsa risk aynı mı?” → Hayır; onarım tamamlanana kadar ek arıza korumayı tüketebilir.
- **Geçiş:** “Önce iki yapı taşını görelim: dağıtmak ve kopyalamak.”

### 3.7 `raid-striping` — Şerit ve ayna

- **Ana iddia:** RAID0 dağıtır, RAID1 kopyalar; kapasite ve arıza koşulu farklıdır.
- **Aşamalar (6):** 0 RAID0 parçalar; 1 bir disk kaybı; 2 temiz iki diskli RAID1; 3 bir kopya kaybı; 4 iki kopya kaybı; 5 kapasite/sağlam bilgi karşılaştırması.
- **Anlatım:** Önce farklı A kimliklerini, sonra aynı A kimliklerini ve bitleri gösterin. Dört 4 TB RAID0 ile iki 4 TB RAID1 farklı fiziksel toplam içerir; her kart kendi paydasını taşır. Kurtarılamayan örnekte sayı “kurulu kapasite, erişilemez” diye etiketlenir.
- **Soru → gerekçe:** “Veriyi dört diske bölmek neden koruma değildir?” → Eksik parçayı üretecek bağımsız kopya/koruma bilgisi yoktur.
- **Geçiş:** “Tam kopyanın alan maliyetini azaltmak için koruma bilgisi hesaplayabiliriz.”

### 3.8 `raid-parity` — Koruma bilgisinin yerleşimi

- **Ana iddia:** RAID4 ayrılmış P, RAID5 dağıtılmış P, RAID6 bağımsız P/Q kullanır; ikinci koruma bilgisi ilk paritenin kopyası değildir.
- **Aşamalar (6):** 0 veri+P; 1 RAID4 sabit P diski; 2 RAID5 dönen P; 3 tek disk kaybı ve yeterli bilgi; 4 RAID6 iki koruma / iki disk kaybı; 5 sadece 4/5/6 kapasite ve koruma özeti.
- **Anlatım:** Her şeritte hangi disk rolünün değiştiğini gösterin; tek “parite diski” genellemesini RAID5'e taşımayın. Q cebirini çalıştırmayan diyagram bunu açıkça söyler. Core modunda tek bilinmeyenin nasıl geri bulunabileceğini sözel anlatıp ayrıntılı XOR uzantısını atlayabilirsiniz.
- **Soru → gerekçe:** “İki P kopyası RAID6'nın iki bağımsız korumasıyla aynı mıdır?” → Hayır; aynı denklem ikinci bilinmeyeni belirlemez.
- **Geçiş:** Full: “Bir kayıp bloğu küçük bir bit örneğiyle hesaplayalım.” Core: “Koruma grubunun sınırları da sonucu değiştirir.”

### 3.9 `raid-xor` — Özgün hesap uzantısı

- **Ana iddia:** Bir tek kayıp blok, sağlam veri ve P'den XOR ile yeniden üretilebilir; aynı denklem iki bilinmeyeni çözmez.
- **Aşamalar (5):** 0 1100/1010/0110; 1 P=0000 hesapla; 2 A1 kayıp ve sonucu gizle; 3 A1=1100⊕0110⊕0000=1010 aç; 4 ikinci kayıp ve yetersiz bilgi.
- **Anlatım:** Bit dizileri ve adımlar kitabın hazır sayısal örneği değil, parite kavramını açıklayan özgün modeldir. Sonuç saklıyken dinleyiciden bekleyin; sonuç farklı aşamada açılır. Geriye dönüş sonucu kapatır ve tek/çift kayıp durumunu gerçekten geri kurar.
- **Soru → gerekçe:** “İki eksik blokta aynı XOR işlemini iki kez çalıştırmak yeterli mi?” → Bağımsız ikinci koruma bilgisi olmadan iki bilinmeyen çözülemez.
- **Geçiş:** “Kaynak figüründeki seviyeler aynı koruma bilgisini farklı düzenlerde yerleştirir.”

### 3.10 `raid-levels` — Çok boyutlu koruma uzantısı

- **Ana iddia:** Slayt40 yalnız 0/1/4/5/6 etiketlerinden ibaret değildir; çok boyutlu RAID6 figürü de yer alır.
- **Aşamalar (4):** 0 bilinen seviye haritası; 1 P/Q satır düzeni; 2 iki boyutlu aygıt tablosu; 3 kaynak figürüne uygun satır/sütun P/Q rolleri ve model sınırı.
- **Anlatım:** Yeni GF cebiri, keyfî disk sayısı için kapasite formülü veya arıza toleransı garantisi üretmeyin. Bu, koruma bilgisinin iki boyutlu yerleşimini tanıtan dar bir kaynak figürü açıklamasıdır. RAID2/3'ü kanıtlanmamış kapsam doldurmak için eklemeyin.
- **Soru → gerekçe:** “Bir figürde daha fazla P/Q görmekten tek bir evrensel arıza garantisi çıkar mı?” → Yerleşim ve hata varsayımı ayrıca tanımlanmalıdır.
- **Geçiş:** “Şeritleme ile aynalamayı hangi sırada birleştirdiğimiz de grup sınırlarını değiştirir.”

### 3.11 `raid-nested` — 0+1 ile 1+0 gerçekten farklıdır

- **Ana iddia:** Aynalama ve şeritlemenin birleştirme sırası, bir arızanın hangi grubu kullanılamaz yaptığına etki eder.
- **Aşamalar (7):** 0 dört fiziksel disk ve iki gruplama; 1 0+1: şerit gruplarını aynala; 2 D0 kaybıyla bir şerit grubunun kaybı; 3 1+0: aynaları şeritle; 4 D0 kaybıyla yalnız bir ayna kopyasının kaybı; 5 D0+D1 aynı fiziksel seçimde iki düzenin sonucu; 6 D0+D2 ve sonuç karşılaştırması.
- **Anlatım:** Küçültülmüş dört diskli örnek özgün modeldir; slayt41'in sekiz diskli şeklinin birebir kopyası değildir. Her çizimde eş veri kimlikleri görünmelidir. 0+1'de şerit grupları [D0,D1] ve [D2,D3]; 1+0'da ayna çiftleri [D0,D1] ve [D2,D3] olarak tanımlanır, dolayısıyla veri yerleşimleri farklıdır. Bunu yalnız renkli kutu değişimiyle geçmeyin.
- **Soru → gerekçe:** “D0+D1 kaybı iki düzende aynı mı?” → Bu açık dört diskli modelde 0+1'in ikinci sağlam şerit kopyası kalır; 1+0'ın ilk ayna çiftinin iki kopyası kaybolur. D0+D2'de sonuçlar tersine döner.
- **Geçiş:** “Kalan bilgi yeterliyse korumayı geri getirmek için yeniden kurma yapılabilir.”

### 3.12 `raid-rebuild` — Yedek disk ile sağlam kopya farklıdır

- **Ana iddia:** Hot spare veya yeni disk takılması korumayı hemen geri getirmez; eksik içerik yeterli sağlam bilgiden yeniden üretilir.
- **Aşamalar (7):** 0 sağlıklı RAID5 ve boş hot spare; 1 D0 arızası; 2 yedeğin devreye girmesi / ∅ hücreler; 3 ilk şerit; 4 ikinci şerit; 5 son şerit ve korumanın dönmesi; 6 MTTR/okuma-yazma maliyeti sonucu.
- **Anlatım:** Yedek disk arızalı X değil “Yedek” olarak görünür. Bitmemiş hücreler ∅, tamamlanan hücreler gerçek veri/parite etiketi taşır. İlk şerit bittiğinde bütün diski sağlam ilan etmeyin. Zaman çizgisi üç şeridi gerçek saniye gibi sunmaz. İkinci disk kaybında bilgi yetersizse model rebuild'i engellemelidir.
- **Soru → gerekçe:** “Boş yedek takılınca koruma tamam mı?” → Hayır; veri yeniden kurulana kadar koruma penceresi açıktır. Otomatik yedekleme devri beklemeyi/MTTR'yi azaltabilir.
- **Geçiş:** “Arızayı onarmak dışında, değişikliklerden geri dönme ve farklı siteye kopyalama ihtiyaçları var.”

### 3.13 `raid-features` — Snapshot, replication ve hot spare

- **Ana iddia:** Üç özellik farklı olaya yanıt verir: zamandaki görünüm, siteler arası yazı kopyası ve boş aygıtın arıza sonrası devreye girmesi.
- **Aşamalar (6):** 0 üç farklı görev; 1 değişiklik öncesi snapshot görünümü; 2 iki site arasında replication; 3 senkron/asenkron akış farkı; 4 hot spare'ın MTTR ile bağlantısı; 5 snapshot≠replication≠aygıt onarımı.
- **Anlatım:** Snapshot'ın yalnız geçmiş görünüm olduğunu, dizi tamamen kaybolursa kendiliğinden bağımsız bir kopya vaat etmediğini anlatın. Senkron/asenkron için okların onay sırasını gerçekten değiştirin; doğrulanmamış RPO/RTO sayıları eklemeyin. Önceki hot spare örneğini tek kısa geri referansla bağlayın; rebuild'i yeniden baştan tekrarlamayın.
- **Soru → gerekçe:** “Aynı dizide snapshot varsa dizi kaybından bağımsız korunmuş muyuz?” → Bu tek özelliğin tanımından böyle bir garanti çıkmaz; ayrı site/kopya ve hata kapsamı değerlendirilir.
- **Geçiş:** “Peki diskler çalışırken veri sessizce bozulursa bunu kim fark eder?”

### 3.14 `raid-integrity` — Veri ve metadata kontrolü

- **Ana iddia:** RAID'in disk arızası koruması veri bozulmasının genel tespit/düzeltme sistemi değildir; kaynakta ZFS veriyi ve metadata'yı checksum ile denetler.
- **Aşamalar (5):** 0 sağlam disk ama değişmiş veri; 1 veri+metadata için checksum; 2 pointer ile kontrol bilgisinin ilişkisi; 3 okunan içerik/kimlik karşılaştırması, uyuşmazlık; 4 tespit ve yeterli sağlam kopyadan düzeltme ayrımı.
- **Anlatım:** C₁/C₂ yalnız temsili ad olursa bunu belirtin; gerçek hash üretiliyormuş gibi davranmayın. Yanlış nesne ile değişmiş içerik olasılıklarını pointer bağlamına bağlayın. “Checksum varsa her hata kesin yakalanır” veya “tek checksum kayıp veriyi üretir” demeyin.
- **Soru → gerekçe:** “Bir kontrol değeri uyuşmazlığı tek başına doğru veriyi geri verir mi?” → Hayır; tespit farklıdır, düzeltmek için yeterli sağlam bilgi gerekir.
- **Geçiş:** “Aynı kaynak, dosya sistemlerine alanı disk sınırlarından farklı sunan havuz yaklaşımına geçiyor.”

### 3.15 `storage-pools` — Geleneksel sabit sınırlar ve ortak havuz

- **Ana iddia:** Havuz yaklaşımında dosya sistemleri ortak alanı kullanıp bırakabilir; geleneksel sabit volume/partition sınırlarıyla aynı yönetim modeli değildir.
- **Aşamalar (5):** 0 disk→bölüm/volume→dosya sistemi geleneksel yol; 1 A'nın ayrılan sınırı dolarken B'deki ayrılmış boş alan; 2 aynı disklerin ortak havuzu; 3 A/B'nin havuzdan alan alması; 4 alan bırakma ve farkın özeti.
- **Anlatım:** Sayılar kullanılacaksa bunlar özgün küçük sabit örnekler olmalı; alan toplamı her aşamada korunmalıdır. Slayt43–44'teki ZFS bağlamını koruyun; her OS veya her dosya sisteminde aynı özellik bulunduğunu söylemeyin. Bu gerçek yeniden bölümleme aracı değildir.
- **Soru → gerekçe:** “Havuz tüm fiziksel kapasiteyi sınırsız mı yapar?” → Hayır; yönetim sınırları değişir, toplam fiziksel alan sınırlı kalır.
- **Geçiş:** “Çok büyük ölçekte dosya/dizin arayüzü yerine nesne kimlikleriyle çalışan başka bir yaklaşım var.”

### 3.16 `object-storage` — Nesnenin yaşam döngüsü ve yerleştirilmesi

- **Ana iddia:** Nesne erişimi ID üzerinden yürür; yerleştirme ve koruma yazılımı birden çok sistemde kopyaları yönetebilir ve ölçeği yatay büyütebilir.
- **Aşamalar (6):** 0 havuzda veri nesnesi; 1 oluştur ve ID al; 2 ID ile eriş; 3 ID ile sil; 4 ayrı sistemlerde N kopyanın yerleştirilmesi/korunması; 5 yeni sistem ekleme ve yatay ölçekleme.
- **Anlatım:** ID silinince önceki ID ile erişim durumunu gerçekten değiştirin; sonraki kopya/ölçekleme aşaması yeni, açıkça etiketli bir yerleştirme örneğine geçsin. Böylece silinmiş nesneyi nedensiz geri getirmiş olmazsınız. Kaynak HDFS/Ceph örnek adları verirse bunlar slayttaki bağlam olarak kalır; güncel ürün mimarisine dair yeni iddia eklemeyin. “Dizinle gezinme yok” ifadesini kaynaktaki dar nesne havuzu arayüzüne bağlayın; tüm modern servis arayüzleri için mutlak genelleme yapmayın.
- **Soru → gerekçe:** “Nesnenin fiziksel yerini uygulama seçmek zorunda mı?” → Bu örnekte program ID kullanır; yerleştirme ve kopya korumasını depolama yönetim yazılımı belirler.
- **Geçiş:** “Artık bir isteğin maliyetini, bağlandığı hizmeti ve korunduğu hata modelini birlikte anlatabiliriz.”

### 3.17 `io-journey` — Ortak kapanışta tek istek

- **Ana iddia:** Aygıt, zamanlama, yönetim, bağlantı ve koruma aynı depolama sistemi içindeki ayrı sorumluluklardır.
- **Aşamalar (7):** 0 bütün görünüm; 1 uygulama; 2 OS kuyruğu; 3 erişim arayüzü/bağlantı; 4 varsa dizi/RAID; 5 HDD/NVM aygıt maliyeti; 6 ECC/checksum/veri bütünlüğü.
- **Anlatım ve devir:** 4. sunucu “Son iki sahnede bütün ekibi tek istek etrafında birleştirelim” diyerek kapanışı açar. 1. sunucu aygıt için, 2. kuyruk için, 3. doğruluk/alan için birer kısa gerekçe ekleyebilir; ancak fiziksel klavye tek kişide kalır. Bu katkılar zaman bütçesine dahildir, zorunlu yeni sahne değildir.
- **Soru → gerekçe:** “Swap her dosya okumasının bir adımı mı?” → Hayır; ayrı bir depolama kullanım amacı. RAID de her sistemde zorunlu değildir.
- **Geçiş:** “Bir tasarımı değerlendirirken hangi soruları birlikte sormamız gerekir?”

### 3.18 `storage-wrap-up` — Gerekçeli tasarım sorusu

- **Ana iddia:** İş yükü, gecikme, hata modeli ve geri dönüş ihtiyacı birlikte tanımlanır; tek bir hız veya kapasite sayısı tasarımı belirlemez.
- **Aşamalar (6):** 0 soru; 1 iş yükü; 2 gecikme bileşenleri; 3 hata kapsamı; 4 bağımsız geri dönüş kopyası; 5 dördünün birlikte değerlendirilmesi ve konuya dönüş.
- **Anlatım ve devir:** 4. sunucu dört soruyu sırayla açar. Soru gelirse semantic menüden ilgili konuya dönülür; görünür sıra numarası değişse de hedef ID sabittir. Kaynak paneli kitap/baskı ve slayt numarasını gösterir. Açılış ve kapanış “Ortak” görünmeli; son sunucunun bölüm süresiyle karıştırılmamalıdır.
- **Soru → gerekçe:** “Hızlı ve yedekli demek yeterli mi?” → İş yükü, gecikme hedefi, hata varsayımı, bütünlük ve geri dönüş gereksinimi olmadan belirsizdir.
- **Son durum:** Enter artık sahne değiştirmez veya başa dönmez. Soru-cevap, menü ve kaynak erişimi kullanılır.

## 4. Eski → yeni route/konu eşlemesi

Eski bağlantılar güncel canonical konuya yönlendirilir; eski Sxx numaralarını yeni numaraların kalıcı kimliği yapmayın. Bölünen sahnenin diğer parçaları önerilen konu bağlantıları/notlarda gösterilir.

| Eski ID | Canonical yeni hedef | Ayrılan/bağlantılı diğer konular |
| --- | --- | --- |
| `s26` | `host-attached` | `nas`, `storage-arrays`, `san` |
| `s27` | `nas` | `san` |
| `s28` | `cloud-storage` | — |
| `s29` | `storage-arrays` | `raid-intro` |
| `s30` | `raid-striping` | — |
| `s31` | `raid-parity` | `raid-xor`, `raid-levels` |
| `s32` | `raid-nested` | — |
| `s33` | `raid-rebuild` | `raid-intro`, `raid-features` |
| `s34` | `raid-integrity` | `raid-nested`, `raid-features`, `storage-pools`, `object-storage` |
| `s35` | `io-journey` | — |
| `s36` | `storage-wrap-up` | — |

`s34` için checksum ana dayanağı ilk canonical hedef olur; eski aşama numaralarının yeni konuya birebir aktarılması vaat edilmez. Yeni rotaların `#/sunum/raid-integrity` gibi semantic kimlikleri olur; kullanıcıya görünen sıra registry'den türetilir.

## 5. Phase 2 uygulama ve doğrulama sözleşmesi

### Bileşenler / veri sınırı

- `attachmentScenes`: host-attached, NAS, cloud, array, SAN. Beş ayrı öğrenme hedefi; gerekiyorsa ortak `TopologyDiagram` kullanılır, eski S26/S27 çoğaltması taşınmaz.
- `raidStories`: reliability, striping/mirror, parity, XOR, levels, nested, rebuild, features. Ortak board/failure/health bileşenleri kalabilir; sahne kimliği/aşama saf modele girer.
- `integrityStories`: checksum, traditional/pooled storage, object lifecycle/placement. Bunlar ortak RAID state'inin alt sekmesi değil ayrı sahnelerdir.
- `closingScenes`: özgün bütünleştirme ve dört tasarım sorusu. Her şey ortak aşama durumundan türetilir.
- Metaveri: `id`, `kind`, `depth`, `seconds:{core,full}`, bölüm/slayt locator, stages, notlar. Source map ile registry aynı semantic ID'leri kullanır. Source eşleşmesi olmayan sahne teslim sayılmaz.
- Küçük finite stage modelinin tüm verisi immutable/saf olmalı. Her aşama doğrudan açılabilir; önceki aşamanın çalışmış olmasına veya önceki sahnenin kaydına bağımlı olmamalı.

### Anlamlı kontroller

1. Yeni semantic ID'ler benzersiz; chapter vs closing dağılımı doğru; core ve full sıralarının toplam saniyesi hesaplanır; extension'dan sonraki core sahnesi anlamlı geçişe sahiptir.
2. Bütün aşamalar ileri/geri/rastgele sırada aynı HTML ve model durumunu üretir; komşu aşamalarda yalnız alt yazı değil ilgili diyagram/işlem/sonuç değişir. Sonuç aşaması özet olarak aynı board'u tutabilir, ancak açıkça ayrı sonuç amacı taşımalıdır.
3. 0+1 ve 1+0 için aynı fiziksel disk arızası seçimi test edilir: dört diskli açık yerleşimle D0+D1 ve D0+D2 sonuçları farklı olmalı. Yalnız kayıp sayısına bakan sahte model kabul edilmez.
4. XOR gerçek sağlam hücrelerden 1010'ı yeniden hesaplar; iki kayıpta kurtarma çıktısı üretilmez. Q hesaplanmıyorsa sembolik etiket sürer.
5. Hot spare başlangıçta tahsis edilmemiştir; arızadan sonra devreye girer; tek şerit bitince disk tam sağlam olmaz; Backspace ∅ hücreleri ve koruma durumunu geri kurar.
6. Pool örneği tahsis/toplam kapasiteyi korur; alan bırakma sonraki kullanım miktarını değiştirir. Nesne örneğinde oluşturma ID üretir, erişim mevcut ID gerektirir, silme geçerliliği kaldırır; kopya örneğine geçiş ayrı başlangıç olarak görünür.
7. Kaynak taraması: RAID2/3, güncel ürün garantileri, bozuk sayısal MTTF formülü, evrensel NAS/SAN hız sıralaması veya replication=backup gibi kaynaksız genişlemeler bulunmamalı.
8. Kullanıcı tercihi korunur: tarayıcı/ekran görüntüsü yok. TypeScript/build, pure model testleri, bütün aşamaların SSR sözleşmesi ve canlı HTTP denetimi yapılır; gerçek yerleşim veya projeksiyon okunabilirliği doğrulandı denmez.

### Prova notu

Core45 için iki extension menüde derinleşme olarak erişilebilir kalır; ileri ok onları normal core akışında ziyaret etmez. Full75'te her iki uzantı sıraya katılır. “Core” müfredatın farklı bir kitap sürümü değildir; aynı doğrulanmış kapsamın daha kısa sözlü geçişidir. 90 dakikalık prova, daha uzun tahmin bekleme ve geri/ileri tekrar sürelerini ayrı ölçer. Sunucu, süre yetişsin diye bir modelin sonucunu aşamadan önce söylememelidir.
