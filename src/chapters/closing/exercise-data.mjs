export const exerciseSchedule = {
  head: 2150,
  previous: 1805,
  maximum: 4999,
  direction: "up",
  queue: [2069, 1212, 2296, 2800, 544, 1618, 356, 1523, 4965, 3681],
};

// Selected questions from the user's 11.pdf. Solutions are prepared for this presentation.
export const exercises = [
  {
    id: "exercise-nvm-fcfs",
    label: "11.13",
    page: 1,
    title: "NVM ve FCFS",
    visual: "nvm",
    sections: ["11.3"],
    slides: [26],
    question: "NVM aygıtları neden sıklıkla FCFS sıralaması kullanır?",
    answer:
      "Mekanik seek ve dönme olmadığından silindir sırasıyla kafa hareketini azaltma kazancı yoktur. FCFS basit ve düşük ek yüklüdür. Kuyruk, paralellik ve flash yönetimi işleri yine sürer.",
    seconds: { core: 30, full: 60 },
  },
  {
    id: "exercise-scheduling",
    label: "11.14",
    page: 1,
    title: "5000 silindirli disk",
    visual: "schedule",
    sections: ["11.2"],
    slides: [19, 20, 21, 22, 23, 24],
    question:
      "Kafa 2150'de, önceki konum 1805. Verilen kuyruk için FCFS, SCAN ve C-SCAN toplam kaç silindir hareket eder?",
    answer:
      "Sonuçlar: FCFS 13011, SCAN 7492, C-SCAN 9917 silindir. Yön artandır: 1805'ten 2150'ye gelindi. SCAN fiziksel 4999 ucuna gider. C-SCAN'ın 4999'dan 0'a dönüşü de hareket toplamına eklenir. Son bekleyen istek servis edildiğinde ölçüm biter.",
    seconds: { core: 90, full: 150 },
  },
  {
    id: "exercise-rotation",
    label: "11.16(a)",
    page: 2,
    title: "Ortalama dönme beklemesi",
    visual: "rotation",
    sections: ["11.1"],
    slides: [6, 7],
    question:
      "7200 RPM ile dönen bir diskin ortalama dönme beklemesi kaç milisaniyedir?",
    answer:
      "Bir tur 60000 / 7200 = 8,3333 ms sürer. Sektörün açısal konumu için eşit olasılık varsayımıyla ortalama bekleme yarım turdur: 4,1667 ms. Seek ve aktarım bu hesaba dahil değildir.",
    seconds: { core: 30, full: 60 },
  },
  {
    id: "exercise-hdd-nvm",
    label: "11.17",
    page: 2,
    title: "HDD ve NVM karşılaştırması",
    visual: "comparison",
    sections: ["11.1", "11.3"],
    slides: [4, 6, 7, 9, 10, 11, 26],
    question:
      "HDD ve NVM aygıtlarını karşılaştır. Hangi iş yüklerinde hangi özellikleri önem kazanır?",
    answer:
      "HDD'de seek ve dönme maliyeti vardır; büyük sıralı aktarımlar bu maliyetin payını azaltabilir. NVM mekanik beklemeyi kaldırır; küçük rastgele I/O ve düşük gecikme gereksinimi için bu önemlidir. Sonuç iş yüküne ve aygıta bağlıdır.",
    seconds: { core: 30, full: 60 },
  },
  {
    id: "exercise-raid-write",
    label: "11.21(a)",
    page: 3,
    title: "RAID 5'te tek blok yazma",
    visual: "raid-write",
    sections: ["11.8"],
    slides: [39, 40],
    question:
      "Beş diskli RAID 5'te tek veri bloğu güncellenirken kaç blok erişimi gerekir? Önbelleksiz read-modify-write yolunu kullan.",
    answer:
      "Eski veri ve eski parite okunur; yeni veri ve yeni parite yazılır. Toplam 2 okuma + 2 yazma = 4 blok I/O yapılır. İki farklı blok konumuna erişilir; erişim sayısı ile benzersiz blok sayısı aynı değildir.",
    seconds: { core: 30, full: 60 },
  },
  {
    id: "exercise-mtbf",
    label: "11.25(a,c)",
    page: 3,
    title: "MTBF ve garanti",
    visual: "reliability",
    sections: ["11.8"],
    slides: [38, 42],
    question:
      "1000 diskin her biri 750000 disk-saat/arızalık MTBF değerine sahipse çiftlikte ortalama arıza aralığı nedir? MTBF, garanti süresini belirler mi?",
    answer:
      "Bağımsız ve sabit arıza hızı varsayımıyla toplam arıza hızı 1000 / 750000'dir. Ortalama aralık 750 saat, yaklaşık 31,25 gündür. MTBF'den tek diskin ömrü veya garanti süresi çıkarılamaz.",
    seconds: { core: 30, full: 60 },
  },
].map((exercise) => ({
  ...exercise,
  kind: "closing",
  depth: "core",
  presenterId: 4,
  chapter: "Kapanış · Exercises",
  legacyIds: [],
  stages: ["Soruyu tartış", "Çözüm ve gerekçe"],
  takeaway: exercise.answer,
  model: `Kullanıcının paylaştığı 11.pdf, Exercises ${exercise.label}, PDF sayfa ${exercise.page}. Türkçe soru uyarlaması ve açıklamalı çözüm bu sunum için hazırlanmıştır; resmî cevap anahtarı aktarımı değildir. Yalnız belirtilen alt maddeler seçilmiştir.`,
}));
