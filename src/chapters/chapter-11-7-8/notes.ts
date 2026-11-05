import type { SceneNotes } from "../../presentation/types";

export const attachmentRaidNotes: Record<string, SceneNotes> = {
  "storage-attachment": {
    explanation:
      "Storage Attachment, depolamanın bilgisayara nasıl bağlandığını ele alır. Kitap üç temel erişim yaklaşımı tanıtır: host-attached, network-attached ve cloud. Yerel bağlantıda host’un I/O portu kullanılır. Ağ bağlantısında uzaktaki depolamaya erişilir. Bulut örneğinde program Internet veya WAN üzerinden bir hizmetin API’sini kullanır. SAN, bu üçlü girişin ardından depolama dizileriyle birlikte ele alınır.",
  },
  "host-attached": {
    explanation:
      "Host-attached depolamaya bilgisayarın yerel I/O portundan erişilir. Bir depolama bus’ı birden çok aygıtı bağlayabilir. Kitap USB, FireWire ve Thunderbolt’u bus örnekleri olarak verir. Üst düzey sistemlerde Fibre Channel da kullanılır. Şema, yerel porttan tek aygıta erişimi ve aynı bus üzerinden birden çok aygıtın bağlanmasını gösterir.",
  },
  nas: {
    explanation:
      "NAS, ağ üzerinden uzak bir dosya sistemine erişim sağlar. NFS ve CIFS yaygın dosya protokolleridir. Dosya işlemleri, genellikle IP üzerinde TCP veya UDP ile taşınan uzak çağrılarla gerçekleştirilir. NAS sunucusu dosya sistemini yönetir ve dosya işlemlerini kendi aygıtındaki blok işlemlerine dönüştürür. Aynı IP ağı üzerinde çalışan iSCSI ise SCSI komutlarıyla uzak aygıtlara blok erişimi sağlar.",
  },
  "cloud-storage": {
    explanation:
      "Bulut depolama örneğinde program uzak veri merkezindeki hizmete API üzerinden ulaşır. İstek ağdan geçer ve hizmet tarafından depolama işlemlerine dönüştürülür. Ağ gecikmesi ve bağlantı başarısızlığı erişimin tasarımında dikkate alınır.",
  },
  "storage-arrays": {
    explanation:
      "Host’a tek disk veya bir depolama dizisi bağlanabilir. Dizide host portları, denetleyici, bellek, yönetim yazılımı ve birden çok disk bulunur. Bu kaynaklardan birden çok host yararlanabilir. Buradaki amaç dizinin bileşenlerini tanımaktır. Dizinin RAID ve diğer koruma hizmetleri sonraki bölümün konusudur.",
  },
  san: {
    explanation:
      "SAN, büyük depolama ortamlarında birden çok host ile depolama dizisini bağlar. Host’lar ve diziler Fibre Channel switch’lerine veya InfiniBand ağına bağlanabilir. LUN masking ile belirli dizilerdeki mantıksal birimler belirli host’lara sunulur. Örnekte Host A yalnız LUN A’yı, Host B yalnız LUN B’yi görür. Çizgiler fiziksel bağlantıları, vurgular seçili erişimi gösterir. Kitap depolama ağı ile iletişim ağının ayrılmasını sorgular ve iSCSI ile FCoE örneklerini verir.",
  },
  "nas-san-comparison": {
    explanation:
      "NAS istemciye dosya ve dizin işlemleri sunar. Dosya sistemini NAS sunucusu yönetir. SAN ise host’lara depolama bloklarını ulaştırır, bu blokları kullanan dosya sistemi host tarafındadır. Bu konum ayrımı, kitaptaki dosya hizmeti ve blok erişiminin tipik sorumluluklarını gösterir. NAS’ın kaynak örnekleri IP üzerinde NFS ve CIFS, SAN’ın kaynak örnekleri Fibre Channel ve InfiniBand’dir. iSCSI, blok erişiminin de IP üzerinden taşınabileceğini gösterir. Bu nedenle ağın kullanılması tek başına dosya erişimi anlamına gelmez.",
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
