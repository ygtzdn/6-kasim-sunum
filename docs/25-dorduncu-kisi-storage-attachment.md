# 4. kişinin Storage Attachment akışı

5 Kasım 2026. Değişiklik yalnızca 4. kişinin §11.7 anlatımını kapsar. §11.8 RAID, ortak kapanış ve diğer üç kişinin içeriği korunur.

## İnceleme ve tasarım kararları

Proje, Operating System Concepts 10. baskının 11.1–11.8 kapsamını anlatan React/TypeScript tabanlı bir sunumdur. Bölümler kendi sahne kayıtlarıyla ortak gezinmeye katılır. Güncel README ve 22–24 numaralı belgeler esas alındı. Eski sahne sayısı, aşama sayısı ve not biçimi kuralları içerik sınırı olarak kullanılmadı.

Tasarım açık zemin, koyu çizgiler, mavi vurgu ve büyük diyagramlarla ilerler. Uzun açıklamalar Notlar ve Kaynaklar alanındadır. Aşama değişimi sunucunun kontrolündedir. Hareket yeni bir kavramı veya değişen veri yolunu açıklar. Menü, Space ve sistemin azaltılmış hareket tercihi ortak hareket kontrolünü sürdürür.

Önceki giriş doğrudan host bağlantısını anlatıyor, üç yaklaşımı birlikte göstermiyordu. NAS sayfası dosya hizmeti, iSCSI ve karşılaştırmayı aynı akışta topluyordu. SAN sonunda NAS ile ayrı bir karşılaştırma bulunmuyordu.

## Yeni akış

| Sayfa | Anlatım | Aşama |
| --- | --- | ---: |
| `storage-attachment` | Host-attached, network-attached ve cloud için ortak görsel giriş | 4 |
| `host-attached` | Yerel I/O portu, istek yolu ve birden çok aygıtlı bus | 3 |
| `nas` | NAS dosya isteği, NFS/CIFS, sunucuda dosya sistemi ve iSCSI blok erişimi | 4 |
| `cloud-storage` | Programın API kullanımı, Internet/WAN, veri merkezi, gecikme ve hata | 4 |
| `storage-arrays` | Host portları, denetleyici, bellek, yazılım, diskler ve paylaşım | 4 |
| `san` | Host/dizi ağı, FC/InfiniBand, iki host için LUN görünürlüğü ve ağ ayrımı | 5 |
| `nas-san-comparison` | Dosya/blok, bağlantı/protokol ve dosya sistemi konumu | 3 |

11.7 toplam 7 sayfa ve 27 aşamadır. Ana sunum 53 sayfadır. Karşılaştırmanın ardından mevcut `raid-intro` sayfası gelir. 11.7 bölüm bağlantısı yeni girişe yönelir. `s26`–`s29` eski bağlantıları kendi konu sayfalarında kalır.

Girişteki üç özgün SVG çizimi bilgisayarın yerel aygıta, NAS sunucusuna ve uzak veri merkezine bağlantısını gösterir. Seçilen yaklaşımda istek simgesi yol boyunca ilerler. Ayrıntı sayfalarında mevcut React Flow/Dagre altyapısı kullanılır. SAN’ın fiziksel bağlantıları sabit kalırken Host A/LUN A ve Host B/LUN B erişimleri ayrı aşamalarda vurgulanır. Son karşılaştırmada dosya ve blok simgeleri ağ yolunu izler. Dosya sistemi konumu host veya NAS üzerinde işaretlenir. Yeni bağımlılık veya dış hizmet eklenmedi.

## Kaynak sınırı

[Yazarların resmî Chapter 11 slaytları](https://os-book.com/OS10/slide-dir/PPTX-dir/ch11.pptx) yeniden indirildi ve 32–37 numaralı slaytların içeriği incelendi. Slayt 32’deki üçlü ayrım host-attached, network-attached ve cloud’dur. NAS ve iSCSI slayt 33, bulut slayt 34, depolama dizisi slayt 35, SAN slayt 36–37 ile eşlenir. NAS–SAN karşılaştırması bu kaynakların sentezidir. Dosya sisteminin tipik konumu, dosya hizmeti ile blok erişiminin sorumluluk ayrımından çıkarılır.

Tam kitap metni depoda bulunmuyor. Çalışma tam kitap sayfalarıyla satır düzeyinde karşılaştırma iddiası taşımaz. Ürün kurulumu, hız/fiyat sıralaması, küme dosya sistemi, zoning veya protokol iç yapısı eklenmedi. Çizimler öğretim modelidir. Animasyon süresi gerçek aygıt hızı değildir.

## Doğrulama

- Gezinme, işlem modelleri ve yeni bağlantı akışı dahil 81 test başarılı.
- İçerik kontrolü 53 sayfanın açılışını, bölüm bağlantılarını ve yerel varlıklarını doğruladı.
- TypeScript kontrolü ve üretim derlemesi başarılı. Sayfa açıklamaları ve çevrimdışı notlar güncellendi.
- Kapsam karşılaştırmasında 11.7 dışındaki sahne kayıtları, notlar ve RAID uygulaması aynı kaldı.
- Mevcut kullanıcı tercihine uygun olarak tarayıcı otomasyonu ve ekran görüntüsü kullanılmadı. Statik kontroller gerçek projeksiyon provasının yerine geçmez.

Üretim derlemesindeki mevcut büyük JavaScript paketi uyarısı sürer. Bu değişiklik yerel projeye uygulanır, haricî dağıtım yapılmaz.
