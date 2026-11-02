import type { SceneNotes } from "../../presentation/types";
import { hddParts } from "./parts";

export const introNotes: Record<string, SceneNotes> = {
  s01: {
    represents:
      "Bu açılış, uygulamanın soyut veri isteği ile onu gerçekleştiren fiziksel depolama arasındaki ilişkiyi temsil eder. Hareketli HDD, bölümün somut başlangıç noktasıdır; bütün depolama aygıtlarının mekanik olduğunu göstermez. Sunum, verinin nerede tutulduğundan başlayıp zamanlama, doğruluk, alan yönetimi, bağlantılar ve RAID üzerinden ilerler.",
    learningGoal:
      "Dinleyicinin, bir dosya okumasının yalnızca aktarım hızından ibaret olmadığını fark ederek bölümün temel sorusunu kurması.",
    walkthrough: [
      "Önce “Bir dosyayı açtığımızda neyi bekliyoruz?” sorusunu yöneltin; birkaç tahmin alın.",
      "Ekrandaki aygıtı bir performans ölçümü olarak değil fiziksel ortam örneği olarak tanıtın.",
      "Başla düğmesiyle dört sunucunun haritasına geçin; menüden herhangi bir sahneye doğrudan gidilebildiğini prova sırasında gösterin.",
    ],
    keyPoints: [
      "İşletim sistemi mantıksal talepleri aygıt erişimine dönüştürür.",
      "Kapasite, gecikme, aktarım ve veri koruması farklı tasarım ölçütleridir.",
      "11.1 donanım; 11.2–11.3 zamanlama; 11.4–11.6 doğruluk ve alan; 11.7–11.8 bağlantılar ve RAID olarak bölünmüştür.",
    ],
    limits:
      "Açılış şemasının dönüş hızı gerçek RPM değildir. Görsel, bir ürünün fiziksel ölçüleri veya güncel pazar payıyla ilgili iddia taşımaz.",
    transition: "Önce bu yolculuğu kimlerin hangi açıdan anlatacağını görelim.",
  },
  s02: {
    represents:
      "Dört düğüm, tek bir depolama konusuna dört farklı sorumluluk açısından bakıldığını gösterir. Bunlar dört farklı kitap bölümü değil, Chapter 11 içindeki önceden kararlaştırılmış sunucu bloklarıdır. Düzenin soldan sağa sırası anlatı sırasıdır; bir OS isteğinin bütün bu konuları her seferinde aynı sırada çalıştırdığı bir algoritma değildir.",
    learningGoal:
      "Katılımcının sunucuların kapsamını ve alt bölümler arasındaki kavramsal bağı bilmesi.",
    walkthrough: [
      "Birinci kişinin 11.1 ile ortamların yapısını açıklayacağını söyleyin.",
      "İkinci kişinin 11.2 ve 11.3 ile istek sıralaması ve NVM maliyetlerini karşılaştıracağını belirtin.",
      "Üçüncü kişinin 11.4, 11.5 ve 11.6 ile hata tespiti, hazırlama ve swap alanını ele alacağını açıklayın.",
      "Dördüncü kişinin 11.7 ve 11.8 ile erişim yolları ve çok diskli yapıları birleştireceğini anlatın.",
    ],
    keyPoints: [
      "Sunucu dağılımı bölüm sayısına göre değil, konu gruplarına göre korunur.",
      "Aynı örnek istek farklı sahnelerde başka bir özelliği görünür kılabilir.",
      "Menüdeki bölüm grupları ara vermeden ilgili sunucunun başlangıcına geçmeyi sağlar.",
    ],
    limits:
      "Harita konu organizasyonudur; bilgisayarın zorunlu bir işlem hattı değildir.",
    transition:
      "Fiziksel ortamı tanımak için ilk soruyla başlayalım: Veri nerede yaşar?",
  },
  s03: {
    represents:
      "Bu ekran, HDD, flash tabanlı SSD/NVM, RAM disk ve teyp ortamlarını karşılaştırır. Seçilen ortamın hareket veya bellek hücresi davranışı odakta gösterilir. RAM örneğinde güç kesilince bitlerin kaybolması, üzerinde dosya sistemi olsa bile uçucu belleğin kalıcı hale gelmediğini temsil eder.",
    learningGoal:
      "Kalıcılık, mekanik hareket ve erişim biçiminin birbirinden bağımsız özellikler olduğunu ayırmak.",
    walkthrough: [
      "HDD’yi seçip dönen yüzey ve konumlanan kafayı işaretleyin.",
      "SSD/NVM’yi seçin; mekanik seek ve dönme beklemesi bulunmadığını, buna karşılık flash yazma/silme yönetimi olduğunu söyleyin.",
      "RAM diskini seçip güç düğmesine basın. Güç geri açıldığında eski veri otomatik geri gelmez; boş görünüm veri kaybını vurgular.",
      "Teybi seçip konum bulma ile uzun sıralı aktarımı farklı işler olarak açıklayın.",
    ],
    keyPoints: [
      "NVM geniş bir kalıcı bellek ailesidir; flash tabanlı SSD somut örnektir.",
      "RAM disk bir kullanım biçimidir, yeni bir kalıcı fiziksel ortam değildir.",
      "Teyp üzerinde keyfi konuma ulaşılabilir; maliyeti rastgele erişimli diskle aynı değildir.",
    ],
    limits:
      "Hücre sayıları, dönüş hızları ve çizim boyutları temsilidir. Bu sayfa gerçek benchmark veya fiyat karşılaştırması üretmez.",
    question: {
      prompt:
        "Bir RAM diskinde dosya sistemi kurulması elektrik kesintisinde veriyi korur mu?",
      answer:
        "Hayır. Dosya sistemi organizasyon sağlar; RAM’in uçuculuğunu değiştirmez.",
    },
    transition:
      "Mekanik erişimin maliyetini anlamak için HDD’nin iç parçalarına yaklaşalım.",
  },
  s04: {
    represents:
      "Bu sayfa HDD’nin mekanik ve elektronik parçalarını Three.js tabanlı seçilebilir bir 3D modelle gösterir. Modeldeki parçalar kavramsal olarak oluşturulmuştur; internetten alınmış üretici CAD dosyası değildir. Söküm sekmesi ise Diego Alifano’nun hazır stop-motion kaydıdır: gerçek bir SCSI HDD’nin katmanları ayrılarak yerleşimi görünür olur. Çalışma sekmesindeki Wolfgang Ellsässer kaydı açık bir eski HDD’nin dönmeye başlamasını gösterir.",
    learningGoal:
      "Veriyi tutan parçalar, konumlandıran mekanizma ve komutları yöneten elektronikler arasında görev ayrımı kurmak.",
    walkthrough: [
      "3D görünümü sürükleyerek farklı açılardan inceleyin; tekerlek veya iki parmakla yakınlaştırabilirsiniz. Listeden parça seçmek, parçaya tıklamanın klavye ile erişilebilir eşdeğeridir.",
      "Katmanlar düğmesini açın: PCB aşağı, plaka ve kafa grupları yukarı, kapak en üste ayrılır. Bu bir sökme talimatı değil yapısal açıklamadır.",
      "Plakalar ile milin birlikte, kafaların ise ayrı bir aktüatörle hareket ettiğini gösterin. İz/sektör görünümünde yarıçap ve açısal konum farkını açıklayın.",
      "Söküm videosunu kullanıcı kontrolüyle oynatıp gerçek parçaları modelle karşılaştırın. SCSI video bağlantılarını modeldeki SATA temsiliyle aynı saymayın.",
      "Çalışma kaydında plakanın hızlanması ile kafanın konumlanmasını ayırın; fotoğrafı açarak modelin basitleştirmelerini tartışın.",
    ],
    keyPoints: hddParts.map((p) => `${p.name}: ${p.detail}`),
    limits:
      "Plaka/kafa aralıkları görünür olması için büyütülmüştür. Track/sector çizgileri temsili vurgudur. Dönüş ve seek temposu gerçek fizik hesabına bağlı değildir. WebGL kullanılamazsa fotoğraf yedeği sunulur. Video eski SCSI aygıtıdır; bir HDD’nin çalışma halinde fiziksel olarak açılması önerilmez.",
    question: {
      prompt: "Aktüatör hedef ize ulaştığında veri hemen okunmaya başlar mı?",
      answer:
        "Her zaman değil. İstenen sektörün kafa altına dönmesi gerekebilir; seek ve dönme gecikmesi ayrı bileşenlerdir.",
    },
    transition:
      "Bu iki mekanik beklemeyi ve veri aktarımını şimdi ayrı sayılarla inceleyelim.",
  },
  s05: {
    represents:
      "Üç halka, örnek bir HDD okumasının seek, ortalama dönme gecikmesi ve veri aktarımı bileşenlerini temsil eder. Üstteki sayı bu üç sürenin toplamıdır. Halkanın kapsadığı oran, ilgili bileşenin toplam servis süresindeki payıdır; üzerindeki hareketli nokta sadece dikkati bileşene yöneltir, gerçek bir donanım zamanlayıcısı değildir.",
    learningGoal:
      "Aynı toplam gecikmenin hangi parametrelerle değiştiğini ve yüksek aktarım hızının mekanik gecikmeyi kaldırmadığını hesapla görmek.",
    walkthrough: [
      "Başlangıçta 7200 RPM, 6 ms seek, 4 KiB ve 200 MB/s için yaklaşık 10,19 ms elde edildiğini gösterin.",
      "RPM’i iki katına çıkarın: ortalama dönme bileşeni yarıya iner; seek ve aktarım değişmez.",
      "Veri miktarını artırın: aktarım büyür, diğer iki bileşen aynı kalır.",
      "Seek değerini değiştirdikten sonra sıfırlama ile kayıtlı örneğe dönün. Küçük aktarım diliminin görünür değerinin birimini mutlaka okuyun.",
    ],
    keyPoints: [
      "Tam tur süresi 60000/RPM ms, eşit olasılıklı hedef açıda ortalama dönme bunun yarısıdır.",
      "Aktarım süresi byte sayısının byte/s hızına bölünmesiyle hesaplanır.",
      "1 KiB = 1024 byte; 1 MB = 1.000.000 byte.",
      "Kuyrukta bekleme ile aygıttaki servis süresi aynı şey değildir.",
    ],
    limits:
      "Kuyruk, önbellek, denetleyici ve dosya sistemi maliyetleri dahil değildir. Toplam, uygulamanın uçtan uca yanıt süresi değildir. Halka noktalarının dönüş temposu karşılaştırmalı gerçek süre ölçümü değildir.",
    transition:
      "İşletim sistemi bu fiziksel ayrıntılara hangi adreslerle erişiyor?",
  },
  s06: {
    represents:
      "Sol ızgara işletim sisteminin kullandığı mantıksal blok adreslerini, sağ ızgara ise temsili fiziksel konumları gösterir. Aradaki denetleyici/eşleme katmanı aynı mantıksal isteğin hangi fiziksel yere yönlendirildiğini belirler. Seçilen LBA mavi, karşılık gelen fiziksel konum turuncu olur.",
    learningGoal:
      "Mantıksal adresin aygıt geometrisi ile birebir aynı olmadığını ve eşleme katmanının soyutlama sağladığını kavramak.",
    walkthrough: [
      "Sol ızgaradan LBA 03’ü seçin; örnekte fiziksel 05’in vurgulandığını gösterin.",
      "Komşu mantıksal blokları sırayla seçin. Bu örneğin özellikle karışık eşleme kullandığını ve komşuluğun evrensel fiziksel garanti olmadığını açıklayın.",
      "OS’nin blok isteği oluşturduğunu; kötü blok yeniden eşleme ve flash FTL gibi alt katmanların fiziksel yeri değiştirebildiğini belirtin.",
    ],
    keyPoints: [
      "LBA bir mantıksal blok adresidir; ekran koordinatı veya doğrudan silindir numarası değildir.",
      "Denetleyici ve aygıt iç eşlemeleri fiziksel ayrıntıları üst katmandan saklayabilir.",
      "Sektör/blok boyutu aygıta göre değişebilir; tek evrensel değer kullanılmaz.",
    ],
    limits:
      "16 bloklu eşleme eğitim için seçilmiştir; gerçek bir aygıttan alınmamıştır. Izgaranın yakınlığı gerçek seek süresi veya kapasite hesabı değildir.",
    transition:
      "Flash tabanlı SSD’de bu eşleme, güncellemelerden dolayı özellikle önem kazanır.",
  },
  s07: {
    represents:
      "İki silme bloğundaki küçük kutular fiziksel flash sayfalarını gösterir. L0’ın yeni sürümü yazıldığında yeni boş bir sayfa maviye döner; önceki sürüm çizgili ve geçersiz olur. Alttaki eşleme, L0’ın artık hangi fiziksel sayfada bulunduğunu gösterir. Bir mantıksal adresin sürümlerinin farklı yerlere gitmesi görünür kılınır.",
    learningGoal:
      "Flash güncellemesini yerinde üzerine yazma sanmamak; mantıksal güncel sürüm ile eski fiziksel kopyaları ayırmak.",
    walkthrough: [
      "İlk durumda L0’ın P00’da, ikinci bloğun boş olduğunu gösterin.",
      "L0’ı yaz düğmesine basın; P04 güncel, P00 geçersiz olur.",
      "Birkaç yeni sürüm daha yazın. Aynı LBA korunurken fiziksel konumun değiştiğini takip edin.",
      "Boş sayfa sınırına gelince örneği sıfırlayın. Bu noktayı sonraki sunucunun garbage collection konusuna bağlayın.",
    ],
    keyPoints: [
      "Sayfa okuma/yazma ile daha büyük blok silme farklı birimlerdir.",
      "Geçersiz veri, fiziksel alanın anında silinip kullanılabilir olması demek değildir.",
      "NVM bir ortam ailesidir; NVMe bu ortamlarla iletişim için kullanılan protokol adıdır.",
    ],
    limits:
      "Bu gösterim tam bir FTL veya GC uygulaması değildir. Elektriksel programlama, kanallar ve aşınma ömrü simüle edilmez; aygıtın gerçek sayfa/blok boyutu iddia edilmez.",
    transition:
      "Aynı erişim isteği, iş yükündeki konum düzenine göre farklı maliyet taşır.",
  },
  s08: {
    represents:
      "Numaralı kutular, veri isteklerinin farklı konumlara yöneldiği basitleştirilmiş bir adres uzayını gösterir. Rastgele seçimde turuncu gösterge dağınık konumlara atlar; sıralı seçimde komşu adreslerden ilerler. Çizim bir disk zamanlama algoritması değil, erişim örüntülerinin karşılaştırmasıdır.",
    learningGoal:
      "Küçük rastgele erişim ile büyük sıralı veri akışının aynı aktarım hızından neden farklı yararlanabildiğini açıklamak.",
    walkthrough: [
      "Rastgele seçeneğinde göstergenin sıçramalarını izleyin; HDD’nin konumlandırma maliyetini anımsatın.",
      "Sıralı seçeneğe geçin ve komşuluk düzenini gösterin.",
      "Animasyon kapalıysa adım düğmesiyle aynı örneği elle ilerletin.",
      "Teyp arşivi ve küçük dosya isteği gibi iki iş yükünü kıyaslayın; evrensel bir hız sıralaması kurmayın.",
    ],
    keyPoints: [
      "Erişim gecikmesi küçük isteklerde aktarımın önüne geçebilir.",
      "Uzun sıralı aktarım, konum bulma maliyetini daha çok byte’a yayabilir.",
      "Flash tabanlı SSD’nin mekanik seek’i olmaması bütün okuma/yazma maliyetlerinin eşit olması anlamına gelmez.",
    ],
    limits:
      "Kutular fiziksel disk geometrisini temsil etmez; çizilen yol mesafesinden ms üretilmez. Ek kaynaklardaki defragmentasyon animasyonu bu sayfanın algoritması değildir ve SSD birleştirme önerisi sayılmaz.",
    transition: "İlk bölümün ana fikrini tek soruyla kontrol edelim.",
  },
  s09: {
    represents:
      "Bu kontrol, aktarım hızı artışı ile bütün beklemelerin ortadan kalkmasını birbirinden ayırır. Cevap sonrasında görünen seek + dönme ifadesi, küçük bir HDD okumasında süren mekanik maliyetleri temsil eder. Görsel bir skor veya gerçek benchmark değildir.",
    learningGoal:
      "Donanım yapısının OS zamanlama kararlarını etkilediğini kendi sözüyle ifade edebilmek.",
    walkthrough: [
      "Soruyu “Aktarım hızını çok artırırsak erişim süresi sıfıra yaklaşır mı?” biçiminde somutlaştırın.",
      "Evet/Hayır seçeneklerinden önce dinleyiciden gerekçe isteyin.",
      "Hayır seçildiğinde doğru işareti ve mekanik bileşenleri gösterin. Evet seçilirse yanlış fikrin nedenini konuşup diğer seçeneği deneyin.",
    ],
    keyPoints: [
      "Aktarımın azalması, seek ve dönmenin ortadan kalkması değildir.",
      "Aynı istek kümesinin servis sırasını değiştirmek kafa hareketini etkileyebilir.",
      "NVM’de farklı fiziksel özellikler nedeniyle başka maliyetler öne çıkar.",
    ],
    limits:
      "Bu soru HDD’nin önbelleğe uğramayan örnek erişimi içindir; önbellekten karşılanan her istek fiziksel seek yapmak zorunda değildir.",
    question: {
      prompt:
        "Küçük bir HDD okumasında aktarım hızını yükseltmek tüm beklemeyi yok eder mi?",
      answer:
        "Hayır; seek ve dönme gecikmesi sürer. Sonuç iş yükü ve önbellek durumuna bağlıdır.",
    },
    transition:
      "İkinci kişi: Aynı bekleyen istekleri hangi sırayla işleyerek kafa hareketini değiştirebiliriz?",
  },
};
