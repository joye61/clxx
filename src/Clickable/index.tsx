import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  CSSProperties,
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
    ...attrs
  } = props;

  // 如果激活样式和激活类都不存在，则设置激活默认样式
  // 使用 useMemo 避免每次渲染都创建新对象
  const defaultActiveStyle = React.useMemo(() => {
    if (!activeClassName && !activeStyle) {
      return { opacity: 0.6 };
    }
    return activeStyle;
  }, [activeClassName, activeStyle]);

  const finalActiveStyle = defaultActiveStyle || activeStyle;

  const touchable = is('touchable');
  const [isActive, setIsActive] = useState(false);

  // 标记是否正处于触摸状态
  const touchRef = useRef<boolean>(false);
  const onStart = (
    event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    if (!touchRef.current) {
      touchRef.current = true;
      // 阻止冒泡
      if (!bubble) {
        event.stopPropagation();
      }
      setIsActive(true);
    }
  };

  const onEnd = useCallback<() => void>(() => {
    if (touchRef.current) {
      touchRef.current = false;
      setIsActive(false);
    }
  }, []);

  // PC环境释放逻辑
  useEffect(() => {
    if (!disable && !touchable) {
      const doc = document.documentElement;
      doc.addEventListener('mouseup', onEnd);
      return () => {
        doc.removeEventListener('mouseup', onEnd);
      };
    }
  }, [disable, touchable, onEnd]);

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
      // 当前如果是触摸环境
      fullAttrs.onTouchStart = onStart;
      fullAttrs.onTouchEnd = onEnd;
      fullAttrs.onTouchCancel = onEnd;
    } else {
      fullAttrs.onMouseDown = onStart;
    }
  }

  return <div {...fullAttrs}>{children}</div>;
}
