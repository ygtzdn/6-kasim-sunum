import { useState } from "react";
import type { SceneDefinition } from "../../presentation/types";
import { Cover, Roadmap } from "../../components/VisualScenes";
import { Stage } from "../../components/presentation/ScenePrimitives";
import AccessLab, {
  initialAccess,
  type AccessInput,
} from "../../components/AccessLab";
import {
  StorageComparison,
  HddAnatomy,
  SsdAnatomy,
  FlashBasics,
  OtherStorage,
  IntroCheckpoint,
} from "./components/StorageScenes";
import { introNotes } from "./notes";
import { introStages } from "./stages";

let savedAccess: AccessInput = { ...initialAccess };
function AccessScene({ stage }: { stage: number }) {
  const [input, setInput] = useState(savedAccess);
  return (
    <Stage title="Bir okumanın maliyeti.">
      <AccessLab
        input={input}
        stage={stage}
        onChange={(v) => {
          savedAccess = v;
          setInput(v);
        }}
      />
    </Stage>
  );
}
export const introductionScenes: SceneDefinition[] = [
  {
    id: "s01",
    title: "Verinin fiziksel hafızası",
    shortTitle: "Ana ekran",
    chapter: "Giriş",
    presenterId: 1,
    notes: introNotes.s01,
    stages: introStages.s01,
    render: (ctx) => (
      <Cover
        start={() => ctx.goTo("s02")}
        menu={ctx.openMenu}
        enabled={ctx.enabled}
        stage={ctx.stage}
      />
    ),
  },
  {
    id: "s02",
    title: "Dört bakış, bir veri yolculuğu",
    shortTitle: "Dört bakış",
    chapter: "Sunum haritası",
    presenterId: 1,
    notes: introNotes.s02,
    stages: introStages.s02,
    render: (ctx) => <Roadmap goTo={ctx.goTo} stage={ctx.stage} />,
  },
  {
    id: "s03",
    title: "HDD’nin parçaları",
    shortTitle: "HDD · Temel parçalar",
    chapter: "11.1 · HDD anatomisi",
    presenterId: 1,
    notes: introNotes.s03,
    stages: introStages.s03,
    render: (ctx) => <HddAnatomy {...ctx} />,
  },
  {
    id: "s04",
    title: "Volatil ve Non-Volatil",
    shortTitle: "Volatil / Non-Volatil",
    chapter: "11.1 · Genel bakış",
    presenterId: 1,
    notes: introNotes.s04,
    stages: introStages.s04,
    render: (ctx) => <StorageComparison {...ctx} />,
  },
  {
    id: "s05",
    title: "Bir okumanın maliyeti",
    shortTitle: "Erişim süresi",
    chapter: "11.1 · Erişim maliyeti",
    presenterId: 1,
    notes: introNotes.s05,
    stages: introStages.s05,
    render: (ctx) => <AccessScene stage={ctx.stage} />,
  },
  {
    id: "s06",
    title: "SSD’nin temel parçaları",
    shortTitle: "SSD · Gerçek fotoğraflar",
    chapter: "11.1 · NVM ve SSD",
    presenterId: 1,
    notes: introNotes.s06,
    stages: introStages.s06,
    render: (ctx) => <SsdAnatomy {...ctx} />,
  },
  {
    id: "s07",
    title: "Flash: sayfa ve blok",
    shortTitle: "Sayfa oku, blok sil",
    chapter: "11.1 · NVM ve SSD",
    presenterId: 1,
    notes: introNotes.s07,
    stages: introStages.s07,
    render: (ctx) => <FlashBasics {...ctx} />,
  },
  {
    id: "s08",
    title: "RAM disk, teyp ve blok görünümü",
    shortTitle: "Diğer ortamlar ve bloklar",
    chapter: "11.1 · RAM disk, teyp ve adresleme",
    presenterId: 1,
    notes: introNotes.s08,
    stages: introStages.s08,
    render: (ctx) => <OtherStorage {...ctx} />,
  },
  {
    id: "s09",
    title: "Hız ve mekanik bekleme",
    shortTitle: "Öğrenme kontrolü",
    chapter: "11.1 · Kontrol",
    presenterId: 1,
    notes: introNotes.s09,
    stages: introStages.s09,
    render: (ctx) => <IntroCheckpoint {...ctx} />,
  },
];
