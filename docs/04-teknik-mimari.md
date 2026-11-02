# 04 — Teknik mimari

> Bu dosya ilk teknik plandır. Uygulama React + TypeScript + Vite + Tailwind'e geçti. Kaynaklar `src/`, derleme çıktısı `dist/` altındadır. Güncel teknoloji, durum ve menü davranışları için [07 — Güncel uygulama](07-guncel-uygulama.md) esas alınır.

## 1. Temel karar

Bu proje için **build gerektirmeyen HTML + CSS + JavaScript ES modules** yapısı seçildi. Eğitim modelleri ve görünüm tarayıcıda çalışır. Backend, uygulama sunucusu, kimlik doğrulama, API anahtarı veya veritabanı yoktur. Küçük ve belirli kapsam için framework kurulumu zorunlu tutulmaz.

Bu karar uygulama öncesi mimari seçimdir; klasörde şu an bu kod yapısı bulunmuyor. İleride framework gerekirse aynı saf model ve veri sözleşmeleri korunmalı; sunucu tarafı özellik gerektiren bir geçiş yapılmamalı.

Statik dosya sunucusu yalnızca varlıkları iletir; eğitim hesabı veya kullanıcı durumu işlemez. ES module dosyaları uygun HTTP MIME türleriyle sunulmalıdır. Modüllerin `file://` üzerinden açılması tarayıcı kısıtlamalarına takılabildiğinden desteklenen yöntem yerel statik HTTP veya statik hosting'dir. [MDN: JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).

## 2. Mantıksal yapı

```text
Statik dosyalar
  ├─ Sahne/sunucu/kaynak verileri
  ├─ Sunum kabuğu ve navigasyon
  ├─ Demo modelleri (saf hesaplar)
  ├─ Demo görünümleri (DOM + SVG)
  └─ Tarayıcı adaptörleri (URL, storage, fullscreen, print)
                  ↓
         Kullanıcının tarayıcısı
```

Hesap modülü DOM, `localStorage` veya animasyon API'si çağırmaz. Görünüm, model çıktısını kullanır; toplamları SVG koordinatlarından geriye doğru hesaplamaz. Bu ayrım özellikle SCAN uç noktaları ve RAID arıza mantığının doğrulanmasını kolaylaştırır.

## 3. Planlanan dosya ağacı

```text
6-kasim-sunum/
├── README.md
├── docs/                         # Mevcut dokümantasyon
├── dist/                         # Sonraki aşamada oluşturulacak statik site
│   ├── index.html
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── layout.css
│   │   ├── presentation.css
│   │   ├── demos.css
│   │   └── print.css
│   ├── scripts/
│   │   ├── app.js
│   │   ├── data/
│   │   │   ├── presenters.js
│   │   │   ├── scenes.js
│   │   │   ├── questions.js
│   │   │   └── sources.js
│   │   ├── core/
│   │   │   ├── navigation.js
│   │   │   ├── session-state.js
│   │   │   ├── preferences.js
│   │   │   ├── timer.js
│   │   │   └── keyboard.js
│   │   ├── models/
│   │   │   ├── hdd-access.js
│   │   │   ├── hdd-scheduling.js
│   │   │   ├── nvm.js
│   │   │   ├── parity.js
│   │   │   ├── device-management.js
│   │   │   ├── swap.js
│   │   │   ├── attachment.js
│   │   │   └── raid.js
│   │   └── views/
│   │       ├── shell.js
│   │       ├── scene.js
│   │       ├── demos/            # D01–D08 için ayrı görünüm dosyaları
│   │       ├── questions.js
│   │       └── glossary.js
│   └── assets/
│       └── diagrams/             # Özgün SVG; dış font/CDN yok
└── tests/                        # Hesap modelleri için sonraki aşamada
```

Doğrudan `dist/` altında kaynak geliştirmek burada bilinçli bir karardır: Derleme adımı yoktur, sunulan kaynak ile düzenlenen kaynak aynıdır. Dosya adları uygulama aşamasında gereksiz parçalamayı azaltmak için birleştirilebilir; sorumluluk sınırları korunur. Paket yöneticisi ve test çalıştırıcısı ortam kontrolünden sonra seçilir; şu an olmayan araçların kurulu olduğu varsayılmaz.

## 4. İçerik veri sözleşmesi

Aşağıdaki örnekler uygulanacak veri biçimini tarif eder; çalışan uygulama kodu değildir. Başlık/metin gibi alanlar kullanıcıdan HTML almaz.

```js
const presenter = {
  id: 'p2',
  displayName: '2. kişi',
  sections: ['11.2', '11.3'],
  firstSceneId: 's10',
  accentToken: 'presenter-2'
};

const scene = {
  id: 's12',
  order: 12,
  presenterId: 'p2',
  sections: ['11.2'],
  title: 'SCAN: aynı yöndekileri topla',
  takeaway: 'Kafa seçilen yönde servis eder, gerektiğinde uçta döner.',
  bullets: [],
  kind: 'demo',
  demoId: 'D02',
  demoFocus: 'scan',
  plannedSeconds: 90,
  speakerNotes: ['Uç noktayı görünür tut; LOOK ile karıştırma.'],
  sourceIds: ['osc10-toc'],
  questionIds: []
};
```

S01–S36 doküman gösterimidir; uygulamadaki kalıcı kimlikler `s01`–`s36` olur. Sıra numarası değişse bile eski bağlantıları korumak için kimlikler sabit tutulur. Sahne içerikleri JS modülü olarak yerelden import edilir; çalışma anında uzaktan içerik yüklenmez. Kaynaklara tıklamak ana uygulamanın çalışması için gerekli değildir.

İçerik incelemesinde doğrulanmış kaynak eklendikçe `sourceIds` genişler. Yalnızca içindekiler kaynağına bağlı bir formülün kitap metninden doğrulandığı iddia edilmez. Her demo örneği için “özgün eğitim modeli” bilgisi saklanır.

### İçerik bütünlüğü kuralları

- 36 benzersiz sahne kimliği; sıralar boşluksuz.
- 11.1–11.8 başlıklarının her biri en az bir sahnede görünür.
- Sunucu-bölüm ilişkisi kesin gereksinimlerle eşleşir.
- Bütün kaynak, demo ve soru referansları tanımlıdır.
- Süreler toplamı 2700 saniyedir.
- D02 gibi paylaşılan demo, farklı sahnelerde aynı model oturumunu kullanır.
- `demoFocus` ilgili anlatım panelini açar; mevcut modeli kullanıcıdan habersiz sıfırlamaz. “Bu sahnenin örneğini yükle” eylemi gerekirse görünür sunulur.

## 5. Durum ve navigasyon

### URL sözleşmesi

```text
#/sunum/s01
#/sunum/s10
#/oku/s12
```

Hash tabanlı yol, statik hosting'de sunucu yönlendirme kuralına ihtiyaç bırakmaz. Aynı sayfa dosyası yüklenir, istemci hash'i yorumlar. Tanınmayan mod/sahne açılışa döner ve kısa bir açıklama gösterir; sonsuz yönlendirme yapılmaz.

Sunucu menüsü sırasıyla `s03`, `s10`, `s18`, `s26` girişlerini kullanır. “Sunumu başlat” `s01` ile başlar. Okuma modunun sahne bağlantısı aynı kimliğe kaydırır. İleri/geri eylemleri URL geçmişi oluşturur; uygulama ilk yüklemede varsayılan yol eklerken history'yi gereksiz çoğaltmaz.

### Durumun saklandığı yer

| Durum | Yer | Yenileme sonrası davranış |
| --- | --- | --- |
| Aktif mod ve sahne | URL hash | Aynı sahne açılır |
| Demo girdileri ve hesap adımı | Bellek | Başlangıç örneğine döner |
| Sorulara verilmiş cevaplar | Bellek | Temizlenir |
| Tema ve hareket tercihi | localStorage | Varsa geri yüklenir |
| Konuşmacı notu görünürlüğü | Bellek | Güvenli varsayılan: gizli |
| Sunum kronometresi | Bellek | Durmuş ve sıfır olarak başlar |

Tercih anahtarı örneği: `osc10.mass-storage.preferences.v1`. Okuma/yazma `try/catch` ile sarılır. Erişim reddi, kota veya bozuk JSON uygulamayı durdurmaz; bellek varsayılanı kullanılır. Tercihler aygıt ve origin'e bağlıdır, cihazlar arasında paylaşılmaz. [MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

“Tercihleri temizle” yalnızca uygulamanın kendi anahtarını siler; bütün origin için `localStorage.clear()` çağrılmaz. Tema ve hareket tercihi içerik verisi gibi sürüm kontrolüne yazılmaz.

## 6. Hesap modellerinin ortak arayüzü

```text
createInitialState(input) → state
validateInput(input) → { valid, errors }
reduceAction(state, action) → nextState
deriveSummary(state) → görünümden bağımsız sonuçlar
```

Sabit hesaplar gerektiğinde daha basit fonksiyon olabilir: `calculateHddAccess(input)` veya `evaluateRaid(config, failedDisks)`. Tek bir ortak sınıf hiyerarşisi zorlanmaz. Kurallar, [etkileşim şartnamesindeki](03-etkilesimler.md) sonuçlarla birebir uyumlu olmalıdır.

D02 çıktısında olaylar `move`, `service`, `reverse`, `wrap` olarak ayrılır; hizmet almayan uç noktalar sahte istek gibi işaretlenmez. Sayı doğrulamasından geçmeden model oluşturulmaz. `NaN` veya sonsuz değer kullanıcı arayüzüne basılmaz.

D08'in değerlendirmesi `{ usableCapacityTB, status, recoverable, explanation }` gibi ayrı alanlar döndürür. Kapasite ve erişilebilirliği tek sayıda birleştirmez. RAID 10 ayna çiftleri veri olarak tanımlanır.

## 7. Animasyon ve yaşam döngüsü

- Demo başlatıldığında ilk durum anında çizilir; animasyon sonucu bekletmez.
- Zaman tabanlı görseller `requestAnimationFrame` kullanabilir; mantıksal “Adım” işlemi zamanlayıcıya bağımlı olmaz.
- Sahne kapatılınca animasyon ve event abonelikleri temizlenir.
- Sekme gizlenince oynatma ve sunum kronometresi duraklar; dönüşte kendiliğinden devam etmez.
- Kronometre kalan hedef süreyi gösterebilir; süre dolunca sahne değiştirmez veya kullanıcıyı kilitlemez.
- Model olayları yeniden çizilse de girdi odağı ve seçimi korunur.

## 8. Klavye, tam ekran ve odak

| Eylem | Kısayol / davranış |
| --- | --- |
| Sonraki / önceki sahne | Sağ / Sol ok; görünür düğmeler de var |
| Başlangıç / son | Home / End |
| Bölüm haritası | M |
| Tam ekran isteği | F veya düğme; destek yoksa açıklama |
| Not paneli | N; aynı ekranda görünür olacağı anlaşılır |
| Pencere/panel kapat | Escape; tarayıcının fullscreen davranışı engellenmez |
| Demo adımı | Odaklı “Adım” düğmesinde Enter/Space |

Input, textarea, select veya düzenlenebilir alanda yazarken küresel harf/ok kısayolları çalışmaz. Slider'ın okları slider'a aittir. Açık modalda sunum gezinmesi kapatılır. Tek harf kısayolları ayarlardan kapatılabilir; düğmeler her zaman kullanılabilir.

Fullscreen API kullanıcı eylemiyle çağrılır; ret veya destek yokluğunda sunum normal pencerede sürer. Tam ekran sunumun ön koşulu değildir. [MDN: Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API).

Sahne değişiminde yeni sahnenin başlığına programatik odak verilir; sadece görsel çizimde bu yapılmaz. Modal açıldığında odak içeri taşınır ve kapanınca açan kontrole döner. Mobilde büyük önceki/sonraki düğmeleri bulunur; swipe zorunlu etkileşim değildir.

## 9. Erişilebilirlik ve okunabilirlik

WCAG 2.2 AA düzeyi tasarım hedefidir; otomatik olarak sağlandığı iddia edilmez. [W3C: WCAG 2.2](https://www.w3.org/TR/WCAG22/).

- Normal metinde en az 4.5:1, büyük metinde en az 3:1 kontrast hedefi.
- Klavye odağı görünür; işlem sadece hover'a bağlı değildir.
- Kontrollerde en az 44×44 CSS px hedef boyut; bit düğmeleri mobilde yeniden dizilir.
- Renklerin yanında etiket, şekil veya desen kullanılır.
- SVG'lerde açıklayıcı başlık; karmaşık sonuçlarda HTML tablo/özet bulunur.
- Pasif sunum sahneleri gizlenirken odaklanabilir kontroller de erişim ağacından çıkarılır.
- Zoom ve küçük ekranda kritik kontrol kaybolmaz; metin küçülterek taşma gizlenmez.
- `prefers-reduced-motion` izlenir; kullanıcının uygulama tercihi de bulunur. [MDN: hareket tercihi](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion).
- Animasyon durumu kısa `aria-live="polite"` özetiyle duyurulur; her frame okunmaz.

## 10. Okuma ve yazdırma

Okuma modu aynı veri kaynağından üretilir; ayrı kopya metin tutulmaz. Aynı anda iki aktif demo örneği kurup sayaçların çatışmasına izin verilmez. Mod değişiminde görünüm sökülür, model oturumu bellekte korunur.

Yazdırmada 36 sahne sıralı, açık zeminli ve sayfa kırılımları kontrollü gösterilir. Kontroller ve gizli notlar varsayılan çıktıdan kaldırılır. Demolar için mevcut oynatma karesi yerine tanımlı başlangıç/sonuç tablosu ve model sınırı yazılır. “Notlarla yazdır” ayrı ve açık bir seçimdir. Tarayıcı PDF kaydı etkileşimi taşımaz.

## 11. Performans ve ağ davranışı

Başlangıç bütçesi: Uygulamanın kendi HTML/CSS/JS/SVG varlıkları sıkıştırılmamış toplam 2 MB altında hedeflenir; kitap veya resmî PPTX paketlenmez. Bu bir geliştirme hedefidir, yapılmış ölçüm değildir. Demo bileşenleri ihtiyaç olduğunda kurulur; aktif sahne dışında arka plan animasyonu yoktur.

Tüm fontlar sistemden, grafikler yerel varlıklardan gelir. Analitik, CDN, uzaktan font, gömülü video, API çağrısı veya uygulama hesabı yoktur. Kaynak bağlantıları dışarı açılabilir; uygulamanın işlevi bu bağlantılara dayanmaz. Yerel HTTP üzerinden ağ kapalı kullanım prova edilir. Tarayıcı önbelleği bir offline ürün garantisi olarak sunulmaz.

## 12. Dağıtım ve bakım sınırı

Uygulama tamamlandığında `dist/` bir statik barındırıcıya konabilir veya yerel statik sunucu ile sunulabilir. Sunucu tarafı hesap veya uygulama runtime'ı gerekmez. Yayımlama bu dokümantasyon aşamasında yapılmaz; ilk sürümün erişim hedefi henüz seçilmemiştir.

Sites ile sonraki bir yayımlama kararı verilirse statik dizin `dist` olacak şekilde Sites iş akışı kullanılır; kalıcı proje kimliği yalnızca gerçek kayıt sırasında oluşturulur. Backend/Workers/veritabanı, salt hosting için ürün gereksinimi haline getirilmez.

Sürüm değişimlerinde sahne kimlikleri ve kaynak kayıtları korunur. Model kuralı değişirse ilgili örnek sonuç ve kabul senaryosu aynı değişiklikte güncellenir.
