# Sunucu 4 — Bağlantı, RAID ve ortak kapanış provası

5 Kasım 2026. Temel eser: Operating System Concepts, Tenth Edition, §11.7–11.8. Tam kitap metni yerelde yoktur; bölüm/slayt kaynakları notlarda gösterilir.

## Süre ve kullanım

Bölüm: kısa rota 11:00, tam rota 18:55. Ortak kapanış ve Exercises: 6:00 / 10:00. Toplam 17:00 / 28:55. Süreler prova hedefidir; sınırsız soru-cevap içermez. `raid-xor` ve `raid-levels` kısa rotada atlanır.

Enter aşama ilerletir, Backspace aynı sahnede geri döner; sağ/sol ok sahne değiştirir. Son aşamada Enter sahne değiştirmez. Menü/form odağında sunum tuşları yerel kontrole bırakılır.

## Teslim alma ve bitiriş

3. sunucudan teslim: “Aygıtı kullanıma hazırladık, swap alanını ayırdık. Şimdi host ona hangi yoldan ulaşıyor ve çok aygıtla hangi korumayı kuruyor?” Klavye 4. sunucuda kalır. Ortak kapanışta diğer sunucular aygıt, kuyruk ve doğruluk için birer kısa cümle ekleyebilir; bu katkılar kapanış bütçesine dahildir.

## Prova tablosu

| Konu            | Aşama | Kısa sn | Tam sn |
| --------------- | ----: | ------: | -----: |
| host-attached   |     5 |      30 |     50 |
| nas             |     6 |      45 |     75 |
| cloud-storage   |     5 |      30 |     50 |
| storage-arrays  |     5 |      45 |     65 |
| san             |     6 |      45 |     70 |
| raid-intro      |     5 |      45 |     70 |
| raid-striping   |     6 |      60 |     95 |
| raid-parity     |     6 |      60 |     95 |
| raid-xor        |     5 |       0 |     70 |
| raid-levels     |     4 |       0 |     35 |
| raid-nested     |     7 |      60 |     85 |
| raid-rebuild    |     7 |      75 |    105 |
| raid-features   |     6 |      45 |     70 |
| raid-integrity  |     5 |      45 |     65 |
| storage-pools   |     5 |      30 |     60 |
| object-storage  |     6 |      45 |     75 |
| io-journey      |     7 |      60 |     75 |
| storage-wrap-up |     6 |      60 |     75 |

## Sahne başına konuşma ve demo

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

## Son prova denemeleri

- `raid-nested`: D0+D1 ve D0+D2 sonuçlarını iki gruplamada gerekçelendirin. Bir modelin yalnız arıza sayısına baktığını varsaymayın.
- `raid-rebuild`: son şeritten Backspace ile iki tamamlanmış şerit ve bir eksik hücre durumuna dönün. Yedek disk takılmasını tam onarım diye anlatmayın.
- `storage-pools`: A+B+boş toplamının her aşamada 12 kaldığını sesli okuyun.
- `object-storage`: obj:42 silindikten sonra obj:99 yerleştirme örneğine açık geçiş yapın; silinmiş nesneyi kendiliğinden geri gelmiş gibi anlatmayın.
- Kaynak tuzakları: MTTF büyük sayısını/formülünü tekrarlamayın; RAID2/3 eklemeyin; NFS/CIFS ile iSCSI arayüzlerini, snapshot ile bağımsız yedeği ayırın.
- Her kişi kendi bilgisayarında font/medya ve notlara erişimi prova etmelidir. Bu geliştirmede tarayıcı/ekran görüntüsü kullanılmadı; gerçek projeksiyon okunabilirliği doğrulanmış sayılmaz.

## Kapanış alıştırmaları

I/O yolculuğundan sonra PDF’den seçilen 11.13, 11.14, 11.16(a), 11.17, 11.21(a) ve 11.25(a,c) soruları açılır. Her soruda önce tartışma, Enter ile çözüm vardır. Yeni sahneler 50–55, son değerlendirme 56’dır. Hesaplar ve varsayımlar [20 numaralı belgede](20-diyagram-boyutlari-ve-exercises.md) kayıtlıdır.
