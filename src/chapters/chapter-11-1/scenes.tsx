import { useState } from "react";
import type { SceneDefinition } from "../../presentation/types";
import {
  Cover,
  Roadmap,
  Storage,
  Blocks,
  Flash,
  Workloads,
  Checkpoint,
} from "../../components/VisualScenes";
import { Stage } from "../../components/presentation/ScenePrimitives";
import AccessLab, {
  initialAccess,
  type AccessInput,
} from "../../components/AccessLab";
import HddExplorer from "./components/HddExplorer";
import { introNotes } from "./notes";

let savedAccess: AccessInput = { ...initialAccess };
function AccessScene({ enabled }: { enabled: boolean }) {
  const [input, setInput] = useState(savedAccess);
  return (
    <Stage title="Bir okumanın maliyeti.">
      <AccessLab
        input={input}
        enabled={enabled}
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
    render: (ctx) => (
      <Cover
        start={() => ctx.goTo("s02")}
        menu={ctx.openMenu}
        enabled={ctx.enabled}
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
    render: (ctx) => <Roadmap goTo={ctx.goTo} />,
  },
  {
    id: "s03",
    title: "Veri nerede yaşar?",
    shortTitle: "Depolama ortamları",
    chapter: "11.1 · Genel bakış",
    presenterId: 1,
    notes: introNotes.s03,
    render: (ctx) => <Storage enabled={ctx.enabled} />,
  },
  {
    id: "s04",
    title: "HDD’nin parçaları",
    shortTitle: "HDD · 3D ve hazır kayıt",
    chapter: "11.1 · HDD anatomisi",
    presenterId: 1,
    notes: introNotes.s04,
    render: (ctx) => <HddExplorer enabled={ctx.enabled} />,
  },
  {
    id: "s05",
    title: "Bir okumanın maliyeti",
    shortTitle: "Erişim süresi",
    chapter: "11.1 · Erişim maliyeti",
    presenterId: 1,
    notes: introNotes.s05,
    render: (ctx) => <AccessScene enabled={ctx.enabled} />,
  },
  {
    id: "s06",
    title: "OS diski bloklarla görür",
    shortTitle: "Mantıksal bloklar",
    chapter: "11.1 · Adresleme",
    presenterId: 1,
    notes: introNotes.s06,
    render: (ctx) => <Blocks enabled={ctx.enabled} />,
  },
  {
    id: "s07",
    title: "Yeni sürüm, yeni sayfa",
    shortTitle: "Flash üzerinde yazma",
    chapter: "11.1 · NVM ve SSD",
    presenterId: 1,
    notes: introNotes.s07,
    render: () => <Flash />,
  },
  {
    id: "s08",
    title: "İş yükü ve erişim",
    shortTitle: "Rastgele ve sıralı erişim",
    chapter: "11.1 · Erişim biçimleri",
    presenterId: 1,
    notes: introNotes.s08,
    render: (ctx) => <Workloads enabled={ctx.enabled} />,
  },
  {
    id: "s09",
    title: "Hız ve mekanik bekleme",
    shortTitle: "Öğrenme kontrolü",
    chapter: "11.1 · Kontrol",
    presenterId: 1,
    notes: introNotes.s09,
    render: () => <Checkpoint />,
  },
];
