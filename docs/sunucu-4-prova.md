# 4. kişi — Sayfa açıklamaları

5 Kasım 2026. Güncel sayfaların konu açıklamaları. Kitap ve model kaynakları sunumdaki Kaynaklar sekmesindedir.

## Depolamaya hangi yoldan ulaşırız?

11.7

Host-attached depolama bilgisayarın yerel I/O bağlantıları üzerinden erişilir. Bağlantının fiziksel yolu ile üst katmana sunulan dosya veya blok arayüzü ayrı özelliklerdir. Yerel bir aygıt, işletim sistemine adreslenebilir bloklar sunabilir.

## Ağda dosya mı, blok mu?

11.7

NAS, ağ üzerinden dosya sistemi hizmeti sunar. İstemci dosya ve dizin işlemleri gönderir, sunucu bunları kendi depolama işlemlerine dönüştürür. Aynı IP ağı üzerinde çalışan iSCSI ise blok erişimi taşıyabilir. Ağ kullanılması tek başına dosya hizmeti anlamına gelmez.

## Uzak depolamaya API ile erişim

11.7

Bulut depolama örneğinde program uzak veri merkezindeki hizmete API üzerinden ulaşır. İstek ağdan geçer ve hizmet tarafından depolama işlemlerine dönüştürülür. Ağ gecikmesi ve bağlantı başarısızlığı erişimin tasarımında dikkate alınır.

## Bir depolama dizisinin içi

11.7

Depolama dizisi host bağlantılarını, denetleyicileri ve birden çok aygıtı bir araya getirir. Host’a mantıksal depolama hacimleri sunabilir. RAID, snapshot ve replication bu yapı üzerinde sağlanabilen farklı hizmetlerdir.

## Birçok host, birçok dizi

11.7

SAN, birden çok host ile depolama dizisini birbirine bağlayan depolama ağıdır. Diziler host’lara belirli mantıksal hacimleri sunar. Bir hacmin iki host tarafından görülebilmesi, dosya sistemi yazmalarının kendiliğinden koordine edildiği anlamına gelmez.

## Yedeklilik ve onarım penceresi

11.8

RAID, birden çok diski belirli bir veri dağıtımı ve koruma düzeninde kullanır. Yedeklilik bazı disk arızalarında hizmetin sürmesini sağlar. Onarım tamamlanana kadar dizi ek arızalara karşı daha savunmasız olabilir. Güvenilirlik, koruma düzeni ve onarım süresiyle birlikte değerlendirilir.

## Veriyi dağıtmak mı, kopyalamak mı?

11.8

Şeritleme veriyi disklere dağıtır, aynalama aynı içeriğin kopyalarını tutar. Şeritleme tek başına disk kaybına karşı yedek veri oluşturmaz. Aynalama sağlam kopya karşılığında ek fiziksel alan kullanır.

## Koruma bilgisini nereye koyarız?

11.8

RAID 4 pariteyi ayrı diskte, RAID 5 diskler arasında dağıtarak saklar. Tek parite bilgisi bir kayıp bloğun yeniden üretilmesini sağlayabilir. RAID 6 ikinci bağımsız koruma bilgisi ekleyerek iki tam disk kaybına dayanabilir. Koruma düzeni, hangi arızaların karşılanabileceğini belirler.

## Kayıp bloğu sağlam bilgilerden üret

11.8 · Ek içerik

XOR paritesi, veri bloklarından hesaplanan ek koruma bilgisidir. Bir veri bloğu kaybolduğunda kalan veri ve pariteyle yeniden hesaplanabilir. Aynı denklem iki bağımsız kayıp veriyi belirleyemez.

## Koruma bilgisini iki boyutta yerleştirmek

11.8 · Ek içerik

Koruma bilgisi farklı boyut ve gruplarda yerleştirilebilir. Ekrandaki çok boyutlu parite örneğinde kayıpların hangi satır ve gruplara düştüğü kurtarılabilirliği etkiler. Bir RAID seviye adı tek başına her yerleşim ve hata örüntüsü için aynı sonucu vermez.

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
