import { ChapterOverview } from "../../components/VisualScenes";
import type { SceneDefinition } from "../../presentation/types";

export const openingScenes: SceneDefinition[] = [
  {
    id: "storage-opening",
    legacyIds: ["s01", "s02", "presentation-map"],
    kind: "intro",
    depth: "core",
    seconds: { core: 45, full: 60 },
    title: "Kütlesel depolama",
    shortTitle: "Bölüm başlıkları",
    chapter: "Bölüm 11 · Açılış",
    presenterId: 1,
    stages: ["11.1–11.8 konu başlıkları"],
    render: (context) => <ChapterOverview goTo={context.goTo} />,
    notes: {
      explanation:
        "Bölüm 11, depolama aygıtlarının yapısını ve işletim sisteminin bu aygıtları nasıl kullandığını ele alır. Konular aygıtların tanıtımıyla başlar, zamanlama ve yönetimle devam eder, bağlantı biçimleri ve RAID yapısıyla tamamlanır.",
    },
  },
];
