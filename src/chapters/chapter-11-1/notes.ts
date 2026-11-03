import type { SceneNotes } from "../../presentation/types";

export const introNotes: Record<string, SceneNotes> = {
  s01: {
    represents:
      "Açılıştaki gerçek HDD fotoğrafı, yazılımın okuma isteği ile fiziksel depolama arasındaki ilişkiyi somutlaştırır. Enter ile istek, işletim sistemi ve aygıt olmak üzere üç anlatım odağı açılır. Görsel bir çalışma videosu veya aygıt hızını gösteren simülasyon değildir.",
    learningGoal:
      "Bir okuma isteğinin fiziksel bir aygıt üzerinden karşılandığını ve zaman maliyeti olduğunu fark etmek.",
    walkthrough: [
      "Fotoğraf üzerinden bir dosyayı okurken neyi beklediğimizi sorun.",
      "Enter ile OS ve fiziksel aygıt odağını sırayla gösterin; sağ okla sunucu haritasına geçin.",
    ],
    keyPoints: [
      "İşletim sistemi mantıksal isteği aygıta iletir.",
      "11.1 fiziksel ortam ve performans özelliklerine giriş yapar.",
    ],
    limits:
      "Gerçek fotoğraf temel parçaları tanıtmak içindir; ürün performansı veya tüm depolama ortamlarının mekanik olduğu iddia edilmez.",
    transition: "Sunumun dört bakış açısını görelim.",
  },
  s02: {
    represents:
      "Dört düğüm Chapter 11 içindeki dört sunucunun konu kapsamını gösterir. Enter sırayla ilgili düğümü vurgular, herhangi bir bölüme kendiliğinden geçmez. Düğüme tıklamak veya sahne oklarını kullanmak ilgili anlatıma geçmeyi sağlar.",
    learningGoal:
      "11.1 ile sonraki zamanlama, yönetim ve bağlantı bölümleri arasındaki kapsam ayrımını bilmek.",
    walkthrough: [
      "Enter ile dört konu grubunu sırayla vurgulayın.",
      "Sağ ok veya 11.1’e başla düğmesiyle ilk kişinin anlatımına geçin.",
    ],
    keyPoints: [
      "Birinci kişi 11.1; ikinci kişi 11.2–11.3 kapsamındadır.",
      "Üçüncü kişi 11.4–11.6; dördüncü kişi 11.7–11.8 kapsamındadır.",
    ],
    limits:
      "Bu harita konu organizasyonudur; her I/O isteğinin izlediği zorunlu bir işlem sırası değildir.",
    transition: "Önce HDD’nin temel parçalarını inceleyelim.",
  },
  s04: {
    represents:
      "Volatil ve Non-Volatil başlıklı iki grup karşılaştırılır. Volatil tarafta gerçek RAM modülü; Non-Volatil tarafta gerçek HDD ve SSD fotoğrafları vardır. Güç kesildiğinde yalnızca Volatil taraftaki bitler kaybolur. Güç geri geldiğinde eski RAM içeriği geri gelmez; HDD ve SSD’deki kayıt korunur.",
    learningGoal:
      "Mekanik/elektronik yapıyı ve kalıcı/uçucu olmayı birbirinden ayrı özellikler olarak değerlendirmek.",
    walkthrough: [
      "İlk aşamada Volatil (RAM) ve Non-Volatil (HDD, SSD) gruplarını ve örnek bitleri işaretleyin.",
      "Enter ile gücü kesin; Non-Volatil gruptaki kaydın korunduğunu, RAM içeriğinin kaybolduğunu gösterin.",
      "Enter ile gücü geri getirin; eski RAM verisinin dönmediğini vurgulayın.",
      "Son aşamada SSD etiketini vurgulayın; elektronik yapının tek başına uçuculuk anlamına gelmediğini açıklayın.",
    ],
    keyPoints: [
      "RAM uçucudur; RAM disk kullanımı bu özelliği değiştirmez.",
      "Flash tabanlı SSD, NVM aygıtlarının somut bir örneğidir.",
      "Kaynak: resmî Chapter 11 slaytları 4, 9 ve 12.",
    ],
    limits:
      "Bit kutuları kavramsal durum gösterimidir; fiziksel hücre sayısını, güç elektroniğini veya gerçek performansı simüle etmez.",
    question: {
      prompt: "Elektronik olan her depolama ortamı uçucu mudur?",
      answer:
        "Hayır. RAM uçucudur; flash tabanlı SSD veriyi güç kesildiğinde de korur.",
    },
    transition: "HDD’deki mekanik hareketin okuma maliyetine bakalım.",
  },
  s03: {
    represents:
      "Evan-Amos’un yüksek çözünürlüklü gerçek HDD fotoğrafı üzerinde plaka, mil, kol ve okuma/yazma kafası sırayla numaralı işaretlerle tanıtılır. Kafa fotoğrafta park konumundadır. Son aşamada iz, sektör ve silindir tanımlanır; bu kayıt düzeni fotoğrafta boyalı çizgilerle varmış gibi gösterilmez.",
    learningGoal:
      "Kitaptaki temel HDD parçalarını ve iz/sektör/silindir kavramlarını tanımak.",
    walkthrough: [
      "Gerçek HDD fotoğrafını tanıtın; Enter ile plaka, mil, kol ve kafayı sırayla işaretleyin.",
      "Plakanın veri tuttuğunu, kolun kafayı hedef yarıçapa götürdüğünü açıklayın.",
      "Son aşamada izin dairesel yol, sektörün izin parçası, silindirin aynı yarıçaptaki yüzey izleri olduğunu anlatın.",
    ],
    keyPoints: [
      "Plakalar mil çevresinde döner; kafa okuma ve yazmayı gerçekleştirir.",
      "Kafa hareketi ile hedef sektörün dönmesi ayrı beklemeler doğurur.",
      "Kaynak: resmî slaytlar 4–5, Moving-head Disk Mechanism.",
    ],
    limits:
      "Fotoğraf statiktir; gerçek çalışma animasyonu üretilmedi. Bobin, mıknatıs, motor sürücüsü ve devre ayrıntıları kapsam dışında bırakıldı. İz/sektör ve çok yüzeyli silindir bu fotoğrafta gözle seçilemez.",
    transition: "Bu aygıtın kalıcılığını RAM ile karşılaştıralım.",
  },
  s05: {
    represents:
      "Üç halka, seek, ortalama dönme gecikmesi ve aktarımı gösterir. Enter her bileşeni sırayla vurgular, son aşamada toplam servis süresini birleştirir. Konumlandırma gecikmesi seek + dönmedir; üstteki toplam aktarımı da içerir ve ek yüklerin dışarıda bırakıldığı örnek I/O servis süresidir.",
    learningGoal:
      "Konumlandırma gecikmesini aktarım dahil örnek servis süresinden ayırmak ve birimlerle hesaplamak.",
    walkthrough: [
      "Başlangıçtaki 7200 RPM, 6 ms seek, 4 KiB ve 200 MB/s parametrelerini okuyun.",
      "Enter ile seek, dönme ve aktarımı sırayla anlatın. Ortalama dönme gecikmesi 30000/RPM ms’dir.",
      "Toplam aşamasında yaklaşık 10,19 ms ile bunun içindeki yaklaşık 10,17 ms konumlandırmayı ayırın.",
      "Veri boyutunu artırın: aktarım büyür; seek ve dönme aynı kalır. Sıfırlama düğmesi kayıtlı parametreleri geri getirir.",
    ],
    keyPoints: [
      "Konumlandırma = seek + ortalama dönme gecikmesi.",
      "Örnek servis = konumlandırma + aktarım; denetleyici ve kuyruk bu hesapta yoktur.",
      "1 KiB = 1024 byte; 1 MB = 1.000.000 byte.",
      "Kaynak: resmî slaytlar 6–7. Sayısal parametreler eğitim örneğidir.",
    ],
    limits:
      "Kitaptaki tam ortalama I/O ifadesi denetleyici ek yükünü de içerir. Burada bu ek yük ve kuyruk dışarıda bırakılarak sadeleştirme görünür biçimde belirtilir; sonuç uçtan uca uygulama gecikmesi değildir.",
    transition:
      "HDD’deki bu mekanik beklemelerin SSD’de neden bulunmadığına bakalım.",
  },
  s06: {
    represents:
      "Aynı SSD’nin önce dış kasası, ardından gerçek iç kartı gösterilir. Flash bellek yongaları ve denetleyici fotoğraf üzerindeki numaralı işaretlerle ayrılır. Son aşama dönen plaka ve hareket eden kafa bulunmamasını, dolayısıyla seek ve dönme gecikmesinin olmamasını vurgular.",
    learningGoal:
      "Flash tabanlı SSD’nin temel görev ayrımını ve HDD’den mekanik farkını açıklamak.",
    walkthrough: [
      "Enter ile SSD dış görünüşünden iç kart fotoğrafına geçin.",
      "Bir sonraki aşamada veriyi kalıcı tutan NAND flash yongalarını gösterin.",
      "Denetleyiciyi yalnızca istekleri flash işlemlerine dönüştürme göreviyle tanıtın.",
      "Son aşamada HDD’nin seek ve dönme beklemesini hatırlatın.",
    ],
    keyPoints: [
      "SSD, NVM aygıtlarının bir biçimidir; NVM daha geniş bir kategoridir.",
      "Hareketli parça bulunmaz; seek ve dönme beklemesi yoktur.",
      "Flash bellekte sayfa okuma/yazma ve blok silme farklıdır.",
      "Kaynak: resmî slaytlar 9–11; fotoğraflar MatteX, Wikimedia Commons, CC0.",
    ],
    limits:
      "Fotoğraf gerçek bir ürün örneğidir; bütün SSD’lerin aynı kart düzenine sahip olduğu veya bu modelin güncel performansı temsil ettiği iddia edilmez. Önbellek, yonga paketleme ve devre ayrıntıları anlatılmaz.",
    transition: "Şimdi flash’ın sayfa ve blok kurallarını inceleyelim.",
  },
  s07: {
    represents:
      "İki küçük kutu grubu iki silme bloğunu; her küçük kutu bir flash sayfasını temsil eder. Başlangıçta A bloğunda L0’ın güncel sürümü ve geçersiz sayfalar vardır. Güncelleme B bloğundaki boş P6’ya yazılır; eski P0 geçersiz olur. A’da canlı veri kalmayınca bütün blok silinir; B’deki canlı veriler korunur.",
    learningGoal:
      "Sayfa okuma/yazma ile daha büyük blokta silmeyi ve yerinde üzerine yazamama kuralını ayırmak.",
    walkthrough: [
      "İlk aşamada P0’ın okunduğunu, okumanın içeriği değiştirmediğini gösterin.",
      "Enter ile L0’ın yeni sürümünü boş P6’ya yazın.",
      "Eski sayfa aşamasında P0’ın geçersiz ancak fiziksel olarak henüz silinmemiş olduğunu anlatın.",
      "Son aşamada yalnızca canlı verisi kalmayan A bloğunu tamamen silin; tek sayfa silme göstermeyin.",
    ],
    keyPoints: [
      "Flash okuma/yazma sayfa, silme daha büyük blok birimindedir.",
      "Güncelleme aynı sayfanın üstüne yazılmaz.",
      "Geçersiz sayfa ile silinmiş, yeniden yazılabilir sayfa aynı değildir.",
      "Kaynak: resmî slaytlar 10–11. Silme ömrü sınırlıdır; ayrıntılı FTL/GC ikinci kişidedir.",
    ],
    limits:
      "İki blok ve dört sayfa eğitim boyutlarıdır. Canlı veri içeren blok silinmez. Bu sahnede GC taşıma algoritması, write amplification ve wear leveling simüle edilmez.",
    transition:
      "RAM disk ve teybi tamamlayıp OS’nin ortak blok görünümüne bakalım.",
  },
  s08: {
    represents:
      "İlk aşama RAM üzerinde blok aygıtı ve dosya sistemi kullanımını, ikinci aşama manyetik teypteki sıralı kayıt düzenini gösterir. Ardından tek boyutlu mantıksal blok dizisi ve disk sektörlerine eşleme açılır. Son aşamada komutun host/aygıt denetleyicileri üzerinden iletilmesi ve verinin DMA ile DRAM’e aktarılması ayrı gösterilir.",
    learningGoal:
      "RAM diskin uçuculuğunu, teybin sıralı niteliğini ve işletim sisteminin ortak mantıksal blok soyutlamasını açıklamak.",
    walkthrough: [
      "RAM diskte dosya sistemi kurulabilse de içeriğin uçucu kaldığını hatırlatın.",
      "Teypte konum bulma ve sıralı aktarımı ayırın. Rastgele erişimin imkânsız olduğunu söylemeyin.",
      "Enter ile numaralı mantıksal blokları ve seçili LBA 3’ü gösterin.",
      "Sektör eşlemesini kitabın temel sıralı modeliyle açıklayın; bozuk sektör istisnasını isim düzeyinde belirtin.",
      "Son aşamada komut zincirini ve DMA veri yolunu ayırın.",
    ],
    keyPoints: [
      "RAM disk çok hızlı geçici depolama olarak kullanılabilir.",
      "Teyp arşiv/yedekleme için kullanılan bir manyetik ortamdır.",
      "Disk OS’ye tek boyutlu mantıksal blok dizisi olarak görünür.",
      "NVM ortam kategorisidir; NVMe erişim arayüzüdür.",
      "Kaynak: resmî slaytlar 12–16.",
    ],
    limits:
      "Kutu sayıları, gösterge hızı ve veri yolu mesafeleri temsilidir. Eşleme temel modeldir; gerçek geometri, DMA protokolü ve bağlantı türlerinin ayrıntıları anlatılmaz.",
    transition:
      "Hız ile mekanik bekleme arasındaki farkı son bir soruyla kontrol edelim.",
  },
  s09: {
    represents:
      "Soru, HDD aktarım hızının yükselmesinin seek ve dönme gecikmesini ortadan kaldırıp kaldırmadığını sorgular. Enter veya cevap düğmesi gerekçeyi açar; sonraki aşama donanım özelliklerinin zamanlama kararlarına etkisini ikinci sunucuya bağlar. Enter bu sahneden ayrılmaz.",
    learningGoal:
      "Aktarım süresi ile mekanik beklemeyi ayırarak HDD zamanlamasına gerekçeli bir geçiş yapmak.",
    walkthrough: [
      "Cevabı açmadan dinleyiciden aktarım artışının hangi bileşeni değiştirdiğini sorun.",
      "Enter ile seek ve dönmenin sürdüğünü gösterin.",
      "Son aşamada aynı isteklerin farklı sırayla servis edilmesinin kafa hareketini etkileyebileceğini söyleyin; sağ okla ikinci kişiye geçin.",
    ],
    keyPoints: [
      "Aktarımın hızlanması seek ve dönmeyi sıfırlamaz.",
      "HDD’de fiziksel konum servis sırasının önemini artırır.",
      "Kaynak: resmî slaytlar 7 ve 17; SSD’nin mekanik farkı slayt 9.",
    ],
    limits:
      "Soru aygıttan karşılanan HDD okuması içindir. Önbellekten karşılanan istekler her seferinde fiziksel hareket gerektirmez; bütün iş yükleri için bir hız iddiası yoktur.",
    question: {
      prompt: "Aktarım hızını artırmak HDD’de tüm beklemeyi kaldırır mı?",
      answer: "Hayır. Seek ve dönme gecikmesi sürer.",
    },
    transition: "İkinci kişi: Aynı bekleyen istekleri hangi sırayla işleyelim?",
  },
};
