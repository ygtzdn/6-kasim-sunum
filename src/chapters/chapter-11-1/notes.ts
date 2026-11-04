import type { SceneNotes } from "../../presentation/types";
import curriculum from "./curriculum.json";

export const hardwareCaptions: Record<string, string[]> = {
  "hdd-anatomy": [
    "Manyetik yüzeydeki veriye mekanik hareketle ulaşılır.",
    "1: manyetik plaka. 2: plakayı döndüren mil. Verinin tutulması ve hareketin üretilmesi farklı görevlerdir.",
    "3: kol. 4: park alanındaki kafa ucu. Kol, okuma/yazma kafasını hedef yarıçapa götürür.",
    "Kolun konumlanması ve sektörün kafa altına dönmesi ayrı işlerdir.",
    "Fotoğraftaki kafa park alanındadır. Yan kesit şemasında normal okuma yüzeye temas etmez; temas head crash riskidir.",
  ],
  "hdd-geometry": [
    "Şema bir disk yüzeyini temsil eder; gerçek aygıtın birebir geometrisi değildir.",
    "İz, yüzeydeki dairesel kayıt yoludur.",
    "Sektör, bir izin parçasıdır; izin bütünü değildir.",
    "Silindir, farklı yüzeylerde aynı yarıçaptaki izlerin geometrik grubudur.",
  ],
  "hdd-access-cost": [
    "4 KiB = 4096 B. 1 Gb/s = 125 MB/s. Kuyruk beklemesi bu servis hesabının dışındadır.",
    "Seek: kafa hedef ize gelir. Örnekte 5 ms.",
    "7200 RPM → bir tur 8,3333 ms → ortalama dönme beklemesi 4,1667 ms.",
    "Konumlandırma = seek + ortalama dönme = 9,1667 ms.",
    "Aktarım = 4096 B / 125.000.000 B/s = 0,032768 ms.",
    "Denetleyici 0,1 ms de eklenir: örnek servis süresi 9,30 ms. Uygulamanın toplam gecikmesi değildir.",
  ],
  "hdd-request-size": [
    "4 KiB için aktarım çok küçük; konumlandırma toplamda baskındır.",
    "1 MiB daha fazla aktarım işi getirir. Seek, dönme ve denetleyici aynı kaldı.",
    "Hız 125’ten 250 MB/s’ye çıktı: yalnız aktarım süreleri yarıya indi.",
    "Küçük I/O’nun toplamı yarıya inmedi. Mekanik pay, daha hızlı aktarımın kazancını sınırlar.",
  ],
  "hdd-history": [
    "1956: kitabın tarihsel örneği IBM Model 350.",
    "50 adet 24 inç plaka; 5 milyon 7-bit karakter. Modern MB birimine sessizce çevirmiyoruz.",
    "Erişim bir saniyenin altındaydı. Bu sayılar bugünün ürün özellikleri değildir.",
  ],
  "hdd-performance-metrics": [
    "6 Gb/s: kaynaktaki tarihsel teorik arayüz örneği. Tek I/O’nun gecikmesi değildir.",
    "1 Gb/s: kaynaktaki etkin aktarım örneği. Arayüz tavanıyla aynı değer değildir.",
    "9,30 ms: bir önceki açık birimli tek I/O hesabı. Hız ile süre farklı birimlerdir.",
    "Disk bandwidth’i: toplam aktarılan byte / ilk isteğin başlangıcından son tamamlanmaya kadar geçen süre.",
  ],
  "nvm-device": [
    "Flash tabanlı SSD, veriyi güç kesildiğinde de tutan bir NVM aygıtıdır.",
    "1: denetleyici istekleri yönetir. 2: NAND flash veriyi tutar. 3: bu aygıtın SATA güç/veri bağlantısı.",
    "SSD’de seek ve dönme yoktur. Aktarım, yazılım ve flash yönetimi işi devam eder.",
    "SSD, USB flash ve gömülü aygıtlar NVM ailesinin farklı örnekleridir; hepsi aynı ürün değildir.",
  ],
  "flash-page-block": [
    "Küçük kutular sayfa, büyük çerçeveler silme bloğudur. Geometri eğitim ölçeğidir.",
    "P0’daki L0 okunuyor. Okuma, sayfanın içeriğini değiştirmez.",
    "L0’ın yeni sürümü boş P6’ya yazıldı; eski P0 geçersiz oldu, fakat silinmedi.",
    "A’da canlı veri kalmadı; dört sayfa birlikte silindi. B’deki canlı veriler korunur.",
    "P6 geçerli, P5 geçersiz, P0 silinmiş. Geçersiz veri ile yeniden yazılabilir boş sayfa aynı değildir.",
  ],
  "flash-endurance": [
    "Yeniden kullanılabilir alan kazanmak, birikmiş aşınmayı geri almaz. Silme ömrü sınırlıdır.",
    "Resmî slaydın örneği: 1 TB aygıt, 5 DWPD derecesi.",
    "1 TB × 5 = 5 TB/gün. Bu bir yazma hacmi derecelendirmesidir, hücre silme sayısı değildir.",
    "3 TB/gün örnek bütçenin altında; 6 TB/gün üzerinde. Bu karşılaştırma kesin bir arıza günü tahmini değildir.",
  ],
  "ram-disk": [
    "RAM, blok aygıtı gibi sunulup dosya sistemiyle kullanılabilir; uçuculuğu değişmez.",
    "Örnek dosya RAM diske yazıldı. Dosya sistemi arayüzü kalıcılık sağlamaz.",
    "Güç kesildi: RAM içeriği kayboldu. HDD ve flash SSD’deki kayıt korunur.",
    "Güç geri geldi: eski RAM verisi kendiliğinden dönmez. Uçuculuk ve mekanik hareket ayrı özelliklerdir.",
  ],
  "magnetic-tape": [
    "Manyetik teyp, kayıtların sıralı veri akışıyla işlendiği kalıcı bir ortamdır.",
    "Uzak bir kaydı seçmek için önce konum bulunur; konum bulma işi vardır.",
    "Konum bulunduğunda ardışık kayıtlar aktarılır. Arşiv ve yedekleme bu erişim biçiminin bağlamıdır.",
  ],
  "logical-blocks": [
    "OS, diski tek boyutlu numaralı mantıksal blok dizisi olarak adresler.",
    "İstek LBA 3’ü seçti; bu sayı bir fiziksel yüzey resmi değildir.",
    "Kitabın temel modeli blokları sektörlere sıralı eşler. Buradaki geometri küçük bir eğitim modelidir.",
    "Fiziksel ayrıntı gizlenebilir; LBA 3 isteği korunur. Bozuk sektör ve geometri ayrıntıları eşlemeyi karmaşıklaştırabilir.",
  ],
  "storage-data-path": [
    "OS, bir LBA okuma isteğini ve verinin yerleştirileceği DRAM alanını belirler.",
    "Komut, bilgisayar tarafındaki host denetleyicisine iletilir.",
    "Host denetleyicisi aygıt denetleyicisine mesaj gönderir.",
    "Aygıt veriye erişir. Komutun gelmesi, verinin DRAM’e taşındığı anlamına gelmez.",
    "DMA ile veri aygıttan DRAM’e aktarılır. Kontrol yolu ile veri yolu ayrı akışlardır.",
  ],
};
const questions: Record<string, { prompt: string; answer: string }> = {
  "hdd-anatomy": {
    prompt:
      "Disk dönerken hedef iz kafanın altında değilse yalnız dönüşü beklemek yeter mi?",
    answer: "Hayır; kafa hedef yarıçapa da konumlanmalıdır.",
  },
  "hdd-geometry": {
    prompt: "Bir sektör bütün bir silindir midir?",
    answer:
      "Hayır; sektör bir iz parçası, silindir aynı yarıçaptaki izler grubudur.",
  },
  "hdd-access-cost": {
    prompt: "9,1667 ms ile 9,30 ms neden farklı adlandırılıyor?",
    answer:
      "İlki konumlandırma, ikincisi aktarım ve denetleyici dahil örnek servis süresidir.",
  },
  "hdd-request-size": {
    prompt: "Aktarım iki kat hızlanınca küçük I/O toplamı yarıya iner mi?",
    answer: "Hayır; seek, dönme ve denetleyici terimleri aynı kalır.",
  },
  "hdd-history": {
    prompt: "Bu sayılar bugün satılan HDD özellikleri midir?",
    answer: "Hayır; 1956 IBM Model 350’nin kitaptaki tarihsel örneğidir.",
  },
  "hdd-performance-metrics": {
    prompt:
      "6 Gb/s arayüz her küçük okumanın o hızla tamamlandığını mı söyler?",
    answer:
      "Hayır; arayüz tavanı, etkin aktarım ve tek I/O gecikmesi farklı ölçülerdir.",
  },
  "nvm-device": {
    prompt: "Elektronik olan her bellek uçucu mudur?",
    answer: "Hayır; flash SSD kalıcıdır, RAM uçucudur.",
  },
  "flash-page-block": {
    prompt: "Geçersiz sayfa doğrudan yeniden yazılabilir mi?",
    answer: "Hayır; daha büyük blok silme kuralı sürer.",
  },
  "flash-endurance": {
    prompt: "5 DWPD, her hücrenin günde 5 kez silinmesi midir?",
    answer: "Hayır; kapasiteye göre günlük yazma hacmi derecelendirmesidir.",
  },
  "ram-disk": {
    prompt: "Dosya sistemi RAM diski kalıcı yapar mı?",
    answer: "Hayır; yazılım arayüzü fiziksel uçuculuğu değiştirmez.",
  },
  "magnetic-tape": {
    prompt: "Kayıt konumunu bulmak ve ardından aktarmak aynı iş midir?",
    answer: "Hayır; konum bulma ve ardışık aktarım ayrı işlerdir.",
  },
  "logical-blocks": {
    prompt: "LBA her diskte aynı fiziksel koordinatı garanti eder mi?",
    answer: "Hayır; aygıt eşlemesi ve fiziksel istisnalar vardır.",
  },
  "storage-data-path": {
    prompt: "Komut ve verinin DRAM’e aktarılması aynı ok mudur?",
    answer: "Hayır; controller komut yolu ile DMA veri aktarımı ayrıdır.",
  },
};
const transitions: Record<string, string> = {
  "hdd-anatomy": "Hedef konumu iz, sektör ve silindir olarak adlandıralım.",
  "hdd-geometry": "Bu konuma ulaşmanın süresini parçalara ayıralım.",
  "hdd-access-cost":
    "Yalnız veri miktarı veya hız değişirse hangi terim değişir?",
  "hdd-request-size":
    "Şimdi mekanik beklemeyi taşımayan aygıta geçelim; tam rotadaki tarih ve ölçüt ekleri isteğe bağlıdır.",
  "hdd-history": "Ölçek kadar kullandığımız performans ölçüsü de önemli.",
  "hdd-performance-metrics":
    "NVM mekanik gecikmeyi kaldırsa da bağlantı ve yazılım yolu sürer.",
  "nvm-device": "Hareket yok, fakat yazma ve silmenin fiziksel kuralları var.",
  "flash-page-block":
    "Kalıcı flash ile RAM diskin uçuculuğunu ayıralım; DWPD eki dayanıklılık ölçüsünü açar.",
  "flash-endurance":
    "Kalıcı ortamın sınırlarını gördük; uçucu depolamayı ayıralım.",
  "ram-disk": "Başka bir kalıcı ortamın, teybin erişim şekli farklıdır.",
  "magnetic-tape":
    "Ortamlar farklı; OS disk aygıtını ortak bir adres görünümüyle kullanır.",
  "logical-blocks":
    "Bu adresli komut aygıta nasıl gider; veri RAM’e nasıl gelir?",
  "storage-data-path":
    "OS aygıtı mantıksal bloklarla adresliyor. Aygıt HDD ise istek sırası fiziksel hareketi değiştiriyor. Şimdi aynı kuyruğu farklı sıralarla karşılamak için sözü ikinci sunucuya bırakıyorum.",
};
export const introNotes: Record<string, SceneNotes> = Object.fromEntries(
  curriculum.map((scene) => [
    scene.id,
    {
      represents: `${scene.model} Görünüm, ${scene.stages.join(" → ")} sırasını izler. Her aşama seçildiğinde ilgili fiziksel veya mantıksal durum yeniden kurulur.`,
      learningGoal: scene.takeaway,
      walkthrough: scene.stages.map(
        (name, index) =>
          `${index + 1}. aşama — ${name}: ${hardwareCaptions[scene.id][index]}`,
      ),
      keyPoints: [
        scene.takeaway,
        scene.model,
        `Kaynak: Operating System Concepts, Tenth Edition, ${scene.sections.join(" / ")}; resmî slaytlar ${scene.slides.join(", ")}.`,
      ],
      limits:
        scene.id === "hdd-access-cost"
          ? "4 KB / 1 Gb/s gösterimindeki birim ve yuvarlama belirsizliği açık KiB ve ondalık MB/s ile çözülür. 9,30 ms bu birim yorumunun hesabıdır; kaynakta görünen9,301 birebir kesin sonuç diye aktarılmaz. Kuyruk dışarıdadır."
          : `${scene.model} Animasyon gerçek aygıt hızı değildir; küçük şekiller gerçek geometri veya ürün özelliği değildir. Tam kitap metni yerel depoda bulunmaz.`,
      question: questions[scene.id],
      transition: transitions[scene.id],
    },
  ]),
);
