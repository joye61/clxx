// let touchHoverOn = true;

// let getTarget = (node)=>{
//     if(!node || !(node instanceof Element)) return null;
//     if(node.dataset.hover !== undefined) {
//         return node;
//     } else if(node.parentNode !== null){
//         return getTarget(node.parentNode);
//     }
// }

// let inHover = false, node = null;
// let touchstart = function(e){
//     if(e.touches.length > 1 || inHover || !touchHoverOn) {
//         return ;
//     }
//     node = getTarget(e.touches.item(0).target);
//     if(node == null) return ;
//     inHover = true;

//     node.dataset.hover && node.classList.add(node.dataset.hover);
// };
// let touchend = function(){
//     if(inHover) {
//         inHover = false;
//         node.dataset.hover && node.classList.remove(node.dataset.hover);
//     }
// };

// let doc = document.documentElement;
// doc.addEventListener('touchstart', touchstart);
// doc.addEventListener('touchend', touchend);
// doc.addEventListener('touchcancel', touchend);

// export let touchHover = {
//     on(){
//         touchHoverOn = true;
//     },
//     off(){
//         touchHoverOn = false;
//     }
// };

const doc: HTMLElement = document.documentElement;

function touchstart(event: TouchEvent) {}
function touchend(event: TouchEvent) {}
function touchcancel(event: TouchEvent) {}

export type HoverOption = {
  allowBubbling: boolean;
  hoverClass: string;
};

export interface Hover {
  isAttach: boolean;
  attach: (option: HoverOption) => void;
  detach: () => void;
}

export const hover: Hover = {
  isAttach: false,
  attach({ allowBubbling = false, hoverClass = "hover" }: HoverOption) {
    if (this.isAttach === false) {
      doc.addEventListener("touchstart", touchstart);
      doc.addEventListener("touchend", touchend);
      doc.addEventListener("touchcancel", touchend);
      this.isAttach = true;
    }
  },

  createAttach(){
    
  },

  detach() {
    if (this.isAttach === true) {
      doc.removeEventListener("touchstart", touchstart);
      doc.removeEventListener("touchend", touchend);
      doc.removeEventListener("touchcancel", touchend);
      this.isAttach = false;
    }
  }
};
