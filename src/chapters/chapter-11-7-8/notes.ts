import type { SceneNotes } from "../../presentation/types";

export const attachmentRaidNotes: Record<string, SceneNotes> = {
  "host-attached": {
    explanation:
      "Host-attached depolama bilgisayarın yerel I/O bağlantıları üzerinden erişilir. Bağlantının fiziksel yolu ile üst katmana sunulan dosya veya blok arayüzü ayrı özelliklerdir. Yerel bir aygıt, işletim sistemine adreslenebilir bloklar sunabilir.",
  },
  nas: {
    explanation:
      "NAS, ağ üzerinden dosya sistemi hizmeti sunar. İstemci dosya ve dizin işlemleri gönderir, sunucu bunları kendi depolama işlemlerine dönüştürür. Aynı IP ağı üzerinde çalışan iSCSI ise blok erişimi taşıyabilir. Ağ kullanılması tek başına dosya hizmeti anlamına gelmez.",
  },
  "cloud-storage": {
    explanation:
      "Bulut depolama örneğinde program uzak veri merkezindeki hizmete API üzerinden ulaşır. İstek ağdan geçer ve hizmet tarafından depolama işlemlerine dönüştürülür. Ağ gecikmesi ve bağlantı başarısızlığı erişimin tasarımında dikkate alınır.",
  },
  "storage-arrays": {
    explanation:
      "Depolama dizisi host bağlantılarını, denetleyicileri ve birden çok aygıtı bir araya getirir. Host’a mantıksal depolama hacimleri sunabilir. RAID, snapshot ve replication bu yapı üzerinde sağlanabilen farklı hizmetlerdir.",
  },
  san: {
    explanation:
      "SAN, birden çok host ile depolama dizisini birbirine bağlayan depolama ağıdır. Diziler host’lara belirli mantıksal hacimleri sunar. Bir hacmin iki host tarafından görülebilmesi, dosya sistemi yazmalarının kendiliğinden koordine edildiği anlamına gelmez.",
  },
  "raid-intro": {
    explanation:
      "RAID, birden çok diski belirli bir veri dağıtımı ve koruma düzeninde kullanır. Yedeklilik bazı disk arızalarında hizmetin sürmesini sağlar. Onarım tamamlanana kadar dizi ek arızalara karşı daha savunmasız olabilir. Güvenilirlik, koruma düzeni ve onarım süresiyle birlikte değerlendirilir.",
  },
  "raid-striping": {
    explanation:
      "Şeritleme veriyi disklere dağıtır, aynalama aynı içeriğin kopyalarını tutar. Şeritleme tek başına disk kaybına karşı yedek veri oluşturmaz. Aynalama sağlam kopya karşılığında ek fiziksel alan kullanır.",
  },
  "raid-parity": {
    explanation:
      "RAID 4 pariteyi ayrı diskte, RAID 5 diskler arasında dağıtarak saklar. Tek parite bilgisi bir kayıp bloğun yeniden üretilmesini sağlayabilir. RAID 6 ikinci bağımsız koruma bilgisi ekleyerek iki tam disk kaybına dayanabilir. Koruma düzeni, hangi arızaların karşılanabileceğini belirler.",
  },
  "raid-nested": {
    explanation:
      "RAID 0+1 ve RAID 1+0, şeritleme ile aynalamayı farklı sırayla birleştirir. Bu sıra, bir disk kaybının hangi koruma grubunu etkilediğini değiştirir. İkinci arızanın sonucu, yalnız arıza sayısına değil kaybedilen disklerin gruplarına da bağlıdır.",
  },
  "raid-rebuild": {
    explanation:
      "Yedek disk devreye girdiğinde eksik içerik sağlam veri ve koruma bilgisinden yeniden oluşturulur. Kopyalama sürerken tam yedeklilik henüz geri gelmemiştir. Rebuild yeterli sağlam bilgi gerektirir. İşlem tamamlandığında koruma düzeni yeniden kurulur.",
  },
  "raid-features": {
    explanation:
      "Snapshot verinin belirli bir andaki görünümünü tutar. Replication veriyi başka bir sisteme kopyalar. Hot spare arızalı aygıtın yerini almak için hazır bekler. Bu hizmetlerin amaçları ve koruduğu durumlar farklıdır.",
  },
  "raid-integrity": {
    explanation:
      "Disk çalışmaya devam ederken de veri bozulabilir. RAID’in disk kaybına karşı yedekliliği, bütün veri bozulmalarını tek başına saptamaz. Kaynaktaki ZFS örneğinde veri ve metadata checksum ile denetlenir. Uygun sağlam kopya varsa bozuk içerik onarılabilir.",
  },
  "storage-pools": {
    explanation:
      "Havuz yaklaşımında birden çok dosya sistemi ortak fiziksel depolamadan alan kullanabilir. Bir dosya sisteminin bıraktığı alan başka kullanım için ayrılabilir. Yönetim sınırları esnekleşir, toplam fiziksel kapasite ise sınırlı kalır.",
  },
  "object-storage": {
    explanation:
      "Nesne depolamada program, veriye nesne kimliği üzerinden ulaşır. Yerleştirme ve koruma düzenini depolama yönetim yazılımı üstlenebilir. Nesne içeriği ve metadata birlikte yönetilir. Nesne kimliği doğrudan fiziksel disk koordinatı değildir.",
  },
  "io-journey": {
    explanation:
      "Bir dosya isteği uygulamadan işletim sisteminin I/O kuyruğuna, bağlantı üzerinden aygıta ulaşır. Varsa RAID veri yerleşimi ve koruma düzenini uygular. Aygıtın yapısı erişim maliyetini etkiler. Bütünlük denetimleri verinin doğruluğunu ayrıca değerlendirir.",
  },
  "storage-wrap-up": {
    explanation:
      "Depolama tasarımında iş yükü, gecikme, hata modeli ve geri dönüş ihtiyacı birlikte belirlenir. Bir aygıtın tek hız veya kapasite değeri bütün tasarımı açıklamaz. Uygun seçim, hangi erişimlerin ve hangi arızaların karşılanması gerektiğine bağlıdır.",
  },
};
