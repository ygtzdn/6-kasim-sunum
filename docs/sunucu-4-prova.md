# 4. kişi — Sayfa açıklamaları

5 Kasım 2026. Güncel sayfaların konu açıklamaları. Kitap ve model kaynakları sunumdaki Kaynaklar sekmesindedir.

## Storage Attachment

11.7

Storage Attachment, depolamanın bilgisayara nasıl bağlandığını ele alır. Kitap üç temel erişim yaklaşımı tanıtır: host-attached, network-attached ve cloud. Yerel bağlantıda host’un I/O portu kullanılır. Ağ bağlantısında uzaktaki depolamaya erişilir. Bulut örneğinde program Internet veya WAN üzerinden bir hizmetin API’sini kullanır. SAN, bu üçlü girişin ardından depolama dizileriyle birlikte ele alınır.

## Host-attached: yerel I/O bağlantısı

11.7

Host-attached depolamaya bilgisayarın yerel I/O portundan erişilir. Bir depolama bus’ı birden çok aygıtı bağlayabilir. Kitap USB, FireWire ve Thunderbolt’u bus örnekleri olarak verir. Üst düzey sistemlerde Fibre Channel da kullanılır. Şema, yerel porttan tek aygıta erişimi ve aynı bus üzerinden birden çok aygıtın bağlanmasını gösterir.

## Network-attached: ağdan depolamaya

11.7

NAS, ağ üzerinden uzak bir dosya sistemine erişim sağlar. NFS ve CIFS yaygın dosya protokolleridir. Dosya işlemleri, genellikle IP üzerinde TCP veya UDP ile taşınan uzak çağrılarla gerçekleştirilir. NAS sunucusu dosya sistemini yönetir ve dosya işlemlerini kendi aygıtındaki blok işlemlerine dönüştürür. Aynı IP ağı üzerinde çalışan iSCSI ise SCSI komutlarıyla uzak aygıtlara blok erişimi sağlar.

## Cloud: Internet üzerinden API erişimi

11.7

Bulut depolama örneğinde program uzak veri merkezindeki hizmete API üzerinden ulaşır. İstek ağdan geçer ve hizmet tarafından depolama işlemlerine dönüştürülür. Ağ gecikmesi ve bağlantı başarısızlığı erişimin tasarımında dikkate alınır.

## Depolama dizisi: denetleyici ve diskler

11.7

Host’a tek disk veya bir depolama dizisi bağlanabilir. Dizide host portları, denetleyici, bellek, yönetim yazılımı ve birden çok disk bulunur. Bu kaynaklardan birden çok host yararlanabilir. Buradaki amaç dizinin bileşenlerini tanımaktır. Dizinin RAID ve diğer koruma hizmetleri sonraki bölümün konusudur.

## Storage Area Network (SAN)

11.7

SAN, büyük depolama ortamlarında birden çok host ile depolama dizisini bağlar. Host’lar ve diziler Fibre Channel switch’lerine veya InfiniBand ağına bağlanabilir. LUN masking ile belirli dizilerdeki mantıksal birimler belirli host’lara sunulur. Örnekte Host A yalnız LUN A’yı, Host B yalnız LUN B’yi görür. Çizgiler fiziksel bağlantıları, vurgular seçili erişimi gösterir. Kitap depolama ağı ile iletişim ağının ayrılmasını sorgular ve iSCSI ile FCoE örneklerini verir.

## NAS ve SAN

11.7

NAS istemciye dosya ve dizin işlemleri sunar. Dosya sistemini NAS sunucusu yönetir. SAN ise host’lara depolama bloklarını ulaştırır, bu blokları kullanan dosya sistemi host tarafındadır. Bu konum ayrımı, kitaptaki dosya hizmeti ve blok erişiminin tipik sorumluluklarını gösterir. NAS’ın kaynak örnekleri IP üzerinde NFS ve CIFS, SAN’ın kaynak örnekleri Fibre Channel ve InfiniBand’dir. iSCSI, blok erişiminin de IP üzerinden taşınabileceğini gösterir. Bu nedenle ağın kullanılması tek başına dosya erişimi anlamına gelmez.

## Yedeklilik ve onarım penceresi

11.8

RAID, birden çok diski belirli bir veri dağıtımı ve koruma düzeninde kullanır. Yedeklilik bazı disk arızalarında hizmetin sürmesini sağlar. Onarım tamamlanana kadar dizi ek arızalara karşı daha savunmasız olabilir. Güvenilirlik, koruma düzeni ve onarım süresiyle birlikte değerlendirilir.

## Veriyi dağıtmak mı, kopyalamak mı?

11.8

Şeritleme veriyi disklere dağıtır, aynalama aynı içeriğin kopyalarını tutar. Şeritleme tek başına disk kaybına karşı yedek veri oluşturmaz. Aynalama sağlam kopya karşılığında ek fiziksel alan kullanır.

## Koruma bilgisini nereye koyarız?

11.8

RAID 4 pariteyi ayrı diskte, RAID 5 diskler arasında dağıtarak saklar. Tek parite bilgisi bir kayıp bloğun yeniden üretilmesini sağlayabilir. RAID 6 ikinci bağımsız koruma bilgisi ekleyerek iki tam disk kaybına dayanabilir. Koruma düzeni, hangi arızaların karşılanabileceğini belirler.

## Önce ayna mı, önce şerit mi?

11.8

RAID 0+1 ve RAID 1+0, şeritleme ile aynalamayı farklı sırayla birleştirir. Bu sıra, bir disk kaybının hangi koruma grubunu etkilediğini değiştirir. İkinci arızanın sonucu, yalnız arıza sayısına değil kaybedilen disklerin gruplarına da bağlıdır.

## Boş yedek nasıl sağlam kopya olur?

11.8

Yedek disk devreye girdiğinde eksik içerik sağlam veri ve koruma bilgisinden yeniden oluşturulur. Kopyalama sürerken tam yedeklilik henüz geri gelmemiştir. Rebuild yeterli sağlam bilgi gerektirir. İşlem tamamlandığında koruma düzeni yeniden kurulur.

## Snapshot, replication ve hot spare

11.8

Snapshot verinin belirli bir andaki görünümünü tutar. Replication veriyi başka bir sisteme kopyalar. Hot spare arızalı aygıtın yerini almak için hazır bekler. Bu hizmetlerin amaçları ve koruduğu durumlar farklıdır.

## Disk çalışırken veri bozulabilir

11.8

Disk çalışmaya devam ederken de veri bozulabilir. RAID’in disk kaybına karşı yedekliliği, bütün veri bozulmalarını tek başına saptamaz. Kaynaktaki ZFS örneğinde veri ve metadata checksum ile denetlenir. Uygun sağlam kopya varsa bozuk içerik onarılabilir.

## Sabit sınırlar mı, ortak alan mı?

11.8

Havuz yaklaşımında birden çok dosya sistemi ortak fiziksel depolamadan alan kullanabilir. Bir dosya sisteminin bıraktığı alan başka kullanım için ayrılabilir. Yönetim sınırları esnekleşir, toplam fiziksel kapasite ise sınırlı kalır.

## Nesneyi kimliğiyle bulmak

11.8

Nesne depolamada program, veriye nesne kimliği üzerinden ulaşır. Yerleştirme ve koruma düzenini depolama yönetim yazılımı üstlenebilir. Nesne içeriği ve metadata birlikte yönetilir. Nesne kimliği doğrudan fiziksel disk koordinatı değildir.

## Bütün bölüm, tek istek

Ortak kapanış

Bir dosya isteği uygulamadan işletim sisteminin I/O kuyruğuna, bağlantı üzerinden aygıta ulaşır. Varsa RAID veri yerleşimi ve koruma düzenini uygular. Aygıtın yapısı erişim maliyetini etkiler. Bütünlük denetimleri verinin doğruluğunu ayrıca değerlendirir.

## Alıştırma 11.13 · NVM ve FCFS

Kapanış · Exercises

Mekanik seek ve dönme olmadığından silindir sırasıyla kafa hareketini azaltma kazancı yoktur. FCFS basit ve düşük ek yüklüdür. Kuyruk, paralellik ve flash yönetimi işleri yine sürer.

## Alıştırma 11.14 · 5000 silindirli disk

Kapanış · Exercises

Sonuçlar: FCFS 13011, SCAN 7492, C-SCAN 9917 silindir. Yön artandır: 1805'ten 2150'ye gelindi. SCAN fiziksel 4999 ucuna gider. C-SCAN'ın 4999'dan 0'a dönüşü de hareket toplamına eklenir. Son bekleyen istek servis edildiğinde ölçüm biter.

## Alıştırma 11.16(a) · Ortalama dönme beklemesi

Kapanış · Exercises

Bir tur 60000 / 7200 = 8,3333 ms sürer. Sektörün açısal konumu için eşit olasılık varsayımıyla ortalama bekleme yarım turdur: 4,1667 ms. Seek ve aktarım bu hesaba dahil değildir.

## Alıştırma 11.17 · HDD ve NVM karşılaştırması

Kapanış · Exercises

HDD'de seek ve dönme maliyeti vardır; büyük sıralı aktarımlar bu maliyetin payını azaltabilir. NVM mekanik beklemeyi kaldırır; küçük rastgele I/O ve düşük gecikme gereksinimi için bu önemlidir. Sonuç iş yüküne ve aygıta bağlıdır.

## Alıştırma 11.21(a) · RAID 5'te tek blok yazma

Kapanış · Exercises

Eski veri ve eski parite okunur; yeni veri ve yeni parite yazılır. Toplam 2 okuma + 2 yazma = 4 blok I/O yapılır. İki farklı blok konumuna erişilir; erişim sayısı ile benzersiz blok sayısı aynı değildir.

## Alıştırma 11.25(a,c) · MTBF ve garanti

Kapanış · Exercises

Bağımsız ve sabit arıza hızı varsayımıyla toplam arıza hızı 1000 / 750000'dir. Ortalama aralık 750 saat, yaklaşık 31,25 gündür. MTBF'den tek diskin ömrü veya garanti süresi çıkarılamaz.

## Doğru tasarım için dört soru

Ortak kapanış

Depolama tasarımında iş yükü, gecikme, hata modeli ve geri dönüş ihtiyacı birlikte belirlenir. Bir aygıtın tek hız veya kapasite değeri bütün tasarımı açıklamaz. Uygun seçim, hangi erişimlerin ve hangi arızaların karşılanması gerektiğine bağlıdır.
