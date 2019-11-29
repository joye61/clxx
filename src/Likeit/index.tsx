/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useRef, useState } from "react";
import { style } from "./style";
import React from "react";

export interface LikeitProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  children?: React.ReactNode;
  effect?: React.ReactNode;
  once?: boolean;
  onEnd?: () => void;
}

export interface EffectMap {
  [key: string]: React.ReactNode;
}

export function Likeit(props: LikeitProps) {
  const {
    children,
    effect = (
      <svg viewBox="0 0 24 24" css={style.defaultSVGContainer}>
        <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
      </svg>
    ),
    once = true,
    onEnd,
    onClick,
    ...attributes
  } = props;

  const [map, setMap] = useState<EffectMap>({});
  const [clicked, setClicked] = useState<boolean>(false);
  const uniqid = useRef<number>(0);

  /**
   * 点击元素时触发
   */
  const clickEffect = (event: React.MouseEvent<any>) => {
    // 首先触发点击
    typeof onClick === "function" && onClick(event);

    // 处理动画逻辑
    if (once && clicked) {
      return;
    }
    uniqid.current += 1;
    setMap({ ...map, [uniqid.current]: effect });
    setClicked(true);
  };

  /**
   * 每次动画执行完成时的回调
   * @param key
   */
  const animationEnd = (key: string | number) => {
    delete map[key];
    setMap({ ...map });
    if (typeof onEnd === "function") {
      onEnd();
    }
  };

  const list: React.ReactNode[] = [];
  for (let key in map) {
    list.push(
      <div
        css={style.effectContainer}
        key={key}
        onAnimationEnd={() => animationEnd(key)}
      >
        {map[key]}
      </div>
    );
  }

  return (
    <div css={style.container} onClick={clickEffect} {...attributes}>
      {children}
      {list}
    </div>
  );
}
