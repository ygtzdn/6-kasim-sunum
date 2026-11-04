import type { SceneNotes } from "../../presentation/types";

/** Speaker preparation follows docs/bolum-planlari/04-baglanti-raid-kapanis.md. */
export const attachmentRaidNotes: Record<string, SceneNotes> = {
  "host-attached": {
    represents:
      "Depolamaya hangi yoldan ulaşırız? sahnesi şu ilişkiyi görselleştirir: Host-attached erişim yerel I/O yolunu anlatır; aygıt arayüzü ve fiziksel bağlantı isimleri, dosya/blok hizmeti sınıflamasıyla aynı eksen değildir. Sıra: Bağlantı sorusu → Host portu ve aygıt → Bus ile birden çok aygıt → FC fabric örneği → Bağlantı yolu ve hizmet arayüzü. Mavi ana veri/sorumluluğu, turuncu sorun veya sınırı vurgular; sahneye özel etiketler renklerin anlamını açıklar.",
    learningGoal:
      "Bağlantı yolu ile istemciye sunulan dosya, blok veya API arayüzü ayrı eksenlerdir.",
    walkthrough: [
      "Başlangıçta Bağlantı sorusu aşamasını gösterin; sonucu açıklamadan sahnenin sorusunu sorun.",
      "3. sunucunun hazırlama/swap hikâyesinden teslim alın; “Aygıt hazır, peki host ona hangi yoldan ulaşıyor?” deyin. Port ve veri yolunu işaretleyin. FC'yi daima tek yerel disk kablosu veya daima NAS protokolü gibi sınıflamayın. Yeni güncel ürün hızı/varsayılanı eklemeyin.",
      "Enter ile şu gerçek görsel durumları sırayla açın: Host portu ve aygıt → Bus ile birden çok aygıt → FC fabric örneği → Bağlantı yolu ve hizmet arayüzü.",
      "Backspace ile bir önceki aşamaya dönüp görseli ve sonucu karşılaştırın. Sekmeler ve sıfırlama aynı ortak aşamayı seçer; sahnede otomatik ilerleme yoktur.",
    ],
    keyPoints: [
      "Host-attached erişim yerel I/O yolunu anlatır; aygıt arayüzü ve fiziksel bağlantı isimleri, dosya/blok hizmeti sınıflamasıyla aynı eksen değildir.",
      "Hayır; bağlantı yolu ile dosya/blok/API arayüzü ayrı sorulardır.",
      "Yerel port, bus ve fabric kavramsal çizimlerdir; aygıt/protokol hızı ölçülmez ve üç evrensel, birbirini dışlayan ürün sınıfı oluşturulmaz.",
    ],
    limits:
      "Yerel port, bus ve fabric kavramsal çizimlerdir; aygıt/protokol hızı ölçülmez ve üç evrensel, birbirini dışlayan ürün sınıfı oluşturulmaz. Bütün durumlar sunum aşamasından yeniden oluşturulur; gerçek donanıma veya dış servise erişilmez, animasyon süresi ölçüm değildir.",
    question: {
      prompt: "“Bağlantıda ağ varsa dosya hizmeti mi vardır?”",
      answer:
        "Hayır; bağlantı yolu ile dosya/blok/API arayüzü ayrı sorulardır.",
    },
    transition:
      "“Şimdi uzak dosya sistemi hizmetini, aynı IP ağı üzerinden blok erişimiyle ayıralım.”",
  },
  nas: {
    represents:
      "Ağda dosya mı, blok mu? sahnesi şu ilişkiyi görselleştirir: NAS uzak dosya sistemi hizmeti verir; slayttaki iSCSI karşı örneği ağ üzerinden blok aygıtına erişmenin de mümkün olduğunu gösterir. Sıra: Dosya yolu isteği → NFS ve CIFS → IP üzerinde uzak çağrı → Sunucuda dosya sistemi → iSCSI ile blok karşı örneği → Dosya ve blok sorumluluğu. Mavi ana veri/sorumluluğu, turuncu sorun veya sınırı vurgular; sahneye özel etiketler renklerin anlamını açıklar.",
    learningGoal:
      "NAS uzak dosya sistemi hizmeti verir; aynı IP ağı üzerindeki iSCSI ise SCSI/blok erişimi taşıyabilir.",
    walkthrough: [
      "Başlangıçta Dosya yolu isteği aşamasını gösterin; sonucu açıklamadan sahnenin sorusunu sorun.",
      "Dosya adının sunucudaki dosya sisteminde çözüldüğü aşamaya kadar ilerleyin. Sonra fiziksel ağı aynı bırakıp istemci arayüzünü LBA/blok hacmine dönüştürün. NAS protokol listesine iSCSI eklemeyin; karşı örnek olarak ayırın. NFS/CIFS adları kaynağın dönem bağlamıdır.",
      "Enter ile şu gerçek görsel durumları sırayla açın: NFS ve CIFS → IP üzerinde uzak çağrı → Sunucuda dosya sistemi → iSCSI ile blok karşı örneği → Dosya ve blok sorumluluğu.",
      "Backspace ile bir önceki aşamaya dönüp görseli ve sonucu karşılaştırın. Sekmeler ve sıfırlama aynı ortak aşamayı seçer; sahnede otomatik ilerleme yoktur.",
    ],
    keyPoints: [
      "NAS uzak dosya sistemi hizmeti verir; slayttaki iSCSI karşı örneği ağ üzerinden blok aygıtına erişmenin de mümkün olduğunu gösterir.",
      "Hayır; SCSI/blok işlemlerini IP üzerinden taşır.",
      "Tipik istemci/sunucu sorumluluklarının özgün şemasıdır. NFS/CIFS kaynak bağlamıdır; iSCSI NAS dosya protokolü olarak etiketlenmez.",
    ],
    limits:
      "Tipik istemci/sunucu sorumluluklarının özgün şemasıdır. NFS/CIFS kaynak bağlamıdır; iSCSI NAS dosya protokolü olarak etiketlenmez. Bütün durumlar sunum aşamasından yeniden oluşturulur; gerçek donanıma veya dış servise erişilmez, animasyon süresi ölçüm değildir.",
    question: {
      prompt: "“iSCSI aynı IP ağındaysa NAS dosya protokolü müdür?”",
      answer: "Hayır; SCSI/blok işlemlerini IP üzerinden taşır.",
    },
    transition:
      "“Uzak veri merkezi için kitap başka bir arayüzü, hizmet API'sini öne çıkarıyor.”",
  },
  "cloud-storage": {
    represents:
      "Uzak depolamaya API ile erişim sahnesi şu ilişkiyi görselleştirir: Kitabın bulut örneği WAN/Internet üzerinden API kullanan programı, gecikme ve başarısızlık gerekçesiyle anlatır. Sıra: Uygulama işlemi → WAN ve Internet yolu → Hizmet API arayüzü → Uzak hizmet ve yanıt → Gecikme ve başarısızlık. Mavi ana veri/sorumluluğu, turuncu sorun veya sınırı vurgular; sahneye özel etiketler renklerin anlamını açıklar.",
    learningGoal:
      "Kitabın bulut örneğinde program uzak veri merkezine API üzerinden ulaşır; gecikme ve başarısızlık tasarımın parçasıdır.",
    walkthrough: [
      "Başlangıçta Uygulama işlemi aşamasını gösterin; sonucu açıklamadan sahnenin sorusunu sorun.",
      "Fiziksel API cihazı çizmekten kaçının; API'yi hizmet sınırı olarak gösterin. NAS ile kitaptaki karşılaştırmayı anlatın; bütün güncel bulut ürünlerinin yalnız nesne depolama sunduğunu söylemeyin. Slayttaki ürün adları gerekli değil; verilirse tarihsel örnek etiketi taşımalı.",
      "Enter ile şu gerçek görsel durumları sırayla açın: WAN ve Internet yolu → Hizmet API arayüzü → Uzak hizmet ve yanıt → Gecikme ve başarısızlık.",
      "Backspace ile bir önceki aşamaya dönüp görseli ve sonucu karşılaştırın. Sekmeler ve sıfırlama aynı ortak aşamayı seçer; sahnede otomatik ilerleme yoktur.",
    ],
    keyPoints: [
      "Kitabın bulut örneği WAN/Internet üzerinden API kullanan programı, gecikme ve başarısızlık gerekçesiyle anlatır.",
      "Gecikme ve başarısızlık olasılığı program tasarımına dahildir.",
      "Yerel istek şemasıdır; gerçek API çağrısı veya güncel bulut ürünleri sınıflandırması yapılmaz. API fiziksel bir aygıt değildir.",
    ],
    limits:
      "Yerel istek şemasıdır; gerçek API çağrısı veya güncel bulut ürünleri sınıflandırması yapılmaz. API fiziksel bir aygıt değildir. Bütün durumlar sunum aşamasından yeniden oluşturulur; gerçek donanıma veya dış servise erişilmez, animasyon süresi ölçüm değildir.",
    question: {
      prompt: "“Uzak istekte yalnız aktarım hızı yeterli mi?”",
      answer: "Gecikme ve başarısızlık olasılığı program tasarımına dahildir.",
    },
    transition:
      "“Bu hizmetin veya host'un gördüğü hacmin arkasında bir depolama dizisi bulunabilir.”",
  },
  "storage-arrays": {
    represents:
      "Bir depolama dizisinin içi sahnesi şu ilişkiyi görselleştirir: Storage array host portları, denetleyiciler, bellek/yazılım ve aygıtları birleştirir; RAID bunun sağladığı özelliklerden biridir. Sıra: Tek aygıttan diziye → Host portları ve denetleyici → Bellek, yazılım ve diskler → Paylaşım ve hizmetler → Dizi özelliği ile RAID seviyesi. Mavi ana veri/sorumluluğu, turuncu sorun veya sınırı vurgular; sahneye özel etiketler renklerin anlamını açıklar.",
    learningGoal:
      "Storage array host bağlantılarını, denetleyiciyi ve aygıtları birleştirir; RAID ve snapshot gibi hizmetler aynı kavram değildir.",
    walkthrough: [
      "Başlangıçta Tek aygıttan diziye aşamasını gösterin; sonucu açıklamadan sahnenin sorusunu sorun.",
      "Görselde üç-beş temsilî disk yeterli; tüm kapasiteyi çizdiğinizi iddia etmeyin. Kaynaktaki NAS'ın iletişim ağı yükü karşılaştırmasını yalnız gösterilen doğrudan bağlı dizi örneğinin bağlamında anlatın; “diziler ağ kullanmaz” demeyin. Hizmet adlarını kısa görev kartlarında tanıtın; snapshot/replication ayrıntısı sonraki sahneye bırakılır.",
      "Enter ile şu gerçek görsel durumları sırayla açın: Host portları ve denetleyici → Bellek, yazılım ve diskler → Paylaşım ve hizmetler → Dizi özelliği ile RAID seviyesi.",
      "Backspace ile bir önceki aşamaya dönüp görseli ve sonucu karşılaştırın. Sekmeler ve sıfırlama aynı ortak aşamayı seçer; sahnede otomatik ilerleme yoktur.",
    ],
    keyPoints: [
      "Storage array host portları, denetleyiciler, bellek/yazılım ve aygıtları birleştirir; RAID bunun sağladığı özelliklerden biridir.",
      "Hayır; farklı görevlerdir.",
      "Diskler ve denetleyici temsildir. Kitabın doğrudan dizi/NAS ağ yükü karşılaştırması bütün diziler ağsızdır biçiminde genellenmez.",
    ],
    limits:
      "Diskler ve denetleyici temsildir. Kitabın doğrudan dizi/NAS ağ yükü karşılaştırması bütün diziler ağsızdır biçiminde genellenmez. Bütün durumlar sunum aşamasından yeniden oluşturulur; gerçek donanıma veya dış servise erişilmez, animasyon süresi ölçüm değildir.",
    question: {
      prompt:
        "“Snapshot veya replication varsa RAID seviyesi belirlenmiş olur mu?”",
      answer: "Hayır; farklı görevlerdir.",
    },
    transition:
      "“Birçok host ve birçok dizi arasında bu bağlantıyı nasıl düzenleriz?”",
  },
  san: {
    represents:
      "Birçok host, birçok dizi sahnesi şu ilişkiyi görselleştirir: SAN çok host ve diziyi depolama ağı üzerinden esnek biçimde bağlar; belirli hacimler belirli host'lara sunulur. Sıra: Hostlar ve diziler → Switch ve fabric → Depolama yolu → LUN ve hacimler → LUN masking ile görünürlük → Ayrı ağlar ve arayüz ayrımı. Mavi ana veri/sorumluluğu, turuncu sorun veya sınırı vurgular; sahneye özel etiketler renklerin anlamını açıklar.",
    learningGoal:
      "SAN çok host ve diziyi bağlar; belirli hacimlerin hostlara görünürlüğü dosya sistemi koordinasyonundan ayrı bir karardır.",
    walkthrough: [
      "Başlangıçta Hostlar ve diziler aşamasını gösterin; sonucu açıklamadan sahnenin sorusunu sorun.",
      "LUN masking'de A host'unun A hacmini, B host'unun B hacmini gördüğünü gerçekten değişen çizgilerle gösterin. Görünürlüğü genel kimlik doğrulama veya her üründe aynı güvenlik garantisi gibi sunmayın. FC/InfiniBand kaynak örnekleridir; ağ teknolojisiyle dosya sistemi koordinasyonu karıştırılmaz.",
      "Enter ile şu gerçek görsel durumları sırayla açın: Switch ve fabric → Depolama yolu → LUN ve hacimler → LUN masking ile görünürlük → Ayrı ağlar ve arayüz ayrımı.",
      "Backspace ile bir önceki aşamaya dönüp görseli ve sonucu karşılaştırın. Sekmeler ve sıfırlama aynı ortak aşamayı seçer; sahnede otomatik ilerleme yoktur.",
    ],
    keyPoints: [
      "SAN çok host ve diziyi depolama ağı üzerinden esnek biçimde bağlar; belirli hacimler belirli host'lara sunulur.",
      "Hayır; blok görünürlüğü tek başına ortak dosya sistemi koordinasyonu değildir.",
      "LUN görünürlüğü çizimde değişir; gerçek ağ, yetkilendirme veya küme dosya sistemi kurulmaz. Kaynaktaki FC/InfiniBand ve iSCSI/FCoE bağlamı korunur.",
    ],
    limits:
      "LUN görünürlüğü çizimde değişir; gerçek ağ, yetkilendirme veya küme dosya sistemi kurulmaz. Kaynaktaki FC/InfiniBand ve iSCSI/FCoE bağlamı korunur. Bütün durumlar sunum aşamasından yeniden oluşturulur; gerçek donanıma veya dış servise erişilmez, animasyon süresi ölçüm değildir.",
    question: {
      prompt:
        "“Bir hacmi birden çok host'a göstermek dosya sistemi tutarlılığını çözer mi?”",
      answer:
        "Hayır; blok görünürlüğü tek başına ortak dosya sistemi koordinasyonu değildir.",
    },
    transition:
      "“Hacme ulaşmayı çözdük; bu hacmin arkasında disk kaybına nasıl dayanabiliriz?”",
  },
  "raid-intro": {
    represents:
      "Yedeklilik ve onarım penceresi sahnesi şu ilişkiyi görselleştirir: Yedeklilik ve onarım birlikte değerlendirilir; arızadan sonraki onarım penceresi ek kayıba maruz kalınan dönemdir. Sıra: Kapasite, paralellik ve güvenilirlik → Bağımsız sağlam kopya → Disk arızası ve MTTF → Onarım penceresi ve MTTR → Veri kaybı ve varsayımlar. Mavi ana veri/sorumluluğu, turuncu sorun veya sınırı vurgular; sahneye özel etiketler renklerin anlamını açıklar.",
    learningGoal:
      "Yedeklilik ve onarım birlikte değerlendirilir; onarım tamamlanana kadar ek arızaya maruz kalınan pencere önemlidir.",
    walkthrough: [
      "Başlangıçta Kapasite, paralellik ve güvenilirlik aşamasını gösterin; sonucu açıklamadan sahnenin sorusunu sorun.",
      "“Ortalama”nın tek diske bitiş tarihi vermediğini söyleyin. Bağımsız arızalı ayna örneğinin teorik olduğunu açıkça belirtin. NVRAM'ın kaynakta yazma performansı desteği olarak yer aldığını notlarda anın; yeni kalıcılık garantisi üretmeyin. Metin çıkarımındaki bozuk sayı/formülden hesap türetmeyin.",
      "Enter ile şu gerçek görsel durumları sırayla açın: Bağımsız sağlam kopya → Disk arızası ve MTTF → Onarım penceresi ve MTTR → Veri kaybı ve varsayımlar.",
      "Backspace ile bir önceki aşamaya dönüp görseli ve sonucu karşılaştırın. Sekmeler ve sıfırlama aynı ortak aşamayı seçer; sahnede otomatik ilerleme yoktur.",
    ],
    keyPoints: [
      "Yedeklilik ve onarım birlikte değerlendirilir; arızadan sonraki onarım penceresi ek kayıba maruz kalınan dönemdir.",
      "Hayır; onarım tamamlanana kadar ek arıza korumayı tüketebilir.",
      "MTTF/MTTR ilişkisi kavramsaldır. Kaynak metin çıkarımında bozuk görünen ömür sayısı/formülü kullanılmaz; bağımsız arıza varsayımı garantiye dönüştürülmez.",
    ],
    limits:
      "MTTF/MTTR ilişkisi kavramsaldır. Kaynak metin çıkarımında bozuk görünen ömür sayısı/formülü kullanılmaz; bağımsız arıza varsayımı garantiye dönüştürülmez. Bütün durumlar sunum aşamasından yeniden oluşturulur; gerçek donanıma veya dış servise erişilmez, animasyon süresi ölçüm değildir.",
    question: {
      prompt:
        "“Bir diski kaybettikten sonra hâlâ veri okunabiliyorsa risk aynı mı?”",
      answer: "Hayır; onarım tamamlanana kadar ek arıza korumayı tüketebilir.",
    },
    transition: "“Önce iki yapı taşını görelim: dağıtmak ve kopyalamak.”",
  },
  "raid-striping": {
    represents:
      "Veriyi dağıtmak mı, kopyalamak mı? sahnesi şu ilişkiyi görselleştirir: RAID0 dağıtır, RAID1 kopyalar; kapasite ve arıza koşulu farklıdır. Sıra: RAID 0 parçaları → RAID 0 tek disk kaybı → RAID 1 aynı kopyalar → RAID 1 bir sağlam kopya → RAID 1 iki kopya kaybı → Kapasite ve koruma karşılığı. Mavi ana veri/sorumluluğu, turuncu sorun veya sınırı vurgular; sahneye özel etiketler renklerin anlamını açıklar.",
    learningGoal:
      "Şeritleme tek başına koruma sağlamaz; aynalama sağlam kopya karşılığında fiziksel alan kullanır.",
    walkthrough: [
      "Başlangıçta RAID 0 parçaları aşamasını gösterin; sonucu açıklamadan sahnenin sorusunu sorun.",
      "Önce farklı A kimliklerini, sonra aynı A kimliklerini ve bitleri gösterin. Dört 4 TB RAID0 ile iki 4 TB RAID1 farklı fiziksel toplam içerir; her kart kendi paydasını taşır. Kurtarılamayan örnekte sayı “kurulu kapasite, erişilemez” diye etiketlenir.",
      "Enter ile şu gerçek görsel durumları sırayla açın: RAID 0 tek disk kaybı → RAID 1 aynı kopyalar → RAID 1 bir sağlam kopya → RAID 1 iki kopya kaybı → Kapasite ve koruma karşılığı.",
      "Backspace ile bir önceki aşamaya dönüp görseli ve sonucu karşılaştırın. Sekmeler ve sıfırlama aynı ortak aşamayı seçer; sahnede otomatik ilerleme yoktur.",
    ],
    keyPoints: [
      "RAID0 dağıtır, RAID1 kopyalar; kapasite ve arıza koşulu farklıdır.",
      "Eksik parçayı üretecek bağımsız kopya/koruma bilgisi yoktur.",
      "Dört diskli RAID0 ve iki diskli RAID1 özgün eş kapasiteli örneklerdir. Nominal kapasite ile erişilebilirlik ayrı gösterilir; performans çarpanı üretilmez.",
    ],
    limits:
      "Dört diskli RAID0 ve iki diskli RAID1 özgün eş kapasiteli örneklerdir. Nominal kapasite ile erişilebilirlik ayrı gösterilir; performans çarpanı üretilmez. Bütün durumlar sunum aşamasından yeniden oluşturulur; gerçek donanıma veya dış servise erişilmez, animasyon süresi ölçüm değildir.",
    question: {
      prompt: "“Veriyi dört diske bölmek neden koruma değildir?”",
      answer: "Eksik parçayı üretecek bağımsız kopya/koruma bilgisi yoktur.",
    },
    transition:
      "“Tam kopyanın alan maliyetini azaltmak için koruma bilgisi hesaplayabiliriz.”",
  },
  "raid-parity": {
    represents:
      "Koruma bilgisini nereye koyarız? sahnesi şu ilişkiyi görselleştirir: RAID4 ayrılmış P, RAID5 dağıtılmış P, RAID6 bağımsız P/Q kullanır; ikinci koruma bilgisi ilk paritenin kopyası değildir. Sıra: Veri ve P ilişkisi → RAID 4 ayrılmış parite → RAID 5 dağıtılmış parite → Tek kayıp ve yeterli bilgi → RAID 6 bağımsız P ve Q → Parite seviyelerini karşılaştır. Mavi ana veri/sorumluluğu, turuncu sorun veya sınırı vurgular; sahneye özel etiketler renklerin anlamını açıklar.",
    learningGoal:
      "RAID4/5 tek P korumasını farklı yerleştirir; RAID6 ikinci bağımsız korumayla iki tam disk kaybını karşılayabilir.",
    walkthrough: [
      "Başlangıçta Veri ve P ilişkisi aşamasını gösterin; sonucu açıklamadan sahnenin sorusunu sorun.",
      "Her şeritte hangi disk rolünün değiştiğini gösterin; tek “parite diski” genellemesini RAID5'e taşımayın. Q cebirini çalıştırmayan diyagram bunu açıkça söyler. Core modunda tek bilinmeyenin nasıl geri bulunabileceğini sözel anlatıp ayrıntılı XOR uzantısını atlayabilirsiniz.",
      "Enter ile şu gerçek görsel durumları sırayla açın: RAID 4 ayrılmış parite → RAID 5 dağıtılmış parite → Tek kayıp ve yeterli bilgi → RAID 6 bağımsız P ve Q → Parite seviyelerini karşılaştır.",
      "Backspace ile bir önceki aşamaya dönüp görseli ve sonucu karşılaştırın. Sekmeler ve sıfırlama aynı ortak aşamayı seçer; sahnede otomatik ilerleme yoktur.",
    ],
    keyPoints: [
      "RAID4 ayrılmış P, RAID5 dağıtılmış P, RAID6 bağımsız P/Q kullanır; ikinci koruma bilgisi ilk paritenin kopyası değildir.",
      "Hayır; aynı denklem ikinci bilinmeyeni belirlemez.",
      "Eş boyutlu disk/şerit gösterimi özgündür. RAID6 Q cebiri semboliktir; aynı XOR bilgisinin ikinci kopyası iki bağımsız denklem diye sunulmaz.",
    ],
    limits:
      "Eş boyutlu disk/şerit gösterimi özgündür. RAID6 Q cebiri semboliktir; aynı XOR bilgisinin ikinci kopyası iki bağımsız denklem diye sunulmaz. Bütün durumlar sunum aşamasından yeniden oluşturulur; gerçek donanıma veya dış servise erişilmez, animasyon süresi ölçüm değildir.",
    question: {
      prompt: "“İki P kopyası RAID6'nın iki bağımsız korumasıyla aynı mıdır?”",
      answer: "Hayır; aynı denklem ikinci bilinmeyeni belirlemez.",
    },
    transition:
      "Full: “Bir kayıp bloğu küçük bir bit örneğiyle hesaplayalım.” Core: “Koruma grubunun sınırları da sonucu değiştirir.”",
  },
  "raid-xor": {
    represents:
      "Kayıp bloğu sağlam bilgilerden üret sahnesi şu ilişkiyi görselleştirir: Bir tek kayıp blok, sağlam veri ve P'den XOR ile yeniden üretilebilir; aynı denklem iki bilinmeyeni çözmez. Sıra: Üç veri bloğu → P paritesini hesapla → A1 kayıp: önce tahmin et → Sağlam hücrelerden A1 üret → İkinci bilinmeyenin sınırı. Mavi ana veri/sorumluluğu, turuncu sorun veya sınırı vurgular; sahneye özel etiketler renklerin anlamını açıklar.",
    learningGoal:
      "Tek kayıp blok sağlam veri ve P üzerinden yeniden hesaplanabilir; aynı denklem iki bilinmeyeni çözmez.",
    walkthrough: [
      "Başlangıçta Üç veri bloğu aşamasını gösterin; sonucu açıklamadan sahnenin sorusunu sorun.",
      "Bit dizileri ve adımlar kitabın hazır sayısal örneği değil, parite kavramını açıklayan özgün modeldir. Sonuç saklıyken dinleyiciden bekleyin; sonuç farklı aşamada açılır. Geriye dönüş sonucu kapatır ve tek/çift kayıp durumunu gerçekten geri kurar.",
      "Enter ile şu gerçek görsel durumları sırayla açın: P paritesini hesapla → A1 kayıp: önce tahmin et → Sağlam hücrelerden A1 üret → İkinci bilinmeyenin sınırı.",
      "Backspace ile bir önceki aşamaya dönüp görseli ve sonucu karşılaştırın. Sekmeler ve sıfırlama aynı ortak aşamayı seçer; sahnede otomatik ilerleme yoktur.",
    ],
    keyPoints: [
      "Bir tek kayıp blok, sağlam veri ve P'den XOR ile yeniden üretilebilir; aynı denklem iki bilinmeyeni çözmez.",
      "Bağımsız ikinci koruma bilgisi olmadan iki bilinmeyen çözülemez.",
      "1100,1010,0110 ve 0000 bitleri özgün eğitim örneğidir, kitabın hazır sayısal örneği değildir. XOR sonucu gerçekten sağlam hücrelerden hesaplanır.",
    ],
    limits:
      "1100,1010,0110 ve 0000 bitleri özgün eğitim örneğidir, kitabın hazır sayısal örneği değildir. XOR sonucu gerçekten sağlam hücrelerden hesaplanır. Bütün durumlar sunum aşamasından yeniden oluşturulur; gerçek donanıma veya dış servise erişilmez, animasyon süresi ölçüm değildir.",
    question: {
      prompt:
        "“İki eksik blokta aynı XOR işlemini iki kez çalıştırmak yeterli mi?”",
      answer:
        "Bağımsız ikinci koruma bilgisi olmadan iki bilinmeyen çözülemez.",
    },
    transition:
      "“Kaynak figüründeki seviyeler aynı koruma bilgisini farklı düzenlerde yerleştirir.”",
  },
  "raid-levels": {
    represents:
      "Koruma bilgisini iki boyutta yerleştirmek sahnesi şu ilişkiyi görselleştirir: Slayt40 yalnız 0/1/4/5/6 etiketlerinden ibaret değildir; çok boyutlu RAID6 figürü de yer alır. Sıra: Bilinen RAID seviye haritası → P ve Q yerleşimi → İki boyutlu aygıt düzeni → Satır ve sütun koruma rolleri. Mavi ana veri/sorumluluğu, turuncu sorun veya sınırı vurgular; sahneye özel etiketler renklerin anlamını açıklar.",
    learningGoal:
      "Resmî slayt40 çok boyutlu RAID6 yerleşimini de gösterir; yalnız seviye adından evrensel hata garantisi çıkarılmaz.",
    walkthrough: [
      "Başlangıçta Bilinen RAID seviye haritası aşamasını gösterin; sonucu açıklamadan sahnenin sorusunu sorun.",
      "Yeni GF cebiri, keyfî disk sayısı için kapasite formülü veya arıza toleransı garantisi üretmeyin. Bu, koruma bilgisinin iki boyutlu yerleşimini tanıtan dar bir kaynak figürü açıklamasıdır. RAID2/3'ü kanıtlanmamış kapsam doldurmak için eklemeyin.",
      "Enter ile şu gerçek görsel durumları sırayla açın: P ve Q yerleşimi → İki boyutlu aygıt düzeni → Satır ve sütun koruma rolleri.",
      "Backspace ile bir önceki aşamaya dönüp görseli ve sonucu karşılaştırın. Sekmeler ve sıfırlama aynı ortak aşamayı seçer; sahnede otomatik ilerleme yoktur.",
    ],
    keyPoints: [
      "Slayt40 yalnız 0/1/4/5/6 etiketlerinden ibaret değildir; çok boyutlu RAID6 figürü de yer alır.",
      "Yerleşim ve hata varsayımı ayrıca tanımlanmalıdır.",
      "Kaynak figürünü açıklayan dar bir yerleşim şemasıdır; GF cebiri, keyfî boyutlarda kapasite veya arıza garantisi hesaplanmaz. Kaynakta doğrulanmayan RAID2/3 eklenmez.",
    ],
    limits:
      "Kaynak figürünü açıklayan dar bir yerleşim şemasıdır; GF cebiri, keyfî boyutlarda kapasite veya arıza garantisi hesaplanmaz. Kaynakta doğrulanmayan RAID2/3 eklenmez. Bütün durumlar sunum aşamasından yeniden oluşturulur; gerçek donanıma veya dış servise erişilmez, animasyon süresi ölçüm değildir.",
    question: {
      prompt:
        "“Bir figürde daha fazla P/Q görmekten tek bir evrensel arıza garantisi çıkar mı?”",
      answer: "Yerleşim ve hata varsayımı ayrıca tanımlanmalıdır.",
    },
    transition:
      "“Şeritleme ile aynalamayı hangi sırada birleştirdiğimiz de grup sınırlarını değiştirir.”",
  },
  "raid-nested": {
    represents:
      "Önce ayna mı, önce şerit mi? sahnesi şu ilişkiyi görselleştirir: Aynalama ve şeritlemenin birleştirme sırası, bir arızanın hangi grubu kullanılamaz yaptığına etki eder. Sıra: Aynı diskler, iki gruplama → 0+1: şerit gruplarını aynala → 0+1: bir disk ve grup kaybı → 1+0: aynaları şeritle → 1+0: bir ayna kopyası kayıp → D0 ve D1 sonuçları → D0 ve D2 sonuçları. Mavi ana veri/sorumluluğu, turuncu sorun veya sınırı vurgular; sahneye özel etiketler renklerin anlamını açıklar.",
    learningGoal:
      "Şeritleme ve aynalamanın sırası, bir disk kaybının hangi koruma grubunu etkilediğini değiştirir.",
    walkthrough: [
      "Başlangıçta Aynı diskler, iki gruplama aşamasını gösterin; sonucu açıklamadan sahnenin sorusunu sorun.",
      "Küçültülmüş dört diskli örnek özgün modeldir; slayt41'in sekiz diskli şeklinin birebir kopyası değildir. Her çizimde eş veri kimlikleri görünmelidir. 0+1'de şerit grupları [D0,D1] ve [D2,D3]; 1+0'da ayna çiftleri [D0,D1] ve [D2,D3] olarak tanımlanır, dolayısıyla veri yerleşimleri farklıdır. Bunu yalnız renkli kutu değişimiyle geçmeyin.",
      "Enter ile şu gerçek görsel durumları sırayla açın: 0+1: şerit gruplarını aynala → 0+1: bir disk ve grup kaybı → 1+0: aynaları şeritle → 1+0: bir ayna kopyası kayıp → D0 ve D1 sonuçları → D0 ve D2 sonuçları.",
      "Backspace ile bir önceki aşamaya dönüp görseli ve sonucu karşılaştırın. Sekmeler ve sıfırlama aynı ortak aşamayı seçer; sahnede otomatik ilerleme yoktur.",
    ],
    keyPoints: [
      "Aynalama ve şeritlemenin birleştirme sırası, bir arızanın hangi grubu kullanılamaz yaptığına etki eder.",
      "Bu açık dört diskli modelde 0+1'in ikinci sağlam şerit kopyası kalır; 1+0'ın ilk ayna çiftinin iki kopyası kaybolur. D0+D2'de sonuçlar tersine döner.",
      "Slayt41 kavramının özgün dört diskli indirgemesidir. 0+1 şerit grupları ve 1+0 ayna çiftleri açıkça çizilir; aynı fiziksel kayıp seçiminde farklı sonuç gerçekten hesaplanır.",
    ],
    limits:
      "Slayt41 kavramının özgün dört diskli indirgemesidir. 0+1 şerit grupları ve 1+0 ayna çiftleri açıkça çizilir; aynı fiziksel kayıp seçiminde farklı sonuç gerçekten hesaplanır. Bütün durumlar sunum aşamasından yeniden oluşturulur; gerçek donanıma veya dış servise erişilmez, animasyon süresi ölçüm değildir.",
    question: {
      prompt: "“D0+D1 kaybı iki düzende aynı mı?”",
      answer:
        "Bu açık dört diskli modelde 0+1'in ikinci sağlam şerit kopyası kalır; 1+0'ın ilk ayna çiftinin iki kopyası kaybolur. D0+D2'de sonuçlar tersine döner.",
    },
    transition:
      "“Kalan bilgi yeterliyse korumayı geri getirmek için yeniden kurma yapılabilir.”",
  },
  "raid-rebuild": {
    represents:
      "Boş yedek nasıl sağlam kopya olur? sahnesi şu ilişkiyi görselleştirir: Hot spare veya yeni disk takılması korumayı hemen geri getirmez; eksik içerik yeterli sağlam bilgiden yeniden üretilir. Sıra: Sağlıklı dizi ve boş hot spare → D0 arızası → Yedek devrede, içerik boş → Birinci şerit yeniden kuruldu → İkinci şerit yeniden kuruldu → Son şerit ve korumanın dönüşü → Onarım maliyeti ve sınırı. Mavi ana veri/sorumluluğu, turuncu sorun veya sınırı vurgular; sahneye özel etiketler renklerin anlamını açıklar.",
    learningGoal:
      "Yedek disk devreye girse bile eksik içerik tamamlanana kadar tam koruma geri gelmez; rebuild yeterli sağlam bilgi gerektirir.",
    walkthrough: [
      "Başlangıçta Sağlıklı dizi ve boş hot spare aşamasını gösterin; sonucu açıklamadan sahnenin sorusunu sorun.",
      "Yedek disk arızalı X değil “Yedek” olarak görünür. Bitmemiş hücreler ∅, tamamlanan hücreler gerçek veri/parite etiketi taşır. İlk şerit bittiğinde bütün diski sağlam ilan etmeyin. Zaman çizgisi üç şeridi gerçek saniye gibi sunmaz. İkinci disk kaybında bilgi yetersizse model rebuild'i engellemelidir.",
      "Enter ile şu gerçek görsel durumları sırayla açın: D0 arızası → Yedek devrede, içerik boş → Birinci şerit yeniden kuruldu → İkinci şerit yeniden kuruldu → Son şerit ve korumanın dönüşü → Onarım maliyeti ve sınırı.",
      "Backspace ile bir önceki aşamaya dönüp görseli ve sonucu karşılaştırın. Sekmeler ve sıfırlama aynı ortak aşamayı seçer; sahnede otomatik ilerleme yoktur.",
    ],
    keyPoints: [
      "Hot spare veya yeni disk takılması korumayı hemen geri getirmez; eksik içerik yeterli sağlam bilgiden yeniden üretilir.",
      "Hayır; veri yeniden kurulana kadar koruma penceresi açıktır. Otomatik yedekleme devri beklemeyi/MTTR'yi azaltabilir.",
      "Üç temsili şerit özgün durum modelidir; gerçek süre/bant genişliği tahmini değildir. Backspace kısmi şerit durumunu ve eksik hücreleri geri kurar.",
    ],
    limits:
      "Üç temsili şerit özgün durum modelidir; gerçek süre/bant genişliği tahmini değildir. Backspace kısmi şerit durumunu ve eksik hücreleri geri kurar. Bütün durumlar sunum aşamasından yeniden oluşturulur; gerçek donanıma veya dış servise erişilmez, animasyon süresi ölçüm değildir.",
    question: {
      prompt: "“Boş yedek takılınca koruma tamam mı?”",
      answer:
        "Hayır; veri yeniden kurulana kadar koruma penceresi açıktır. Otomatik yedekleme devri beklemeyi/MTTR'yi azaltabilir.",
    },
    transition:
      "“Arızayı onarmak dışında, değişikliklerden geri dönme ve farklı siteye kopyalama ihtiyaçları var.”",
  },
  "raid-features": {
    represents:
      "Snapshot, replication ve hot spare sahnesi şu ilişkiyi görselleştirir: Üç özellik farklı olaya yanıt verir: zamandaki görünüm, siteler arası yazı kopyası ve boş aygıtın arıza sonrası devreye girmesi. Sıra: Üç ayrı ihtiyaç → Snapshot: zamandaki görünüm → Replication: iki site → Senkron ve asenkron yazı akışı → Hot spare ve onarım penceresi → Özelliklerin görevlerini ayır. Mavi ana veri/sorumluluğu, turuncu sorun veya sınırı vurgular; sahneye özel etiketler renklerin anlamını açıklar.",
    learningGoal:
      "Snapshot geçmiş görünümü, replication siteler arası yazı kopyasını, hot spare arızalı aygıtın yerine geçmeyi hedefler.",
    walkthrough: [
      "Başlangıçta Üç ayrı ihtiyaç aşamasını gösterin; sonucu açıklamadan sahnenin sorusunu sorun.",
      "Snapshot'ın yalnız geçmiş görünüm olduğunu, dizi tamamen kaybolursa kendiliğinden bağımsız bir kopya vaat etmediğini anlatın. Senkron/asenkron için okların onay sırasını gerçekten değiştirin; doğrulanmamış RPO/RTO sayıları eklemeyin. Önceki hot spare örneğini tek kısa geri referansla bağlayın; rebuild'i yeniden baştan tekrarlamayın.",
      "Enter ile şu gerçek görsel durumları sırayla açın: Snapshot: zamandaki görünüm → Replication: iki site → Senkron ve asenkron yazı akışı → Hot spare ve onarım penceresi → Özelliklerin görevlerini ayır.",
      "Backspace ile bir önceki aşamaya dönüp görseli ve sonucu karşılaştırın. Sekmeler ve sıfırlama aynı ortak aşamayı seçer; sahnede otomatik ilerleme yoktur.",
    ],
    keyPoints: [
      "Üç özellik farklı olaya yanıt verir: zamandaki görünüm, siteler arası yazı kopyası ve boş aygıtın arıza sonrası devreye girmesi.",
      "Bu tek özelliğin tanımından böyle bir garanti çıkmaz; ayrı site/kopya ve hata kapsamı değerlendirilir.",
      "Özgün zaman/yazı akışı şemasıdır; gerçek snapshot veya uzak kopya oluşturulmaz. Senkron/asenkron ayrımı onay sırasıyla gösterilir; RPO/RTO veya bağımsız yedek garantisi üretilmez.",
    ],
    limits:
      "Özgün zaman/yazı akışı şemasıdır; gerçek snapshot veya uzak kopya oluşturulmaz. Senkron/asenkron ayrımı onay sırasıyla gösterilir; RPO/RTO veya bağımsız yedek garantisi üretilmez. Bütün durumlar sunum aşamasından yeniden oluşturulur; gerçek donanıma veya dış servise erişilmez, animasyon süresi ölçüm değildir.",
    question: {
      prompt:
        "“Aynı dizide snapshot varsa dizi kaybından bağımsız korunmuş muyuz?”",
      answer:
        "Bu tek özelliğin tanımından böyle bir garanti çıkmaz; ayrı site/kopya ve hata kapsamı değerlendirilir.",
    },
    transition:
      "“Peki diskler çalışırken veri sessizce bozulursa bunu kim fark eder?”",
  },
  "raid-integrity": {
    represents:
      "Disk çalışırken veri bozulabilir sahnesi şu ilişkiyi görselleştirir: RAID'in disk arızası koruması veri bozulmasının genel tespit/düzeltme sistemi değildir; kaynakta ZFS veriyi ve metadata'yı checksum ile denetler. Sıra: Sağlam disk, değişmiş içerik → Veri ve metadata checksum → Pointer ile kontrol bilgisi → İçerik ve kimlik uyuşmazlığı → Tespit ve düzeltme sınırı. Mavi ana veri/sorumluluğu, turuncu sorun veya sınırı vurgular; sahneye özel etiketler renklerin anlamını açıklar.",
    learningGoal:
      "RAID disk arızasına odaklanır; kaynakta ZFS veri ve metadata bütünlüğünü checksum ile de denetler.",
    walkthrough: [
      "Başlangıçta Sağlam disk, değişmiş içerik aşamasını gösterin; sonucu açıklamadan sahnenin sorusunu sorun.",
      "C₁/C₂ yalnız temsili ad olursa bunu belirtin; gerçek hash üretiliyormuş gibi davranmayın. Yanlış nesne ile değişmiş içerik olasılıklarını pointer bağlamına bağlayın. “Checksum varsa her hata kesin yakalanır” veya “tek checksum kayıp veriyi üretir” demeyin.",
      "Enter ile şu gerçek görsel durumları sırayla açın: Veri ve metadata checksum → Pointer ile kontrol bilgisi → İçerik ve kimlik uyuşmazlığı → Tespit ve düzeltme sınırı.",
      "Backspace ile bir önceki aşamaya dönüp görseli ve sonucu karşılaştırın. Sekmeler ve sıfırlama aynı ortak aşamayı seçer; sahnede otomatik ilerleme yoktur.",
    ],
    keyPoints: [
      "RAID'in disk arızası koruması veri bozulmasının genel tespit/düzeltme sistemi değildir; kaynakta ZFS veriyi ve metadata'yı checksum ile denetler.",
      "Hayır; tespit farklıdır, düzeltmek için yeterli sağlam bilgi gerekir.",
      "Checksum ve pointer ilişkisi kavramsal gösterilir. C1/C2 adları kullanılırsa temsili olduğu belirtilir; tek checksumdan doğru veri üretildiği veya her hata yakalandığı iddia edilmez.",
    ],
    limits:
      "Checksum ve pointer ilişkisi kavramsal gösterilir. C1/C2 adları kullanılırsa temsili olduğu belirtilir; tek checksumdan doğru veri üretildiği veya her hata yakalandığı iddia edilmez. Bütün durumlar sunum aşamasından yeniden oluşturulur; gerçek donanıma veya dış servise erişilmez, animasyon süresi ölçüm değildir.",
    question: {
      prompt:
        "“Bir kontrol değeri uyuşmazlığı tek başına doğru veriyi geri verir mi?”",
      answer:
        "Hayır; tespit farklıdır, düzeltmek için yeterli sağlam bilgi gerekir.",
    },
    transition:
      "“Aynı kaynak, dosya sistemlerine alanı disk sınırlarından farklı sunan havuz yaklaşımına geçiyor.”",
  },
  "storage-pools": {
    represents:
      "Sabit sınırlar mı, ortak alan mı? sahnesi şu ilişkiyi görselleştirir: Havuz yaklaşımında dosya sistemleri ortak alanı kullanıp bırakabilir; geleneksel sabit volume/partition sınırlarıyla aynı yönetim modeli değildir. Sıra: Geleneksel bölüm ve volume sınırları → Bir dosya sistemi dolarken boş alan → Diskleri ortak havuza ayır → Havuzdan alan kullan → Alan bırak ve farkı özetle. Mavi ana veri/sorumluluğu, turuncu sorun veya sınırı vurgular; sahneye özel etiketler renklerin anlamını açıklar.",
    learningGoal:
      "Havuz yaklaşımında dosya sistemleri ortak alanı kullanıp bırakabilir; yönetim sınırları değişir, fiziksel kapasite sınırlı kalır.",
    walkthrough: [
      "Başlangıçta Geleneksel bölüm ve volume sınırları aşamasını gösterin; sonucu açıklamadan sahnenin sorusunu sorun.",
      "Sayılar kullanılacaksa bunlar özgün küçük sabit örnekler olmalı; alan toplamı her aşamada korunmalıdır. Slayt43–44'teki ZFS bağlamını koruyun; her OS veya her dosya sisteminde aynı özellik bulunduğunu söylemeyin. Bu gerçek yeniden bölümleme aracı değildir.",
      "Enter ile şu gerçek görsel durumları sırayla açın: Bir dosya sistemi dolarken boş alan → Diskleri ortak havuza ayır → Havuzdan alan kullan → Alan bırak ve farkı özetle.",
      "Backspace ile bir önceki aşamaya dönüp görseli ve sonucu karşılaştırın. Sekmeler ve sıfırlama aynı ortak aşamayı seçer; sahnede otomatik ilerleme yoktur.",
    ],
    keyPoints: [
      "Havuz yaklaşımında dosya sistemleri ortak alanı kullanıp bırakabilir; geleneksel sabit volume/partition sınırlarıyla aynı yönetim modeli değildir.",
      "Hayır; yönetim sınırları değişir, toplam fiziksel alan sınırlı kalır.",
      "Küçük alan sayıları özgün örnek olabilir; toplam kapasite korunur. Slayt43–44 ZFS bağlamıdır; tüm dosya sistemleri için güncel bir özellik genellemesi değildir.",
    ],
    limits:
      "Küçük alan sayıları özgün örnek olabilir; toplam kapasite korunur. Slayt43–44 ZFS bağlamıdır; tüm dosya sistemleri için güncel bir özellik genellemesi değildir. Bütün durumlar sunum aşamasından yeniden oluşturulur; gerçek donanıma veya dış servise erişilmez, animasyon süresi ölçüm değildir.",
    question: {
      prompt: "“Havuz tüm fiziksel kapasiteyi sınırsız mı yapar?”",
      answer:
        "Hayır; yönetim sınırları değişir, toplam fiziksel alan sınırlı kalır.",
    },
    transition:
      "“Çok büyük ölçekte dosya/dizin arayüzü yerine nesne kimlikleriyle çalışan başka bir yaklaşım var.”",
  },
  "object-storage": {
    represents:
      "Nesneyi kimliğiyle bulmak sahnesi şu ilişkiyi görselleştirir: Nesne erişimi ID üzerinden yürür; yerleştirme ve koruma yazılımı birden çok sistemde kopyaları yönetebilir ve ölçeği yatay büyütebilir. Sıra: Havuzda veri nesnesi → Oluştur ve ID al → ID ile eriş → ID ile sil → Ayrı yerleştirme örneğinde N kopya → Yeni sistemle yatay büyüme. Mavi ana veri/sorumluluğu, turuncu sorun veya sınırı vurgular; sahneye özel etiketler renklerin anlamını açıklar.",
    learningGoal:
      "Program nesne kimliğiyle erişir; yerleştirme, koruma ve birden çok sistemde kopyaları depolama yönetim yazılımı düzenleyebilir.",
    walkthrough: [
      "Başlangıçta Havuzda veri nesnesi aşamasını gösterin; sonucu açıklamadan sahnenin sorusunu sorun.",
      "ID silinince önceki ID ile erişim durumunu gerçekten değiştirin; sonraki kopya/ölçekleme aşaması yeni, açıkça etiketli bir yerleştirme örneğine geçsin. Böylece silinmiş nesneyi nedensiz geri getirmiş olmazsınız. Kaynak HDFS/Ceph örnek adları verirse bunlar slayttaki bağlam olarak kalır; güncel ürün mimarisine dair yeni iddia eklemeyin. “Dizinle gezinme yok” ifadesini kaynaktaki dar nesne havuzu arayüzüne bağlayın; tüm modern servis arayüzleri için mutlak genelleme yapmayın.",
      "Enter ile şu gerçek görsel durumları sırayla açın: Oluştur ve ID al → ID ile eriş → ID ile sil → Ayrı yerleştirme örneğinde N kopya → Yeni sistemle yatay büyüme.",
      "Backspace ile bir önceki aşamaya dönüp görseli ve sonucu karşılaştırın. Sekmeler ve sıfırlama aynı ortak aşamayı seçer; sahnede otomatik ilerleme yoktur.",
    ],
    keyPoints: [
      "Nesne erişimi ID üzerinden yürür; yerleştirme ve koruma yazılımı birden çok sistemde kopyaları yönetebilir ve ölçeği yatay büyütebilir.",
      "Bu örnekte program ID kullanır; yerleştirme ve kopya korumasını depolama yönetim yazılımı belirler.",
      "Oluştur/eriş/sil ve kopya yerleştirme özgün sonlu örneklerdir. Silinmiş nesne sonraki aşamada nedensiz geri gelmez; yerleştirme için yeni örnek açıkça başlatılır. Güncel HDFS/Ceph mimarisi iddiası eklenmez.",
    ],
    limits:
      "Oluştur/eriş/sil ve kopya yerleştirme özgün sonlu örneklerdir. Silinmiş nesne sonraki aşamada nedensiz geri gelmez; yerleştirme için yeni örnek açıkça başlatılır. Güncel HDFS/Ceph mimarisi iddiası eklenmez. Bütün durumlar sunum aşamasından yeniden oluşturulur; gerçek donanıma veya dış servise erişilmez, animasyon süresi ölçüm değildir.",
    question: {
      prompt: "“Nesnenin fiziksel yerini uygulama seçmek zorunda mı?”",
      answer:
        "Bu örnekte program ID kullanır; yerleştirme ve kopya korumasını depolama yönetim yazılımı belirler.",
    },
    transition:
      "“Artık bir isteğin maliyetini, bağlandığı hizmeti ve korunduğu hata modelini birlikte anlatabiliriz.”",
  },
  "io-journey": {
    represents:
      "Bütün bölüm, tek istek sahnesi şu ilişkiyi görselleştirir: Aygıt, zamanlama, yönetim, bağlantı ve koruma aynı depolama sistemi içindeki ayrı sorumluluklardır. Sıra: Bütün sistem görünümü → Uygulama isteği → OS kuyruğu → Erişim arayüzü ve bağlantı → Varsa dizi ve RAID → HDD veya NVM aygıt maliyeti → ECC ve veri bütünlüğü. Mavi ana veri/sorumluluğu, turuncu sorun veya sınırı vurgular; sahneye özel etiketler renklerin anlamını açıklar.",
    learningGoal:
      "Aygıt, kuyruk, yönetim, bağlantı ve koruma aynı depolama sistemindeki farklı sorumluluklardır.",
    walkthrough: [
      "Başlangıçta Bütün sistem görünümü aşamasını gösterin; sonucu açıklamadan sahnenin sorusunu sorun.",
      "4. sunucu “Son iki sahnede bütün ekibi tek istek etrafında birleştirelim” diyerek kapanışı açar. 1. sunucu aygıt için, 2. kuyruk için, 3. doğruluk/alan için birer kısa gerekçe ekleyebilir; ancak fiziksel klavye tek kişide kalır. Bu katkılar zaman bütçesine dahildir, zorunlu yeni sahne değildir.",
      "Enter ile şu gerçek görsel durumları sırayla açın: Uygulama isteği → OS kuyruğu → Erişim arayüzü ve bağlantı → Varsa dizi ve RAID → HDD veya NVM aygıt maliyeti → ECC ve veri bütünlüğü.",
      "Backspace ile bir önceki aşamaya dönüp görseli ve sonucu karşılaştırın. Sekmeler ve sıfırlama aynı ortak aşamayı seçer; sahnede otomatik ilerleme yoktur.",
    ],
    keyPoints: [
      "Aygıt, zamanlama, yönetim, bağlantı ve koruma aynı depolama sistemi içindeki ayrı sorumluluklardır.",
      "Hayır; ayrı bir depolama kullanım amacı. RAID de her sistemde zorunlu değildir.",
      "Bölümün özgün bütünleştirme yoludur; tek zorunlu mimari veya gerçek I/O zaman çizelgesi değildir. RAID her sistemde, swap her dosya okumasında zorunlu aşama değildir.",
    ],
    limits:
      "Bölümün özgün bütünleştirme yoludur; tek zorunlu mimari veya gerçek I/O zaman çizelgesi değildir. RAID her sistemde, swap her dosya okumasında zorunlu aşama değildir. Bütün durumlar sunum aşamasından yeniden oluşturulur; gerçek donanıma veya dış servise erişilmez, animasyon süresi ölçüm değildir.",
    question: {
      prompt: "“Swap her dosya okumasının bir adımı mı?”",
      answer:
        "Hayır; ayrı bir depolama kullanım amacı. RAID de her sistemde zorunlu değildir.",
    },
    transition:
      "Şimdi PDF'den seçilen alıştırmalarda bu maliyetleri ve koruma kararlarını uygulayalım; ardından son tasarım değerlendirmesine döneceğiz.",
  },
  "storage-wrap-up": {
    represents:
      "Doğru tasarım için dört soru sahnesi şu ilişkiyi görselleştirir: İş yükü, gecikme, hata modeli ve geri dönüş ihtiyacı birlikte tanımlanır; tek bir hız veya kapasite sayısı tasarımı belirlemez. Sıra: Tasarım sorusu → İş yükünü tanımla → Gecikme bileşenlerini ayır → Hata kapsamını belirt → Bağımsız geri dönüş kopyası → Birlikte değerlendir ve sorular. Mavi ana veri/sorumluluğu, turuncu sorun veya sınırı vurgular; sahneye özel etiketler renklerin anlamını açıklar.",
    learningGoal:
      "İş yükü, gecikme, hata modeli ve geri dönüş ihtiyacı birlikte tanımlanır; tek hız veya kapasite sayısı tasarımı belirlemez.",
    walkthrough: [
      "Başlangıçta Tasarım sorusu aşamasını gösterin; sonucu açıklamadan sahnenin sorusunu sorun.",
      "4. sunucu dört soruyu sırayla açar. Soru gelirse semantic menüden ilgili konuya dönülür; görünür sıra numarası değişse de hedef ID sabittir. Kaynak paneli kitap/baskı ve slayt numarasını gösterir. Açılış ve kapanış “Ortak” görünmeli; son sunucunun bölüm süresiyle karıştırılmamalıdır.",
      "Enter ile şu gerçek görsel durumları sırayla açın: İş yükünü tanımla → Gecikme bileşenlerini ayır → Hata kapsamını belirt → Bağımsız geri dönüş kopyası → Birlikte değerlendir ve sorular.",
      "Backspace ile bir önceki aşamaya dönüp görseli ve sonucu karşılaştırın. Sekmeler ve sıfırlama aynı ortak aşamayı seçer; sahnede otomatik ilerleme yoktur.",
    ],
    keyPoints: [
      "İş yükü, gecikme, hata modeli ve geri dönüş ihtiyacı birlikte tanımlanır; tek bir hız veya kapasite sayısı tasarımı belirlemez.",
      "İş yükü, gecikme hedefi, hata varsayımı, bütünlük ve geri dönüş gereksinimi olmadan belirsizdir.",
      "Özgün kapanış ve gerekçeli değerlendirme kartlarıdır; notlandırma, ürün önerisi veya üretim sistemi yapılandırması üretilmez. Soru geldiğinde semantic konuya dönülür.",
    ],
    limits:
      "Özgün kapanış ve gerekçeli değerlendirme kartlarıdır; notlandırma, ürün önerisi veya üretim sistemi yapılandırması üretilmez. Soru geldiğinde semantic konuya dönülür. Bütün durumlar sunum aşamasından yeniden oluşturulur; gerçek donanıma veya dış servise erişilmez, animasyon süresi ölçüm değildir.",
    question: {
      prompt: "“Hızlı ve yedekli demek yeterli mi?”",
      answer:
        "İş yükü, gecikme hedefi, hata varsayımı, bütünlük ve geri dönüş gereksinimi olmadan belirsizdir.",
    },
    transition:
      "Enter artık sahne değiştirmez veya başa dönmez. Soru-cevap, menü ve kaynak erişimi kullanılır.",
  },
};
