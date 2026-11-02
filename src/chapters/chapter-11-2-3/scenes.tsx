import type { SceneDefinition } from "../../presentation/types";
import { QueueSetup, ScheduleComparison, SchedulingLab } from "./SchedulingLab";
import { FlashLab } from "./FlashLab";
import { NvmCheckpoint, NvmScheduling } from "./NvmScenes";

export const schedulingScenes: SceneDefinition[] = [
  {
    id: "s10",
    title: "Aynı kuyruk, farklı servis sırası",
    shortTitle: "İstek kuyruğu",
    chapter: "11.2",
    presenterId: 2,
    render: ({ enabled, goTo }) => <QueueSetup enabled={enabled} goTo={goTo} />,
    notes: {
      represents:
        "Bu ekran, bir HDD için işletim sistemi zamanlayıcısında bekleyen mantıksal I/O isteklerinin eğitim modelidir. Her kart bir istektir; üstteki küçük sayı geliş kimliğini, büyük sayı hedef silindiri gösterir. Kart sırası fiziksel yerleşim değil, geliş sırasıdır. Bütün istekler t=0 anında hazırdır. İlk kafa, silindir aralığı ve yön; ilerideki üç algoritmanın aynı koşullarda karşılaştırılmasını sağlar.",
      learningGoal:
        "Bir disk zamanlama sonucunun ancak istek kuyruğu, başlangıç konumu, fiziksel sınırlar ve tarama yönü belirtildiğinde anlam kazandığını açıklayabilmek.",
      walkthrough: [
        "Başlangıçtaki 42, 12, 76, 24, 60 kartlarını soldan sağa okuyun. Kafa 35’te, sınırlar 0 ve 99, yön artan olsun. Buradaki beş isteğin hiçbirinin ekranda görünmesi henüz servis edildiği anlamına gelmez.",
        "“İstekler” alanında virgül veya boşlukla ayrılmış 0–99 tam sayıları girilebilir. Tekrarlı silindir ekleyin: Aynı konuma ait iki kart iki bağımsız istektir; bir sonraki sahnede kimlikleri ayrı korunur. Boş alan sıfır istek anlamına gelir. Geçersiz giriş son geçerli kuyruğu değiştirmez.",
        "Başlangıç kafasını ve artan/azalan yönü değiştirin. Parametre değişince FCFS, SCAN ve C-SCAN’in adımları temizlenir. “Varsayılan örneği yükle” simgesi bütün parametreleri başlangıca döndürür. Adımları sıfırlamak ile parametreleri varsayılana döndürmek farklı eylemlerdir.",
        "Sunum sırasında ilk örneği koruyup “Dene”ye basın. Giriş düzenlemeyi uzun bir etkinliğe çevirmeyin; önce kayıtlı kuyrukla üç davranışı karşılaştırın.",
      ],
      keyPoints: [
        "Bu bölüm Operating System Concepts 10. baskı 11.2: HDD Scheduling kapsamındadır. Örnek kuyruk ve sayılar bu proje için oluşturulmuştur.",
        "Hareket ölçüsü, ardışık kafa konumları farklarının mutlak değerlerinin toplamıdır: Σ|sonraki − önceki|. Birim silindir hareketidir; milisaniye değildir.",
        "İşletim sistemindeki I/O sırası ile aygıt/denetleyici içindeki servis sırası aynı katman değildir. Aygıt kendi kuyruğunda yeniden sıralama yapabilir; bu örnekte seçilen politika doğrudan soyut kafa yolunu belirler.",
      ],
      limits:
        "Sabit 0–99 geometri, en fazla 20 istek, tek kafa ve statik kuyruk kullanılır. Yeni istek gelişleri, dönme gecikmesi, aktarım boyutu, önbellek, gerçek seek eğrisi ve firmware yeniden sıralaması hesaplanmaz. Gerçek bir aygıta komut gönderilmez.",
      transition:
        "Artık başlangıç koşullarımız sabit. Önce kimseyi yeniden sıralamadan, geliş sırasına uyalım.",
    },
  },
  {
    id: "s11",
    title: "FCFS: geliş sırasını koru",
    shortTitle: "FCFS",
    chapter: "11.2",
    presenterId: 2,
    render: ({ enabled, goTo }) => (
      <SchedulingLab algorithm="FCFS" enabled={enabled} goTo={goTo} />
    ),
    notes: {
      represents:
        "Grafik, FCFS politikasında kafanın servis olayları boyunca yaptığı hareketi gösterir. Yatay eksen silindir konumudur; aşağı yönde ilerleme olay sırasıdır, zaman ölçeği değildir. Sarı daire mevcut kafadır. Soluk çizgiler planlanan yolu, mavi çizgiler tamamlanmış hareketi gösterir. Alttaki kartlar hâlâ geliş sırasındadır; onay işareti isteğin tamamlandığını belirtir.",
      learningGoal:
        "FCFS servis sırasını koruyarak toplam hareketi adım adım hesaplayabilmek; sıra adaleti ile kısa fiziksel yolu ayırabilmek.",
      walkthrough: [
        "Her “Adım” bir sonraki servis olayını gerçekleştirir. Varsayılan örnekte 35→42 için 7, 42→12 için 30, 12→76 için 64, 76→24 için 52, 24→60 için 36 silindir hareketi eklenir.",
        "Büyük toplamın 7, 37, 101, 153 ve 189 olarak ilerlemesini gösterin. Yanındaki sarı +değer yalnızca son adımın katkısıdır. Son kart tamamlandığında kafa 60’tadır ve toplam 189’dur.",
        "Oynat, adımları sabit görsel aralıklarla ilerletir. Duraklat ve sıfırla kullanılabilir. Sıfırla aynı girdilerle kafayı başlangıca döndürür. Kuyruk düğmesi S10’a götürür; aynı oturumda geri dönüldüğünde hesap durumu korunur.",
        "İsterseniz kuyruğa kafa konumundaki bir isteği sonradan ekleyin. FCFS bu isteği başlangıca taşımaz; giriş sırasındaki yerinde servis eder. Aynı silindire arka arkaya gelen ayrı istekler sıfır ek hareketle ayrı ayrı tamamlanır.",
      ],
      keyPoints: [
        "First-Come, First-Served, modelde giriş kimliği sırasını aynen korur. Uygulaması basittir; uzak konumlar arasında gidip gelme toplam hareketi büyütebilir.",
        "Sonlu kuyrukta istekler önlerine yeni konum öncelikli istekler alınmadan servis edilir. Bunun öngörülebilir geliş sırası sağlaması, bütün isteklerin eşit süre beklemesi anlamına gelmez.",
        "Gerçek sistemler okuma/yazma önceliği, ardışık istek birleştirmesi ve deadline gibi politikalar kullanabilir. Bu sahne bunları FCFS hesabına örtülü olarak eklemez.",
      ],
      limits:
        "Grafiğin dikey ekseni geçen süreyi veya duvar saati beklemesini göstermez. Animasyon hızı aygıt performansı değildir. Bu tek örnekten bütün iş yükleri için bir FCFS başarı oranı, starvation süresi ya da gerçek IOPS hesaplanmaz.",
      question: {
        prompt:
          "Kafa 35’teyken kuyruğun sonuna gelen 35 isteği hemen mi servis edilir?",
        answer:
          "FCFS’de hayır. İstek geliş sırasındaki yerini korur; başlangıç kafasına yakın olmak öncelik sağlamaz.",
      },
      transition:
        "Geliş sırasını koruduk, fakat kafayı çok gezdirdik. Şimdi aynı yöndeki istekleri tek geçişte toplayalım.",
    },
  },
  {
    id: "s12",
    title: "SCAN: aynı yöndekileri topla",
    shortTitle: "SCAN",
    chapter: "11.2",
    presenterId: 2,
    render: ({ enabled, goTo }) => (
      <SchedulingLab algorithm="SCAN" enabled={enabled} goTo={goTo} />
    ),
    notes: {
      represents:
        "Aynı kuyruk ve başlangıç koşulları bu kez SCAN, yani asansör mantığıyla servis edilir. Kafa seçilen yönde ilerler, yol üstündeki istekleri konum sırasıyla tamamlar, ters tarafta bekleyen istek varsa fiziksel sınıra ulaşarak geri döner. Grafikte 99’daki istek olmayan nokta bir sınır/dönüş olayıdır; tamamlanan istek sayısını artırmaz.",
      learningGoal:
        "SCAN’in yönlü servis ve fiziksel uç davranışını izlemek; SCAN ile LOOK arasındaki önemli farkı ifade edebilmek.",
      walkthrough: [
        "Varsayılan artan yönde 35→42→60→76 hareketlerini adımlayın. Bu üç isteğin sırası giriş sırasından farklıdır: 60, 76’dan önce servis edilir.",
        "Karşı tarafta 24 ve 12 beklediği için kafa 76’da dönmez; 99 fiziksel ucuna gider. Bu +23 hareketi bir servis değildir. Tamamlanan istek sayısının 3/5 kalmasını özellikle gösterin.",
        "Kafa geri döner, 99→24→12 yoluyla kalan istekleri tamamlar. Yol toplamı 7+18+16+23+75+12 = 151’dir. Son isteğin ardından 0’a doğru gereksiz yol eklenmez.",
        "Kuyruk düğmesiyle yönü azalana değiştirip geri dönerseniz 35→24→12→0→42→60→76 yolu elde edilir. Başlangıç yönü sonucu etkiler; üç algoritmayı karşılaştırmadan önce yönü sabitleyin.",
      ],
      keyPoints: [
        "Mevcut kafayla aynı konumdaki istekler önce, aynı konumdaki eşit öncelikli istekler giriş kimliği sırasıyla servis edilir. Aynı konumda ek hareket sıfırdır.",
        "Bu modelin SCAN sözleşmesi: Karşı yönde istek varsa fiziksel uca kadar git, dön, kalanları servis et ve son istekte dur. Başlangıç yönünde istek olmaması, karşı taraftaki istekleri almak için uç davranışını kaldırmaz.",
        "LOOK, son bekleyen isteğe ulaştığında fiziksel uca gitmeden dönebilir. Burada 76’da dönülseydi SCAN yerine LOOK benzeri bir yol çizilmiş olurdu. SSTF ise en yakın isteği seçen farklı bir yaklaşımdır ve sürekli yakın istek gelişlerinde uzak istekleri bekletebilir.",
      ],
      limits:
        "151 silindir hareketi bu statik kuyruğa ve artan yöne özgüdür. SCAN’in çevrimiçi kuyruklarda davranışı, yeni istek kabul politikası ve servis süreleri ayrıca tanımlanmalıdır. Şemadan kesin bekleme süresi veya evrensel adalet garantisi çıkarılmaz.",
      transition:
        "SCAN iki yönde de servis veriyor. Servisi tek yönde tutarsak dönüş yoluna ne olur?",
    },
  },
  {
    id: "s13",
    title: "C-SCAN: tek yönde servis",
    shortTitle: "C-SCAN",
    chapter: "11.2",
    presenterId: 2,
    render: ({ enabled, goTo }) => (
      <SchedulingLab algorithm="C-SCAN" enabled={enabled} goTo={goTo} />
    ),
    notes: {
      represents:
        "C-SCAN, seçilen yönde servis veren çevrimsel taramadır. Kafa artan yönde 42, 60 ve 76’yı tamamlar; 99’a gider ve 0’a döner. Turuncu kesikli çizgi 99→0 dönüşüdür: Bu aralıkta istek tamamlanmaz, ancak kafa gerçekten hareket eder. Sonra 12 ve 24 artan sırada servis edilir.",
      learningGoal:
        "C-SCAN’in servis yönünü ve servis yapılmayan dönüşünü ayırmak; dönüş mesafesini toplam maliyete katmak.",
      walkthrough: [
        "İlk dört adım SCAN ile aynıdır: 35→42→60→76→99. Sonraki adımda kesikli turuncu dönüşü açın. Ekrandaki “Servis yok · +99” etiketi, servis sayısı artmadan fiziksel hareketin toplamı artırdığını gösterir.",
        "Dönüşün öncesinde toplam 64, dönüşten sonra 163’tür. Sonraki 0→12 ve 12→24 hareketleriyle son toplam 187 olur. Servis sırası 42,60,76,12,24’tür.",
        "Kuyruk kartlarını izleyin: 24 isteği 12’den önce gelmiş olsa da çevrimsel servis sırasına göre daha sonra tamamlanır. Dönüş esnasında 24 veya 12’nin üstünden geçilmesi bu istekleri bitirmez.",
        "Sıfırla ve aynı adımları tekrar edin. Animasyon durdurulduğunda da son durum, toplam mesafe ve tamamlanmış istek işaretleri okunabilir kalır.",
      ],
      keyPoints: [
        "Tek yönde tarama, yoğun ve sürekli gelişli iş yüklerinde konumlar arası bekleme davranışını daha düzenli kılmayı hedefler. Bu statik model o istatistiksel bekleme davranışını ölçmez.",
        "C-SCAN’in dönüşünü ücretsiz kabul etmek, bu örnekte 99 silindir hareketini yanlışlıkla hesaptan siler. Hareket toplamı 187’dir; yalnızca servis aralıkları toplanmaz.",
        "C-LOOK, fiziksel uçlar yerine bekleyen isteklerin uçları arasında çevrim yapabilir. SCAN/C-SCAN ile LOOK/C-LOOK adları aynı davranışı ifade etmez; burada yalnızca ilk üç ana algoritmanın hesap motoru vardır.",
      ],
      limits:
        "Dönüş için çizilen animasyon süresi gerçek seek süresi değildir. Kafa hareketi yalnızca doğrusal silindir farkıyla ölçülür. C-SCAN’in bu kuyrukta FCFS’den 2 daha az ve SCAN’den 36 daha fazla hareket yapması bütün aygıtlara veya iş yüklerine genellenemez.",
      question: {
        prompt:
          "Dönüşte hiçbir istek servis edilmiyorsa 99→0 hareketi hesaptan çıkarılır mı?",
        answer:
          "Hayır. Fiziksel konum değişimi 99’dur ve toplam kafa hareketine eklenir.",
      },
      transition:
        "Üç toplamımız var. En küçük sayıyı görmek tek başına doğru zamanlayıcıyı seçmeye yeter mi?",
    },
  },
  {
    id: "s14",
    title: "Kısa yol tek ölçüt değil",
    shortTitle: "Zamanlama karşılaştırması",
    chapter: "11.2",
    presenterId: 2,
    render: ({ enabled, goTo }) => (
      <ScheduleComparison enabled={enabled} goTo={goTo} />
    ),
    notes: {
      represents:
        "Üç çubuk aynı güncel kuyruk, kafa ve yön girdisinden hesaplanan tamamlanmış FCFS, SCAN ve C-SCAN yollarını karşılaştırır. Grafik kısmen oynatılan sahnelerin anlık toplamlarını değil, her algoritmanın nihai toplamını gösterir. Çubuk uzunluğu yalnızca silindir hareketine orantılıdır. Varsayılan kuyrukta sonuçlar 189, 151 ve 187’dir.",
      learningGoal:
        "Toplam mekanik hareket ile adalet, bekleme, gecikme ve işlem hacminin farklı ölçüler olduğunu kavramak; tek örnekten genel kazanan ilan etmemek.",
      walkthrough: [
        "Önce üç sonucu okuyun ve SCAN’in bu girdilerde en kısa yolu verdiğini söyleyin. “Bu kuyrukta” ifadesini koruyun. Bir çubuğa basmak ilgili algoritma sahnesine geri götürür; kuyruk aynı kalır.",
        "Alttaki “Dönüş ücretsiz mi?” sorusuna dinleyiciden cevap alın. “Hayır” seçimi dönüşün hareket olduğunu açar. “Evet” seçilirse servis yapılmamasıyla hareket yapılmamasının farklı olduğunu ekrandaki kısa geri bildirimle düzeltin. Sıfırla simgesi cevabı temizler.",
        "Hareket, bekleme ve adalet etiketlerini üç farklı değerlendirme sorusu olarak kullanın: Kafa ne kadar gitti? Bir istek ne kadar bekledi? Hangi istekler sürekli geri plana düşebilir?",
        "Kuyruktaki tek bir isteği değiştirip tekrar bakabilirsiniz. Sonuç tablosu aynı girdilerden yeniden hesaplanır; varsayılan değerler ekrana sabit yazılmış sonuçlar değildir.",
      ],
      keyPoints: [
        "Gerçek bir I/O tamamlanması için kuyruk beklemesi, seek, dönme, aktarım, denetleyici ve yazılım işleri birleşir. Silindir hareketinin azalması, uygulama gecikmesinin aynı oranda azalması demek değildir.",
        "Deadline yaklaşımı uzun bekleyen istekleri sınırlamayı, birleştirme bitişik istekleri tek iş olarak göndermeyi, okuma/yazma önceliği farklı gecikme ihtiyaçlarını dengelemeyi hedefler. Bunlar sadece fiziksel yakınlığa göre sıralama değildir.",
        "OS kuyruğu ve aygıtın komut kuyruğu ayrı karar noktalarıdır. Kitap/slaytlardaki NOOP, CFQ ve RHEL 7 örnekleri tarihsel bağlamdır; güncel her işletim sisteminin varsayılanı diye sunulmamalıdır.",
      ],
      limits:
        "Statik kuyrukta bütün istekler başlangıçta hazırdır. Bu model çevrimiçi starvation analizi, gerçek ortalama bekleme, ms, IOPS veya bütün iş yüklerine genellenen performans sıralaması üretmez. Çubuklar adalet puanı değildir.",
      question: {
        prompt:
          "En az silindir hareketi yapan politika her durumda en düşük uygulama gecikmesini verir mi?",
        answer:
          "Hayır. İstek boyutları, dönme, önbellek, kuyruk beklemesi, firmware ve iş yükü hedefleri ayrıca önemlidir.",
      },
      transition:
        "Bütün bu fiziksel sıralama HDD’nin hareketine dayanıyordu. Peki hareket etmeyen bir aygıtta neyi yönetiyoruz?",
    },
  },
  {
    id: "s15",
    title: "NVM’de hedef neden değişir?",
    shortTitle: "NVM zamanlaması",
    chapter: "11.3",
    presenterId: 2,
    render: ({ enabled }) => <NvmScheduling enabled={enabled} />,
    notes: {
      represents:
        "Bu ekran OS I/O kuyruğu, NVMe komut kuyrukları ve flash tabanlı SSD içindeki NAND kanallarını ayrı katmanlar olarak gösterir. Solda host okuma/yazma istekleri, ortada iletişim kuyruklarının soyut temsili, sağda birden çok flash kanalı vardır. OS veya SSD denetleyicisi seçildiğinde vurgulanan sorumluluklar değişir. NVM ortam ailesidir; NVMe erişim protokolüdür. Bu ikisi eş anlamlı değildir.",
      learningGoal:
        "Seek ortadan kalkınca konum odaklı HDD sıralamasının gerekçesinin değiştiğini; buna rağmen yazılım yükü, kuyruklar, adalet ve paralelliğin önemini koruduğunu açıklamak.",
      walkthrough: [
        "“OS” seçiliyken birleştirme, öncelik ve deadline etiketlerini gösterin. Host, hangi isteğin ne zaman gönderileceği ve gecikme/işlem hacmi hedefleriyle ilgilenir. Her NVM aygıtının her zaman aynı OS politikasını kullandığı sonucunu çıkarmayın.",
        "“Gönder”e basın. Paketlerin kuyruklardan kanallara geçmesini ve kanalların birlikte vurgulanmasını gösterin. Bu, paralel iş yapabilme fikridir; gerçek zaman, bant genişliği veya dört kat hız hesabı değildir. “Yeniden” başlangıç görsel durumunu getirir.",
        "“SSD denetleyicisi”ni seçin. FTL mantıksal adresleri fiziksel flash sayfalarına eşler; garbage collection geçersiz alanı geri kazanır; wear leveling yazma/silme aşınmasını dağıtmayı hedefler. Bu işler OS’nin HDD kafa sıralamasıyla aynı görev değildir.",
        "Ortadaki NVMe kutusunu bir FTL olarak tanımlamayın. NVMe host ile aygıtın komut/tamamlama iletişimini düzenler; aygıtın iç flash yerleşimi ve GC politikası denetleyicide kalır.",
      ],
      keyPoints: [
        "Konumlar arasında mekanik seek olmadığı için silindir farkını azaltma, bu SSD örneğinde temel maliyet ölçüsü değildir. Ancak komut hazırlama, kilitler, kuyruklar, CPU zamanı ve I/O gecikme hedefleri hâlâ vardır.",
        "Çoklu kuyruklar ve aygıt içi paralellik birlikte düşünülebilir; çok fazla bekleyen istek gecikmeyi de artırabilir. “Kuyruk ne kadar derinse o kadar iyi” evrensel bir kural değildir.",
        "11.3 NVM Scheduling kapsamında flash tabanlı SSD somut örnektir. Bütün NVM teknolojileri aynı sayfa/blok silme davranışına sahipmiş gibi anlatılmamalıdır.",
      ],
      limits:
        "Dört kanal kavramsal çizimdir; ürün özellikleri veya gerçek host-kuyruk-kanal eşlemesi değildir. Birlikte renk değiştirmeleri bağımsızlık veya hız garantisi vermez. Ekran benchmark çalıştırmaz, gerçek paralellik ve OS zamanlayıcı farklarını sayısal olarak hesaplamaz.",
      transition:
        "Şimdi SSD denetleyicisinin içine inelim: Host üç kez yazarken flash neden beş sayfa yazabilir?",
    },
  },
  {
    id: "s16",
    title: "Yazmak, silmek ve yeniden kullanmak",
    shortTitle: "FTL ve garbage collection",
    chapter: "11.3",
    presenterId: 2,
    render: ({ enabled }) => <FlashLab enabled={enabled} />,
    notes: {
      represents:
        "Üç silme bloğunun her birinde dört fiziksel sayfa vardır. L0–L5 host’un mantıksal sayfalarıdır; Bx.Py fiziksel konumdur. Bir sayfanın v0/v1 etiketi sürümünü belirtir. Onay geçerli veriyi, çarpı ve tarama geçersiz eski kopyayı, çizgi boş sayfayı gösterir. Kesikli ve GC kilitli blok denetleyici için ayrılmış alandır. FTL satırındaki bir mantıksal adres seçilince onun güncel fiziksel sayfası mavi vurgulanır.",
      learningGoal:
        "Yerinde olmayan güncelleme, mantıksal-fiziksel eşleme, geçersiz sayfa, canlı veri kopyalama ve blok silme adımlarını izlemek; yazma büyütmesini gerçek sayaçlardan hesaplamak.",
      walkthrough: [
        "Başlangıcı okuyun: B0’da L0–L3, B1’de L4 ve L5 vardır; B1’de iki boş sayfa, B2’de dört ayrılmış boş sayfa bulunur. Başlangıç yüklemesi sayaçlara dahil değildir. Host, fiziksel B0 sayfasını yerinde yeniden yazma komutu vermiyordur.",
        "“L0’ı güncelle” ve “L1’i güncelle” ile yeni sürümler B1.P2 ve B1.P3’e gider. B0’daki eski sürümler geçersizleşir. İki adım sonunda host=2, fiziksel yazma=2, silme=0’dır; FTL L0/L1’i yeni konumlara yöneltir.",
        "“Canlı veriyi taşı” GC adımıdır. B0’da kalan geçerli L2:v0 ve L3:v0, ayrılmış B2.P0/P1’e kopyalanır. Eşleme güncellenir ve eski fiziksel kopyalar geçersizleştirilir. Host=2 kalırken fiziksel yazma=4 olur. Bu kopyaları host yazması diye saymayın.",
        "“B0’ı sil”e basın. Model, B0’a işaret eden canlı eşleme kalmadan silmeye izin vermez. Dört sayfa birlikte boşalır, silme=1 olur. B0 yeni GC rezervidir; B2’nin kalan boş sayfaları normal yazmaya açılır.",
        "“L2’yi güncelle” ile L2:v1, B2.P2’ye yazılır ve az önce kopyalanan L2:v0 geçersizleşir. Sonuç host=3, fiziksel yazma=5, silme=1; yazma büyütmesi 5/3 ≈ 1,67’dir. Sıfırla başlangıçtaki eşleme, rezerv ve bütün sayaçları geri getirir.",
      ],
      keyPoints: [
        "Flash sayfa düzeyinde programlanır; yeniden kullanım için silme daha büyük blok düzeyindedir. Bu nedenle bir mantıksal güncelleme yeni fiziksel yere gidebilir ve eski yer yalnızca geçersiz olarak işaretlenir.",
        "Garbage collection canlı veriyi koruyup alan geri kazanır; bu sırada host’un doğrudan istemediği ek fiziksel yazmalar oluşabilir. Yazma büyütmesi fiziksel sayfa yazması / host sayfa yazmasıdır; silme ayrı sayılır.",
        "FTL eşlemesi OS mantıksal adreslerini aygıt içi yerleşimden ayırır. GC, wear leveling ve ayrılmış alan birbiriyle ilişkili fakat farklı yönetim işleridir. Buradaki seçilmiş kurban blok tek örnek politikadır.",
      ],
      limits:
        "3×4 sayfa gerçek NAND geometrisi değildir. Sıfır host yazmasında oran tanımsızdır ve “—” gösterilir. 1,67 bütün SSD’ler için sabit değildir. Zaman, gerçek kanal paralelliği, program/erase ömrü, marka performansı veya OS zamanlayıcı kıyaslaması hesaplanmaz. Eşleme güncellemesinin güç kaybına dayanıklı kaydı ayrıca modellenmez.",
      question: {
        prompt:
          "GC, host yazması olmadan fiziksel yazma sayısını artırabilir mi?",
        answer:
          "Evet. L2 ve L3’ün canlı kopyaları iki fiziksel yazma ekledi; o adımda host sayacı artmadı.",
      },
      transition:
        "Fiziksel hareket kalktı; ama kuyruk, eşleme, aşınma ve alan yönetimi kaldı. Son kez bu ayrımı kontrol edelim.",
    },
  },
  {
    id: "s17",
    title: "Hareket yoksa yönetim de mi yok?",
    shortTitle: "NVM özeti",
    chapter: "11.3",
    presenterId: 2,
    render: ({ enabled, goTo }) => (
      <NvmCheckpoint enabled={enabled} goTo={goTo} />
    ),
    notes: {
      represents:
        "Başlangıç sorusu, sıfır mekanik seek maliyetinin sıfır yönetim işi olup olmadığını sorgular. Bir cevap seçilince aynı dört blok/kanal üzerinden paralellik, wear leveling, TRIM ve ayrılmış alan ayrı görünümlerle açılır. Bunlar S16’daki hesap modelinin devamı değil, dört ayrı kavramsal büyüteçtir; blok sayıları bir cihazın gerçek yapılandırması değildir.",
      learningGoal:
        "NVM için OS zamanlaması ile denetleyici içi flash yönetimini ayırabilmek; TRIM’i silme garantisi, wear leveling’i aşınmayı geri çevirme veya over-provisioning’i host’un dosya sistemi boşluğuyla eş anlamlı sanmamak.",
      walkthrough: [
        "“Seek = 0. İş = 0?” sorusunda “Hayır” beklenir. Her iki seçim de açıklamayı açar; “Evet” seçildiyse mekanik hareket kalkarken kuyruk ve flash maliyetlerinin sürdüğünü düzeltin. Sıfırla soruyu yeniden gizler.",
        "Paralellik görünümünde dört kanalın ayrı iş yapabilme fikrini hatırlatın. Konum yakınlığı yerine kuyruk maliyeti, gecikme hedefi ve aygıtın paralelliğini kullanabilme önem kazanır; OS’nin seçtiği sıra ile denetleyicinin fiziksel yerleşimi aynı şey değildir.",
        "Wear leveling’i açın. Sayılar temsili birikmiş aşınma sayaçlarıdır. “Yeni yükü dağıt” düşük sayaçlı blokların ilerleyen yazma/silme yükünü almasını gösterir. Eski yüksek sayaç azalmaz; aşınma geri alınmaz. “Sıfırla” yalnızca bu öğretim çizimini başlangıca getirir. Gerçek dinamik/statik wear leveling algoritması çalıştırılmaz.",
        "TRIM görünümünde L2’nin artık gerekmediğini bildirin. Çarpı, gereksizlik/geçersizlik bilgisidir; blokların içi bir anda boşalmadığı için fiziksel silmeyle aynı eylem olmadığı görünür. TRIM/discard, güvenli veri imhası veya hemen silme garantisi değildir.",
        "Ayrılmış alan görünümündeki kesikli GC bloğunu gösterin. Over-provisioning, denetleyicinin GC, yazma ve aşınma yönetimi için kullanabildiği host’a doğrudan sunulmayan ek alan fikridir. Son ok ile S18’e geçin.",
      ],
      keyPoints: [
        "OS: istek gönderme, birleştirme, öncelik, adalet ve gecikme hedefleri. Aygıt kuyrukları: komut/tamamlama iletişimi. SSD denetleyicisi: FTL, GC, wear leveling ve fiziksel flash yönetimi.",
        "Flash aşınmasının dengelenmesi dayanıklılık yönetimidir; mekanik seek’in yerine eklenen bir kafa hareketi algoritması değildir. Aşınma sayaçlarının dağıtılması sınırsız aygıt ömrü anlamına gelmez.",
        "NVM geniş bir sınıftır; bu bölümdeki sayfa/blok, GC ve TRIM anlatımı flash tabanlı SSD örneğine aittir. “Bütün SSD’ler daima FCFS kullanır” veya “SSD’de zamanlama gereksizdir” genellemesi yapılmaz.",
      ],
      limits:
        "Görünümler kavramsal açıklamadır; dört kanalın performansı, wear leveling verimliliği, TRIM yürütme zamanı, dayanıklılık ömrü veya gerçek ayrılmış kapasite oranı ölçülmez. Sayılar ürün verisi değildir. Görsel sıfırlama cihaz aşınmasının geriye alınabildiği anlamına gelmez.",
      question: {
        prompt:
          "SSD’de seek yoksa OS ve denetleyicinin yöneteceği maliyet kalmaz mı?",
        answer:
          "Kalır: yazılım/kuyruk yükü, paralellik, gecikme ve adalet hedefleri; flash tarafında eşleme, ek yazma, GC, silme ve aşınma işleri sürer.",
      },
      transition:
        "İstekleri verimli işledik. Şimdi bu isteklerin doğru veriyi okuduğundan ve aygıtın kullanılabilir biçimde yönetildiğinden nasıl emin olduğumuza bakalım.",
    },
  },
];
