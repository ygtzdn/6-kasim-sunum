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

/** Move through the presentation's single scene sequence.
 * @param {readonly {id:string}[]} scenes
 * @param {string} currentId
 * @param {number} delta */
export function adjacentSceneId(scenes, currentId, delta) {
  const currentIndex = scenes.findIndex((scene) => scene.id === currentId);
  if (currentIndex < 0 || delta === 0) return null;
  const direction = delta > 0 ? 1 : -1;
  return scenes[currentIndex + direction]?.id ?? null;
}
