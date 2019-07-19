"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var doc = document.documentElement;
var isAttach = false;
var isTouch = false;
var targetList = [];
var _allowBubbling = false;
var _defaultHoverClass = "hover";
function getTargetList(element) {
    if (element === doc || element === null) {
        return [];
    }
    var list = [];
    if (element.dataset.hover !== undefined) {
        list.push(element);
        if (!_allowBubbling) {
            return list;
        }
    }
    list.push.apply(list, getTargetList(element.parentElement));
    return list;
}
function touchstart(event) {
    if (!isTouch) {
        if (event.touches.length > 1) {
            return;
        }
        targetList = getTargetList(event.touches[0].target);
        targetList.forEach(function (element) {
            element.classList.add(element.dataset.hover || _defaultHoverClass);
        });
        isTouch = true;
    }
}
function touchend(event) {
    if (isTouch) {
        targetList.forEach(function (element) {
            element.classList.remove(element.dataset.hover || _defaultHoverClass);
        });
        targetList = [];
        isTouch = false;
    }
}
exports.hover = {
    attach: function (_a) {
        var _b = _a.allowBubbling, allowBubbling = _b === void 0 ? false : _b, _c = _a.defaultHoverClass, defaultHoverClass = _c === void 0 ? "hover" : _c;
        _allowBubbling = allowBubbling;
        _defaultHoverClass = defaultHoverClass;
        if (isAttach === false) {
            doc.addEventListener("touchstart", touchstart);
            doc.addEventListener("touchend", touchend);
            doc.addEventListener("touchcancel", touchend);
            isAttach = true;
        }
    },
    detach: function () {
        if (isAttach === true) {
            doc.removeEventListener("touchstart", touchstart);
            doc.removeEventListener("touchend", touchend);
            doc.removeEventListener("touchcancel", touchend);
            isAttach = false;
        }
    }
};
