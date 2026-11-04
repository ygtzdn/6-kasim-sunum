import { clampStage } from "./controls.mjs";

/** Scene and stage are a single state so an outgoing scene never flashes its first stage.
 * @param {{index:number,stage:number,direction:number}} state
 * @param {{type:'scene',index:number,sync?:boolean}|{type:'stage',index:number,value:number,count:number}|{type:'step',index:number,delta:number,count:number}} action */
export function presentationPosition(state, action) {
  if (!Number.isInteger(action.index) || action.index < 0) return state;
  if (action.type === "scene") {
    if (action.index === state.index && (action.sync || state.stage === 0))
      return state;
    return {
      index: action.index,
      stage: 0,
      direction: Math.sign(action.index - state.index) || -1,
    };
  }
  if (action.index !== state.index) return state;
  const stage = clampStage(
    action.type === "step" ? state.stage + action.delta : action.value,
    action.count,
  );
  return stage === state.stage
    ? state
    : { ...state, stage, direction: Math.sign(stage - state.stage) };
}
