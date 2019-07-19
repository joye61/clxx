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

// 全局配置
let isAttach: boolean = false;
let _allowBubbling: boolean = false;
let _defaultHoverClass: string = "hover";

function touchstart(event: TouchEvent) {
  
}
function touchend(event: TouchEvent) {}
function touchcancel(event: TouchEvent) {}

export type HoverOption = {
  allowBubbling: boolean;
  defaultHoverClass: string;
};

export interface Hover {
  attach: (option: HoverOption) => void;
  detach: () => void;
}

export const hover: Hover = {
  attach({ allowBubbling = false, defaultHoverClass = "hover" }: HoverOption) {
    // 设置全局公共配置
    _allowBubbling = allowBubbling;
    _defaultHoverClass = defaultHoverClass;

    // 绑定全局事件监听
    if (isAttach === false) {
      doc.addEventListener("touchstart", touchstart);
      doc.addEventListener("touchend", touchend);
      doc.addEventListener("touchcancel", touchend);
      isAttach = true;
    }
  },

  detach() {
    if (isAttach === true) {
      doc.removeEventListener("touchstart", touchstart);
      doc.removeEventListener("touchend", touchend);
      doc.removeEventListener("touchcancel", touchend);
      isAttach = false;
    }
  }
};
