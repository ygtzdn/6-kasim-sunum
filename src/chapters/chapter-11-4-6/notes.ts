import type { SceneNotes } from "../../presentation/types";

export const managementNotes: Record<string, SceneNotes> = {
  s18: {
    represents:
      "Ekrandaki yedi kutu, ortamdan okunmuş yedi veri bitini temsil eder. Mavi P kutusu veri ilk yazılırken hesaplanıp saklanan çift parite bitidir ve deney boyunca 0 olarak sabit kalır. Soldan sağa bit numaraları 1–7’dir. Turuncu işaret, okunan bitin başlangıçtaki 1011001 sözcüğünden farklı olduğunu gösteren eğitim aracıdır; gerçek parite denetleyicisi bu işaretleri veya özgün veriyi bilmez. Alttaki Σ1, veri ve saklanan parite birlikte değerlendirildiğinde görülen toplam 1 sayısıdır.",
    learningGoal:
      "Ek denetim bilgisinin bir bozulmayı nasıl görünür kıldığını anlamak; pariteyi hata tespit yöntemi olarak tanımlamak ve kontrolün geçmesini verinin doğruluğuyla eşitlememek.",
    walkthrough: [
      "Başlangıç verisini okutun: 1011001 içinde dört adet 1 vardır. Saklanan parite 0 eklenince toplam çift kaldığından kontrol hata saptamaz.",
      "“1 bit hata” düğmesini seçin. Soldan üçüncü bit 1’den 0’a döner; veri 1001001 ve toplam 1 sayısı 3 olur. Aynı P=0 kullanıldığı için kontrol hata saptar.",
      "Dinleyiciye başka bir veri kutusuna dokundurun. Her tıklama yalnızca seçilen veri bitini değiştirir; P yeniden hesaplanmaz. Turuncu işaretlerin neden bir tespit algoritması değil, öğretim yardımı olduğunu açıklayın.",
      "Sıfırlayın ve “2 bit hata”yı seçmeden önce sonucu tahmin ettirin. Sonraki sahnede kontrolün sınırını bu örnekle açacağınızı söyleyin.",
    ],
    keyPoints: [
      "Çift paritede veri ve parite birlikte çift sayıda 1 içermelidir; sonuç bütün bitlerin XOR’u ile de bulunabilir.",
      "Tek parite, tek sayıda bit değişimini yakalar; hatalı bitin konumunu söylemez ve bit düzeltmez.",
      "Hata sonrası pariteyi yeniden üretmek burada hatayı saklardı. Saklanan denetim bilgisi ile yeni okuma karşılaştırılır.",
      "“Bu parite kontrolü hata saptamadı” ifadesi bilinçlidir: bir kontrolün geçmesi veri kesin doğrudur anlamına gelmez.",
    ],
    limits:
      "Bu, tek sözcükteki basit çift parite modelidir; gerçek HDD veya SSD ECC düzenini temsil etmez. CRC ve checksum da denetim bilgisi taşır fakat hata kapsaması kullanılan algoritmaya bağlıdır. Arayüzde özgün bitlerle karşılaştırma yalnızca değişen kutuları göstermek için kullanılır; kontrol sonucu sadece saklanan pariteye göre hesaplanır.",
    question: {
      prompt: "Parite başarısızsa hangi bitin bozuk olduğunu biliyor muyuz?",
      answer:
        "Hayır. Tek kontrol sonucu bozulmayı gösterebilir, konum ve doğru özgün değer hakkında yeterli bilgi sağlamaz.",
    },
    transition:
      "Bir hata görünür oldu. İki hata birbirini parite açısından gizlerse ne olur?",
  },
  s19: {
    represents:
      "İki satır, hata tespiti ile hata düzeltmesi arasındaki farkı karşılaştırır. Üst satır yedi veri biti ve bir sabit parite bitidir. Alt satır, dört veri bitini dört denetim bitiyle kodlayan genişletilmiş Hamming(8,4), yani SECDED örneğidir. Mavi P kutuları denetim bitleridir. Bunlar aynı boyutta kullanıcı verisi taşıyan iki ürünün performans karşılaştırması değildir; ayrı küçük kod sözcükleriyle koruma yeteneğinin farkı gösterilir.",
    learningGoal:
      "Ek kontrol bilgisinin uygun kodla bir bitin konumunu belirleyip düzeltmeye imkân verdiğini, buna rağmen bir kodun düzeltme kapasitesinin sınırlı olduğunu ayırt etmek.",
    walkthrough: [
      "Başlangıçtaki “2 bit” örneğinde önce tahmin alın, ardından “Kontrol et”i seçin. Parite satırındaki veri 0111001’dir; özgün veriden farklı olmasına rağmen toplam dört adet 1 vardır. Parite hatayı kaçırır.",
      "Aynı seçimde SECDED satırı iki ayrı kod biti değişimi için hatayı tespit eder, ancak “düzeltilemez” sonucunu verir. Bozuk kutular yerinde kalır; arayüz veri kurtardığı izlenimi yaratmaz.",
      "“1 bit”i seçin ve tekrar kontrol edin. Parite yalnızca tespit eder. SECDED, hesaplanan sendrom ve toplam pariteyle tek hatalı konumu belirler; değişen kutu özgün değere döner.",
      "“Hatayı geri getir” eylemiyle denetim öncesi okuma durumunu gösterin. Denetim bitlerinin sayısını ve geri dönüşün sadece bir hata durumunda yapıldığını vurgulayın.",
    ],
    keyPoints: [
      "SECDED, Single Error Correction / Double Error Detection anlamındadır: bir bit düzeltme, iki bit tespiti.",
      "Bu kodda 1, 2 ve 4. konumlar Hamming denetim bitleri; 8. konum toplam paritedir. Veri 3, 5, 6 ve 7. konumlardadır.",
      "Tek parite iki değişimi kaçırabilir. Bir hatayı tespit edebilmek onu düzeltebilmekle aynı değildir.",
      "ECC genel bir aile adıdır. Bu örneğin kapasitesi tüm ECC yöntemleri veya modern disk kodları için evrensel bir sınır değildir.",
    ],
    limits:
      "Etkileşim yalnızca bir veya iki bit hatası üretir. Genişletilmiş Hamming için üç ve daha fazla bozulmada güvenilir sınıflandırma ya da doğru düzeltme sözü verilmez. Basit Hamming(7,4) ile genişletilmiş SECDED karıştırılmamalıdır. Gerçek disklerde kullanılan kodlar ve denetim birimleri bu küçük modelden farklıdır. Teknik doğrulama: University of Michigan EECS373 “Hamming code for single error correction, double error detection” ve STMicroelectronics AN5342 ECC overview.",
    question: {
      prompt: "ECC yazan her sistem iki bozuk biti düzeltebilir mi?",
      answer:
        "Hayır. Bu SECDED kodu iki bit hatasını tespit eder fakat düzeltemez; kapasite kodun yapısına ve hata modeline bağlıdır.",
    },
    transition:
      "Verinin doğru okunmasını denetledik. Şimdi aygıtın dosya saklayabilir hale nasıl getirildiğine bakalım.",
  },
  s20: {
    represents:
      "Dış çerçeve fiziksel olarak hazır bir örnek depolama aygıtını gösterir. İlk gri hücreler kullanılabilir sektörlerin kavramsal temsilidir. Bölümleme sonrası yüzde 60 ve yüzde 40 oranındaki alanlar iki mantıksal bölümü temsil eder; bunlar iki fiziksel disk değildir. Klasör ve FS işareti seçilen bölümde dosya sistemi metaverisinin oluşturulduğunu, onay işareti ise dosya erişimi için bağlandığını gösterir. Küçük dosya simgeleri ancak bu aşamalardan sonra görünür.",
    learningGoal:
      "Fabrika veya donanım düzeyindeki fiziksel hazırlığı, bölüm oluşturmayı, dosya sistemi oluşturmayı ve bağlamayı ayrı sorumluluklar olarak açıklamak.",
    walkthrough: [
      "“Fiziksel hazırlık tamam” durumuyla başlayın. Burada kullanıcı düşük seviyeli bir format komutu çalıştırmaz; donanımın sağlayacağı blok adresleme temeli hazır kabul edilir.",
      "“Bölüm oluştur”u seçin: yüzde 60 / yüzde 40 ayrımı oluşur. Dosya sistemi simgesi henüz yoktur; alan ayırmak dosya yapısını oluşturmaz.",
      "İstediğiniz bölümü tıklayıp “Dosya sistemi oluştur”u seçin. Yalnızca seçili bölge değişir. Ardından “Bağla” ile dosya erişimi için kullanıma açın.",
      "“Dosya kaydet” bir örnek simge ekler. Diğer bölümü seçin; onun ayrı dosya sistemi ve bağlama durumuna sahip olduğunu gösterin.",
      "Geri okla son işlem durumlarına dönün veya sıfırlayın. Bu, gerçek formatlama için geri alma garantisi değildir; yalnızca görsel model geçmişidir.",
    ],
    keyPoints: [
      "Fiziksel hazırlık, bölümleme ve dosya sistemi oluşturma aynı işlem değildir.",
      "Dosya sistemi, seçilen bölgenin dizinler ve tahsis metaverisi gibi mantıksal yapılarını düzenler.",
      "Bu senaryoda dosya erişimi için dosya sisteminin oluşturulması ve bağlanması gerekir; düğme sırası bunu uygular.",
      "Yüzde 60/40 ve iki bölüm eğitsel örnektir; bölüm sayısı, dosya sistemi seçimi veya ideal yerleşim önerisi değildir.",
    ],
    limits:
      "Eğitim modeli gerçek diskte işlem yapmaz, terminal komutu çalıştırmaz ve dosya sistemi izni istemez. Bölümleme her ortamda zorunlu değildir: raw blok aygıtı kullanımı ve bölümsüz bir aygıtta dosya sistemi oluşturma mümkündür. Aygıtın fiziksel hazırlığını son kullanıcı biçimlendirmesiyle eşitlemeyin. Boot ve bozuk blok yönetimi bu sıranın zorunlu formatlama adımları değildir; sonraki iki sahnede ayrı işlevlerdir.",
    question: {
      prompt: "Bölüm oluşturduğumuz anda normal bir dosya kaydedebilir miyiz?",
      answer:
        "Bu örnekte hayır. Bölüm yalnızca alan ayırır; dosya sistemi yapıları ve kullanım için bağlama ayrıca gerekir.",
    },
    transition:
      "Hazırlanan aygıttan işletim sisteminin ilk yükleyicisine nasıl ulaşılır?",
  },
  s21: {
    represents:
      "Kutular disk hazırlama işlemlerini değil, denetimin açılış sırasında hangi bileşene geçtiğini gösterir. UEFI / GPT görünümünde firmware, EFI System Partition içindeki .efi yükleyiciyi bulup çalıştırır; yükleyici kernel’i RAM’e getirir. BIOS / MBR görünümünde BIOS’un seçtiği aygıttaki ilk açılış kodundan sonraki bootloader aşamalarına geçiş gösterilir. Oklar yürütme ve yükleme akışının yönüdür. Mavi kutu, anlatımda o anda odaklanılan bileşendir.",
    learningGoal:
      "Firmware → bootloader → kernel zincirini anlamak ve tarihsel BIOS/MBR örneğiyle yaygın UEFI/GPT/ESP yolunu birbirine karıştırmamak.",
    walkthrough: [
      "UEFI / GPT görünümünde “Başlat”ı seçin: firmware vurgulanır. Firmware’in normal bir kullanıcı uygulaması olmadığını ve kernel’den önce çalıştığını belirtin.",
      "“İlerle” ile ESP’ye geçin. Bu, GPT üzerinde özel türü olan bir bölümde yer alan EFI yükleyici dosyasıdır. Ekrandaki bootloader.efi örnek addır; gerçek dosya yolu platforma göre değişir.",
      "Sonraki adımda kernel RAM’de vurgulanır. Yükleyici diskteki kernel görüntüsünü bulup başlatmak için gerekli ortamı hazırlar.",
      "BIOS / MBR sekmesini seçin ve zinciri yeniden adımlayın. İlk MBR kodu ile sonraki yükleyici aşamalarının ayrı kutularda gösterildiğini anlatın; bütün yükleyicinin MBR’ın küçük kod alanında bulunması gerektiği sonucuna varmayın.",
    ],
    keyPoints: [
      "Firmware, bootloader ve kernel farklı rollerdir; kernel kendiliğinden diskten çalışmaya başlamaz.",
      "ESP, EFI System Partition anlamındadır; burada .efi yükleyici dosyasının bulunduğu bölgeyi temsil eder.",
      "BIOS/MBR ve UEFI/GPT burada karşılaştırılan iki yaygın bağlamdır; tek zorunlu evrensel yol değildir.",
      "Boot kodu, disk hazırlama sihirbazının bir sonraki biçimlendirme adımı değil, açılışın ayrı sorumluluğudur.",
    ],
    limits:
      "UEFI mutlaka GPT gerektirir veya tüm sistemler yalnızca bu çizilen yollardan açılır iddiası yoktur. UEFI başka bölüm tabloları, ağ açılışı ve doğrudan bir EFI uygulaması olarak kernel gibi seçenekleri de destekleyebilir. Secure Boot, boot girdileri, initramfs ve çok aşamalı yükleyici ayrıntıları kapsam dışıdır. Kaynak: UEFI Specification, Boot Manager ve GPT Disk Layout bölümleri.",
    question: {
      prompt: "UEFI görünümündeki ESP doğrudan kernel’in kendisi midir?",
      answer:
        "Hayır. Bu örnekte ESP yükleyici dosyasının bulunduğu bölümdür; yükleyici daha sonra kernel’i RAM’e yükler.",
    },
    transition:
      "Açılışta da normal I/O’da da OS mantıksal bloklarla çalışır. Fiziksel bir sektör bozulursa bu adres neden değişmeyebilir?",
  },
  s22: {
    represents:
      "Üst sıra OS’nin gördüğü mantıksal blok adreslerini, alt sıra aygıt içindeki örnek fiziksel sektörleri gösterir. Başlangıçta LBA 5, P45’e eşlenir. Turuncu çarpı bu fiziksel sektörün arızalı olduğunu belirtir. Yeniden eşleme sonrasında aynı LBA 5, ayrı yedek alan P90’a yönelir. Mavi ok ve LBA 5 → P90 kartı değişen eşlemeyi gösterirken diğer mantıksal adresler yerinde kalır.",
    learningGoal:
      "Mantıksal blok kimliği ile ortam üzerindeki fiziksel yerin aynı şey olmadığını ve aygıtın yedek sektörlere yeniden eşleme yaparak blok arayüzünü koruyabildiğini açıklamak.",
    walkthrough: [
      "Başlangıçta LBA 5 → P45 kartını okutun. Üstteki 5’in dosya adı veya gerçek plaka koordinatı değil, OS’nin kullandığı blok adresi olduğunu söyleyin.",
      "“Sektör hatası ekle”yi seçin. P45 turuncu çarpıyla işaretlenir; mantıksal adres 5 kaybolmaz.",
      "“Yedek alana eşle”yi seçin. Ok yedek P90’a yönelir ve eşleme kartı güncellenir. LBA 5 ve diğer mantıksal blokların numaraları değişmemiştir.",
      "Aynı adrese sonraki bir isteğin aygıt tarafından yeni konuma yönlendirilebildiğini açıklayın. Ardından çizimin eski veriyi sihirli biçimde kurtardığını iddia etmediğini özellikle belirtin.",
    ],
    keyPoints: [
      "Yeniden eşleme, bir mantıksal adresin başka fiziksel konuma yönlendirilmesidir.",
      "Aygıtın veya denetleyicinin tuttuğu eşleme bilgisi OS’den bu ayrıntıyı gizleyebilir.",
      "Yedek sektör alanı sınırlıdır; her arıza sonsuza kadar saklanamaz.",
      "Bozuk bir sektörün eski içeriği okunamıyorsa adresi yeniden eşlemek tek başına kayıp veriyi geri getirmez.",
    ],
    limits:
      "P40–P47 ve P90 fiziksel geometri hesabı değil, basit kimliklerdir. Arızanın algılanma zamanı, okuma kurtarma, ECC, yeniden yazma ve üreticiye özgü remap politikası simüle edilmez. Model yalnızca eşleme değişimini gösterir; veri kurtarma garantisi vermez. SSD FTL’nin sürekli adres çevirisiyle bu tek HDD benzeri arıza örneği aynı ayrıntı düzeyinde ele alınmaz.",
    question: {
      prompt:
        "P45 değiştiğinde uygulamanın kullandığı LBA da değişmek zorunda mı?",
      answer:
        "Hayır. Bu örnekte aygıt LBA 5’i P90’a yeniden eşler; üst katmanın mantıksal adresi korunur.",
    },
    transition:
      "Diskte yalnızca dosya verisi tutulmaz. RAM’den çıkarılan bazı sayfalar da ayrılmış swap alanında saklanır.",
  },
  s23: {
    represents:
      "Üstte üç RAM frame’i, altta dört swap slot’u vardır. Harfler sayfa kimlikleridir; çerçeve ve slot numaraları ise farklı depolama konumlarıdır. A kirli anonim sayfa, B özgün dosyadan tekrar okunabilen temiz dosya sayfası, C hem RAM’de hem geçerli swap kopyası bulunan temiz anonim sayfa, D ise yalnızca swap’ta bulunan sayfadır. Aynı C harfinin iki yerde görünmesi iki bağımsız sayfa değil, aynı içeriğin iki konumdaki geçerli kopyalarıdır.",
    learningGoal:
      "Sayfa, frame ve slot kavramlarını ayırmak; swap’ın bazı RAM sayfaları için arka depolama sağladığını ve sayfanın türüyle kirli durumunun I/O kararını etkilediğini kavramak.",
    walkthrough: [
      "Başlangıçta C’yi izleyin: sağ kart F2 ve S0 konumlarını aynı sayfa kimliğine bağlar. Bu modelde swap kopyasının RAM’e okunduktan sonra saklanabildiğini anlatın.",
      "A’ya dokunun: kirli anonim sayfanın güncel içeriği için swap konumu henüz yoktur. A tahliye edilirse verisini korumak için uygun yere yazılması gerekir.",
      "B’yi seçin: dosya destekli ve temiz olduğu için özgün dosyadan tekrar okunabilir; tahliye edilmesi mutlaka swap yazması anlamına gelmez.",
      "D’yi seçin: RAM’de bir frame’i yoktur, S1’de geçerli kopyası vardır. D’ye erişimde page-in için RAM’de alan gerekir.",
      "“Swap dosyası” ve “Ayrı bölüm” arasında geçin. Slot soyutlaması korunurken alanın bir dosya veya bölüm içinde sağlanabileceğini belirtin.",
    ],
    keyPoints: [
      "Frame fiziksel RAM konumu, slot swap alanı konumudur; aynı numaralar aynı yer anlamına gelmez.",
      "Anonim sayfalar bir normal dosya içeriğinin doğrudan temiz kopyası değildir. Kirli veri tahliye sırasında korunmalıdır.",
      "Temiz dosya destekli bir sayfanın tekrar okunabilir kaynağı vardır; her tahliye diske yazma gerektirmez.",
      "Swap kapasitesi RAM hızını veya CPU yürütme kapasitesini artırmaz; ek arka depolama ve I/O maliyeti getirir.",
    ],
    limits:
      "Üç frame ve dört slot çizim boyutudur; gerçek kapasite oranı değildir. Evrensel “swap RAM’in iki katı olmalı” kuralı verilmez. C’nin iki yerde görünmesi bu eğitim modelinin geçerli swap kopyasını tutma tercihidir; tüm OS politikalarının aynı olduğu iddiası yoktur. İşlem bütününü taşımak yerine sayfalar izlenir. Kaynak: Linux Kernel Documentation, Swap Table / Swap Entry ve Swap Cache.",
    question: {
      prompt:
        "C hem F2’de hem S0’da görünüyorsa iki kez bellek tüketen iki farklı sayfa mıdır?",
      answer:
        "Tek sayfa kimliğinin RAM’deki içeriği ve swap’taki geçerli kopyasıdır. Fiziksel alan iki ortamda ayrılır, fakat mantıksal sayfa kimliği aynıdır.",
    },
    transition:
      "Bu yerleşim üzerinde bir yazma ve iki okuma yaparak frame ile slot’ların nasıl değiştiğini izleyelim.",
  },
  s24: {
    represents:
      "Ekran önceki sahnedeki aynı sayfaları gerçek durum geçişleriyle izler. Üst RAM, alt swap’tır; A kirli anonim, B temiz dosya destekli, C temiz ve swap kopyalı, D yalnızca swap’ta başlar. Hareketli kutudaki sayfa harfi, “yaz” veya “oku” sözcüğü ve ok yönü I/O’yu birlikte anlatır. Alt sayaçlar yalnızca swap okumalarını ve yazmalarını sayar. Aktarım sürerken ayrılmış slot kilit simgesiyle gösterilir ve RAM frame’i yazma tamamlanana kadar dolu kalır.",
    learningGoal:
      "Swap alanı ayırmayı, page-out/page-in hareketini, kirli veri için yazma tamamlanmasını beklemeyi ve temiz dosya tahliyesinde swap yazması gerekmeyebileceğini aynı senaryoda takip etmek.",
    walkthrough: [
      "“A → swap”ı seçin. S2, A için ayrılır; yazma animasyonu sürerken F0’da A hâlâ görünür. Tamamlanınca F0 boşalır ve swap yazma sayacı 1 olur.",
      "“D’ye eriş”i seçin. D için page fault ve S1’den okuma gösterilir; D boş F0’a gelir. Swap okuması 1 olur; S1 kopyası bu modelde saklanır.",
      "Şimdi RAM doludur. “B’yi bırak” ile temiz dosya sayfasını aday olarak tahliye edin: F1 boşalır, swap yazması 1’de kalır. B’nin özgün dosyası geri okuma kaynağıdır.",
      "“A’ya eriş”i seçin. A, S2’den F1’e okunur; toplam swap okuması 2 olur. Son RAM D, A, C; swap C, D, A ve boş slot S3 şeklindedir.",
      "“Swap dolu” ön ayarını açın ve A’yı çıkarmayı deneyin. Boş slot olmadığından tahliye tamamlanamaz; A RAM’de kalır, frame boşa çıkarılmaz ve yazma sayacı artmaz. Sıfırla tüm eşlemeleri ve sayaçları geri getirir.",
    ],
    keyPoints: [
      "Kirli A’nın RAM frame’i ancak yazma başarıyla tamamlandıktan sonra serbest bırakılır.",
      "Page-in için RAM’de bir frame gerekir; D’den sonra A’yı getirmeden önce B tahliye edilir.",
      "Temiz B’nin tahliyesi swap yazması değildir; finalde 1 yazma ve 2 okuma beklenir.",
      "Model swap kopyalarını okumadan sonra geçerli ve ayrılmış tutar. RAM doluluğu ile swap slot doluluğu birbirinden bağımsız izlenir.",
    ],
    limits:
      "Animasyon süresi eğitim temposudur; gerçek gecikme veya hız karşılaştırması değildir. B, sunucu tarafından hazır seçilen adaydır; FIFO/LRU veya bir sayfa değiştirme algoritması çalıştırılmaz. Swap dolunca OOM, sıkıştırma veya gerçek OS müdahalesi taklit edilmez; yalnızca bu modelde tahliyenin başarısız olduğu gösterilir. Önbellek ve slot serbest bırakma politikaları sistemden sisteme değişebilir.",
    question: {
      prompt: "B çıkarıldığında swap yazma sayacı neden artmadı?",
      answer:
        "B temiz dosya destekli sayfadır; gerektiğinde özgün dosyadan tekrar okunabilir. Güncel anonim veriyi korumak için yapılan A yazmasıyla aynı işlem değildir.",
    },
    transition:
      "Doğruluğu, aygıt hazırlığını ve RAM için arka alanı bir arada değerlendirelim.",
  },
  s25: {
    represents:
      "Bu sayfa üç kavramın bağımsız kontrolünü içerir. Q04 tek paritenin kapsamadığı çift hataları, Q05 bölümleme ile dosya sistemi oluşturma ayrımını, Q06 temiz dosya sayfası tahliyesinin swap yazması gerektirmeyebileceğini yoklar. Ekranda aynı anda yalnızca seçili sorunun nesnesi ve iki seçenek vardır. Seçimden sonra kısa neden görünür; sorular arasında geçiş yapılınca önceki yanıtlar saklanır.",
    learningGoal:
      "Dinleyicinin hata tespiti, disk hazırlığı ve swap alanı yönetiminde üç yaygın yanılgıyı doğru gerekçeyle reddedebilmesini sağlamak.",
    walkthrough: [
      "Q04’te “Parite her iki bit hatasını yakalar mı?” sorusunu okutun ve oylama alın. “Hayır” doğru cevaptır: çift sayıda değişim toplam pariteyi koruyabilir. İstenirse menüyle S18’e dönüp somut 0111001 örneğini gösterin.",
      "Q05’e geçin. “Farklı katmanlar” seçimini yapmadan önce dinleyiciden bölümün neyi hazırladığını söylemesini isteyin. Bölüm alanı ayırır; dosya sistemi dosya ve dizinlerin yapısını düzenler.",
      "Q06’da “Gerekmez” doğrudur. S24’teki B’nin dosya destekli ve temiz olduğunu hatırlatın; kirli A ile arasındaki fark doğru gerekçedir.",
      "Üç sorunun gerekçeleri netleşince “Bağlantı & RAID” ile dördüncü sunucuya geçin. Sonraki bölümün aygıta erişim yolu ve çoklu aygıt korumasını ele alacağını söyleyin.",
    ],
    keyPoints: [
      "Tespit sonucu, düzeltme kapasitesi ve kesin veri doğruluğu farklı iddialardır.",
      "Alan ayırmak ile o alanda dosya sistemi metaverisi oluşturmak ayrı işlerdir.",
      "Tahliye sırasında I/O gereği sayfanın türüne, kirli durumuna ve geçerli arka kopyasına bağlıdır.",
      "Bir aygıtın doğruluğunu ve alanını yönetmek, aygıtın bağlantı topolojisi veya bir RAID dizisinin hata toleransıyla aynı katman değildir.",
    ],
    limits:
      "Yanıt seçimleri yalnızca bu istemci oturumundaki eğitim durumudur; bir öğrenci notlandırma veya değerlendirme sistemi değildir. Q06’daki “gerekmez” tüm sayfaların yazmasız atılabileceği anlamına gelmez: örnekteki kirli anonim A’nın verisi korunmadan serbest bırakılması yanlıştır.",
    question: {
      prompt: "Bu üç başlık ortak hangi sorunu çözer?",
      answer:
        "Kalıcı verinin doğru okunması, aygıtın uygun mantıksal yapılarla hazırlanması ve bellek sayfalarının arka alanda kaybolmadan yönetilmesi.",
    },
    transition:
      "Bir aygıttaki doğruluğu ve alanı yönettik. Şimdi aygıtı sisteme nasıl bağladığımızı ve birden fazla diskle hangi korumaları kurabildiğimizi görelim.",
  },
};
