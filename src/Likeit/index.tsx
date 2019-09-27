/** @jsx jsx */
import { jsx } from "@emotion/core";
import { is } from "../is";
import { css as rawCss } from "emotion";
import { style } from "./style";
import { compat } from "../compat";
import React from "react";
import ReactDOM from "react-dom";

const defaultEffect = (
  <span css={style.defaultSVGContainer}>
    <svg viewBox="0 0 24 24">
      <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
    </svg>
  </span>
);

/**
 * 点赞效果
 * @param target string | HTMLElement 点赞的目标
 * @param effect React.ReactNode 点赞的效果元素
 * @param onEnd ()=>void  效果结束时可以传递回调
 */
export function Likeit(
  target: string | HTMLElement,
  effect?: React.ReactNode,
  onEnd?: () => {}
) {
  let likeTarget: HTMLElement | null = null;
  if (is.string(target)) {
    likeTarget = document.querySelector(target);
  } else if (is.element(target)) {
    likeTarget = target;
  }

  if (!is.element(likeTarget)) {
    throw new Error(`Like target does not exist`);
  }

  let likeEffect: React.ReactNode = defaultEffect;
  if (effect) {
    likeEffect = effect;
  }

  // 前置更新目标元素的样式属性
  const position = window.getComputedStyle(likeTarget!).position;
  if (position === "static") {
    likeTarget!.classList.add(
      rawCss({
        position: "relative"
      })
    );
  }

  // 向目标点击点赞容器中插入元素
  const container = document.createElement("div");
  container.classList.add(style.fadeOutEffect);

  // 点赞动画结束，销毁点赞效果元素
  container.addEventListener((compat as any).animationend, () => {
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
    is.function(onEnd) && onEnd();
  });

  // 点赞效果插入到元素中
  ReactDOM.render(<React.Fragment>{likeEffect}</React.Fragment>, container);
  likeTarget!.appendChild(container);
}
