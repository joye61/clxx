/** @jsx jsx */
import { jsx, ObjectInterpolation } from "@emotion/core";
import { is } from "@clxx/base";
import { useState, useRef } from "react";
import { useEffectOnce } from "@clxx/effect";

export interface ClickableProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  children?: React.ReactNode;
  /**
   * 是否允许冒泡，即允许点击穿透
   */
  canBubble?: boolean;
  /**
   * 当按钮被点击激活时的样式
   */
  activeStyle?: ObjectInterpolation<any>;
}

export interface EventBindingMap {
  [key: string]: (event: React.TouchEvent & React.MouseEvent) => void;
}

export function Clickable(props: ClickableProps) {
  const {
    children,
    canBubble = false,
    activeStyle = {
      opacity: 0.5
    },
    onClick = () => undefined,
    ...attributes
  } = props;

  /**
   * 元素的样式
   */
  const [style, setStyle] = useState<ObjectInterpolation<any> | undefined>(
    undefined
  );

  /**
   * 容器元素的引用
   */
  const container = useRef<HTMLDivElement>(null);
  /**
   * 是否是激活状态
   */
  const active = useRef<boolean>(false);

  const handleStart = (event: React.MouseEvent | React.TouchEvent) => {
    if (!active.current) {
      active.current = true;
      if (!canBubble) {
        event.stopPropagation();
      }

      setStyle({ ...activeStyle });
    }
  };

  const handleEnd = (
    x: number,
    y: number,
    event: React.MouseEvent | React.TouchEvent
  ) => {
    if (active.current) {
      // 获取鼠标弹起时的元素
      const endElement = document.elementFromPoint(x, y);
      // 只有当触摸结束时在目标元素上才触发事件
      if (container.current!.contains(endElement)) {
        onClick(event as any);
      }
    }

    active.current = false;
    setStyle(undefined);
  };

  const eventBinding: EventBindingMap = {};
  if (is.touchable()) {
    /**
     * 触摸环境逻辑处理
     */
    eventBinding.onTouchStart = handleStart as any;
    const onEnd = (event: React.TouchEvent) => {
      const touch = event.changedTouches[0];
      handleEnd(touch.clientX, touch.clientY, event as any);
    };
    eventBinding.onTouchEnd = onEnd;
    eventBinding.onTouchCancel = onEnd;
  } else {
    /**
     * 非触摸环境逻辑处理
     */
    eventBinding.onMouseDown = handleStart as any;
  }

  useEffectOnce(() => {
    /**
     * 鼠标在目标中按下，但移开目标时弹起，目标不会触发mouseup事件
     * 这一点根touchend有区别
     */
    if (!is.touchable()) {
      const mosueup = (event: MouseEvent) => {
        handleEnd(event.clientX, event.clientY, event as any);
      };
      document.documentElement.addEventListener("mouseup", mosueup);

      return () => {
        document.documentElement.removeEventListener("mouseup", mosueup);
      };
    }
  });

  return (
    <div css={style} {...eventBinding} {...attributes} ref={container}>
      {children}
    </div>
  );
}
