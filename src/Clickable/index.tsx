import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
} from 'react';
import { is } from '../utils/is';

/**
 * 可触摸元素的属性，兼容PC
 */
export interface ClickableProps extends React.HTMLProps<HTMLDivElement> {
  // 包裹元素的子元素
  children?: React.ReactNode;
  // 是否允许冒泡
  bubble?: boolean;
  // 激活时的类
  activeClassName?: string;
  // 激活时的样式
  activeStyle?: React.CSSProperties;
  // 禁用点击态行为
  disable?: boolean;
  // touchmove 取消 active 的位移阈值（px），默认 10
  moveThreshold?: number;
}

export function Clickable(props: Partial<ClickableProps>) {
  let {
    children,
    bubble = true,
    className,
    activeClassName,
    style,
    activeStyle,
    disable = false,
    moveThreshold = 10,
    ...attrs
  } = props;

  // 如果激活样式和激活类都不存在，则设置激活默认样式
  const finalActiveStyle = React.useMemo(() => {
    if (!activeClassName && !activeStyle) {
      return { opacity: 0.6 };
    }
    return activeStyle;
  }, [activeClassName, activeStyle]);

  const touchable = is('touchable');
  const [isActive, setIsActive] = useState(false);

  // 标记是否正处于触摸/按下状态
  const touchRef = useRef(false);
  // 是否已挂载（防止卸载后更新 state）
  const mountedRef = useRef(true);
  // 记录触摸起始坐标，用于 touchmove 取消
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const activate = useCallback(() => {
    if (mountedRef.current) setIsActive(true);
  }, []);

  const deactivate = useCallback(() => {
    if (mountedRef.current) setIsActive(false);
  }, []);

  const onTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (!touchRef.current) {
        touchRef.current = true;
        if (!bubble) event.stopPropagation();
        const touch = event.touches[0];
        startPos.current = { x: touch.clientX, y: touch.clientY };
        activate();
      }
    },
    [bubble, activate]
  );

  const onTouchMove = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (touchRef.current) {
        const touch = event.touches[0];
        const dx = touch.clientX - startPos.current.x;
        const dy = touch.clientY - startPos.current.y;
        if (dx * dx + dy * dy > moveThreshold * moveThreshold) {
          touchRef.current = false;
          deactivate();
        }
      }
    },
    [moveThreshold, deactivate]
  );

  const onTouchEnd = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (touchRef.current) {
        touchRef.current = false;
        if (!bubble) event.stopPropagation();
        deactivate();
      }
    },
    [bubble, deactivate]
  );

  const onMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // 只响应鼠标左键
      if (event.button !== 0) return;
      if (!touchRef.current) {
        touchRef.current = true;
        if (!bubble) event.stopPropagation();
        activate();
      }
    },
    [bubble, activate]
  );

  const onMouseUp = useCallback(() => {
    if (touchRef.current) {
      touchRef.current = false;
      deactivate();
    }
  }, [deactivate]);

  // PC 环境：在 document 上监听 mouseup，处理鼠标移出元素后释放的场景
  useEffect(() => {
    if (!disable && !touchable) {
      const doc = document.documentElement;
      doc.addEventListener('mouseup', onMouseUp);
      return () => {
        doc.removeEventListener('mouseup', onMouseUp);
      };
    }
  }, [disable, touchable, onMouseUp]);

  // 根据激活状态计算最终的 className 和 style
  const finalClassName = isActive && typeof activeClassName === 'string'
    ? (typeof className === 'string' ? `${className} ${activeClassName}` : activeClassName)
    : className;

  const finalStyle = isActive && typeof finalActiveStyle === 'object'
    ? (typeof style === 'object' ? { ...style, ...finalActiveStyle } : finalActiveStyle)
    : style;

  const fullAttrs: React.HTMLProps<HTMLDivElement> = {
    ...attrs,
    className: finalClassName,
    style: finalStyle,
  };

  // 非禁用状态有点击态行为
  if (!disable) {
    if (touchable) {
      fullAttrs.onTouchStart = onTouchStart;
      fullAttrs.onTouchMove = onTouchMove;
      fullAttrs.onTouchEnd = onTouchEnd;
      fullAttrs.onTouchCancel = onTouchEnd;
    } else {
      fullAttrs.onMouseDown = onMouseDown;
    }
  }

  return <div {...fullAttrs}>{children}</div>;
}
