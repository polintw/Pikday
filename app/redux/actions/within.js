import {
  SUBMIT_FEEDASSIGN,
  SUBMIT_CHAINLIST,
  SUBMIT_SHAREDSLIST,
} from '../types/typesWithin.js';
import {
  initAround
} from "../states/statesWithin.js";
import {
  uncertainErr
} from "../../utils/errHandlers.js";

export function submitFeedAssigned(listsObj, reset){
  return (dispatch, getState) => {
    const currentState =  getState();
    let copyStateListUnread = currentState.indexLists.listUnread.slice();
    let copyStateListBrowsed = currentState.indexLists.listBrowsed.slice();
    let scrolled = listsObj.scrolled; // only this one follow the param directly

    if(listsObj.listUnread.length > 0) copyStateListUnread.push(listsObj.listUnread);
    if(listsObj.listBrowsed.length > 0) copyStateListBrowsed.push(listsObj.listBrowsed);
    if(!!reset){ // special condition, ask to reset to init state
      copyStateListUnread = initAround.indexLists.listUnread;
      copyStateListBrowsed = initAround.indexLists.listBrowsed;
      scrolled = initAround.indexLists.scrolled;
    }

    dispatch({
      type: SUBMIT_FEEDASSIGN,
      listsObj: {listUnread: copyStateListUnread, listBrowsed: copyStateListBrowsed, scrolled: scrolled}
    });
  }
}

export function submitSharedsList(listsObj){
  return {type: SUBMIT_SHAREDSLIST, listsObj: listsObj}
}

export function submitChainList(listsObj) {
  return { type: SUBMIT_CHAINLIST, listsObj: listsObj }
}
