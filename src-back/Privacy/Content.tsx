import React from 'react';
import { replaceRange, replaceWithoutHeadTail } from './string';

export interface ContentProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  // 待替换的字符串内容
  children?: string;
  /**
   * include：替换start和end之间的内容
   * exclude: 替换除了开头start长度和结尾end长度的内容
   */
  type?: 'include' | 'exclude';
  // 替换的占位符，默认*
  placeholder?: string;
  // 开始位置
  start?: number;
  // 结束位置
  end?: number;
}

/**
 * 隐私化内容组件
 * @param props
 */
export function Content(props: ContentProps) {
  let {
    type = 'include',
    placeholder = '*',
    start,
    end,
    children = '',
    ...attrs
  } = props;

  let content = children;

  // 只有内容为字符串时才做隐私化处理
  if (typeof children === 'string') {
    if (type === 'include') {
      content = replaceRange(children, placeholder, start, end);
    } else if (type === 'exclude') {
      content = replaceWithoutHeadTail(children, placeholder, start, end);
    }
  }

  return <span {...attrs}>{content}</span>;
}
