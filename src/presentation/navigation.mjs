/** Resolve stable scene URLs and aliases without coupling navigation to a scene count.
 * @param {readonly {id:string, legacyIds?:readonly string[]}[]} scenes
 * @param {string} id
 */
export function resolveSceneId(scenes, id) {
  return (
    scenes.find((scene) => scene.id === id || scene.legacyIds?.includes(id))
      ?.id ?? null
  );
}

/** @param {string} hash
 * @param {readonly {id:string, legacyIds?:readonly string[]}[]} scenes */
export function sceneIdFromHash(hash, scenes) {
  const match = hash.match(/^#\/sunum\/([a-z0-9]+(?:-[a-z0-9]+)*)$/);
  return (match && resolveSceneId(scenes, match[1])) || scenes[0]?.id || null;
}

/** @template {{id:string, depth?:string}} T
 * @param {readonly T[]} scenes
 * @param {"core"|"full"} mode */
export function scenesForMode(scenes, mode) {
  return mode === "full"
    ? [...scenes]
    : scenes.filter((scene) => scene.depth !== "extension");
}

/** Move in the active route, including when a user opened an extension directly.
 * @param {readonly {id:string, depth?:string}[]} scenes
 * @param {string} currentId
 * @param {number} delta
 * @param {"core"|"full"} mode */
export function adjacentSceneId(scenes, currentId, delta, mode) {
  const currentIndex = scenes.findIndex((scene) => scene.id === currentId);
  if (currentIndex < 0 || delta === 0) return null;
  const eligible = new Set(
    scenesForMode(scenes, mode).map((scene) => scene.id),
  );
  const direction = delta > 0 ? 1 : -1;
  for (
    let i = currentIndex + direction;
    i >= 0 && i < scenes.length;
    i += direction
  )
    if (eligible.has(scenes[i].id)) return scenes[i].id;
  return null;
}
