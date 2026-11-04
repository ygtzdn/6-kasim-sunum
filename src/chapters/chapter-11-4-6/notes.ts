import type { SceneNotes } from "../../presentation/types";

export const managementNotes: Record<string, SceneNotes> = {
  "error-detection": {
    represents:
      "Yedi kutu özgün 1011001 verisini, mavi P kutusu ilk yazmada saklanan sabit çift parite bitini temsil eder. Turuncu çarpılar özgün veriyi bilen öğretim katmanıdır; gerçek denetleyici bu işaretleri bilmez. Son aşamada bit örneğinden parite, checksum ve CRC yöntemlerinin kavramsal karşılaştırmasına geçilir.",
    learningGoal:
      "Bir bozulmanın denetim bilgisiyle görünür olabildiğini ve bir kontrolün geçmesinin kesin veri doğruluğu olmadığını açıklamak.",
    walkthrough: [
      "Başlangıçta dört adet 1 ve P=0 birlikte çifttir. Saklanan P değeri deney boyunca değişmeyecek; okunan bozuk veriden yeniden üretilmeyecek.",
      "Enter ile 1001001 tek bit hatasına geçin: toplam 1 sayısı üç olur ve kontrol hata saptar. Dinleyiciye hangi bitin bozuk olduğunun bu tek kontrolden çıkıp çıkmadığını sorun.",
      "Sonraki aşama yeni iki bit hata örneğidir: 0111001 için dört adet 1 vardır. Veri değişmiştir ama parite kontrolü hata bulmaz. Bu, hatasızlık kanıtı değildir.",
      "Son aşamada parite, checksum ve CRC kartlarını gösterin. Bunların denetim bilgisini farklı yöntemlerle ürettiğini, kapsamanın yönteme bağlı olduğunu söyleyin. Backspace aynı bit dizilerini ve hesapları geri getirir.",
    ],
    keyPoints: [
      "Tek parite tek sayıda bit değişimini saptar; değişen konumu söylemez ve düzeltmez.",
      "Hata sonrası P yeniden hesaplanırsa saklanan denetim bilgisiyle karşılaştırma fikri kaybolur.",
      "Checksum ve CRC için burada gerçek algoritma seçilmediğinden hesap sonucu veya tüm hataları yakalama garantisi üretilmez.",
    ],
    limits:
      "OSC 10 §11.4 / slayt 27 kavramlarına dayanan özgün örnek. CRC kriptografik bütünlük garantisi olarak sunulmaz. Bit işaretleri öğretim yardımıdır; kontrol sonucu yalnız veri ve saklanan P ile hesaplanır.",
    question: {
      prompt: "Parite hatayı bulunca bozuk bitin yerini biliyor muyuz?",
      answer:
        "Hayır. Tek kontrol sonucu bozulmayı gösterebilir; hangi bitin bozuk olduğunu ve doğru değerini belirlemez.",
    },
    transition:
      "Uygun ek kodlama, yalnız hata bildirmekten fazlasını yapabilir mi?",
  },
  "error-correction": {
    represents:
      "Üst satır pariteyi, alt satır özgün küçük ECC kod örneğini gösterir. Bunlar aynı miktarda kullanıcı verisi taşıyan iki ürünün performans karşılaştırması değildir. Denetim öncesi ve sonrası ayrı aşamalardır; bit düzeltmesi gerçekten saf kod motorundan hesaplanır.",
    learningGoal:
      "Hata tespiti ile sınırlı hata düzeltmesini ayırmak; bir örneğin kapasitesini bütün aygıtlara genellememek.",
    walkthrough: [
      "İlk aşamada sağlam veri ve ek kodu gösterin. Buradaki ana konu algoritma adı veya bit konumları değil, ek bilginin neye yettiğidir.",
      "İkinci aşama tek hatalı okumadır. Tahmin alın; üçüncü aşamada parite yalnız hata bildirirken örnek ECC motoru bozuk biti hesaplayıp düzeltir.",
      "Dördüncü aşamada başlangıç kodunun yeni iki hatalı okuması açılır. Beşinci aşamada parite hata kaçırır; bu ECC örneği hatayı saptar ama düzeltemez. Bozuk bitler yerinde kalır.",
      "Backspace kontrol öncesi okumayı geri getirir; düzeltilmiş bit yeniden bozuk olur ve sonuç etiketi gizlenir. Gizli cevap veya düzeltme durumu saklanmaz.",
    ],
    keyPoints: [
      "ECC, uygun kodlama ile bazı hataları tespit edip düzeltebilir.",
      "Ekrandaki bir bit düzeltme ve iki bit tespiti yalnız bu kod örneğinin kapasitesidir.",
      "Bir hatanın tespit edilmesi, onun mutlaka düzeltilebilir olduğu anlamına gelmez.",
    ],
    limits:
      "OSC 10 §11.4 / slayt 27 genel ECC kavramını destekler; örnek kodun inşası kitap öğretimi olarak sunulmaz. Gerçek hesap genişletilmiş Hamming/SECDED motorudur; konumlar ve sendrom ders akışına alınmaz. Model yalnız 0/1/2 bit hata sınırındadır; daha fazlası için sınıflandırma güvencesi yoktur.",
    question: {
      prompt: "ECC kullanan bütün aygıtlar aynı sayıda biti düzeltebilir mi?",
      answer:
        "Hayır. Kodun yapısı ve tasarlandığı hata modeli belirler; bu örneğin sınırı evrensel değildir.",
    },
    transition:
      "Doğruluğu denetledik. Aygıtı dosya saklayabilir hale getirmek için hangi katmanlar hazırlanır?",
  },
  "device-preparation": {
    represents:
      "Dış çerçeve fiziksel ortamdır. Ham alandan sektör düzenine, yüzde 60/40 iki mantıksal bölüme ve yalnız Bölüm 1 üzerindeki dosya sistemi, bağlama ve dosya erişimine geçilir. İkinci bölüm hazırlanmamış karşı örnek olarak kalır. Alt sıra tamamlanan hazırlık katmanlarını gösterir.",
    learningGoal:
      "Fiziksel biçimlendirme, bölümleme, dosya sistemi oluşturma ve bağlamayı birbirinden ayırmak.",
    walkthrough: [
      "Ham ortamla başlayın. Enter ile denetleyicinin okuyup yazabildiği sektör ızgarasını açın; başlık, veri ve ECC ayrımını önceki sahneye bağlayın.",
      "Bölümleme aşaması alanı iki mantıksal bölüme ayırır. Dosya sistemi henüz yoktur; iki bölüm iki fiziksel disk değildir.",
      "Dosya sistemi aşamasında Bölüm 1 metaverisi görünür. Sonraki aşama onu OS ad alanına bağlar; bağlantı oku erişilebilirliği gösterir.",
      "Son aşamada yalnız bağlı dosya sistemine sunum.pdf örneği eklenir. Backspace ile dosya, bağlama, metaveri ve bölüm ayrımını ters sırada kaldırın; bunun gerçek biçimlendirmeyi geri almak olmadığını söyleyin.",
    ],
    keyPoints: [
      "Alan ayırmak dosya sistemi oluşturmak değildir.",
      "Fiziksel sektör yapısı ve dosya sistemi metaverisi farklı katmanlardır.",
      "Dosya erişiminde örnek FS hazırlanıp bağlanır; raw kullanım gibi farklı yollar sonraki tam rota uzantısında ayrı ele alınır.",
    ],
    limits:
      "OSC 10 §11.5 / slayt 28–29. Oran, sektör sayısı ve dosya özgün öğretim örneğidir. Gerçek format komutu çalıştırılmaz; fiziksel biçim son kullanıcının her kurulumda yaptığı işlem diye sunulmaz. 512 bayt evrensel güncel sektör boyutu değildir. Boot ve remap bu zincirin zorunlu devam adımları değildir.",
    question: {
      prompt: "Bölüm oluşturunca dosya sistemi de oluşmuş olur mu?",
      answer:
        "Hayır. Bölüm alanı ayırır; dosya/dizin ve tahsis yapıları ayrıca oluşturulur.",
    },
    transition:
      "Kısa rotada kernel daha çalışmadan bu depolamaya kimin ulaştığını soracağız. Tam rotada önce dosya yolu ile raw blok yolunu ayıracağız.",
  },
  "storage-access-modes": {
    represents:
      "Mantıksal blok ızgarası önce bağımsızdır; sonraki aşamada örnek dörtlü cluster çerçeveleri açılır. Normal dosya yolunda uygulama dosya sistemini kullanır. Raw örnekte veritabanının kendi blok yönetimi görünür; OS I/O ve sürücüler iki yolda da vardır.",
    learningGoal:
      "Dosya sistemi gruplaması ile aygıt bloklarını, normal dosya hizmeti ile uygulamanın raw blok yönetimini ayırmak.",
    walkthrough: [
      "İlk aşamada aygıtın mantıksal bloklarını gösterin. Bunlar dosya adı veya dizin değildir.",
      "Cluster aşamasında dört örnek blok bir çerçevede gruplanır. Grup boyutu gerçek bir dosya sistemi standardı değildir; kaynakta geçen gruplama fikrini somutlaştırır.",
      "Normal yol uygulama→dosya sistemi→OS I/O→blok aygıtıdır. Dosya sistemi dosya işlemlerini kendi blok düzenine çevirir.",
      "Raw aşamada veritabanı kendi blok düzenini üstlenir. OS I/O ve sürücü kutusunun kaybolmadığını özellikle gösterin. Backspace aynı iki sorumluluk sınırını tekrar açar.",
    ],
    keyPoints: [
      "Aygıt blokları ile dosya/dizin soyutlaması aynı düzey değildir.",
      "Raw blok erişimi dosya ve dizin hizmetlerini otomatik sağlamaz.",
      "Raw, bütün işletim sistemi sürücülerinin atlanması anlamına gelmez.",
    ],
    limits:
      "OSC 10 §11.5 / slayt 28–30; yalnız tam rotanın uzantısı. Güncel Linux O_DIRECT semantiği veya gerçek blok aygıtı erişim komutu anlatılmaz. Dosya API çağrılarının her durumda bütün cluster taşıdığı iddia edilmez.",
    question: {
      prompt:
        "Raw blok erişimi dosya ve dizin hizmetlerini otomatik sağlar mı?",
      answer:
        "Hayır. Bu düzeni uygulama veya uygun başka bir katman sağlamalıdır.",
    },
    transition:
      "Dosya sistemiyle blokları ayırdık. Açılış kodu kernel görüntüsünü depolamadan RAM'e nasıl getirir?",
  },
  "boot-sequence": {
    represents:
      "Firmware, boot block, yükleyici ve RAM'deki kernel dört ayrı roldür. İlk soru aşamasında hiçbir kutu etkin değildir. Üçüncü rol etkinleştiğinde depolamadaki kernel görüntüsünün RAM'e yükleme yolu açılır; son aşamada RAM'deki kod çalışır.",
    learningGoal:
      "Kernel henüz çalışmıyorken firmware'in başladığını ve yükleyici kodunun kernel'i RAM'e getirdiğini açıklamak.",
    walkthrough: [
      "İlk soruda durun: kernel RAM'de değilse ilk komutu kim başlatır? Enter ile ROM/firmware kutusunu etkinleştirin.",
      "Boot block aşamasında denetimin seçilen açılış aygıtındaki koda geçişini gösterin. Boot block sonraki yükleyiciye veya boot volume'a ulaşabilir.",
      "Yükleyici aşamasında kernel görüntüsünden RAM'e yükleme yolu açılır. Bütün yükleyicinin ilk küçük boot block'a sığması gerekmediğini belirtin.",
      "Son aşamada denetim RAM'deki kernel'e geçer. Tam anlatımda resmî slayt 30'un Windows örneğinde MBR'nin boot code ve partition table içerdiğini, boot partition'a uzanan belirli bir düzen gösterdiğini bir cümleyle anın.",
    ],
    keyPoints: [
      "Firmware, yükleyici ve kernel farklı rollerdir.",
      "Kernel depolamadaki görüntüden RAM'e getirilir; kendiliğinden disk üzerinde yürütülmeye başlamaz.",
      "Windows/MBR şekli kitaptaki belirli örnektir; bütün platformlara zorunlu düzen yapılmaz.",
    ],
    limits:
      "OSC 10 §11.5 / slayt 29–30. Slayt 30'un yerel resmî figüründe MBR, boot code, partition table ve boot partition etiketleri doğrudan doğrulandı; figür projeye kopyalanmadı. UEFI/GPT/ESP, Secure Boot ve initramfs kapsamı genişletmez.",
    question: {
      prompt: "Boot block ile kernel aynı şey mi?",
      answer:
        "Hayır. Açılış kodu kernel'e ulaşan yolun parçasıdır; kernel yüklenecek OS kodudur.",
    },
    transition:
      "Açılışta da normal I/O'da da fiziksel ortam var. Bir sektör kullanılamaz hale gelirse mantıksal adres ne olur?",
  },
  "bad-block-remapping": {
    represents:
      "OS'nin LBA 5 adresi başlangıçta fiziksel P45'e eşlenir. Arızada P45 çarpıyla görünür; son aşamada eşleme P90 yedeğine dönerken mantıksal 5 değişmez ve bozuk P45 görünür kalır.",
    learningGoal:
      "Mantıksal adres devamlılığı ile fiziksel konumu ve eski veriyi kurtarmayı ayırmak.",
    walkthrough: [
      "LBA 5→P45 kartını okuyun. Kimliklerin dosya adı veya gerçek plaka koordinatı olmadığını belirtin.",
      "İkinci aşamada P45 arızalıdır. Mantıksal adres hâlâ 5; aygıtta erişim sorunu görünür.",
      "Son aşama sector sparing örneğidir: yedek P90 etkinleşir, aynı LBA korunur. Eski içerik okunamıyorsa yalnız adres değiştirerek geri gelmediğini söyleyin.",
    ],
    keyPoints: [
      "Sparing, sorunlu fiziksel alanın yedek konuma yönlendirilmesidir.",
      "Üst katmanın mantıksal adresi korunabilir.",
      "Adresin korunması veri kurtarma garantisi değildir.",
    ],
    limits:
      "OSC 10 §11.5 / slayt 30. P45/P90 geometri değil özgün öğretim kimliğidir. Algılama, üretici politikası ve gerçek kurtarma işlemi modellenmez; normal SSD FTL eşlemesiyle aynı ayrıntıda anlatılmaz.",
    question: {
      prompt: "Yeniden eşleme okunamayan eski veriyi kesin kurtarır mı?",
      answer: "Hayır. Adres devamlılığı ve veri kurtarma farklı iddialardır.",
    },
    transition:
      "Bu aygıt yalnız normal dosyalara değil, RAM'den taşınan içerik için arka alana da yer sağlar.",
  },
  "swap-space": {
    represents:
      "RAM baskısı, taşınan birim, swap dosyası, raw swap bölümü ve birden çok alan beş ayrı görünümde gösterilir. Çizilen aygıt ve frame sayıları kapasite veya performans önerisi değildir.",
    learningGoal:
      "Swap alanının amacını, süreç/sayfa birimini ve dosya/bölüm yerleşimini birbirinden ayırmak.",
    walkthrough: [
      "RAM'in sınırlı alanını gösterin. Yeni içerik için arka alan gerekebilir; swap RAM hızını artırmaz.",
      "Süreç bütünü ile sayfa taşınmasını ayırın. Sonraki modelde yalnız P sayfası seçilir; süreç değiştirme veya aday seçme algoritması anlatılmaz.",
      "Dosya aşamasında swap dosyası dosya sistemi içinde çizilir. Raw bölüm aşamasında bu katman yerine ayrılmış alan görünür.",
      "Son aşamada iki alanın I/O yükünü paylaşma fikrini gösterin. Kitabın dedicated device ve multiple swap bağlamını güncel bütün sistemler için satın alma veya sabit hız önerisi yapmayın.",
    ],
    keyPoints: [
      "Swapping bütün süreç, paging sayfa bağlamında anlatılabilir; örnek bir sayfayı izler.",
      "Swap dosyada veya raw bölümde sağlanabilir; yerleşim bir yönetim kararıdır.",
      "Birden çok alan yük paylaşabilir; ek alan RAM'in erişim hızını yükseltmez.",
    ],
    limits:
      "OSC 10 §11.6 / slayt 31. Güncel Linux Swap Table/Swap Entry, swap cache veya evrensel RAM×2 kapasite kuralı eklenmez. Slayttaki Linux veri yapısı kitabın tarihsel örneğidir; yeni kernel sürümünün veri yapısı olduğu iddia edilmez.",
    question: {
      prompt: "Swap alanı büyüyünce RAM'in erişim hızı artar mı?",
      answer:
        "Hayır. Ek arka alan sağlanır; taşıma ve depolama I/O maliyeti sürer.",
    },
    transition:
      "Alanı seçtik. P sayfası dışarı giderken ve geri gelirken hangi konumlar değişir?",
  },
  "swap-journey": {
    represents:
      "Tek P sayfası, RAM frame F0 ve swap slot S0 izlenir. P kimliktir; F0/S0 konumlardır. Ayrılmış ama geçerli olmayan hedef kilitle, tamamlanmış swap kopyası onayla gösterilir. Sayaçlar yalnız açık tamamlanma aşamasında artar.",
    learningGoal:
      "Ayırma, I/O başlangıcı ve tamamlanmasını ayırmak; bir sayfanın konumunu ve taşıma maliyetini izlemek.",
    walkthrough: [
      "P F0'da, S0 boştur. Hedef ayır aşamasında S0 P için ayrılır ama veri henüz geçerli değildir; F0 dolu kalır.",
      "Dışarı yaz aşamasında RAM→swap oku açılır. Animasyon bitse bile tamamlanma yoktur; Enter ile Yazma tamam aşaması seçilince F0 boşalır, S0 geçerli olur ve yazma 1 olur.",
      "Yeniden eriş aşamasında S0→F0 okuması başlar; F0 henüz boştur. Sonraki açık tamamlanmada P F0'a gelir ve okuma 1 olur.",
      "Bu model geri okuma tamamlandığında S0'ı bırakmayı seçer. Bunun bütün OS'lerin zorunlu politikası olmadığını belirtin. Son aşama aynı P kimliğini ve 1 yazma + 1 okuma yolunu birleştirir.",
      "Backspace veya aşama listesi aynı modeli başlangıçtan yeniden üretir; konumlar, rezerv, pending ve sayaçlar geçmiş görünümü eksiksiz geri getirir.",
    ],
    keyPoints: [
      "Güncel içeriği korunması gereken P için yazma tamamlanmadan RAM kopyası bırakılmaz.",
      "Aynı P kimliği iki farklı ortamın konumlarıyla karıştırılmaz.",
      "Başlama ve tamamlanma ayrı olaylardır; hiçbir zamanlayıcı sahne aşamasını ilerletmez.",
    ],
    limits:
      "OSC 10 §11.6 / slayt 31 kavramına bağlı özgün tek sayfa modelidir. Her sayfanın mutlaka dışarı yazılması genellenmez. S0'ın page-in sonunda serbest bırakılması model tercihidir. LRU/FIFO, temiz dosya tahliyesi, swap cache, gerçek I/O süresi veya gerçek OS politikası simüle edilmez.",
    question: {
      prompt: "Yazmanın başlaması RAM frame'ini hemen bırakmaya yeter mi?",
      answer:
        "Bu örnekte hayır. Güncel içerik korunmadan aktarım tamamlanmış sayılamaz.",
    },
    transition:
      "Doğruluğu, aygıt hazırlığını ve arka alanı ayrı ayrı yönettik; üç ayrımı birlikte kontrol edelim.",
  },
  "management-decisions": {
    represents:
      "Üç soru/cevap çifti sırasıyla doğruluk kontrolü, hazırlama katmanları ve aktarım tamamlanmasını yoklar. Cevap aşamasında kısa görsel karşılık ve gerekçe açılır. Son aşama kişi 4'ün bağlantı ve çoklu disk konusuna teslim eder.",
    learningGoal:
      "Kontrolün geçmesi, alanın ayrılması ve aktarımın başlamasını üç ayrı tamamlanma iddiasından ayırmak.",
    walkthrough: [
      "İlk soruda paritenin geçmesinin kesin veri doğruluğu olup olmadığını sorun. İkinci aşama iki bit örneğinin pariteyi koruyabildiğini gösterir.",
      "Üçüncü aşamada bölüm oluşturmanın dosya sistemi oluşturmakla aynı olup olmadığını sorun. Dördüncü aşamada alan ile metaveri ayrı görünür.",
      "Beşinci aşamada yazma başladıktan sonra frame'in hemen boş olup olmadığını sorun. Altıncı aşama P'nin korunmasını ve açık tamamlanmayı hatırlatır.",
      "Kişi4'e teslim edin: Tek aygıttaki bu kararların dışına çıkıyoruz; depolamaya nasıl bağlanırız ve birden çok aygıtla hangi korumaları kurarız?",
    ],
    keyPoints: [
      "Hata tespiti, düzeltme kapasitesi ve kesin veri doğruluğu farklıdır.",
      "Bölüm alanı ile dosya sistemi yapısı farklıdır.",
      "Başlatılan I/O ile tamamlanan I/O farklıdır.",
    ],
    limits:
      "OSC 10 §11.4–11.6 / slayt 27–31 kavramlarını birleştiren özgün soru metinleridir. Bireysel yanıt kaydı veya notlandırma yoktur. Soru/cevap görünürlüğü yalnız ortak aşamaya bağlıdır.",
    question: {
      prompt: "Bu üç örneğin ortak uyarısı nedir?",
      answer:
        "Bir ara durumdan daha güçlü bir tamamlanma veya garanti iddiası çıkaramayız; hangi bilginin gerçekten hazır olduğunu kontrol etmeliyiz.",
    },
    transition:
      "Depolamaya erişim yolunu ve birden çok diskle kurulan korumayı dördüncü kişiden dinleyeceğiz.",
  },
};
