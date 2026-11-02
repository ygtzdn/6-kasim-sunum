import type { SceneNotes } from "../../presentation/types";

export const attachmentRaidNotes: Record<string, SceneNotes> = {
  s26: {
    represents:
      "Bu sahne aynı depolama isteğinin üç farklı bağlantı düzeninde hangi bileşenlerden geçtiğini temsil eder. DAS, host’a doğrudan bağlı bir aygıttır; NAS ağ üzerinden dosya hizmeti verir; SAN örneği host’a ağ üzerinden blok hacmi sunar. Düğümler gerçek cihaz envanteri değildir: veri erişiminin sorumluluk sınırlarını görünür kılan kavramsal bir topolojidir.",
    learningGoal:
      "Bağlantının fiziksel olarak yerel veya uzak olmasıyla, istemciye sunulan dosya veya blok soyutlamasının farklı sorular olduğunu ayırt etmek.",
    walkthrough: [
      "DAS seçiliyken İsteği izle ve Adım düğmelerini kullanın. Host üzerindeki dosya sistemi dosya isteğini mantıksal blok isteğine dönüştürür; istek yerel I/O bağlantısından aygıta ulaşır. Son düğümde yalnızca blok aygıtını görüyoruz; dosya adlarını aygıtın kendisinin yönettiği sonucunu çıkarmayın.",
      "NAS’a geçin. İstemci /sunum.pdf gibi bir dosya üzerinde işlem ister. İstek NFS/SMB gibi bir dosya protokolüyle ağa çıkar; dosya sunucusunun dosya sistemi bunu kendi aygıtlarına ait blok isteklerine dönüştürür. Burada istemcinin uzak veriye ilişkin temel arayüzü blok adresi değil, dosya/dizin işlemidir.",
      "SAN’a geçin. Ağ bulunmasına rağmen istemci host’a bir blok hacmi sunulur. Host bu hacmin üzerinde dosya sistemi kurabilir. Fibre Channel ve iSCSI, bu bağlamdaki protokol örnekleridir; bütün SAN’lar için tek bir fiziksel kablo veya tek bir protokol varsaymayın.",
      "Her sekmede aynı Adım kontrolüyle paketi ilerletin. Görseldeki adım sayısı ve animasyon temposu yalnızca güzergâhı anlatır. Fazla düğüm çizilmiş olması, o sistemin ölçülmüş olarak daha yavaş olduğu anlamına gelmez. Sıfırla, seçili topolojiyi koruyup isteği başa alır.",
    ],
    keyPoints: [
      "DAS: doğrudan bağlantı; bu örnekte blok aygıtı ve host üzerinde dosya sistemi.",
      "NAS: ağ üzerinden dosya/dizin hizmeti; aygıtı yöneten dosya sistemi sunucudadır.",
      "SAN: bu sunumda ağ üzerinden blok erişimi; hacmi kullanan dosya sistemi host tarafındadır.",
      "Host’un yerel dosya sistemleri, NAS istemci önbellekleri ve sunucu içi RAID gibi ayrıntılar olabilir; şema gösterilen veri yoluna odaklanır.",
    ],
    limits:
      "Eğitim modeli gerçek bağlantı kurmaz, ağ isteği göndermez veya gecikme/bant genişliği ölçmez. Birden çok host’un aynı SAN hacmini görmesi eşzamanlı dosya sistemi tutarlılığı sağlamaz; küme dosya sistemi veya uygulama düzeyinde koordinasyon gerekir. Kaynak çerçevesi: Operating System Concepts 10. baskı §11.7; SNIA NAS ve SAN eğitim sayfaları.",
    question: {
      prompt: "NAS ve SAN’ın ikisi de ağdaysa farkları nedir?",
      answer:
        "Bu örneklerde NAS dosya hizmeti, SAN blok hacmi sunar. Dosya sisteminin sorumluluğunun hangi uçta bulunduğuna bakın.",
    },
    transition:
      "Güzergâhı gördük; şimdi dosya sisteminin hangi düğümde kaldığını özellikle işaretleyelim.",
  },
  s27: {
    represents:
      "Turuncu çerçeve, örnekte depolanan dosyaların yapısını yöneten dosya sisteminin yerini gösterir. DAS ve SAN’da host; NAS’ta dosya sunucusu vurgulanır. Üstteki Dosya veya Blok etiketi istemci host’a sunulan soyutlamadır. Alt katmanda her düzenin kendi aygıt erişimi bulunabilir.",
    learningGoal:
      "Bir dosya isteğinin nerede blok isteğine çevrildiğini ve paylaşılan blok hacmiyle paylaşılan klasörün aynı hizmet olmadığını açıklamak.",
    walkthrough: [
      "NAS sekmesini açın ve turuncu Dosya sistemi etiketini bulun. İstemci dosya yolunu gönderir; sunucu ad çözümleme, dizin ve dosya sistemi metaverisi gibi işleri kendi depolama düzeni üzerinde yürütür. İsteği adımlayarak dosya protokolünün sunucuda sonlandığını gösterin.",
      "SAN’a geçin. Turuncu etiket host’a taşınır. Host’un gördüğü şey bir blok hacmidir; dosya sistemi aynı host’un içinde bu hacmi kullanır. Ağ, blokların taşınmasını sağlar; tek başına dosya sahipliği veya kilitleme politikası oluşturmaz.",
      "DAS’ı seçin ve SAN’la ortak noktayı sorun: örnekte her ikisi de host’a blok soyutlaması sunar. Fark, aygıta erişim yolunun yerel bağlantıdan mı yoksa depolama ağından mı geçtiğidir.",
      "İki host’un aynı blokları bağımsız dosya sistemleriyle yönetmesinin çakışabileceğini açıklayın. Ekrandaki “Ortak hacim ≠ ortak dosya sistemi tutarlılığı” uyarısı tam olarak bu sınırı belirtir. Paylaşım için uygun koordinasyon katmanı ayrıca tasarlanmalıdır.",
    ],
    keyPoints: [
      "Ağ erişimi, dosya erişimiyle eş anlamlı değildir.",
      "NAS istemcisi uzaktaki dosya hizmetini kullanır; istemcide hiç dosya sistemi kodu bulunmadığı iddia edilmez.",
      "SAN, dosya sisteminin host tarafında olmasına engel değildir; blok erişimi ortak dosya sistemi kilitlemesini kendiliğinden çözmez.",
      "Protokol ile fiziksel ağ ortamını ayrı kavramlar olarak tutun. Aynı ağ teknolojisi farklı üst katman erişim semantiklerini taşıyabilir.",
    ],
    limits:
      "Şema tipik kullanım düzenlerini gösterir; tüm depolama ürünlerinin iç mimarisini sınıflandırmaz. Önbellek tutarlılığı, cluster fencing ve dosya protokollerinin ayrıntıları modellenmez. Paketin hareketi performans kıyaslaması değildir. Kaynak: OSC 10 §11.7 ve SNIA dosya/blok erişim tanımları.",
    question: {
      prompt: "Paylaşılan klasör mü, host’a sunulan blok hacmi mi?",
      answer:
        "Paylaşılan klasör için NAS dosya yolunu; host’un kendi dosya sistemiyle kullanacağı blok hacmi için bu SAN yolunu gösterin. İki örnek farklı sorumluluk sınırları kurar.",
    },
    transition:
      "Aynı ayrım uzak veri merkezindeki depolama için de geçerlidir.",
  },
  s28: {
    represents:
      "Uygulama–ağ–uzak depolama çizgisi, bulut depolamasının bir konum ve hizmet sunumu bağlamı olduğunu temsil eder. Nesne sekmesi HTTP API ve kimlikle erişimi; Dosya sekmesi dosya protokolünü; Blok sekmesi host’a sunulan hacmi gösterir. Bu örnekler aynı ürünün teknik özellik listesi değildir.",
    learningGoal:
      "“Uzak” veya “bulutta” bilgisinden tek başına dosya/blok/nesne semantiği çıkarılamayacağını söylemek ve iş yükünü erişim biçimiyle eşleştirmek.",
    walkthrough: [
      "Nesne seçiliyken İstek düğmesine basın. Paket bir HTTP API isteğini temsil eder; uygulama nesne kimliğiyle veri ve metaveriye erişir. Görselde sunulan kimlik, disk sektör adresi veya geleneksel dosya yolu değildir.",
      "Dosya’ya geçin. Aynı uzaklık fikri bu kez bir dosya paylaşımı hizmeti sunar. Dosya/dizin işlemlerine ihtiyaç duyan bir uygulama için bu arayüzün anlamını anlatın. Ardından Blok’u açıp host’un bir hacim üzerinde kendi dosya sistemini çalıştırabileceğini hatırlatın.",
      "“Ağ = dosya?” sorusunda dinleyiciden seçim alın. Evet cevabından sonra SAN → blok karşı örneğini gösterin; Hayır seçimi blok erişiminin de ağdan sağlanabildiğini açıklar. Cevap yalnızca yerel olarak tutulur; sınıf çapında veri toplanmaz.",
      "Bir storage array’in tek diske indirgenemeyeceğini sözlü olarak ekleyin: host bağlantıları, bir veya daha çok denetleyici ve çok sayıda aygıt içerebilir. Snapshot, thin provisioning ve replication olası ürün özellikleridir; bunların hiçbiri RAID kavramının otomatik sonucu değildir.",
    ],
    keyPoints: [
      "Bulut depolamanın tamamı yalnızca nesne depolama değildir; dosya ve blok hizmetleri de ayrı erişim örnekleridir.",
      "Nesne API’si kimlik ve metaveriyle çalışır; geleneksel yerel blok aygıtının doğrudan yerine geçtiği varsayılmaz.",
      "Bir bağlantı düzeninin uygunluğunu iş yükü, erişim semantiği, yönetim ve hata modeliyle birlikte değerlendirin.",
      "Snapshot zaman içindeki bir görünüm, thin provisioning mantıksal alan tahsisi, replication başka bir yerde kopya tutma fikridir; RAID’in fiziksel disk yedekliliğiyle aynı iş değildir.",
    ],
    limits:
      "İstek düğmesi yalnızca istemci içi animasyon oluşturur; HTTP veya bulut servisi çağrısı yoktur. Gecikme, fiyat veya güvenilirlik karşılaştırması yapılmaz. Kaynak çerçevesi: OSC 10 §11.7; SNIA ağ depolama eğitim materyalleri.",
    question: {
      prompt: "Ağ üzerinden erişim, mutlaka dosya paylaşımı anlamına mı gelir?",
      answer:
        "Hayır. SAN örneği ağ üzerinden blok erişimini; nesne örneği ise kimlik temelli API erişimini gösterir.",
    },
    transition:
      "Bağlantının ötesinde, bir hacmin arkasındaki diskleri nasıl bir araya getirdiğimize bakalım.",
  },
  s29: {
    represents:
      "Host, denetleyici ve disk sütunları bir depolama dizisinin katmanlarını gösterir. Her sütun eşit kapasiteli bir fiziksel diski; A etiketli hücreler veri parçalarını; P ve Q etiketleri koruma bilgisini temsil eder. Başlangıç örneği RAID 5, dört disk, disk başına 4 TB ve toplam 16 TB fiziksel alandır. Bunun 12 TB’si mantıksal veri kapasitesidir.",
    learningGoal:
      "Birden fazla diskin kapasite, veri dağıtımı ve yedeklilik için farklı biçimlerde birleştirilebildiğini, bu amaçların otomatik olarak birlikte gerçekleşmediğini görmek.",
    walkthrough: [
      "Kapasite odağında 12 TB / 16 TB örneğini okuyun: dört diskin bir disk kapasitesi kadar toplam alanı parite için ayrılır. Bu, belirli bir fiziksel diskin yalnızca parite tutacağı anlamına gelmez; RAID 5’te sarı P hücreleri satırlar boyunca farklı disklere dağılır.",
      "Dağıtım seçimini açın. A okları, farklı veri parçalarının birden çok aygıta dağılabildiğini gösterir. Bunlar bir gerçek performans deneyi değildir. İş yükü ve denetleyici tasarımına bağlı olası paralelliği anlatır; ekrandaki disk sayısından kesin hız çarpanı üretmeyin.",
      "Koruma’yı seçin ve bir disk sütununa basarak tam disk arızası ekleyin. Erişim var / koruma azaldı durumunu gösterin. Mantıksal kapasitenin 12 TB kalmasıyla, korumanın azalmasının farklı değişkenler olduğunu özellikle belirtin.",
      "RAID 0’a geçerek kapasitenin artıp yedekliliğin kaybolduğunu gösterin. Sonra RAID 5’e dönün. Seviye, disk sayısı veya kapasite değişimi yeni bir örnek başlatır; eski arızalar ve rebuild ilerlemesi temizlenir. Uygun olmayan disk sayısı otomatik ayarlanır ve ekranda bildirilir.",
    ],
    keyPoints: [
      "Şerit, aynı mantıksal veri dizisinin birden çok diske dağıtılan parçalarını bir araya getirir; ekrandaki üç satır bütün disk kapasitesini çizmez.",
      "RAID donanım denetleyicisinde veya işletim sistemi yazılımında uygulanabilir. Çizimdeki denetleyici, soyut yönetim katmanını da temsil eder.",
      "Bir storage array’de denetleyici ve host bağlantıları da arıza alanına dahildir; yalnızca disk yedekliliği bunları korumaz.",
      "Snapshot, thin provisioning ve replication gibi dizi özellikleri RAID seviyesinden ayrı değerlendirilir.",
    ],
    limits:
      "Bu eğitim modeli yalnızca eşit boyutlu diskleri ve tam disk arızalarını kapsar. TB ondalıktır; metaveri, ayrılmış alan ve dosya sistemi giderleri düşülmez. Gerçek aygıta erişmez, kapasite tahsis etmez, performans ölçmez. Disk arızası seçimleri bir senaryo düzenleyicisidir; arızayı geri almak gerçek bir diski onardığımız anlamına gelmez. Kaynak: OSC 10 §11.8; Linux Kernel RAID ve dm-raid belgeleri.",
    transition:
      "İki temel yapı taşıyla başlayalım: veriyi bölmek ve veriyi kopyalamak.",
  },
  s30: {
    represents:
      "RAID 0 seçildiğinde her A bloğu farklı bir disk/şerit konumundadır; iki diskli RAID 1 seçildiğinde aynı A etiketli ve aynı bit desenli bloklar iki diskte de bulunur. Disk sütununa basmak o diskteki bütün hücreleri kayıp olarak işaretler. Kopya hücrelerin eşit etiketleri, bunların farklı dosyalar değil aynı mantıksal verinin kopyaları olduğunu anlatır.",
    learningGoal:
      "Striping’in yedeklilik sağlamadığını, mirroring’in ikinci fiziksel kopya karşılığında kullanılabilir kapasiteden vazgeçtiğini davranışla göstermek.",
    walkthrough: [
      "RAID 0 · şerit düğmesine basın. N eşit diskin kullanılabilir kapasitesi N×S olur. Bir diski arızalı seçin: veri kümesinin bir kısmı eksilir ve model bütün veri kümesi için kurtarılamaz durumuna geçer. Diskleri çoğaltmak bu seviyeye yedeklilik eklemez.",
      "RAID 1 · ayna düğmesine basın. Model yalnızca iki diskli ayna kullanır; önceki disk sayısı farklıysa ikiye ayarlanır ve bildirim gösterilir. Her satırdaki iki A etiketinin ve bitlerinin aynı olduğunu gösterin. Kullanılabilir kapasite tek disk kapasitesi S’dir.",
      "Bir ayna diskini kaybedin. Sağlam kopya bulunduğu için erişim sürer; durum koruma azaldı olur. İkinciyi de kaybederek sağlam kopya kalmadığında erişimin kaybolduğunu gösterin. Arızaları sıfırlamak ayarları korur.",
      "RAID 1 okuma işlemlerinin bazı uygulamalarda farklı kopyalar arasında dağıtılabileceğini sözlü olarak söyleyin. Buradan her iş yükünde iki kat hız, yazmaların bedava olması veya salt disk sayısına bağlı sabit performans sonucu çıkarılamaz.",
    ],
    keyPoints: [
      "RAID 0: N×S kullanılabilir alan, bu modelde herhangi bir disk kaybında eksik veri kümesi.",
      "RAID 1: bu projede tam iki disk, S kullanılabilir alan ve en az bir sağlam kopya bulunduğu sürece erişim.",
      "Kapasite düzeni ile arıza anındaki erişilebilirlik ayrıdır; arıza sırasında kapasite etiketini yeniden boyutlandırmıyoruz.",
      "Sahneler aynı RAID modelini paylaşır. Bu sahneye başka bir seviyeden gelindiğinde yukarıdaki RAID etiketi mevcut durumu gösterir; örneği değiştirmek için 0 veya 1 seçin.",
    ],
    limits:
      "Yazma sıralaması, önbellek, gerçek disk gecikmesi ve eşzamanlı okuma dağıtımı hesaplanmaz. İki diskli RAID 1 örneği, çok kopyalı bütün aynalama düzenlerinin simülatörü değildir. Gerçek veri bu tarayıcı modelinde tutulmaz. Kaynak: OSC 10 §11.8 ve Linux Kernel dm-raid seviye tanımları.",
    question: {
      prompt: "Veriyi disklere bölmek neden tek başına koruma sağlamaz?",
      answer:
        "Bir parça kaybolduğunda onu üretecek bağımsız bilgi yoksa kalan parçalar eksik verinin yerine geçmez. Mirroring ek kopya, parity ek koruma bilgisi sağlar.",
    },
    transition: "Tam kopya yerine hesaplanmış koruma bilgisi tutabilir miyiz?",
  },
  s31: {
    represents:
      "RAID 4’te P hücreleri son fiziksel disk sütununa ayrılır. RAID 5’te P satıra göre farklı disklere döner. RAID 6’da P ve Q ayrı sütunlarda dönerek iki bağımsız koruma bileşenini temsil eder. A1 kaybolsun eylemi dört diskli RAID 5 örneğinde ilk satırın ikinci veri diskini kaybedip gerçekten XOR hesabıyla geri üretilebilir bloğu gösterir.",
    learningGoal:
      "Ayrılmış pariteyi dağıtılmış pariteden ayırmak; tek kayıp bloğu XOR ile hesaplamak; RAID 6’nın ikinci koruma bilgisinin aynı XOR’un kopyası olmadığını anlamak.",
    walkthrough: [
      "RAID 4’ü açın. Son sütunda tüm satırlarda P görünür: bu ayrılmış parite diskidir. RAID 5’i açın ve sarı hücrelerin satırlara göre yer değiştirdiğini gösterin. Her satırın paritesi farklı diskte olabilir; toplam koruma kapasitesi yine bir disk kapasitesidir.",
      "A1 kaybolsun’a basın. Model açıkça RAID 5, dört disk ayarını seçer ve D1’i arızalı işaretler. İlk satırdaki veriler 1100, 1010, 0110; P ise bunların XOR’u olan 0000’dır. Eksik A1 = P XOR 1100 XOR 0110 = 1010 olarak, sağlam hücrelerden hesaplanır. Örnek veri bitleri gerçek dosya içerikleri değildir.",
      "Sıfırlayıp parite sütununu kaybedin. XOR alanı bu kez eksik P’yi sağlam veri bloklarından üretir. Veri kaybı ve parite kaybı farklı hücre rolleri olarak görünür. İki disk kaybı seçilirse tek koruma denklemi yeterli olmadığı için arayüz hesapla kurtarma iddiasında bulunmaz.",
      "RAID 6’ya geçin. P ve Q’nun ayrı renk ve etiketlerini gösterin. Bu model iki tam disk arızasını kural olarak tolere eder; Q’nun sonlu alan cebirini çalıştırmaz. XOR düğmesi açıldığında Q hesabının kapsam dışında olduğu açıkça belirtilir. Q, P’nin ikinci kopyası değildir.",
    ],
    keyPoints: [
      "RAID 4 ve 5: N≥3, kullanılabilir kapasite (N−1)×S, en fazla bir tam disk kaybı.",
      "RAID 6: N≥4, kullanılabilir kapasite (N−2)×S, en fazla iki tam disk kaybı; bağımsız P ve Q koruması.",
      "XOR sonucu hücrelerin saklanan bitlerinden hesaplanır; sonuç bir animasyon etiketi olarak uydurulmaz.",
      "RAID 4’te ayrılmış parite diski yazma işlerinin yoğunlaşabileceği bir noktadır. RAID 5 pariteyi dağıtır; bu dağılım bütün yazma maliyetlerini ortadan kaldırmaz.",
    ],
    limits:
      "XOR örneği dört bitlik bloklar ve tek şerit içindir. RAID 6 Q kodlaması, sonlu alan işlemleri ve çift kayıp veri çözümü uygulanmaz; kapasite ve hata toleransı ayrı açık kurallarla gösterilir. Şemadaki dönen yerleşim öğretim amaçlıdır; bir denetleyicinin birebir on-disk formatı değildir. Write hole, URE ve denetleyici önbelleği ana hesapta yoktur. Kaynak: OSC 10 §11.8; Linux Kernel dm-raid; H. Peter Anvin, The Mathematics of RAID-6.",
    transition:
      "Kopyaların nerede bulunduğu, kaç disk kaybettiğimiz kadar önemlidir.",
  },
  s32: {
    represents:
      "Bu sahne disk arızası düzenini doğrudan düzenlemeye izin veren ortak RAID modelidir. RAID 10 seçildiğinde mavi çerçeve başlıkları (D0,D1), (D2,D3) gibi ayna çiftlerini gösterir. Her A bloğu yalnızca kendi çiftinde kopyalıdır; çiftler arasında farklı veri parçaları şeritlenir. Bu nedenle arıza sayısının yanında arızaların hangi çiftte bulunduğu da durumu belirler.",
    learningGoal:
      "RAID 10 kurtarılabilirliğini toplam kayıp disk sayısıyla değil, her ayna çiftinde sağlam kopya kalıp kalmadığıyla değerlendirmek.",
    walkthrough: [
      "D0 + D2 ön ayarına basın. Dört diskli RAID 10 modeli seçilir; her iki ayna çiftinden birer disk kaybedilir. D1, ilk çiftin verisini; D3, ikinci çiftin verisini korur. Durum Erişim var / koruma azaldı olur. Kullanılabilir kapasite hâlâ 8 TB’dir.",
      "D0 + D1 ön ayarına basın. Aynı iki arıza sayısına rağmen ilk çiftin iki kopyası da yoktur. İkinci çiftin sağlam olması ilk çifte ait farklı veri parçalarını üretmez. Durum Modelde kurtarılamaz olarak değişir.",
      "Bir disk sütununa tıklayıp arızayı ekleyin veya senaryo düzenlemesi olarak geri alın. Altı veya sekiz disk seçip her çiftte sağlam en az bir disk kalma koşulunu izleyin. Her çiftin iki diski birlikte kaybedildiğinde dizi eksik kalır.",
      "İsterseniz aynı arıza desenlerini RAID 5 ve RAID 6’da karşılaştırın. RAID 5 tek, RAID 6 en fazla iki tam disk kaybını tolere eder. RAID 10 için ortak “en fazla iki” sayacı kullanılmaz; çiftlerin yerleşimi incelenir.",
    ],
    keyPoints: [
      "RAID 10: önce aynalama, ardından ayna çiftleri arasında striping; bu modelde N≥4 ve çift.",
      "Kapasite (N/2)×S’dir. İki diskin kaybı bazı düzenlerde tolere edilir, bazı düzenlerde edilmez.",
      "“Kurtarılamaz”, bu modelin kalan disklerden bütün veri kümesini yeniden oluşturamadığı anlamındadır; tüm hücrelerdeki her bitin yok olduğunu iddia etmez.",
      "Seviye değişikliği arızaları ve rebuild durumunu temizler; disk sayısı gerekirse geçerli en yakın sayıya ayarlanır.",
    ],
    limits:
      "Yalnızca belirtilen sabit ayna çiftleri ve tam disk kaybı modellenir. Linux MD gibi sistemlerde farklı RAID 10 kopya yerleşimleri bulunabilir; burada bütün varyantların sonucu temsil edilmez. Seçimi geri almak fiziksel disk onarımı değildir. Kaynak: OSC 10 §11.8; Linux Kernel RAID ve dm-raid belgeleri.",
    question: {
      prompt: "Dört diskli RAID 10 her iki disk arızasını da tolere eder mi?",
      answer:
        "Hayır. D0+D2 gibi farklı çiftlerden birer kayıp tolere edilir; D0+D1 gibi aynı çiftin iki kaybı o çiftin bütün kopyalarını yok eder.",
    },
    transition:
      "Erişim sürebiliyor olsa bile korumanın geri gelmesi için yeniden kurma işi yapılmalıdır.",
  },
  s33: {
    represents:
      "Arızalı ama kurtarılabilir bir dizide boş yedek disklerin takılıp kalan kopya veya koruma bilgisinden doldurulması temsil edilir. Boş yedek hücreleri ∅ ile görünür; her Şerit adımı bir temsili satırı doldurur. İlerleme üç şeritlik eğitim adımıdır, gerçek geçen süre değildir. Kapasiteler düğmesi aynı disk boyutuyla seviye başına nominal alan karşılaştırmasını açar.",
    learningGoal:
      "Kapasite, erişilebilirlik ve koruma düzeyini ayrı okumak; yeniden kurmanın kalan aygıtlardan okuma ve yedek aygıta yazma işi gerektirdiğini açıklamak.",
    walkthrough: [
      "Hiç arıza yoksa bir disk sütununa basın. RAID 5 için tek kayıp örneğini tercih edin. Kapasite 12 TB’den 8 TB’ye düşmez: mantıksal yerleşim aynı kalır; tek kayıp sonrası koruma azalmıştır. Kurtarılamayan durumda da nominal kapasite etiketi ile erişim durumu ayrı gösterilir.",
      "Yedek tak · yeniden kur düğmesine basın. Arızalı disk konumuna boş yedek geldiği bildirilir; hücreler ∅ olur. Henüz yeniden kurulmamış satırların dolu kopyaları varmış gibi gösterilmediğine dikkat çekin.",
      "Şerit 1/3, 2/3 ve 3/3 eylemlerini ilerletin. Ayna düzeyinde kalan kopya, tek pariteli seviyede kalan veri ve parite, RAID 6 kuralında iki bağımsız koruma bilgisinin varlığı yeniden üretilebilirliği belirler. Üçüncü adımda değiştirilmiş diskler sağlam olur ve koruma geri gelir. Bu adımlar disk kapasitesinin tamamını gerçek bitlerle yeniden yazmaz; şematik yerleşim durumunu doldurur.",
      "Sıfırlayın, RAID 5’te iki disk kaybedin ve rebuild düğmesinin kullanılamadığını gösterin. Yeterli bilgi kalmamışsa yedek takmak kayıp veriyi kendiliğinden geri getirmez. Rebuild sırasında yeni arıza seçimi bu modelde kapalıdır; gerçek sistemlerde ek arızanın riski devam eder.",
      "Kapasiteler’i açın. N ve S’ye göre RAID 0 N×S; RAID 4/5 (N−1)×S; RAID 6 (N−2)×S; RAID 10 (N/2)×S alan sunar. RAID 1 satırı bu projenin yalnızca iki diskli modelini kullanır; satırdaki Disk×TB sütununu okuyarak farklı fiziksel disk sayısını gizlemeyin.",
    ],
    keyPoints: [
      "Rebuild, kullanılabilir kalan bilgiyle mümkündür; yalnızca animasyon oynatmak kurtarılamayan durumu düzeltmez.",
      "Hot spare hazır bekleyen yedek aygıttır; bu örnekte yedek eylem anında takılır. Sağlıklı dizideki kullanılabilir kapasiteye eklenmez.",
      "MTTF bir arıza süresi istatistiği, MTTR onarım süresi ölçüsü, veri kaybına kadar süre ise farklı bir sonuç ölçüsüdür. Bunlar birbirinin yerine kullanılmaz.",
      "Uzun onarım, azaltılmış koruma penceresini uzatır. Gerçek rebuild süresi yük, aygıtlar ve sistem politikalarına bağlıdır; bu ekrandan dakika/saat tahmini üretilmez.",
      "Denetleyici veya güç kaybı, tutarsız parite/write hole, latent sektör hataları ve okunamayan sektörler gerçek sistemlerde ayrıca önemlidir. RAID bunların hepsini tek başına çözmez.",
    ],
    limits:
      "Kapasiteler ondalık TB ve eşit disk varsayımıyla nominaldir; metaveri/dosya sistemi gideri yoktur. Rebuild her adımda bir şematik satır ilerler, gerçek veri akışı ve RAID 6 Q cebiri hesaplanmaz. Yeni disk arızası rebuild boyunca engellenir; yük, URE, güç kesintisi ve onarım süresi simüle edilmez. Kaynak: OSC 10 §11.8; Linux Kernel RAID arrays ve Partial Parity Log belgeleri.",
    transition:
      "Disk kaybını tolere etmek, her türlü veri kaybını önlemekle aynı şey değildir.",
  },
  s34: {
    represents:
      "Bu kısa köprü üç ayrı fikri açar: 1+0/0+1 sekmesi birleştirme sırasını; Bütünlük sekmesi checksum ile veri doğrulama ve havuz üstünde dosya sistemi ilişkisini; Nesne sekmesi kimlik/metaveri/veri ayrımını gösterir. Başlıktaki eşitsizlik, disk yedekliliğinin bağımsız ve geri dönülebilir bir yedekleme kopyasının yerini tutmadığını hatırlatır.",
    learningGoal:
      "RAID seçiminin kapasite, hata yapısı ve yönetim ödünleşimi olduğunu; veri bütünlüğü ve yedekleme gereksinimlerinin ayrı değerlendirilmesi gerektiğini açıklamak.",
    walkthrough: [
      "1+0 / 0+1 sekmesinde solda her iki disk önce ayna çifti olur, sonra çiftler arasında şeritlenir. Sağda önce iki ayrı striped küme oluşturulur, ardından bu kümeler aynalanır. Çerçevelerin dış görünümü benzer olsa da korunan birim farklıdır: solda çift, sağda striped alt dizi.",
      "0+1’de bir disk kaybı bir striped alt diziyi eksik bırakır; diğer alt dizi sağlam kopya olarak kalır. Kalan alt dizideki başka bir disk kaybı bütünlüğü bozar. 1+0’da ise farklı ayna çiftlerinden birer kayıp tolere edilebilir. Q08 düğmesine basıp RAID 10’un her iki kaybı tolere etmediğini açıklayın. RAID 2/3, tarihsel farklı bit/byte dağıtımı ve koruma yaklaşımları olarak anılabilir; bu sunumun çalışan seviyeleri 0/1/4/5/6/10’dur.",
      "Bütünlük sekmesine geçin. Checksum, okunan içeriğin beklenen içerikle uyuşmasını kontrol eder; hangi diskin tamamen arızalı olduğu bilgisiyle aynı şey değildir. ZFS gibi havuz temelli bir tasarım, aygıt alanını bir havuzda yönetip veri kümeleri/dosya sistemi katmanına sunabilir. Checksum ile hatayı tespit etmek ve uygun yedek bilgiyle onarmak ayrı adımlardır; yedek bilgi yoksa tespit tek başına veriyi geri oluşturmaz.",
      "Nesne sekmesini açın. id:42 bir nesne kimliğidir; nesnenin verisi ve metaverisi depolama hizmeti tarafından yönetilir. Kopyalama veya erasure coding gibi korumalar hizmetin kendi tasarımına aittir. Altı simge, altı garantili kopya veya zorunlu yerleşim sayısı olarak okunmamalıdır.",
      "Yanlışlıkla silme, uygulamanın bozuk içerik yazması, fidye yazılımı veya bütün dizinin kaybı örneklerini söyleyin. Disk yedekliliği bu olayları tek başına geri almaz. Bağımsız, sürüm veya geri dönüş noktası bulunan ve geri yüklenmesi denenmiş yedekleme stratejisi ayrıca gerekir.",
    ],
    keyPoints: [
      "RAID 1+0 ve 0+1 aynı kapasiteye sahip olabilse de arıza desenleri aynı değildir.",
      "RAID, bütün bozulmaları yakalayan evrensel bir uçtan uca bütünlük mekanizması değildir. Checksum hatayı saptayabilir; onarım ek doğru bilgi gerektirir.",
      "Havuz, fiziksel alanın yönetim katmanıdır; volume ve dosya sistemiyle birebir aynı nesne olarak anlatılmaz.",
      "Nesne depolamada uygulama nesne kimliğiyle çalışır. İç kopyalama, fiziksel disk yerleşimi ve RAID uygulaması hizmete göre değişir.",
      "Yedeklilik mevcut hizmeti sürdürebilir; yedekleme farklı bir zamana veya bağımsız kopyaya geri dönmeyi amaçlar.",
    ],
    limits:
      "1+0/0+1, checksum/havuz ve nesne görselleri kavramsal açıklamadır; çalışan checksum onarımı, ZFS, nesne servisi veya 0+1 arıza simülatörü yoktur. Şemadan performans, dayanıklılık veya gerçek ürün güvencesi çıkarılmaz. Kaynak çerçevesi: OSC 10 §11.8; Linux Kernel RAID belgeleri. Ayrıntılı ek kaynaklar modülün sources.ts dosyasındadır.",
    question: {
      prompt: "Dört diskli RAID 10 her iki disk arızasını da tolere eder mi?",
      answer:
        "Hayır. Aynı ayna çiftindeki iki kayıp o çiftteki veriyi yok eder; farklı çiftlerden birer disk kaybında en az birer kopya kalabilir.",
    },
    transition:
      "Şimdi tek bir isteği bütün bu katmanlardan geçirerek bölümün ortak hikâyesini tamamlayabiliriz.",
  },
};
