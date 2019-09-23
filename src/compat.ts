import { is } from "./is";

const list = {
  
  transitioncancel: "TransitionCancel",
  transitionend: "TransitionEnd",
  transitionrun: "TransitionRun",
  transitionstart: "TransitionStart",
};

const vendors = ["Webkit", "Moz", "MS", "O"];

export const compat = {
  get transform() {
    if (is.string(document.body.style.transform)) {
      return "transform";
    }
    for (let vendor of vendors) {
      const name = `${vendor}Transform`;
      if (is.string(document.body.style[name as any])) {
        return name;
      }
    }
    return "transform";
  }
};

const animationEvent = {
  animationcancel: "AnimationCancel",
  animationiteration: "AnimationIteration",
  animationend: "AnimationEnd",
};

const transitionEvent = {
  transitioncancel: "TransitionCancel",
  transitionend: "TransitionEnd",
  transitionrun: "TransitionRun",
  transitionstart: "TransitionStart",
}

Object.keys(animationEvent).forEach(eventName => {
  Object.defineProperty(compat, eventName, {
    enumerable: true,
    get [eventName](){
      if(is.string(document.body.style[eventName as any])) {
        return eventName;
      }
      for (let vendor of vendors) {
        const name = `${vendor}Animation`;
        if (is.string(document.body.style[name as any])) {
          return vendor + (<any>animationEvent)[eventName];
        }
      }
    }
  });
});
const transitionEventList = Object.keys(transitionEvent);

