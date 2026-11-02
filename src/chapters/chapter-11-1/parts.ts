export const hddParts = [
  {
    id: "platters",
    name: "Plakalar",
    detail:
      "Manyetik kaplamalı disk yüzeyleri veriyi tutar. Aynı mil üzerindeki plakalar birlikte döner. Model iki plaka gösterir; gerçek aygıttaki plaka ve yüzey sayısı değişebilir.",
  },
  {
    id: "tracks",
    name: "İz ve sektör",
    detail:
      "İz, yüzeydeki eş merkezli kayıt yoludur; sektör bunun veri taşıyan parçasıdır. Aynı yarıçaptaki farklı yüzey izleri silindir kavramını oluşturur. Mavi halka ile renkli dilim fiziksel biçimin kavramsal gösterimidir; gerçek diskte gözle görülen boyalı çizgiler değildir.",
  },
  {
    id: "spindle",
    name: "Mil ve motor",
    detail:
      "Mil, plakaları aynı eksen üzerinde taşır. Alttaki motor dönüş hızını korur. RPM tam tur süresini, hedef sektörün kafa altına gelmesi ise dönme gecikmesini belirler.",
  },
  {
    id: "heads",
    name: "Okuma / yazma kafası",
    detail:
      "Her kullanılan yüzeye karşılık gelen kafa, yüzeye çok yakın konumdan manyetik bilgiyi okur veya yazar. Normal çalışmada plakaya temas etmez. Başlıklar ve aralarındaki boşluk modelde seçilebilir olsun diye büyütülmüştür.",
  },
  {
    id: "actuator",
    name: "Aktüatör kolu",
    detail:
      "Kol grubu, kafaları istenen yarıçapa birlikte götürür. Bunun süresi seek time olarak adlandırılır. İstenen izin bulunması, sektörün aynı anda kafa altında olduğu anlamına gelmez; dönme beklemesi ayrıca sürer.",
  },
  {
    id: "coil",
    name: "Bobin ve mıknatıs",
    detail:
      "Voice-coil aktüatöründe bobindeki akım ile sabit mıknatısın alanı etkileşir ve kolu döndürür. Modelde bakır renkli bobin ve koyu renkli mıknatıslar gösterilir. Kol hareketi temsilidir; bir gerçek aygıtın kontrol döngüsü simüle edilmez.",
  },
  {
    id: "pcb",
    name: "Denetleyici kartı",
    detail:
      "Alttaki PCB üzerinde denetleyici, bellek ve motor/sinyal sürücüleri bulunur. Hosttan gelen mantıksal blok istekleri aygıtın iç işlemlerine dönüştürülür. İşletim sistemi fiziksel kafaya doğrudan ekran koordinatı vermez.",
  },
  {
    id: "connector",
    name: "Veri ve güç bağlantısı",
    detail:
      "Bu kavramsal model ayrı veri ve güç bağlantısını temsil eder. SATA biçimi modern HDD için seçilmiştir. Hazır söküm videosundaki aygıt daha eski SCSI arayüzlüdür; iki aygıtın bağlantı düzeni aynı değildir.",
  },
  {
    id: "housing",
    name: "Gövde ve kapak",
    detail:
      "Gövde parçaları sabitler ve hassas mekanizmayı dış etkilerden korur. Katman görünümü kapağı ve kartı ayırarak iç düzeni açıklar. Aygıtı fiziksel olarak açmak normal kullanım veya bakım talimatı değildir.",
  },
] as const;
export type HddPartId = (typeof hddParts)[number]["id"];
