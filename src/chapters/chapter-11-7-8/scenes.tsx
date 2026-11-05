import type { SceneDefinition } from "../../presentation/types";
import {
  CloudScene,
  HostAttachedScene,
  NasScene,
  SanScene,
  StorageArrayScene,
} from "./TopologyScenes";
import {
  NestedRaidScene,
  ParityRaidScene,
  RaidFeaturesScene,
  RaidIntroScene,
  RebuildRaidScene,
  StripingMirrorScene,
} from "./RaidScenes";
import {
  IntegrityScene,
  ObjectStorageScene,
  PoolScene,
} from "./IntegrityScenes";
import { attachmentRaidNotes } from "./notes";
import { attachmentStoryData } from "./storyData";

const renderers: Record<
  (typeof attachmentStoryData)[number]["id"],
  SceneDefinition["render"]
> = {
  "host-attached": (context) => <HostAttachedScene {...context} />,
  nas: (context) => <NasScene {...context} />,
  "cloud-storage": (context) => <CloudScene {...context} />,
  "storage-arrays": (context) => <StorageArrayScene {...context} />,
  san: (context) => <SanScene {...context} />,
  "raid-intro": (context) => <RaidIntroScene {...context} />,
  "raid-striping": (context) => <StripingMirrorScene {...context} />,
  "raid-parity": (context) => <ParityRaidScene {...context} />,
  "raid-nested": (context) => <NestedRaidScene {...context} />,
  "raid-rebuild": (context) => <RebuildRaidScene {...context} />,
  "raid-features": (context) => <RaidFeaturesScene {...context} />,
  "raid-integrity": (context) => <IntegrityScene {...context} />,
  "storage-pools": (context) => <PoolScene {...context} />,
  "object-storage": (context) => <ObjectStorageScene {...context} />,
};

/** Finite, independent stories in the verified OSC10 source order. */
export const attachmentRaidScenes: SceneDefinition[] = attachmentStoryData.map(
  (topic) => ({
    ...topic,
    shortTitle: topic.title,
    notes: attachmentRaidNotes[topic.id],
    render: renderers[topic.id],
  }),
);
