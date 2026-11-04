# 17 — Kütüphane tabanlı diyagram ve geçiş

> Aşama geçişlerinin burada kaydedilen toplu kayma/solma davranışı, [18 — Sahneye uygun animasyonlar](18-sahneye-uygun-animasyonlar.md) çalışmasında değiştirildi. Güncel görsel alan kalıcıdır ve öğeler kendi durum değişimlerini canlandırır. Aşağıdaki sonuçlar bu önceki altyapı revizyonunun kaydıdır.

**5 Kasım 2026.** Bu revizyonun kapsamı, onaylanan sunumun geçişlerini ve diyagram altyapısını yenilemektir. Operating System Concepts, Tenth Edition kapsamı, 50 sahne / 268 aşama, kaynak haritası, konuşmacı notları, iki rota ve mevcut renk/font dili korunur. Uygulama ve son inceleme üç paralel bölüm ajanıyla yürütüldü; ortak altyapı ana ajan tarafından birleştirildi.

## Uygulama kararları

| Sorumluluk | Kütüphane | Kullanım |
| --- | --- | --- |
| Kavramsal düğüm/bağlantı diyagramları | React Flow **12.12.1** | Düğümler, bağlantılar, ok uçları, kenar etiketleri, kapsayıcıya sığdırma |
| Otomatik grafik yerleşimi | Dagre **3.1.3** | Soldan sağa / yukarıdan aşağıya sıralama, çoklu host/dizi dalları ve karşılıklı swap bağlantıları |
| Sayısal yollar ve geometrik şekiller | d3-shape **3.2.1**, d3-scale **4.0.3** | HDD sektörleri, fiziksel kesit yolları, zamanlama koordinatları, eksenler ve erişim maliyeti oranları |
| Sahne, aşama ve başlık geçişleri | Motion **14.9.0** | Presence yaşam döngüsü, yönlü fade/transform, kısa easing, azaltılmış hareket desteği |

Sürümler `package.json` ve kilit dosyasında sabittir. Kütüphaneler yerel pakete dahil edilir; sunum sırasında CDN veya dış diyagram servisi kullanılmaz.

Uygulama sırası: ortak grafik sözleşmesi → üç ayrı bölüm dönüşümü → ortak Motion katmanı → çapraz kod incelemesi → model/SSR/derleme/HTTP doğrulaması. Kitap ve veri modelleri diyagram kütüphanesinden bağımsız kalır. Kitabın örnek değerleri, yeni çizim sistemine uydurulmak için değiştirilmez.

## Diyagram dönüşümü

`src/components/diagrams/FlowDiagram.tsx`, tüm kavramsal grafiklerin ortak girişidir. Bölümler yalnız düğüm, kenar, etiket ve geçerli aşamanın vurgu durumunu tanımlar. Yerleşimi `layout.mjs` üzerinden Dagre üretir; bağlantı yolu ve okları React Flow çizer. Elle SVG bağlantı koordinatı hesaplayan ayrı bölüm çözümleri kaldırıldı.

- **11.1–11.3:** OS/veri yolu, NVM iletim yolu; D3 ile HDD geometri yolları, SCAN/C-SCAN izleri ve maliyet payları.
- **11.4–11.6:** Dosya/raw erişim sorumluluğu, firmware/boot, sektör yeniden eşleme, RAM ↔ swap ve çoklu swap alanları.
- **11.7–11.8:** Host-attached, NAS, bulut, storage array, SAN/fabric/LUN; checksum/pointer/sağlam kopya ilişkileri ve nesne yaşam döngüsü/yerleştirmesi.
- **Kapanış:** Uygulamadan bütünlük denetimine altı düğümlü kavramsal I/O yolu.

Fiziksel aygıt fotoğrafları ve temel SVG daire/elips/metin öğeleri korunur; sektör/yol/ölçek üretimi D3 kullanır. Bit dizileri, blok/sayfa hücreleri, RAID matrisleri ve kapasite birimleri semantik HTML'dir. Bunlar bağlantı grafiğine dönüştürülmez. SCAN ve C-SCAN çizgilerinde **doğrusal** D3 eğrisi kullanılır: görsel yumuşatma, gerçek kafa hareketine yeni dönüş eklemez. SCAN **236**, LOOK **208** ve C-SCAN **386** ayrımı korunur.

React Flow bu sunumda bir düzenleyici değildir: sürükleme, bağlama, seçme, pan, zoom ve silme kısayolları kapalıdır. Enter/Backspace sunum kabuğuna aittir. Kapsayıcı boyutu değiştiğinde kütüphanenin `fitView` API'si yeniden çalışır. Karşılıklı swap okları ayrı bağlantı tutamakları kullanır. Grafiklerin erişilebilir adı düğümleri, yönleri ve kenar etiketlerini içerir; iç grafik öğeleri sekme sırasına girmez.

Kartlar 208 × 144 px ortak boyut kullanır; ikon başlıkla aynı satır grubundadır, uzun metinler kısaltılmaz. React Flow boyutları, SSR tutamakları ve Dagre aynı sabitlerden beslenir. Etiketli kenarların 180 × 28 px alanı Dagre'ye bildirilir; kütüphane kartlar arasında gerçek etiket boşluğu ayırır. Eşzamanlı eski/yeni diyagramların SVG/DOM ad alanları React `useId` ile ayrılır; içerik düğüm/kenar kimlikleri sabittir.

## Geçiş akışı ve giderilen hatalar

Sahne için 300 ms, aşama için 240 ms, başlık için 180 ms giriş süreleri ve ortak easing kullanılır. Çıkışlar 120–180 ms aralığındadır. Motion `AnimatePresence` eşzamanlı giriş/çıkış yönetir; katmanlar aynı alanda örtüşür. Çıkan içerik inert ve erişilebilirlik ağacında gizlidir. Aşamalar otomatik ilerlemez.

Sahne ve aşama tek atomik reducer durumuna taşındı. Böylece sahne değiştirirken eski sahne çıkış sırasında ilk aşamasına sıçramaz; yeni sahne sıfırdan açılır. Gecikmiş hash bildirimi, zaten ilerletilmiş yeni sahneyi yeniden sıfırlamaz. Eski sahneden kalan olaylar yeni sahnenin aşamasını değiştiremez. Sıraya giren ileri/geri komutlar en son duruma uygulanır.

İlk açılışta animasyon bastırılsa da başlık odağı kurulur. Aşama düğmelerinden sonra odak mevcut sahnenin inert olmayan başlığına döner; eşzamanlı çıkıştaki eski başlık seçilmez. Çıkışı tamamlanmadan geri açılan sahnede giriş odağı yeniden hazırlanır. Menü ve düzenlenebilir alanlar odak korumasını sürdürür.

Hareket kapalıyken yeni animasyonların süreleri sıfırdır; grafiklerin hareketli kenarları kapanır. Çıkan katmanlar güncel hareket/yön bilgisini presence payload'ından alır. Motion'ın başlamış kısa bir exit animasyonunu bitirmesi mümkündür; duraklatma, süren bir fade'in ortasında her kareyi anında dondurma iddiası taşımaz.

## Doğrulama

| Kontrol | Sonuç |
| --- | --- |
| `pnpm test` | **70/70 başarılı**; mevcut 61 teste atomik gezinme ve Dagre yerleşimi için 9 regresyon testi eklendi |
| `pnpm check:content` | **50 sahne / 268 aşama**; gerçek Motion çerçevesiyle hareket açık/kapalı ve ileri/ters aynı son durum; kitap sözleşmesi, kaynaklar, notlar ve yerel varlıklar geçerli |
| Grafik SSR sözleşmesi | LR/TB yerleşiminde karşılıklı iki kenar ve iki düğüm mevcut; birlikte görünen iki grafik benzersiz DOM kimliği taşıyor; odaklanabilir grafik kontrolü yok |
| Kenar etiketlerinin font ölçümü | SSR'deki 70 grafikten 35 benzersiz etiket; yerel Manrope 600 / 13 px ile padding dahil en büyük kutu **136 × 21 px**, ayrılan **180 × 28 px** alanı aşmıyor |
| `pnpm build` | TypeScript, bağımsız not HTML'i ve Vite üretim derlemesi başarılı |
| Canlı HTTP | **23 uygulama/varlık + 22 kütüphane bağımlılığı HTTP 200**; React Flow CSS importu ve yerel belge bağlantıları geçerli |
| `git diff --check` | Temiz |
| Üretim boyutu | JS **956,40 kB**, gzip **295,76 kB**; CSS **93,08 kB**, gzip **14,70 kB**. Vite'ın 500 kB parça uyarısı sürer |

Üç ajan kendi bölüm dönüşümlerinin ardından kaynak değerleri, saf model durumu, geri aşama ve ortak altyapıyı tekrar inceledi. İlk odak, eski başlığa odaklanma ve hızlı geri dönüş bulguları bu incelemede düzeltildi.

**Tarayıcı testi yapılmadı.** Node/SSR, tip, model ve HTTP denetimleri; gerçek ekranda geçiş akıcılığı, piksel taşması veya projeksiyon okunabilirliğinin ölçümü değildir. React Flow kenar etiketleri SSR çıktısında bulunur; kütüphane görünürlüğü istemcide SVG ölçümünden sonra açar. Bu davranışın tarayıcıdaki görünüşü test edilmiş sayılmaz.

Tam kitap metni hâlâ depoda bulunmuyor; önceki revizyonun resmî 10. baskı içindekiler, slaytlar, tekrar soruları ve düzeltmelerle sınırlı kaynak doğrulaması geçerlidir. Yeni içerik veya farklı baskı eklenmedi.

## Teknik dayanaklar

- [React Flow: SSR/SSG boyut, tutamak ve başlangıç viewport yapılandırması](https://reactflow.dev/learn/advanced-use/ssr-ssg-configuration)
- [React Flow: yerleşim kütüphaneleri ve Dagre](https://reactflow.dev/learn/layouting/layouting)
- [Motion: AnimatePresence, eşzamanlı çıkış ve presence custom verisi](https://motion.dev/docs/react-animate-presence)
- [D3: shape üreticileri](https://d3js.org/d3-shape)

Geliştirme sunucusu: [http://localhost:5173/](http://localhost:5173/).
